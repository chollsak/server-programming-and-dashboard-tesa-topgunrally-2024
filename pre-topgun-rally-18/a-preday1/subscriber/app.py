import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import paho.mqtt.client as mqtt
import requests
import json
import logging

log_file = "/app/logs/subscriber.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(log_file), logging.StreamHandler(sys.stdout)]
)

MQTT_BROKER = os.getenv('MQTT_BROKER', 'mqtt-broker')
MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'test/topic')
BACKEND_API_URL = "http://backend:5000/api/save_data" 

def on_message(client, userdata, msg):
    if msg.payload:
        try:
            data = json.loads(msg.payload.decode())
            print("Data received:", data)
            logging.info("Data received: %s", data)
            requests.post(BACKEND_API_URL, json=data)
            print("Data saved to MongoDB")
            logging.info("Data saved to MongoDB")
        except json.JSONDecodeError:
            print("Error decoding JSON data:", msg.payload.decode())
            logging.error("Error decoding JSON data: %s", msg.payload.decode())
    else:
        print("No data received")
        logging.warning("No data received")

client = mqtt.Client()
client.on_message = on_message
if client.connect(MQTT_BROKER, MQTT_PORT, 60) == 0:
    print("Connected to MQTT broker")
else:
    print("Connection to MQTT broker failed")
client.subscribe(MQTT_TOPIC)
client.loop_forever()
