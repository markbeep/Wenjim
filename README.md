# Wenjim

When gym? Find out with this tool!

## Local Development

The exact details on how to setup the front- and backend are in the READMEs
of the specific directory. The general requirements are:

- Frontend
  - Node LTS (>=16)
  - npm
- Backend
  - Python 3.11
  - [Poetry](https://python-poetry.org/) (package manager)
  - Docker Compose

These should suffice to get everything setup for simple local development.
There are Dockerfiles for using the scraper or backend if needed.

Easiest is to run the backend with the docker-compose file in the root.
For more details and hot-reload, check the README in the backend directory.

```bash
docker compose up --build
```

# GRPC

Wenjim uses GRPC to communicate between the front- and backend.

To generate the required proto files, simply execute:

```bash
make
```

_Poetry is required for this._

## "Manual" Install

The manual install consists of simply executing the Makefile manually:

### Backend

```bash
cd backend
poetry run poe build
```

### Frontend

```bash
cd backend
npm run build:proto
```
