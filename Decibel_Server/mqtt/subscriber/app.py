import os
import paho.mqtt.client as mqtt

# Get broker host and port from environment variables
broker_host = os.getenv("MQTT_BROKER_HOST", "mqtt-broker")  # Default to service name
broker_port = int(os.getenv("MQTT_BROKER_PORT", 1883))

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully to the broker")
        client.subscribe("test/topic")
    else:
        print(f"Connection failed with code {rc}")

def on_message(client, userdata, msg):
    print(f"Received message: '{msg.payload.decode()}' on topic '{msg.topic}'")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

try:
    client.connect(broker_host, broker_port, 60)
except Exception as e:
    print(f"Failed to connect to broker: {e}")

client.loop_forever()
