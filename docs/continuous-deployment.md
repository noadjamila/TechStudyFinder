## Continuous Deployment (CD)

CD is split into two phases: image build/push in GitHub Actions (GHA) and
container refresh on the server. The server does not build images; it only
pulls from GHCR and restarts the container via Docker Compose.

### Deployment Flow

1. GHA builds the Docker image and pushes it to GitHub Container Registry (GHCR).
2. A server-side systemd timer (or equivalent scheduler) runs a deploy script.
3. The deploy script logs into GHCR (if a token is provided), pulls the latest
   image, and recreates the `app` container via Docker Compose.

## Server Setup

- Ubuntu Linux server
- Docker Engine
- Docker Compose plugin
- Nginx reverse proxy
- Deploy script at `/usr/local/bin/techstudyfinder-deploy.sh`

### Deploy Script

The root-owned deploy script is executed by a scheduler (e.g. systemd timer).
It expects a `GITHUB_REPO_OWNER` and optional `GHCR_TOKEN` in the environment.

```
/usr/local/bin/techstudyfinder-deploy.sh
```

Key actions:

- `docker login ghcr.io` (only if `GHCR_TOKEN` is present)
- `docker compose -f /home/deployuser/projects/techstudyfinder/docker-compose.yml pull app`
- `docker compose -f /home/deployuser/projects/techstudyfinder/docker-compose.yml up -d app`

### systemd Timer + Service

The server runs a systemd timer that triggers the deploy script every 5 minutes.
Both units live in `/etc/systemd/system/` and load environment variables from
`/etc/techstudyfinder.env`.

```
/etc/systemd/system/techstudyfinder-deploy.timer
[Unit]
Description=Run TechStudyFinder deploy every 5 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=5min

[Install]
WantedBy=timers.target
```

```
/etc/systemd/system/techstudyfinder-deploy.service
[Unit]
Description=Deploy TechStudyFinder

[Service]
Type=oneshot
EnvironmentFile=/etc/techstudyfinder.env
ExecStart=/usr/local/bin/techstudyfinder-deploy.sh
```

### Docker Compose (server)

`/home/deployuser/projects/techstudyfinder/docker-compose.yml`

- `db` uses `postgres:16` and persists data in the `pgdata` volume.
- `app` pulls `ghcr.io/noadjamila/techstudyfinder:latest` and exposes port `5001`.

## Example `.env` (server)

The `app` service loads `/home/deployuser/projects/techstudyfinder/.env`.

    NODE_ENV=production
    PORT=5001
    HOST=0.0.0.0

    GITHUB_WEBHOOK_SECRET=your-webhook-secret
    DEPLOYMENT_SCRIPT_PATH=/home/deployuser/projects/TechStudyFinder/scripts/deploy
    CWD_PATH=/home/deployuser/projects/TechStudyFinder
    SESSION_SECRET=your-session-secret
    GITHUB_REPO_OWNER=noadjamila

    DB_HOST=db
    DB_PORT=5432
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=techstudyfinderdb

    POSTGRES_DB=techstudyfinderdb
    POSTGRES_USER=your-database-username
    POSTGRES_PASSWORD=your-database-password

## Required GitHub Secrets for Deployment

The following GitHub secrets must be configured in your repository for the deployment workflow to function:

- **GITHUB_REPO_OWNER**: The GitHub username or organization that owns the repository.
- **GHCR_TOKEN**: A token with `read:packages` for pulling images on the server (used by the deploy script).

Make sure to add these secrets in your repository's **Settings > Secrets and variables > Actions** section.

## Production Setup Checklist

Use this list when handing over the project to a new server owner.

1. Provision an Ubuntu server, open the required ports (80/443 and 5001 if not behind a proxy).
2. Install Docker Engine and the Docker Compose plugin.
3. Create the deploy user and project directory at `/home/deployuser/projects/techstudyfinder`.
4. Add `/home/deployuser/projects/techstudyfinder/docker-compose.yml` and `.env`.
5. Add `/usr/local/bin/techstudyfinder-deploy.sh` and make it executable.
6. Add `/etc/techstudyfinder.env` with `GITHUB_REPO_OWNER` and `GHCR_TOKEN`.
7. Install the systemd unit and timer files in `/etc/systemd/system/` and enable the timer.
8. Configure Nginx reverse proxy and TLS certificates for your domain.
9. Initialize the database and verify the app responds on the public URL.

For a full walkthrough, see `docs/server-setup.md`.
