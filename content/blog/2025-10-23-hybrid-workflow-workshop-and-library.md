+++

date = 2025-10-23T16:01:23+03:00
publishDate = 2025-10-23T16:01:23+03:00
lastmod = 2025-10-23T16:01:23+03:00
ShowReadingTime = true
ShowToc = true
TocOpen = true


draft = false 


title = "My Hybrid AI Workflow: The Workshop and The Library"
author = "Murat Kurkoglu"
description = "Struggling to balance messy notebooks and clean code? I share my hybrid \"Workshop and Library\" model, blending Google Colab for research and a local IDE for production."
summary = "Struggling to balance messy notebooks and clean code? I share my hybrid \"Workshop and Library\" model, blending Google Colab for research and a local IDE for production."
images = ["images/blog/2025/10/2025-10-23-hybrid-workflow-workshop-and-library.avif"]
slug = "my-hybrid-ai-workflow-the-workshop-and-the-library"
keywords = ["Workflow", "Data Science", "Python", "Google Colab", "Development"]
tags = ["Workflow", "Data Science", "Python"]
[cover]
    image = "images/blog/2025/10/2025-10-23-hybrid-workflow-workshop-and-library.avif"
    alt = "A diagram illustrating a hybrid workflow, with arrows showing data and code moving from a cloud environment (library) to a local IDE (workshop)."
+++



**How I stopped fighting my tools and built a seamless development process by combining the power of Google Colab and a local IDE.**


👋 Hey everyone,

It’s been one of those weeks where a simple idea spirals into a complex web of code, data, and dependencies. I found myself caught in a familiar tug-of-war: the rapid, messy exploration in a Jupyter notebook versus the structured, disciplined coding required for a real project. For years, I felt like I had to choose a side. Was I a "notebook person" or an "IDE person"? The constant friction, the copy-pasting, the "it worked in Colab but broke locally" moments—it was exhausting and inefficient.

This week, I finally codified the mental model I’ve been using to bring peace to this chaos. I call it the "Workshop and Library" approach. It’s a hybrid model that treats Google Colab as my research library and my local development environment as my craftsman's workshop. This mental shift has transformed my productivity, and I want to share how it works.

---

### My Goal This Week 🎯
My primary goal was to take a promising but messy machine learning experiment from a Colab notebook and turn it into a reusable, version-controlled Python module. The experiment involved fine-tuning a small language model on a specific dataset. In Colab, it was a long, scrolling nightmare of cells. Locally, it needed to become a clean, importable script that I could integrate into a larger application.

The objective wasn't just to move the code; it was to create a repeatable process that clearly defines *when* and *why* to use each environment, eliminating the friction between them.

---

### The Two Arenas: The Library & The Workshop

Before diving into the process, let's define the roles of these two critical environments.

#### **The Library: Google Colab 📚**
I think of Google Colab as a massive, public library. It's a place I go to learn, explore, and experiment.

* **What it's for:**
    * **Rapid Prototyping:** Testing out a new algorithm or data processing technique without setting anything up.
    * **Data Exploration (EDA):** Loading a new dataset and quickly generating visualizations with Matplotlib or Seaborn.
    * **Access to Power:** Leveraging free GPU and TPU resources for model training that would melt my local machine.
    * **Collaboration:** Sharing a notebook with a colleague is as simple as sharing a Google Doc.

The Library is designed for speed and discovery. It’s okay for it to be a bit messy. Just like when you're in a real library, you might pull ten books off the shelf, read a chapter from each, and leave with a stack of photocopied notes. The goal is to learn and validate an idea quickly.

#### **The Workshop: My Local IDE 🛠️**
My local environment (I use Neovim, but this could be VS Code, PyCharm, etc.) is my workshop. This is where I take the promising ideas from the library and build something solid, reliable, and durable.

* **What it's for:**
    * **Serious Development:** Writing clean, modular, and testable code.
    * **Version Control:** Everything here lives in Git. Every change is tracked.
    * **Dependency Management:** Using `venv` or `Poetry` to create isolated, reproducible environments.
    * **Building the Final Product:** Integrating modules, building APIs, and creating the final application.

The Workshop is designed for precision and craftsmanship. Every tool has its place. The code written here is meant to last. It’s structured, documented, and tested.

---

### The Process & The Code 👨‍💻
The magic of this model lies in the workflow that connects the Library and the Workshop. It's a one-way street for promoting code from experimentation to production.

**Step 1: Exploration in The Library (Colab)**

I start with a new idea in a Colab notebook. For my project this week, it was loading a dataset, preprocessing it, and fine-tuning a model. The code was functional but ugly.

~~~python
# A typical "messy but it works" cell in Colab
import pandas as pd
from transformers import pipeline

# Hardcoded paths and magic numbers everywhere
df = pd.read_csv('/content/drive/MyDrive/data/raw_customer_feedback.csv')
df.dropna(inplace=True)
df['text'] = df['text'].apply(lambda x: x.lower().strip())

# Model is loaded right in the middle of the script
classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
results = classifier(list(df['text'][:50])) 
print(results)
~~~

**Step 2: The "Graduation" Ceremony**

Once the experiment proves successful, I declare it "graduated." This means the core logic is sound and ready to be moved to the Workshop. I explicitly stop further development in the notebook. Its purpose is complete.

**Step 3: Refactoring in The Workshop (Local IDE)**

Now, I move to my local machine. I don't just copy-paste. I refactor. I break the monolithic notebook script into logical functions and classes inside a structured project folder.

My project structure looks something like this:
my_sentiment_project/ ├── models/ │ └── distilbert_finetuned/ ├── scripts/ │ ├── init.py │ ├── data_preprocessor.py │ ├── model_loader.py │ └── predict.py ├── data/ │ └── raw/ │ └── customer_feedback.csv ├── requirements.txt └── main.py


The messy notebook cell from above becomes clean, reusable code in the Workshop.

~~~python
# scripts/data_preprocessor.py

import pandas as pd

def load_and_clean_data(file_path: str) -> pd.DataFrame:
    """Loads data from a CSV, drops nulls, and cleans text."""
    df = pd.read_csv(file_path)
    df.dropna(inplace=True)
    df['text'] = df['text'].apply(lambda x: str(x).lower().strip())
    return df

# scripts/model_loader.py
from transformers import pipeline, PreTrainedModel, PreTrainedTokenizer
from typing import Tuple

def get_model_pipeline(model_name: str = "distilbert-base-uncased-finetuned-sst-2-english") -> pipeline:
    """Initializes and returns a sentiment analysis pipeline."""
    return pipeline("sentiment-analysis", model=model_name)

# main.py
from scripts.data_preprocessor import load_and_clean_data
from scripts.model_loader import get_model_pipeline

DATA_PATH = "data/raw/customer_feedback.csv"

def main():
    print("Starting analysis...")
    df = load_and_clean_data(DATA_PATH)
    sentiment_pipeline = get_model_pipeline()
    
    # Analyze the first 50 entries
    texts_to_analyze = list(df['text'][:50])
    results = sentiment_pipeline(texts_to_analyze)
    
    for text, result in zip(texts_to_analyze, results):
        print(f"Text: {text[:40]}... | Sentiment: {result['label']} ({result['score']:.2f})")

if __name__ == "__main__":
    main()
~~~
This code is now testable, maintainable, and version-controlled with Git. The hardcoded paths are gone, and the logic is neatly separated.

---

### Hitting The Wall 🧱
The biggest challenge was fighting the urge to do "just one more thing" in the notebook. Notebooks are seductive; their interactive nature makes it easy to keep tweaking and adding code until you have an unmanageable monster. I had to be disciplined and enforce a strict rule: **The Library is for research, not for building.**

Another wall was managing dependencies. The Colab environment comes with many pre-installed packages, but my local environment is bare. This forced me to be deliberate about my `requirements.txt` file. I learned to use `pip freeze` more effectively and to create a new virtual environment (`python -m venv .venv`) for every new project in my Workshop. This initial setup feels slow compared to Colab's instant-on nature, but it saves countless hours of debugging later.

---

### The Breakthrough Moment ✨
The real breakthrough came when I stopped seeing Colab and my local IDE as competitors and started seeing them as two stages in a single pipeline.

1.  **Stage 1 (Research):** Use the Library (Colab) to explore freely and validate ideas quickly. The deliverable is not code; it's *knowledge*. The question to answer is: "Is this idea worth pursuing?"
2.  **Stage 2 (Production):** Once the answer is "yes," move to the Workshop (local IDE). The deliverable here is *robust code*. The goal is to build something reliable and maintainable.

This two-stage mindset creates a clear separation of concerns. It gives me the freedom to be messy and creative when I need to be, and structured and disciplined when it counts. GitHub acts as the bridge and the ultimate source of truth for all Workshop projects.

---

### 📚 Recommended Resource
As I was refactoring my notebook code into clean, modular functions, I was constantly reminded of the principles in a book that fundamentally changed how I write code: **"Clean Code: A Handbook of Agile Software Craftsmanship"** by Robert C. Martin (Uncle Bob).

This book is an absolute must-read for any developer. It's not about a specific language or framework; it's about the timeless principles of writing software that is easy to read, understand, and maintain. It provides actionable advice on everything from naming variables and writing functions to handling errors and structuring classes. If you've ever felt the pain of trying to understand your own code from six months ago, this book is your remedy. It's the perfect companion for turning messy "Library" discoveries into pristine "Workshop" creations. [Amazon](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

### Key Takeaways 📚
1.  💡 **Assign Strict Roles:** Treat your cloud notebook environment as a "Library" for research and your local IDE as a "Workshop" for building. Don't build in the library.
2.  ⚙️ **Use Git as the Source of Truth:** All code that leaves the "Library" must be committed to a Git repository in the "Workshop." This prevents code divergence and creates a single, reliable source.
3.  📚 **Refactor, Don't Just Copy:** The move from notebook to script is an opportunity to improve. Break down large cells into small, single-responsibility functions. This is where real software engineering begins.

---

### Thanks for Following ☕
This workflow has brought a sense of calm and order to my projects. It allows me to leverage the best of both worlds—the power and convenience of the cloud with the control and rigor of local development.

☕ If you found this guide helpful, you can
 [Buy Me a Coffee](https://buymeacoffee.com/orioninsist)!
[Medium](https://orioninsist.medium.com/subscribe)
[Etsy](https://www.etsy.com/shop/orioninsist)
[LinkedIn](https://www.linkedin.com/company/orioninsist/)
[Read More](https://orioninsist.org/blog/installing-jellyfin-in-a-debian-lxc-container/)

> How do you manage the transition from experimental code to production-ready scripts in your own projects? Share your strategies in the comments!