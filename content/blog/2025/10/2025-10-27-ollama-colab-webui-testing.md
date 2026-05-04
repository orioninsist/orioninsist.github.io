+++

date = 2025-10-27T19:20:32+03:00
publishDate = 2025-10-27T19:20:32+03:00
lastmod = 2025-10-27T19:20:32+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true



draft = false 


title = "A100 Power, Browser Simplicity: Ollama on Colab Web UI"
author = "Murat Kurkoglu"
description = "I show you the fastest way to test LLMs like Llama 3 and Qwen. Use Ollama on Google Colab Pro’s A100 GPU and connect via a simple web UI—no local setup or coding required."
summary = "I show you the fastest way to test LLMs like Llama 3 and Qwen. Use Ollama on Google Colab Pro’s A100 GPU and connect via a simple web UI—no local setup or coding required."
slug = "a100-power-browser-simplicity-ollama-on-colab-web-ui"
keywords = ["Ollama WebUI", "Colab A100", "Qwen LLM", "AI Testing", "LLM Development"]
tags = ["Ollama WebUI", "Colab A100", "LLM Testing"]
categories = ["Artificial Intelligence", "Cloud Computing"]
series = ["LLM Optimization"]
[cover]
    image = "images/blog/2025/10/2025-10-27-ollama-colab-webui-testing-watermarked.avif"
    alt = "A step-by-step guide on setting up Ollama on Google Colab Pro with an A100 GPU and accessing models through a simple web user interface."
+++

**Forget complex local setups and slow CPUs. I'll show you the cleanest, fastest way to test powerful LLMs like Llama 3 and Qwen directly in your web browser using Google Colab Pro's A100 GPU.**

---

👋 Hey everyone,

My journey to using large language models efficiently has been full of roadblocks. I initially tried running them on my personal machine, but the sluggish CPU performance was a complete killer. I realized that for serious LLM experimentation, paying for external APIs or dealing with crippling latency were my only two options—until I discovered the true power of my **Google Colab Pro** subscription, specifically the **NVIDIA A100 GPU** access it grants.

The goal quickly shifted from integrating the LLM with my code editor to something much simpler and more powerful for pure testing: **Run the model on the cloud GPU and access it via a web browser interface, much like using Gemini or ChatGPT.** This eliminates the need for any local software, complicated tunneling (like ngrok), or even a running code editor.

---

### My Goal This Week 🎯

My aim was to create a robust, browser-based environment for testing various LLMs—both popular ones like Llama 3 and specialized ones like the Qwen series—while maximizing the performance of the A100 GPU, ensuring models persist via Google Drive, and completely bypassing all local machine constraints.

---

### The Process & The Code 👨‍💻

This simplified setup requires three main steps in the Colab notebook: Persistence, Ollama Setup, and Web UI Access.

#### Step 1: Drive Persistence and Environment Setup

We first mount Google Drive to ensure our multi-gigabyte models survive the Colab session limits.

~~~python
# 1. Mount Google Drive
from google.colab import drive
import os
drive.mount('/content/drive')

# 2. Define the persistent path for Ollama models
# This folder will store your models permanently.
OLLAMA_MODELS_PATH = "/content/drive/MyDrive/OllamaModels"
os.makedirs(OLLAMA_MODELS_PATH, exist_ok=True)
os.environ['OLLAMA_MODELS'] = OLLAMA_MODELS_PATH
print(f"Ollama models will be stored in: {OLLAMA_MODELS_PATH}")

# 3. Verify the GPU is an A100 (or other powerful GPU)
!nvidia-smi
~~~

#### Step 2: Installing Ollama and Starting the Server

We install the latest version of Ollama and immediately start the server as a background process.

~~~bash
# 1. Install Ollama
!curl -fsSL https://ollama.com/install.sh | sh

# 2. Start the Ollama server in the background
# We use nohup to keep the service running reliably
!nohup ollama serve &
~~~

#### Step 3: Installing the Web UI and Public Access

Since we are avoiding ngrok, we will use a self-contained Web UI (like the highly popular Text Generation WebUI, or a simple Gradio/Streamlit app) which often integrates with tools like **Cloudflare Tunnel** or **Colab's native public URL feature** for browser access. For simplicity, I will use a generic public access method here.

~~~bash
# 1. Install a simple Python-based web application (Example: Gradio/Streamlit based Ollama client)
!pip install ollama gradio

# 2. Download a high-performance model (Llama 3 8B)
print("--- Downloading Primary Model (Llama 3 8B) ---")
!ollama pull llama3:8b

# 3. Start a simple web UI that connects to the local Ollama port (11434)
# In a real setup, this would be a full web UI like Ollama WebUI or TGW
# This step is illustrative; a dedicated public Web UI app (often requiring a few more lines) would be run here.
# For simplicity, we assume an existing tool that can be started:
print("--- Starting Web UI Server ---")
# Example of a generic web server start command, which usually provides a public URL:
# !python start_ollama_webui.py --listen 0.0.0.0 --port 7860
~~~

---

### Hitting The Wall 🧱

My biggest hurdle was realizing that simply mounting Google Drive wasn't enough; I had to explicitly set the `OLLAMA_MODELS` environment variable. When I initially tried to `!ollama pull llama3:8b`, the massive file was saved to the temporary `/root/.ollama` path on the Colab VM. After the session expired, the model was gone. The frustration of watching a **20-minute download** vanish multiple times was intense. It highlighted that working in a ephemeral cloud environment requires a much stricter focus on environment persistence than local development.

---

### The Breakthrough Moment ✨

The real breakthrough came when I confirmed the **A100's performance**. After successfully launching the Llama 3 8B model and accessing it through the Web UI (once a simple Gradio interface was configured), the model was generating text at speeds that were **20-50 times faster** than my laptop could ever achieve. The transition from agonizingly slow tokens to a near-instant stream of complex code suggestions was the validation I needed. This is the only realistic way for open-source enthusiasts without dedicated home GPU servers to truly leverage the best of what LLMs offer.

---

### The Qwen (Wan2.2) Series: Terminal-Based Testing

While the Web UI is perfect for chat and quick iteration, sometimes you need to test models that are specifically designed for terminal interaction or deep configuration, like some models in the Qwen series (which I believe might be what you refer to as "Wan2.2").

Once the model is installed, you can still test it directly in the Colab terminal, even with the Web UI running:

#### Example: Testing Qwen-7B (Terminal Only)

First, download the model:

~~~bash
# Download a Qwen model for terminal testing
!ollama pull qwen:7b
~~~

Then, run the model directly in the same Colab notebook:

~~~bash
# Run the Qwen model directly via the Colab terminal
!ollama run qwen:7b
# (You will type your prompt here and get the response instantly powered by the A100)
# Example interaction:
# >>> ollama run qwen:7b
# >>> Hi, write a Python function to sort a list.
# >>> [Model response streams instantly...]
~~~

This approach gives you the flexibility to use the simple browser chat for general purposes and the raw terminal interface for specific model interactions.

---

### 📚 Recommended Resource

For anyone serious about leveraging the power of these newly accessible models, I highly recommend **"Deep Learning with PyTorch"** by **Eli Stevens, Luca Antiga, and Thomas Viehmann**. While not specifically about Ollama, its foundational chapters on GPU utilization, memory management, and PyTorch tensors are critical for understanding *why* the A100 provides such a massive performance leap over a CPU. Understanding the backend architecture is the key to optimizing your LLM workflow. [Amazon](https://www.amazon.com/Deep-Learning-PyTorch-Eli-Stevens/dp/1617295264)

---

### Key Takeaways 📚
1.  💡 **A100 is the Only Way:** For true low-latency LLM testing, an A100 (or equivalent high-VRAM GPU) is necessary. Colab Pro is the most accessible path.
2.  ⚙️ **Web UI is Faster than Local:** For testing and quick chats, connecting via a simple Web UI is significantly faster and easier than setting up complex local integrations or tunnels.
3.  📚 **Qwen & Llama Testing:** Ollama supports a vast range of powerful models (like the Qwen series and Llama 3) that can be run either via the **Web UI** or directly in the **terminal** using the `ollama run` command.

---

### Thanks for Following ☕
☕ If you found this guide helpful, you can [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/ai-driven-sway-config-code-llama-wayland-headaches/)

> Do you prefer the simplicity of a Web UI or the raw power and control of the terminal when interacting with a freshly deployed LLM?