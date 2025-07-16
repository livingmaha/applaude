# Applaude: AI-Powered Mobile App Generation

Applaude is a revolutionary platform that uses a swarm of specialized AI agents to build native mobile applications from a simple website URL or a text prompt.

## Tech Stack

* **Backend:** Django, Django REST Framework, Celery, PostgreSQL
* **Frontend:** React, Vite, TypeScript, Tailwind CSS, i18next
* **Deployment:** AWS (for backend), Vercel (for frontend)
* **CI/CD:** GitHub Actions

---

## Deployment Instructions

### Frontend (Vercel)

1.  **Fork and Clone:** Fork this repository and clone it to your local machine.
2.  **Vercel Project:** Go to [Vercel](https://vercel.com), create a new project, and link it to your forked GitHub repository.
3.  **Configuration:** Vercel will automatically detect the Vite project. No special build command is needed.
4.  **Environment Variables:** In the Vercel project settings, add your backend API URL as `VITE_API_URL`.
5.  **Deploy:** Vercel will automatically deploy new changes pushed to the `main` branch.

### Backend & Database (AWS)

#### 1. AWS RDS for PostgreSQL

* In the AWS console, navigate to **RDS** and create a new **PostgreSQL** database.
* Choose the "Free tier" template for development.
* Set a master username and password.
* **Crucially**, in the "Connectivity" section, make sure "Public access" is set to "Yes".
* Once created, find the **endpoint** and **port** from the database details page.

#### 2. AWS Elastic Beanstalk Deployment

* **Create `.ebextensions/django.config`:** In your `backend` directory, create a folder named `.ebextensions` and add a file `django.config` with the following content:
    ```yaml
    option_settings:
      aws:elasticbeanstalk:container:python:
        WSGIPath: applaude_api.wsgi:application
    ```
* **Install EB CLI:** Follow the official AWS instructions to install the Elastic Beanstalk CLI.
* **Initialize EB Project:**
    * Navigate to your `backend` directory.
    * Run `eb init -p python-3.11 applaude-backend`.
    * Choose a region. You do not need to set up SSH.
* **Create Environment:**
    * Run `eb create applaude-prod-env`. This will take several minutes.
* **Set Environment Variables:**
    * Run `eb setenv SECRET_KEY='your-very-secret-key' DEBUG=False ALLOWED_HOSTS='.elasticbeanstalk.com,your-vercel-domain.app' DATABASE_URL='postgres://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME' PAYSTACK_SECRET_KEY='your-paystack-secret-key' GEMINI_API_KEY='your-gemini-key' CELERY_BROKER_URL='your-redis-url' CELERY_RESULT_BACKEND='your-redis-url'`
    * Replace the placeholder values with your actual credentials from RDS and other services.
* **Deploy:**
    * Run `eb deploy`.

---
