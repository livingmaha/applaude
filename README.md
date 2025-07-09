# Applause

**Build Your App with AI.**

Applause is a revolutionary platform that empowers non-technical creators to build and launch mobile applications using a system of interconnected AI agents. From market analysis to code generation, Applause handles the entire development lifecycle through a seamless, conversational interface.

---

### Technology Stack

* **Frontend:** React (Vite, TypeScript), Tailwind CSS, i18next
* **Backend:** Django, Django REST Framework, Celery, Channels
* **Database:** PostgreSQL
* **Cache/Broker:** Redis
* **AI & Payments:** Google Gemini API, Paystack
* **Deployment:** AWS (Elastic Beanstalk, RDS, ElastiCache, S3), Vercel

---

### Production Deployment: AWS & Vercel

This guide provides a robust protocol for deploying the Applause platform to a production environment using AWS for the backend and Vercel for the frontend.

#### **Part 1: Frontend Deployment (Vercel)**

Vercel is ideal for deploying our static React frontend.

1.  **Push to GitHub:** Ensure your final, tested code is on the `main` branch of your GitHub repository.
2.  **Create a Vercel Account:** Sign up at [vercel.com](https://vercel.com) and connect your GitHub account.
3.  **Import Project:**
    * From your Vercel dashboard, click "Add New... -> Project".
    * Select your `applause` GitHub repository.
4.  **Configure Project:**
    * **Root Directory:** Vercel will likely ask for the root directory. Set it to `frontend`. This tells Vercel where the `package.json` and `vite.config.ts` for the frontend are located.
    * **Framework Preset:** Vercel should automatically detect "Vite".
    * **Build & Output Settings:** These should be detected automatically.
    * **Environment Variables:** Add the following environment variable:
        * `VITE_API_URL`: Set this to the public URL of your deployed AWS backend (e.g., `https://api.yourdomain.com/api`).
5.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy the frontend. It will automatically set up a CI/CD pipeline, redeploying on every push to the `main` branch.

#### **Part 2: Backend Infrastructure (AWS)**

We will use AWS Elastic Beanstalk for the application, RDS for the database, ElastiCache for Redis, and S3 for file storage.

##### **Step 2.1: S3 for Static and Media Files**

1.  Go to the S3 console in AWS.
2.  Create a new bucket (e.g., `applause-prod-media`).
3.  **Permissions:** Under the "Permissions" tab, **uncheck "Block all public access"** and add a bucket policy to allow public read access.
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::your-bucket-name/*"
            }
        ]
    }
    ```
4.  **CORS:** Add a CORS configuration to allow your Vercel domain to fetch assets.
    ```xml
    <CORSConfiguration>
     <CORSRule>
       <AllowedOrigin>[https://your-vercel-domain.com](https://your-vercel-domain.com)</AllowedOrigin>
       <AllowedMethod>GET</AllowedMethod>
       <AllowedHeader>*</AllowedHeader>
     </CORSRule>
    </CORSConfiguration>
    ```

##### **Step 2.2: RDS for PostgreSQL Database**

1.  Go to the RDS console.
2.  Create a new PostgreSQL database.
3.  **Settings:** Choose a small instance size for starting (e.g., `db.t3.micro`). Set a master username and password.
4.  **Connectivity:** Ensure the database is created in the same VPC you plan to use for Elastic Beanstalk. For security, it should not be publicly accessible. Its security group should only allow inbound traffic on port `5432` from the Elastic Beanstalk security group (which you'll create later).

##### **Step 2.3: ElastiCache for Redis**

1.  Go to the ElastiCache console.
2.  Create a new Redis cluster.
3.  **Settings:** Choose a small node type (e.g., `cache.t2.micro`).
4.  **Connectivity:** Place it in the same VPC as RDS and Elastic Beanstalk. Its security group should only allow inbound traffic on port `6379` from the Elastic Beanstalk security group.

##### **Step 2.4: Elastic Beanstalk for Django Application**

Elastic Beanstalk (EB) will automate the deployment and scaling of our Django application.

1.  **Create `.ebextensions`:** In your `backend` directory, create a folder named `.ebextensions`. This folder will contain configuration files for the EB environment.

2.  **Create `01_packages.config`:**
    ```yaml
    # .ebextensions/01_packages.config
    packages:
      yum:
        postgresql-devel: []
        git: []
    ```

3.  **Create `02_django.config`:**
    ```yaml
    # .ebextensions/02_django.config
    option_settings:
      aws:elasticbeanstalk:container:python:
        WSGIPath: applause_api.wsgi:application
      aws:elasticbeanstalk:application:environment:
        DJANGO_SETTINGS_MODULE: applause_api.settings
        # Add all your .env variables here
        ENVIRONMENT: "production"
        DJANGO_SECRET_KEY: "your-production-secret-key"
        # ... and so on for DB, Redis, S3, Paystack, Gemini keys
    container_commands:
      01_migrate:
        command: "source /var/app/venv/staging-LQM1lest/bin/activate && python manage.py migrate --noinput"
        leader_only: true
      02_collectstatic:
        command: "source /var/app/venv/staging-LQM1lest/bin/activate && python manage.py collectstatic --noinput"
        leader_only: true
    ```
    **Note:** You must find the correct path to your virtual environment on the EB instance. The path above is an example.

4.  **Deploy with EB CLI:**
    * Install the EB CLI: `pip install awsebcli`
    * Navigate to your `backend` directory.
    * Initialize EB: `eb init -p python-3.10 applause-backend`
    * Create the environment: `eb create applause-prod-env`
    * **Important:** After creation, go to the EB console -> Configuration -> Security and add the security groups for RDS and ElastiCache to the EB instance's security group to allow connection.
    * Deploy changes: `eb deploy`

---
This concludes the final sprint. The platform is now fully internationalized, features dynamic pricing, and has a clear, professional deployment path for AWS and Vercel. The codebase is hardened and ready for production.
