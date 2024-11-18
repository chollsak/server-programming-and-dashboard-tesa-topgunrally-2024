from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
import time

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True, ping_timeout=60, ping_interval=25)

@app.route('/')
def index():
    """Root endpoint for testing server response."""
    return "<h1>Hello World</h1>"

@socketio.on('connect')
def handle_connect():
    """Handle client connection."""
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection."""
    print('Client disconnected')

@socketio.on('message')
def handle_message(data):
    print('Received message:', data)
    for i in range(10):
        now = datetime.now()
        response = f'You sent {data} {str(now)}'
        print(f'Sending response {i}: {response}')
        socketio.emit('response', {'message': response})
        time.sleep(5)  # Delay between sending each response to simulate real-time updates

if __name__ == '__main__':
    # Run the app with SocketIO support, debug mode, and accessible on all network interfaces
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)