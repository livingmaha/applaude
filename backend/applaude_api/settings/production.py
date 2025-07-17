from .base import *
import boto3
import json
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.redis import RedisIntegration

DEBUG = False

ALLOWED_HOSTS = [".vercel.app", ".amazonaws.com"]

# AWS Secrets Manager
def get_secret():
    secret_name = "applaude/production"
    region_name = "us-east-1"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e
    else:
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            return json.loads(secret)
        else:
            decoded_binary_secret = base64.b64decode(get_secret_value_response['SecretBinary'])
            return json.loads(decoded_binary_secret)

secrets = get_secret()

SECRET_KEY = secrets['DJANGO_SECRET_KEY']
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': secrets['DB_NAME'],
        'USER': secrets['DB_USER'],
        'PASSWORD': secrets['DB_PASSWORD'],
        'HOST': secrets['DB_HOST'],
        'PORT': secrets['DB_PORT'],
        'OPTIONS': {
            'sslmode': 'require',
        }
    }
}

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(secrets['REDIS_HOST'], secrets['REDIS_PORT'])],
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
    traces_sample_rate=1.0,
    send_default_pii=True,
    environment="production"
)

# Static files settings
AWS_ACCESS_KEY_ID = secrets.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = secrets.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = secrets.get('S3_BUCKET_NAME')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
}
AWS_LOCATION = 'static'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{AWS_LOCATION}/'
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}

# Celery Configuration
CELERY_BROKER_URL = f"redis://{secrets.get('REDIS_HOST')}:{secrets.get('REDIS_PORT', 6379)}/0"
CELERY_RESULT_BACKEND = f"redis://{secrets.get('REDIS_HOST')}:{secrets.get('REDIS_PORT', 6379)}/0"
CELERY_BROKER_USE_SSL = {
    'ssl_cert_reqs': 'required',
}
CELERY_REDIS_BACKEND_USE_SSL = {
    'ssl_cert_reqs': 'required',
}


# Rate Limiting
RATELIMIT_ENABLE = True
RATELIMIT_GROUP_PREFIX = 'ratelimit'
RATELIMIT_KEY_PREFIX = 'rl'
RATELIMIT_USE_CACHE = 'default'
RATELIMIT_CACHE_PREFIX = 'rl:'
RATELIMIT_GLOBAL = '1000/h'
RATELIMIT_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
RATELIMIT_SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']
