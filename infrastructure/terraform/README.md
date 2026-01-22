# Terraform (Azure) - K3s VM Provisioning

This directory provisions Azure infrastructure for a small K3s cluster (one control-plane VM and one worker VM), plus networking and security group rules.

## What It Creates

- Resource group, VNet, subnet, NSG, and NSG rules.
- Two Linux VMs with public IPs.
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
