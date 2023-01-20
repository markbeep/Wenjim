# Dockerfile used for deploying on the server

FROM python:3.11-alpine3.17 as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    POETRY_VERSION=1.3

WORKDIR /app

RUN apk add --no-cache gcc musl-dev libpq-dev
RUN pip install --no-cache "poetry==$POETRY_VERSION"
RUN python -m venv /venv

COPY backend/pyproject.toml backend/poetry.lock ./
RUN poetry export -f requirements.txt | /venv/bin/pip install -r /dev/stdin


FROM base as final

COPY backend/ .
EXPOSE 5000
ENTRYPOINT ["/venv/bin/gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--access-logfile -"]
