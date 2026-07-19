---
layout: page
title: "NYPD 99th Precinct – Security Governance"
permalink: /projects/wicys-grc/
---

# <span class="term-prompt">&gt;</span> gayathri@defendwithgr <span class="term-path">~/projects</span> cat <span class="term-filename">wicys-grc.md</span> <span class="term-cursor">█</span>

**Duration**: Feb 2026 – Jun 2026  
**Program**: WiCyS GRC Intensive  
**Case Study**: NYPD 99th Precinct — 99-CMTOS System

---

## Overview

As part of the **WiCyS (Women in CyberSecurity) GRC Intensive**, I delivered and presented the program's final security governance project — a full governance, risk, and compliance assessment built around the NYPD 99th Precinct case study. The project involved system categorization, policy authoring, control auditing, and gap remediation using real-world GRC frameworks and tools.

**Project files**: [github.com/defendwithgr/GRC-Intensive-Program-2026-WiCyS](https://github.com/defendwithgr/GRC-Intensive-Program-2026-WiCyS)

---

## Certificate

<img src="/assets/images/certifications/wicys-grc-certificate.jpg" alt="WiCyS GRC Intensive Training Program Certificate — Gayathri Rajamohan" loading="lazy" style="max-width: 100%; border-radius: 8px;" />

---

## What Was Done

### System Categorization (FIPS 199)

Categorized the **99-CMTOS system** in accordance with **FIPS 199** — defining impact levels across the three security objectives:

```
$ cat fips199_categorization.txt

Confidentiality : HIGH   — sensitive law enforcement data
Integrity       : HIGH   — evidence and record integrity critical
Availability    : MODERATE — operational continuity required
```

### Security Awareness & Training Policy

Authored a **Security Awareness and Training policy** establishing:
- Mandatory training at onboarding for all personnel
- Annual refresher training requirements
- Role-based training tracks for privileged users and system administrators

### Control Audit (Compyl)

Audited **20 security controls** and submitted supporting evidence through **Compyl**, a GRC platform — documenting control effectiveness and evidence artifacts for each.

### Gap Identification & Remediation

Identified a security control gap in **AC-3 (Access Enforcement)** — where access controls were not adequately enforced across system resources. Remediated the gap and documented the before/after control state.

```
$ diff ac3_before.txt ac3_after.txt
- AC-3: Partial implementation — access enforcement inconsistent
+ AC-3: Fully implemented — access enforcement validated across all resources
```

---

## Key Outcomes

- Delivered and presented the final project for the WiCyS GRC Intensive program
- Applied FIPS 199 to a realistic law enforcement information system
- Produced an actionable Security Awareness and Training policy ready for organizational adoption
- Audited 20 controls with documented evidence — demonstrating hands-on GRC platform experience
- Identified and remediated a real access enforcement gap (AC-3) in the assessed environment

---

## What I Learned

- System categorization frameworks like FIPS 199 force you to think about impact before controls — you can't prioritize a control audit until confidentiality, integrity, and availability are each rated on their own merits
- A training policy is only as strong as its enforcement mechanics — mandatory onboarding training means little without role-based tracks and a recurring refresher cadence
- Evidence-backed control auditing (vs. a checklist pass) is what actually holds up under review — Compyl's evidence-artifact model made that concrete
- Access enforcement gaps like AC-3 are easy to miss on paper and obvious once you map who *actually* has access versus who's *supposed* to — remediating it end-to-end (not just flagging it) was the most valuable part of the project

---

## Frameworks & Tools

`FIPS 199` `NIST RMF` `NIST SP 800-53` `AC-3 Access Enforcement` `Compyl` `Security Awareness Policy` `Control Auditing`

---

*← [Back to Projects](/projects.html)*
