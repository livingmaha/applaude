# Gunicorn configuration file
import multiprocessing

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
threads = 2
timeout = 120
keepalive = 5

# The WSGI application path
wsgi_app = "applause_api.wsgi:application"

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
