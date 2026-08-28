# clubcc

[![CI](https://github.com/sbayshop3171-ship-it/clubcc/actions/workflows/ci.yml/badge.svg)](https://github.com/sbayshop3171-ship-it/clubcc/actions/workflows/ci.yml)

Local Node.js dashboard project.

## Run locally

```bash
npm start
```

The server uses `HOST` and `PORT` from `.env` when present. Copy `.env.example` to `.env` locally and set a private `MASTER_ADMIN_KEY`.

## Data

Local runtime JSON data and auth logs are intentionally ignored by Git:

- `data/*.json`
- `storage/logs/`
- `.env`

The server creates the required local JSON files when it runs.
