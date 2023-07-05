---
title: "How to Build a Simple Client-Server Chat Application in Python"
date: 2023-07-05T12:36:53+03:00
draft: false
description: "Learn how to build a Python client-server chat app! 🚀📲 Discover the essentials of client-server communication and create your own chat application. #python #networking #programming"
tags: ["python","networking","programming"]
keywords: ["python","networking,"programming"]
author: ["orioninsist"]
cover:
    image: "/projects/cyber-security-applications-with-python/part4-feature-image.png"
---

## Introduction

The client-server architecture is a commonly used model in many network-based applications. In this model, a client connects to and communicates with a server. The client sends a message to the server, which processes it and then sends a response back to the client. Python's socket module is a powerful tool for creating such client-server applications. In this blog post, we will show you how to build a basic client-server chat application.

  

## Development

First, let's examine the Python code that includes the necessary socket functions to establish a connection between the client and server.

  

```python

## client.py

import socket

  

host = '127.0.0.1'

port = 50001

  

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

client_socket.connect((host, port))

  

message = input(">> ")

  

while message.lower().strip() != "quit":

client_socket.send(message.encode())

data = client_socket.recv(1024).decode()

print("Response from Server: " + str(data))

message = input(">> ")

  

client_socket.close()

  

```

  

In this code, the client creates a TCP socket and connects to the server using the specified IP address and port. It then prompts the user to enter a message and sends it to the server. It receives the response from the server, prints it to the console, and continues the loop until the user types "quit" to exit.

  

Next, let's examine the server-side code.

  

```python

## server.py

import socket

  

host = '127.0.0.1'

port = 50001

  

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server_socket.bind((host, port))

server_socket.listen()

  

conn, addr = server_socket.accept()

print("Connected from: " + str(addr))

  

while True:

data = conn.recv(1024).decode()

print(data)

response_data = "Message Received"

conn.send(response_data.encode())

  

conn.close()

  

```

  

In this code, the server creates a TCP socket and listens for incoming connections on the specified IP address and port. It accepts the connection from the client, receives the message from the client, prints it to the console, and sends back the "Message Received" response. It continues to wait for new messages.

  

Conclusion: Using the above code, we can create a basic client-server chat application. The client and server can exchange text-based messages. Now, let's take a look at how to use the application.

  

## Code Explanation

  

```markdown

**client.py**

  

- We import the socket module with `import socket`.

- The variables `host = '127.0.0.1'` and `port = 50001` specify the IP address and port number to connect to the server.

- We create a new socket object with `client_socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)`.

- We connect to the server using `client_socket.connect((host,port))`.

- To get input from the user, we use `message = input(">> ")`.

- It enters into a loop and runs until the user enters "quit":

- It sends the entered message to the server by encoding it: `client_socket.send(message.encode())`

- It receives data from the server and prints it: `data = client_socket.recv(1024).decode()`

- It prompts for a new message: `message = input(">> ")`

- It closes the connection: `client_socket.close()`

  

**server.py**

  

- Similarly, we first import the socket module (`import socket`).

- Then, we specify which IP address and port number that our server will listen on (`host = '127.0.0.1'`, `port = 50001`).

- We create a new socket object with `server_socket = socket.socket(socket.AF_INET,socket.SOCK_STREAM)`.

- We bind to the specified IP address and port number using `server_socket.bind((host,port))`.

- We make our server listen for incoming connections with `server_socket.listen()`.

- When a client connects (`conn,addr = server_socket.accept()`), it prints "connected from :"+str(addr) on screen.

  

```

  

## Example Usage

  

1. Start the server.py file. The server will start listening on the specified IP address and port.

2. Next, start the client.py file. The client will connect to the server and prompt you to enter a message.

3. Type a message and press Enter.

4. The server will receive the message, print it to the console, and send a "Message Received" response.

5. The client will receive the response from the server and print it to the console.

6. You can repeat steps 3-5 to send as many messages as you want.

7. To exit, type "quit" in the client and press Enter.

  

In this example, the client and server are configured to run on the same machine (localhost). However, if you want to run them on different machines, you will need to provide different IP addresses for the server and client.

  

In conclusion, we have built a simple client-server chat application using Python's socket module. This example can provide a basic understanding of client-server communication and serve as a foundation for developing more complex applications.

  

## GitHub

  

To learn more about the project and explore its source code, documentation, and additional resources, I highly recommend visiting the GitHub repository at

  

[GitHub](https://github.com/orioninsist/cyber-security-applications-with-python)

  

I hope this blog post provides you with essential insights into Python's socket library and explains its use cases comprehensively. Happy coding!

  

I invite you to join me on this exciting adventure as we dive deeper into the realm of cybersecurity with Python. Stay tuned for the upcoming blog posts where we’ll explore advanced topics and discover new ways to leverage Python for cybersecurity applications.

  

Thank you for your continued support, and I’m excited to have you on this enriching journey!

  

Sincerely, Founder of orioninsist

  

Follow the white rabbit

  

### Thank you for your support!

  

Hello friends! I want to express my gratitude for your support. Your interest and encouragement mean a lot to me. To keep our connection strong and to provide you with more valuable content, I encourage you to stay connected with me on my social media platforms.

  

I am excited to share more content with you through these platforms and I value your engagement and feedback. Thank you once again for your support. Let's stay connected and keep the conversation going!

  

Your feedback and engagement mean the world to me. Thank you once again for your unwavering support.

Let's continue to "follow the white rabbit" and discover new horizons together!

  

**Best regards,**

  

Muhammet Murat Kurkoglu\

Founder of **orioninsist**

  

[Google Survey Forms](https://forms.gle/4HFFXTpnesjA7jrY8)

  

### Stay connected with me

  

🔗 [Patreon](https://www.patreon.com/orioninsist)

🔗 [Buymeacoffee](https://www.buymeacoffee.com/orioninsist)

🔗 [Instagram](https://www.instagram.com/insistorion/)

🔗 [Twitter](https://twitter.com/InsistOrion/)

🔗 [Facebook](https://www.facebook.com/insistorion)

🔗 [Pinterest](https://www.pinterest.com/orioninsist/)

🔗 [Website](https://orioninsist.org/)

🔗 [GitHub](https://github.com/orioninsist)

🔗 [YouTube](https://www.youtube.com/@orioninsist-official/)

🔗 [Medium](https://orioninsist.dev/)

🔗 [LinkedIn](https://www.linkedin.com/in/muhammet-murat-kurkoglu/)

🔗 [LinkedIn](https://www.linkedin.com/company/orioninsist/)