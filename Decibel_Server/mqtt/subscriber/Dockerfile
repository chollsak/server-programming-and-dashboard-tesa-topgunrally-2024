# mqtt/subscriber/Dockerfile

# Use an official Python image as the base
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the subscriber script into the container
COPY app.py .

# Command to run the subscriber script
CMD ["python", "app.py"]
