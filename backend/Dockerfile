# --- Builder Stage ---
FROM python:3.11-slim-bookworm as builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements.txt


# --- Final Stage ---
FROM python:3.11-slim-bookworm as final

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE=applaude_api.settings.production

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system app && adduser --system --group app

COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache-dir /wheels/*

COPY ./backend .

RUN chown -R app:app /usr/src/app

USER app

EXPOSE 8000

CMD ["gunicorn", "--config", "gunicorn.conf.py", "applaude_api.wsgi:application"]
