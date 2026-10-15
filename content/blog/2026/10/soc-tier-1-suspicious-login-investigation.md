+++
title = "SOC Tier 1 Lab: Investigating Suspicious Login Activity"
date = 2026-10-15T00:00:00+03:00
lastmod = 2026-10-15T00:00:00+03:00
draft = false
author = "Murat Kurkoglu"

description = "Investigate suspicious Windows logons using Event IDs 4625, 4624, and 4672 in a practical SOC Tier 1 simulation."
summary = "A hands-on SOC Tier 1 case study correlating failed logons, a successful RDP logon, and privileged session activity."
slug = "soc-tier-1-suspicious-login-investigation"

tags = ["SOC Tier 1", "SIEM", "Windows Event Logs", "Incident Triage", "Authentication"]
categories = ["SOC Analyst", "Cybersecurity"]

ShowReadingTime = true
ShowWordCount = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true
ShowPostNavLinks = true
ShowShareButtons = true
ShowCodeCopyButtons = true
+++


> **Training scenario:** This article presents a fictional SOC Tier 1 investigation for educational purposes. All event details, hosts, accounts, timestamps, and observed activities are simulated and do not represent a real security incident. The source IP address `203.0.113.45` belongs to the TEST-NET-3 documentation range (`203.0.113.0/24`), reserved under [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737.html). It does not identify a real-world attacker and should not be treated as a real threat intelligence indicator. 
## Objective

Practice a Tier 1 SOC workflow: review an authentication alert, correlate Windows Security events, distinguish suspicious activity from confirmed compromise, and document an escalation recommendation.

## Initial Alert

| Field | Value |
| --- | --- |
| Alert ID | `ALERT-001` |
| Initial severity | Medium |
| Affected host | `WIN-SRV-01` |
| Target account | `admin` |
| Source IP | `203.0.113.45` |
| Observation | 18 failed logons in five minutes |
| Initial successful logon status | Not yet verified |

The first analyst decision was to investigate authentication records rather than close the alert, immediately block the IP, or escalate without evidence.

## Evidence and Timeline

The simulation subsequently provided the following correlated events:

| Time | Event ID | Observation |
| --- | --- | --- |
| 09:00–09:05 | `4625` | 18 failed logons against `admin` |
| 09:06 | `4624` | Successful logon for `admin`; Logon Type `10` |
| 09:07 | `4672` | Special privileges assigned to the associated logon session |

The failed and successful authentication events share the same source IP, `203.0.113.45`. The `4672` event was linked to the successful logon through the same Logon ID.

### Event Interpretation

- **4625 — Failed logon:** Repeated failures may indicate password guessing, but the event alone does not establish malicious intent.
- **4624 — Successful logon:** Logon Type `10` indicates a remote interactive session, commonly associated with Remote Desktop Services.
- **4672 — Special privileges assigned:** This can occur during legitimate privileged logons. It is not, by itself, proof of account compromise.

## Analyst Assessment

**Working classification:** Suspicious authentication activity — possible password-guessing or brute-force sequence followed by successful access.

**Triage severity:** High (scenario assessment, not an automatically calculated score).

**Compromise status:** Unconfirmed.

The strongest concern is the sequence of repeated failed logons, a successful remote interactive logon from the same source, and a privileged logon event associated with that session. However, authorization and post-logon behavior have not yet been established.

## Recommended Tier 1 Actions

- [ ] Verify the successful session with the account owner or authorized operations team.
- [ ] Review post-authentication activity, including process execution, administrative actions, and relevant endpoint telemetry.
- [ ] Preserve original log records, timestamps, source fields, and session identifiers.
- [ ] Check whether the source and access pattern match an approved administrative workflow.
- [ ] Escalate the evidence and timeline to SOC Tier 2 under the organization's escalation procedure.

> **Containment:** No account disablement, host isolation, or IP blocking was performed in this simulation. Such actions require appropriate evidence and authorization under the incident-response playbook.

## Example Triage Handoff

| Field | Analyst note |
| --- | --- |
| Alert | `ALERT-001` |
| Priority | High |
| Observed activity | 18 failed logons followed by successful remote interactive logon and linked privileged logon event |
| Evidence | Windows Security Event IDs `4625`, `4624`, `4672`; source IP and Logon ID correlation |
| Impact | Unknown; unauthorized access not confirmed |
| Disposition | Escalation recommended |
| Next investigation | Validate authorization and inspect post-logon activity |

## Lessons Learned

1. **Correlate before concluding.** A sequence of events is more informative than any single Event ID.
2. **Separate evidence from inference.** Suspicious authentication does not automatically mean confirmed compromise.
3. **Document the reason for priority.** A High rating should be supported by observable facts and organizational criteria.
4. **Hand off actionable context.** Tier 2 needs a clear timeline, identifiers, open questions, and recommended next steps.

## References

- [ORIONINSIST — SIEM and Log Analysis for SOC Analysts](https://orioninsistcyber.com/siem-and-log-analysis-for-soc-analysts/)
- [GitHub Flavored Markdown Specification](https://github.github.com/gfm/)

---

*ORIONINSIST — Work Smarter. Prove It.*
