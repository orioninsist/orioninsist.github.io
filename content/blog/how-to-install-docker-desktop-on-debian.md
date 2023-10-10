---
title: "How to Install Docker Desktop on Debian"
date: 2023-10-08T23:20:30+03:00
draft: false
author: "orioninsist"
type: "blog"
slug: "how-to-install-docker-desktop-on-debian"
keywords: ["devops","container","docker","linux","debian"]
tags: ["devops","container","docker","linux","debian"]
desciption: "Learn how to install Docker on your Debian-based system quickly for efficient containerization" 
language: "English"
cover:
     image: "/blog/how-to-install-docker-desktop-on-debian.png"
     alt: "how-to-install-docker-desktop-on-debian"
---

Docker is a powerful platform that allows you to develop, ship, and run applications inside containers. Installing Docker on Debian is a straightforward process, and in this guide, we'll walk you through the steps to get Docker Desktop up and running on your Debian-based system.

* Prerequisites
Before we begin, make sure you have the following prerequisites in place:

A Debian-based system (such as Debian itself or Ubuntu)
Administrative (sudo) privileges

#### Step 1: Adding Docker's Official GPG Key
To ensure the authenticity of Docker packages, we'll add Docker's official GPG key to your system. This key is used to verify the integrity of downloaded packages.
```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```
#### Step 2: Adding the Docker Repository
Next, we'll add Docker's official repository to your system's package sources. This repository contains the Docker packages you need.
```bash
echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
#### Step 3: Updating Package Lists
After adding the Docker repository, update the package lists to include the newly added Docker packages.
```bash
sudo apt-get update
```
#### Step 4: Installing Docker
Now that the package lists are updated, it's time to install Docker and its components:
```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
#### Step 5: Testing Docker Installation
To verify that Docker is installed correctly, run a simple test by executing the following command:
```
sudo docker run hello-world
```
If everything is set up properly, you will see a message indicating that your Docker installation is working correctly.

#### Docker and Docker Compose Version Information
```bash
$ docker compose version
Docker Compose version v2.17.3

$ docker --version
Docker version 23.0.5, build bc4487a

$ docker version
Client: Docker Engine - Community
 Cloud integration: v1.0.31
 Version:           23.0.5
 API version:       1.42
<...>
```
* docker --version: This command displays the version and build number of Docker Engine. For example, you might get an output like "Docker version 23.0.5, build bc4487a." This output specifies the installed version of Docker Engine.

* docker version: It provides more details about Docker Engine, including both client and server versions. It also shows the Docker API version and other details. For instance, you might see "API version: 1.42" in the output.

* docker-compose version: This command reveals the version of Docker Compose. For example, you might get an output like "Docker Compose version v2.17.3." This version specifies the installed version of Docker Compose.

These commands are used to determine which versions of Docker and Docker Compose are installed and to display information about their capabilities. Docker Compose is a tool used for defining and running multi-container applications, while Docker is a containerization platform used for creating and running containers. Using these commands, you can check the versions of Docker and Docker Compose installed on your system without any issues.

#### Enabling Docker to Start at Boot
```bash
sudo systemctl enable --now docker
```
The command sudo systemctl enable --now docker is used to enable the Docker service to start automatically at boot time on a Linux system using systemd, the init system commonly used on modern Linux distributions.

Here's what each part of the command does:

* sudo: It is used to run the following command with superuser privileges, which are typically required for system-level configurations.

* systemctl: This is a command used to manage systemd, which is the init system responsible for managing services and processes on a Linux system.

* enable: This option tells systemctl to enable the specified service. Enabling a service means that it will start automatically at system boot time.

* --now: This option is used in conjunction with enable to not only enable the service but also start it immediately. It ensures that the service is active right away.

* docker: This is the name of the service we want to enable and start, in this case, the Docker service. When you run this command, it ensures that the Docker service will be started automatically every time the system boots up.

Enabling Docker to start at boot is important because it allows Docker containers to be managed and run as soon as the system starts, ensuring that your containerized applications are available without manual intervention.
#### Docker Commands
Docker is an essential tool for container-based application development and deployment. In this article, we'll explore two crucial Docker commands: docker ps -a and docker run -it debian bash. Both commands help us utilize Docker's fundamental capabilities and are valuable when working with containers.
```bash
docker ps -a
```
This command lists all Docker containers and their historical states. Here's a detailed explanation:

docker ps: This command lists only the running Docker containers, providing an overview of the containers currently active.

docker ps -a: The -a or --all flag is used to list all Docker containers, including both running and exited ones. This is crucial for examining the historical states of containers and potentially restarting them when needed.
```bash
sudo docker run -it debian bash
```
This command allows you to start a new Docker container and interactively access its shell. Here's a breakdown of this command:

* docker run: This command is used to initiate a new Docker container.

* -it: These flags enable an interactive terminal session within the container. -i enables interactive mode, while -t allocates a terminal.

* debian: This specifies the name of the Docker image to be launched. In this example, we are using a Debian Linux-based container.

* bash: This specifies the command to run within the launched container. In this case, we are starting a bash shell, allowing us to interact with the container's environment and execute commands.

By using this command, you can launch a new Debian Linux container and access an interactive shell inside it. This enables you to work within the container, facilitating various development and debugging tasks.

These two Docker commands are frequently used for basic container operations, making them valuable tools when working with Docker.

#### Conclusion
Congratulations! You have successfully installed Docker Desktop on your Debian-based system. Docker is now ready to help you manage containers and streamline your development process. Start exploring the world of containerization and take full advantage of Docker's capabilities.

Happy containerizing! 
