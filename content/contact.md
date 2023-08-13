---
title: "Contact"
date: 2023-08-12T10:37:53+03:00
draft: false
---


<form action="/contact" method="post">
  <label for="name">Name:</label><br>
  <input type="text" id="name" name="name" required><br><br>
  
  <label for="email">E-mail:</label><br>
  <input type="email" id="email" name="email" required><br><br>
  
  <label for="message">Enter a message:</label><br>
  <textarea id="message" name="message" rows="4" required></textarea><br><br>
  
  <button type="submit">Send</button>
</form>