import eventlet
eventlet.monkey_patch()

from flask import Flask, jsonify, request
from pymongo import MongoClient, errors
from flask_cors import CORS
from flask_socketio import SocketIO
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Initialize SocketIO with CORS support and logging enabled
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet", logger=True, engineio_logger=True)

# MongoDB URI
MONGO_URI = "mongodb+srv://pretopgun:pretopgun@pretopgun-day1.v3tv1.mongodb.net/?retryWrites=true&w=majority&appName=pretopgun-day1"

# Retry MongoDB connection in case of initial failure
def connect_to_mongo(uri, retries=5, delay=5):
    for attempt in range(retries):
        try:
            client = MongoClient(uri)
            client.admin.command('ping')  # Ping the server to confirm connection
            print("Connected to MongoDB")
            return client
        except errors.ConnectionFailure as e:
            print(f"MongoDB connection failed on attempt {attempt + 1}/{retries}: {e}")
            time.sleep(delay)
    raise Exception("Failed to connect to MongoDB after multiple attempts")

# Establish MongoDB connection
mongo_client = connect_to_mongo(MONGO_URI)
db = mongo_client['pretopgun-day1']
collection = db['data']

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Pre-TopGunRally Server"}), 200

@app.route('/api/delete_all', methods=['DELETE'])
def delete_all():
    collection.delete_many({})
    return jsonify({"message": "All data deleted"}), 200

@app.route('/api/get_last_5_data', methods=['GET'])
def get_last_5_data():
    try:
        data = list(collection.find({}, {'_id': 0, 'timestamp': 1, 'amplitude': 1}).sort('timestamp', -1).limit(5))
        data.reverse()
        return jsonify(data), 200
    except errors.PyMongoError as e:
        print("Error retrieving data:", e)
        return jsonify({"error": "Failed to retrieve data"}), 500

@app.route('/api/get_last_data', methods=['GET'])
def get_last_data():
    try:
        data = collection.find_one({}, {'_id': 0, 'timestamp': 1, 'amplitude': 1}, sort=[('timestamp', -1)])
        return jsonify(data), 200
    except errors.PyMongoError as e:
        print("Error retrieving data:", e)
        return jsonify({"error": "Failed to retrieve data"}), 500


@app.route('/api/save_data', methods=['POST'])
def save_data():
    try:
        data = request.json
        print("Data received:", data)
        inserted_id = collection.insert_one(data).inserted_id
        data['_id'] = str(inserted_id)
        socketio.emit('data_saved', {'data': data})
        print("Data saved to MongoDB and emitted to WebSocket clients")
        return jsonify({"status": "Data saved successfully", "data": data}), 200
    except errors.PyMongoError as e:
        print("Error saving data:", e)
        return jsonify({"error": "Failed to save data"}), 500

@socketio.on("message")
def handle_message(msg):
    print(f"Message received from client: {msg}")
    socketio.emit("response", {"message": "Hello from server! Received your message."})

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, use_reloader=False)
