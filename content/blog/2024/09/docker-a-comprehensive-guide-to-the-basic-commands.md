---
title: "Docker a Comprehensive Guide to the Basic Commands"
date: 2023-11-04T10:03:08+03:00
draft: false
author: "orioninsist"
type: "blog"
slug: "docker-a-comprehensive-guide-to-the-basic-commands"
keywords: ["docker","devops"]
tags: ["devops","docker"]
description: "Learn the basics of Docker with this comprehensive guide to the most important commands."
language: "English"
cover:
     image: "/project/devops/2023/2023-11/docker-a-comprehensive-guide-to-the-basic-commands.png"
     alt: "docker-a-comprehensive-guide-to-the-basic-commands"
---

Docker is a powerful tool for containerizing applications. It allows developers to package their applications and all their dependencies into a single image, which can then be run on any machine that has Docker installed.

This guide will teach you the basic Docker commands you need to get started with containerization. We will cover the following topics:

- What is Docker?
- Docker commands
- Understanding the output of Docker commands
- Troubleshooting Docker problems

## What is Docker?

Docker is a containerization platform that allows you to package your application and all its dependencies into a single image. This image can then be run on any machine that has Docker installed.

Containerization is a way of packaging an application and its dependencies into a single unit that can be run on any machine. This makes it easy to deploy and manage applications, as you don't need to worry about the underlying operating system or hardware.

## Docker commands

Docker provides a number of commands that you can use to manage your containers. These commands are used to create, start, stop, and delete containers.

The following is a list of the basic Docker commands:
```markdown
docker info: Displays information about the Docker daemon
docker ps: Lists all running containers
docker run: Creates and starts a container
docker stop: Stops a container
docker rm: Deletes a container
```
``` bash
docker info
```
The Docker info command displays information about the Docker daemon, including the following:
```bash
Client version and context
Server version and storage driver
Number of running, paused, stopped, and dead containers
Number of images
Kernel version and operating system
Number of CPUs and total memory
Docker root directory
The output of the info command can be used to troubleshoot Docker problems and to verify that Docker is installed and configured correctly.

Here is an explanation of the output of the info command in your example:

Client:
 Version:  24.0.7
 Context:  default
 Debug Mode: false

Server:
 Containers: 0
 Running: 0
 Paused: 0
 Stopped: 0
 Images: 0
 Server Version: 24.0.7
 Storage Driver: overlay2
 Backing Filesystem: extfs
 Supports d_type: true
 Using metacopy: true
 Native Overlay Diff: false
 userxattr: false  Logging Driver: json-file
 Cgroup Driver: systemd
 Cgroup Version: 2
 Plugins:
 Volume: local
 Network: bridge host ipvlan macvlan null overlay
 Log: awslogs fluentd gcplogs gelf journald json-file local logentries splunk syslog
 Swarm: inactive
 Runtimes: io.containerd.runc.v2 runc
 Default Runtime: runc
 Init Binary: docker-init
 containerd version: 8e4b0bde866788eec76735cc77c4720144248fb7.m
 runc version:
 init version: de40ad0
 Security Options:
 seccomp
  Profile: builtin
 cgroupns
 Kernel Version: 6.5.9-arch2-1
 Operating System: Arch Linux
 OSType: linux
 Architecture: x86_64
 CPUs: 4
 Total Memory: 15.42GiB
 Name: arch
 ID: 0260f88a-7b0a-4248-a54e-dfce26c90f0e
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 Experimental: false
 Insecure Registries:
 127.0.0.0/8
 Live Restore Enabled: false
Client: This section shows the version of the Docker client that you are using.
Server: This section shows the version of the Docker daemon that is running on your computer. It also shows information about the storage driver, logging driver, Cgroup driver, and plugins.
Security Options: This section shows the security options that are enabled for Docker.
Kernel Version: This section shows the version of the Linux kernel that is running on your computer.
Operating System: This section shows the name of the operating system that you are using.
OSType: This section shows the type of operating system that you are using (e.g., Linux, Windows, macOS).
Architecture: This section shows the architecture of your computer (e.g., x86_64, amd64, arm64).
CPUs: This section shows the number of CPUs on your computer.
Total Memory: This section shows the total amount of memory on your computer.
Name: This section shows the name of your Docker host.
ID: This section shows the ID of your Docker host.
Docker Root Dir: This section shows the directory where Docker stores its data.
Debug Mode: This section shows whether or not Docker debug mode is enabled.
Experimental: This section shows whether or not Docker experimental features are enabled.
Insecure Registries: This section shows a list of insecure registries that Docker can connect to without warning.
Live Restore Enabled: This section shows whether or not live restore is enabled for Docker.
```
```bash
sudo docker ps
```
The sudo docker ps command lists all of the containers that are currently running on your computer. The output of the command includes the following information for each container:
```markdown
CONTAINER ID: The unique identifier for the container.
IMAGE: The name of the image that the container is based on.
COMMAND: The command that was used to start the container.
STATUS: The current status of the container.
PORTS: The ports that are exposed by the container.
NAMES: The name of the container.
For example, the following output shows two containers that are currently running:

CONTAINER ID        IMAGE               COMMAND                 STATUS              PORTS                NAMES
a03994666510        ubuntu:latest       /bin/bash               Up 2 minutes          0.0.0.0:8080->80/tcp   my_container_1
b3728484970f        nginx:latest       nginx -g daemon off;   Up 1 minute          0.0.0.0:80->80/tcp   my_container_2
```
The sudo docker ps command can be used to troubleshoot problems with containers, to identify containers that are running, and to get information about the containers that are currently running on your computer.

Here are some of the options that can be used with the sudo docker ps command:
```markdown
-a: Lists all containers, including stopped containers.
-l: Lists only the latest container.
-n: Lists the specified number of containers.
-q: Lists only the container IDs.
-f: Filters the output based on a specified criteria. For example, to list only containers that are running, you would use the following command:
sudo docker ps -f status=running
```
```bash
sudo docker ps -a
```

The sudo docker ps -a command lists all of the containers that are currently running or stopped on your computer. The output of the command includes the same information as the sudo docker ps command, but it also includes stopped containers.

For example, the following output shows two containers, one running and one stopped:
```markdown
CONTAINER ID        IMAGE               COMMAND                 STATUS              PORTS                NAMES
a03994666510        ubuntu:latest       /bin/bash               Up 2 minutes          0.0.0.0:8080->80/tcp   my_container_1
b3728484970f        nginx:latest       nginx -g daemon off;   Up 1 minute          0.0.0.0:80->80/tcp   my_container_2

CONTAINER ID        IMAGE               COMMAND                 STATUS              PORTS                NAMES
4294967296        ubuntu:latest       /bin/bash               Exited (0) 10 seconds ago                         my_container_3
```
The sudo docker ps -a command can be used to troubleshoot problems with containers, to identify containers that are running or stopped, and to get information about all of the containers that are currently on your computer.

Here are some of the options that can be used with the sudo docker ps -a command:
```markdown
-f: Filters the output based on a specified criteria. For example, to list only containers that are running, you would use the following command:
sudo docker ps -a -f status=running
```
``` bash
sudo docker run centos:7 echo "Hello World"
```
The sudo docker run centos:7 echo "Hello World" command creates a new container from the centos:7 image and then runs the echo "Hello World" command inside the container.

The sudo docker run command has the following syntax:
```markdown
sudo docker run [OPTIONS] IMAGE [COMMAND] [ARGS]
In this case, the OPTIONS section is empty. The IMAGE section specifies the image to use as the basis for the container. In this case, the image is centos:7, which is a base image for CentOS 7.
```
The COMMAND section specifies the command to run inside the container. In this case, the command is echo "Hello World", which prints the message "Hello World" to the console.

The ARGS section is empty.

The output of the command is the following:
```markdown
Hello World
```
This output is printed to the console of the container.

Here is a breakdown of the command:
```markdown
sudo: This is the superuser prefix. It is required to run Docker commands that require elevated privileges.
docker: This is the name of the Docker command.
run: This is the subcommand for creating and running containers.
centos:7: This is the name of the image to use as the basis for the container.
echo "Hello World": This is the command to run inside the container.
This command can be used to test a new image or to run a simple command inside a container.
```
```bash
sudo docker run centos:7 ps -ef
```

The sudo docker run centos:7 ps -ef command creates a new container from the centos:7 image and then runs the ps -ef command inside the container.

The ps -ef command lists all of the processes running on the system, including the processes running in the container.

The output of the command is the following:
```markdown
UID        PID   PPID  C STIME TTY          TIME CMD
root      1     0     0 00:00:00 ?        00:00:00 /bin/bash
root      2     1     0 00:00:00 ?        00:00:00 ps -ef
```
This output is printed to the console of the container.

Here is a breakdown of the command:
```markdown
sudo: This is the superuser prefix. It is required to run Docker commands that require elevated privileges.
docker: This is the name of the Docker command.
run: This is the subcommand for creating and running containers.
centos:7: This is the name of the image to use as the basis for the container.
ps -ef: This is the command to run inside the container.
This command can be used to debug a container or to get information about the processes running in a container.
```
Here are some additional details about the ps -ef command:
```markdown
UID: The user ID of the process.
PID: The process ID of the process.
PPID: The parent process ID of the process.
C: The CPU usage of the process.
STIME: The start time of the process.
TTY: The terminal that the process is attached to.
TIME: The cumulative CPU time used by the process.
CMD: The command that was used to start the process.
```
``` bash
sudo docker container ls
sudo docker container ls -a
```
 The sudo docker container ls command lists all of the containers that are currently running on your computer. The sudo docker container ls -a command lists all of the containers that are currently running or stopped on your computer.

The output of both commands includes the following information for each container:
```markdown
CONTAINER ID: The unique identifier for the container.
IMAGE: The name of the image that the container is based on.
COMMAND: The command that was used to start the container.
STATUS: The current status of the container.
PORTS: The ports that are exposed by the container.
NAMES: The name of the container.
```
Here is an example of the output of the sudo docker container ls command:
```markdown
CONTAINER ID        IMAGE               COMMAND                 STATUS              PORTS                NAMES
a03994666510        ubuntu:latest       /bin/bash               Up 2 minutes          0.0.0.0:8080->80/tcp   my_container_1
```
Here is an example of the output of the sudo docker container ls -a command:
```markdown
CONTAINER ID        IMAGE               COMMAND                 STATUS              PORTS                NAMES
a03994666510        ubuntu:latest       /bin/bash               Up 2 minutes          0.0.0.0:8080->80/tcp   my_container_1
b3728484970f        nginx:latest       nginx -g daemon off;   Up 1 minute          0.0.0.0:80->80/tcp   my_container_2

CONTAINER ID        IMAGE               COMMAND                 STATUS              PORTS                NAMES
4294967296        ubuntu:latest       /bin/bash               Exited (0) 10 seconds ago                         my_container_3
```
Both commands can be used to troubleshoot problems with containers, to identify containers that are running or stopped, and to get information about the containers that are currently on your computer.

Here are some of the options that can be used with the sudo docker container ls and sudo docker container ls -a commands:
```markdown
-f: Filters the output based on a specified criteria. For example, to list only containers that are running, you would use the following command:
sudo docker container ls -f status=running
-n: Lists the specified number of containers.
-q: Lists only the container IDs.
-s: Sorts the output based on a specified criteria. For example, to sort the output by the container ID, you would use the following command:
sudo docker container ls -s id
```

## Understanding the output of Docker commands

The output of Docker commands can be quite verbose. It is important to understand what each part of the output means.

The following is a breakdown of the output of the docker ps command:
```markdown
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS   NAMES
a03994666510   ubuntu:latest   /bin/bash   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   my_container_1
```
The following is a breakdown of each column:
```markdown
CONTAINER ID: The unique identifier for the container
IMAGE: The name of the image that the container is based on
COMMAND: The command that was used to start the container
CREATED: The date and time the container was created
STATUS: The current status of the container
PORTS: The ports that are exposed by the container
NAMES: The name of the container
```
## Troubleshooting Docker problems

If you encounter any problems with Docker, there are a number of things you can do to troubleshoot.

The first step is to check the output of the docker info command. This will provide you with information about the Docker daemon and your system.

If you are still having problems, you can search the Docker documentation or forums for help.

## Conclusion

This guide has provided you with a comprehensive overview of the basic Docker commands. By following the instructions in this guide, you will be able to get started with containerization and use Docker to deploy your applications.
