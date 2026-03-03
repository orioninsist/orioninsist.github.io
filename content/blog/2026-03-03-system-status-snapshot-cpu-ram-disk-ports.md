+++

date = '2026-03-03'
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

title = '2026 03 03 System Status Snapshot Cpu Ram Disk Ports'
description = "One-command system status snapshot: load/CPU, RAM, disk usage, listening ports, and top processes—run in a minimal Docker lab for repeatable results."
summary = "Build a minimal Docker-based lab and run secquick.sh to capture a fast system snapshot (CPU/RAM/disk/ports/processes) without clutter."
slug = "system-status-snapshot-cpu-ram-disk-ports"
keywords = ["system status snapshot", "linux monitoring", "cpu ram disk", "listening ports", "secquick", "bash script", "docker lab", "uv", "python tools", "debian"]
series = ["linux-cheatsheets"]
categories = ["Linux", "Automation", "Cybersecurity"]
tags = ["bash", "docker", "debian", "monitoring", "security", "automation", "cli", "minimal"]
[cover]
    image = "" 
    alt = "" 
    relative = true
+++


**One command to capture a quick snapshot of your system: load/CPU, memory, disk usage, listening ports, and top resource-hungry processes.**

## Setup

### 1) Install Docker on the host
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker "$USER"
```

### 2) Create the project folder
```bash
mkdir -p orion-lab && cd orion-lab
mkdir -p scripts
```

### 3) Create `Dockerfile`
> File name must be exactly: `Dockerfile`

```docker
FROM python:3.12-slim

# Minimal but useful packages (no bloat)
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash ca-certificates curl git iproute2 procps util-linux findutils grep gawk \
 && rm -rf /var/lib/apt/lists/*

# Install uv (fast venv + package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:${PATH}"
WORKDIR /workspace
CMD ["bash"]
```

### 4) Create `docker-compose.yml`
```yaml
services:
  dev:
    build: .
    container_name: orion-dev
    tty: true
    stdin_open: true
    volumes:
      - ./:/workspace
    working_dir: /workspace
```

### 5) Build + enter the container
```bash
docker compose up -d --build
docker compose exec dev bash
```

### 6) Python tools (uv + venv)
```bash
uv python install 3.12
uv venv
source .venv/bin/activate
uv pip install ruff pytest
```

Verify:
```bash
python -V
ruff --version
pytest --version
```

Optional (prove the container OS + host kernel):
```bash
docker compose exec dev cat /etc/os-release
docker compose exec dev uname -r
```

---

## Run

> Put your script at: `scripts/secquick.sh`

```bash
chmod +x scripts/secquick.sh
./scripts/secquick.sh
```

---

## What it checks (5 items)
- **Load + kernel info:** system version and current load averages  
- **Disk usage:** which mounts are filling up  
- **RAM + swap:** available memory at a glance  
- **Top processes:** who is eating CPU/RAM (browser, desktop, editor, etc.)  
- **Listening ports:** what services are listening on the network  

---

## Sample output (short)
```text
### SECQUICK — quick security snapshot (2026-03-03T11:59:54+03:00)
$ uname -a
Linux debian13 6.12.73+deb13-amd64 x86_64 GNU/Linux
$ uptime
up 3:25, load average: 0.85, 1.08, 1.20
$ df -hT
/dev/sda2 ext4 900G 164G 691G 20% /
$ free -h
Mem: 15Gi total, 10Gi available
$ ps ... --sort=-%cpu
chrome, gnome-shell, zed-editor ...
```

---

## What we achieved
- We generated a **proof-based system snapshot** with one command.  
- If something is wrong (load, disk, memory, ports), you immediately see **where to start**.
