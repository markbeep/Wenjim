FROM python:3.11-alpine3.16

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apk add --no-cache libpq-dev gcc libc-dev

RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip

COPY requirements.txt .
RUN pip3 install --no-cache -r requirements.txt

COPY . .

EXPOSE 5000

CMD python3 server.py
