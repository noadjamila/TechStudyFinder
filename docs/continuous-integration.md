# Continuous Integration & Continuous Deployment (CI/CD)

## Overview

This document describes the complete CI/CD pipeline for the
*TechStudyFinder* project – including automated testing (CI) and
automatic deployment (CD) onto the production server.

## Continuous Integration (CI)

CI uses GitHub Actions and is configured under
`.github/workflows/ci-tests.yml`.

### Pipeline Steps:

1.  Install dependencies
2.  Run linting
3.  Execute unit tests for client and server
4.  Run integration tests for server
5.  Build frontend and backend

Pull Requests can only be merged if all CI steps succeed.

