# Ansible Playbooks

This directory contains Ansible playbooks and roles to install K3s, deploy ArgoCD, push application secrets, and install IAM/monitoring stacks onto the K3s cluster.

## Prerequisites

- Ansible 2.14+
- `kubectl` and `helm` on the machine running the playbooks
- Access to the target VMs (SSH)
- (Recommended) Ansible Vault for secrets

## Inventory

Create an inventory file (e.g., `inventory.ini`) with one `k3s_master` host and one or more `k3s_worker` hosts:

```ini
[k3s_master]
master ansible_host=<MASTER_PUBLIC_IP> ansible_user=azureuser private_ip=<MASTER_PRIVATE_IP>

[k3s_worker]
worker ansible_host=<WORKER_PUBLIC_IP> ansible_user=azureuser private_ip=<WORKER_PRIVATE_IP>
```

The `private_ip` host var is required by the K3s playbook to join workers and to populate the kubeconfig.

## Secrets

Some playbooks load `playbooks/secrets.yml`. It should include values like:

- `database_url`
- `nextauth_secret`
- `wso2_issuer`
- `wso2_well_known`
- `wso2_logout_url`
- `node_tls_reject_unauthorized`
- `student_url`, `library_url`, `admin_url`
- `student_wso2_client_id`, `student_wso2_client_secret`
- `library_wso2_client_id`, `library_wso2_client_secret`
- `admin_wso2_client_id`, `admin_wso2_client_secret`
- `grafana_admin_password`

> Tip: Store `secrets.yml` with Ansible Vault: `ansible-vault create playbooks/secrets.yml`.

## Playbooks

Run playbooks from `infrastructure/ansible`:

```bash
cd infrastructure/ansible
```

### 1) Install K3s

```bash
ansible-playbook playbooks/install-k3s.yml -i inventory.ini -e "public_ip=<MASTER_PUBLIC_IP>" -e "private_ip=<MASTER_PRIVATE_IP>"
```

This produces `kubeconfig_azure.yaml` in the current directory and stores the cluster token for worker joins.

### 2) Deploy ArgoCD

```bash
ansible-playbook playbooks/install-argocd.yml
```

### 3) Deploy Application Secrets

```bash
ansible-playbook playbooks/deploy-secrets.yml
```

### 4) Install IAM Stack (WSO2 + MySQL)

```bash
ansible-playbook playbooks/install-iam-stack.yml
```

### 5) Deploy Monitoring Stack (Prometheus + Grafana)

```bash
ansible-playbook playbooks/monitoring-stack.yaml
```

## Notes

- If you rotate or change secrets, rerun the `deploy-secrets.yml` playbook.
- All playbooks assume `kubeconfig_azure.yaml` exists in the working directory.
