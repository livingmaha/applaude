# ---- Builder Stage ----
FROM python:3.11-slim-bullseye AS builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc default-libmysqlclient-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements.txt

# ---- Final Stage ----
FROM python:3.11-slim-bullseye AS final

WORKDIR /var/app/current

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=applaude_api.settings.production
ENV DOCKER_CONTAINER=true

# Create a non-root user for security. Note: EB uses 'webapp' user by default.
RUN groupadd -r webapp && useradd --no-log-init -r -g webapp webapp

# Install supervisor and runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends libmysqlclient-dev supervisor && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /var/log/supervisor

# Copy pre-compiled wheels from the builder stage
COPY --from=builder /usr/src/app/wheels /wheels
RUN pip install --no-cache /wheels/*

# Copy the supervisor configuration file
COPY backend/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy the application source code
COPY . .

# Create log files and set permissions
RUN touch /var/log/gunicorn.log /var/log/gunicorn_err.log /var/log/celery_worker.log /var/log/celery_worker_err.log /var/log/celery_beat.log /var/log/celery_beat_err.log && \
    chown -R webapp:webapp /var/app/current /var/log

USER webapp

EXPOSE 8000

# THE FINAL FIX: Start supervisor to manage all processes
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
