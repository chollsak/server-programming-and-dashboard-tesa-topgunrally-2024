from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_socketio import SocketIO, emit
import logging
from datetime import datetime
import time
from flask_cors import CORS

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app
socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB connection details
MONGO_URI = "mongodb+srv://pretopgun:pretopgun@pre-topgun-rally-cluste.rojip.mongodb.net/?retryWrites=true&w=majority&appName=pre-topgun-rally-cluster"
client = MongoClient(MONGO_URI)

# Database and collection
db = client['students']
collection = db['std_info']

@app.route('/')
def home():
    app.logger.info("Home route accessed")
    return "Welcome to the Flask MongoDB API!"

@app.route('/students', methods=['GET'])
def get_students():
    app.logger.info("GET request received at /students")
    students = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB's ObjectId from response
    if not students:
        app.logger.info("No students found")
        return jsonify({"message": "No students found"}), 404
    return jsonify(students)

@app.route('/students', methods=['POST'])
def add_student():
    student_data = request.json
    app.logger.info(f"POST request received at /students with data: {student_data}")
    try:
        collection.insert_one(student_data)
        # Emit a real-time update to connected clients after adding a student
        socketio.emit('new_student', {'message': 'New student added', 'student': student_data})
        return jsonify({"message": "Student added successfully"}), 201
    except Exception as e:
        app.logger.error(f"Error adding student: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run the app with SocketIO
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)

