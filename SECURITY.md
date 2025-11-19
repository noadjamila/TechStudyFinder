# Security Guide

This document outlines the security best practices applied to the
TechStudyFinder CI/CD pipeline, server setup, and deployment process.

---

# 1. Webhook Security

## HMAC Signature Validation

All incoming GitHub webhook requests are validated using:

- SHA-256 HMAC
- A shared secret stored in `.env` (`GITHUB_WEBHOOK_SECRET`)
- Timing-safe comparison (`crypto.timingSafeEqual`)

The server rejects any request where:

- The signature is missing
- The signature does not match
- The raw body is modified
- The event is not a `push`

## Best Practices

- Never store webhook secrets in GitHub or commit them to the repo.
- Rotate secrets periodically.

---

# 2. Environment Variable Security

## Recommended Variables

    GITHUB_WEBHOOK_SECRET=<secret>
    DEPLOYMENT_SCRIPT_PATH=/absolute/path/to/deploy.sh
    NODE_ENV=production

## Guidelines

- Keep `.env` files out of version control.
- Store secrets only on the server and GitHub (as webhook secret).

---

# 3. Server Security

## User & Permissions

- Use a non-root user (`ubuntu`, `deploy`, etc.).
- Ensure scripts are executable but not world-writable.
- Avoid giving `sudo` access to the Node.js process.

---

# 4. PM2 Security

PM2 runs the application continuously. Secure it by:

- Never running PM2 as root
- Using absolute paths for scripts
- Logging minimal sensitive data
- Restarting automatically on failure

---

# 5. Deployment Script Security

`deploy.sh` performs system-level operations (`git pull`, `npm ci`,
etc.).\
Security measures:

- Must not be writable by the web server user.
- Must be executable.
- Must not contain secrets or credentials.

---

# 6. Network Security

- Use Nginx reverse proxy to hide internal ports.
- Ensure GitHub can reach public webhook endpoint.
- Block all unused ports.

---

# 7. GitHub Security

## Enable:

- Branch protection
- Required reviews before merging
- Required status checks (CI)
- Secret scanning
- Dependabot alerts

## Avoid:

- Committing `.env` files
- Exposing secrets in logs
- Pushing directly to `main`

---

# 8. Logging & Monitoring

Use PM2:

    pm2 logs TechStudyFinder

Monitor Nginx:

    sudo tail -f /var/log/nginx/access.log
    sudo tail -f /var/log/nginx/error.log

---

# 9. Summary of Best Practices

## ✅ Do

- Use HMAC signature verification
- Use absolute script paths
- Use a non-root server user
- Protect `.env` and deploy scripts
- Use branch protection + CI

## ❌ Do NOT

- Store secrets in GitHub
- Use relative script paths
- Give unnecessary sudo permissions
- Commit private keys or secrets
