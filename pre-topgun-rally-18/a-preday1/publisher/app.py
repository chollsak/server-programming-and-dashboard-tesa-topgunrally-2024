import sys
import os
import random
import paho.mqtt.client as mqtt
import json
import time
import logging

# Configure logging
log_file = "/app/logs/publisher.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler(log_file), logging.StreamHandler(sys.stdout)]
)

# MQTT broker configuration using environment variables
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost")
MQTT_PORT = int(os.getenv("MQTT_PORT", 1883))
MQTT_TOPIC = "test/topic"

# Create the MQTT client
client = mqtt.Client()

# Define callbacks to debug connection issues
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker successfully.")
    else:
        print(f"Failed to connect to MQTT broker. Return code: {rc}")

def on_publish(client, userdata, mid):
    print(f"Data published with message ID: {mid}")

def on_disconnect(client, userdata, rc):
    print(f"Disconnected from MQTT broker with return code: {rc}")

# Attach callbacks
client.on_connect = on_connect
client.on_publish = on_publish
client.on_disconnect = on_disconnect

# Attempt to connect to the broker
print("Attempting to connect to broker...")
client.connect(MQTT_BROKER, MQTT_PORT, 60)

# Start the loop to maintain network traffic
client.loop_start()

def publish_data():
    while True:
        # Generate random data
        data = {
            "status": random.choice(["success", "failure"]),
            "amplitude": round(random.uniform(-1, 1), 2),
            "timestamp": time.time()
        }
        # Publish data to the MQTT topic
        result = client.publish(MQTT_TOPIC, json.dumps(data))
        
        # Check for successful publication
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print("Data published:", data)
            logging.info("Data published: %s", data)
        else:
            print("Failed to publish data. MQTT error code:", result.rc)
            logging.error("Failed to publish data. Error: %d", result.rc)
        
        time.sleep(3)  # Publish every 3 seconds

if __name__ == "__main__":
    try:
        publish_data()
    except KeyboardInterrupt:
        print("Publisher interrupted. Disconnecting from broker...")
    finally:
        client.loop_stop()
        client.disconnect()
