# Applause

**Build Your App with AI.**

Applause is a revolutionary platform that empowers non-technical creators to build and launch mobile applications using a system of interconnected AI agents. From market analysis to code generation, Applause handles the entire development lifecycle through a seamless, conversational interface.

---

### Technology Stack

**Frontend:**
* React (Vite, TypeScript)
* Tailwind CSS
* React Router
* Axios

**Backend:**
* Django (Monolithic, Django REST Framework)
* Celery (for asynchronous AI tasks)

**Database & Broker:**
* MySQL
* Redis (for Celery message brokering)

**AI & Payments:**
* Google Gemini API
* Paystack Payment Gateway

---

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* Node.js (v18 or later)
* Python (v3.10 or later)
* MySQL Community Server
* Redis Server

---

### Final Execution Protocol: Local Deployment

Follow these steps precisely to set up and run the entire Applause platform locally.

#### **Part 1: Backend Setup**

1.  **Navigate to the Backend Directory:**
    ```bash
    cd backend
    ```

2.  **Create and Populate `.env` File:** Create a file named `.env` in the `backend` directory and add your secret keys:
    ```
    DJANGO_SECRET_KEY='your-super-secret-key-here'
    GEMINI_API_KEY='your-google-ai-gemini-api-key-here'
    PAYSTACK_SECRET_KEY='your-paystack-secret-key-here'
    ```

3.  **Setup MySQL Database:** Open your MySQL client and run the following command to create the database:
    ```sql
    CREATE DATABASE applause_db;
    ```
    _Note: Ensure your MySQL user credentials in `backend/applause_api/settings.py` are correct._

4.  **Create and Activate Python Virtual Environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```
    _On Windows, use `venv\Scripts\activate`._

5.  **Install Backend Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

6.  **Run Database Migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

#### **Part 2: Frontend Setup**

1.  **Navigate to the Frontend Directory (in a new terminal window):**
    ```bash
    cd frontend
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

#### **Part 3: Launching the Applause Platform**

To run the application, you must start **four** separate processes in **four** separate terminals.

1.  **Terminal 1: Start Redis Server**
    * Follow the installation guide for your OS to start the Redis server. On most systems, the command is simply:
        ```bash
        redis-server
        ```

2.  **Terminal 2: Start the Backend Celery Worker**
    * Navigate to the `backend` directory and ensure your virtual environment is active.
        ```bash
        cd /path/to/applause/backend
        source venv/bin/activate
        celery -A applause_api worker -l info
        ```

3.  **Terminal 3: Start the Backend Django Server**
    * Navigate to the `backend` directory and ensure your virtual environment is active.
        ```bash
        cd /path/to/applause/backend
        source venv/bin/activate
        python manage.py runserver
        ```

4.  **Terminal 4: Start the Frontend Vite Server**
    * Navigate to the `frontend` directory.
        ```bash
        cd /path/to/applause/frontend
        npm run dev
        ```

**Your Applause platform is now live.**

* Access the frontend at: `http://localhost:5173`
* The backend API is running at: `http://127.0.0.1:8000`

---
