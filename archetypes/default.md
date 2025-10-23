+++
# --- Core Content Info ---
title = '{{ replace .Name "-" " " | title }}'
author = "Murat Kurkoglu"

# --- Date Management ---
date = {{ .Date }}
publishDate = {{ .Date }}
lastmod = {{ .Date }}

# --- SEO & Social Sharing ---
description = "" 
summary = ""
images = [] # For social media preview cards
slug = "" 
keywords = []

# --- Content Classification ---
tags = []

# --- Publication Control ---
# Remember to set to 'false' to publish
draft = true 

# --- Theme Settings (Appearance) ---
ShowReadingTime = true
ShowToc = true
TocOpen = false
[cover]
    image = "" 
    alt = "" # Filling this field is crucial for SEO
    relative = true
+++