# Wenjim

When gym? Find out with this tool!
## Local Development

### Backend
The backend is split into two parts. There is the scraper which gets the latest stats from
the ASVZ API and then there's the backend Flask instance using Peewee on SQLite.

The backend is a Python REST API server running with Flask. [Poetry](https://python-poetry.org/)
is used to maintain consistent and reproducible package versions.

Poetry additional has `pylint` and `black` installed for linting and consistent formatting.
Simply run `poetry run black .` to format all the documents in the current directory.

But there are also Dockerfiles to run the programs without Poetry if desired.

**Scraper:**
Poetry:
```bash
cd backend/scraper
poetry install
poetry run python scraper.py
```

Docker:
```bash
cd backend/scraper
docker build -t scraper . && docker run --rm scraper
```

**REST API Backend:**
Poetry:
```bash
cd backend/scraper
poetry install
poetry run python scraper.py

Docker:
```bash
cd backend
docker compose up --build
```

### Frontend
Frontend runs on Next.js. To start simply run:
```bash
cd frontend
npm i # install all packages
npm run dev
```
