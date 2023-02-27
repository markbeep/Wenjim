# Backend

The backend is split into two parts. There is the scraper which gets the latest stats from
the ASVZ API and then there's the backend Flask instance using Peewee on SQLite.

The backend is a Python REST API server running with Flask. [Poetry](https://python-poetry.org/)
is used to maintain consistent and reproducible package versions.

Poetry additional has `pylint` and `black` installed for linting and consistent formatting.
Simply run `poetry run black .` to format all the documents in the current directory.

But there are also Dockerfiles to run the programs without Poetry if desired.

## Local Development

Poetry:
```bash
cd backend
poetry install
poetry run start
```

Docker: (the file is in the root)
```bash
docker compose up --build
```
*Note:* The Dockerfile here requires the context to be the root directory
for it to be able to generate the proto files.
