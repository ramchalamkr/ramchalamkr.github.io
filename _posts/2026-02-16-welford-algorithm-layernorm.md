---
layout: post
title: "Welford's Algorithm: The Hidden Numerical Trick in LayerNorm"
date: 2026-02-16 00:01:00 -0500
description: When to use Welford's Algorithm?
tags: numerical-stability GPU-kernels PyTorch Triton LayerNorm
categories: technical-deep-dive
giscus_comments: false
related_posts: false
toc:
  sidebar: left
---

When computing layernorm, we need to compute the mean and variance. Seems straightforward enough right? Turns out, **the naive approach can fail** in floating-point arithmetic, returning **wrong variance**!

In this post, we'll explore:
1. **The numerical instability problem** with naive variance computation
2. **Three approaches** to computing variance and when each fails
3. **Welford's algorithm** - a one-pass, numerically stable solution
4. **Pros, cons, and when to use each approach**

---

## The Problem: When Variance Computation Breaks

LayerNorm normalizes each sample's features using:

```python
y = (x - mean) / sqrt(variance + eps)
```

Simple enough, right? But how do you compute `mean` and `variance` without losing precision?

### A Concrete Failure Example

Let's consider this example:

```python
# Data: mean ≈ 1e8, variance ≈ 1.0
data = [100000000.0, 100000000.1, 100000000.2, ...]

# Expected variance: ~1.0
# Naive computation: -28.0  ← WRONG Variance!
```

```python
import random
random.seed(100)

large_mean = 1e8
true_std = 1.0
data = [large_mean + random.gauss(0, true_std) for _ in range(1000)]

# Naive formula: E[X²] - (E[X])²
def naive_variance(data):
    n = len(data)
    mean = sum(data) / n
    mean_sq = sum(x * x for x in data) / n
    return mean_sq - mean**2

print(f"Variance: {naive_variance(data)}")
# Output: -28.0  ← failure!
```

**Why?** We're subtracting two huge, almost identical numbers:
- `E[X²]` ≈ `9999999996346138.0`
- `(E[X])²` ≈ `9999999996346166.0`
- Difference = only a few significant digits remain
- Float precision loss → wrong answer!

---

## Multiple Approaches to Computing Variance

### Approach 1: Computational Formula (One-Pass, Unstable)

**Formula**: `Variance = E[X²] - (E[X])²`

```python
def computational_formula_variance(data):
    """One-pass (optimal) but numerically UNSTABLE"""
    n = len(data)
    sum_x = sum(data)
    sum_x2 = sum(x * x for x in data)
    mean = sum_x / n
    mean_sq = sum_x2 / n
    return mean_sq - mean * mean  # Problem
```

**Pros:**
- ✅ Single pass over data
- ✅ Minimal memory

**Cons:**
- ❌ **Numerically unstable** when `variance << mean²`
- ❌ Fails with FP16/FP8

**When to use:** Never in production!

---

### Approach 2: Definitional Formula (Two-Pass, Stable)

**Formula**: `Variance = Σ(x - μ)² / n`

```python
def standard_def_formula_variance(data):
    """Two-pass but numerically STABLE"""
    n = len(data)
    # Pass 1: Compute mean
    mean = sum(data) / n
    # Pass 2: Compute variance
    var = sum((x - mean)**2 for x in data) / n
    return var
```

**Why it's stable:** You compute deviations `(x - mean)` first, which are small numbers even when `x` is large.

**Example:**
```python
data = [1e8, 1e8 + 0.1, 1e8 + 0.2]
deviations = [-0.1, 0.0, +0.1]  # Small numbers!
variance = sum([0.01, 0.00, 0.01]) / 3 = 0.00667  ✓ Looks good
```

**Pros:**
- ✅ **Numerically stable**
- ✅ Conceptually clear (variance definition)
- ✅ Works well in FP16/FP32

**Cons:**
- ❌ Two passes over data (read data twice, unless the data can stay in memory, in which case it becomes a single pass)
- ❌ Potentially more memory bandwidth usage

**When to use:** Default choice for simplicity and stability

---

### Approach 3: Welford's Algorithm (One-Pass, Stable)

**Key idea:** Update mean and variance incrementally without ever subtracting large numbers.

```python
def welford_variance(data):
    """One-pass AND numerically stable"""
    n = 0
    mean = 0.0
    M2 = 0.0  # Sum of squared deviations
    
    for x in data:
        n += 1              # n is updated in iteration
        delta = x - mean
        mean += delta / n   # mean is updated in every data point
        delta2 = x - mean  # ← Note: using updated mean
        M2 += delta * delta2
    
    return M2 / n
```

**The recurrence formula:**
```
mean_n = mean_{n-1} + (x_n - mean_{n-1}) / n
M2_n = M2_{n-1} + (x_n - mean_{n-1}) × (x_n - mean_n)
```

**Side note**: If this looks familiar, it's the same trick used in online softmax for Flash Attention!

**Why it works:**
- We only work with small deviations `(x - mean)`


**Pros:**
- ✅ **Numerically stable**
- ✅ **Single pass** over data
- ✅ **Parallelizable** via hierarchical merge (multiple blocks can be merged in one go)

**Cons:**
- ❌ A bit more complex to implement
- ❌ Requires parallel merge formula for GPU (cannot use a simple atomic instruction for the merge like split K gemm)
- ❌ Additional overhead

**When to use:**
- Production GPU kernels (FP16/BF16)
- Online statistics
- When hidden dimension > single GPU max block size

## Critical Question: When Do We ACTUALLY Need Welford?

**You might be wondering:** "If my data fits in memory, why not just use the two-pass method?" Good question! The answer depends on *where* it fits in memory—HBM vs SRAM makes all the difference.

### Case 1: Data Fits in SRAM/Registers (Single Block)

**Welford is NOT needed!** ✅

```python
# All data already loaded into fast on-chip memory
x = load_entire_row()  # One memory load from HBM → SRAM

# Two "passes" are just loops in fast memory (SRAM/registers)
mean = sum(x) / N       # Loop 1: super fast
var = sum((x - mean)²) / N  # Loop 2: super fast

# No additional HBM memory bandwidth cost!
# Definitional formula is stable
# This is what Triton does for hidden_dim ≤ 8K
```

**Memory hierarchy:**
```
HBM (slow) → SRAM (fast) → Registers (very fast)
    ↑              ↑              ↑
One load     Two loops      Computations
```

**Takeaway:** If the entire row fits in one GPU block's SRAM, use simple two-pass!

---



### Case 2: Multiple Blocks, Parallel Processing
**Key point**: Even in sequential processing, each block sequentially, it is still useful to use Welford - similar to flash attention approach.

**Welford IS needed!** ✅

```python
# Phase 1: Each block computes local Welford IN PARALLEL (one HBM read per block)
Block 1 (parallel): mean_1, M2_1, n_1 = welford(x[0:4096])  
Block 2 (parallel): mean_2, M2_2, n_2 = welford(x[4096:8192])

# Phase 2: Merge in fast memory (no HBM access!)
global_mean, global_var = welford_merge(
    (mean_1, M2_1, n_1), 
    (mean_2, M2_2, n_2)
)
```

**Benefit:** Only ONE HBM read per block + fast merge in SRAM!

#### Welford's Block Merge Formula

When merging two blocks A and B:

```python
def welford_merge(n_A, mean_A, M2_A, n_B, mean_B, M2_B):
    """Combine two Welford statistics"""
    n_combined = n_A + n_B
    delta = mean_B - mean_A  # Difference between local means
    mean_combined = (n_A * mean_A + n_B * mean_B) / n_combined
    M2_combined = M2_A + M2_B + delta**2 * (n_A * n_B) / n_combined
    return n_combined, mean_combined, M2_combined
```

**Example: Merging two blocks**

```python
# Block A: [10, 12]
n_A = 2
mean_A = 11.0
M2_A = 2.0  # (10-11)² + (12-11)² = 1 + 1 = 2

# Block B: [14, 16]
n_B = 2
mean_B = 15.0
M2_B = 2.0  # (14-15)² + (16-15)² = 1 + 1 = 2

# Merge:
n_combined = 2 + 2 = 4
delta = 15.0 - 11.0 = 4.0
mean_combined = (2*11 + 2*15) / 4 = 52/4 = 13.0
correction = 4² * (2*2) / 4 = 16 * 4 / 4 = 16
M2_combined = 2 + 2 + 16 = 20

# Verify:
# True data: [10, 12, 14, 16]
# True mean: (10+12+14+16)/4 = 13.0 ✓
# True M2: (10-13)² + (12-13)² + (14-13)² + (16-13)² = 9+1+1+9 = 20 ✓
```

**Key insight:** The correction term `delta² * n_A * n_B / n_combined` accounts for the fact that blocks A and B used different local means, not the global mean!

---

**Caveat for Layer Norm**

Here's the catch: even with Welford, you can't avoid two HBM passes for LayerNorm:

```python
### Pass 1: Compute statistics
Block 1: local_mean_1, local_M2_1 = welford(load_chunk_1())  # HBM read #1
Block 2: local_mean_2, local_M2_2 = welford(load_chunk_2())  # HBM read #2

### Merge (fast, in SRAM)
global_mean, global_var = merge(stats_1, stats_2)

### Pass 2: Normalize (MUST re-read data from HBM!)
Block 1: y_1 = normalize(load_chunk_1(), global_mean, global_var)  # HBM read #3
Block 2: y_2 = normalize(load_chunk_2(), global_mean, global_var)  # HBM read #4

### Total: 2 HBM reads per block + 1 HBM write per block
```
**The problem**: After computing statistics with Welford, the data is GONE from SRAM (limited capacity). You MUST re-read it from HBM to normalize!

### Summary: When Do We ACTUALLY Need Welford?

| Scenario | Need Welford? | Reason |
|----------|---------------|--------|
| **Single block (data in SRAM)** | ❌ NO | Two-pass in fast memory is perfect |
| **Multiple blocks, parallel** | ✅ YES | Need merge formula to combine stats correctly |
| **Streaming/online data** | ✅ YES | Can't store all data |

**Key insight:** Modern Triton skips Welford because **hidden_dim ≤ 8K fits in one block**. No multiple blocks → no merge needed → simple two-pass wins!

---

<!-- ## Parallel Welford: How can we do it in production?

**Key insight:** we CAN'T just run Welford serially on GPU - that would destroy parallelism!

### The Solution: Compute Local + Merge

**Phase 1:** Each thread computes local Welford for its chunk (parallel!) (this assumes we have done block split across the columns)
```python
Thread 0: elements [0:256]    → (mean_0, M2_0, count_0)
Thread 1: elements [256:512]  → (mean_1, M2_1, count_1)
Thread 2: elements [512:768]  → (mean_2, M2_2, count_2)
...
```

**Phase 2:** Hierarchically merge statistics using **Parallel Welford Merge**:
Key point: This is similar to the GEMM all reduce that needs to be done when we do split-K matmul in distributed inference
```python
def parallel_welford_merge(n_a, mean_a, M2_a, n_b, mean_b, M2_b):
    """Combine two Welford statistics"""
    n = n_a + n_b
    delta = mean_b - mean_a
    mean = (n_a * mean_a + n_b * mean_b) / n
    M2 = M2_a + M2_b + delta**2 * n_a * n_b / n
    return n, mean, M2
```

**Tree reduction:**
```
Level 1: merge(stats_0, stats_1), merge(stats_2, stats_3), ...
Level 2: merge(stats_01, stats_23), ...
Final:   single (mean, variance) for the entire row
```

**Still parallel!** Log(n) merge steps with full SIMD/vectorization within each thread. -->

---

## Production Implementations

### PyTorch CUDA: Uses Welford's Algorithm

**Source code:**
- **File:** `pytorch/aten/src/ATen/native/cuda/layer_norm_kernel.cu`
- **Link:** [PyTorch LayerNorm CUDA Kernel](https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/cuda/layer_norm_kernel.cu)


### Triton: Uses Two-Pass (Definitional Formula)

**Source:** [Triton LayerNorm Tutorial](https://github.com/triton-lang/triton/blob/main/python/tutorials/05-layer-norm.py)

The official Triton tutorial uses a two-pass approach — simple and stable enough when hidden_dim fits in one block.

### When Welford Becomes Critical

**Use Welford when:**
- ❗ Using FP8 or lower precision
- ❗ Hidden dimension > 16K (requires tiling)
- ❗ Extreme data distributions (variance << mean²)

**Skip Welford when:**
- ✅ Hidden dim ≤ 8K (fits in one block)
- ✅ FP32 precision

---

## Triton Implementations

To make this concrete, here are two Triton kernels — one naive single-block implementation, and one tiled Welford version for larger hidden dimensions.

### Naive (Single-Block)

Assumes the entire row fits in one block's SRAM. Two passes happen in fast memory — no extra HBM cost.

```python
@triton.jit
def layernorm_kernel(
    x_ptr, output_ptr, weight_ptr, bias_ptr,
    M, N, eps, stride_m, stride_n,
    BLOCK_N: tl.constexpr,
):
    """
    Single-block LayerNorm. Assumes N <= BLOCK_N (e.g., hidden_dim <= 8K).
    Loads the entire row once into SRAM — mean and variance are computed from
    registers, so this is effectively a single HBM pass.
    """
    pid_m = tl.program_id(axis=0)
    offset_n = tl.arange(0, BLOCK_N)
    mask = offset_n < N
    offset = pid_m * stride_m + offset_n * stride_n
    x = tl.load(x_ptr + offset, mask=mask, other=0.0)

    mean = tl.sum(x, axis=0) / N
    centered = tl.where(mask, x - mean, other=0.0)
    var = tl.sum((centered * centered)) / N
    x_norm = (x - mean) / tl.sqrt(var + eps)

    w = tl.load(weight_ptr + offset_n, mask=mask, other=0.0)
    bias = tl.load(bias_ptr + offset_n, mask=mask, other=0)
    out = x_norm * w + bias
    tl.store(output_ptr + pid_m * stride_m + offset_n * stride_n, out, mask=mask)
```

### Tiled Welford

For when hidden_dim > BLOCK_N. 
Pass 1 streams through the tiles computing Welford stats and merging them. Pass 2 normalizes.

```python
@triton.jit
def layernorm_kernel_welford(
    x_ptr, output_ptr, weight_ptr, bias_ptr,
    M, N, eps, stride_m, stride_n,
    BLOCK_N: tl.constexpr,
):
    """
    Tiled LayerNorm with Welford's algorithm. Works for any N.
    Pass 1: compute global mean/variance via Welford merge across tiles.
    Pass 2: normalize using global stats (requires re-reading from HBM).
    """
    pid_m = tl.program_id(axis=0)
    n_total = 0.0
    mean_combined = 0.0
    M2_combined = 0.0

    num_blocks = tl.cdiv(N, BLOCK_N)
    offset_n = tl.arange(0, BLOCK_N)

    for b in range(num_blocks):
        offset = pid_m * stride_m + (b * BLOCK_N + offset_n) * stride_n
        col_start = b * BLOCK_N
        mask = col_start + offset_n < N
        x_tile = tl.load(x_ptr + offset, mask=mask, other=0.0)

        n_block = tl.sum(tl.where(mask, 1.0, 0.0), axis=0)
        mean_block = tl.sum(tl.where(mask, x_tile, 0.0), axis=0) / tl.maximum(n_block, 1.0)
        centered = tl.where(mask, x_tile - mean_block, 0.0)
        M2_block = tl.sum(centered * centered, axis=0)

        # Welford merge: combines local block stats into running global stats
        delta = mean_block - mean_combined
        n_new = n_total + n_block
        n_new_safe = tl.maximum(n_new, 1.0)
        mean_combined = (n_block * mean_block + n_total * mean_combined) / n_new_safe
        M2_combined = M2_block + M2_combined + (delta * delta * n_total * n_block) / n_new_safe
        n_total = n_new

    var = M2_combined / N

    # Pass 2: normalize (must re-read tiles from HBM)
    for b in range(num_blocks):
        offset = pid_m * stride_m + (b * BLOCK_N + offset_n) * stride_n
        col_start = b * BLOCK_N
        mask = col_start + offset_n < N
        w = tl.load(weight_ptr + col_start + offset_n, mask=mask, other=0.0)
        bias = tl.load(bias_ptr + col_start + offset_n, mask=mask, other=0.0)
        x_tile = tl.load(x_ptr + offset, mask=mask, other=0.0)
        x_norm = (x_tile - mean_combined) / tl.sqrt(var + eps)
        out = x_norm * w + bias
        tl.store(output_ptr + offset, out, mask=mask)
```

The reloading of the tiles in Pass 2 is unavoidable — once the SRAM is full of the next tile, the previous tile's data is gone. This is the HBM bandwidth cost of tiling, regardless of whether you use Welford or naive two-pass.

---

## References

1. **PyTorch LayerNorm CUDA Source:**  
   [github.com/pytorch/pytorch/.../layer_norm_kernel.cu](https://github.com/pytorch/pytorch/blob/main/aten/src/ATen/native/cuda/layer_norm_kernel.cu)

2. **Triton LayerNorm Tutorial:**  
   [triton-lang.org/main/tutorials/05-layer-norm](https://github.com/triton-lang/triton/blob/main/python/tutorials/05-layer-norm.py)
3. **Welford's Original Paper (1962):**  
   Welford, B. P. "Note on a Method for Calculating Corrected Sums of Squares and Products" 


---

*This post is part of my ongoing exploration of GPU kernel optimization and numerical stability in deep learning. Code examples and comparisons developed with AI assistance.*
