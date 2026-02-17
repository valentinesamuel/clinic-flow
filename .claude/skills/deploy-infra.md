---
name: deploy-infra
description: Use for Terraform, Docker, and AWS operations.
disable-model-invocation: true  # Prevents Claude from reading this until you type /deploy-infra
---
# Infrastructure Instructions
- Always run `terraform plan` before `apply`.
- Ensure healthcare data volumes are encrypted at rest.