# Applause API: AI-Powered Mobile App Generation Platform

Applause is a revolutionary platform that uses a swarm of specialized AI agents to build native mobile applications from a simple website URL or a text prompt. This repository contains the complete codebase for the Applause project, including the Django backend and the React frontend.

## Tech Stack

* **Backend:** Django, Django REST Framework, Celery, PostgreSQL
* **Frontend:** React, Vite, TypeScript, Tailwind CSS, i18next
* **Deployment:** AWS (for backend), Vercel (for frontend)
* **CI/CD:** GitHub Actions

---

## Getting Started

### Prerequisites

* Python 3.11+
* Node.js 18+
* PostgreSQL
* Redis
* An active Paystack account for payment processing

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-repo/applause.git](https://github.com/your-repo/applause.git)
    cd applause/backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the `backend/` directory and add the following variables. Use the `.env.example` file as a template.
    ```env
    SECRET_KEY='your-strong-secret-key'
    DEBUG=True
    DATABASE_URL='postgres://user:password@localhost:5432/applause_db'
    CORS_ALLOWED_ORIGINS='http://localhost:5173'
    PAYSTACK_SECRET_KEY='sk_your_paystack_secret_key'
    CELERY_BROKER_URL='redis://localhost:6379/0'
    CELERY_RESULT_BACKEND='redis://localhost:6379/0'
    ```

5.  **Run database migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6.  **Run the development server:**
    ```bash
    python manage.py runserver
    ```

7.  **Run the Celery worker (in a separate terminal):**
    ```bash
    celery -A applause_api worker -l info
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

---

## Deployment

### Frontend (Vercel)

1.  Push your code to a GitHub repository.
2.  Go to [Vercel](https://vercel.com) and create a new project, linking it to your GitHub repository.
3.  Vercel will automatically detect the Vite configuration from the `vercel.json` file.
4.  Add your environment variables (e.g., `VITE_API_BASE_URL`) in the Vercel project settings.
5.  Deploy. Vercel will handle the build and deployment process.

### Backend (AWS Elastic Beanstalk)

1.  **Create an AWS RDS for PostgreSQL instance:**
    * Launch a new PostgreSQL database in AWS RDS.
    * Configure the security group to allow inbound connections from your Elastic Beanstalk environment.
    * Note the database credentials (host, name, user, password).

2.  **Create a `.ebextensions/django.config` file** in the `backend` directory to configure the WSGI path:
    ```yaml
    option_settings:
      aws:elasticbeanstalk:container:python:
        WSGIPath: applause_api.wsgi:application
    ```

3.  **Create a `requirements.txt` file:**
    This should already be present. Ensure it's up to date.
    ```bash
    pip freeze > requirements.txt
    ```

4.  **Package the application:**
    Zip the contents of the `backend` directory (excluding `venv` and other local artifacts).

5.  **Create an Elastic Beanstalk Application and Environment:**
    * Go to the AWS Elastic Beanstalk console and create a new application.
    * Create a new environment with the "Python" platform.
    * Upload your zipped application package.

6.  **Configure Environment Properties:**
    * In your environment's configuration (`Configuration` > `Software`), add the environment variables you defined in `.env` (e.g., `SECRET_KEY`, `DATABASE_URL`, `PAYSTACK_SECRET_KEY`, etc.).
    * The `DATABASE_URL` should point to your new AWS RDS instance.
    * Set `DEBUG` to `False`.
    * Set `ALLOWED_HOSTS` to your Elastic Beanstalk domain name.

7.  **Deploy the application.** Elastic Beanstalk will provision the resources and deploy your Django app.
