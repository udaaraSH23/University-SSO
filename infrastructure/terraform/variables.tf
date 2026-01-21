variable "location" {
  default = "eastasia"
}

variable "vm_size" {
  default = "Standard_D2as_v4" # cheap + enough for k3s
}

variable "vm_size_node2" {
  default = "Standard_B4als_v2" # Larger size for WSO2 node
}

variable "admin_username" {
  default = "azureuser"
}

variable "ssh_public_key_path" {
  default = "~/.ssh/id_rsa.pub"
}
