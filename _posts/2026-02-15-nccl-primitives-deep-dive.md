---
layout: post
title: NCCL Primitives Deep Dive
date: 2026-02-15 00:01:00 -0500
description: Understanding All-Gather, Ring All-Reduce, and All-to-All communication primitives in LLMs
tags: distributed-training NCCL LLM MoE communication
categories: technical-deep-dive
giscus_comments: false
related_posts: false
toc:
  sidebar: left
---

When you're training a 70B parameter LLM across 128 GPUs, every single GPU needs to coordinate with others. Whether it's gathering weights, summing gradients, or routing tokens to experts in an MoE architecture, **efficient communication is the bottleneck that determines if your training is rapid or not**.

In this post, we'll dive deep into **3 critical NCCL primitives** that power modern distributed training:

1. **All-Gather** → Weight gathering across GPUs (tensor parallelism)
2. **Ring All-Reduce** → Gradient aggregation (data parallelism)
3. **All-to-All** → MoE token/output passing (expert parallelism)

We'll analyze the bandwidth requirements, walk through step-by-step examples, and show pseudo code to build intuition.

---

## Why These Primitives Matter


Modern LLM training uses different parallelism strategies:
- **Tensor Parallelism**: Shard model weights across GPUs → needs All-Gather
- **Data Parallelism**: Each GPU has full model, processes different batches → needs All-Reduce for gradients
- **Expert Parallelism (MoE)**: Experts on different GPUs, tokens routed dynamically → needs All-to-All

Each strategy has different communication patterns, and using the wrong primitive is a recipe for disaster.

---

## 1. All-Gather: Weight Gathering Across GPUs

### The Use Case

In **tensor parallelism** or **FSDP Zero 3 variant**, model weights are sharded across multiple GPUs. For example, a large linear layer might be split so each GPU holds `1/N` of the weight matrix. During the forward pass, each GPU needs the **complete weight matrix** to compute its output.

**The Problem**: How do we efficiently gather all shards on every GPU?

### Naive Approach: The Bottleneck

The naive solution: Have each GPU send its shard to every other GPU.

```text
# Pseudo-code for naive all-gather
for each GPU i:
    for each other GPU j (j != i):
        send shard_i to GPU_j
```

**Communication per GPU**: Each GPU sends `M/N` data to `N-1` other GPUs = `M(N-1)/N` data sent.

**The Bottleneck**: What if all GPUs send simultaneously → network congestion! Also, each GPU must handle `N-1` separate send operations.

### Ring All-Gather: The Elegant Solution

The ring pattern in distributed systems is an architecture where nodes are organized in a logical or physical circle, with each node connecting to exactly two neighbors.

In a **ring topology**, GPUs form a logical ring: `GPU_0 → GPU_1 → GPU_2 → ... → GPU_{N-1} → GPU_0`

**Algorithm** (for `N` GPUs, each with shard of size `M/N`):

```text
Step 0: Each GPU has its own shard
Step 1: Pass shard to right neighbor (receive from left)
Step 2: Pass newly received shard to right neighbor
...
Step N-1: Complete after N-1 steps
```

After `N-1` steps, every GPU has accumulated all N shards.

**Communication Analysis**:
- Each step: Send `M/N` data
- Total steps: `N-1`
- Every GPU: Data sent and received per step is `M/N`
- **Total data sent per GPU**: `M(N-1)/N`
- **Bandwidth utilization**: Every link used simultaneously, no bottleneck!

### Step-by-Step Example (4 GPUs)



```text
Initial state:
GPU_0: [A, _, _, _]
GPU_1: [_, B, _, _]
GPU_2: [_, _, C, _]
GPU_3: [_, _, _, D]

Step 1: GPU_i sends to GPU_{(i+1)%4}
GPU_0: [A, _, _, D]
GPU_1: [A, B, _, _]
GPU_2: [_, B, C, _]
GPU_3: [_, _, C, D]

Step 2: GPU_i sends the new shard again to GPU_{(i+1)%4}
GPU_0: [A, _, C, D]
GPU_1: [A, B, _, D]
GPU_2: [A, B, C, _]
GPU_3: [_, B, C, D]

Step 3: Repeat
GPU_0: [A, B, C, D]
GPU_1: [A, B, C, D]
GPU_2: [A, B, C, D]
GPU_3: [A, B, C, D]

```
Compared to the naive approach, the total data sent per GPU remains the same `M(N-1)/N`


### Pseudo Code

```python
import numpy as np

def ring_all_gather(shard, rank, num_gpu):
    """
    Ring All-Gather pseud code, for each GPU rank
    
    Args:
        shard: Local shard of size (M/N,) on this GPU
        rank: Current GPU rank (0 to world_size-1)
        num_gpu: Total number of GPUs (N)
    
    Returns:
        gathered: Complete data of size (M,) with all shards
    """

    # Initialize buffer to hold all shards (M/N)
    shard_size = len(shard) #[4x1]
    gathered = np.zeros(shard_size * num_gpu)   #[16x1]
    
    # Place local shard in correct position
    gathered[rank * shard_size:(rank + 1) * shard_size] = shard
    
    # Ring all-gather: N-1 steps
    for step in range(num_gpu - 1):
        # Which shard to send in this step?
        send_idx = (rank - step) % num_gpu
        
        # Simulate send/receive with neighbors
        send_shard = gathered[send_idx * shard_size : (send_idx+1) * shard_size]

        # A conceptual function; Send to the right neighbour, receive from left neighbour
        received_shard = receive_from_left_neighbour(send_shard)
        
        # Place received shard
        recv_idx = (rank - step - 1) % num_gpu
        gathered[recv_idx * shard_size:(recv_idx + 1) * shard_size] = received_shard
        
    return gathered

# Example usage
if __name__ == "__main__":
    # Simulate 4 GPUs, each with a shard
    num_gpu = 4
    data_size = 16
    shard_size = data_size // num_gpu
    
    # Each GPU has different shard
    shards = [
        np.array([1, 1, 1, 1]),  # GPU 0 [4x1]
        np.array([2, 2, 2, 2]),  # GPU 1 [4x1]
        np.array([3, 3, 3, 3]),  # GPU 2 [4x1] 
        np.array([4, 4, 4, 4]),  # GPU 3 [4x1]
    ]
    
    # Each GPU runs all-gather, calls it async.
    for rank in range(num_gpu):
        result = ring_all_gather(shards[rank], rank, num_gpu)
        print(f"GPU {rank} result: {result}")
```

### Why Ring All-Gather Outperforms Naive

Both approaches send/receive the same total data: `M(N-1)/N` per GPU.

**The difference is communication pattern:**
- **Naive**: Each GPU → (N-1) GPUs simultaneously
  - Network interface contention
  - May not align with physical topology
  - Links underutilized or congested

- **Ring**: Each GPU → 1 neighbor at a time
  - Fully pipelined, all links active
  - Maps to physical NVLink topology
  - Optimal bandwidth utilization




---

## 2. Ring All-Reduce: Gradient Aggregation

### The Use Case

In **data parallelism (or FSDP Zero1/2/3)**, each GPU holds a complete copy of the model (or model shards) and processes a different batch of data. After the backward pass, each GPU computes gradients for all parameters. To update the model, we need the **sum of all gradients** on every GPU.

**The Problem**: How do we efficiently sum `N` gradient tensors of size `M` and distribute the result to all GPUs?

### The Parameter Server Bottleneck

At first glance, it seems straightforward: just send everything to a central server, sum it up, and send it back. But if you try that with a 70B parameter model, your central server immediately becomes the bottleneck!

**The Math of the Bottleneck**: 

In a naive setting with a central parameter server:
- Server receives: `M × N` data (gradients from N GPUs)
- Server sends: `M × N` data (summed gradients to N GPUs)

As you add more GPUs, the server's bandwidth requirement **scales linearly**. The system chokes!

This is where **Ring All-Reduce** comes into play.

### Ring All-Reduce: The Two-Phase Solution

Ring All-Reduce combines two primitives:

**Phase 1: Reduce-Scatter**
- Break model gradients into `N` chunks
- After `N-1` steps, each GPU holds the **complete sum** for exactly `1/N` of the parameter gradients

**Phase 2: All-Gather**
- Pass these completed shard sums around the ring
- After `N-1` steps, each GPU has the **full summed gradient**

**Total Communication**: `2M(N-1)/N ≈ 2M` per GPU (almost independent of N!)

### Step-by-Step Reduce-Scatter

Ring All reduce uses a reduce scatter primitive which does exactly as it sounds -> Each GPU reduces its corresponding shard and sends to the neighbour. After `N-1` rounds, each GPU has the completed sum of its shard.

```text
Initial state (4 GPUs, gradients split into 4 chunks):
GPU_0: [A0, B0, C0, D0]
GPU_1: [A1, B1, C1, D1]
GPU_2: [A2, B2, C2, D2]
GPU_3: [A3, B3, C3, D3]

Step 1: GPU_i sends its shard to GPU_{(i+1)%4}, and GPU_{(i+1)%4} accumulates the received shard.

GPU_0: [A0, B0, C0, D0+D3]
GPU_1: [A0+A1, B1, C1, D1]
GPU_2: [A2, B1+B2, C2, D2]
GPU_3: [A3, B3, C2+C3, D3]

Step 2: Repeats
GPU_0: [A0, B0, C0+C2+C3, D0+D3]
GPU_1: [A0+A1, B1, C1, D1+D0+D3]
GPU_2: [A2+A0+A1, B1+B2, C2, D2]
GPU_3: [A3, B3+B1+B2, C2+C3, D3]

Step 3: Repeats
GPU_0: [A0, B0+B3+B1+B2, C0+C2+C3, D0+D3]
GPU_1: [A0+A1, B1, C1+C0+C2+C3, D1+D0+D3]
GPU_2: [A2+A0+A1, B1+B2, C2, D2+D1+D0+D3]
GPU_3: [A3+A2+A0+A1, B3+B1+B2, C2+C3, D3]

Final: After reduce-scatter (Note: The other partials can be ignored / will be overwritten by the all-gather in the next step)
GPU_0: [_, B0+B1+B2+B3, _, _]
GPU_1: [_, _, C1+C0+C2+C3, _]
GPU_2: [_, _, _, D0+D1+D2+D3]
GPU_3: [A0+A1+A2+A3, _, _, _]

```

### Step-by-Step All-Gather

Refer to the previous section by using a ring all-gather approach.

```text
After all-gather, every GPU has:
[A0+A1+A2+A3, B0+B1+B2+B3, C0+C1+C2+C3, D0+D1+D2+D3]
```

**Note**: A keen eyed observer would realize, during the reduce scatter, the initial ownership of the shard has been shifted. 
For example, 
- **Initial ownership**: GPU 0 starts with A0, GPU 1 with B1, etc.
- **Final ownership (after reduce-scatter)**: Chunks rotate, so GPU 0 ends up with sum(B), not sum(A)


### Pseudo Code

```python
import numpy as np

def reduce_scatter(chunks, rank, num_gpu):
    """
    Reduce-Scatter: Each GPU gets sum of one chunk
    
    Args:
        chunks: List of N chunks, each of size M/N
        rank: Current GPU rank
        num_gpu: Total number of GPUs
    
    Returns:
        buffer: returns the full reduced buffer
    """
    chunk_size = len(chunks[0]) #[4]
    buffer = np.concatenate(chunks) #[16x1]

    for step in range(num_gpu-1):
        step_idx = (rank - step) % num_gpu
        send_shard = buffer[step_idx*chunk_size: (step_idx+1)*chunk_size]

        # Simulated function to reduce scatter: Send to right, Receive from left.
        received_shard_sum = reduce_scatter_from_left(send_shard)

        received_idx = (rank - step - 1) % num_gpu
        buffer[received_idx*chunk_size : (received_idx+1)*chunk_size] += received_shard_sum

    return buffer   #[16x1]

def ring_all_reduce(gradient, rank, num_gpu):
    """
    Ring All-Reduce: Sum gradients across all GPUs
    
    Args:
        gradient: Local gradient tensor of size M
        rank: Current GPU rank
        num_gpu: Total number of GPUs
    
    Returns:
        summed_gradient: Sum of all gradients, size M
    """
    
    
    # Step 1: Split gradient into chunks
    chunk_size = len(gradient) // num_gpu   #[16/4 = 4]
    chunks = [gradient[i*chunk_size:(i+1)*chunk_size] for i in range(num_gpu)]
    
    # Step 2: Reduce-scatter phase
    reduced_chunks = reduce_scatter(chunks, rank, num_gpu)
    
    # Step 3: All-gather phase
    summed_gradient = ring_all_gather(reduced_chunks, rank, num_gpu)
    
    return summed_gradient

# Example usage
if __name__ == "__main__":
    # Simulate 4 GPUs, each with gradients
    num_gpu = 4
    gradient_size = 16
    
    gradients = [
        np.ones(gradient_size) * 1,  # GPU 0    [16x1]
        np.ones(gradient_size) * 2,  # GPU 1    [16x1]
        np.ones(gradient_size) * 3,  # GPU 2    [16x1]
        np.ones(gradient_size) * 4,  # GPU 3    [16x1]
    ]
    
    expected_sum = np.ones(gradient_size) * 10  # Sum = 1+2+3+4
    
    for rank in range(num_gpu):
        result = ring_all_reduce(gradients[rank], rank, num_gpu)
        # print(f"GPU {rank} summed gradient: {result}")
```

---

## 3. All-to-All: MoE Token Routing

### The Use Case

In **Mixture of Experts (MoE)** architectures, you have `E` experts distributed across `N` GPUs. During the forward pass:
1. A routing network decides which expert should process each token
2. Tokens need to be **grouped** to the GPU hosting their assigned expert
3. After expert computation, outputs need to be **grouped back**

**The Problem**: Each GPU needs to send different amounts of data to each other GPU (dynamic routing). This is a **gpu specific exchange**.

### Why All-Gather Won't Work


All-Gather assumes every GPU contributes the same amount of data. In MoE, routing is **dynamic**:
- GPU 0 might send 10 tokens to GPU 1, 5 to GPU 2, 0 to GPU 3
- GPU 1 might send 3 tokens to GPU 0, 8 to GPU 2, 4 to GPU 3

We need a primitive that supports **arbitrary dynamic exchange**.

### All-to-All: Personalized Communication

In an **All-to-All** primitive:
- Each GPU has a separate information for every other GPU
- All GPUs simultaneously exchange their specific messages

**Algorithm**:
```text
for each GPU i:
    for each GPU j:
        send message_i_to_j to GPU_j
        receive message_j_to_i from GPU_j
```

**Communication**: In the worst case, if each GPU sends `M/N` tokens to each other GPU, total sent = `M(N-1)/N` per GPU.

**MoE Specifics**:
- Forward pass: All-to-All to route tokens to experts
- Backward pass: All-to-All to route gradients back to original GPUs

**Basic View** All-to-All exchanges data between all GPUs in a group.

```text
Think of data as a matrix where rows = source GPU, columns = destination GPU

Before All-to-All:
       Dest: GPU0  GPU1  GPU2  GPU3
Source GPU0:  A0    A1    A2    A3
       GPU1:  B0    B1    B2    B3
       GPU2:  C0    C1    C2    C3
       GPU3:  D0    D1    D2    D3

After All-to-All (transpose):
       Dest: GPU0  GPU1  GPU2  GPU3
Source GPU0:  A0    B0    C0    D0
       GPU1:  A1    B1    C1    D1
       GPU2:  A2    B2    C2    D2
       GPU3:  A3    B3    C3    D3

```

### Step-by-Step Example (4 GPUs, 8 Experts)


```text
Scenario: 16 tokens, 4 GPUs, 8 experts (2 experts per GPU) 
Data Parallelism + Expert Parallelism

GPU 0: Experts [E0, E1]
GPU 1: Experts [E2, E3]
GPU 2: Experts [E4, E5]
GPU 3: Experts [E6, E7]

Tokens on GPU 0: [T0, T1, T2, T3]
Routing decisions:
  T0 → E2 (GPU 1)
  T1 → E5 (GPU 2)
  T2 → E0 (GPU 0, stays local)
  T3 → E7 (GPU 3)

All-to-All exchange:
  GPU 0 sends: [T0] to GPU 1, [T1] to GPU 2, [T3] to GPU 3
  GPU 0 receives: tokens routed to E0 and E1 from other GPUs


```
***All-to-All*** redistributes tokens from different sequences to the GPUs hosting their assigned experts. This makes sense because:
- GPU 0 has sequence 0's tokens but needs to send them to other experts
- GPU 0 receives tokens from OTHER sequences that need its local experts E0, E1




## Expert Parallelism Flow


**Forward Pass**:

**Step 1: Routing** (local on each GPU)
```python
# Each GPU routes its tokens
router_logits = router(tokens)  # Local
top_k_experts = topk(router_logits, k=2)
```

**Step 2: Dispatch** (All-to-All)
```python
# Group tokens by destination expert
# All-to-All sends tokens to expert's GPU
dispatched_tokens = all_to_all(grouped_tokens)
```

**Step 3: Expert Computation** (local)
```python
# Each GPU processes its experts' tokens
for expert in my_experts:
    expert_output = expert(dispatched_tokens[expert_id])
```

**Step 4: Combine** (All-to-All)
```python
# Send results back to originating GPUs
combined_output = all_to_all(expert_outputs)
```

**Communication cost**: 2 All-to-Alls per MoE layer

---


### Simplified Pseudo Code

```python
def all_to_all_moe(tokens, routing, rank, num_gpus, num_experts):
    """
    All-to-All for MoE token routing
    
    Args:
        tokens: List of token IDs on this GPU
        routing: Expert assignment for each token
        rank: Current GPU rank
        num_gpus: Total number of GPUs
        num_experts: Total number of experts
    
    Returns:
        Tokens this GPU will process after All-to-All
    """
    experts_per_gpu = num_experts // num_gpus
    
    # Group tokens by destination GPU based on expert assignment
    send_to_gpu = {i: [] for i in range(num_gpus)}
    
    for token_id, expert_id in zip(tokens, routing):
        target_gpu = expert_id // experts_per_gpu
        send_to_gpu[target_gpu].append((token_id, expert_id))
    
    # All to ALL will happen here to send and receive the tokens
    
    # For this case, return what this GPU keeps locally + tokens received from all to all for this gpu
    return send_to_gpu[rank]

# Example: GPU 0 in MoE with Data Parallelism
if __name__ == "__main__":
    num_gpus = 4
    num_experts = 8
    
    # GPU 0 has tokens from Sequence 0
    rank = 0
    tokens = [0, 1, 2, 3]  # Token IDs: T0, T1, T2, T3
    routing = [2, 5, 0, 7]  # T0→E2, T1→E5, T2→E0, T3→E7
    
    # Expert distribution across GPUs:
    # GPU 0: E0, E1
    # GPU 1: E2, E3
    # GPU 2: E4, E5
    # GPU 3: E6, E7
    
    local_tokens = all_to_all_moe(tokens, routing, rank, num_gpus, num_experts)
    # GPU 0 keeps: Token 2 for Expert 0
    # GPU 0 receives: Tokens from other GPUs routed to E0, E1
```

---

## Bandwidth Analysis & Comparison



| Primitive | Use Case | Data Sent Per GPU | Bandwidth Scaling |
|-----------|----------|-------------------|------------------|
| **All-Gather** | Weight gathering (TP) | `M(N-1)/N` |  (`~M`) |
| **All-Reduce** | Gradient aggregation (DP) | `2M(N-1)/N` | (`~2M`) |
| **All-to-All** | Token routing (MoE) | Variable, up to `M(N-1)/N` | Depends on routing |

**Key Insight**: All three primitives scale **near-constant** with the number of GPUs!

### All-Gather as a Special Case of All-to-All

**All-Gather is actually a special case of All-to-All** where each GPU sends the **same data** to everyone.

**Example with 4 GPUs:**

```text
Initial state:
GPU 0: [1]
GPU 1: [2]
GPU 2: [3]
GPU 3: [4]

All-Gather behavior:
GPU 0 sends [1] to GPU 1, 2, 3
GPU 1 sends [2] to GPU 0, 2, 3
GPU 2 sends [3] to GPU 0, 1, 3
GPU 3 sends [4] to GPU 0, 1, 2

Result (all GPUs):
[1, 2, 3, 4]
```

**Same result using All-to-All:**
```text
GPU 0 All-to-All send:
  To GPU 0: [1]  (keep local)
  To GPU 1: [1]  (same shard)
  To GPU 2: [1]  (same shard)
  To GPU 3: [1]  (same shard)

GPU 1 All-to-All send:
  To GPU 0: [2]
  To GPU 1: [2]  (keep local)
  To GPU 2: [2]
  To GPU 3: [2]

... (GPU 2, 3 similarly)

Result (all GPUs):
[1, 2, 3, 4]  ✓ Same as All-Gather!
```

**The Difference:**
- **All-Gather**: Everyone sends their shard to everyone (broadcast pattern)
- **All-to-All (MoE)**: Each GPU sends **different, selective data** based on routing
  - GPU 0 might send [T0] to GPU 1, [T1] to GPU 2, [T2] to GPU 3
  - More efficient for sparse, dynamic patterns!





## Conclusion

**The Big Picture**:
- **All-Gather**: Collect sharded data without reduction
- **All-Reduce**: Aggregate (sum) and distribute
- **All-to-All**: Personalized, dynamic exchange

All three use clever topologies (rings) to avoid bottlenecks and utilize full network bandwidth.

---

## References

1. HuggingFace Ultra-Scale Playbook  
   <https://huggingface.co/spaces/weege007/ultrascale-playbook>

2. Machine Learning Systems for Dummies - Abhishek Maiti  
   <https://abhishekmaiti.com/mlsys-for-dummies/>

3. NCCL Overview - NVIDIA  
   <https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/overview.html>

---

*This post is part of my ongoing deep dive into systems-level ML engineering on GPUs. Some diagrams and examples were developed with AI assistance.*