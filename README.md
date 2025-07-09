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
* Recharts
* i18next (for internationalization)

**Backend:**
* Django & Django REST Framework
* Celery (for asynchronous AI tasks)
* Django Channels (for WebSockets)

**Database & Broker:**
* PostgreSQL (Production) / SQLite (Development)
* Redis

**AI & Payments:**
* Google Gemini API
* Paystack Payment Gateway

---

### Local Development Setup

Follow these steps to set up and run the Applause platform on your local machine.

#### **1. Prerequisites**
* Python 3.10+
* Node.js 18+ & npm
* MySQL (or use the default SQLite)
* Redis

#### **2. Backend Setup**

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file from the .env.example template
# cp .env.example .env

# Add your secret keys and database credentials to the .env file
# (e.g., DJANGO_SECRET_KEY, GEMINI_API_KEY, PAYSTACK_SECRET_KEY)

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser for admin access
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
3. Frontend Setup
Bash

# Open a new terminal and navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Create a .env.local file
# Add the backend API URL:
# VITE_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)

# Start the React development server
npm run dev
4. Start Asynchronous Workers
You need to run Celery workers to handle the AI agent tasks.

Bash

# Open a new terminal, navigate to the backend directory, and activate the virtual environment
cd backend
source venv/bin/activate

# Start the Celery worker
celery -A applause_api worker -l info
Production Deployment Protocol
This section outlines the steps to deploy the Applause platform to a production environment.

A. Frontend Deployment (Vercel)
The frontend is a static React application and is best hosted on a platform optimized for static sites like Vercel.

Push to GitHub: Ensure your final code is pushed to your GitHub repository.

Create a Vercel Account: Sign up or log in to Vercel.

Import Project: From your Vercel dashboard, import your GitHub repository.

Configure Project:

Framework Preset: Vercel should automatically detect it as a Vite project.

Root Directory: Set the root directory to frontend.

Environment Variables: Add an environment variable VITE_API_URL and set it to the public URL of your backend API (e.g., https://api.yourapplause.com/api).

Deploy: Vercel will automatically build and deploy the frontend. It will also redeploy on every push to the main branch.

B. Backend Deployment (AWS Example)
This guide assumes you have an AWS account and the AWS CLI configured.

Create an RDS PostgreSQL Instance:

In the AWS console, create a new PostgreSQL RDS instance.

Configure the security group to allow inbound traffic from your EC2 instance on port 5432.

Note the database name, username, password, host, and port.

Create an EC2 Instance:

Launch a new EC2 instance (e.g., with Ubuntu).

Configure its security group to allow inbound traffic on ports 22 (SSH), 80 (HTTP), and 443 (HTTPS).

SSH into your instance.

Install Dependencies on EC2:

Bash

sudo apt-get update
sudo apt-get install python3-venv python3-dev nginx supervisor redis-server postgresql-client
Clone Repository & Setup Environment on EC2:

Bash

git clone [https://github.com/your-username/applause.git](https://github.com/your-username/applause.git)
cd applause/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
Create a .env file and populate it with your production keys, RDS database credentials, ALLOWED_HOSTS (your domain name), and set ENVIRONMENT=production.

Setup Gunicorn, Nginx, and Supervisor:

Use the provided gunicorn.conf.py, nginx.conf (sample), and supervisor.conf (sample) files as templates.

Configure Nginx as a reverse proxy to forward requests to Gunicorn.

Configure Supervisor to manage the Gunicorn and Celery processes, ensuring they run continuously.

Run Final Backend Commands:

Bash

# Apply database migrations
python manage.py migrate

# Collect static files for Nginx to serve
python manage.py collectstatic --noinput
Your Applause platform is now live in production.

