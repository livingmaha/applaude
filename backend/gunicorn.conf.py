import multiprocessing
import os

# Server socket
bind = os.environ.get('GUNICORN_BIND', '0.0.0.0:8000')

# Worker processes
# A common formula is (2 * number of CPU cores) + 1
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'gthread'
threads = 4  # Number of threads per worker

# Logging
loglevel = os.environ.get('GUNICORN_LOGLEVEL', 'info')
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr

# Process naming
proc_name = 'applaude_api'

# Timeouts
timeout = 120
graceful_timeout = 90

# Security: Avoid running as root
user = 'applaude'
group = 'applaude'
