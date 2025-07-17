provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket = "applaude-terraform-state"
    key    = "staging/terraform.tfstate"
    region = "us-east-1"
  }
}

variable "db_password" {
  description = "Staging RDS password"
  type        = string
  sensitive   = true
}

resource "aws_elastic_beanstalk_application" "staging_app" {
  name = "applaude-backend-staging"
  description = "Staging environment for Applaude backend"
}

resource "aws_elastic_beanstalk_environment" "staging_env" {
  name                = "applaude-staging-env"
  application         = aws_elastic_beanstalk_application.staging_app.name
  solution_stack_name = "64bit Amazon Linux 2 v5.8.0 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role" # Ensure this role exists
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = "vpc-xxxxxxxx" # Replace with your VPC ID
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = "subnet-xxxxxxxx,subnet-yyyyyyyy" # Replace with your Subnet IDs
  }
}

resource "aws_db_instance" "staging_db" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0.33"
  instance_class       = "db.t3.micro"
  db_name              = "applaude_staging"
  username             = "staging_user"
  password             = var.db_password
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
  publicly_accessible  = false
}

resource "aws_elasticache_cluster" "staging_redis" {
  cluster_id           = "applaude-staging-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
  apply_immediately    = true
}
