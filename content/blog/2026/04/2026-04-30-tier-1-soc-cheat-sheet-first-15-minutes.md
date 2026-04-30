+++
date = 2026-04-30T09:00:00+03:00
publishDate = 2026-04-30T09:00:00+03:00
lastmod = 2026-04-30T09:00:00+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true
ShowPostNavLinks = true
ShowShareButtons = true
ShowCodeCopyButtons = true
ShowWordCount = true
author = "Murat Kurkoglu"
draft = false

title = "Tier-1 SOC Analyst Cheat Sheet: What to Check in the First 15 Minutes"
description = "A practical Tier-1 SOC cheat sheet for the first 15 minutes of triage, covering event IDs, ports, evidence collection, and escalation decisions."
summary = "A practical Tier-1 SOC cheat sheet for the first 15 minutes of triage, with the exact checks, event IDs, ports, and escalation cues that matter most."
slug = "tier-1-soc-cheat-sheet-first-15-minutes"
canonicalURL = "https://orioninsist.org/blog/tier-1-soc-cheat-sheet-first-15-minutes/"
keywords = ["Tier 1 SOC analyst", "SOC cheat sheet", "alert triage", "Windows event IDs", "security operations", "incident escalation"]
categories = ["Cybersecurity", "Security Operations"]
tags = ["SOC", "Tier-1", "Alert Triage", "Incident Response", "Windows Security", "SIEM"]
series = ["SOC Tier 1 Analyst Journey"]

[cover]
    image = ""
    alt = "A Tier-1 SOC analyst cheat sheet showing triage steps, important event IDs, critical ports, and escalation cues"
    relative = true
+++

If you are starting in a SOC, the first problem is not "how do I know everything?" The first problem is simpler: **what should I check first, and what can I safely escalate?**

This post turns my Tier-1 SOC cheat sheet into a short, practical workflow. It is written for new analysts, interview prep, and anyone who wants a fast reference for the first 15 minutes of triage.

If you want the broader role context first, read [SOC Structure and Tier-1 Role: Your 15-Minute Overview](/blog/soc-structure-tier-1-role-quick-guide/). If you want the career roadmap behind this series, start with [How to Become a SOC Tier 1 Analyst: Series Kickoff and Roadmap](/blog/how-to-become-a-soc-tier-1-analyst-roadmap/).

## What This Cheat Sheet Is For

This is not a deep forensics guide. It is a decision support guide for Tier-1 analysts.

The goal is to answer three questions quickly:

1. Is this alert real, or is it noise?
2. What context do I need before I act?
3. Should I close it, monitor it, or escalate it now?

That framing matters because Tier-1 is about speed, evidence, and clean handoff. You are not expected to solve every incident. You are expected to make the next decision safer for the team.

## The 4-Step Tier-1 Triage Loop

My cheat sheet uses a simple loop:

1. Identify
2. Contextualize
3. Investigate
4. Act

Here is how that looks in real work.

### 1) Identify

Start by asking whether the alert is worth attention.

Look at:
- Alert source
- User or asset involved
- Severity
- Time of day
- Whether the behavior is expected

A failed login at 10:00 AM for a user who mistyped their password is not the same as 40 failed logins from an unfamiliar IP at 02:00 AM.

### 2) Contextualize

Before you jump into logs, learn who and what is involved.

Check:
- Who owns the IP or host
- Whether the system is critical
- Whether the user has elevated privileges
- Whether the asset is external, internal, or a server

Context tells you whether the event is annoying or dangerous.

### 3) Investigate

Use a small time window around the alert, usually plus or minus 15 minutes.

Look for:
- Prior logons
- Related processes
- New users
- Network connections
- Similar hashes or domains
- Evidence of repetition

Tier-1 investigation should be focused. You are building enough confidence to decide the next step, not trying to reconstruct the full incident timeline.

### 4) Act

End with one clear action:
- Close as benign
- Keep monitoring
- Escalate to Tier-2
- Quarantine or isolate if your process allows it

If your ticket does not end with a decision, it is unfinished.

## The Windows Event IDs I Check First

These event IDs show up often in real SOC work, and they are worth memorizing early.

### 4624: Successful Logon

A successful logon is normal most of the time, but the context can still matter.

Watch for:
- Logons at unusual hours
- Logons from rare geographies
- Logons that follow many failed attempts
- Logons to sensitive systems

A single successful logon is not a problem by itself. A successful logon after suspicious failure patterns may be.

### 4625: Failed Logon

This is the event ID that often points to brute force or password spraying.

Check:
- Number of failures
- Source IP
- Failure pattern across multiple users
- Whether the account is locked afterward

A burst of 4625 events across many accounts is more suspicious than repeated failures on one known user who simply forgot their password.

### 4688: New Process Created

This matters when a new or unexpected executable starts.

Look for:
- Unknown `.exe` files
- Script interpreters launching unusual child processes
- Office applications spawning PowerShell or cmd
- Processes running from temporary folders or user profile paths

If you see a suspicious parent-child process chain, treat it as a priority enrichment item.

### 4720: New User Created

New account creation can be legitimate, but it can also be a persistence signal.

Check:
- Who created the account
- Whether the creator has admin rights
- Whether the account is enabled for login
- Whether the new user is part of a risky group

Unexpected account creation on a critical system deserves fast escalation.

### 1102: Log Cleared

This is one of the clearest red flags in the cheat sheet.

If logs were cleared, ask:
- Who cleared them
- From which host
- Whether maintenance was scheduled
- What other alerts occurred before the log clear

Log clearing is often an attempt to hide activity, so it should move quickly up the queue.

## Critical Ports to Remember

Ports do not prove malicious behavior on their own, but they help you understand likely attack paths.

### 22 and 3389

SSH on 22 and RDP on 3389 are common remote access points.

Why Tier-1 cares:
- They are frequent brute-force targets
- They are often abused for lateral movement
- They should not be openly exposed without reason

If these ports are visible externally, verify whether that exposure is expected.

### 53

DNS on port 53 is usually normal, which is exactly why it is useful for attackers.

Watch for:
- Unusual query volume
- Long or encoded subdomains
- Suspicious domains with repeated lookups
- Possible data exfiltration patterns

DNS is noisy, but it is also one of the easiest channels to abuse.

### 445

SMB on 445 often shows up in lateral movement cases.

Look for:
- Internal host-to-host spread
- Remote file access that does not fit the user profile
- New shares or repeated connection attempts

If the traffic is inside the network and moving laterally, that is usually more concerning than a single external connection.

### 80 and 443

HTTP and HTTPS are normal business traffic, which makes them dangerous when used as camouflage.

Check:
- Strange user agents
- Unusual destination domains
- Repeated beaconing intervals
- Traffic that looks ordinary but behaves like command-and-control

Normal-looking web traffic can still be part of C2 communication.

## My Fast Analysis Checklist

When an alert lands, I run this mental checklist:

- Is the IP or domain reputation known or suspicious?
- Does the hash match a known malicious family?
- Is there a clear timeline around the event?
- Did the activity touch other internal systems?
- Is there base64, obfuscation, or suspicious command-line content?

That checklist is simple on purpose. Tier-1 wins by being consistent.

## When to Escalate to Tier-2

Escalate fast if you see:

- Ransomware behavior
- Privilege escalation
- Data exfiltration
- Log clearing without a valid reason
- Suspicious activity on a domain controller
- Multiple systems involved at once

If the event suggests impact beyond a single noisy alert, Tier-1 should not try to hold it alone.

The right escalation includes the evidence, the timeline, and your reasoning. That makes the handoff useful.

## What a Good Ticket Looks Like

A good Tier-1 ticket is short, factual, and complete.

It should include:
- Alert name
- Affected user or host
- Source IP or domain
- Relevant timestamps
- What you checked
- What you ruled out
- Your recommendation

Example summary:

```text
Alert: Multiple failed logons on VPN account
User: sarah@company.com
Source: 203.0.113.45
Evidence: 27 failed logons in 8 minutes, followed by one success from same IP
Context: User is not on travel, IP reputation is poor, no known business need
Decision: Escalate to Tier-2 for credential attack review
```

That is the level of clarity Tier-2 needs.

## What Not to Do

Tier-1 analysts usually waste time in a few predictable ways:

- Chasing one log line without context
- Treating every alert as a breach
- Ignoring normal user behavior patterns
- Escalating with no evidence
- Writing tickets that sound certain but say nothing useful

Your job is not drama. Your job is signal.

## FAQ

### Is this cheat sheet enough to start Tier-1 work?

It is enough to build a good first-pass workflow, but real SOC work also needs SIEM practice, logging knowledge, and company-specific playbooks.

### Should I memorize every event ID?

No. Start with the handful that appear repeatedly in alerts and incident patterns, then expand from real cases.

### What if the alert is ambiguous?

Document the ambiguity, add the context you do have, and escalate if the risk is meaningful. Uncertainty is normal; unclear tickets are the problem.

## Final Note

I built this cheat sheet to make Tier-1 work less random and more repeatable. If you are learning SOC analysis, keep this kind of checklist close: identify, contextualize, investigate, act.

If you want more context around the career path, revisit [SOC Structure and Tier-1 Role: Your 15-Minute Overview](/blog/soc-structure-tier-1-role-quick-guide/) and [How to Become a SOC Tier 1 Analyst: Series Kickoff and Roadmap](/blog/how-to-become-a-soc-tier-1-analyst-roadmap/).

If this guide helped you, you can support my work with a [Buy Me a Coffee](https://buymeacoffee.com/orioninsist/e/533525) for $1. That support helps me keep creating practical cybersecurity content.

For the rest of the site, see [Archives](/archives/) or use [Search](/search). You can also read [About](/about/) if you want the background behind this project.
