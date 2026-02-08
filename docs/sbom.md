# SBOM (SPDX)

This repo publishes an SPDX SBOM at `sbom.spdx.json`.

## How it’s updated

Run SBOM genaration locally (see below) and commit the generated file to the repository. The SBOM is not automatically generated on CI or during deployment.

## Generate Locally

```bash
npm run sbom
```
