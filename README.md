# Applaude: AI-Powered Mobile App Generator

[![CI/CD Status](https://github.com/your-username/applaude/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-username/applaude/actions/workflows/ci-cd.yml)

Applaude is a platform that empowers users to generate fully functional, user-generated mobile applications using the power of generative AI.

## Production-Ready Architecture

This platform has been architected for extreme scalability and security, ready to handle over 100 million users.

### Core Technologies

-   **Frontend:** [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/)) deployed on [Vercel](https://vercel.com/).
-   **Backend:** [Django](https://www.djangoproject.com/) deployed on [AWS Elastic Beanstalk](https://aws.amazon.com/elastic-beanstalk/) using Docker.
-   **Database:** [MySQL](https://www.mysql.com/) on [AWS RDS](https://aws.amazon.com/rds/) for high availability and automated backups.
-   **Background Tasks:** [Celery](https://docs.celeryq.dev/) with [Redis](https://redis.io/) on [AWS ElastiCache](https://aws.amazon.com/elasticache/) for asynchronous processing.
-   **CI/CD:** Fully automated deployments using [GitHub Actions](#cicd-pipeline).

### Key Architectural Features

-   **Automated CI/CD:** Every push to `main` is automatically tested, scanned, built, and deployed.
-   **High Availability:** Utilizes Multi-AZ deployments for AWS RDS and an automated failover plan with Route 53.
-   **Auto Scaling:** The backend environment scales automatically based on CPU load to handle traffic spikes cost-effectively.
-   **Security:** Multi-layered security approach including AWS Secrets Manager, granular API rate limiting, and a secure multi-stage Docker build.
-   **Monitoring:** Integrated with Sentry for real-time error tracking on both frontend and backend.

## Getting Started (for Developers)

### Prerequisites

-   Docker & Docker Compose
-   Python 3.11+
-   Node.js 18+
-   An AWS account with credentials configured locally.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv && source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    Copy `.env.example` to `.env` and fill in the values for your local database and other settings.
5.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```
6.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to point to your local backend (e.g., `http://127.0.0.1:8000`).
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Important Documentation

-   [**Deployment Checklist**](./DEPLOYMENT_CHECKLIST.md): Step-by-step guide for production deployments.
-   [**Disaster Recovery Plan**](./DISASTER_RECOVERY.md): Details on the automated failover strategy.
-   [**FinOps Strategy**](./FINOPS.md): Overview of cost management and optimization.
-   [**API Versioning**](./docs/API_VERSIONING.md): Strategy for API evolution and deprecation.
