# Terraform (Azure) - K3s VM Provisioning

This Terraform stack creates the base Azure infrastructure used to run the University-SSO platform on a lightweight **K3s cluster**. It is intentionally minimal: a small cluster, core networking, and public IPs so Ansible can bootstrap the nodes and deploy workloads (WSO2 IS, portals, and supporting services).

## Why We Provision This

The infrastructure is designed to support:

- A **control-plane VM** for K3s and cluster orchestration.
- A **worker VM** for running application workloads.
- A dedicated base network and security rules that allow SSH, K3s node communication, and ingress traffic.

This gives us a stable, repeatable foundation for the IAM stack and portals, while keeping the cluster simple to manage.

## Cloud Structure (High Level)

The Terraform configuration provisions the following Azure resources:

- **Resource Group**: logical container for all resources.
- **Virtual Network (VNet)** + **Subnet**: private networking for the cluster nodes.
- **Network Security Group (NSG)** + rules: allows SSH and required K3s/ingress traffic.
- **Two Linux VMs**:
  - **Control-plane VM** (K3s server node)
  - **Worker VM** (K3s agent node)
- **Public IPs** for both VMs (used to connect and for Ansible inventory).

### Example Topology Diagram

```
Azure Resource Group
└─ Virtual Network (VNet)
   └─ Subnet
      ├─ NSG (SSH + K3s + ingress rules)
      ├─ VM: k3s-control-plane
      │   └─ Public IP (master)
      └─ VM: k3s-worker
          └─ Public IP (worker)
```

## What It Creates

- Resource group, VNet, subnet, NSG, and NSG rules.
- Two Linux VMs with public IPs (control-plane + worker).
- Outputs for both public IP addresses.

## Prerequisites

- Terraform 1.x
- Azure CLI authenticated (`az login`)
- A valid SSH public key (defaults to `~/.ssh/id_rsa.pub`)

## Configure Variables

Defaults are defined in `variables.tf`. Override them via a `terraform.tfvars` file or CLI flags.

Example `terraform.tfvars`:

```hcl
location         = "eastasia"
vm_size          = "Standard_D2as_v4"
vm_size_node2    = "Standard_B4als_v2"
admin_username   = "azureuser"
ssh_public_key_path = "~/.ssh/id_rsa.pub"
```

## Usage

```bash
cd infrastructure/terraform
terraform init
terraform plan
terraform apply
```

After apply completes, record the IPs:

```bash
terraform output public_ip
terraform output public_ip_node2
```

Use these values in your Ansible inventory and playbook variables.

## Destroy

```bash
terraform destroy
```
