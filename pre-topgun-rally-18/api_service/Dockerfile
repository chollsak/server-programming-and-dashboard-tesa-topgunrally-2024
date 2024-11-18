FROM python:3

WORKDIR /app

COPY requirements.txt .
COPY app.py .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

# Ensure this command runs your Flask app when the container starts
CMD ["python", "app.py"]
