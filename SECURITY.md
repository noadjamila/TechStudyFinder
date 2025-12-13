# Security Guide

This document outlines the security best practices applied to the
TechStudyFinder CI/CD pipeline, server setup, and deployment process.

The system uses a **Docker-based Continuous Deployment model**.
The production server acts as a **runtime-only environment** and does not
perform builds or execute deployment logic.

---

# 1. Continuous Deployment Security

## Deployment Model

- Deployments are triggered exclusively by **GitHub Actions**.
- No GitHub webhooks are configured on the production server.
- The server does not accept inbound deployment requests.
- The server pulls pre-built Docker images from GitHub Container Registry (GHCR).

This eliminates the need for:

- Webhook endpoints
- HMAC signature validation
- Server-side deployment scripts
- Branch validation on the server

---

# 2. Authentication & Authorization

## GitHub Actions

- GitHub Actions uses the built-in `GITHUB_TOKEN` to authenticate against GHCR.
- No long-lived Docker credentials are stored.
- Deployment access is restricted to the repository CI pipeline.

## Server Access

- The production server is accessed via SSH using key-based authentication.
- Password-based SSH authentication is disabled.
- Root login via SSH is disabled.

---

# 3. Environment Variable Security

## Runtime Configuration

Environment variables are provided via a `.env` file on the server and
loaded by Docker Compose at runtime.

## Guidelines

- `.env` files are never committed to version control.
- Secrets are stored only on the production server.
- No secrets are embedded in Docker images.

---

# 4. Server Security

## User & Permissions

- A dedicated non-root user (`deployuser`) is used for operations.
- The application does not run directly on the host.
- The Docker container runs with restricted privileges.
- The server does not contain application source code.

## Hardening Measures

- Only required ports are exposed (HTTP/HTTPS).
- Internal application ports are not publicly accessible.
- Unused services and packages are removed from the server.

---

# 5. Container Security

- Multi-stage Docker builds are used to separate build and runtime environments.
- The runtime image contains only production dependencies.
- Development tools (npm, TypeScript, Vite, PM2) are not present at runtime.
- Containers are restarted automatically by Docker on failure.

---

# 6. Network Security

- Nginx is used as a reverse proxy.
- Internal application ports are hidden from the public network.
- HTTPS is enforced using TLS certificates.
- Only Docker and Nginx expose network services.

---

# 7. GitHub Security

## Enabled Controls

- Branch protection on `main`
- Required pull request reviews
- Required status checks (CI)
- Secret scanning
- Dependabot alerts

## Prohibited Actions

- Direct pushes to `main`
- Committing `.env` files
- Committing secrets or credentials
- Bypassing CI checks

---

# 8. Logging & Monitoring

## Container Logs

```
docker logs studyfinder
```

## Nginx Logs

No application-level logs are written to the host filesystem outside Docker.

---

# 9. Summary of Best Practices

## ✅ Do

- Use GitHub Actions for deployments
- Use Docker images as immutable artifacts
- Restrict server responsibilities to runtime only
- Use SSH key-based authentication
- Keep secrets out of the repository

## ❌ Do NOT

- Expose deployment endpoints on the server
- Use webhooks for production deployments
- Run application processes directly on the host
- Store secrets in Docker images or source code
- Allow builds on the production server
