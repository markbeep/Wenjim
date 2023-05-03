# Backend

The backend is split into two parts. There is the scraper which gets the latest stats from
the ASVZ API and then there's the backend Flask instance using Peewee on SQLite.

The backend is a Python REST API server running with Flask. [Poetry](https://python-poetry.org/)
is used to maintain consistent and reproducible package versions.

Poetry additional has `pylint` and `black` installed for linting and consistent formatting.
Simply run `poetry run black .` (note the period) to format all the documents in the current directory.

But there are also Dockerfiles to run the services without Poetry if desired.

## Local Development

**Poetry:**
Enables hot-reload, but requires you to set the environment variables manually.

```bash
cd backend
poetry install
poetry run start
```

If the start fails, you can also start it differently: `poetry run flask --debug -A server run -h "0.0.0.0" -p 8080`

**Docker:** (the file is in the root)

```bash
docker compose up --build
```

_Note:_ The Dockerfile here requires the context to be the root directory
for it to be able to generate the proto files.

## Migrations

To make database changes consistent, there is a list of migrations which can be executed.

If you change the database models, run `poetry run python manage.py create NAME` to create
a new migration with the `NAME`. To apply all migrations run `poetry run python manage.py migrate`.
