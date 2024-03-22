---
title: "Embarking on the Journey of Containers With Docker Essential Commands"
date: 2024-03-22T20:15:47+03:00
draft: false
author: "orioninsist"
type: "blog"
slug: "embarking-on-the-journey-of-containers-with-docker-essential-commands"
tags: ["docker","command"]
keywords: ["docker","command"]
language: "english"
description: "Unleash the power of Docker! This guide equips you with the fundamental commands to manage and navigate the world of containerized applications. Learn how to install, run, manage, and explore containers, all within a user-friendly format."
cover:
     image: "/blog/2024-03/embarking-on-the-journey-of-containers-with-docker-essential-commands.png"
     alt: "embarking-on-the-journey-of-containers-with-docker-essential-commands" 
---

Docker has become a cornerstone in the modern software development landscape. It empowers developers to package and run applications in a consistent and portable manner, irrespective of the underlying infrastructure. This guide serves as a gentle introduction to Docker, delving into the essential commands that will kickstart your journey into the world of containers.

## 1. Verifying Docker Installation:

The first step is to verify that Docker is installed on your system. Run the following command:
```shell
sudo docker --version
```

This command displays the installed Docker version.

## 2. Running the "Hello World" Application:

To experience the magic of Docker firsthand, let's run the "hello-world" application:

```shell
sudo docker run hello-world
```

This command fetches the "hello-world" image from Docker Hub and executes it, displaying a simple message on your console.

## 3. Listing Running Containers:

Docker allows you to manage multiple containers simultaneously. To view a list of all running containers, use the following command:

```shell
sudo docker ps
```

This command displays a table with information about each running container, including its ID, image name, status, and ports.

## 4. Launching an Interactive Container:

One of Docker's key features is the ability to run applications in an isolated environment. To experience this, let's launch an interactive container based on the Ubuntu image:

```shell
sudo docker run -it ubuntu bash
```

This command not only starts the container but also provides you with a terminal inside the container, allowing you to execute commands and interact with the system as if it were a regular machine.

## 5. Searching for Images:

Docker Hub, a public registry, hosts a vast collection of images. You can search for images by name, description, or other criteria using the following command:

```shell
sudo docker search ubuntu
```

This command searches for images containing the keyword "ubuntu" and displays a list of relevant results.

## 6. Running a Command Inside a Container:

Often, you may want to run specific commands within a container. To achieve this, you can combine the run command with the -it flag and specify the desired command:

```shell
sudo docker run -it ubuntu bash
sudo apt-get update
```

This example updates the package list inside the Ubuntu container.

## 7. Diving Deeper with docker info:

For a comprehensive overview of your Docker environment, use the info command:

```shell
sudo docker info
```

This command provides detailed information about the Docker daemon, including its configuration, network settings, and storage options.

## 8. Exploring All Containers:

By default, docker ps only lists running containers. To view all containers, including those that have stopped, use the -a flag:

```shell
sudo docker ps
sudo docker ps -a
```

The first command displays only running containers, while the second command shows both running and stopped containers.

## 9. Alternative Listing Formats:

Docker provides various options for customizing the output of the docker ps command. The -l flag allows you to specify the desired format, such as JSON or table:

```shell
sudo docker container ls
sudo docker container ls -a
```

The container ls command is an alias for docker ps. The first command lists all running containers in a table format, while the second command, with the -a flag, lists all containers (running and stopped) in a table format.

## 10. Mastering Container Management:

Now that you've gained familiarity with basic commands, let's delve into container management, covering operations such as starting, stopping, removing, and restarting containers.

## 11. Initiating a Container:

To start a container, use the run command with the -it flag for an interactive session:

```shell
sudo docker run -it centos bash
```

This command starts a container based on the CentOS image and provides you with a terminal inside the container.

## 12. Halting a Container:

To stop a running container, use the stop command:

```shell
sudo docker stop <container_id>
```

Replace <container_id> with the ID of the container you want to stop.

## 13. Removing a Container:

Once you're done with a container, you can remove it using the rm command:

```shell
sudo docker rm <container_id>
```

This command removes the specified container from your system.

## 14. Restarting a Container:

To restart a stopped container, use the restart command:

```shell
sudo docker restart <container_id>
```

This command restarts.

