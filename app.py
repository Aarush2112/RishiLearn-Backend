from flask import Flask, render_template, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({"status": "healthy", "message": "RishiLearn Backend is running"}), 200

@app.route('/admin')
def admin_portal():
    return render_template('admin-portal.html')

# API Endpoints can be added here
@app.route('/api/status')
def status():
    return jsonify({"status": "active"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
