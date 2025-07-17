# --- Build Stage ---
# Use a full Python image to install dependencies
FROM python:3.11-slim as builder

WORKDIR /app

# Set environment variables to prevent caching of pip packages
ENV PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    POETRY_NO_INTERACTION=1

# Install Poetry
RUN pip install poetry

# Copy only the files necessary for installing dependencies
COPY poetry.lock pyproject.toml ./

# Install dependencies into a virtual environment
RUN poetry install --no-root --no-dev --path .venv

# --- Final Stage ---
# Use a minimal base image for the final application
FROM python:3.11-slim

WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /app/.venv ./.venv

# Set the PATH to include the virtual environment's bin directory
ENV PATH="/app/.venv/bin:$PATH"

# Copy the application source code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# The command to run the application using Gunicorn (a production-grade WSGI server)
# The --chdir flag is important for Django to find the manage.py file
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--chdir", "backend", "applaude_api.wsgi:application"]
