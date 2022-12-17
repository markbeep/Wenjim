# Wenjim

When gym? Find out with this tool!
## Local Development

### Backend
Backend is split into two parts. There is the scraper which gets the latest stats from
the ASVZ API and then there's the backend Flask instance using Peewee on SQLite.

Backend is all set up using Dockerfiles. So it can all be run using a simple command.

**Scraper:**
```bash
cd backend/scraper
docker build -t scraper . && docker run scraper
```

**Backend:**
```bash
cd backend
docker compose up --build
```

### Frontend
Frontend runs on Next.js. To start simply run:
```bash
cd frontend
npm run dev
```
