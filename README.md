# University-SSO (University Portal)

A monorepo for a multi-portal university system built with Next.js and shared packages. It includes separate student, library, and admin portals, plus shared backend, auth, UI, and database packages.

## Features

- **Student Portal**: Dashboard experience for students, including academic and library activity snapshots.
- **Library Portal**: Library management dashboard with stats, overdue alerts, and loan/return workflows.
- **Admin Portal**: Administrative overview with key university stats and quick access actions.
- **Shared Packages**: Auth, API client, backend services, database (Prisma), UI, and logging.

## Tech Stack

- **Frontend**: Next.js + React
- **Backend Services**: Shared service layer in `packages/backend`
- **Database**: PostgreSQL (Prisma)
- **Monorepo**: npm workspaces + Turborepo

## Repository Layout

- `apps/`
  - `student-portal/`
  - `library-portal/`
  - `admin-portal/`
- `packages/`
  - `auth/`, `api-client/`, `backend/`, `database/`, `logger/`, `tailwind-config/`, `ui/`
- `infrastructure/` (deployment and ops assets)

## Setup

### Prerequisites

- **Node.js** (use the version compatible with npm `10.9.4`)
- **npm** (workspace-aware)
- **Docker** (optional, for running Postgres and production-like containers)

### Install Dependencies

```bash
npm install
```

### Environment Variables

The database layer reads `DATABASE_URL` (Prisma). Set it for local development, for example:

```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/university_portal?schema=public"
```

### Run in Development

Run each portal independently from the repo root:

```bash
npm run dev --workspace=student-portal
npm run dev --workspace=library-portal
npm run dev --workspace=admin-portal
```

Default ports:

- Student Portal: `http://localhost:3000`
- Library Portal: `http://localhost:3001`
- Admin Portal: `http://localhost:3002`

> Each app can define its own `dev` script; check the app-level `package.json` for port overrides.

### Run with Docker (local services)

To spin up Postgres and the student portal with Docker:

```bash
docker compose up --build
```

For production-like multi-service containers (all portals + Postgres):

```bash
docker compose -f docker-compose.prod.yml up
```

### Infrastructure Setup

Infrastructure and deployment assets live under `infrastructure/`, including Kubernetes manifests and Ansible playbooks. Use these as a starting point for cluster or VM-based deployments.

Common entry points:

- `infrastructure/k8s/` for Kubernetes manifests (apps, database, secrets, and related resources).
- `infrastructure/ansible/` for Ansible playbooks that apply deployment configuration and secrets.
- `infrastructure/terraform/` for Azure infrastructure provisioning (K3s VM + networking).

> Review and update environment-specific values (namespace, image tags, and secrets) before applying to your environment.

#### Provisioning with Terraform (Azure)

Use Terraform to provision the Azure VMs, networking, and public IPs for a small K3s cluster.

1. Review or override defaults in `infrastructure/terraform/variables.tf`.
2. Authenticate to Azure (e.g., `az login`) and run:

```bash
cd infrastructure/terraform
terraform init
terraform apply
```

Terraform outputs the public IPs you’ll use for Ansible inventory or SSH. For more details, see `infrastructure/terraform/README.md`.

#### Deploying with Ansible

Ansible playbooks install K3s, deploy ArgoCD, seed secrets, and install IAM/monitoring stacks.

1. Create an inventory with `k3s_master` and `k3s_worker` hosts.
2. Create `infrastructure/ansible/playbooks/secrets.yml` (recommended via Ansible Vault) with the variables referenced by the playbooks.
3. Run the playbooks from the `infrastructure/ansible` directory:

```bash
ansible-playbook playbooks/install-k3s.yml -i inventory.ini -e "public_ip=<MASTER_PUBLIC_IP>" -e "private_ip=<MASTER_PRIVATE_IP>"
ansible-playbook playbooks/install-argocd.yml
ansible-playbook playbooks/deploy-secrets.yml
ansible-playbook playbooks/install-iam-stack.yml
ansible-playbook playbooks/monitoring-stack.yaml
```

For prerequisites and playbook details, see `infrastructure/ansible/README.md`.

## Functionality Overview

### Student Portal

- Student dashboard with academic stats, current courses, and recent library activity.
- Integrates shared auth and backend services for data aggregation.

### Library Portal

- Library dashboard with available/borrowed book stats.
- Overdue tracking and loan/return workflows.

### Admin Portal

- Admin dashboard with high-level institutional statistics.
- Quick access to common administration areas.

### WSO2 Identity Server

The system is designed to integrate with **WSO2 Identity Server** for centralized authentication and SSO. Configure your WSO2 IS tenant, create the required OAuth/OpenID Connect applications for each portal, and wire the client credentials into the auth package or portal environment variables as needed.

At a high level:

- Create separate applications for student/library/admin portals.
- Configure redirect URLs to each portal’s login callback.
- Provide client ID/secret and issuer/authorization URLs to the auth configuration.

## Testing

```bash
npm test
```

## Notes

- Shared services and UI components live in `packages/` and are consumed by the portals.
- Prisma schema and database tooling live in `packages/database`.
