# Use a Python image
FROM python:3.8

WORKDIR /app
COPY . /app

# Ensure the path to requirements.txt is correct
RUN pip install -r requirements.txt

CMD ["python", "app.py"]
