+++
title = "{{ replace .Name "-" " " | title }}"
date = {{ .Date }}
lastmod = {{ .Date }}
draft = true
# --- Basic Information ---
author = "Murat Kurkoglu"

# --- SEO Settings (Crucial Section) ---
description = "" # Summary for Google search results, 140-156 characters (TO BE FILLED)
slug = "" # SEO-friendly, permanent URL that should NEVER change (TO BE FILLED)

# --- Organization ---
tags = []
keywords = []
# series = ["Series Name"] # Uncomment this line if the post is part of a series

# --- Publication Control ---
draft = true # Safety measure. Set to 'false' when the post is ready to be published.

# --- Theme Settings (Papermod) ---
ShowReadingTime = true
ShowToc = true
TocOpen = false

# --- Cover Image ---
[cover]
    image = "" # Path to the cover image (e.g., "images/slug-name.png") (TO BE FILLED)
    alt = "" # SEO-friendly description for the image (TO BE FILLED)
    relative = true
+++    
