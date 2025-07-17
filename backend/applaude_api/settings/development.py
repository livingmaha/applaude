import boto3
import json
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from botocore.exceptions import ClientError
from .base import *
import os

DEBUG = False

def get_secret():
    secret_name = os.environ.get("AWS_SECRET_NAME", "applaude/production")
    region_name = os.environ.get("AWS_REGION", "us-east-1")

    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        # Better error handling for missing secrets
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            raise Exception(f"The requested secret {secret_name} was not found")
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            raise Exception(f"The request was invalid due to: {e}")
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            raise Exception(f"The request had invalid params: {e}")
        else:
            raise e
    else:
        return json.loads(get_secret_value_response['SecretString'])

secrets = get_secret()

SECRET_KEY = secrets['DJANGO_SECRET_KEY']
ALLOWED_HOSTS = secrets['ALLOWED_HOSTS'].split(',')
CORS_ALLOWED_ORIGINS = secrets.get('CORS_ALLOWED_ORIGINS', 'https://www.applaude.ai').split(',')

# Production Security Settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000 # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# Database Configuration for AWS RDS MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': secrets['DB_NAME'],
        'USER': secrets['DB_USER'],
        'PASSWORD': secrets['DB_PASSWORD'],
        'HOST': secrets['DB_HOST'],
        'PORT': secrets['DB_PORT'],
        'OPTIONS': {
            'ssl_mode': 'VERIFY_IDENTITY',
            # AWS provides a combined CA bundle, so you don't need a specific file path
            'ssl': {
                'ca': secrets.get('RDS_CA_PATH', '/etc/ssl/certs/aws-global-bundle.pem')
            }
        },
    }
}

# Redis/ElastiCache for Channels and Celery
REDIS_HOST = secrets['REDIS_HOST']
REDIS_PORT = secrets.get('REDIS_PORT', 6379)
CELERY_BROKER_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
CELERY_RESULT_BACKEND = f"redis://{REDIS_HOST}:{REDIS_PORT}/1"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(REDIS_HOST, REDIS_PORT)],
        },
    },
}

# Sentry Configuration
sentry_sdk.init(
    dsn=secrets.get('SENTRY_DSN'),
    integrations=[
        DjangoIntegration(),
        CeleryIntegration(),
        RedisIntegration(),
    ],
    traces_sample_rate=0.2, # Sample 20% of transactions
    send_default_pii=True,
    environment="production"
)

# AWS S3 Storage for Static and Media Files
AWS_ACCESS_KEY_ID = secrets.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = secrets.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = secrets.get('S3_BUCKET_NAME')
AWS_S3_REGION_NAME = os.environ.get("AWS_REGION", "us-east-1")
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
AWS_DEFAULT_ACL = 'private'
AWS_LOCATION = 'static'

# Static files settings for production
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_LOCATION}/'

# Media files settings for production
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'


LOGGING['handlers']['sentry'] = {
    'level': 'ERROR',
    'class': 'sentry_sdk.integrations.logging.SentryHandler',
}
LOGGING['root']['handlers'].append('sentry')


# Email Backend (AWS SES)
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_ACCESS_KEY_ID = secrets.get('AWS_ACCESS_KEY_ID')
AWS_SES_SECRET_ACCESS_KEY = secrets.get('AWS_SECRET_ACCESS_KEY')
AWS_SES_REGION_NAME = os.environ.get("AWS_REGION", "us-east-1")
DEFAULT_FROM_EMAIL = secrets.get('DEFAULT_FROM_EMAIL', 'noreply@applaude.ai')
