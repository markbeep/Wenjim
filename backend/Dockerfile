# Dockerfile used for local developement

FROM python:3.11-alpine3.16

ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip

COPY requirements.txt .
RUN pip3 install --no-cache -r requirements.txt

# installs the requirements from the scraper as well
COPY scraper/requirements.txt scraper/requirements.txt
RUN pip3 install --no-cache -r scraper/requirements.txt

COPY scraper/models.py scraper/models.py
COPY server.py .

EXPOSE 5000

CMD python3 server.py
