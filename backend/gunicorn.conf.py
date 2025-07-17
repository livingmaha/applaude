import multiprocessing

# Server socket
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1

# Worker class
worker_class = "gevent"
worker_connections = 1000
threads = 4

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
capture_output = True

# Process naming
proc_name = "applaude_api"

# Server mechanics
timeout = 120
keepalive = 5
graceful_timeout = 30
