+++

date = '2026-03-26'
publishDate = 2023-10-19T00:40:04-07:00



ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true # PaperMod setting for navigation [36]
ShowPostNavLinks = true # PaperMod setting for post navigation [36]
ShowShareButtons = true # PaperMod setting to show share buttons [36]
ShowCodeCopyButtons = true # PaperMod setting for code copy buttons [36]
ShowWordCount = true # PaperMod setting to show word count [36]
author = "Murat Kurkoglu"


draft = false 

title = 'Pacman Install Upgrade History'
description = "Learn how to check Pacman install, upgrade, and removal history in Arch Linux using pacman.log to audit package changes and troubleshoot issues."
summary = "This note explains how to inspect pacman.log for installed, upgraded, and removed packages so you can review recent system changes and debug problems after updates."
slug = "pacman-install-upgrade-history"
keywords = ["pacman install history"]
series = []
categories = ["Linux"]
tags = ["pacman"]
[cover]
    image = "" 
    alt = "" 
    relative = true
+++

## Command
```bash
grep -E "installed|upgraded|removed" /var/log/pacman.log
```

## Purpose
Shows which packages were installed, upgraded, or removed.

## When To Use
Use this after a system update or when debugging a broken system to see what changed.

## Workflow Role
Audit step after a system upgrade or before troubleshooting.

## Logic
Reads `/var/log/pacman.log` and filters only package action entries.

## Automation (Optional)
```bash
grep -E "installed|upgraded|removed" /var/log/pacman.log | tail -n 20
```

## Single Example
You run a full system update, something breaks, and you check the last 20 package actions to identify the likely cause.

## Quick Note
`pacman.log` grows over time, so filtering or limiting output keeps it readable.