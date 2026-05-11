terraform {
  required_providers {
    local = {
      source = "hashicorp/local"
      version = "~> 2.4"
    }
  }
}

provider "local" {}

# Simulate infrastructure setup
resource "local_file" "infrastructure_info" {
  filename = "infrastructure.txt"

  content = <<EOT
Book Library Infrastructure Setup

Application: Flask Book Library
Containerization: Docker
CI/CD: GitHub Actions
Database: SQLite

Infrastructure successfully provisioned using Terraform.
EOT
}
