# RishiLearn Backend

This is the backend service for the RishiLearn application, built with Python and Flask. It provides a RESTful API for managing student data and an admin portal, using Supabase as the database.

## Technologies Used

*   **Python**: Programming language.
*   **Flask**: Web framework for building the API and serving the admin portal.
*   **Flask-CORS**: Handling Cross-Origin Resource Sharing (CORS).
*   **Supabase**: Backend-as-a-service (BaaS) used as a PostgreSQL database.
*   **Gunicorn**: Python WSGI HTTP Server for UNIX, typically used for production deployments.

## Prerequisites

*   Python 3.x installed
*   A Supabase project setup with a `students` table.

## Setup Instructions

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository_url>
    cd RishiLearn-Backend
    ```

2.  **Create a virtual environment** (recommended):
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configuration**:
    The Supabase URL and Key are currently hardcoded in `app.py`. For security best practices, especially in production, consider moving these to environment variables (e.g., using a `.env` file).

## Running the Application

To run the Flask development server locally:

```bash
python app.py
```

The server will start on `http://127.0.0.1:5000/`.

## API Endpoints

### Health Check

*   **URL**: `/`
*   **Method**: `GET`
*   **Response**: `{"status": "healthy", "message": "RishiLearn Backend is running"}` (200 OK)

### Admin Portal

*   **URL**: `/admin`
*   **Method**: `GET`
*   **Response**: Serves the `admin-portal.html` template.

### Students API

#### 1. Get All Students

*   **URL**: `/api/students`
*   **Method**: `GET`
*   **Success Response**: `{"success": true, "students": [...], "count": <number>}` (200 OK)

#### 2. Get a Specific Student

*   **URL**: `/api/students/<int:student_id>`
*   **Method**: `GET`
*   **Success Response**: `{"success": true, "student": {...}}` (200 OK)
*   **Error Response**: `{"success": false, "error": "Student not found"}` (404 Not Found)

#### 3. Add a New Student

*   **URL**: `/api/students`
*   **Method**: `POST`
*   **Request Body** (JSON):
    ```json
    {
      "name": "Student Name",
      "email": "student@example.com",
      "student_id": "STU123",
      "course": "cse",  // Must be one of: cse, ece, me, it
      "semester": "1",    // Must be between 1 and 8
      "password": "optional_password" // Optional
    }
    ```
*   **Success Response**: `{"success": true, "message": "Student added successfully", "student": {...}}` (201 Created)
*   **Error Responses**:
    *   `400 Bad Request`: For missing fields, invalid email format, invalid course, or invalid semester.
    *   `409 Conflict`: If the email or student ID is already registered.
    *   `500 Internal Server Error`: For general database errors.
