# Server Setup (Production)

This guide documents the production server setup used by TechStudyFinder.
It assumes you are deploying via GHCR images and a systemd timer.

## Prerequisites

- Ubuntu Linux server
- Docker Engine and Docker Compose plugin
- Public domain name and TLS certificates
- SSH access for administration

## Required Files and Locations

- Deploy script: `/usr/local/bin/techstudyfinder-deploy.sh`
- systemd service: `/etc/systemd/system/techstudyfinder-deploy.service`
- systemd timer: `/etc/systemd/system/techstudyfinder-deploy.timer`
- Deploy environment: `/etc/techstudyfinder.env`
- Project directory: `/home/deployuser/projects/techstudyfinder`
- Compose file: `/home/deployuser/projects/techstudyfinder/docker-compose.yml`
- App environment: `/home/deployuser/projects/techstudyfinder/.env`

## Environment Variables

`/etc/techstudyfinder.env` (used by systemd/deploy script):

    GITHUB_REPO_OWNER=your-github-username
    GHCR_TOKEN=your-ghcr-read-token

`/home/deployuser/projects/techstudyfinder/.env` (loaded by the app container):

    NODE_ENV=production
    PORT=5001
    HOST=0.0.0.0

    GITHUB_WEBHOOK_SECRET=your-webhook-secret
    DEPLOYMENT_SCRIPT_PATH=/home/deployuser/projects/TechStudyFinder/scripts/deploy
    CWD_PATH=/home/deployuser/projects/TechStudyFinder
    SESSION_SECRET=your-session-secret
    GITHUB_REPO_OWNER=your-github-username

    DB_HOST=db
    DB_PORT=5432
    DB_USER=your-database-username
    DB_PASSWORD=your-database-password
    DB_NAME=techstudyfinderdb

    POSTGRES_DB=techstudyfinderdb
    POSTGRES_USER=your-database-username
    POSTGRES_PASSWORD=your-database-password

## systemd Setup

1. Place the unit files in `/etc/systemd/system/`.
2. Reload systemd and enable the timer:

```
sudo systemctl daemon-reload
sudo systemctl enable --now techstudyfinder-deploy.timer
```

Check status and logs:

```
systemctl status techstudyfinder-deploy.timer
journalctl -u techstudyfinder-deploy.service
```

## Reverse Proxy and TLS

Configure Nginx to forward traffic to `http://127.0.0.1:5001` and install TLS
certificates (e.g. via Certbot). Ensure ports 80 and 443 are open on the server.

### Nginx Sample Config

Save as `/etc/nginx/sites-available/techstudyfinder.conf` and symlink into
`/etc/nginx/sites-enabled/`.

```
server {
    listen 80;
    server_name example.com www.example.com;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

After enabling TLS, add a second `server` block for `listen 443 ssl;` and your
certificate paths (Certbot can create this for you).

## Secrets Generation

Generate secrets on the server and store them in the appropriate `.env` file.

```
# Session secret for app cookies
openssl rand -hex 32

# GitHub webhook secret (use the same value in your webhook settings)
openssl rand -hex 32
```

## Database Initialization

After the first deployment, initialize the database from the app repository:

```
cd server
npx ts-node db/scripts/init_data.ts
```

Ensure the container can reach the database using the values in `.env`.

## Validation

- `docker compose ps` shows `db` and `app` running.
- The public URL responds with the application.
- The timer runs every 5 minutes and updates the `app` container.
