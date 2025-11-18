## Continuous Deployment (CD)

CD is triggered through a GitHub webhook when a push occurs on the
`main` branch.

### Deployment Flow:

1.  GitHub sends a `push` event to `/deploy/webhook`.
2.  The server validates:
    - HMAC SHA-256 signature
    - Event type (must be `push`)
    - Branch reference (`refs/heads/main`)
3.  If valid, the server runs `deploy.sh`, which performs:
    - `git pull origin main`
    - `npm ci`
    - `npm run build`
    - `pm2 restart TechStudyFinder`

## Server Setup

- Ubuntu Linux server
- Node.js LTS
- pm2 as process manager
- Nginx reverse proxy
- Deployment script referenced via absolute path

## Example `.env`

    NODE_ENV=production
    PORT=your-port
    GITHUB_WEBHOOK_SECRET=your-secret
    DEPLOYMENT_SCRIPT_PATH=/home/ubuntu/TechStudyFinder/server/scripts/deploy.sh

## Deployment Script

Path:

    /home/ubuntu/TechStudyFinder/server/scripts/deploy.sh

Make executable:

    chmod +x deploy.sh

## Webhook Setup

GitHub → Repository → Settings → Webhooks → Add Webhook

- Payload URL: `https://<domain>/deploy/webhook`
- Content-Type: `application/json`
- Secret: matches the `.env` value
- Event: only `push`
