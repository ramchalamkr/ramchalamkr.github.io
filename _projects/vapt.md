---
layout: page
title: "Vulnerability Assessment & Penetration Testing (VAPT)"
permalink: /projects/vapt/
---

# <span class="term-prompt">&gt;</span> gayathri@defendwithgr <span class="term-path">~/projects</span> cat <span class="term-filename">vapt.md</span> <span class="term-cursor">█</span>

**Duration**: Jan 2025 – Apr 2025  
**Type**: Internal Initiative  
**Organization**: Kryptos Technologies (SOC Analyst role)

---

## Overview

While working as a SOC Analyst at Kryptos Technologies, I conducted vulnerability assessments across web applications and internal networks, simulated exploitation using Metasploit, and mapped attack paths to the MITRE ATT&CK framework to understand how far an adversary could realistically get inside the environment.

---

## What Was Done

### Vulnerability Assessment

Ran assessments using **Nmap** and **Nessus** across both web applications and internal network infrastructure — identifying open ports, exposed services, misconfigurations, and known CVEs.

```bash
$ nmap -sV -sC -oN scan_results.txt <target>
$ nessus --scan --policy "Advanced Network Scan" --target <scope>
```

### Exploitation Simulation

Used **Metasploit** to simulate exploitation of identified vulnerabilities in a controlled environment — validating which findings were genuinely exploitable and not just theoretical.

### MITRE ATT&CK Mapping

Mapped confirmed attack paths to MITRE ATT&CK tactics and techniques to understand the realistic adversary perspective: what they could access, how far they could move laterally, and where detection opportunities existed.

### Rules of Engagement

Drafted a **Rules of Engagement (ROE) document** for the company's public-facing website as the defined starting scope, establishing testing boundaries, authorized windows, acceptable techniques, and sign-off requirements before active testing began.

---

## Key Outcomes

- Identified vulnerabilities across web applications and internal network scope
- Validated exploitability through controlled Metasploit simulations — separating real risk from theoretical findings
- Mapped attack paths to MITRE ATT&CK to provide a threat-actor perspective on the environment
- Produced findings with actionable remediation recommendations

---

## Tools & Frameworks

`Nmap` `Nessus` `Metasploit` `Burp Suite` `OWASP ZAP` `OpenVAS` `MITRE ATT&CK`

---

*← [Back to Projects](/projects.html)*
