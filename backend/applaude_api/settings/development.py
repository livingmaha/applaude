import boto3
import json
import sentry_sdk
from botocore.exceptions import ClientError
from .base import *

DEBUG = False

# Fetch secrets from AWS Secrets Manager
def get_secret():
    secret_name = "applaude/production"
    region_name = "us-east-1"

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
ALLOWED_HOSTS = secrets['ALLOWED_HOSTS'].split(',')
CORS_ALLOWED_ORIGINS = secrets['CORS_ALLOWED_ORIGINS'].split(',')

# Production Security Settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000 # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'


DATABASES = {
    'default': {
        'ENGINE': 'django_mysql_pool.backends.mysql',
        'NAME': secrets['DB_NAME'],
        'USER': secrets['DB_USER'],
        'PASSWORD': secrets['DB_PASSWORD'],
        'HOST': secrets['DB_HOST'],
        'PORT': secrets['DB_PORT'],
        'OPTIONS': {
            'ssl': {'ca': '/path/to/your/rds-ca-2019-root.pem'} # IMPORTANT: Provide correct path to CA cert
        },
        'POOL_OPTIONS': {
            'POOL_SIZE': 10,
            'MAX_OVERFLOW': 10,
            'RECYCLE': 24 * 60 * 60,
        },
    }
}

# Celery and ElastiCache Configuration
CELERY_BROKER_URL = f"rediss://:{secrets.get('REDIS_AUTH_TOKEN')}@{os.environ.get('REDIS_ENDPOINT')}:{secrets.get('REDIS_PORT', 6379)}/0?ssl_cert_reqs=required"
CELERY_RESULT_BACKEND = f"rediss://:{secrets.get('REDIS_AUTH_TOKEN')}@{os.environ.get('REDIS_ENDPOINT')}:{secrets.get('REDIS_PORT', 6379)}/0?ssl_cert_reqs=required"


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(os.environ.get('REDIS_ENDPOINT'), secrets.get('REDIS_PORT', 6379))],
             "ssl_cert_reqs": "required",
        },
    },
}

# Sentry Configuration
sentry_sdk.init(
    dsn=secrets.get('SENTRY_DSN'),
    integrations=[
        sentry_sdk.integrations.django.DjangoIntegration(),
        sentry_sdk.integrations.celery.CeleryIntegration(),
        sentry_sdk.integrations.redis.RedisIntegration(),
    ],
    traces_sample_rate=0.2, # Sample 20% of transactions
    send_default_pii=True,
    environment="production"
)

# AWS S3 Storage for Static and Media Files
AWS_ACCESS_KEY_ID = secrets.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = secrets.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = secrets.get('S3_BUCKET_NAME')
AWS_S3_REGION_NAME = 'us-east-1'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
AWS_DEFAULT_ACL = 'private'

# Static files settings
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'

# Media files settings
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'


LOGGING['handlers']['sentry'] = {
    'level': 'ERROR',
    'class': 'sentry_sdk.integrations.logging.SentryHandler',
}
LOGGING['root']['handlers'].append('sentry')


# Email Backend (e.g., SES)
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_ACCESS_KEY_ID = secrets.get('AWS_SES_ACCESS_KEY_ID')
AWS_SES_SECRET_ACCESS_KEY = secrets.get('AWS_SES_SECRET_ACCESS_KEY')
AWS_SES_REGION_NAME = 'us-east-1'
DEFAULT_FROM_EMAIL = 'john@applaude.pro'
