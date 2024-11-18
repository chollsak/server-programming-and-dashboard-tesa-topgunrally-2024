import paho.mqtt.client as mqtt
import time

# Define MQTT broker details
broker_hostname = "localhost"  # Replace with "localhost" for local Mosquitto broker
port = 1883

# Define topic and initial message count
topic = "test/topic"
msg_count = 0

# Define the callback for connection
def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("Connected successfully")
    else:
        print("Could not connect, return code:", return_code)

# Initialize the client instance
client = mqtt.Client("Client1", clean_session=True)

# Set up username and password if required (uncomment and set values)
# client.username_pw_set(username="user_name", password="password")

client.on_connect = on_connect

# Connect to the broker
client.connect(broker_hostname, port)
client.loop_start()  # Start the loop to process network traffic

try:
    # Publish messages in a loop
    while msg_count < 10:
        time.sleep(1)
        msg_count += 1
        result = client.publish(topic, msg_count)
        status = result[0]
        
        if status == 0:
            print(f"Message {msg_count} is published to topic {topic}")
        else:
            print(f"Failed to send message to topic {topic}")
            if not client.is_connected():
                print("Client not connected, exiting...")
                break
finally:
    # Disconnect from the broker
    client.disconnect()
    client.loop_stop()