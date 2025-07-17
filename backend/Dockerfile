# ---- Builder Stage ----
# This stage installs all dependencies, including dev dependencies for building.
FROM python:3.11-slim-bullseye AS builder

WORKDIR /usr/src/app

# Set environment variables to prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies required for building Python packages like mysqlclient
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc default-libmysqlclient-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements.txt


# ---- Final Stage ----
# This is the lean, production-ready image.
FROM python:3.11-slim-bullseye AS final

WORKDIR /usr/src/app

# Set environment variables for production
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=applaude_api.settings.production
ENV DOCKER_CONTAINER=true

# Create a non-root user for security
RUN groupadd -r applaude && useradd --no-log-init -r -g applaude applaude

# Install only necessary system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends libmysqlclient-dev && rm -rf /var/lib/apt/lists/*

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/src/app/wheels /wheels
RUN pip install --no-cache /wheels/*

# Copy the application code
COPY . .

# Change ownership of the app directory
RUN chown -R applaude:applaude /usr/src/app
USER applaude

# Expose the port the app runs on
EXPOSE 8000

# The command to run the application will be in the Procfile
# Gunicorn will be started by the Procfile defined in .ebextensions
