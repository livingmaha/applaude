import os
from celery import Celery
from celery.schedules import crontab # Import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'applaude_api.settings')

app = Celery('applaude_api')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Add the periodic task schedule
app.conf.beat_schedule = {
    'send-testimonial-requests-daily': {
        'task': 'send_testimonial_requests',
        'schedule': crontab(hour=8, minute=0),  # Runs daily at 8:00 AM
    },
}
