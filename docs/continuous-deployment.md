## Continuous Deployment (CD)

CD is triggered by GitHub Actions (GHA) when a push occurs on the `main` branch.
The production server does not execute build logic or application-level
deployment scripts. It only manages Docker containers by pulling images from
the registry and restarting them as needed.

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
    GITHUB_REPO_OWNER=your-github-username
    DB_HOST=your-database-host
    DB_PORT=your-database-port
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=your-database-name

## Required GitHub Secrets for Deployment

The following GitHub secrets must be configured in your repository for the deployment workflow to function:

- **GITHUB_REPO_OWNER**: The GitHub username or organization that owns the repository.
- **SERVER_HOST**: The hostname or IP address of your production server.
- **SERVER_USER**: The SSH username used to connect to the server.
- **SERVER_SSH_KEY**: The private SSH key (in PEM format) used for authentication to the server.
- **SERVER_DEPLOY_PATH**: The absolute path on the server where the application should be deployed.
  Make sure to add these secrets in your repository's **Settings > Secrets and variables > Actions** section.
