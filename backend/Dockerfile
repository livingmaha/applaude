# ---- Builder Stage ----
# This stage installs all dependencies, including dev dependencies for building.
FROM python:3.11-slim-bullseye AS builder

WORKDIR /usr/src/app

# Set environment variables to prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies required for building Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install poetry for dependency management
RUN pip install poetry

# Copy only the files needed for dependency installation to leverage Docker cache
COPY poetry.lock pyproject.toml ./

# Install project dependencies, excluding development ones
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev --no-interaction --no-ansi

# ---- Final Stage ----
# This is the lean, production-ready image.
FROM python:3.11-slim-bullseye AS final

WORKDIR /usr/src/app

# Set environment variables for production
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=applaude_api.settings.production

# Create a non-root user for security
RUN groupadd -r applaude && useradd --no-log-init -r -g applaude applaude
RUN chown applaude:applaude /usr/src/app
USER applaude

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# The command to run the application will be in the Procfile
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "applaude_api.wsgi:application"]
