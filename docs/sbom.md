# SBOM (SPDX)

This repo publishes an SPDX SBOM at `sbom.spdx.json`.

## How it’s updated

- GitHub Actions workflow `.github/workflows/sbom.yml` runs on pull requests when they are opened, synchronized, reopened, or marked “Ready for review”.
- Draft pull requests are skipped.
- The workflow runs `npm run sbom` and commits the updated `sbom.spdx.json` back to the PR branch if it changes.

## Generate Locally

```bash
npm run sbom
```
