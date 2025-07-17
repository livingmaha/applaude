# Applaude - AI-Powered App Generation Platform

Applaude is a revolutionary platform that leverages generative AI to transform a simple URL into a fully functional, production-ready mobile application. Our vision is to empower creators, entrepreneurs, and businesses to launch their ideas instantly, without writing a single line of code.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Zustand
- **Backend:** Django, Django Rest Framework, Celery
- **Database:** PostgreSQL
- **AI:** Google's Gemini Pro
- **Deployment:** Vercel (Frontend), AWS Elastic Beanstalk (Backend), AWS RDS (Database), AWS ElastiCache (Celery Broker)

## Project Structure

.
├── backend/         # Django REST Framework Backend
├── frontend/        # React (Vite) Frontend
├── docs/            # Project Documentation (ADRs, etc.)
├── tests/           # E2E Tests
└── .github/         # CI/CD Workflows


## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Python (v3.11 or later)
- Docker & Docker Compose
- AWS CLI (configured with credentials)
- Vercel CLI (logged in)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set up environment variables:**
    Copy `.env.example` to `.env` and fill in the required values (Database URL, secret keys, etc.).
    ```bash
    cp .env.example .env
    ```
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
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## Component Library (Storybook)

We use Storybook to document and develop our UI components in isolation.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Run Storybook:**
    ```bash
    npm run storybook
    ```
    Storybook will open in your browser, typically at `http://localhost:6006`.

## CI/CD

Our CI/CD pipeline is managed by GitHub Actions and can be found in `.github/workflows/ci-cd.yml`. It includes:

-   Linting and security scans for both frontend and backend.
-   Automated deployments to Vercel (for frontend previews and production).
-   Automated deployments to AWS Elastic Beanstalk (for backend production).

## Deployment

-   **Frontend:** The frontend is automatically deployed to Vercel on every push to the `main` branch.
-   **Backend:** The backend is automatically deployed to AWS Elastic Beanstalk on every push to the `main` branch. The deployment process builds a Docker container, pushes it to ECR, and updates the Elastic Beanstalk environment.
