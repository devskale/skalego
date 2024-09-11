#!/bin/bash

# Install git
yum install git -y

# Initialize and update submodules
git submodule update --init --recursive

# Build the Hugo site
hugo --minify
