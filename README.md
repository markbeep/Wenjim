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

These should suffice to get everything setup for simple local development.
There are Dockerfiles for using the scraper or backend if needed.

**Note:** A part of the backend is [Envoy](https://www.envoyproxy.io/). This is
a proxy that translates the GRPC-Web requests to normal GRPC calls, meaning it also has to be
ran. Easiest is to run it with the docker-compose file in the root:
```bash
docker compose up --build
```

# GRPC
Wenjim uses GRPC to communicate between the front- and backend.

To generate the required proto files, simply execute:
```bash
make
```
*Poetry is required for this.*

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

# NixOS
For NixOS users, the `shell.nix` is required as a workaround for
grpc_tools to work and generate the proto files.
