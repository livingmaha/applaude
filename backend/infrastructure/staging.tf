provider "aws" {
  region = "us-east-1"
}

resource "aws_elastic_beanstalk_application" "staging_app" {
  name = "applaude-backend-staging"
}

resource "aws_elastic_beanstalk_environment" "staging_env" {
  name                = "applaude-staging-env"
  application         = aws_elastic_beanstalk_application.staging_app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.5 running Docker"

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }
}

resource "aws_db_instance" "staging_db" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  name                 = "applaude_staging"
  username             = "admin"
  password             = "yourpassword"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
}

resource "aws_elasticache_cluster" "staging_redis" {
  cluster_id           = "applaude-staging-redis"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}
