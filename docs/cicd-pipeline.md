# CI/CD Pipeline

This document describes the GitHub Actions workflows in `.github/workflows` that build, test, and publish the University-SSO portals.

## Overview

The repository has two workflows:

- **CI**: Lint + build on pushes to `main` and pull requests.
- **CD**: Build and push Docker images, then update Kubernetes manifests on pushes to `main` (or manual dispatch).

## CI Workflow (`.github/workflows/ci.yml`)

**Triggers**

- `push` to `main`
- `pull_request` events: `opened`, `synchronize`

**Job: Build & Test**

Runs on `ubuntu-latest` and performs:

1. **Checkout** the repo.
2. **Setup Node.js 20** (with npm cache).
3. **Install dependencies** using `npm ci`.
4. **Lint** all workspaces with `npm run lint --workspaces --if-present`.
5. **Build** all workspaces with `npm run build --workspaces --if-present`.

> Note: Test execution is currently commented out in the workflow. If you want tests in CI, uncomment the `Test` step in `ci.yml`.

## CD Workflow (`.github/workflows/cd.yml`)

**Triggers**

- `push` to `main`
- `workflow_dispatch` (manual run)

### Job 1: Build and Push Images

Builds and pushes Docker images for the three portals using a matrix:

- `apps/student-portal/Dockerfile` → `ghcr.io/<owner>/university-portal-student`
- `apps/library-portal/Dockerfile` → `ghcr.io/<owner>/university-portal-library`
- `apps/admin-portal/Dockerfile` → `ghcr.io/<owner>/university-portal-admin`

Key steps:

1. **Checkout** the repo.
2. **Login** to GitHub Container Registry (GHCR) using `GITHUB_TOKEN`.
3. **Generate image metadata** with `docker/metadata-action`:
   - `latest` tag on default branch
   - `sha` tag (long format)
4. **Build and push** images with `docker/build-push-action`.

The job outputs the version (tag) used for downstream steps.

### Job 2: Update Kubernetes Manifests

Updates Kubernetes deployment manifests under `infrastructure/k8s/apps/` to reference the new image tags:

- `infrastructure/k8s/apps/student-portal/deployment.yaml`
- `infrastructure/k8s/apps/library-portal/deployment.yaml`
- `infrastructure/k8s/apps/admin-portal/deployment.yaml`

Key steps:

1. **Checkout** the repo with write access.
2. **Install `yq`**.
3. **Set git user** for the automation commit.
4. **Update image tags** using `yq` and the version from the build job.
5. **Commit and push** changes if any manifests were updated.

## Operational Notes

- The CD workflow uses `ghcr.io` and the repository owner to form image paths.
- If manifests do not change (same tag), the update step exits without committing.
- Ensure `GITHUB_TOKEN` has appropriate permissions for package publish and content writes (already set in the workflow).

## References

- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
