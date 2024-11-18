from flask import Flask, request, jsonify
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # สร้างโฟลเดอร์ถ้าไม่มี


@app.route('/uploadaudio', methods=['POST'])
def uploadaudio():
    # ตรวจสอบว่า request มีไฟล์หรือไม่
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # บันทึกไฟล์ลงในระบบ
    filepath = os.path.join('uploads', file.filename)
    file.save(filepath)
    return f'File successfully uploaded', 200


@app.route('/listaudio', methods=['GET'])
def listaudio():
    # List all files in the uploads folder
    try:
        sound_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith('.WAV')]
        return jsonify(sound_files), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'file' not in request.files:
        return "No file part", 400

    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400

    # บันทึกไฟล์ที่ได้รับ
    file_path = os.path.join(UPLOAD_FOLDER, 'receivedaudio.wav')
    file.save(file_path)
    return 'File uploaded successfully', 200

@app.route('/decode', methods=['POST'])
def decode_string():
    data = request.headers
    if(data != 'Content-Type: application/octet-stream1  KMITL:CustomHeaderValue'):
        return "Invalid header", 400

    print(data)  # แสดงข้อมูลที่ได้รับใน Console
    return "Data received and encyptp successfully", 200

if __name__ == '__main__':
    # สร้างโฟลเดอร์ uploads หากยังไม่มี
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    app.run(host='0.0.0.0', port=5000)