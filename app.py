from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

SUPABASE_URL = "https://jxvmejhmwjguutvkrerq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dm1lamhtd2pndXV0dmtyZXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDM1NDcsImV4cCI6MjA5MjMxOTU0N30.3AxL09p0b8L_7ExCkjGXOBkg7xXsztEdSvNRiISPo8c"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def home():
    return jsonify({"status": "healthy", "message": "RishiLearn Backend is running"}), 200

@app.route('/admin')
def admin_portal():
    return render_template('admin-portal.html')

@app.route('/api/students', methods=['GET'])
def get_students():
    response = supabase.table('students').select('*').execute()
    return jsonify({"success": True, "students": response.data, "count": len(response.data)}), 200

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    response = supabase.table('students').select('*').eq('id', student_id).execute()
    if not response.data:
        return jsonify({"success": False, "error": "Student not found"}), 404
    return jsonify({"success": True, "student": response.data[0]}), 200

@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "Request body missing or not JSON"}), 400

    required_fields = ['name', 'email', 'student_id', 'course', 'semester']
    missing = [f for f in required_fields if not str(data.get(f, '')).strip()]
    if missing:
        return jsonify({"success": False, "error": f"Missing fields: {', '.join(missing)}"}), 400

    if '@' not in data['email'] or '.' not in data['email'].split('@')[-1]:
        return jsonify({"success": False, "error": "Invalid email format"}), 400

    if data['course'] not in ['cse', 'ece', 'me', 'it']:
        return jsonify({"success": False, "error": "Invalid course"}), 400

    if data['semester'] not in [str(i) for i in range(1, 9)]:
        return jsonify({"success": False, "error": "Semester must be between 1 and 8"}), 400

    try:
        response = supabase.table('students').insert({
            "name":       data['name'].strip(),
            "email":      data['email'].strip().lower(),
            "student_id": data['student_id'].strip().upper(),
            "course":     data['course'],
            "semester":   data['semester'],
            "password":   data.get('password', '').strip() or None
        }).execute()
        return jsonify({"success": True, "message": "Student added successfully", "student": response.data[0]}), 201

    except Exception as e:
        error = str(e)
        if 'email' in error:
            return jsonify({"success": False, "error": "Email already registered"}), 409
        if 'student_id' in error:
            return jsonify({"success": False, "error": "Student ID already exists"}), 409
        return jsonify({"success": False, "error": "Database error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)