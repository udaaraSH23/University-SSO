variable "location" {
  default = "eastasia"
}

variable "vm_size" {
  default = "Standard_D2as_v4" # cheap + enough for k3s
}

variable "admin_username" {
  default = "azureuser"
}

variable "ssh_public_key_path" {
  default = "~/.ssh/id_rsa.pub"
}
