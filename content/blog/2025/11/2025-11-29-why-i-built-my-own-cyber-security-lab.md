+++

date = 2025-11-29T23:25:31+03:00
publishDate = 2025-11-29T23:25:31+03:00
lastmod = 2025-11-29T23:25:31+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true
ShowBreadCrumbs = true # PaperMod setting for navigation [36]
ShowPostNavLinks = true # PaperMod setting for post navigation [36]
ShowShareButtons = true # PaperMod setting to show share buttons [36]
ShowCodeCopyButtons = true # PaperMod setting for code copy buttons [36]
ShowWordCount = true # PaperMod setting to show word count [36]
author = "Murat Kurkoglu"




draft = true 


title = "Building a Cyber Security Home Lab: Why Local Hardware Beats the Cloud"
description = "Cloud labs are convenient, but local virtualization offers control. Here is why I switched to a local KVM setup on Arch Linux for my Master's studies."
summary = "An analysis of the economic and technical benefits of building a local cyber security lab using KVM and consumer hardware versus relying on cloud providers."
slug = "why-i-built-my-own-cyber-security-lab"
keywords = ["Home Lab", "Cyber Security", "KVM", "Arch Linux", "Virtualization"]
series = ["Lab Diaries"]
categories = ["Cyber Security", "Virtualization"]
tags = ["ThinkPad", "QEMU", "SOC Analyst", "Self-Hosting"]
[cover]
    image = "images/blog/2025/11/2025-11-29-why-i-built-my-own-cyber-security-lab.avif" 
    alt = "Abstract geometric illustration representing a cyber security home lab, featuring a computer processor chip transforming into a protective shield in dark purple and grey gradients." 
    relative = true
+++

## The Illusion of Infinite Resources

It was 02:45 AM. The fan on my laptop was spinning so fast I thought it might lift off the desk. I was running three virtual machines simultaneously: a target Windows machine, a Kali Linux attacker node, and a SIEM forwarder to collect logs. The room was warm, my coffee was cold, and I was staring at a frozen cursor.

For a moment, I considered just shutting it all down and spinning up an EC2 instance on AWS. It would be easier. It would be faster. But then I remembered the bill I received last month when I forgot to shut down a simple Ubuntu instance for three days.

As a Computer Engineer and an Economist, I constantly weigh the trade-offs between OPEX (Operating Expenses) and CAPEX (Capital Expenses). The cloud is purely OPEX—you pay for every second of compute and every gigabyte of data transfer. A home lab is CAPEX—you buy the hardware once, and it’s yours.

But beyond the money, there is a philosophy here. In my Cyber Security Master's program, we learn about control, privacy, and understanding the stack. When you rent a computer from a cloud giant, you are trusting their hypervisor, their network, and their rules. When you build it yourself, you *are* the cloud provider.

>**"Cloud services are powerful**, but the pricing structure caught me off guard, and the resulting bill was a harsh reality check. It forced me to analyze cost efficiency more strictly. I view that mistake not as a failure, but as a valuable experience that pushed me toward a better solution."

## The Diagnosis: Why Cloud Didn't Fit My Mission

I spent the first few weeks of my graduate studies trying to do everything remotely. I used various cloud providers to host my practice labs. At first, it seemed seamless. I could access my lab from the library, the cafe, or home.

But I noticed three specific friction points that made me reconsider.

### 1. The "Malware" Problem
I am training to be a SOC Analyst. This involves handling sensitive files, sometimes actual malware samples for static analysis. Cloud providers have strict Acceptable Use Policies. Uploading certain types of obfuscated code or running network scanning tools can trigger automated abuse flags. I didn't want my account banned just because I was doing my homework.

### 2. The Network Black Box
In the cloud, the network layer is abstracted away. You get a VPC (Virtual Private Cloud), but you don't see the raw packets moving across the bridge in the same way. I wanted to see the ARP requests. I wanted to break the virtual switch. On a local machine, I can configure a bridge interface on my Arch Linux host and watch exactly how the packets travel from the VM to the physical interface.

### 3. Latency and "Feel"
There is a subtle disconnection when typing into a terminal over SSH with 50ms latency. It feels like you are asking the computer to do something, rather than making it do it. When I use a local Tiling Window Manager (like Sway), I want instant feedback. I want to switch workspaces and see the logs scrolling in real-time without the jitter of an internet connection.

## The Solution: Local Iron and Open Source

So, I decided to bring the lab home. I didn't go out and buy a $5,000 server rack. I believe in efficiency. I used what I had, with one critical upgrade.

### The Hardware: Lenovo ThinkPad E490
My daily driver is a Lenovo ThinkPad E490. It’s a robust machine, but it originally came with standard RAM. Virtualization is memory-hungry. CPU cycles can be shared, but RAM is a hard limit. If you assign 4GB to a VM, that 4GB is gone from your host.

I upgraded the machine to 32GB of DDR4 RAM. This was the tipping point. With 32GB, I can comfortably run:
* **Host:** Arch Linux (Sway) - 4GB reserved.
* **VM 1:** Kali Linux (Attacker) - 4GB.
* **VM 2:** Windows 10 (Victim) - 8GB.
* **VM 3:** Security Onion or Splunk (Log Analysis) - 8GB.

And I still have headroom for a browser and music.

### The Software: KVM over VirtualBox
For years, I used VirtualBox. It’s fine. It has a GUI, it’s easy. But on Linux, we have something better: **KVM (Kernel-based Virtual Machine)**.

KVM turns the Linux kernel into a hypervisor. It’s not a program running *on* the OS; it effectively *is* the OS. I paired this with `QEMU` for hardware emulation and `virt-manager` for a graphical interface when I need it.

The performance difference was noticeable immediately. My Arch Linux host didn't struggle. The VMs felt native.

## Setting Up the Lab (The Arch Way)

The setup wasn't without its headaches. The main challenge was permissions. I wanted to run these VMs without being `root` all the time, and I wanted them to talk to my home network.

Here is how I configured the environment on Arch.

First, I needed the core packages. I prefer explicitly listing what I need rather than installing meta-groups.

```bash
# Installing the virtualization stack
sudo pacman -S qemu-desktop libvirt edk2-ovmf virt-manager iptables-nft dnsmasq
```

Then came the service activation. I noticed that if I didn't enable the socket specifically, `virt-manager` would fail to connect to the hypervisor.

```bash
sudo systemctl enable --now libvirtd.service
```

### The "Permission Denied" Panic
I tried to launch my first VM, and it crashed immediately. The error log was cryptic, mentioning permission issues accessing the storage pool.

I realized I hadn't added my user to the `libvirt` group. On Arch, your user is just a standard user. You have to explicitly grant power.

```bash
# adding my user 'murat' to the libvirt group
sudo usermod -aG libvirt murat
# newgrp libvirt # to apply without logging out
```

### Network Bridging
This was the tricky part. By default, KVM uses NAT (Network Address Translation). The VM is hidden behind the host. But for a Cyber Security lab, I often want the VM to have its own IP address on my local LAN (e.g., 192.168.1.50) so I can scan it from another physical device.

I had to create a bridge interface. Since I use `NetworkManager`, it required a specific configuration to stop it from interfering with the bridge.

I created a bridge named `br0` and enslaved my Ethernet interface to it.

```bash
# checking the bridge status
nmcli connection show --active

# Output snippet:
# NAME    UUID                                  TYPE      DEVICE 
# br0     7a3b4d...                            bridge    br0    
# wired   5f2c1e...                            ethernet  enp3s0 
```

Now, when I create a VM, I select "Bridge device br0" instead of NAT.

## 🛠️ MY LAB GEAR: Crucial 32GB RAM Kit
*Why:* You cannot download more RAM. For running a SOC environment with SIEM logs, 16GB is the bare minimum, but 32GB is where you stop worrying about crashes.
[Amazon Link Placeholder: Crucial RAM 32GB Kit (2x16GB) DDR4 2666 MHz CL19 Laptop Memory](https://www.amazon.com/Crucial-5600MHz-5200MHz-4800MHz-CT2K16G56C46S5/dp/B0BLTDRRLF/ref=sr_1_1?dib=eyJ2IjoiMSJ9.tznWYYHBDPmAFC3Ow1KNRWprwEeYTSS7ij9x2mS8YaOtu4VauGdmA9bNeW_1slEUG1fhd2M78lmsv0T5jjvN-sflj2bSGhOmWNHklS-N2eIZP5_7npEmNjwma5Q5RwluypGC_5ivXw_qNL10WW19FbbbkFHXlHPuITzkROYAbwyMuRKpUQPpax2B6Uw7ZqbOzWIjAOLwRuobgx-Erulv7cIShQ08nB3LuzPzfwjlsCo.6YZtivIm_PMcooIAB0yjuNs1Hv6IWlBPmpnHcuUYf7k&dib_tag=se&keywords=crucial%2B32gb%2Bddr4&qid=1764448181&sr=8-1&th=1)

## Verification: The Ping Test

Once the Windows VM was spun up on the bridge, I needed to prove it was accessible from the outside world (my phone on the same Wi-Fi).

I checked the IP on the Windows VM: `192.168.1.105`.
I opened a terminal on my Arch host.

```bash
$ ping -c 3 192.168.1.105
PING 192.168.1.105 (192.168.1.105) 56(84) bytes of data.
64 bytes from 192.168.1.105: icmp_seq=1 ttl=128 time=0.452 ms
64 bytes from 192.168.1.105: icmp_seq=2 ttl=128 time=0.389 ms
64 bytes from 192.168.1.105: icmp_seq=3 ttl=128 time=0.412 ms

--- 192.168.1.105 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
```

Sub-millisecond latency. This is why we use local hardware.

## The Verdict

Building this lab taught me more about networking and Linux permissions than any cloud dashboard ever did. There is a sense of satisfaction in knowing exactly where your data lives—right there on the SSD under your palms.

It’s not the most expensive setup, but it’s mine, and it works perfectly for my studies.

