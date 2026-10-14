+++
title = "3 Quick Linux and Docker Checks Before Starting Work"
date = 2026-10-14
draft = false
description = "Three quick Linux and Docker checks to review user permissions, Docker status, and local images, with verified Fedora 44 examples."
tags = ["Linux", "Docker", "Fedora", "SOC", "Productivity"]
slug = "quick-linux-docker-checks"
+++

# 3 Quick Linux and Docker Checks Before Starting Work

Before troubleshooting permissions or working with containers, a few read-only checks can reveal useful context. These three commands take little time and help you avoid assumptions.

This post uses **real command results from a personal Fedora Linux 44 environment**. It is a personal practice note, not a production SOC incident or professional work experience.

## 1. Identify your user and groups with `id`

```bash
id
```

In my Fedora environment, the command showed:

```text
uid=1000(murat) gid=1000(murat) groups=1000(murat),10(wheel),984(docker)
```

The `uid` identifies the user, `gid` identifies the primary group, and `groups` lists group memberships. The full output also included an SELinux security context.

**Practical use:** Check the active account and group memberships before investigating permission issues.

**SOC perspective:** Membership in `wheel` or `docker` deserves attention during an authorized privilege review. Group membership alone does not prove suspicious activity. In a typical rootful Docker setup, Docker group access can provide root-equivalent capabilities.

**Productivity tip:** One `id` command gives you user and group context without opening account configuration files.

## 2. Check Docker's status with `docker info`

```bash
docker info
```

My verified results included:

| Check | Result |
| --- | --- |
| Docker client/server version | 29.8.2 |
| Running containers | 0 |
| Total containers | 0 |
| Local images | 1 |
| Operating system | Fedora Linux 44 |
| Security options | seccomp, SELinux, cgroupns |

**Practical use:** Confirm that the Docker client can reach the server and inspect the environment before diagnosing a container problem.

**SOC perspective:** Security options provide configuration context, not proof that every container is secure. The absence of running containers is not itself a security finding.

**Productivity tip:** Check the server and container counts before attempting a more involved troubleshooting workflow.

## 3. Review local images with `docker image ls`

```bash
docker image ls
```

My system reported one local image:

| Image | Image ID (short) | Disk usage | Content size |
| --- | --- | --- | --- |
| `docsync:local` | `bd1b9ef4bba9` | 5.85 GB | 1.59 GB |

**Practical use:** See which images are already present and understand reported storage usage before downloading more images.

**SOC perspective:** An unfamiliar image can be a reason to investigate its origin, configuration, and expected use. Its name or size alone cannot establish malicious behavior.

**Productivity tip:** Review local images before pulling another copy or removing anything. Do not delete an image without checking whether it is needed.

## A quick checklist

- [ ] Confirm the current account and group memberships with `id`.
- [ ] Confirm Docker server access and status with `docker info`.
- [ ] Review existing images with `docker image ls`.
- [ ] Investigate unexpected results rather than treating them as automatic alerts.

## What I learned

Three read-only commands can establish useful context for Linux troubleshooting and authorized security reviews. They are starting points for investigation—not substitutes for logs, configuration review, or other evidence.
