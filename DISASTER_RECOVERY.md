# Disaster Recovery Plan

This document outlines the steps to restore the Applaude application in a new AWS region in the event of a regional failure.

## 1. Restore RDS from Snapshot

1.  Navigate to the RDS console and select "Snapshots".
2.  Find the latest automated snapshot of the production database.
3.  Select the snapshot and click "Restore Snapshot".
4.  Choose the new AWS region and configure the new RDS instance.

## 2. Deploy Backend from ECR Image

1.  Create a new Elastic Beanstalk application and environment in the new region.
2.  Configure the environment to use the latest Docker image from the ECR repository.
3.  Update the environment variables to point to the new RDS instance and other resources.

## 3. Update DNS Records

1.  Update the DNS records to point to the new Elastic Beanstalk environment's URL.
