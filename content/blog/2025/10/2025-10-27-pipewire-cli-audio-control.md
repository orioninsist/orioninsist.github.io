+++

date = 2025-10-27T15:57:55+03:00
publishDate = 2025-10-27T15:57:55+03:00
lastmod = 2025-10-27T15:57:55+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "Ditch the GUI: Mastering PipeWire Audio in Arch CLI"
author = "Murat Kurkoglu"
description = "I detail my full transition from Pavucontrol to CLI-only audio management on Arch Linux with Sway/PipeWire, using WirePlumber rules and wpctl for a minimal workflow."
summary = "I detail my full transition from Pavucontrol to CLI-only audio management on Arch Linux with Sway/PipeWire, using WirePlumber rules and wpctl for a minimal workflow."
slug = "ditch-the-gui-mastering-pipewire-audio-in-arch-cli"
keywords = ["PipeWire", "Arch Linux", "Sway", "Wayland", "CLI", "Audio Management"]
tags = ["PipeWire", "Arch Linux", "Sway"]
categories = ["Linux", "Wayland", "Audio"]
series = ["Minimalist Workflow", "PipeWire Mastery"]
[cover]
    image = "images/blog/2025/10/2025-10-27-pipewire-cli-audio-control-watermarked.avif"
    alt = "A terminal window open on a minimal Linux desktop showing successful PipeWire configuration commands."
+++

**Reclaiming true minimalism by moving audio device and volume management entirely from Pavucontrol to the command line in a modern Wayland environment.**

---

👋 Hey everyone,

If you’re anything like me, you strive for a state of pure minimalism in your Linux setup. I run **Arch Linux** with **Sway** on **Wayland**—a setup designed for maximum efficiency and zero bloat. Yet, for the longest time, one single graphical application remained stubbornly pinned to my workflow: **Pavucontrol**.

Pavucontrol, or PulseAudio Volume Control, is an absolute hero of Linux audio. It’s the visual map to the complex, multi-layered world of sound cards, sinks, sources, and profiles. In my recent setup, I discovered that the sound quality from my **"Digital Stereo (HDMI) Output"** profile was vastly superior (richer, cleaner, and louder) than the standard "Analog Stereo Output." But every time I rebooted, or sometimes even replugged my monitor, the system would revert. My minimalist sensibilities shuddered every time I had to launch a GTK application just to click a single dropdown menu.

This week, I decided enough was enough. My goal was simple: **Eliminate Pavucontrol entirely** by finding the command-line equivalent for every function, especially how to set my preferred HDMI profile permanently. I wanted a true, GUI-free audio experience, fully harnessing the power of **PipeWire** and its session manager, **WirePlumber**.

---

### My Goal This Week 🎯

My primary objective was to find a **permanent, declarative solution** for setting the **`Digital Stereo (HDMI) Output`** profile as the default for my "Built-in Audio" card. Secondary to this, I needed a set of fast, reliable CLI tools to handle basic day-to-day functions like volume up/down and muting—the functions I typically assigned to media keys. The solution had to respect the PipeWire architecture, meaning no reliance on legacy PulseAudio workarounds if a native PipeWire/WirePlumber solution existed.

The core challenge lay in the fact that while Pavucontrol works perfectly because PipeWire implements the PulseAudio protocol (`pipewire-pulse`), relying on `pactl` (the PulseAudio CLI) for permanent configuration felt like using a translation layer unnecessarily. I wanted to talk directly to PipeWire's brain, which is **WirePlumber**.

### The Process & The Code 👨‍💻

The journey began with introspection. I needed to understand what PipeWire calls my hardware and my preferred profile.

#### Phase 1: Identifying the Hardware and Profile

Since Pavucontrol was still installed (briefly!), I used it to confirm the exact profile name's canonical form. In the background, I used the native PipeWire tools to gather the necessary IDs.

**1. Listing Devices (Cards):**
I started with the recommended modern tool, `wpctl`.

~~~bash
wpctl status
~~~

This command gives a clean, hierarchical view. I identified my "Built-in Audio" card and its associated ID.

**2. Finding the Canonical Profile Name:**
Next, I needed the precise, machine-readable name for my desired profile, "Digital Stereo (HDMI) Output." I used the lower-level PipeWire CLI tool, `pw-cli`, which is invaluable for deep diving into the object graph.

~~~bash
# Replace <card-id> with the ID found from wpctl status
pw-cli inspect <card-id>
~~~

I scrolled through the massive output, looking for the `Spa:Pod:Object:Param:Profile` sections. I found that my "Digital Stereo (HDMI) Output" profile was identified as something like **`output:hdmi-stereo`**. This canonical name is crucial for the next step.

#### Phase 2: Setting the Profile Permanently with WirePlumber

The key to a **permanent** profile setting is not `pactl` or `wpctl` (which are typically for temporary, session-based changes) but creating a configuration rule for WirePlumber. WirePlumber is the PipeWire Session Manager responsible for loading, managing, and persisting device settings.

The solution involved placing a declarative configuration file in the user's WirePlumber directory:

**1. Create the WirePlumber Configuration Directory:**
~~~bash
mkdir -p ~/.config/wireplumber/wireplumber.conf.d/
~~~

**2. Create the Configuration File (`51-set-default-profile.conf`):**
I chose `51-` to ensure this rule loads relatively late, overriding any default behavior.

~~~bash
nano ~/.config/wireplumber/wireplumber.conf.d/51-set-default-profile.conf
~~~

**3. Define the Rule:**
I added the following rule, matching my device and forcing the profile name I found earlier.

~~~lua
monitor.alsa.rules = [
  {
    matches = [
      {
        # Match the Built-in Audio card. You can be more specific 
        # using 'device.name' (e.g., alsa_card.pci-0000_00_1f.3)
        device.nick = "Built-in Audio"
      }
    ]
    actions = {
      update-props = {
        # CRUCIAL: Set the canonical profile name found with pw-cli
        device.profile = "output:hdmi-stereo" 
      }
    }
  }
]
~~~

**4. Apply the Changes:**
A simple restart of the user's WirePlumber service was all it took.

~~~bash
systemctl --user restart wireplumber.service
~~~

After a full reboot, the profile remained locked to **Digital Stereo (HDMI) Output)**. Success! Pavucontrol was no longer required for this crucial task.

---

### Hitting The Wall 🧱

The biggest challenge was initially trying to force the profile using various permutations of `pactl` and `wpctl set-profile`. While these commands worked *temporarily*, I quickly realized they were only setting the profile for the current session. The session manager, WirePlumber, was still enforcing its own policies on startup, often defaulting to `Analog Stereo Duplex`.

This led me down a frustrating path of trying to disable WirePlumber's auto-profile-switching modules, which is messy and non-standard. The **breakthrough** came when I accepted that a minimalist, stable Wayland setup requires using the tools as designed: **WirePlumber is for policy and persistence; `wpctl`/`pactl` are for runtime control.** Trying to force persistence with a runtime command is swimming upstream against the intended PipeWire architecture. I realized that true CLI mastery here means using the declarative configuration file (`.conf` rule) instead of shell commands for permanent changes.

---

### The Breakthrough Moment ✨

The moment I realized the profile setting had to be a **WirePlumber rule** and not a standard CLI command was the turning point. This is a fundamental shift in mindset from the PulseAudio era, where you might hack the `default.pa` file. PipeWire and WirePlumber use a far more elegant, declarative rule-based system. By creating that simple `.conf` file, I established a **policy** that the system must follow, ensuring my preferred profile is loaded **before** any application starts and persists across reboots.

Once persistence was solved, the final piece was finding the perfect **CLI volume mixer** for my Sway media key bindings. I experimented with `pactl`, `wpctl set-volume`, and the dedicated utility `pamixer`.

I quickly settled on **`pamixer`**. Why?

1.  **Simplicity:** It's designed for quick, single-command actions.
2.  **No ID Guessing:** It targets the default sink without needing to constantly look up ID numbers.
3.  **Cross-Compatibility:** It uses the PulseAudio protocol but works flawlessly with PipeWire, making the commands robust and familiar.

My Sway configuration now uses these simple, robust commands:

~~~bash
# Volume up by 5%
exec pamixer --allow-boost -i 5

# Volume down by 5%
exec pamixer -d 5

# Toggle mute
exec pamixer -t
~~~

This final step removed the last lingering need for any audio GUI, completing my transition to a pure CLI audio workflow.

---

### 📚 Recommended Resource

When delving into the world of Linux audio, especially the complexities of PipeWire, JACK, and ALSA, having a foundational understanding of digital audio concepts is invaluable. I highly recommend the book **"The Art of Digital Audio"** by **John Watkinson**. This classic text dives deep into the physics and engineering behind sampling, quantization, DACs, and digital formats. Understanding *why* your "Digital Stereo (HDMI) Output" sounds better—which fundamentally comes down to the quality of the Digital-to-Analog Converter (DAC) in your external monitor/receiver versus the one on your motherboard—is crucial for making informed choices about your profiles and hardware. It’s the perfect companion to truly master your Linux audio stack, not just troubleshoot it. [Amazon](https://www.amazon.com/Digital-Audio-Third-John-Watkinson/dp/0240515870)

---

### Key Takeaways 📚
1.  💡 **Policy is Persistence:** For permanent PipeWire profile settings, use **WirePlumber rules** (`~/.config/wireplumber/wireplumber.conf.d/*.conf`) instead of temporary CLI commands like `wpctl set-profile`. This respects the system's intended architecture.
2.  ⚙️ **Use the Right Tool:** While `pactl` works for general control, **`pamixer`** is the cleanest, fastest utility for scripting volume up/down and mute actions in a minimal window manager like Sway. Use **`wpctl status`** for general system introspection.
3.  📚 **Digital vs. Analog:** The reason my **Digital Stereo (HDMI) Output** profile sounded better wasn't an arbitrary PipeWire setting, but a hardware reality: the **external DAC and amplifier** in my monitor/receiver are superior to the onboard DAC on my motherboard. Always try digital output if your receiving device has a good DAC.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/feh-to-swayimg-mastering-visual-workflow-on-sway-wayland/)

> What is the most frustrating GUI application you have successfully replaced with a pure CLI solution in your minimal Linux setup?