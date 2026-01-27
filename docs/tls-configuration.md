# TLS Configuration (Self-Signed Certificates)

This document explains how TLS certificates are generated and applied for the University-SSO stack using the Ansible playbook and the certificate generation script.

## Overview

The TLS workflow uses:

- `infrastructure/ansible/playbooks/configure-tls.yml` to generate certificates (if needed) and create Kubernetes secrets.
- `infrastructure/scripts/generate-certs.sh` to create a local Root CA and a server certificate with SANs for the portal domains.

The certificates are **self-signed** and intended for internal/development usage unless replaced with CA-issued certificates.

## What the Script Generates

`infrastructure/scripts/generate-certs.sh` creates the following files under `infrastructure/scripts/pki/`:

- `rootCA.key` and `rootCA.crt` (self-signed Root CA)
- `server.key` and `server.crt` (server TLS key/cert)
- `server.csr` and config files used during generation

The server certificate includes SAN entries for:

- `admin.local`
- `student.local`
- `library.local`
- `wso2is.com`
- `localhost` / `127.0.0.1`

If you need additional domains, edit `infrastructure/scripts/generate-certs.sh` and add them under the `alt_names` section before regenerating the certs.

## Kubernetes Secrets Created

The playbook creates or updates these secrets using the generated certificate files:

- `portal-tls-cert` in the `default` namespace (uses `server.crt`/`server.key`)
- `wso2is-tls-cert` in the `wso2is` namespace (uses `server.crt`/`server.key`)
- `internal-ca-cert` in the `default` namespace (stores `rootCA.crt`)

These secrets are applied with `kubectl` and should match the ingress or service configuration used by the portals and WSO2 IS.

## Run the TLS Playbook

From `infrastructure/ansible`, run:

```bash
ansible-playbook playbooks/configure-tls.yml
```

The playbook will:

1. Ensure `generate-certs.sh` is executable.
2. Generate certificates if `infrastructure/scripts/pki/server.crt` does not exist.
3. Create/update Kubernetes TLS secrets in the `default` and `wso2is` namespaces.

## Replacing with Real Certificates

For production or public environments, replace the self-signed files under `infrastructure/scripts/pki/` with CA-issued certificates and keys (keeping the same filenames), then rerun:

```bash
ansible-playbook playbooks/configure-tls.yml
```

## References

- `infrastructure/ansible/playbooks/configure-tls.yml`
- `infrastructure/scripts/generate-certs.sh`
