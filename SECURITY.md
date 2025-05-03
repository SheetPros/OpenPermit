# OpenPermit Security

## Security Policy

This document outlines the security considerations and implementation guidelines for the OpenPermit project, with specific focus on compliance with NIST 800-53 and FISMA requirements.

## Reporting a Vulnerability

If you discover a security vulnerability within OpenPermit, please send an email to security@openpermit.org. All security vulnerabilities will be promptly addressed.

## NIST 800-53 Controls Implementation

OpenPermit implements the following NIST 800-53 controls to meet federal security requirements:

### Access Control (AC)

- **AC-2: Account Management**
  - Implementation: Role-based access control (RBAC) for all permit management functions
  - Automated account provisioning/deprovisioning integrated with municipal identity systems

- **AC-3: Access Enforcement**
  - Implementation: Attribute-based access control for fine-grained permissions on permit data
  - Policy enforcement points at API and data access layers

- **AC-17: Remote Access**
  - Implementation: TLS 1.3 for all remote connections
  - Multi-factor authentication required for administrative access

### Audit and Accountability (AU)

- **AU-2: Audit Events**
  - Implementation: Comprehensive logging of all permit status changes
  - Tamper-evident audit trails for document submissions and approvals

- **AU-6: Audit Review, Analysis, and Reporting**
  - Implementation: Automated alerting for suspicious access patterns
  - Compliance reporting dashboards for oversight requirements

### System and Communications Protection (SC)

- **SC-8: Transmission Confidentiality and Integrity**
  - Implementation: TLS 1.3 for all data in transit
  - Digital signatures for document integrity verification

- **SC-13: Cryptographic Protection**
  - Implementation: FIPS 140-2/3 validated cryptographic modules
  - AES-256 for all sensitive data at rest

- **SC-28: Protection of Information at Rest**
  - Implementation: Transparent database encryption
  - Document store encryption with separate key management

### System and Information Integrity (SI)

- **SI-7: Software, Firmware, and Information Integrity**
  - Implementation: Code signing for all application deployments
  - Integrity verification of configuration files and document templates

- **SI-10: Information Input Validation**
  - Implementation: Schema validation for all API inputs
  - XML/JSON payload validation against published schemas

### Identification and Authentication (IA)

- **IA-2: Identification and Authentication (Organizational Users)**
  - Implementation: Integration with municipal identity providers
  - Support for PIV/CAC for federal integration

- **IA-8: Identification and Authentication (Non-Organizational Users)**
  - Implementation: Self-service identity verification for public users
  - OAuth 2.0/OpenID Connect support for federated authentication

### Risk Assessment (RA)

- **RA-5: Vulnerability Scanning**
  - Implementation: Automated dependency scanning in CI/CD pipeline
  - Scheduled application security scanning

## FISMA Compliance

The OpenPermit project is designed to help municipal entities achieve FISMA compliance by implementing the appropriate controls based on the data sensitivity level:

- **Low Impact**: Basic controls for public-facing permit information
- **Moderate Impact**: Enhanced controls for business tax records and financial transactions
- **High Impact**: Strict controls for critical infrastructure permitting

## Implementation Guidance

When implementing OpenPermit in a federal or state context, deploy with the following considerations:

1. Use FIPS-compliant cryptographic modules
2. Integrate with existing PIV/CAC infrastructure
3. Deploy within FedRAMP authorized cloud environments when possible
4. Implement continuous monitoring aligned with CDM requirements

## Security Testing

All OpenPermit components undergo:

1. Static Application Security Testing (SAST)
2. Dynamic Application Security Testing (DAST)
3. Software Composition Analysis (SCA)
4. Regular penetration testing

## References

- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)
- [FISMA Implementation Project](https://csrc.nist.gov/projects/risk-management/fisma-background)
- [FedRAMP Security Controls](https://www.fedramp.gov/)
