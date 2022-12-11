FROM python:3.11-alpine3.16

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip

COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY models.py .
COPY scraper.py .

CMD python3 scraper.py
