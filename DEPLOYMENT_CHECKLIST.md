# Production Deployment Checklist

This checklist must be completed before every production deployment to ensure a smooth and secure launch.

## 1. Pre-Deployment

-   [ ] **Code Review & Merge:** All code has been peer-reviewed and merged into the `main` branch.
-   [ ] **Automated Tests Pass:** The CI/CD pipeline on GitHub Actions has passed all linting, testing, and security scans for the `main` branch commit.
-   [ ] **Secrets & Environment Variables Confirmed:**
    -   [ ] **AWS Secrets Manager:** All required secrets (`DJANGO_SECRET_KEY`, `DB_PASSWORD`, etc.) are correctly configured in the `applaude/production` secret.
    -   [ ] **Vercel Environment Variables:** All variables listed in `/frontend/.env.example` (like `VITE_API_BASE_URL` and `VITE_SENTRY_DSN`) are set correctly in the Vercel project's "Production" environment.
-   [ ] **Database Migration Review:** Any new database migrations have been reviewed and tested in a staging environment. The CI/CD pipeline will apply them automatically, but they must be correct.
-   [ ] **Manual DR Snapshot (Optional but Recommended):** For major releases, manually trigger an AWS RDS snapshot before deployment for an extra layer of protection.

## 2. Deployment

-   [ ] **Trigger Deployment:** The deployment is automatically triggered by a push to the `main` branch. Monitor the `deploy-production` job in the GitHub Actions workflow.
-   [ ] **Monitor Backend Deployment:**
    -   Check the AWS Elastic Beanstalk console for the `applaude-prod-env`.
    -   Verify the environment updates successfully to the new version.
    -   Monitor the environment's health status and logs for any errors post-deployment. The update should be seamless with zero downtime.
-   [ ] **Monitor Frontend Deployment:**
    -   Check the Vercel dashboard for the production deployment status.
    -   Verify the deployment completes successfully.

## 3. Post-Deployment Verification

-   [ ] **Clear Browser Cache:** Perform a hard refresh (`Ctrl+Shift+R` or `Cmd+Shift+R`) to ensure you are loading the latest frontend assets.
-   [ ] **Smoke Test Critical User Flows:**
    -   [ ] **User Registration:** Create a new test account.
    -   [ ] **User Login/Logout:** Log in and log out with an existing account.
    -   [ ] **Core Feature (Project Creation):** Test the primary feature of the application.
-   [ ] **Check Monitoring Dashboards:**
    -   [ ] **Sentry:** Check for any new or unusual errors in both the frontend and backend projects.
    -   [ ] **AWS CloudWatch:** Briefly check CPU Utilization and Response Time graphs for the Elastic Beanstalk environment and RDS instance to ensure they are within normal parameters.
-   [ ] **Internal Communication:** Announce the successful deployment to the team.

## 4. In Case of Failure (Rollback Plan)

-   **Backend (Elastic Beanstalk):**
    1.  Navigate to the Elastic Beanstalk environment in the AWS Console.
    2.  Go to "Application versions".
    3.  Select the previous, known-good version and click "Deploy". This will immediately roll back the application code.
-   **Frontend (Vercel):**
    1.  Navigate to the project in the Vercel Dashboard.
    2.  Go to the "Deployments" tab.
    3.  Find the previous production deployment, click the "..." menu, and select "Promote to Production".
