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

title = 'Kill Process Port Linux'
description = "Learn how to find and kill a Linux process using a specific port with lsof and kill. Includes a quick command and Bash automation."
summary = "This guide shows how to identify and force-stop a Linux process bound to a port using lsof, kill, and a simple Bash helper script."
slug = "kill-process-port-linux"
keywords = ["kill process by port"]
series = []
categories = ["Linux"]
tags = ["bash"]
[cover]
    image = "" 
    alt = "" 
    relative = true
+++



**How to Find and Kill a Process Using a Specific Port in Linux**

## Problem

A port is already in use, and your service fails to start.  
You need to quickly find which process is using that port and stop it.

## Command / Script

```bash
sudo kill -9 $(lsof -t -i :PORT)
```

## Explanation

- `lsof -t -i :PORT` → returns PID using the port
- `kill -9` → force kills that process

Replace `PORT` with your target (e.g., `3000`, `8080`).

## Example

```bash
sudo kill -9 $(lsof -t -i :3000)
```

Kills any process blocking port `3000`.

## Automation (Optional but preferred)

```bash
#!/bin/bash

PORT="$1"

if [ -z "$PORT" ]; then
  echo "Usage: killport <PORT>"
  exit 1
fi

PID=$(lsof -t -i :$PORT)

if [ -z "$PID" ]; then
  echo "No process found on port $PORT"
else
  sudo kill -9 $PID
  echo "Killed process $PID on port $PORT"
fi
```

**Usage:**

```bash
chmod +x killport
./killport 3000
```

## Quick Note

`kill -9` is forceful. Use carefully — no graceful shutdown.

### Final Resolution

The process blocking the port is now removed and the port is free again. Your service can start normally without port conflict.