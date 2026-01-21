output "public_ip" {
  value = azurerm_public_ip.pip.ip_address
}

output "public_ip_node2" {
  value = azurerm_public_ip.pip2.ip_address
}
