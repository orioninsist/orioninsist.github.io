---
title: "Docker Cli Essential Commands"
date: 2024-04-08T00:25:24+03:00
draft: false
author: murat
language: english
type: blog
description: Explore Docker CLI with essential commands for listing, running, inspecting, and managing containers.
slug: docker-cli-essential-commands
tags: ["devops","docker"]
keywords: ["devops","docker"]
cover:
     image: /blog/2024-04/docker-cli-essential-commands.png
     alt: "docker-cli-essential-commands.png"

---

Docker has become a cornerstone of modern application development. By containerizing applications, Docker streamlines deployment, simplifies collaboration, and promotes portability. This blog post delves into some fundamental Docker commands you'll encounter frequently.

## Listing Docker Containers
``` shell
sudo docker container ls -a --no-trunc
 ```
## List all containers (including exited ones) without truncating names
```shell
sudo docker container ls -a --no-trunc
sudo docker container ls -a
```
## List all containers (running and stopped)
```shell
sudo docker container ls -a
sudo docker container ls -a -q
```
## List only container IDs
```shell
sudo docker container ls -a -q
sudo docker container ls -l
```
## List containers with detailed information
```shell
sudo docker container ls -l
sudo docker container ls -a --filter ""
```
## List containers based on filters (example: --filter status=running)
```shell
sudo docker container ls -a --filter ""
```
## Running a Container
```shell
sudo docker container run centos:7 ping 127.0.0.1 -c 10
```
## Run a single instance of centos:7 image and execute ping command
```shell
sudo docker container run centos:7 ping 127.0.0.1 -c 10
```
## Viewing Container Information
```shell
sudo docker ps
```
## List all running containers
```shell
sudo docker ps
sudo docker ps -a
```
## List all containers (running and stopped) with ps
```shell
sudo docker ps -a
```
## Starting and Stopping Containers
```shell
sudo docker container run -d centos:7 ping 127.0.0.1
```
## Run a container in detached mode (background)
```shell
sudo docker container run -d centos:7 ping 127.0.0.1
sudo docker ps
```
## Verify the container is running (after running in detached mode)
```shell
sudo docker ps
```
## Inspecting Container Logs
```shell
sudo docker container logs [containerid]
```
## View logs of a specific container (replace [containerid] with actual ID)
```shell
sudo docker container logs [containerid]
sudo docker container logs --tail [containerid]
```
## View only the most recent logs of a container (replace [containerid] with actual ID)
```shell
sudo docker container logs --tail [containerid]
sudo docker container logs --tail 10 [containerid]
sudo docker container logs -f [containerid]
```
## Follow container logs in real-time (replace [containerid] with actual ID)
```shell
sudo docker container logs -f [containerid]
```
## Additional Commands
```shell
sudo docker container start [containerid]: Starts a stopped container.
sudo docker container stop [containerid]: Stops a running container.
sudo docker container rm [containerid]: Removes a container.
```
## Conclusion
This blog post provides a brief overview of essential Docker commands. By mastering these commands, you'll be well on your way to effectively managing containers and building robust applications with Docker.
Note: Replace [containerid] with the actual ID of the container whenever applicable in the commands.
