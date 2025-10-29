---
title: "Exploring Docker Commands and Container Management"
date: 2023-11-16T02:53:47+03:00
draft: false
author: "orioninsist"
type: "blog"
slug: "exploring-docker-commands-and-container-management"
keywords: ["docker","container","management","sysadmin"]
tags: ["docker","container","management","sysadmin"]
description: "Explore Docker commands and container management with this comprehensive guide. Learn how to update container images, create and manage files within containers, and monitor and interact with running containers."
language: "English"
cover:
     image: "/project/devops/2023/2023-11/exploring-docker-commands-and-container-management.png"
     alt: "exploring-docker-commands-and-container-management"
---

## Introduction

Docker has revolutionized the way applications are developed, deployed,
and managed. It provides a lightweight and portable environment for
running containers, which are self-contained instances of an application
and its dependencies. Docker commands offer a powerful means to manage
and interact with these containers.

Updating and Listing Container Images

The provided Bash commands demonstrate the process of updating and
listing Docker container images.

    sudo docker container run -it centos:7 bash
    sudo yum -y update
    ls -l

This script first creates a new container based on the centos:7 image.
Inside the container, it updates the system packages using the yum
command. Finally, it lists the contents of the current directory.

    sudo docker cantainer run -it rockylinux:9 bash
    dnf install sudo
    sudo dnf update -y

Similar to the previous example, this script creates a container based
on the rockylinux:9 image. However, instead of using yum, it utilizes
the dnf package manager for updating and installing software.

## Creating and Managing Files Within a Container

The following commands illustrate file creation and management within a
container.

    echo "We are here" > example.txt
    ls -l
    cat example.txt
    exit

This script creates a file named example.txt and writes the text \"We
are here\" to it. Subsequently, it lists the contents of the current
directory, displays the file content using cat, and exits the container.

## Monitoring and Interacting with Running Containers

The provided commands demonstrate how to monitor and interact with
running containers.

    sudo docker ps
    sudo docker ps -a
    sudo docker container run -it rockylinux:9 bash
    ls -l
    exit
    sudo docker ps -a
    sudo docker container start container_id
    sudo docker ps
    sudo docker container exec container_id ps -ef
    sudo docker container exec container_id bash
    sudo docker container exec -it container_id bash
    ls -l
    cat example.txt

This script starts by listing all running containers using docker ps. It
then lists all containers, including stopped ones, using docker ps -a.
Next, it creates and enters a new container based on the rockylinux:9
image. It then lists the contents of the directory, exits the container,
and lists all containers again. Subsequently, it starts a specific
container using docker container start container~id~, lists containers
again, and executes the ps -ef command within the container to view its
processes. Finally, it enters the container interactively using docker
container exec -it container~id~ bash and lists the contents of the
directory, displaying the file content using cat.

These commands demonstrate the versatility of Docker commands in
managing and interacting with containers. They provide insights into
updating container images, creating and managing files within
containers, and monitoring and interacting with running containers.

