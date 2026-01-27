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

Each portal also supports a local `.env.local` file for development/test configuration. Make sure to supply NextAuth and WSO2 Identity Server settings along with portal URLs. Example values:

```bash
# Next Auth Secret
# Generate one with: npx auth secret
# or: openssl rand -base64 32
AUTH_SECRET="RAbQZqiXUWp0qUxd6tNpaKrhu97CSMBxvEzaOiomrPc="

# WSO2 Identity Server Configuration
WSO2_CLIENT_ID=""
WSO2_CLIENT_SECRET=""
WSO2_ISSUER="https://wso2is.com/t/uniportal.com/oauth2/token"
WSO2_WELL_KNOWN="https://wso2is.com/t/uniportal.com/oauth2/token/.well-known/openid-configuration"

# If you still have certificate issues locally:
NODE_TLS_REJECT_UNAUTHORIZED="0"

NEXT_PUBLIC_STUDENT_URL="http://localhost:3000"
NEXT_PUBLIC_LIBRARY_URL="http://localhost:3001"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3002"
```

For Kubernetes deployments, the same values are usually provided via the secrets file consumed by Ansible (see `infrastructure/ansible/playbooks/secrets.yml` for the expected keys such as `nextauth_secret`, `wso2_issuer`, and portal URLs).

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
ansible-playbook playbooks/deploy-argocd-apps.yml
ansible-playbook playbooks/deploy-secrets.yml
ansible-playbook playbooks/install-iam-stack.yml
ansible-playbook playbooks/monitoring-stack.yaml
```

For prerequisites and playbook details, see `infrastructure/ansible/README.md`.

#### Secrets Configuration

Ansible playbooks expect a `infrastructure/ansible/playbooks/secrets.yml` file (often managed with Ansible Vault). It should include shared configuration (database URL, WSO2 endpoints, NextAuth secret, portal URLs) and per-portal client credentials. Example keys you may need to define:

- `database_url`
- `wso2_issuer`, `wso2_well_known`, `wso2_base_url`, `wso2_logout_url`
- `nextauth_secret`, `node_tls_reject_unauthorized`, `auth_trust_host`
- `student_url`, `library_url`, `admin_url`
- `student_wso2_client_id`, `student_wso2_client_secret`
- `library_wso2_client_id`, `library_wso2_client_secret`
- `admin_wso2_client_id`, `admin_wso2_client_secret`
- `grafana_admin_password`, `alertmanager_smtp_password`

#### ArgoCD Application Deployment

ArgoCD is used to deploy the portals and shared services. After ArgoCD is installed (see `infrastructure/ansible/playbooks/install-argocd.yml`), deploy the ArgoCD applications using `infrastructure/ansible/playbooks/deploy-argocd-apps.yml`. You can also apply the ArgoCD Application manifests stored in `infrastructure/k8s/argocd` to sync the apps into your cluster.

Typical flow:

1. Update image tags, namespaces, and secrets in the ArgoCD app manifests as needed.
2. Apply the manifests:

```bash
kubectl apply -f infrastructure/k8s/argocd
```

3. Use the ArgoCD UI or CLI to monitor sync status and health.

#### Monitoring Stack

The monitoring stack is deployed by `infrastructure/ansible/playbooks/monitoring-stack.yaml`. It installs Prometheus/Alertmanager/Grafana for cluster observability. Update alerting credentials and Grafana admin password in your secrets file (for example, `grafana_admin_password` and `alertmanager_smtp_password`) before running the playbook.

Grafana dashboards are versioned in this repo (for example, `infrastructure/ansible/playbooks/grafana-dashboard.json`). Import or provision that dashboard after Grafana is online.

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

## SonarQube

Static analysis is configured via `sonar-project.properties` at the repo root. It defines:

- The project key/name/version and SonarQube server URL.
- Module definitions for each portal and shared package.
- Source/test paths, test inclusions, and global exclusions.
- LCOV coverage paths for JavaScript/TypeScript where applicable.

Run a local scan after starting SonarQube (default `http://localhost:9000`):

```bash
sonar-scanner
```

Review and adjust the values in `sonar-project.properties` for your environment (for example, `sonar.host.url`, module base directories, and exclusion patterns).

## Notes

- Shared services and UI components live in `packages/` and are consumed by the portals.
- Prisma schema and database tooling live in `packages/database`.
