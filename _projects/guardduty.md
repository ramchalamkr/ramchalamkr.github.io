---
layout: page
title: "Threat Detection with Amazon GuardDuty"
permalink: /projects/guardduty/
---

# <span class="term-prompt">&gt;</span> gayathri@defendwithgr <span class="term-path">~/projects</span> cat <span class="term-filename">guardduty.md</span> <span class="term-cursor">█</span>

**Date**: Jun 2026  
**Type**: Hands-on Lab  
**Platform**: AWS / NextWork

---

## Overview

Hands-on lab focused on threat detection using **Amazon GuardDuty** — AWS's native threat detection service. The lab covered enabling GuardDuty, generating sample findings across multiple threat categories, and working through the investigation and triage process using the underlying telemetry sources.

---

## What Was Done

### Enabling GuardDuty

Enabled Amazon GuardDuty on an AWS account and configured it to monitor across the key data sources: **CloudTrail**, **VPC Flow Logs**, and **DNS logs**.

### Generating & Reviewing Sample Findings

Generated sample findings to practice detecting a range of threat types:

```
$ aws guardduty create-sample-findings --detector-id <id> \
  --finding-types \
    Recon:EC2/PortProbeUnprotectedPort \
    UnauthorizedAccess:EC2/SSHBruteForce \
    Backdoor:EC2/C&CActivity.B \
    Trojan:EC2/BlackholeTraffic
```

Threat categories covered:
- **Reconnaissance** — port probing and network scanning activity
- **EC2 instance compromise** — SSH brute force, unusual instance behavior
- **Communication with known-malicious IPs** — C2 traffic, blackhole traffic indicators

### Investigation & Triage

For each finding, investigated the underlying telemetry to understand what actually happened:

| Finding | Telemetry Source | What It Revealed |
|---------|-----------------|-----------------|
| Port probe activity | VPC Flow Logs | Source IPs, target ports, traffic volume |
| SSH brute force | CloudTrail + VPC Flow Logs | Failed auth attempts, originating IP |
| C2 communication | DNS logs + VPC Flow Logs | Domain queries to known-malicious infrastructure |

Reviewed severity levels, finding types, and the raw event data behind each alert — the same workflow used in a real SOC triage process.

---

## Key Outcomes

- Configured GuardDuty from scratch and validated it was ingesting all three telemetry sources
- Practiced distinguishing finding types by severity and understanding what each alert means operationally
- Worked through the investigation workflow: finding → telemetry → root cause — the same process used when triaging real GuardDuty alerts in a production environment

---

## Tools & Services

`Amazon GuardDuty` `AWS CloudTrail` `VPC Flow Logs` `DNS Logs` `AWS Console` `Threat Detection` `Alert Triage`

---

*← [Back to Projects](/projects.html)*
