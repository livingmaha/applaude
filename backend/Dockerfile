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

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=applaude_api.settings.production
ENV DOCKER_CONTAINER=true

RUN groupadd -r applaude && useradd --no-log-init -r -g applaude applaude

RUN apt-get update && apt-get install -y --no-install-recommends libmysqlclient-dev && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/wheels /wheels
RUN pip install --no-cache /wheels/*

COPY . .

RUN chown -R applaude:applaude /usr/src/app
USER applaude

EXPOSE 8000

# Add the command to run the application
CMD ["gunicorn", "--config", "gunicorn.conf.py", "applaude_api.wsgi:application"]
