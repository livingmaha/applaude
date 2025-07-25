# FILE: backend/applaude_api/settings/production.py

import boto3
import json
import sentry_sdk
from botocore.exceptions import ClientError
from .base import *

DEBUG = False

# Fetch secrets from AWS Secrets Manager
def get_secret():
    secret_name = "applaude/production"
    region_name = "us-east-1"  # Or your specific region

    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=region_name)

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except ClientError as e:
        raise e
    else:
        return json.loads(get_secret_value_response['SecretString'])

secrets = get_secret()

SECRET_KEY = secrets['DJANGO_SECRET_KEY']
ALLOWED_HOSTS = secrets.get('ALLOWED_HOSTS', '').split(',')
CORS_ALLOWED_ORIGINS = secrets.get('CORS_ALLOWED_ORIGINS', '').split(',')

# --- PRODUCTION SECURITY SETTINGS ---
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# --- DATABASE CONFIGURATION ---
DATABASES = {
    'default': {
        'ENGINE': 'django_mysql_pool.backends.mysql',
        'NAME': secrets['DB_NAME'],
        'USER': secrets['DB_USER'],
        'PASSWORD': secrets['DB_PASSWORD'],
        'HOST': secrets['DB_HOST'],
        'PORT': secrets['DB_PORT'],
        'OPTIONS': {
            'ssl_mode': 'VERIFY_IDENTITY',
            'ssl': {'ca': '/etc/ssl/certs/aws-global-bundle.pem'}
        },
        'POOL_OPTIONS': {'POOL_SIZE': 10, 'MAX_OVERFLOW': 10, 'RECYCLE': 24 * 60 * 60}
    }
}

# --- STATIC FILES CONFIGURATION (THE FIX) ---
# Nginx will serve static files in production.
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / "staticfiles"
# We remove whitenoise storage for production.
# STATICFILES_STORAGE is not needed here; Django's default will be used.
# --- END OF FIX ---

# Sentry, Email, and other settings can remain as they are.
# (Assuming they are correctly configured in base.py and secrets)
