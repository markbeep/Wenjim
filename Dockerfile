# Dockerfile used for deploying on the server

FROM python:3.11-alpine3.16

ENV PYTHONUNBUFFERED=1

RUN apk add --no-cache gcc musl-dev libpq-dev

RUN pip3 install --no-cache --upgrade pip

WORKDIR /app
COPY backend/requirements.txt .
RUN python -m pip install --no-cache -r requirements.txt
COPY backend/ .

EXPOSE 5000

ENTRYPOINT ["gunicorn", "--config", "gunicorn_config.py", "wsgi:app", "--access-logfile -"]
