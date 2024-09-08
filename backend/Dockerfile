# Base image
FROM python:3.12.5-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy project code
COPY recipify .

# Expose port
EXPOSE 8000
