## Continuous Deployment (CD)

CD is triggered by GitHub Actions (GHA) when a push occurs on the
`main` branch. The production server does not execute build or deployment logic. It only runs Docker containers pulled from the registry.

### Deployment Flow:

1. GHA builds the Docker image and pushes it to GitHub Container Registry (GHCR).
2. GHA connects to the server via SSH.
3. GHA pulls the latest Docker image from GHCR and restarts the container using Docker Compose.

## Server Setup

- Ubuntu Linux server
- Docker Engine
- Docker Compose plugin
- Nginx reverse proxy

## Example `.env`

    PORT=your-port
    DB_HOST=your-database-host
    DB_PORT=your-database-port
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=your-database-name
