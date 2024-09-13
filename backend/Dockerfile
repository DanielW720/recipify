# Base image
FROM python:3.12.5-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install curl
RUN apt-get update && apt-get install -y curl

# Install dependencies
RUN pip install -r requirements.txt

# Copy project code
COPY recipify .

ENV DOCKER_ENV=True

# Expose port
EXPOSE 8000
