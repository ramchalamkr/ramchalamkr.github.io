---
layout: page
title: "Windows Server & Active Directory Home Lab"
permalink: /projects/azure-homelab/
---

# <span class="term-prompt">&gt;</span> gayathri@defendwithgr <span class="term-path">~/projects</span> cat <span class="term-filename">azure-homelab.md</span> <span class="term-cursor">█</span>

**Date**: Dec 2025  
**Type**: Home Lab  
**Platform**: Microsoft Azure

---

## Overview

Built a Windows Server and Active Directory environment from scratch on Azure to practice enterprise infrastructure configuration and security hardening. The entire setup was documented with screenshots to validate each stage of the build.

---

## What Was Built

Deployed **Windows Server 2019** on Azure and configured a complete Active Directory environment:

```
$ ls lab_components/
> active_directory    dns_server       dhcp_server
> organizational_units  group_policies  security_groups
```

### Active Directory
- Installed and promoted the server to a Domain Controller
- Created and structured **Organizational Units (OUs)** to reflect a realistic enterprise hierarchy
- Configured **security groups** with appropriate membership for role-based access

### DNS & DHCP
- Configured **DNS** integrated with Active Directory for internal name resolution
- Set up **DHCP** with scopes and reservations for the lab network

### Group Policy Objects (GPOs)
- Created and linked **GPOs** to OUs to enforce security settings — password policies, account lockout, and desktop restrictions

### Documentation
- Captured screenshots at each step to validate the configuration and produce a reference build guide

---

## Key Outcomes

- Built a functional enterprise-grade AD environment from a blank Azure VM — no templates, no pre-built images
- Practiced the configuration skills most relevant to real SOC and sysadmin environments: AD structure, GPO enforcement, DNS/DHCP integration
- Produced documented evidence of each build stage — a habit directly applicable to audit and compliance work

---

## Tools & Technologies

`Windows Server 2019` `Active Directory` `Azure Cloud` `DNS` `DHCP` `Group Policy (GPO)` `Organizational Units` `Security Groups`

---

*← [Back to Projects](/projects.html)*
