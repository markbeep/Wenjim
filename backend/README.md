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
docker compose up --build # separate terminal
```

(The docker-compose file in the backend directory only starts up a postgres service)

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

## Testdata

Add random testdata locally by running the following:

`poetry run python manage.py testdata`

This requires the postgres server to be running.

## Accessing Postgres in Kubernetes

Port forward the psql pod:
`kubectl port-forward pod/wenjim-staging-psql-74f9b59d5c-pl7xp 5432:5432`

Once the port forward is running, simply run:
`psql --host localhost --username postgres`
