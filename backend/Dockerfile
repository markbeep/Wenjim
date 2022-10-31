FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add python3
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip

COPY requirements.txt .
RUN pip3 install --no-cache -r requirements.txt

COPY .env.deploy .env.local
COPY . .

EXPOSE 5000

CMD python3 server.py
