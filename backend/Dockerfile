FROM alpine:latest

WORKDIR /app


RUN apk --no-cache add python3
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip

ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip3 install --no-cache -r requirements.txt

COPY . .

EXPOSE 5000

CMD python3 server.py
