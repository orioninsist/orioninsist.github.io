+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = '{{ .Date }}'
lastmod = '{{ .Date }}'
draft = false
author = "Murat Kurkoglu"

description = "SOC Tier 1 shift start and handover review: practical checklist for open incidents, ticket ownership, priorities, next actions, and escalation."
summary = "Learn how a SOC L1 analyst reviews previous-shift notes, reconciles open cases, flags missing owners and urgent follow-ups, and documents a defensible handover decision."
slug = "shift-start-and-handover-review"

ShowReadingTime = true
ShowWordCount = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true
ShowPostNavLinks = true
ShowShareButtons = true
ShowCodeCopyButtons = true
+++


# SOC Tier 1 Shift Start and Handover Review: A Practical Checklist

> **Task:** F01 · 01 — Shift Operations  
> **Content type:** MD ONLY — document review  
> **Status:** Draft; not published  
> **Evidence classification:** All case records below are **synthetic training examples**, not observed SOC events.

## Problem and Objective

An incoming SOC Tier 1 analyst must understand what remains unresolved from the previous shift before accepting the operational picture. A handover that omits ticket ownership, urgency, or the next action can delay incident response even when alerts are visible in the SIEM.

**Objective:** Review previous-shift notes and the ticket queue, identify critical open cases, unassigned tickets, overdue responses, and unclear priorities, and prepare a documented handover for the shift lead. **Success criterion:** Open cases, owners, priorities, and next actions are recorded; unresolved ownership or priority is explicitly flagged.

This exercise is a **documentation review**, not a detection lab. No SIEM, ticketing platform, virtual machine, or production environment is required.

## Operational Context and References

NIST SP 800-61 Revision 3 (April 2025) places incident response within organizational cybersecurity risk management and emphasizes coordinated detection, response, and recovery. CISA's federal incident and vulnerability response playbooks provide a useful operational model for consistent coordination, tracking, and communication. Neither reference prescribes the specific checklist or synthetic severity thresholds used here; those are practical examples that must be adapted to an organization's approved procedures.

A handover review should reconcile **two sources**: the outgoing analyst's narrative and the current authoritative ticket record. If they disagree, record the discrepancy rather than silently treating either as confirmed.

## Inputs and Minimum Handover Fields

Use authorized, read-only access to the shift notes, ticketing queue, and relevant SIEM context. For each open case, capture:

| Field | Review question |
|---|---|
| Case ID and status | Is the case still open, pending, or under investigation? |
| Priority and reason | Does the documented priority match the known impact and urgency? |
| Assigned owner | Is there an accountable person or team? |
| Last update | Is the case actively progressing? |
| Next action | What must happen next, by whom, and when? |
| Due time or response target | Is a documented internal target already missed? |
| Evidence and links | Can the next analyst find the original alert and investigation notes? |
| Escalation state | Was the SOC lead or Tier 2 informed, and is acknowledgment recorded? |

**Do not invent a service-level agreement (SLA).** Use only the organization's documented targets. An unknown deadline is a documentation gap, not proof that a response is overdue.

## Step-by-Step Shift Start Workflow

1. **Read the outgoing handover.** Identify unresolved incidents, known blockers, monitoring requests, and promised follow-ups.
2. **Open the authoritative ticket queue.** Filter for open, pending, escalated, and recently updated cases within the scope of the shift.
3. **Reconcile each case.** Compare its current status, owner, priority, and next action with the handover notes.
4. **Check the time context.** Confirm the timezone and compare response targets with the current time. Flag overdue cases only when a documented target exists.
5. **Review relevant SIEM context if authorized.** Check alert references or case-linked evidence; do not assume an alert is a confirmed incident.
6. **Identify gaps.** Flag missing ownership, missing next actions, conflicting priority, stale notes, and absent escalation acknowledgment.
7. **Prepare the handover summary.** Separate verified facts from pending checks, include a specific proposed next action, and notify the shift lead where required.
8. **Stay within L1 authority.** Reading, checking, and recommending escalation are in scope. Do not close cases, change owners, alter severity, or perform containment without authorization.

## Practical Handover Checklist

- [ ] Previous shift notes reviewed and review time recorded.
- [ ] Open cases reconciled against the current ticket queue.
- [ ] Case IDs, statuses, and priorities captured.
- [ ] Every case has a documented owner or an explicit **unassigned** flag.
- [ ] Next action and responsible party identified for each case.
- [ ] Due times checked against approved response targets where available.
- [ ] Critical cases, missing ownership, and overdue responses flagged to the shift lead.
- [ ] Conflicting or unverified details marked as **pending verification**.
- [ ] Escalation recipient, timestamp, and acknowledgment recorded if available.
- [ ] No unauthorized case closure, reassignment, or production change performed.

## Worked Document Review — Synthetic Dataset

The following dataset is **fabricated solely for learning**. Times and internal response targets are hypothetical, not observations or organization-wide standards. Assume a fictional shift review at **2026-10-20 08:00 UTC**.

| Case | Status | Priority | Owner | Next action | Hypothetical target | Review finding |
|---|---|---|---|---|---|---|
| SOC-101 | Investigating | Critical | Tier 2 queue | Confirm scope of suspicious privileged sign-in | 07:45 UTC | Target missed by 15 minutes; notify lead |
| SOC-102 | Open | High | Unassigned | Assign investigator and validate alert evidence | Not documented | Ownership gap; request authorized assignment |
| SOC-103 | Pending | Medium | Analyst A | Await endpoint telemetry and update ticket | 09:00 UTC | Owner and action documented; monitor |
| SOC-104 | Open | High in handover; Medium in ticket | Analyst B | Confirm correct priority using approved criteria | Not documented | Priority conflict; request clarification |

**Synthetic context:** SOC-101 references an alert involving example source IP `198.51.100.24`, an RFC 5737 documentation address. This address is not evidence of real malicious activity.

### Analysis and Findings

**Finding 1 — Missed target:** SOC-101 has a documented hypothetical response target of 07:45 UTC, which is earlier than the 08:00 UTC review. The L1 analyst should report the gap to the shift lead and verify whether escalation has already occurred. The missed target alone does not establish compromise or justify unilateral containment.

**Finding 2 — Missing ownership:** SOC-102 has no named owner. This creates a risk of an unattended investigation. L1 should request assignment through the authorized workflow, not silently self-assign or modify ownership without permission.

**Finding 3 — Clear follow-up:** SOC-103 has an owner, next action, and future target. The handover can retain the case for monitoring, subject to new evidence.

**Finding 4 — Priority mismatch:** SOC-104 is labeled High in the outgoing note but Medium in the current ticket. Neither label can be accepted as correct without approved severity criteria and supporting context. Flag the discrepancy for the authorized decision-maker.

### SOC Tier 1 Decision and Handoff

**L1 decision:** The synthetic handover is **not clean**. Escalate the documented missed target for SOC-101, the unassigned SOC-102, and the conflicting priority for SOC-104 to the SOC shift lead. Request Tier 2 input for SOC-101 if the lead or local playbook requires it. Continue tracking SOC-103.

**Proposed handoff message — synthetic, not sent:**

> Shift review completed at 08:00 UTC (training scenario). SOC-101: Critical, hypothetical response target missed by 15 minutes; please confirm escalation status and next action. SOC-102: High, no owner recorded; authorized assignment needed. SOC-104: priority differs between handover notes (High) and ticket (Medium); please confirm approved priority. SOC-103: owner and 09:00 UTC follow-up recorded. No ticket changes or containment actions performed.

**Required acknowledgment:** Record who received the handoff and whether it was acknowledged. In this example, **no real message was sent and no acknowledgment was observed**.

## Reusable Handover Record Template

Use the following Markdown template within the organization's authorized documentation system. This is an **untested documentation example**, not an automatically generated ticket export.

```markdown
# SOC Shift Handover — YYYY-MM-DD HH:MM TZ

- Outgoing shift reference: [approved link or record ID]
- Incoming reviewer: [authorized analyst identifier]
- Review completed: [timestamp and timezone]
- Open cases reviewed: [count]

| Case ID | Status | Priority | Owner | Last update | Next action | Due time | Gap / escalation |
|---|---|---|---|---|---|---|---|
| [ID] | [status] | [priority] | [owner/unassigned] | [time] | [action] | [time/unknown] | [finding] |

## Critical gaps
- [Case ID]: [verified fact, uncertainty, requested decision]

## Handoff
- Recipient: [SOC lead / Tier 2 as applicable]
- Sent at: [timestamp or not sent]
- Acknowledged at: [timestamp or not confirmed]
- Unauthorized changes performed: None
```

## Evidence, Verification, and Completion Boundaries

**Evidence available in this article:** the documented review method, the reusable checklist, and transparent reasoning applied to a labeled synthetic case table. These demonstrate how to conduct a review; they **do not prove that a real shift was reviewed**.

**Not performed:** No live ticket query, SIEM investigation, case update, response-time measurement against a real SLA, production escalation, or human validation of a real handover was performed.

**Human verification required before operational use:** An authorized analyst must verify the current ticket queue, applicable severity matrix, SLA or response targets, role permissions, escalation contacts, and whether the handoff was acknowledged.

**Completion interpretation:** This MD ONLY article can be considered a reviewed research/documentation deliverable after editorial and source checks. It cannot be presented as evidence of a completed operational shift handover.

## Limitations and Safety

- Organization-specific severity definitions, response targets, and escalation routes were not supplied and are intentionally not invented.
- Synthetic case statuses and timestamps are training material, not security findings.
- Ticket data may change between the outgoing and incoming shifts; the authoritative current record must be checked.
- Use sanitized records only. Avoid credentials, personal information, confidential hostnames, and unapproved production data.
- Work only in authorized defensive environments. Ownership changes, case closure, and response actions require applicable approval.

## Sources

1. NIST, **SP 800-61 Rev. 3 — Incident Response Recommendations and Considerations for Cybersecurity Risk Management: A CSF 2.0 Community Profile** (final, April 2025). https://csrc.nist.gov/pubs/sp/800/61/r3/final
2. CISA, **Federal Government Cybersecurity Incident and Vulnerability Response Playbooks** (2021). https://www.cisa.gov/sites/default/files/publications/Cybersecurity_Incident_Vulnerability_Response_Playbooks_508C.pdf
3. IETF, **RFC 5737 — IPv4 Address Blocks Reserved for Documentation** (2010). https://www.rfc-editor.org/rfc/rfc5737
