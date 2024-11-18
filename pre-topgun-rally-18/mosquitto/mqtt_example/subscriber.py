import paho.mqtt.client as mqtt
import time

# Define MQTT broker details
broker_hostname = "localhost"  # Replace with "localhost" for local Mosquitto broker
port = 1883
topic = "test/topic"

# Define the callback for connection
def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("Connected successfully")
        client.subscribe(topic)
    else:
        print("Could not connect, return code:", return_code)
        client.failed_connect = True

# Define the callback for receiving messages
def on_message(client, userdata, message):
    print("Received message:", message.payload.decode("utf-8"))

# Initialize the MQTT client
client = mqtt.Client("Client2")

# Set up username and password if required (uncomment and set values)
# client.username_pw_set(username="user_name", password="password")

client.on_connect = on_connect
client.on_message = on_message
client.failed_connect = False

# Connect to the broker
client.connect(broker_hostname, port)
client.loop_start()  # Start the loop to process network traffic

try:
    # Listen for messages while connected
    i = 0
    while i < 15 and not client.failed_connect:
        time.sleep(1)
        i += 1
        if client.failed_connect:
            print("Connection failed, exiting...")
            break
finally:
    # Disconnect from the broker
    client.disconnect()
    client.loop_stop()
