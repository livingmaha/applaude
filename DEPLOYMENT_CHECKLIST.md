# Applaude Platform - Final Launch Deployment Checklist

**Operator:** _________________________
**Date:** _________________________
**Time (UTC):** _________________________

This checklist is the definitive guide for the final deployment of the "Applaude" platform. Follow each step meticulously. Do not proceed to the next step until the current one is successfully completed and verified.

---

### **Phase 1: Pre-Deployment Readiness**

* [ ] **Confirm Final Code Freeze:** Verify that the `main` branch is frozen and no new commits will be merged until after launch.
* [ ] **AWS Console Login:** Log in to the AWS Management Console with administrator privileges.
* [ ] **Vercel CLI Login:** Ensure you are logged into the Vercel CLI (`vercel login`).
* [ ] **GitHub Secrets Configuration:**
    * Navigate to the GitHub repository's `Settings > Secrets and variables > Actions`.
    * Verify the following secrets are correctly configured and have not expired:
        * `AWS_ACCESS_KEY_ID`: For deploying to Elastic Beanstalk.
        * `AWS_SECRET_ACCESS_KEY`: For deploying to Elastic Beanstalk.
        * `S3_BUCKET_NAME`: For static file storage.
        * `VERCEL_ORG_ID`: For Vercel frontend deployment.
        * `VERCEL_PROJECT_ID`: For Vercel frontend deployment.
        * `SNYK_TOKEN`: For the dependency and license scan job.
* [ ] **AWS Resource Health Check:**
    * **RDS:** Navigate to the RDS dashboard. Confirm the production database instance is `Available` and that automated backups are enabled.
    * **ElastiCache:** Navigate to the ElastiCache dashboard. Confirm the Redis cluster for Celery is `Available`.
    * **Elastic Beanstalk:** Navigate to the Elastic Beanstalk dashboard. Confirm the production environment is `Ready` and healthy.

---

### **Phase 2: CI/CD Pipeline Execution**

* [ ] **Merge to `main`:** Merge the final, approved pull request into the `main` branch. This will automatically trigger the `Applaude Production CI/CD` workflow in GitHub Actions.
* [ ] **Monitor Pipeline Execution:**
    * Navigate to the "Actions" tab in the GitHub repository.
    * Monitor the progress of the workflow.
    * **Critical:** Ensure all jobs, especially `security-and-license-scan`, complete successfully. If any job fails, **HALT** the deployment and escalate to the engineering lead immediately.
* [ ] **Verify ECR Image Push:** Once the `build-and-push-to-ecr` job is complete, navigate to the Amazon ECR dashboard and confirm that a new image with the latest Git SHA tag has been pushed to the `applaude-backend` repository.

---

### **Phase 3: Backend Deployment (Elastic Beanstalk)**

* [ ] **Verify Elastic Beanstalk Deployment:** The `deploy-to-elastic-beanstalk` job in the CI/CD pipeline will automatically handle this.
    * Monitor the Elastic Beanstalk environment in the AWS console. The status will change to `Updating`.
    * Wait for the environment status to return to `Ready` and the health to be `Ok`.
* [ ] **Smoke Test API:** Make a test request to a health check endpoint on the backend API (e.g., `https://<your-eb-url>/api/health/`) to confirm the new version is live and responsive.

---

### **Phase 4: Frontend Deployment (Vercel)**

* [ ] **Execute Vercel Deployment:** From the root of the local repository, run the following command to deploy the frontend to production:
    ```bash
    vercel --prod
    ```
* [ ] **Monitor Vercel Deployment:** Follow the output of the Vercel CLI. It will provide a URL to monitor the build and deployment status.
* [ ] **Confirm Production URL:** Once deployment is complete, Vercel will assign the new build to the production domain (`applaude.ai`).

---

### **Phase 5: Post-Launch Verification**

* [ ] **Clear Caches:** Perform a hard refresh and clear the cache in your browser to ensure you are loading the latest version of the frontend.
* [ ] **End-to-End Test:** Perform a full, end-to-end user journey test:
    * Create a new account.
    * Log in.
    * Create a new project.
    * Navigate through the application's core features.
* [ ] **Monitor Production Logs:**
    * Tail the logs in both Vercel (for the frontend) and AWS CloudWatch (for the backend).
    * Watch for any unexpected errors or warnings.
* [ ] **Final Sign-off:** Once all checks are complete and no critical issues are found, sign off on the launch.

**Launch Status:** SUCCESSFUL / ROLLED BACK
**Operator Signature:** _________________________
