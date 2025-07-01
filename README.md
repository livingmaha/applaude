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

**Backend:**
* Django (Monolithic, Django REST Framework)
* Celery (for asynchronous AI tasks)
* Django Channels (for WebSockets)

**Database & Broker:**
* MySQL (or PostgreSQL in production)
* Redis

**AI & Payments:**
* Google Gemini API
* Paystack Payment Gateway

---

### Final Execution Protocol: Local Deployment

Follow these steps precisely to set up and run the entire Applause platform locally.

(Local deployment instructions remain the same)

---

### **Part 4: Production Deployment Protocol**

This section outlines the steps to deploy the Applause platform to a production environment (e.g., a cloud server like AWS EC2, DigitalOcean, etc.).

#### **A. Frontend Deployment (Vercel)**

The frontend is a static React application and is best hosted on a platform optimized for static sites.

1.  **Push to GitHub:** Ensure your final code is pushed to your GitHub repository.
2.  **Create a Vercel Account:** Sign up or log in to [Vercel](https://vercel.com).
3.  **Import Project:** Import your GitHub repository into Vercel.
4.  **Configure Project:**
    * **Framework Preset:** Vercel should automatically detect it as a Vite project.
    * **Root Directory:** Set the root directory to `frontend`.
    * **Environment Variables:** Add an environment variable `VITE_API_URL` and set it to the public URL of your backend API (e.g., `https://api.yourapplause.com/api`).
5.  **Deploy:** Vercel will automatically build and deploy the frontend. It will also redeploy on every push to the `main` branch.

#### **B. Backend Deployment (Ubuntu Server)**

This guide assumes you have an Ubuntu server set up.

1.  **Install Dependencies:**
    ```bash
    sudo apt-get update
    sudo apt-get install python3-venv python3-dev libmysqlclient-dev nginx supervisor redis-server
    ```

2.  **Clone Repository:**
    ```bash
    git clone [https://github.com/your-username/applause.git](https://github.com/your-username/applause.git)
    cd applause/backend
    ```

3.  **Setup Environment:**
    * Create and activate the virtual environment as in the local setup.
    * Install dependencies: `pip install -r requirements.txt`.
    * Create and populate the `.env` file with your production keys and database credentials. Set `DEBUG=False`.

4.  **Setup Gunicorn:** Gunicorn will serve as the production WSGI server for Django.
    * A sample configuration is provided in `gunicorn.conf.py`.

5.  **Setup Nginx (Reverse Proxy):** Nginx will face the public internet and proxy requests to Gunicorn.
    * Create a new Nginx configuration file:
        ```bash
        sudo nano /etc/nginx/sites-available/applause
        ```
    * Paste the contents of the provided `nginx.conf` into this file, making sure to replace `your_domain.com` and other placeholders.
    * Enable the site and restart Nginx:
        ```bash
        sudo ln -s /etc/nginx/sites-available/applause /etc/nginx/sites-enabled
        sudo nginx -t
        sudo systemctl restart nginx
        ```

6.  **Setup Supervisor (Process Management):** Supervisor will ensure the Gunicorn and Celery processes are always running.
    * Create a new Supervisor configuration file:
        ```bash
        sudo nano /etc/supervisor/conf.d/applause.conf
        ```
    * Paste the contents of the provided `supervisor.conf` file, updating paths as necessary.
    * Start the processes:
        ```bash
        sudo supervisorctl reread
        sudo supervisorctl update
        sudo supervisorctl start applause-gunicorn
        sudo supervisorctl start applause-celery
        ```

7.  **Run Migrations & Collect Static:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py collectstatic
    ```

**Your Applause platform is now live in production.**
