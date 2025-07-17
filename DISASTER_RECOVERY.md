# Disaster Recovery (DR) Plan

This document outlines the automated disaster recovery plan for the Applaude platform, designed to ensure business continuity in the event of a regional AWS failure.

## 1. Recovery Objectives

- **Recovery Time Objective (RTO):** 1 hour. This is the maximum acceptable time for the service to be unavailable following a disaster.
- **Recovery Point Objective (RPO):** 15 minutes. This is the maximum acceptable amount of data loss, measured in time.

## 2. Automated Failover Architecture

The DR strategy is based on a multi-region, automated failover architecture using AWS services.

### 2.1. Database (AWS RDS)

- **Automated Cross-Region Snapshots:** The production RDS instance is configured to automatically replicate snapshots to a secondary region (e.g., `us-west-2`).
- **Recovery Process:** In the event of a primary region failure, a new RDS instance can be launched from the latest snapshot in the secondary region within minutes.

### 2.2. Backend Application (AWS Elastic Beanstalk)

- **Infrastructure as Code (IaC):** The entire Elastic Beanstalk environment, including application configuration, auto-scaling, and dependencies, is defined as code in the `.ebextensions` directory.
- **Recovery Process:** A new Elastic Beanstalk environment can be provisioned in the secondary region using the same IaC scripts. The application will be deployed from the latest Docker image stored in ECR, which is globally available.

### 2.3. DNS Failover (AWS Route 53)

- **Health Checks:** Route 53 is configured with a health check that continuously monitors the health of the primary Elastic Beanstalk environment's endpoint.
- **Automated Failover:** If the health check fails for a sustained period, Route 53 will automatically update the DNS records to failover to a pre-configured secondary endpoint.
- **Secondary Endpoint:** The secondary endpoint is a static S3 website that displays a user-friendly maintenance page, informing users that the platform is temporarily unavailable and will be back shortly. This prevents users from seeing cryptic error messages.

## 3. DR Drill and Testing

DR drills will be conducted quarterly to ensure the failover process works as expected and that the RTO and RPO can be met. The results of each drill will be documented, and any issues will be remediated.
