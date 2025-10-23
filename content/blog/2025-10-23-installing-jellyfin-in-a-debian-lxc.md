+++
title = "My Jellyfin Setup in a Debian LXC Container"
author = "Murat Kurkoglu"

date = 2025-10-23T12:22:50+03:00
publishDate = 2025-10-23T12:22:50+03:00
lastmod = 2025-10-23T12:22:50+03:00

description = "Learn how to install Jellyfin Media Server in a Debian LXC container on Proxmox. This step-by-step guide covers setup, storage, and troubleshooting."

summary = "Learn how to install Jellyfin Media Server in a Debian LXC container on Proxmox. This step-by-step guide covers setup, storage, and troubleshooting."
images = ["assets/images/blog/2025/10/2025-10-23-installing-jellyfin-in-a-debian-lxc.avif"]
slug = "installing-jellyfin-in-a-debian-lxc-container"
keywords = ["Jellyfin", "Proxmox", "LXC", "Debian", "Self-Hosting"]
tags = ["Jellyfin", "Proxmox", "Self-Hosting"]
draft = false 

ShowReadingTime = true
ShowToc = true
TocOpen = false
[cover]
    image = "assets/images/blog/2025/10/2025-10-23-installing-jellyfin-in-a-debian-lxc.avif" 
    alt = "A man and woman working together in a server room, setting up a Jellyfin media server in a Proxmox environment." 
    relative = true
+++
**A deep dive into creating a powerful, lightweight media server using the efficiency of Proxmox LXC containers.**

👋 Hey everyone,

This week was all about taming my digital media chaos. For years, I've had movies, TV shows, and family videos scattered across various hard drives. I wanted a clean, centralized, and open-source solution to stream my content anywhere in the house. While services like Plex and Emby are fantastic, my heart is set on FOSS (Free and Open-Source Software), which led me directly to Jellyfin.

Instead of spinning up a full virtual machine, which felt like overkill, I decided to leverage the power of Proxmox and run Jellyfin inside a lightweight Debian LXC container. It promised lower resource usage and a more efficient setup. This post is a detailed walkthrough of my entire journey, from creating the container to troubleshooting the inevitable permission headaches.

---

### My Goal This Week 🎯
My objective was clear: install and configure a fully functional Jellyfin media server inside a dedicated Debian 12 LXC container on my Proxmox server. The end goal was to have a stable, low-overhead media hub that could handle my library and be accessible to all my devices on the local network. I also wanted to ensure my media storage, which resides on a separate NAS, could be properly mounted and accessed by the container. This is often the trickiest part of containerized setups, and I was determined to get it right.

---

### The Process & The Code 👨‍💻
First things first, I needed a fresh Debian container. In the Proxmox web UI, I created a new LXC container with the following specifications:
* **Hostname:** jellyfin
* **Template:** `debian-12-standard`
* **Storage:** 8GB (more than enough for the OS and Jellyfin)
* **CPU Cores:** 2
* **Memory:** 1024MB (with 512MB Swap)
* **Network:** A static IP on my local network to make it easily accessible.

Once the container was up and running, I opened the console and began the installation process.

**Step 1: System Update and Initial Dependencies**

The first step in any new Linux environment is to get everything up to date and install a few essential tools.

~~~bash
# Update package lists and upgrade existing packages
apt update && apt upgrade -y

# Install dependencies needed for adding new repositories
apt install curl gnupg -y
~~~

**Step 2: Add the Jellyfin Repository**

Jellyfin isn't in the default Debian repositories, so I needed to add their official one. This ensures I get timely updates directly from the developers. The process involves importing the GPG signing key and then adding the repository source file.

~~~bash
# Import the Jellyfin GPG signing key
curl -fsSL https://repo.jellyfin.org/debian/jellyfin_team.gpg.key | gpg --dearmor -o /etc/apt/trusted.gpg.d/jellyfin.gpg

# Add the Jellyfin repository
echo "deb [arch=$(dpkg --print-architecture)] https://repo.jellyfin.org/debian bookworm main" | tee /etc/apt/sources.list.d/jellyfin.list
~~~

**Step 3: Install Jellyfin**

With the repository added, I refreshed the package lists one more time and then installed the `jellyfin` package.

~~~bash
# Update package lists again to include the new repository
apt update

# Install Jellyfin
apt install jellyfin -y
~~~

**Step 4: Verify the Installation**

After the installation finished, I checked to see if the Jellyfin service was running correctly.

~~~bash
systemctl status jellyfin
~~~

The output showed it was `active (running)`, which was a great sign! The server was now technically live on the container's IP address at port `8096`. However, it couldn't see any of my media yet. That was the next big challenge.

---

### Hitting The Wall 🧱
Here’s where I ran into the most common issue with containerized applications: **permissions and storage mounting**. My media files are stored on a NAS and mounted to the Proxmox host itself at `/mnt/media`. My goal was to pass this directory into the Jellyfin LXC container.

I used a "Bind Mount" in Proxmox. This makes a directory on the host appear inside the container. I added this line to my container's configuration file (`/etc/pve/lxc/101.conf`, where `101` is my container ID):

`mp0: /mnt/media,mp=/media`

This tells Proxmox to take the `/mnt/media` directory from the host and make it available at the `/media` path inside the Jellyfin container. I restarted the container, and sure enough, I could see the folders inside `/media`. Success! Or so I thought.

When I went to the Jellyfin setup wizard and tried to add my media library pointing to `/media/movies`, Jellyfin couldn't see any files. I spent nearly an hour trying to figure it out. The issue boils down to user mapping. On the Proxmox host, the files are owned by a specific user (UID 1000). Inside the LXC container, the `jellyfin` service runs as the `jellyfin` user, which has a different UID. The container's user didn't have permission to read the files owned by the host's user.

---

### The Breakthrough Moment ✨
The solution was to align the User IDs (UID) and Group IDs (GID) between the host and the container. After some digging, I found the `jellyfin` user inside the container had a UID of `111` by default.

First, I had to stop the Jellyfin service to make changes.

~~~bash
systemctl stop jellyfin
~~~

Next, I changed the UID and GID of the `jellyfin` user inside the container to match the UID/GID of the user who owns the media files on my Proxmox host (in my case, UID/GID 1000).

~~~bash
# Change the UID for the jellyfin user
usermod -u 1000 jellyfin

# Change the GID for the jellyfin group
groupmod -g 1000 jellyfin
~~~

After that, I needed to give the newly mapped user ownership of Jellyfin's configuration and data directories inside the container.

~~~bash
chown -R 1000:1000 /var/lib/jellyfin
chown -R 1000:1000 /var/log/jellyfin
chown -R 1000:1000 /etc/jellyfin
~~~

I restarted the Jellyfin service, went back to the web UI, and re-scanned the library. And just like that, movie posters and TV show information started flooding in. It was a fantastic feeling to see it all working perfectly. The breakthrough was understanding that containers don't just magically solve permissions; you have to be deliberate about how users and groups are mapped between the host and the guest.

---

### 📚 Recommended Resource
If you're diving into self-hosting on Linux, understanding the command line is non-negotiable. The challenges I faced were solved entirely in the terminal. That's why I wholeheartedly recommend **"The Linux Command Line, 2nd Edition" by William Shotts**. This book is an incredibly comprehensive yet accessible guide to mastering the shell. It doesn't just show you commands; it explains the "why" behind them, which is crucial for real-world problem-solving. It's a must-have for any aspiring or experienced Linux user. [Amazon](https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523)

---

### Key Takeaways 📚
1.  💡 **LXC is Incredibly Efficient:** The Jellyfin container is running with minimal CPU and memory usage, leaving plenty of resources for my other services. It was the right choice over a full VM for this task.
2.  ⚙️ **Permissions are Everything:** When using bind mounts with containers, always check your UID/GID mapping. It's the most common point of failure and understanding it is key to troubleshooting.
3.  📚 **Plan Your Storage:** Before you even create the container, have a clear plan for how you're going to get your media data inside it. A bind mount from the host is a great strategy for Proxmox users.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/proxmox-kvm-vs-lxc/)

> What has been your biggest "aha!" moment when working with containers or self-hosting? Share your story in the comments!

