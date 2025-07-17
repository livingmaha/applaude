# --- Build Stage ---
# Use a full Python image to install dependencies
FROM python:3.11-slim as builder

WORKDIR /usr/src/app

# Install system dependencies required for MySQL client
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# Set environment variables to prevent caching of pip packages
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Copy the requirements file
COPY ./backend/requirements.txt .

# Install dependencies
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

# --- Final Stage ---
# Use a minimal base image for the final application
FROM python:3.11-slim

WORKDIR /usr/src/app

# Install system dependencies required for MySQL client
RUN apt-get update && apt-get install -y default-libmysqlclient-dev && rm -rf /var/lib/apt/lists/*

# Copy the virtual environment from the builder stage
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .

# Install dependencies from wheels
RUN pip install --no-cache /wheels/*

# Copy the application source code
COPY ./backend .

# Expose the port the app runs on
EXPOSE 8000

# The command to run the application using Gunicorn (a production-grade WSGI server)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "applaude_api.wsgi:application"]
