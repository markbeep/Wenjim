# builds the protofiles

all: backend frontend

backend: poetry
	(cd backend && poetry run poe build)

poetry:
	(cd backend && poetry install)

frontend: packages
	(cd frontend && npm run build:proto)

packages:
	(cd frontend && npm i)
