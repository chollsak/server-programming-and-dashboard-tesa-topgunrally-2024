# Use the official Eclipse Mosquitto image as the base
FROM eclipse-mosquitto:latest

# Copy the configuration file into the container
COPY config/mosquitto.conf /mosquitto/config/mosquitto.conf

# Expose MQTT default port
EXPOSE 1883

# Persist data and logs
VOLUME ["/mosquitto/data", "/mosquitto/logs"]
