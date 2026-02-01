# BioVault Technical Architecture

**Protocol Architecture and Design Principles**

Version 0.1.3 — Public Release | October 25, 2025

**Audience**: Healthcare institutions, research partners, technology integrators, regulatory bodies, and technical stakeholders

**License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

**Copyright**: © 2025 BioVault Foundation – All rights reserved under CC BY-SA 4.0

---

## Legal Disclaimer

**IMPORTANT NOTICE**: This document describes a technical architecture for research and development purposes. It is **not a regulatory artifact**, clinical guideline, or approved medical device specification.

**Before Implementation**: Deployment of this system requires:

- Compliance with applicable healthcare regulations (HIPAA, GDPR, local data protection laws)
- Clinical validation and appropriate safety testing
- Regulatory approvals before deployment in production healthcare settings
- Third-party security audits and penetration testing
- Legal review by qualified healthcare compliance counsel

No warranties are made regarding fitness for any particular purpose. Users and implementers assume all responsibility and risk.

**For Citation**: BioVault Initiative. (2025). BioVault: Technical Architecture. Retrieved from https://biovault.health/technical-architecture

---

## Document Classification

**PUBLIC TECHNICAL ARCHITECTURE PAPER**

This document presents BioVault's architectural design, interoperability framework, and technical principles for external audiences. For full cryptographic implementation details, operational procedures, and security configurations, see the **BioVault Internal Security & Infrastructure Reference** (restricted access).

---

## Current Implementation Status

**This document describes the complete BioVault architecture. The current repository implements Phase 1 (MVP) on Solana Devnet.**

### Live Deployment

| Property       | Value                                    |
| -------------- | ---------------------------------------- |
| **Network**    | Solana Devnet                            |
| **Framework**  | Anchor 0.32.1                            |
| **Repository** | https://github.com/biovault-org/biovault |

### Implemented Components

**Blockchain Layer** (Solana/Anchor):

- [OK] Vault initialization and lifecycle management
- [OK] File metadata storage with content-addressed references
- [OK] Time-limited delegation framework
- [OK] Emergency access protocols
- [OK] Immutable audit logging
- [OK] Access control management

**API Layer** (Node.js/TypeScript):

- [OK] Client-side encryption coordination
- [OK] Decentralized storage integration
- [OK] Database management
- [OK] Authentication services
- [OK] Transaction orchestration

**Client Layer** (React/TypeScript):

- [OK] Wallet integration
- [OK] User interface for data management
- [OK] Access delegation controls
- [OK] Audit log visualization

### Roadmap Phases

This document covers the complete architecture including features planned for Phase 2+ (see Future Roadmap). Current implementation focuses on core functionality (Phase 1).

**Terminology Note**: This document uses "programs" instead of "smart contracts" throughout, following Solana conventions.

---

## Table of Contents

1. [Executive Summary & Design Philosophy](#1-executive-summary--design-philosophy)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Core Components](#3-core-components)
4. [Identity and Access Control Principles](#4-identity-and-access-control-principles)
5. [Data Storage Architecture](#5-data-storage-architecture)
6. [Consent Management Framework](#6-consent-management-framework)
7. [Interoperability Layer](#7-interoperability-layer)
8. [Auditability and Transparency](#8-auditability-and-transparency)
9. [Governance Model](#9-governance-model)
10. [Technical Glossary](#10-technical-glossary)
11. [References](#11-references)

---

## 1) Executive Summary & Design Philosophy

### Executive Overview

BioVault is a permissioned, federated health data protocol designed to operationalize patient sovereignty through architectural enforcement rather than policy promises. The system separates concerns between on-chain state management (consent, delegation, audit receipts) and off-chain encrypted storage (decentralized file systems) to ensure compliance with data minimization principles while providing immutable auditability and patient-controlled access.

The architecture addresses healthcare's unique constraints: life-critical emergency access, cross-jurisdictional interoperability, regulatory heterogeneity, and zero-tolerance for data breaches. The permissioned validator network—composed of health authorities, accredited institutions, governmental entities, and independent auditors—enables compliance-by-construction while maintaining Byzantine fault tolerance.

This document specifies the technical architecture and design patterns for healthcare organizations, research institutions, technology partners, and regulatory bodies evaluating BioVault integration.

---

### 1.1 Design Philosophy and Core Principles

BioVault's architecture is governed by five foundational principles:

#### Principle 1: Data Minimization On-Chain

The distributed ledger records only metadata, consent states, delegation relationships, and audit receipts. Medical records reside off-chain in encrypted form within decentralized storage systems, addressable via content identifiers (CIDs). This separation ensures:

- **Regulatory compliance**: Satisfies data minimization requirements (GDPR Article 5(1)(c), HIPAA Minimum Necessary Standard 45 CFR §164.502(b))
- **Scalability**: Ledger size grows logarithmically with consent operations, not linearly with medical data volume
- **Privacy resilience**: Ledger compromise exposes only encrypted references and access patterns, not medical information

The on-chain representation of a medical record consists of:

- Content identifier (CID) pointing to encrypted storage location
- Cryptographic hash of metadata
- Consent policy references (who, what, why, when, duration)
- Audit trail of access events

#### Principle 2: Client-Side Encryption with Patient-Controlled Keys

All medical content is encrypted on the patient's device before transmission to storage. The system implements a hybrid encryption model:

- **Per-file symmetric encryption**: Each medical record encrypted with unique keys
- **Key wrapping**: Symmetric keys protected using modern cryptographic standards
- **Distributed key recovery**: Patient master keys protected through threshold cryptography, requiring patient participation plus additional authorized parties for recovery

(For full cryptographic implementation details, see the **BioVault Internal Security & Infrastructure Reference** - restricted access.)

This model balances usability (device loss recovery) with uncompromising patient sovereignty (no single entity can unilaterally access data).

#### Principle 3: Consent-as-Code

Traditional health systems treat consent as static legal documents. BioVault implements consent as executable logic: programs on the blockchain encode granular, time-bounded, purpose-specific access rules enforced cryptographically.

Consent grants specify:

- **Subject**: Patient identity (verifiable credential)
- **Object**: Data scope (resource types, date ranges, sensitivity levels)
- **Purpose**: Treatment, billing, research, public health, emergency
- **Principal**: Authorized accessor (clinician, institution, researcher, payer)
- **Temporal bounds**: Start time, expiration, revocation conditions
- **Delegation chains**: Transitive authorizations with least-privilege constraints

Access control decisions execute on-chain: validators evaluate consent predicates before authorizing data access. Revocation is immediate (next block finality); no eventual consistency delays.

#### Principle 4: Federated Sovereignty with Global Interoperability

Healthcare regulations and workflows differ across jurisdictions. BioVault's federated architecture respects this diversity while enabling cross-border care:

- **Phase 1 (Current)**: Single permissioned network; ~7 validators across sectors
- **Phase 2 (Production)**: Dedicated optimized blockchain; 21-31 validators per regional instance
- **Phase 3 (Federation)**: Independent regional instances with local validator sets; cross-instance bridges for emergency access and research collaboration

Each instance enforces its jurisdiction's regulations while participating in a coordinated network for:

- Cross-border emergency access with local jurisdiction validation
- Privacy-preserving research collaboration across instances
- Mutual recognition of credentials via trust registries

#### Principle 5: Auditability Without Surveillance

Every access event produces an immutable, cryptographically signed audit receipt recorded on-chain. These receipts provide:

- **Patient transparency**: Real-time access logs; patients can detect inappropriate access and challenge violations
- **Regulatory observability**: Compliance auditors query ledger directly; no reliance on institutional logs
- **Forensic integrity**: Non-repudiable evidence for disputes; receipts include timestamps, actor identities, and purpose justifications

Critically, auditability does not compromise privacy. Audit logs record **who accessed what, when, and why**—not the medical content itself.

---

### 1.2 Core Design Goals

The following table contrasts BioVault's design goals with traditional centralized systems:

| Dimension               | Traditional Systems                           | BioVault Protocol                                          |
| ----------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| **Data ownership**      | Institution controls; patient requests access | Patient owns keys; institution requires consent            |
| **Consent model**       | Static forms; difficult to revoke             | Executable programs; instant revocation                    |
| **Access control**      | Role-based (RBAC); coarse-grained             | Capability-based; fine-grained (resource × purpose × time) |
| **Audit trail**         | Mutable logs; institution-controlled          | Immutable receipts; patient and regulator accessible       |
| **Interoperability**    | Vendor-specific APIs; data export friction    | FHIR/DICOM standards; portable by design                   |
| **Emergency access**    | Ad hoc policies; poor accountability          | Defined protocol; minimal dataset, logged                  |
| **Encryption**          | At-rest/in-transit (server-controlled keys)   | Client-side (patient-controlled keys)                      |
| **Compliance approach** | Reactive audits; policy enforcement           | Compliance-by-construction; cryptographic guarantees       |
| **Scalability model**   | Vertical (infrastructure expansion)           | Horizontal (federated architecture + off-chain storage)    |
| **Trust model**         | Trust institution and vendor                  | Verify cryptographically                                   |

**Key Differentiators**:

1. **Sovereignty**: Patient control is architectural, not aspirational
2. **Verifiability**: All claims are cryptographically provable
3. **Resilience**: No single point of failure; federated validators, replicated storage
4. **Privacy**: Breaches expose ciphertext only; zero-knowledge proofs for analytics
5. **Openness**: Open standards (FHIR, DICOM), transparent governance

---

### 1.3 System Context

The following diagram illustrates BioVault's system context and external interactions:

```mermaid
graph TB
    subgraph "Patient Interfaces"
        Mobile[Mobile Applications]
        Web[Web Portal]
    end

    subgraph "BioVault Protocol Layer"
        Validators[Permissioned Validators<br/>Multi-sector governance]
        Gateway[API Gateway<br/>FHIR/REST]
        Indexer[Event Indexer<br/>Query optimization]
    end

    subgraph "Storage Layer"
        Storage[Decentralized Storage<br/>Encrypted objects]
        Recovery[Key Recovery Services<br/>Threshold cryptography]
    end

    subgraph "External Systems"
        Legacy[Legacy Systems<br/>Epic, Cerner]
        Labs[Laboratories<br/>Result reporting]
        Payers[Insurance Providers<br/>Claims verification]
        Regulators[Regulatory Bodies<br/>Compliance monitoring]
        Researchers[Research Organizations<br/>Consented studies]
    end

    Mobile -->|Authenticate + Encrypt| Gateway
    Web -->|Authenticate + Encrypt| Gateway
    Gateway -->|Consent verification| Validators
    Gateway -->|Content retrieval| Storage
    Validators -->|Audit receipts| Indexer
    Mobile -->|Key backup| Recovery

    Legacy <-->|FHIR Adapter| Gateway
    Labs -->|Results upload| Gateway
    Payers -->|Claims verification| Validators
    Regulators -->|Query audit logs| Indexer
    Researchers -->|Consented queries| Gateway
```

**Trust Boundaries**:

- **Patient Devices**: Trusted execution environment; cryptographic operations occur client-side
- **Protocol Layer**: Byzantine fault-tolerant; no single validator can compromise integrity
- **Storage Layer**: Untrusted; assumes adversarial operators; data protected by encryption
- **External Systems**: Untrusted; authenticated via verifiable credentials; access mediated by consent

---

### 1.4 Deployment Phases

BioVault's architecture evolves through three distinct phases:

**Phase 1: MVP (Q1-Q3 2025)**

- **Objective**: Technical validation and pilot deployment
- **Infrastructure**: Permissioned network on existing blockchain infrastructure
- **Validator Set**: 7 nodes across sectors (foundation, academic partners, health institutions, NGOs, governmental entities)
- **Storage**: Decentralized file system with redundancy
- **Limitations**: Limited throughput; centralized governance; manual validator onboarding

**Phase 2: Production Deployment (Q4 2025-2027)**

- **Objective**: Production-scale deployment with optimized performance
- **Infrastructure**: Dedicated blockchain optimized for healthcare workloads
- **Validator Set**: 21-31 nodes per regional instance; balanced across 4 sectors; Byzantine fault tolerance
- **Storage**: Enhanced redundancy with incentivized providers
- **Enhancements**: Hardware security requirements for validators; governance protocols for upgrades

**Phase 3: Regional Federation (2028+)**

- **Objective**: Global interoperability with local sovereignty
- **Infrastructure**: Independent regional instances with coordinated standards
- **Validator Set**: Each instance independently governed; meta-consortium for coordination
- **Storage**: Data residency enforcement; cross-border transfers with explicit consent
- **Advanced Features**: Privacy-preserving federated queries; integration with national identity systems

---

### 1.5 Technical Goals

**Primary Goals**:

1. **Patient Sovereignty**: Cryptographic enforcement of access control
2. **Regulatory Compliance**: Architecture satisfies GDPR, HIPAA, ISO standards by design
3. **Interoperability**: Native support for FHIR, DICOM, LOINC, SNOMED CT
4. **Auditability**: Immutable, queryable audit logs for all stakeholders
5. **Resilience**: Byzantine fault tolerance; distributed architecture
6. **Performance**: Sub-second consent checks; efficient data retrieval
7. **Privacy**: Zero-knowledge proofs; client-side encryption
8. **Extensibility**: Pluggable modules for policies, standards, and integrations

**Non-Goals**:

1. Not a general-purpose blockchain; optimized specifically for healthcare
2. No speculative tokenomics; fees cover operational costs
3. Permissioned architecture necessary for regulatory compliance
4. Infrastructure for data access; AI models are third-party applications
5. Designed for episodic records; real-time streaming requires separate integration

---

### 1.6 Document Structure

**Chapter Organization**:

- Progressive depth: context → architecture → components → integration
- Each chapter: Overview → Specification → Examples → References

**Notation**:

- `code_snippets`: Literal code or configuration
- **Bold**: Key terms on first use or emphasis
- _Italic_: Trade-offs, assumptions, or notes

---

### 1.7 Clinical Use Cases & User Journeys

#### Use Case 1: Emergency Department Access

**Scenario**: John, 45, collapses unconscious. Paramedics arrive without medical history.

**BioVault Workflow**:

1. **T+0 min**: Paramedic scans John's medical alert bracelet (QR code containing DID)
2. **T+0.5 min**: Paramedic submits emergency access request:
   ```json
   {
     "responder_did": "did:sol:EMT-Badge-12345",
     "patient_did": "did:sol:John-Medical-ID",
     "justification": "Unconscious patient, cardiac arrest suspected",
     "emergency_context": {
       "location": "GPS coordinates",
       "timestamp": "2025-02-15T14:23:00Z",
       "witness_badge": "EMT-Unit-789"
     }
   }
   ```
3. **T+1 min**: System validates:
   - [OK] Responder credential authentic (EMT license verified)
   - [OK] Emergency profile exists (John pre-authorized)
   - [OK] Geolocation plausible (near emergency services)
   - [OK] Justification present (non-empty medical reasoning)
4. **T+1.5 min**: Timelock-free emergency access granted (pre-authorized minimal dataset)
5. **T+2 min**: Paramedic views:
   - **Allergies**: Penicillin (severe anaphylaxis)
   - **Medications**: Aspirin 81mg daily, Lisinopril 10mg (hypertension)
   - **Conditions**: Hypertension, previous MI (myocardial infarction) 2020
   - **Blood Type**: O+ (universal donor compatible)
   - **DNR**: None (full resuscitation authorized)
6. **T+2 min**: Immediate care decision: Avoid beta-blockers (contraindicated with lisinopril), prepare for potential cardiac intervention
7. **T+24 hours**: John recovers, receives notification of emergency access with full audit trail

**Outcome**: Life-saving medication allergy information prevented anaphylactic shock during resuscitation. John's family thanks EMTs for checking his BioVault emergency profile.

#### Use Case 2: Multi-Specialist Coordination

**Scenario**: Sarah, 62, undergoing cancer treatment (requires oncologist, cardiologist, primary care coordination).

**BioVault Workflow**:

1. **Initial Consent** (Sarah's primary care physician):

   ```
   Sarah grants access to:
   - Dr. Smith (Primary Care): All records, treatment purpose, expires: never
   - Dr. Johnson (Oncologist): All records, treatment, expires: 2 years
   - Dr. Lee (Cardiologist): Cardiac history + current meds, treatment, expires: 1 year
   ```

2. **Delegation** (Oncologist delegates to specialist):

   ```
   Dr. Johnson delegates to:
   - Dr. Patel (Radiation Oncologist): Cancer records only, expires: 6 months
   - Nurse Brown (Oncology RN): Vital signs + medication adherence, expires: 90 days
   ```

3. **Scope Attenuation Enforced**:
   - Dr. Patel can see cancer imaging, pathology reports
   - Dr. Patel **cannot** see psychiatric records, primary care notes
   - Nurse Brown can see medication schedule but **not** diagnostic images
   - All access logged immutably with purpose and delegation chain

4. **Revocation Cascade**:
   - Sarah completes cancer treatment, revokes Dr. Johnson's access
   - System automatically revokes Dr. Patel and Nurse Brown (downstream delegations)
   - Dr. Smith and Dr. Lee retain access (separate consent grants)

**Outcome**: Coordinated care with granular access control. Sarah maintains visibility into who accessed what records and can revoke at any time.

#### Use Case 3: Research Participation

**Scenario**: Emily, 38, wants to contribute her genetic data to Alzheimer's research.

**BioVault Workflow**:

1. **Researcher Proposal**:

   ```
   Study: Alzheimer's Genetic Risk Factors (IRB #2025-001)
   Request: Genomic data + family history for patients age 30-50
   Compensation: $50 gift card
   Duration: 3-year study
   Privacy: De-identified data, differential privacy (ε=0.5)
   ```

2. **Patient Consent**:
   - Emily reviews study details in BioVault app
   - Grants access: Genomic VCF file + family history (mother had Alzheimer's)
   - Withholds: Current medications, unrelated conditions
   - Expiration: Automatically revokes after 3 years

3. **De-Identification**:
   - System exports Emily's data with pseudonymous ID
   - Differential privacy noise added to age (reported as "35-40")
   - Research receives encrypted data bundle

4. **Ongoing Control**:
   - Emily can revoke consent anytime
   - Emily receives study updates (annual progress reports)
   - If study finds actionable genetic risk, Emily notified

**Outcome**: Privacy-preserving research participation with patient control. Emily contributes to science while maintaining sovereignty over her data.

---

**End of Chapter 1**

---

## 2) System Architecture Overview

### Executive Overview

This chapter presents BioVault's architecture through multiple perspectives: system context (external interactions), container structure (major subsystems), component organization (internal modules), and federation topology (cross-jurisdiction coordination). The architecture balances competing demands: patient sovereignty vs. emergency access, local compliance vs. global interoperability, strong consistency vs. performance, and privacy vs. auditability.

The core architectural principle is **separation of concerns through cryptographic boundaries**: medical content remains encrypted off-chain in decentralized storage, while consent state, audit receipts, and governance logic execute on-chain. This split enables compliant data management while providing immutable auditability and patient-controlled access.

Unlike monolithic systems where trust is implicit, BioVault's architecture makes trust explicit and verifiable: patients verify consent grants via cryptographic proofs, validators cross-check each other's signatures through Byzantine fault tolerance, and regulators audit compliance without accessing medical data. Each subsystem operates under zero-trust assumptions.

---

### 2.1 C4 Context: External Actors

The C4 Context view establishes BioVault's position within the healthcare ecosystem, identifying external actors and their interaction patterns.

**Actor Roles and Interactions**:

| Actor                   | Primary Goals                                                 | Interaction Patterns                                                |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Patient**             | Control data; privacy; portability; safety in emergencies     | Encrypt locally; grant consent on-chain; query audit logs           |
| **Clinician**           | Complete clinical context; fast access; reduced liability     | Request via Gateway; access with consent verification               |
| **Hospital**            | Compliance; interoperability; no vendor lock-in               | FHIR adapters; bulk operations; compliance dashboards               |
| **Laboratory**          | Upload results; receive payment; standards compliance         | Upload via Gateway; record references on-chain                      |
| **Payer**               | Fraud detection; claims verification; cost control            | Query for claim provenance; verify against audit trail              |
| **Regulator**           | Compliance monitoring; breach investigation; patient rights   | Read-only audit queries; aggregate compliance metrics               |
| **Researcher**          | Cohort identification; consented data access; reproducibility | Submit criteria; receive anonymized references; compensate patients |
| **Emergency Responder** | Rapid access to life-critical data; legal justification       | Invoke break-glass with justification; access minimal dataset       |

**Key Observations**:

1. **No Single Trusted Authority**: Each actor verifies independently through cryptographic proofs
2. **Consent as Central Mediator**: All data access flows through on-chain consent verification
3. **Separation of Concerns**: Actors never directly access storage; Gateway enforces policies
4. **Cryptographic Accountability**: Every interaction produces signed receipts for dispute resolution

---

### 2.2 C4 Container: Major Subsystems

The Container view decomposes BioVault into coarse-grained subsystems with distinct responsibilities and trust properties.

**Container Responsibilities**:

| Container                 | Responsibility                                                            | Trust Model                                             | Failure Domain                                                          |
| ------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Mobile/Web App**        | Encrypt data; sign transactions; manage keys locally                      | Trusted execution environment                           | Device compromise mitigated by distributed recovery                     |
| **API Gateway**           | Rate limiting; authentication; standards translation; consent enforcement | Semi-trusted (stateless; verifies validator signatures) | DDoS; outage (fallback to direct access)                                |
| **Consent Registry**      | Store consent grants; evaluate access predicates; emit receipts           | Byzantine fault-tolerant consensus                      | Requires >2/3 validator collusion (mitigated by multi-sector structure) |
| **Delegation Manager**    | Transitive authorization; scope propagation; revocation cascade           | BFT; least-privilege enforcement                        | Chain exploits mitigated by depth limits and audit                      |
| **Audit Log**             | Append-only receipts; event ordering; indexing triggers                   | BFT; immutable after finality                           | Immutability is architectural invariant                                 |
| **Emergency Access**      | Break-glass invocation; minimal dataset scope; justification logging      | BFT + multi-factor verification                         | Post-event review and patient recourse                                  |
| **Decentralized Storage** | Store encrypted objects; content addressing; replication                  | Untrusted (client-side encryption)                      | Data loss mitigated by redundancy                                       |
| **Event Indexer**         | Materialize queryable views; full-text search; analytics                  | Semi-trusted (read-only; verifies proofs)               | Stale reads (eventual consistency for non-critical queries)             |
| **Key Recovery**          | Threshold custody; no unilateral access                                   | Semi-trusted (threshold model; audited operations)      | Service outage (fallback to manual reconstruction)                      |

**Design Rationale**:

1. **Stateless Gateway**: Scales horizontally; no session affinity required
2. **BFT Protocol Layer**: Consensus ensures integrity; no single validator can forge receipts
3. **Untrusted Storage**: Encryption protects confidentiality even under full storage compromise
4. **Event-Driven Indexer**: Materializes views for fast queries; verifies against ledger for critical operations
5. **Federated Key Recovery**: Threshold model prevents unilateral access while enabling recovery

**Event Indexer API Example**:

The Event Indexer exposes queryable views of on-chain audit logs via RESTful API:

```http
GET /v1/audit/query?patient_did=did:sol:5tKzm...&limit=50&offset=0
Authorization: Bearer <patient_jwt_token>
```

**Response**:

```json
{
  "total_events": 247,
  "limit": 50,
  "offset": 0,
  "events": [
    {
      "event_id": "evt_2025021512345",
      "event_type": "AccessGranted",
      "timestamp": "2025-02-15T14:23:17Z",
      "patient_did": "did:sol:5tKzmQchzqPZqZdBrD9vAzPvQ8uZh4xG3sF9zJPWjK7A",
      "accessor_did": "did:sol:Dr-Smith-Cardiology",
      "accessor_name": "Dr. Jane Smith",
      "accessor_credential": "Medical License MD-12345",
      "purpose": "treatment",
      "resource_type": "DiagnosticReport",
      "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      "expires_at": "2025-08-15T14:23:17Z",
      "signature": "0x92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da...",
      "block_height": 187234567,
      "transaction_id": "5KJfG8hR3tN..."
    },
    {
      "event_id": "evt_2025021411234",
      "event_type": "RecordUploaded",
      "timestamp": "2025-02-14T09:15:42Z",
      "patient_did": "did:sol:5tKzmQchzqPZqZdBrD9vAzPvQ8uZh4xG3sF9zJPWjK7A",
      "resource_type": "Observation",
      "cid": "bafybeihdwdcefgh4kdqkjkwjvcn34gh2ktyu6kla5h2krtyu6kla5h2krt",
      "file_size_bytes": 2048,
      "encrypted": true,
      "block_height": 187123456,
      "transaction_id": "3HjD9fK2mP..."
    }
  ],
  "query_time_ms": 42
}
```

**Query Parameters**:

- `patient_did`: Filter by patient identifier (required)
- `event_type`: Filter by event type (optional: `AccessGranted`, `AccessRevoked`, `RecordUploaded`, `EmergencyAccess`)
- `start_date`: Filter events after timestamp (ISO 8601)
- `end_date`: Filter events before timestamp (ISO 8601)
- `accessor_did`: Filter by accessor identifier
- `limit`: Results per page (default: 50, max: 1000)
- `offset`: Pagination offset

**Performance**: Typical query latency <100ms (indexed database), with fallback to on-chain verification for critical compliance queries

---

### 2.3 Component Organization

The Component view reveals internal module structure and interactions.

**Protocol Layer (On-Chain Programs)**:

- **Consent State Management**: Per-patient storage structures for consent grants
- **Evaluation Logic**: Predicate evaluation (who/what/why/when)
- **Capability Token Issuance**: Time-bound authorization grants
- **Delegation Chain Management**: Transitive authorization with scope propagation
- **Revocation Cascade**: Cleanup of dependent authorizations
- **Event Emission**: Audit receipt generation
- **Emergency Profile Storage**: Minimal datasets for break-glass scenarios
- **Multi-Factor Verification**: Break-glass authorization checks

**Gateway Layer (Off-Chain Services)**:

- **Authentication**: JWT verification and credential validation
- **Rate Limiting**: Per-identity quotas
- **Standards Adapter**: FHIR R4 serialization and transformation
- **Consent Enforcement**: Pre-flight access checks
- **Storage Proxy**: Interface to decentralized storage
- **Event Streaming**: Real-time audit log delivery
- **Session Management**: Subscription state for real-time connections

**Module Interaction Flows**:

1. **Consent Check Flow**:
   - Client sends request with identity credential + data scope
   - Gateway's enforcer calls on-chain consent verification
   - Registry evaluates predicates and delegation chains
   - If approved, mints short-lived capability token
   - Subsequent requests within token lifetime skip on-chain verification

2. **Data Write Flow**:
   - Client encrypts content locally with unique key
   - Client uploads to storage via Gateway; receives content identifier
   - Client submits on-chain transaction linking patient to content reference
   - Registry creates storage structure; Audit Log emits receipt

3. **Emergency Access Flow**:
   - Responder presents credentials + context + justification
   - Gateway forwards to Emergency Access module
   - Multi-factor verification: credentials valid? Context plausible? Justification present?
   - If approved, returns minimal dataset reference; logs access immutably
   - Patient receives notification for post-event review

4. **Revocation Cascade Flow**:
   - Patient revokes consent for accessor
   - Registry marks consent revoked; triggers delegation cleanup
   - Manager iterates through chains; revokes transitive authorizations
   - Each revocation emits audit event; Indexer updates views
   - Previously issued capability tokens expire naturally (short lifetime)

---

### 2.4 Trust Boundaries

BioVault's architecture defines explicit trust boundaries with different threat models:

| Trust Boundary        | Components                           | Trust Assumptions                                  | Threat Surface                         | Mitigations                                              |
| --------------------- | ------------------------------------ | -------------------------------------------------- | -------------------------------------- | -------------------------------------------------------- |
| **Patient Device**    | Applications; local keys; encryption | Trusted execution environment; user authentication | Malware; phishing; theft               | Device encryption; biometric auth; distributed recovery  |
| **Gateway Perimeter** | API services; rate limiters          | Stateless; signature verification                  | DDoS; authentication bypass; injection | Rate limiting; JWT verification; input validation; TLS   |
| **Protocol Layer**    | Consensus; state management          | Byzantine fault tolerance; validator diversity     | Collusion (>2/3); Sybil attacks        | Economic bonds; slashing; sector diversity; verification |
| **Storage Layer**     | Encrypted objects                    | Adversarial operators                              | Data loss; availability attacks        | Redundancy; client-side encryption; content addressing   |
| **Key Recovery**      | Threshold custody                    | Threshold trust; audit logs                        | Service compromise; coercion           | Threshold model; share encryption; audit logs            |

#### 2.4.1 Security Response Guarantees

BioVault maintains strict response timelines for security threats:

| Threat Type               | Detection Time             | Response Time               | Communication                  | Mitigation                           |
| ------------------------- | -------------------------- | --------------------------- | ------------------------------ | ------------------------------------ |
| **Active Breach**         | <5 minutes                 | <15 minutes                 | Immediate patient notification | Isolation, key rotation, forensics   |
| **Vulnerability Exploit** | <30 minutes                | <2 hours                    | Status page update             | Emergency patch deployment           |
| **DoS Attack**            | Real-time                  | Automatic mitigation        | Post-incident report           | Cloudflare DDoS protection (10Tbps)  |
| **Smart Contract Bug**    | <1 hour (after disclosure) | <24 hours (emergency patch) | Public advisory                | Hotfix + external audit verification |
| **Validator Compromise**  | <10 minutes                | <1 hour                     | Validator network notification | Validator isolation + key rotation   |
| **Phishing Campaign**     | <30 minutes                | <4 hours                    | User education campaign        | Domain takedown + user alerts        |

**Response Philosophy**: BioVault prioritizes transparency and rapid response. All P0/P1 incidents result in public disclosure within 72 hours, including root cause analysis and remediation steps.

---

### 2.5 Critical Data Flows

#### 2.5.1 Complete Transaction Timeline

**Patient Uploads Medical Record (End-to-End)**:

```mermaid
sequenceDiagram
    autonumber
    participant P as Patient Device
    participant C as Client App
    participant S as Storage (IPFS)
    participant G as API Gateway
    participant V as Validator Network
    participant I as Event Indexer

    Note over P,I: Total Time: ~2-3 seconds (P95)

    P->>C: Select file (user action)
    C->>C: Encrypt locally (AES-256-GCM)<br/>⏱️ ~15ms per MB
    C->>S: Upload ciphertext<br/>⏱️ ~800ms (3x pinning)
    S->>C: Return CID
    C->>G: Submit metadata transaction<br/>⏱️ ~50ms (network)
    G->>G: Validate + Sign<br/>⏱️ ~5ms
    G->>V: Broadcast transaction<br/>⏱️ ~400ms (consensus)
    V->>V: Execute program<br/>⏱️ ~1ms (compute)
    V->>V: Finalize block<br/>⏱️ Included in ~400ms slot
    V->>I: Emit event<br/>⏱️ ~100ms (async)
    I->>I: Index to database<br/>⏱️ ~200ms
    I-->>C: Confirmation (WebSocket)<br/>⏱️ Real-time
    C->>P: Display success

    Note over P,I: Audit trail immutable after ~1.3s (block finality)
```

**Performance Breakdown**:

| Phase              | Duration  | Bottleneck               | Optimization                 |
| ------------------ | --------- | ------------------------ | ---------------------------- |
| Local Encryption   | ~15ms/MB  | CPU (AES-256-GCM)        | Hardware acceleration        |
| IPFS Upload        | ~800ms    | Network + 3x replication | Pre-pin to local node        |
| Transaction Submit | ~50ms     | Network latency          | Geographic CDN               |
| Consensus Finality | ~400ms    | Solana block time        | Optimized (industry-leading) |
| Event Processing   | ~300ms    | Database write           | Async processing             |
| **Total (P95)**    | **~2.3s** | IPFS pinning             | Parallel pinning             |

**Data Flow 1: Patient Uploads Medical Record (Detailed)**

**Data Flow 2: Clinician Requests Access**

```
[Clinician Device]
  ↓
  1. Authenticate with credential
  2. Request access with specified purpose
  ↓
[API Gateway]
  ↓
  3. Verify authentication; check rate limits
  4. Call on-chain consent verification
  ↓
[Consent Registry]
  ↓
  5. Evaluate consent predicates
  6. Mint capability token if approved
  7. Emit audit receipt
  ↓
[API Gateway]
  ↓
  8. Fetch content identifiers
  9. Retrieve encrypted content from storage
  10. Return references and capability token
  ↓
[Clinician Device]
  ↓
  11. Decrypt content using granted keys
  12. Render in interface
```

**Data Flow 3: Emergency Responder Break-Glass**

```
[Responder Device]
  ↓
  1. Present emergency credential
  2. Provide context and justification
  ↓
[API Gateway]
  ↓
  3. Verify credential; validate context
  4. Forward to Emergency Access module
  ↓
[Emergency Access Module]
  ↓
  5. Multi-factor verification
  6. Fetch minimal dataset reference
  7. Emit audit receipt
  8. Queue patient notification
  ↓
[API Gateway]
  ↓
  9. Retrieve minimal dataset from storage
  10. Return limited scope content
  ↓
[Responder Device]
  ↓
  11. Decrypt and display minimal dataset
  ↓
[Patient Device (asynchronous)]
  ↓
  12. Receive notification
  13. Review access in audit log
```

---

### 2.6 Federation Model

BioVault's federated design enables local sovereignty while supporting global interoperability.

**Federation Principles**:

1. **Local Sovereignty**: Each instance operates independently; validator set governed by local consortium; data residency enforced at storage layer

2. **Standards Coordination**: Meta-consortium maintains baseline standards: consent schemas, audit formats, bridge protocols, credential formats

3. **Mutual Recognition**: Credentials issued in one instance honored in others via trust registries

4. **Cross-Instance Data Transfer**: Patient traveling between jurisdictions pre-authorizes emergency access. When responder invokes break-glass:
   - Local validator queries origin instance via bridge
   - Origin instance verifies patient's consent policy
   - Cross-instance proof validated; capability token issued
   - Access logged on both instances; patient sees unified audit trail

5. **Data Residency Enforcement**: Patient's medical records remain in origin storage; accessing instance retrieves via bridge proxy without permanent replication unless patient explicitly authorizes

**Bridge Security Model**:

- Multi-guardian signatures required (quorum across instances)
- State proofs prevent equivocation
- Nonce-based replay prevention; time-limited tokens
- Fallback: Manual export/import if bridge unavailable

**Conflict Resolution**:

When regional instances disagree on policy interpretations or cross-instance operations, resolution follows a federated quorum model:

- **Technical Disputes** (e.g., incompatible schema versions): Meta-consortium technical committee convenes; requires 2/3 vote of participating instances to adopt resolution
- **Regulatory Conflicts** (e.g., conflicting data residency laws): Local instance rules take precedence within jurisdiction; cross-border transfers require explicit patient consent acknowledging both jurisdictions' rules
- **Emergency Consensus** (e.g., break-glass disagreement): Originating instance (where patient data resides) has final authority; accessing instance must honor origin's determination even if local policy differs

---

### 2.7 Implementation Stack Summary

**Technology Stack Overview**:

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT LAYER                                                │
│  Mobile Applications (iOS/Android) | Web Portal             │
│  Client-side encryption | Wallet integration                │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│  API LAYER                                                   │
│  Gateway Services | Rate limiting | Authentication          │
│  Standards translation | Consent enforcement               │
└─────────────────────────────────────────────────────────────┘
                            ↓ RPC/HTTP
┌──────────────────────┬──────────────────────────────────────┐
│  BLOCKCHAIN LAYER    │  STORAGE LAYER                       │
│  Consensus programs  │  Decentralized file system          │
│  State management    │  Content-addressed storage          │
│  Byzantine fault     │  Redundant replication              │
│  tolerance           │                                      │
└──────────────────────┴──────────────────────────────────────┘
                            ↓ Events
┌─────────────────────────────────────────────────────────────┐
│  INDEXER LAYER                                               │
│  Event processing | Database | Query optimization          │
└─────────────────────────────────────────────────────────────┘
                            ↓ Metrics
┌─────────────────────────────────────────────────────────────┐
│  MONITORING LAYER                                            │
│  Metrics collection | Visualization | Alerting              │
└─────────────────────────────────────────────────────────────┘
```

**Key Technology Choices**:

- **Client Layer**: Native and web applications with wallet integration and client-side encryption
- **API Layer**: Stateless gateway services with standards support (FHIR R4)
- **Blockchain Layer**: Permissioned validators with Byzantine fault tolerance
- **Storage Layer**: Content-addressed decentralized storage with redundancy
- **Indexer Layer**: Event-driven database for efficient queries
- **Monitoring Layer**: Comprehensive observability for operational excellence

**Layer Responsibility Matrix**:

| Layer                | Validator                        | Gateway                         | Auditor                        | Patient                           | Provider                            |
| -------------------- | -------------------------------- | ------------------------------- | ------------------------------ | --------------------------------- | ----------------------------------- |
| **Client Layer**     | [NO] No access                   | [NO] No access                  | [NO] No access                 | [OK] Full control                 | [OK] Full control (when authorized) |
| **API Layer**        | [NO] No direct access            | [OK] Read/Write (orchestration) | [OK] Read (audit queries)      | [OK] Read/Write (via client)      | [OK] Read (via client)              |
| **Blockchain Layer** | [OK] Read/Write (consensus)      | [OK] Read (query state)         | [OK] Read (audit logs)         | [OK] Write (consent grants)       | [OK] Read (access verification)     |
| **Storage Layer**    | [NO] No access (ciphertext only) | [OK] Read/Write (proxy)         | [NO] No access (encrypted)     | [OK] Read/Write (decrypt capable) | [OK] Read (if authorized + key)     |
| **Indexer Layer**    | [NO] No access                   | [OK] Read/Write (populate DB)   | [OK] Read (query optimization) | [OK] Read (via Gateway)           | [OK] Read (via Gateway)             |
| **Monitoring Layer** | [OK] Read (health metrics)       | [OK] Read (observability)       | [OK] Read (compliance metrics) | [NO] No access                    | [NO] No access                      |

**Notes**:

- **Validators**: Execute consensus; access on-chain state only; never see plaintext medical data
- **Gateway**: Orchestrates requests; proxies encrypted data; enforces consent before access
- **Auditors**: Query immutable logs and compliance metrics; no access to medical content
- **Patients**: Sovereign over all data; control encryption keys; grant/revoke access
- **Providers**: Access medical data only with valid consent + decryption capability from patient

(For full implementation details, see the **BioVault Internal Security & Infrastructure Reference** - restricted access.)

---

### 2.8 Economic Model & Fee Structure

#### 2.8.1 Transaction Cost Breakdown

BioVault's economic model is designed to be sustainable without speculative tokenomics. Fees cover validator operational costs while remaining orders of magnitude cheaper than traditional healthcare data systems' implicit costs.

**Cost per Operation** (at 1 SOL = $100 USD):

| Operation        | Compute Units | Base Fee (SOL) | USD Equivalent | Notes                      |
| ---------------- | ------------- | -------------- | -------------- | -------------------------- |
| Initialize Vault | ~15,000 CU    | 0.000005       | $0.0005        | One-time per patient       |
| Upload Record    | ~25,000 CU    | 0.000005       | $0.0005        | Per medical file           |
| Grant Access     | ~20,000 CU    | 0.000005       | $0.0005        | Per provider authorization |
| Revoke Access    | ~18,000 CU    | 0.000005       | $0.0005        | Instant revocation         |
| Emergency Access | ~30,000 CU    | 0.000005       | $0.0005        | Break-glass activation     |
| Delegation       | ~22,000 CU    | 0.000005       | $0.0005        | Transitive authorization   |

**Storage Costs** (IPFS):

| Tier | Replication    | Geographic Distribution     | Cost/GB/Month | Use Case                            |
| ---- | -------------- | --------------------------- | ------------- | ----------------------------------- |
| Hot  | 5x             | 5 regions (multi-continent) | $0.10         | Recent records (accessed >5×/month) |
| Warm | 3x             | 3 regions (primary markets) | $0.05         | Standard storage (6mo - 2yr old)    |
| Cold | 2x + 1 archive | 2 regions + cold storage    | $0.02         | Long-term archive (>2 years)        |

**Patient Cost Examples** (10-year projection):

**Scenario 1: Healthy Adult (Minimal Usage)**

```
- 20 medical records × 5 MB avg = 100 MB
- On-chain: 21 transactions (1 init + 20 uploads) × $0.0005 = $0.0105
- Storage: 100 MB × $0.05/GB/month × 120 months = $0.60
- Total 10 Years: $0.61 (~6 cents per year)
```

**Scenario 2: Typical Adult (Regular Healthcare)**

```
- 100 records × 10 MB avg = 1 GB
- On-chain: 101 tx + 50 access grants = 151 tx × $0.0005 = $0.0755
- Storage: 1 GB × $0.05/GB/month × 120 months = $6.00
- Total 10 Years: $6.08 (~61 cents per year)
```

**Scenario 3: Chronic Condition (High Usage)**

```
- 500 records × 15 MB avg = 7.5 GB
- On-chain: 501 tx + 200 grants + 50 revokes = 751 tx × $0.0005 = $0.3755
- Storage: 7.5 GB × $0.05/GB/month × 120 months = $45.00
- Total 10 Years: $45.38 (~$4.54 per year)
```

**Scenario 4: Intensive Care (Cancer, Imaging)**

```
- 2,000 records × 50 MB avg = 100 GB (includes DICOM imaging)
- On-chain: 2,001 tx + 500 grants = 2,501 tx × $0.0005 = $1.2505
- Storage: 100 GB × $0.05/GB/month × 120 months = $600.00
- Total 10 Years: $601.25 (~$60 per year)
```

#### 2.8.2 Cost Comparison vs. Traditional Systems

| System                       | Patient Cost (10 yr)            | Data Portability     | Patient Control             | Censorship Resistance    |
| ---------------------------- | ------------------------------- | -------------------- | --------------------------- | ------------------------ |
| **BioVault**                 | $0.61 - $601                    | [OK] Full            | [OK] Sovereign              | [OK] Strong              |
| Traditional EHR              | $0 (implicit in healthcare)     | [NO] Export fees     | [NO] Institution-controlled | [NO] Centralized         |
| Consumer PHR (Apple Health)  | $0 (subsidized)                 | [!] Platform lock-in | [!] Platform TOS            | [NO] Platform-dependent  |
| Blockchain PHR (competitors) | $5,000 - $15,000 (token models) | [OK] Full            | [OK] Partial                | [!] Token economics risk |

**Key Differentiators**:

1. **Transparent Pricing**: Fixed costs based on actual usage, not subscription models
2. **No Tokenomics**: No speculative token required; fees in stablecoin or native cryptocurrency
3. **Sustainable Economics**: Validator operational costs (~$60K/year per validator) covered by transaction fees
4. **True Ownership**: Patients pay for their own data sovereignty, not subsidized by data mining
5. **Scalable Pricing**: Costs decrease with storage tier automation (hot → warm → cold)

**Economic Sustainability Model**:

```
Assuming 100,000 active patients:
- Average annual transactions per patient: 15 (uploads, consents, revokes)
- Annual transaction volume: 1.5 million transactions
- Annual transaction revenue: 1.5M × $0.0005 = $750
- Annual storage revenue: 100K patients × 1GB avg × $0.05/GB/month × 12 = $60,000
- Total annual revenue: $60,750

Validator operational costs (7 validators):
- Cost per validator: ~$60,000/year
- Total validator costs: $420,000/year

Conclusion: System achieves sustainability at ~700,000 patients (achievable in Phase 2)
```

**Note**: BioVault Foundation subsidizes early adoption (Phase 1) through grants and partnerships. Full economic sustainability targeted for Phase 2 deployment (2026-2027).

---

**End of Chapter 2**

---

## 3) Core Components

### Executive Overview

BioVault's core protocol layer implements consent management, access control, and audit logging through on-chain programs. The system uses Program Derived Addresses (PDAs) for deterministic state management, ensuring that consent grants, delegation chains, and audit receipts are cryptographically verifiable and immutable post-finality.

This chapter provides a conceptual overview of the protocol's core operations: vault initialization, consent grant evaluation, delegation management, emergency access, and audit receipt generation. The architecture emphasizes **verifiability**, **atomicity**, and **auditability** at every layer.

---

### 3.1 Conceptual Architecture

**Core Operations**:

1. **Vault Management**: Patient identity containers linking to encrypted medical records
2. **Consent Registry**: Storage and evaluation of access policies
3. **Delegation Framework**: Transitive authorization with scope constraints
4. **Emergency Access**: Break-glass protocols with multi-factor verification
5. **Audit Logging**: Immutable receipt generation for all state changes
6. **File Metadata Management**: Content-addressed references with encryption metadata
7. **Access Token Issuance**: Short-lived capability tokens for efficient authorization

**State Management Principles**:

- **Deterministic Addressing**: All state structures use derivable addresses from patient/accessor identities; no random account creation
- **Atomicity**: Operations complete fully or not at all; no partial states; transaction-level guarantees
- **Immutability**: Audit logs are append-only; historical records never modified; cryptographic commitments prevent tampering
- **Finality**: State changes final after consensus (~400ms on current infrastructure); no rollbacks; Byzantine agreement
- **Least Privilege**: Scoped permissions; time-bounded grants; explicit purpose requirements
- **Event Sourcing**: All state changes emit events; materialize queryable views; enable audit trails

---

### 3.2 Vault Lifecycle Management

**Vault Initialization**:

When a patient first joins BioVault:

```mermaid
stateDiagram-v2
    [*] --> Uninitialized
    Uninitialized --> Active: Initialize vault
    Active --> Active: Add files
    Active --> Active: Grant consent
    Active --> Active: Manage delegations
    Active --> Suspended: Voluntary suspension
    Suspended --> Active: Reactivate
    Active --> Archived: Archive (retain audit trail)
    Archived --> [*]
```

**Vault Operations**:

| Operation          | Description                | Constraints                         | Event Emitted     |
| ------------------ | -------------------------- | ----------------------------------- | ----------------- |
| **Initialize**     | Create patient vault       | Patient must not already have vault | VaultCreated      |
| **Add File**       | Link encrypted file        | Must own vault; valid CID           | FileAdded         |
| **Remove File**    | Unlink file (soft delete)  | Must own vault; file exists         | FileRemoved       |
| **Grant Consent**  | Authorize accessor         | Must own vault; valid DID           | ConsentGranted    |
| **Revoke Consent** | Revoke authorization       | Must own vault; consent exists      | ConsentRevoked    |
| **Delegate**       | Transitive authorization   | Must have delegation rights         | DelegationCreated |
| **Suspend**        | Temporary vault suspension | Must own vault                      | VaultSuspended    |
| **Reactivate**     | Resume vault operations    | Must own suspended vault            | VaultReactivated  |

**Vault State Storage** (conceptual):

```
VaultAccount {
  owner: PublicKey           // Patient DID
  status: VaultStatus        // Active | Suspended | Archived
  created_at: Timestamp
  updated_at: Timestamp
  file_count: u32
  consent_count: u32
  emergency_profile: Option<EmergencyProfile>
  metadata: Map<String, String>
}
```

---

### 3.3 Consent Evaluation Logic

**Consent Predicate Model**:

Access decisions evaluate multi-dimensional predicates:

```
GRANT access IF:
  - accessor.identity IN consent.authorized_parties
  - resource.type IN consent.scope.resource_types
  - access.purpose MATCHES consent.purpose
  - current_time BETWEEN consent.start_time AND consent.end_time
  - consent.revoked == false
  - delegation_depth <= max_depth (default: 3)
  - (resource.sensitivity_level <= accessor.clearance_level)
```

**Consent Grant Structure** (conceptual):

```
ConsentGrant {
  patient: PublicKey
  accessor: PublicKey
  scope: AccessScope {
    resource_types: Vec<ResourceType>
    date_range: Option<DateRange>
    sensitivity_levels: Vec<SensitivityLevel>
  }
  purpose: AccessPurpose  // Treatment | Research | Billing | Emergency
  temporal: TemporalBounds {
    start_time: Timestamp
    end_time: Option<Timestamp>
    max_access_count: Option<u32>
  }
  delegation_rights: DelegationRights {
    can_delegate: bool
    max_depth: u8
    scope_attenuation: Vec<Constraint>
  }
  created_at: Timestamp
  revoked: bool
  revoked_at: Option<Timestamp>
}
```

**Evaluation Flow** (detailed):

```mermaid
flowchart TD
    A[Access Request] --> B{Parse Request}
    B --> C[Extract: Accessor DID, Patient DID, Resource Type, Purpose]
    C --> D{Query Consent Storage}
    D --> E{Matching Grant Found?}
    E -->|No| F[Deny: No Consent]
    E -->|Yes| G{Temporal Validity?}
    G -->|Expired| H[Deny: Consent Expired]
    G -->|Not Started| I[Deny: Consent Not Active]
    G -->|Valid| J{Revoked?}
    J -->|Yes| K[Deny: Consent Revoked]
    J -->|No| L{Scope Match?}
    L -->|No| M[Deny: Scope Mismatch]
    L -->|Yes| N{Purpose Match?}
    N -->|No| O[Deny: Purpose Mismatch]
    N -->|Yes| P{Delegation Valid?}
    P -->|Depth Exceeded| Q[Deny: Delegation Too Deep]
    P -->|Valid| R[Grant Access]
    R --> S[Issue Capability Token]
    S --> T[Emit Audit Receipt]
    T --> U[Return Success]
```

**Access Evaluation Performance**:

| Scenario                  | Latency | Description                  |
| ------------------------- | ------- | ---------------------------- |
| Direct consent (cached)   | <10ms   | Token validation only        |
| Direct consent (on-chain) | ~400ms  | Blockchain query + consensus |
| Delegation (1 level)      | ~500ms  | Additional chain traversal   |
| Delegation (3 levels)     | ~800ms  | Maximum depth traversal      |
| Emergency override        | ~600ms  | Multi-factor verification    |

---

### 3.4 Delegation and Revocation

**Delegation Model**:

- **Direct Delegation**: Patient authorizes accessor directly (most common)
- **Transitive Delegation**: Authorized accessor delegates subset of permissions to third party (e.g., physician delegates to specialist)
- **Scope Attenuation**: Delegated permissions always subset of original grant; cannot expand scope
- **Depth Limits**: Maximum chain length prevents unbounded transitivity; configurable per grant
- **Audit Trail**: Each delegation step logged; full chain reconstructible

**Delegation Chain Example**:

```
Patient Alice
  └─ Grant to Dr. Smith (Primary Care, full treatment scope)
       └─ Dr. Smith delegates to Dr. Jones (Cardiology, cardiac records only)
            └─ Dr. Jones delegates to Nurse Brown (vital signs monitoring only)

Scope Attenuation:
Alice → Smith: All treatment data
Smith → Jones: Cardiac data only (subset)
Jones → Brown: Vital signs only (further subset)
```

**Delegation State Machine**:

```mermaid
stateDiagram-v2
    [*] --> Proposed: Delegation requested
    Proposed --> Active: Original accessor approves
    Active --> Revoked: Upstream consent revoked
    Active --> Revoked: Delegation explicitly revoked
    Active --> Expired: Time-to-live exceeded
    Revoked --> [*]
    Expired --> [*]
```

**Revocation Cascade**:

When patient revokes consent, the system performs a depth-first traversal:

```
1. Mark primary consent as revoked
2. Query for dependent delegations
3. For each delegation:
   a. Mark as revoked
   b. Recursively query for sub-delegations
   c. Emit audit event
4. Invalidate all cached capability tokens
5. Notify all affected parties
```

**Revocation Propagation**:

| Revocation Type   | Propagation Time         | Scope                               |
| ----------------- | ------------------------ | ----------------------------------- |
| Direct consent    | Immediate (~400ms)       | Single accessor                     |
| Delegation chain  | ~400ms + (depth × 100ms) | All downstream accessors            |
| Emergency access  | Immediate                | Single access event (non-repeating) |
| Global revocation | ~1 second                | All accessors                       |

---

### 3.5 Emergency Access Protocol

**Break-Glass Mechanism**:

Emergency access provides life-saving data access when patient cannot consent:

**Trigger Conditions**:

- Life-threatening emergency (unconscious patient, cardiac arrest, stroke, severe trauma)
- Patient incompetent to provide consent (unconscious, cognitively impaired, minor without guardian)
- Responder presents valid emergency credential (EMT, emergency physician, trauma surgeon)
- No existing consent grant covers the emergency scenario

**Verification Checks** (multi-factor):

1. **Credential Validation**: Verify emergency responder role via VC; check issuer in trust registry
2. **Context Plausibility**: Timestamp freshness (<5 minutes); geolocation proximity to emergency services
3. **Justification Requirement**: Non-empty medical reasoning (minimum 20 characters); structured emergency codes
4. **Minimal Dataset Scope**: Access limited to life-critical information only

**Emergency Access Flow**:

```mermaid
sequenceDiagram
    participant R as Responder
    participant G as Gateway
    participant E as Emergency Module
    participant C as Consent Registry
    participant S as Storage
    participant P as Patient

    R->>G: Present emergency credential + context
    G->>E: Forward emergency request
    E->>E: Validate credential
    E->>E: Check context plausibility
    E->>E: Verify justification present
    E->>C: Query for emergency profile
    C->>E: Return minimal dataset reference
    E->>E: Log access immutably
    E->>G: Return capability token
    G->>S: Retrieve minimal dataset
    S->>G: Return encrypted content
    G->>R: Deliver minimal dataset
    E-->>P: Queue notification (async)
```

**Minimal Dataset Definition**:

The emergency profile contains only life-critical information:

| Category | Included Data | Rationale |
|----------|---------------|-----------||
| **Allergies** | Drug allergies, severe reactions | Prevent fatal drug administration |
| **Medications** | Current prescriptions, dosages | Avoid drug interactions |
| **Conditions** | Chronic diseases, implants, pacemakers | Inform treatment decisions |
| **Blood Type** | ABO/Rh status | Enable transfusions |
| **Emergency Contacts** | Next of kin, legal guardian | Obtain proxy consent |
| **Advance Directives** | DNR orders, living will | Honor patient wishes |

**Excluded from Emergency Profile**:

- Complete medical history
- Mental health records
- Genetic information
- Billing information
- Non-critical test results

**Post-Access Review**:

- **Immediate Notification**: Patient receives push notification + email + SMS
- **Immutable Logging**: Full audit trail including responder identity, timestamp, justification, data accessed
- **Challenge Mechanism**: Patient can flag inappropriate access within 30 days
- **Regulatory Review**: Contested accesses reviewed by independent board
- **Penalty Framework**: Inappropriate access results in credential revocation and potential legal action

---

### 3.6 File Metadata Management

**File Registration Process**:

When patient uploads medical record:

```
1. Client encrypts file locally
2. Client uploads to decentralized storage
3. Storage returns content identifier (CID)
4. Client submits on-chain transaction:
   - Patient DID
   - File CID
   - File metadata (type, size, timestamp)
   - Encryption metadata (algorithm, key reference)
5. Consent Registry creates file record
6. Audit log emits FileAdded event
```

**File Metadata Structure** (conceptual):

```
FileMetadata {
  cid: ContentIdentifier
  owner: PublicKey
  file_type: FileType  // FHIR JSON, DICOM, PDF, JPEG
  mime_type: String
  size_bytes: u64
  uploaded_at: Timestamp
  encryption: EncryptionMetadata {
    algorithm: String  // e.g., "AES-256-GCM"
    key_reference: String  // Wrapped key identifier
  }
  tags: Vec<String>
  sensitivity_level: SensitivityLevel
  retention_policy: RetentionPolicy
}
```

**File Operations**:

| Operation           | Authorization      | Effect                           |
| ------------------- | ------------------ | -------------------------------- |
| **Register**        | Patient only       | Create on-chain reference        |
| **Update Metadata** | Patient only       | Modify tags, sensitivity level   |
| **Share**           | Patient only       | Grant consent for access         |
| **Revoke Share**    | Patient only       | Revoke consent                   |
| **Delete**          | Patient only       | Soft delete (retain audit trail) |
| **Access**          | Consented accessor | Retrieve via Gateway             |

---

### 3.7 Audit Receipt Generation

**Event Types**:

| Event Type            | Trigger                  | Payload                                     |
| --------------------- | ------------------------ | ------------------------------------------- |
| **VaultCreated**      | Vault initialization     | Patient DID, timestamp                      |
| **ConsentGranted**    | Access authorization     | Patient DID, Accessor DID, scope, purpose   |
| **ConsentRevoked**    | Access revocation        | Patient DID, Accessor DID, reason           |
| **DataAccessed**      | File retrieval           | Accessor DID, File CID, purpose             |
| **EmergencyAccess**   | Break-glass invoked      | Responder DID, justification, dataset scope |
| **DelegationCreated** | Transitive authorization | Delegator DID, Delegate DID, scope          |
| **DelegationRevoked** | Delegation withdrawal    | Delegator DID, Delegate DID                 |
| **FileAdded**         | File registration        | Patient DID, File CID, metadata             |
| **FileRemoved**       | File deletion            | Patient DID, File CID                       |

**Receipt Structure**:

```
AuditReceipt {
  event_id: Uuid
  event_type: EventType
  timestamp: Timestamp
  block_height: u64
  actor: PublicKey  // Who performed the action
  target: PublicKey  // Whose data was affected
  resource: Option<ContentIdentifier>
  purpose: Option<AccessPurpose>
  justification: Option<String>
  signature: Signature  // Validator signature
  metadata: Map<String, String>
}
```

**Immutability Guarantee**:

Receipts finalized after consensus (~400ms):

- Stored in append-only ledger
- Cryptographically signed by validator
- Cannot be altered or deleted
- Queryable by patient, accessor, and regulators
- Indexed for efficient search

**Query Patterns**:

```
# All access to patient's data
QUERY audit_receipts WHERE target = <patient_did>

# Specific accessor's activities
QUERY audit_receipts WHERE actor = <accessor_did>

# Emergency access events
QUERY audit_receipts WHERE event_type = 'EmergencyAccess'

# Time range query
QUERY audit_receipts WHERE timestamp BETWEEN <start> AND <end>

# File-specific access
QUERY audit_receipts WHERE resource = <file_cid>
```

---

### 3.8 Performance Characteristics

**Operation Latency** (measured on Phase 1 infrastructure):

| Operation                     | Median Latency | 95th Percentile | 99th Percentile |
| ----------------------------- | -------------- | --------------- | --------------- |
| Vault initialization          | 420ms          | 580ms           | 750ms           |
| Consent grant                 | 380ms          | 520ms           | 680ms           |
| Consent evaluation (cached)   | 8ms            | 15ms            | 25ms            |
| Consent evaluation (on-chain) | 410ms          | 560ms           | 720ms           |
| File registration             | 390ms          | 540ms           | 700ms           |
| Delegation (1 level)          | 480ms          | 640ms           | 820ms           |
| Emergency access              | 620ms          | 780ms           | 950ms           |
| Audit query (indexed)         | 12ms           | 28ms            | 45ms            |

**Throughput** (Phase 1 infrastructure):

- **Consent evaluations**: 2,500 ops/sec (with token caching)
- **Consent grants**: 400 tx/sec (limited by blockchain consensus)
- **File registrations**: 350 tx/sec
- **Audit queries**: 10,000 queries/sec (indexer reads)

**Scalability Projections** (Phase 2+):

- **Consent evaluations**: 50,000+ ops/sec (distributed caching)
- **Consent grants**: 5,000+ tx/sec (optimized consensus, parallel processing)
- **File registrations**: 4,500+ tx/sec
- **Audit queries**: 100,000+ queries/sec (read replicas, sharding)

---

### 3.9 Error Handling and Edge Cases

**Error Classification**:

| Error Category           | Examples                                     | Handling                                          |
| ------------------------ | -------------------------------------------- | ------------------------------------------------- |
| **Authorization Errors** | No consent, expired consent, revoked consent | Return 403 Forbidden; emit audit event            |
| **Validation Errors**    | Invalid DID, malformed CID, missing fields   | Return 400 Bad Request; reject transaction        |
| **State Conflicts**      | Duplicate vault, consent already exists      | Return 409 Conflict; suggest resolution           |
| **Resource Not Found**   | Unknown patient, file not found              | Return 404 Not Found                              |
| **Rate Limiting**        | Quota exceeded                               | Return 429 Too Many Requests; include retry-after |
| **Internal Errors**      | Blockchain unreachable, storage failure      | Return 503 Service Unavailable; alert ops team    |

**Edge Cases**:

1. **Concurrent Revocation**: Patient revokes consent while accessor is mid-access
   - **Resolution**: Capability tokens short-lived (1 hour); access completes but future requests denied

2. **Delegation Loop Detection**: A delegates to B, B delegates to C, C attempts delegation to A
   - **Resolution**: Cycle detection algorithm prevents loops; transaction rejected

3. **Emergency Access Abuse**: Responder repeatedly invokes break-glass without justification
   - **Resolution**: Pattern detection; automatic credential suspension; investigation triggered

4. **Split-Brain Scenario**: Network partition causes validator disagreement
   - **Resolution**: Byzantine consensus ensures >66% agreement; partition heals via replay

5. **Time Skew**: Patient and validator clocks misaligned
   - **Resolution**: Timestamp validation tolerates ±5 minutes; NTP synchronization required

---

### 3.10 Integration Points

**External System Interfaces**:

| System Type            | Integration Method      | Data Flow                 |
| ---------------------- | ----------------------- | ------------------------- |
| **EHR Systems**        | FHIR Adapter            | Bidirectional sync        |
| **Laboratory Systems** | LOINC Ingestion         | Results upload            |
| **Imaging Systems**    | DICOM Gateway           | Image storage + metadata  |
| **Payer Systems**      | Claims Verification API | Read-only audit queries   |
| **Research Portals**   | Cohort Query API        | De-identified data export |
| **Patient Apps**       | Native SDK              | Full CRUD operations      |

**API Endpoints** (high-level overview):

```
POST   /v1/vaults/initialize          # Create patient vault
POST   /v1/consents/grant             # Authorize accessor
DELETE /v1/consents/{id}/revoke       # Revoke consent
GET    /v1/consents/evaluate          # Check authorization
POST   /v1/files/register             # Link encrypted file
GET    /v1/files/{cid}                # Retrieve file
POST   /v1/delegations/create         # Transitive auth
POST   /v1/emergency/access           # Break-glass
GET    /v1/audit/query                # Search audit log
```

(Complete API specifications provided in Chapter 12.)

---

**End of Chapter 3**

---

## 4) Identity and Access Control Principles

### Executive Overview

BioVault's identity layer uses Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs) to separate cryptographic identity from real-world attributes. Patients and providers authenticate with DIDs; institutional issuers attest to roles and qualifications through digitally signed credentials. This architecture eliminates centralized identity providers while maintaining regulatory compliance through trust registries and credential verification.

The access control model implements **capability-based security**: possession of a valid credential + consent grant = scoped access rights. This chapter presents the identity architecture, credential lifecycle, verification flows, and capability token mechanisms.

---

### 4.1 Decentralized Identifiers (DIDs)

**Why DIDs?**

BioVault uses DIDs (W3C standard) to provide:

- **Self-sovereignty**: Users control private keys; no central identity provider; no platform lock-in
- **Portability**: Identities work across systems and jurisdictions; patient owns identity independent of any institution
- **Interoperability**: W3C standard compatible with existing credential ecosystems (e.g., NHS, VA)
- **Privacy**: Pseudonymous by default; linkability controlled by user; selective disclosure
- **Verifiability**: Cryptographic proofs replace trust in institutions

**Supported DID Methods**:

| Method       | Format                            | Resolution                         | Use Case                                      | Trust Model         |
| ------------ | --------------------------------- | ---------------------------------- | --------------------------------------------- | ------------------- |
| **did:key**  | `did:key:<multibase-encoded-key>` | Local derivation from public key   | Ephemeral sessions, testing                   | Self-certifying     |
| **did:sol**  | `did:sol:<solana-pubkey>`         | On-chain registry lookup           | Permanent patient/provider IDs                | Blockchain-anchored |
| **did:web**  | `did:web:<domain>:<path>`         | HTTPS resolution via /.well-known/ | Institutional issuers (hospitals, regulators) | DNS + TLS           |
| **did:ethr** | `did:ethr:<ethereum-address>`     | Ethereum smart contract            | Cross-chain interoperability                  | Blockchain-anchored |

**DID Document Structure**:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:sol:5yDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "verificationMethod": [
    {
      "id": "did:sol:5yDXX...#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:sol:5yDXX...",
      "publicKeyMultibase": "z6MkXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  ],
  "authentication": ["did:sol:5yDXX...#key-1"],
  "assertionMethod": ["did:sol:5yDXX...#key-1"],
  "service": [
    {
      "id": "did:sol:5yDXX...#vault",
      "type": "BioVaultEndpoint",
      "serviceEndpoint": "https://gateway.biovault.io"
    }
  ]
}
```

**Resolution Process**:

```mermaid
flowchart LR
    A[DID String] --> B{Parse Method}
    B -->|did:key| C[Derive from Key]
    B -->|did:sol| D[Query Blockchain]
    B -->|did:web| E[HTTPS GET]
    C --> F[DID Document]
    D --> F
    E --> F
    F --> G[Extract Verification Methods]
    G --> H[Validate Signatures]
```

Clients resolve DIDs to obtain verification methods (public keys) for signature validation. Resolution mechanisms vary by method but all return standardized DID documents containing cryptographic material.

**DID Method Comparison**:

| Dimension                    | did:key      | did:sol            | did:web                     |
| ---------------------------- | ------------ | ------------------ | --------------------------- |
| **Setup Cost**               | Free (local) | ~$0.00001 (tx fee) | Domain + hosting            |
| **Resolution Speed**         | <1ms         | ~50ms (RPC)        | ~100ms (HTTPS)              |
| **Update Capability**        | Immutable    | On-chain updates   | Update DID doc file         |
| **Censorship Resistance**    | High         | High               | Medium (DNS/TLS dependency) |
| **Regulatory Acceptability** | Low          | Medium             | High (institutional trust)  |

---

### 4.2 Verifiable Credentials (VCs)

**VC Structure** (W3C VCDM 2.0):

Verifiable credentials contain:

1. **@context**: JSON-LD context for semantic interoperability
2. **type**: Credential type(s) (e.g., MedicalLicenseCredential)
3. **issuer**: DID of issuing authority (e.g., medical board)
4. **issuanceDate**: Timestamp of credential creation
5. **expirationDate**: Timestamp when credential expires
6. **credentialSubject**: Claims about the subject (DID + attributes)
7. **proof**: Digital signature (JWS, LD-Proofs, etc.)

**Example: Physician Credential**

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://biovault.io/credentials/v1"
  ],
  "type": ["VerifiableCredential", "MedicalLicenseCredential"],
  "issuer": "did:web:medical-board.gov",
  "issuanceDate": "2024-01-15T00:00:00Z",
  "expirationDate": "2026-01-15T00:00:00Z",
  "credentialSubject": {
    "id": "did:sol:DrSmith123...",
    "licenseNumber": "MD-12345",
    "specialty": "Cardiology",
    "boardCertified": true,
    "issuingState": "California"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2024-01-15T00:00:00Z",
    "verificationMethod": "did:web:medical-board.gov#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z5XXX..."
  }
}
```

**Role Taxonomy** (comprehensive):

| Role                    | Credential Type           | Claims Required                  | Access Scope                      | Delegation Rights          |
| ----------------------- | ------------------------- | -------------------------------- | --------------------------------- | -------------------------- |
| **Patient**             | PatientIdentityCredential | Self-sovereign DID               | Own data (full control)           | Can delegate to proxies    |
| **Physician**           | MedicalLicenseCredential  | License number, specialty, state | Patient-granted data (read/write) | Can delegate to staff      |
| **Nurse**               | NursingLicenseCredential  | License number, certifications   | Limited scope (per consent)       | Cannot delegate            |
| **Pharmacist**          | PharmacyLicenseCredential | License number, DEA number       | Medication records only           | Cannot delegate            |
| **Researcher**          | ResearcherCredential      | Institution, IRB approval number | Anonymized datasets only          | Cannot delegate            |
| **Emergency Responder** | EmergencyCredential       | EMT/Paramedic certification      | Break-glass minimal dataset       | Cannot delegate            |
| **Legal Guardian**      | GuardianshipCredential    | Court order, minor's DID         | Full proxy (all data)             | Can delegate to caregivers |
| **Insurance Agent**     | PayerCredential           | Insurance company, agent ID      | Billing/claims data only          | Cannot delegate            |
| **Lab Technician**      | LabCredential             | Lab affiliation, CLIA number     | Upload results only               | Cannot delegate            |
| **Auditor**             | RegulatorCredential       | Agency, auditor ID               | Audit logs only (no PHI)          | Cannot delegate            |

**Trust Registry**:

BioVault maintains a registry of trusted credential issuers:

```
TrustRegistry {
  issuer_did: "did:web:medical-board.gov",
  name: "California Medical Board",
  jurisdiction: "US-CA",
  credential_types: ["MedicalLicenseCredential"],
  verified: true,
  added_at: Timestamp,
  revocation_endpoint: "https://medical-board.gov/revoke"
}
```

---

### 4.3 Credential Issuance and Verification

**Issuance Flow**:

```mermaid
sequenceDiagram
    participant S as Subject (Physician)
    participant I as Issuer (Medical Board)
    participant R as Trust Registry
    participant B as BioVault

    S->>I: Request credential (identity proof)
    I->>I: Verify identity + qualifications
    I->>I: Generate credential
    I->>I: Sign with issuer key
    I->>S: Issue credential
    S->>B: Present credential
    B->>R: Check issuer in trust registry
    R->>B: Issuer verified
    B->>I: Resolve issuer DID
    I->>B: Return DID document
    B->>B: Verify credential signature
    B->>I: Query revocation status
    I->>B: Not revoked
    B->>S: Credential accepted
```

**Verification Flow** (detailed):

1. **Receive Credential**: Accessor presents credential in authentication request (HTTP header or request body)
2. **Parse and Validate Structure**: Ensure required fields present; valid JSON-LD; correct @context
3. **Check Issuer Trust**: Query trust registry; ensure issuer DID authorized for credential type
4. **Resolve Issuer DID**: Fetch issuer's DID document; extract verification method
5. **Verify Signature**: Validate proof using issuer's public key; ensure proof purpose matches
6. **Check Temporal Validity**: Current timestamp between issuanceDate and expirationDate
7. **Query Revocation Status**: Check revocation registry (on-chain or StatusList2021)
8. **Extract Claims**: If valid, extract credentialSubject fields
9. **Proceed to Authorization**: Use claims in consent evaluation

**Verification Performance**:

| Step                   | Latency       | Caching Strategy                    |
| ---------------------- | ------------- | ----------------------------------- |
| Structure validation   | <1ms          | N/A                                 |
| Trust registry lookup  | 5-10ms        | Cache trusted issuers (1 hour TTL)  |
| DID resolution         | 50-100ms      | Cache DID documents (1 hour TTL)    |
| Signature verification | 2-5ms         | N/A                                 |
| Revocation check       | 20-50ms       | Cache revocation status (5 min TTL) |
| **Total**              | **~80-170ms** | Optimized to <20ms with caching     |

**Revocation Mechanisms**:

| Mechanism             | Description                      | Pros                              | Cons                           |
| --------------------- | -------------------------------- | --------------------------------- | ------------------------------ |
| **StatusList2021**    | Bitstring published by issuer    | Privacy-preserving (herd privacy) | Requires periodic polling      |
| **On-Chain Registry** | Blockchain-based revocation list | Immutable, real-time              | Higher cost, lower privacy     |
| **OCSP-style**        | Real-time query to issuer        | Accurate, immediate               | Reveals verification to issuer |

BioVault supports all three mechanisms; verifiers check revocation status before accepting credentials. Revoked credentials immediately invalid regardless of expiration date.

---

### 4.4 Privacy-Preserving Techniques

**Selective Disclosure**:

Advanced credential formats (e.g., BBS+ signatures, SD-JWT) enable revealing only required claims:

```
Original Credential:
{
  "licenseNumber": "MD-12345",
  "specialty": "Cardiology",
  "birthdate": "1980-05-15",
  "address": "123 Main St"
}

Selective Disclosure (reveal only necessary):
{
  "licenseNumber": "MD-12345",
  "specialty": "Cardiology"
  // birthdate and address hidden
}
```

Physician proves medical license without revealing personal information like birthdate or home address.

**Zero-Knowledge Predicates** (planned Phase 3):

Prove attributes meet criteria without revealing exact values:

- **Age verification**: Prove age ≥ 18 without revealing birthdate
- **License validity**: Prove license active without revealing issue date
- **Clearance level**: Prove clearance ≥ required level without revealing exact level

**Example: Age Proof**

```
Statement: "I am over 18 years old"
Proof: ZK-SNARK based on birthdate credential
Result: Valid/Invalid (no birthdate revealed)
```

**Pairwise DIDs**:

Patients can generate unique DIDs for each relationship to prevent correlation:

```
Patient Alice:
  did:sol:alice-general (public profile)
  did:sol:alice-hospital-a (relationship with Hospital A)
  did:sol:alice-hospital-b (relationship with Hospital B)
  did:sol:alice-research (research participation)
```

Hospital A and Hospital B cannot correlate Alice's identities without her consent.

(For full cryptographic implementation details, see the **BioVault Internal Security & Infrastructure Reference** - restricted access.)

---

### 4.5 Capability Tokens

**Purpose**: Efficient access after consent verification

After successful on-chain consent check (which incurs ~400ms blockchain latency), the system issues short-lived capability tokens. These tokens enable subsequent API requests to validate authorization locally (~10ms) without repeated blockchain queries, dramatically improving performance for bulk operations.

**Token Lifecycle**:

```mermaid
stateDiagram-v2
    [*] --> Requested: Accessor requests access
    Requested --> Evaluating: Check consent on-chain
    Evaluating --> Issued: Consent valid
    Evaluating --> Denied: Consent invalid
    Issued --> Active: Token in use
    Active --> Expired: Lifetime exceeded (1 hour)
    Active --> Revoked: Underlying consent revoked
    Denied --> [*]
    Expired --> [*]
    Revoked --> [*]
```

**Token Structure** (JWT format):

```json
{
  "header": {
    "alg": "EdDSA",
    "typ": "JWT"
  },
  "payload": {
    "iss": "https://gateway.biovault.io",
    "sub": "did:sol:accessor-pubkey",
    "aud": "https://gateway.biovault.io",
    "exp": 1735689600,
    "iat": 1735686000,
    "nbf": 1735686000,
    "jti": "uuid-token-id",
    "scope": {
      "patient": "did:sol:patient-pubkey",
      "resource_types": ["Observation", "DiagnosticReport"],
      "purposes": ["treatment"],
      "actions": ["read"]
    }
  },
  "signature": "..."
}
```

**Token Scope Dimensions**:

- **patient**: Patient DID (which vault)
- **resource_types**: FHIR resources authorized (Observation, Condition, etc.)
- **date_range**: Optional temporal restriction (e.g., "records from last 6 months")
- **purposes**: Access reasons (treatment, research, billing)
- **actions**: Permitted operations (read, write, delete)
- **delegation_depth**: If transitive authorization, depth in chain

**Security Properties**:

- **Cryptographically signed**: EdDSA signature by Gateway; tampering detectable
- **Short-lived**: 1-hour lifetime minimizes compromise window
- **Scoped**: Principle of least privilege; only necessary resources/actions
- **Non-transferable**: Bound to specific accessor DID
- **Revocation reflected**: When token expires, fresh consent check required

**Validation Flow**:

```mermaid
flowchart TD
    A[API Request with Token] --> B{Parse JWT}
    B --> C{Signature Valid?}
    C -->|No| D[Reject: Invalid Signature]
    C -->|Yes| E{Not Expired?}
    E -->|Expired| F[Reject: Token Expired]
    E -->|Valid| G{Scope Matches Request?}
    G -->|No| H[Reject: Insufficient Scope]
    G -->|Yes| I[Proceed to Resource Access]
```

**Performance Impact**:

| Scenario                   | Without Tokens       | With Tokens | Improvement                  |
| -------------------------- | -------------------- | ----------- | ---------------------------- |
| Single access              | ~400ms               | ~400ms      | None (initial consent check) |
| 10 accesses                | ~4,000ms             | ~410ms      | 10x faster                   |
| 100 accesses               | ~40,000ms            | ~500ms      | 80x faster                   |
| Bulk export (1000 records) | ~400,000ms (6.6 min) | ~1,200ms    | 330x faster                  |

---

### 4.6 Authentication Patterns

**Pattern 1: Direct DID Authentication**

User signs challenge with private key:

```
1. Client requests authentication
2. Server generates random challenge nonce
3. Client signs challenge with DID key
4. Server verifies signature using DID public key
5. Server issues session token
```

**Pattern 2: Credential-Based Authentication**

User presents verifiable credential:

```
1. Client presents VC + signature over challenge
2. Server verifies VC (issuer, signature, revocation)
3. Server verifies challenge signature
4. Server extracts claims and establishes session
```

**Pattern 3: Delegated Authentication (OAuth 2.0 + DID)**

Third-party app accesses on behalf of user:

```
1. App redirects user to BioVault authorization endpoint
2. User authenticates with DID
3. User approves app's requested scopes
4. BioVault issues access token to app
5. App uses token to access APIs
```

(For signature schemes, nonce generation, and authentication implementation details, see the **BioVault Internal Security & Infrastructure Reference** - restricted access.)

---

**End of Chapter 4**

---

## 5) Data Storage Architecture

### Executive Overview

BioVault stores medical data off-chain using content-addressed decentralized storage. Medical records are encrypted client-side before upload; storage nodes hold only ciphertext. On-chain programs store content identifiers (cryptographic hashes) that serve as pointers to encrypted data. This architecture ensures data sovereignty, censorship resistance, and scalability while maintaining regulatory compliance with data residency requirements.

The storage layer implements a **zero-trust model**: even complete storage compromise exposes only encrypted ciphertext. Patients retain sole decryption capability through client-side key management.

---

### 5.1 Content-Addressed Storage

**Why Content Addressing?**

Traditional location-based storage (URLs) has fundamental limitations:

- **Single points of failure**: Server outage = data unavailable
- **Vendor lock-in**: Migration requires re-referencing all data
- **Censorship vulnerability**: Central authority can remove content
- **No integrity guarantees**: Content can change without detection
- **Scalability bottlenecks**: Single server serves all requests

Content addressing provides:

1. **Immutable References**: Content identified by cryptographic hash (CID); tampering changes identifier
2. **Integrity Verification**: Any node can verify content matches identifier; self-certifying data
3. **Deduplication**: Identical content stored once; saves storage and bandwidth
4. **Efficient Updates**: Only changed portions require new storage; versioning via DAGs
5. **Location Independence**: Data retrievable from any node holding it; censorship-resistant

**Content Identifier (CID) Structure**:

```
CID v1 Format:
<multibase-prefix><multicodec-cid><multicodec-content-type><multihash-algorithm><hash-value>

Example:
bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
  │     │
  │     └─ Hash of content (SHA-256)
  └─ Base32 encoding prefix
```

**CID Properties**:

- Self-describing: Includes hash algorithm and encoding
- Collision-resistant: Cryptographic hash (SHA-256, 2^256 space)
- Deterministic: Same content always produces same CID
- Version-agnostic: CID v0 and v1 both supported

**Trade-offs Analysis**:

| Feature               | Content-Addressed                 | Location-Based              | BioVault Choice                      |
| --------------------- | --------------------------------- | --------------------------- | ------------------------------------ |
| Censorship resistance | High                              | Low                         | Critical for patient sovereignty     |
| Availability          | Variable (depends on pinning)     | High (SLA-backed)           | Mitigated via pinning contracts      |
| Latency               | Variable (distributed)            | Low (CDN-optimized)         | Mitigated via CDN gateways           |
| Integrity             | Guaranteed (cryptographic)        | Manual verification         | Essential for medical data           |
| Mutability            | Immutable (new version = new CID) | Mutable                     | Acceptable (versioning via pointers) |
| Cost                  | Pay for storage + pinning         | Pay for bandwidth + storage | Lower long-term (deduplication)      |

---

### 5.2 Encryption Architecture

**Threat Model**: Untrusted storage operators

Assumptions:

- Storage nodes are potentially adversarial (compromised, coerced, or malicious)
- Network traffic is observable by adversaries
- Storage providers may collude
- Regulatory access to storage infrastructure possible

**Defense**: All data encrypted client-side before any transmission

**Encryption Layers** (detailed):

1. **Master Key Derivation**:
   - Patient's DID keypair derives master encryption key
   - Deterministic derivation: same DID always yields same master key
   - Key stretching applied for additional security
   - Master key never leaves patient's device in plaintext

2. **Per-Record Symmetric Encryption**:
   - Each medical record encrypted with unique symmetric key
   - Algorithm: AES-256-GCM (authenticated encryption)
   - Unique initialization vector (IV) per record
   - Prevents correlation attacks between records

3. **Envelope Encryption** (key wrapping):
   - Per-record symmetric keys wrapped with master key
   - Enables key rotation without re-encrypting all data
   - Supports future post-quantum migration

4. **On-Chain Key Storage**:
   - Wrapped keys stored on blockchain (not plaintext keys)
   - Content identifiers reference encrypted storage
   - Metadata (file type, size) stored on-chain

**Encryption Flow** (detailed):

```
[Patient Device: Preparation]
  1. Load or derive master encryption key from DID
  2. Generate random symmetric key (256-bit AES key)
  3. Generate random IV (96-bit for GCM)

[Patient Device: Encryption]
  4. Encrypt medical record: ciphertext = AES-GCM(plaintext, symmetric_key, IV)
  5. Compress ciphertext (optional, before upload)
  6. Calculate integrity hash (SHA-256 of ciphertext)

[Upload to Storage]
  7. Upload ciphertext to decentralized storage
  8. Receive content identifier (CID) from storage

[Store Metadata On-Chain]
  9. Wrap symmetric key: wrapped_key = Encrypt(symmetric_key, master_key)
  10. Submit blockchain transaction:
      - Patient DID
      - File CID
      - Wrapped symmetric key
      - IV
      - Metadata (type, size, timestamp)
  11. Blockchain finalizes transaction (~400ms)
```

**Retrieval Flow** (detailed):

```
[Patient Device: Authorization]
  1. Authenticate with DID
  2. Obtain capability token from consent check

[Query Blockchain]
  3. Query for file metadata using CID or patient DID
  4. Retrieve wrapped key, IV, and storage CID

[Patient Device: Key Unwrapping]
  5. Load master encryption key from DID
  6. Unwrap symmetric key: symmetric_key = Decrypt(wrapped_key, master_key)

[Fetch from Storage]
  7. Retrieve encrypted content from storage using CID
  8. Verify content integrity (compare hash)

[Decrypt Locally]
  9. Decrypt content: plaintext = AES-GCM-Decrypt(ciphertext, symmetric_key, IV)
  10. Verify authentication tag (GCM)
  11. Decompress if necessary
  12. Display or process medical record
```

**Key Sharing for Authorized Access**:

When patient grants consent, accessor receives decryption capability:

```
[Patient grants consent to Dr. Smith]
  1. Patient retrieves wrapped symmetric key from blockchain
  2. Patient unwraps key using master key
  3. Patient re-wraps key using Dr. Smith's public key: wrapped_for_smith = Encrypt(symmetric_key, smith_pubkey)
  4. Patient submits consent grant with wrapped key
  5. Dr. Smith queries consent, retrieves wrapped_for_smith
  6. Dr. Smith unwraps using private key: symmetric_key = Decrypt(wrapped_for_smith, smith_privkey)
  7. Dr. Smith retrieves ciphertext from storage
  8. Dr. Smith decrypts locally
```

**Encryption Performance**:

| Operation                  | Latency (1 MB file) | Latency (100 MB file) |
| -------------------------- | ------------------- | --------------------- |
| AES-256-GCM encryption     | ~5ms                | ~500ms                |
| AES-256-GCM decryption     | ~5ms                | ~500ms                |
| Key wrapping (RSA)         | ~2ms                | ~2ms                  |
| Key unwrapping (RSA)       | ~10ms               | ~10ms                 |
| Hash calculation (SHA-256) | ~3ms                | ~300ms                |

(For key derivation functions, security parameters, and complete cryptographic specifications, see the **BioVault Internal Security & Infrastructure Reference** - restricted access.)

---

### 5.3 Storage Organization

**Merkle DAG Structure**:

Large files organized as Merkle Directed Acyclic Graphs (DAGs):

```
                    [Root Block]
                    CID: Qm...XYZ
                         |
           +-------------+-------------+
           |             |             |
      [Chunk 1]     [Chunk 2]     [Chunk 3]
      CID: Qm...A   CID: Qm...B   CID: Qm...C
         |             |             |
      256 KB        256 KB        128 KB
```

**Properties**:

- **Chunking**: Files split into fixed-size chunks (typically 256 KB)
- **Hashing**: Each chunk cryptographically hashed (SHA-256)
- **Linking**: Root block contains CIDs of all chunks
- **Root CID**: Single identifier for entire file
- **Efficient Updates**: Modify only changed chunks; other chunks reused
- **Partial Retrieval**: Download only required chunks (e.g., thumbnail without full image)
- **Selective Disclosure**: Share specific chunks without entire file

**Example: Large DICOM Image (500 MB)**

```
500 MB DICOM scan
  → Split into 1,954 chunks (256 KB each)
  → Each chunk encrypted separately
  → Merkle tree with 1,954 leaves
  → Root CID stored on-chain
  → Update single slice: re-encrypt one chunk, update root
```

**Versioning via DAGs**:

```
Original File (v1)          Modified File (v2)
CID: Qm...AAA               CID: Qm...BBB
      |                            |
    [Root]                      [Root]
   /  |  \                     /  |  \
  C1  C2  C3  ----reuse----  C1' C2  C3'
                                 (modified chunks)
```

Version 0.1.3 reuses unchanged chunks (C2) and creates new chunks (C1', C3') for modifications. Storage efficiency via deduplication.

**Replication Strategy**:

| Data Tier     | Access Pattern                  | Replication            | Geographic Distribution                         | Cost per GB/month |
| ------------- | ------------------------------- | ---------------------- | ----------------------------------------------- | ----------------- |
| **Hot Data**  | Recent records, frequent access | 5x replicas            | 5 regions (US-East, US-West, EU, Asia, Oceania) | $0.10             |
| **Warm Data** | Intermediate access             | 3x replicas            | 3 regions (US, EU, Asia)                        | $0.05             |
| **Cold Data** | Archival, rare access           | 2x replicas + 1 backup | 2 regions + cold storage                        | $0.02             |

**Automatic Tiering**:

- Files accessed frequently (>5 times/month) promoted to Hot
- Files not accessed for 6 months demoted to Warm
- Files not accessed for 2 years demoted to Cold
- Patient can manually override tier assignments

---

### 5.4 Availability Guarantees

**Pinning Services**:

BioVault contracts with multiple storage providers to ensure data availability:

| Provider Type                 | Examples                 | SLA           | Cost Model           |
| ----------------------------- | ------------------------ | ------------- | -------------------- |
| **Commercial IPFS**           | Pinata, Infura, Filebase | 99.9% uptime  | Per-GB + bandwidth   |
| **Decentralized Storage**     | Filecoin, Arweave, Storj | 99.5% uptime  | Proof-of-replication |
| **BioVault Foundation Nodes** | Self-operated            | 99.95% uptime | Operational costs    |
| **Institutional Partners**    | Hospital-operated        | 99.9% uptime  | Consortium agreement |

**Pinning Contract Terms**:

- Minimum 3x replication per object
- Geographic distribution across independent providers
- 99.9% availability SLA
- Continuous health monitoring (heartbeat every 60 seconds)
- Automatic re-pinning if provider goes offline
- Data integrity verification (monthly hash checks)

**Redundancy Model**:

```
┌─────────────────────────────────────────────────┐
│  Primary Storage Layer (Commercial Providers)   │
│  - Pinata (US-East)                             │
│  - Filebase (EU-Central)                        │
│  - Infura (Asia-Pacific)                        │
└─────────────────────────────────────────────────┘
                  ↓ (Backup)
┌─────────────────────────────────────────────────┐
│  Secondary Backup Layer (Decentralized)         │
│  - Filecoin (proof-of-replication)              │
│  - Arweave (permanent storage)                  │
└─────────────────────────────────────────────────┘
                  ↓ (Fallback)
┌─────────────────────────────────────────────────┐
│  Tertiary Layer (Foundation + Partners)         │
│  - BioVault Foundation nodes (3 regions)        │
│  - Partner hospital nodes (opt-in)              │
└─────────────────────────────────────────────────┘
```

**Failover Procedure**:

1. **Detection**: Gateway detects provider unavailable (3 consecutive heartbeat failures)
2. **Alert**: Operations team notified; patient notification queued
3. **Failover**: Requests automatically routed to secondary providers
4. **Re-pinning**: Initiate re-pinning to new provider within 1 hour
5. **Verification**: Verify data integrity via hash comparison
6. **Recovery**: Original provider restored or replaced; replication factor maintained

**Data Loss Prevention**:

- Minimum 3x replication at all times
- If any replica fails integrity check, re-pin from verified copy
- Monthly audit of all pinning contracts
- Annual disaster recovery drills

---

### 5.5 Performance Optimization

**Retrieval Acceleration**:

1. **CDN Gateways**:
   - IPFS HTTP gateways with CDN caching (Cloudflare, Fastly)
   - Edge nodes in 50+ cities worldwide
   - Sub-100ms latency for 95% of requests
   - Cache frequently accessed content (patient dashboards, recent lab results)

2. **Parallel Chunk Fetching**:
   - Large files split into chunks
   - Client requests multiple chunks concurrently
   - Aggregate bandwidth from multiple providers
   - Example: 100 MB file retrieved in ~3 seconds vs ~15 seconds sequential

3. **Client-Side Caching**:
   - Browser caches frequently accessed records
   - Cache expires after 24 hours or patient-triggered invalidation
   - IndexedDB for persistent storage across sessions

4. **Progressive Loading**:
   - Load file metadata first (type, size, timestamp)
   - Display thumbnail/preview before full content
   - Stream large files (DICOM images, video consultations)
   - User can cancel download mid-stream

5. **Preemptive Prefetching**:
   - Gateway predicts likely next accesses
   - Prefetch related records (e.g., lab results + corresponding imaging)
   - Machine learning model trained on access patterns

**Performance Benchmarks**:

| File Size           | Cold Retrieval (no cache) | Warm Retrieval (CDN cached) | Explanation                       |
| ------------------- | ------------------------- | --------------------------- | --------------------------------- |
| 1 KB (text note)    | ~150ms                    | ~20ms                       | Metadata overhead dominates       |
| 100 KB (lab result) | ~200ms                    | ~30ms                       | Single-chunk retrieval            |
| 1 MB (PDF report)   | ~500ms                    | ~100ms                      | 4 chunks, parallel fetch          |
| 10 MB (X-ray image) | ~2 seconds                | ~400ms                      | 40 chunks, parallelized           |
| 100 MB (CT scan)    | ~8 seconds                | ~2 seconds                  | 400 chunks, streaming             |
| 1 GB (genomic data) | ~60 seconds               | ~20 seconds                 | 4,000 chunks, sustained bandwidth |

**Cost Optimization Strategies**:

1. **Tiered Storage Based on Access Patterns**:
   - Hot tier: SSD-backed, $0.10/GB/month
   - Warm tier: HDD-backed, $0.05/GB/month
   - Cold tier: Archival, $0.02/GB/month
   - Automatic tier transitions based on access frequency

2. **Deduplication**:
   - Identical content stored once, referenced multiple times
   - Common templates (blank forms) shared across patients
   - Savings: 10-15% for typical patient vaults

3. **Compression Before Encryption**:
   - FHIR JSON: ~60% compression ratio (gzip)
   - DICOM images: ~30% compression (lossless)
   - Text documents: ~70% compression
   - Applied before encryption to maximize savings

4. **Automatic Lifecycle Management**:
   - Files transition to cheaper tiers based on age and access
   - Patient configures retention policies
   - Regulatory minimum retention periods enforced automatically

5. **Bandwidth Optimization**:
   - Serve content from nearest geographic node
   - Compress responses (gzip, brotli)
   - HTTP/2 for multiplexed requests
   - Batch small files into single requests

**Storage Cost Model (per patient, per year)**:

| Profile                             | Records       | Total Size | Annual Cost |
| ----------------------------------- | ------------- | ---------- | ----------- |
| Minimal (healthy young adult)       | 20 records    | 50 MB      | $1.20       |
| Typical (average adult)             | 100 records   | 500 MB     | $12.00      |
| High (chronic condition)            | 500 records   | 5 GB       | $120.00     |
| Intensive (cancer patient, imaging) | 2,000 records | 50 GB      | $1,200.00   |

---

### 5.6 Data Residency and Compliance

**Regulatory Requirements**:

Different jurisdictions impose data residency requirements:

| Jurisdiction                | Requirement                     | BioVault Implementation                    |
| --------------------------- | ------------------------------- | ------------------------------------------ |
| **EU (GDPR)**               | Data must remain in EU          | EU-specific storage nodes; no US providers |
| **US (HIPAA)**              | No specific residency           | US-based providers acceptable              |
| **Canada (PIPEDA)**         | Data must remain in Canada      | Canadian storage providers                 |
| **Australia (Privacy Act)** | Preference for domestic storage | Australian nodes available                 |
| **China (PIPL)**            | Data must remain in China       | Not currently supported (Phase 3)          |

**Data Residency Enforcement**:

```
Patient metadata includes:
{
  "patient_did": "did:sol:...",
  "jurisdiction": "EU",
  "storage_policy": {
    "allowed_regions": ["eu-west-1", "eu-central-1"],
    "prohibited_regions": ["us-*", "cn-*"],
    "encryption_required": true,
    "replication_min": 3
  }
}

Storage layer enforces policy:
- Only pin to providers in allowed regions
- Reject attempts to replicate to prohibited regions
- Audit log records all storage operations
```

**Cross-Border Transfer**:

When patient travels or authorizes cross-border access:

1. **Explicit Consent Required**: Patient must explicitly authorize cross-border transfer
2. **Bridge Validation**: Destination instance validates source instance's jurisdiction
3. **Temporary vs. Permanent**: Emergency access fetches temporarily; permanent transfer requires patient approval
4. **Audit Trail**: All cross-border transfers logged immutably

---

**End of Chapter 5**

---

## 6) Consent Management Framework

### Executive Overview

BioVault implements consent as executable code rather than static documents. Consent grants specify who can access what data, for what purpose, and for how long. This chapter presents the consent framework at a conceptual level.

---

### 6.1 Consent Model

**Consent Dimensions**:

- **Subject**: Patient granting consent
- **Principal**: Entity receiving access (physician, researcher, institution)
- **Object**: Data scope (resource types, date ranges, sensitivity levels)
- **Purpose**: Reason for access (treatment, research, billing, emergency)
- **Temporal Bounds**: Start time, expiration, revocation conditions
- **Delegation Rules**: Whether principal can delegate access to others

**Granularity Levels**:

1. **Coarse**: All data for treatment purposes
2. **Moderate**: Specific resource types (lab results only)
3. **Fine**: Individual records with date ranges
4. **Ultra-Fine**: Field-level access (allergies visible, diagnoses hidden)

---

### 6.2 Emergency Override

Break-glass mechanism for life-threatening situations:

**Activation Requirements**:

- Valid emergency responder credential
- Medical justification provided
- Patient incompetent to consent
- Minimal dataset scope (critical information only)

**Post-Event Process**:

- Immediate patient notification
- Immutable audit log entry
- Regulatory review period
- Patient challenge mechanism

---

### 6.3 Consent Lifecycle

**States**:

1. **Proposed**: Accessor requests consent
2. **Active**: Patient grants consent
3. **Expired**: Time-to-live exceeded
4. **Revoked**: Patient withdraws consent
5. **Superseded**: New consent replaces old

**Transitions**:

- Patients can revoke at any time
- Revocation immediate (next block)
- Dependent delegations automatically revoked
- Audit receipts generated for all transitions

---

**End of Chapter 6**

---

## 7) Interoperability Layer

### Executive Overview

BioVault provides native support for healthcare interoperability standards (FHIR R4, DICOM, LOINC, SNOMED CT) to enable seamless integration with existing systems. This chapter presents the interoperability architecture and integration patterns.

---

### 7.1 FHIR R4 Support

**Why FHIR?**

HL7 FHIR (Fast Healthcare Interoperability Resources) is the industry standard for healthcare data exchange. BioVault adopts FHIR R4 to:

- Interoperate with existing EHRs (Epic, Cerner, Allscripts)
- Leverage existing tooling and validation
- Comply with regulatory mandates (ONC 21st Century Cures Act)

**Supported Resources**:

| FHIR Resource     | BioVault Usage                    |
| ----------------- | --------------------------------- |
| Patient           | Patient demographics and identity |
| Observation       | Lab results, vital signs          |
| DiagnosticReport  | Imaging reports, pathology        |
| MedicationRequest | Prescriptions                     |
| Condition         | Diagnoses                         |
| DocumentReference | Clinical notes, images            |
| Consent           | Maps to on-chain consent grants   |
| AuditEvent        | Maps to on-chain audit receipts   |

---

### 7.2 Standards Compliance

**Terminology Standards**:

- **LOINC**: Laboratory results coding
- **SNOMED CT**: Clinical terminology
- **ICD-10**: Diagnosis codes
- **RxNorm**: Medication codes
- **CPT**: Procedure codes

**Imaging Standards**:

- **DICOM**: Digital Imaging and Communications in Medicine
- Content-addressed storage for large imaging files
- DICOM metadata extracted and indexed

**Exchange Standards**:

- **HL7 v2**: Legacy system integration
- **CDA**: Clinical Document Architecture
- **X12**: Insurance claims (EDI)

---

### 7.3 Integration Patterns

**Pattern 1: SMART on FHIR**

Enables third-party applications to access BioVault data with patient authorization:

1. Application registers with BioVault
2. Patient launches application
3. OAuth 2.0 authorization flow
4. Application receives access token
5. Application queries FHIR endpoints
6. All access logged and consent-enforced

**Pattern 2: Bulk Data Export**

For institutional data migration and research:

1. Institution requests bulk export
2. BioVault generates FHIR Bundle
3. Bundle includes only consented patient data
4. Export delivered via secure download link
5. Audit log records bulk access

**Pattern 3: Real-Time Event Streams**

For clinical decision support and monitoring:

1. Subscriber registers webhook URL
2. BioVault sends events (new lab result, medication change)
3. Events delivered in FHIR format
4. Consent verified before each delivery
5. Subscriber acknowledges receipt

---

### 7.4 External System Integration

**EHR Integration**:

- Bidirectional FHIR adapters
- BioVault as authoritative source or shadow copy
- Sync mechanisms for data consistency
- Conflict resolution strategies

**Laboratory Integration**:

- LOINC-coded result ingestion
- Automated upload with patient consent
- Real-time result delivery
- Quality control verification

**Payer Integration**:

- Claims verification against audit logs
- Fraud detection support
- Cost reporting and analytics
- HIPAA-compliant data access

**Research Portal Integration**:

- Cohort identification queries
- De-identified data extraction
- Privacy-preserving analytics
- Patient compensation distribution

---

**End of Chapter 7**

---

## 8) Auditability and Transparency

### Executive Overview

Every access event produces an immutable audit receipt stored on-chain. These receipts provide transparency for patients, compliance evidence for regulators, and forensic trails for investigations.

---

### 8.1 Audit Architecture

**What Gets Audited**:

- Consent grants and revocations
- Data access (read/write)
- Emergency overrides
- Delegation creation and revocation
- Key rotation events
- System configuration changes

**Audit Receipt Properties**:

- **Immutability**: Cannot be altered after creation
- **Timestamping**: Precise temporal ordering
- **Non-repudiation**: Cryptographically signed
- **Queryability**: Indexed for efficient search
- **Privacy**: Records who/what/when/why, not medical content

---

### 8.2 Patient Access

**Patient Audit Dashboard**:

- Real-time view of all access events
- Filter by date, accessor, purpose
- Export compliance reports
- Challenge inappropriate access
- Download complete audit history

**Notification System**:

- Immediate alerts for emergency access
- Daily/weekly digest of routine access
- Consent expiration warnings
- Unusual access pattern detection

---

### 8.3 Regulatory Access

**Regulator Query Interface**:

- Aggregate compliance metrics
- Pattern analysis (no patient re-identification)
- Breach investigation support
- Regulatory reporting automation

**Compliance Queries** (examples):

- "Show all access to patient X's data in date range"
- "Count consent violations by institution"
- "Identify emergency accesses challenged by patients"
- "Generate HIPAA audit report for jurisdiction"

---

### 8.4 Forensic Capabilities

**Dispute Resolution**:

- Complete evidence chain for legal proceedings
- Cryptographic proof of access events
- Temporal correlation of events
- Actor identification via credentials

**Breach Investigation**:

- Identify scope of unauthorized access
- Trace access patterns and chains
- Determine timeline of events
- Generate incident reports

---

**End of Chapter 8**

---

## 9) Governance Model

### Executive Overview

BioVault employs a multi-sector governance model to balance accountability, decentralization, and regulatory compliance. Validators represent health authorities, academic institutions, NGOs, and governmental entities.

---

### 9.1 Validator Structure

**Four-Pillar Model**:

1. **BioVault Foundation** (25%): Protocol development and maintenance
2. **Healthcare Institutions** (25%): Hospitals, health systems
3. **Governmental/Regulatory** (25%): Health authorities, oversight bodies
4. **Independent/NGO** (25%): Academic institutions, patient advocacy groups

**Byzantine Fault Tolerance**:

- Requires >66% consensus for state changes
- No single sector controls >33% of validators
- Prevents collusion within any sector
- Geographic and jurisdictional diversity

---

### 9.2 Validator Responsibilities

**Core Functions**:

- Validate transactions and state transitions
- Maintain consensus on consent state
- Generate audit receipts
- Participate in governance votes
- Monitor network health

**Accountability Mechanisms**:

- Performance metrics publicly visible
- Slashing for provable misbehavior
- Regular security audits
- Transparent operations logs

---

### 9.3 Protocol Governance

**Governance Scope**:

- Protocol upgrades and parameters
- Validator admission/removal
- Fee structures
- Emergency response procedures
- Standards adoption

**Decision Process**:

1. Proposal submission (any validator)
2. Discussion period (minimum 7 days)
3. Voting period (minimum 3 days)
4. Implementation period (if approved)
5. Audit and verification

---

### 9.4 Evolution Roadmap

**Phase 1** (Current): Foundation-led governance

- Rapid iteration during MVP
- Community feedback incorporated
- Validator onboarding program

**Phase 2** (2026-2027): Shared governance

- Multi-sector validator set activated
- On-chain voting for major changes
- Community proposals accepted

**Phase 3** (2028+): Autonomous governance

- DAO fully operational
- Protocol self-sustaining
- Minimal foundation involvement
- Community-driven development

---

**End of Chapter 9**

---

## 10) Use Cases & Integration Scenarios

### Executive Overview

This chapter presents detailed use cases demonstrating BioVault's capabilities across diverse healthcare scenarios: routine care, emergency access, research participation, cross-border care, and third-party integrations.

---

### 10.1 Use Case 1: Patient Uploads Medical Records

**Scenario**: Alice receives lab results from annual physical and wants to store them in BioVault.

**Actor**: Alice (Patient)

**Flow**:

1. **Authenticate**: Alice opens BioVault mobile app; authenticates with biometric (Face ID) + DID signature
2. **Receive Results**: Alice receives email from lab with PDF attachment
3. **Upload**: Alice taps "Add Document" in app; selects PDF from email
4. **Encryption**: App encrypts PDF client-side using unique symmetric key
5. **Storage**: App uploads encrypted PDF to IPFS; receives CID
6. **On-Chain Registration**: App submits transaction linking Alice's DID to CID with metadata
7. **Confirmation**: Transaction finalizes (~400ms); Alice sees lab results in her vault
8. **Notification**: Alice receives confirmation notification

**Duration**: ~5 seconds (encryption + upload + blockchain finality)

**Security Properties**:

- Lab PDF never transmitted in plaintext
- Storage nodes see only ciphertext
- Only Alice can decrypt (sole key holder)
- Immutable audit receipt generated

---

### 10.2 Use Case 2: Clinician Requests Access

**Scenario**: Dr. Smith needs Alice's cardiac history for treatment.

**Actors**: Alice (Patient), Dr. Smith (Physician)

**Flow**:

1. **Request**: Dr. Smith requests access via BioVault's clinical portal
2. **Notification**: Alice receives push notification: "Dr. Smith requests access to cardiac records for treatment"
3. **Review**: Alice reviews Dr. Smith's credentials (medical license, specialty, hospital affiliation)
4. **Grant Consent**: Alice taps "Approve" with scope: cardiac records only, purpose: treatment, duration: 1 year
5. **On-Chain Grant**: App submits consent grant transaction
6. **Key Sharing**: App re-wraps symmetric keys using Dr. Smith's public key
7. **Access**: Dr. Smith's portal refreshes; cardiac records now visible
8. **Retrieval**: Dr. Smith downloads records; app logs access event
9. **Audit**: Alice sees real-time audit entry: "Dr. Smith accessed cardiac records for treatment"

**Duration**: ~2 seconds (consent grant + key sharing)

**Security Properties**:

- Consent grants scoped (only cardiac records)
- Purpose-specific (treatment only, not research)
- Time-bounded (expires after 1 year)
- Immediately revocable by Alice
- All access logged immutably

---

### 10.3 Use Case 3: Emergency Responder Break-Glass

**Scenario**: Bob is unconscious after car accident; paramedic needs critical medical info.

**Actors**: Bob (Patient), Paramedic (Emergency Responder)

**Flow**:

1. **Scene**: Bob unconscious; paramedic finds BioVault emergency card in Bob's wallet with QR code
2. **Scan**: Paramedic scans QR code with BioVault mobile app
3. **Emergency Access**: App presents emergency access screen
4. **Credential**: Paramedic authenticates with emergency responder credential
5. **Context**: App captures geolocation (verified proximity to accident scene)
6. **Justification**: Paramedic enters brief justification: "Unconscious trauma patient, checking allergies before administering medication"
7. **Verification**: System verifies:
   - Valid emergency credential
   - Timestamp fresh (<5 minutes)
   - Justification provided
   - Geolocation plausible
8. **Access Granted**: System returns Bob's emergency profile:
   - Blood type: O+
   - Drug allergies: Penicillin (severe)
   - Current medications: None
   - Medical conditions: None
9. **Notification**: Bob's emergency contact receives SMS: "Emergency access to Bob's medical data at [location] at [time]"
10. **Audit**: Immutable audit log records access with full details
11. **Post-Event**: When Bob recovers, he reviews emergency access in audit log; can challenge if inappropriate

**Duration**: ~5 seconds (credential verification + minimal dataset retrieval)

**Lives Saved**: Paramedic avoids administering penicillin-based antibiotic, preventing anaphylaxis

**Security Properties**:

- Minimal dataset only (not full medical history)
- Multi-factor verification (credential + context + justification)
- Patient notified immediately
- Immutable audit trail
- Post-event review process

---

### 10.4 Use Case 4: Research Participation

**Scenario**: Cancer research consortium seeks patients for clinical trial.

**Actors**: Carol (Patient), ResearchOrg (Research Institution)

**Flow**:

1. **Discovery**: Carol sees ad for cancer research study; eligible criteria match her condition
2. **Query**: ResearchOrg submits cohort query to BioVault: "Patients with breast cancer diagnosis, age 40-60, no prior chemotherapy"
3. **Privacy-Preserving Match**: BioVault evaluates query against all patient vaults:
   - Zero-knowledge proof confirms Carol matches without revealing identity
   - Carol's DID added to anonymized result set
4. **Invitation**: Carol receives notification: "You may be eligible for [Study Name]. Learn more?"
5. **Review**: Carol reviews study details, compensation ($500), data sharing scope
6. **Consent**: Carol grants research consent:
   - Scope: Cancer diagnosis, treatment history, genomic data
   - Purpose: Research only
   - Duration: 5 years
   - Compensation: $500
7. **De-Identification**: BioVault creates de-identified export:
   - Replaces Carol's DID with pseudonym (Patient-42)
   - Removes direct identifiers (name, address)
   - Preserves medical data
8. **Data Transfer**: De-identified data sent to ResearchOrg secure portal
9. **Compensation**: Smart contract automatically transfers $500 to Carol's wallet
10. **Ongoing**: Carol can revoke consent anytime; data deleted from study

**Duration**: ~30 seconds (consent grant + de-identification + export)

**Security Properties**:

- Privacy-preserving cohort matching (zero-knowledge)
- Patient controls data sharing
- De-identification before export
- Compensation automated via smart contract
- Revocation supported

---

### 10.5 Use Case 5: Cross-Border Care

**Scenario**: David travels from US to Japan; needs emergency care abroad.

**Actors**: David (Patient), Tokyo Hospital (Healthcare Institution)

**Flow**:

1. **Pre-Travel**: David enables global emergency access in BioVault settings
2. **Emergency**: David experiences chest pain in Tokyo; admitted to hospital
3. **Access Request**: Tokyo Hospital clinician requests David's medical records
4. **Cross-Instance Bridge**: Japan BioVault instance queries US instance via federation bridge
5. **Consent Verification**: US instance verifies David's pre-authorized global emergency access
6. **Credential Check**: Japan instance validates clinician's credentials via trust registry
7. **Data Transfer**: US instance sends encrypted medical records to Japan instance
8. **Decryption**: Tokyo Hospital clinician receives records; decrypts with granted keys
9. **Treatment**: Clinician reviews cardiac history; determines David has prior heart condition; adjusts treatment
10. **Audit**: Both US and Japan instances log cross-border access
11. **Notification**: David receives notification on phone: "Tokyo Hospital accessed your medical records"
12. **Unified Audit**: David later views unified audit trail showing both domestic and international accesses

**Duration**: ~3 seconds (cross-instance bridge + credential verification)

**Lives Saved**: Clinician avoids contraindicated medication based on David's cardiac history

**Security Properties**:

- Patient pre-authorizes cross-border access
- Federation bridge validates both instances
- Credential verification across jurisdictions
- Data remains encrypted in transit
- Audit logs on both instances

---

### 10.6 Use Case 6: Third-Party App Integration

**Scenario**: Emma wants to use a health tracking app that integrates with BioVault.

**Actors**: Emma (Patient), HealthTrackerApp (Third-Party Application)

**Flow**:

1. **Discovery**: Emma installs HealthTrackerApp from app store
2. **Authorization**: App prompts: "Connect to BioVault for comprehensive health insights?"
3. **OAuth Flow**: Emma taps "Connect"; redirected to BioVault authorization page
4. **Review Scopes**: BioVault shows requested permissions:
   - Read: Lab results, vital signs
   - Write: Exercise data
   - Duration: Until revoked
5. **Consent**: Emma taps "Approve"
6. **Token Issuance**: BioVault issues OAuth access token to HealthTrackerApp
7. **API Calls**: App queries BioVault FHIR endpoints:
   - GET /Patient/emma
   - GET /Observation?patient=emma&category=vital-signs
8. **Data Sync**: App imports Emma's lab results and vital signs
9. **Visualization**: App displays trends (cholesterol over time, blood pressure)
10. **Insights**: App generates personalized recommendations based on data
11. **Reverse Sync**: Emma logs exercise in app; app writes back to BioVault:
    - POST /Observation (exercise data)
12. **Audit**: All API calls logged; Emma can review in audit dashboard

**Duration**: ~10 seconds (OAuth flow + initial data sync)

**Security Properties**:

- OAuth 2.0 standard flow
- Granular permission scopes
- Patient reviews and approves requested access
- All API calls logged
- Revocation supported anytime

---

## 11) API Specifications

### Executive Overview

BioVault exposes RESTful and GraphQL APIs for programmatic access. All endpoints require authentication and enforce consent-based authorization. This chapter provides high-level API specifications for integration partners.

---

### 11.1 Authentication

**Mechanism**: OAuth 2.0 + DID-based signatures

**Supported Flows**:

- Authorization Code Flow (for web/mobile apps)
- Client Credentials Flow (for server-to-server)
- DID Authentication Flow (native)

**Endpoints**:

```
POST /oauth/authorize
POST /oauth/token
POST /oauth/revoke
```

**Example: Authorization Code Flow**

```http
# Step 1: Redirect user to authorization endpoint
GET /oauth/authorize?
  client_id=app123&
  response_type=code&
  redirect_uri=https://app.example.com/callback&
  scope=read:Observation read:Condition&
  state=random_state

# Step 2: User approves; redirected to callback with code
GET https://app.example.com/callback?
  code=auth_code_xyz&
  state=random_state

# Step 3: Exchange code for access token
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

client_id=app123&
client_secret=secret456&
grant_type=authorization_code&
code=auth_code_xyz&
redirect_uri=https://app.example.com/callback

# Response
{
  "access_token": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_abc",
  "scope": "read:Observation read:Condition"
}
```

---

### 11.2 FHIR R4 Endpoints

**Base URL**: `https://gateway.biovault.io/fhir/r4`

**Supported Resources**:

| Resource              | Operations        | Description              |
| --------------------- | ----------------- | ------------------------ |
| **Patient**           | GET, POST, PUT    | Patient demographics     |
| **Observation**       | GET, POST         | Lab results, vital signs |
| **Condition**         | GET, POST         | Diagnoses                |
| **MedicationRequest** | GET, POST         | Prescriptions            |
| **DiagnosticReport**  | GET, POST         | Imaging reports          |
| **DocumentReference** | GET, POST         | Clinical notes, PDFs     |
| **Consent**           | GET, POST, DELETE | Consent grants           |
| **AuditEvent**        | GET               | Audit receipts           |

**Example: Retrieve Patient**

```http
GET /fhir/r4/Patient/did:sol:patient123
Authorization: Bearer eyJhbGciOiJFZERTQSI...
Accept: application/fhir+json

# Response
{
  "resourceType": "Patient",
  "id": "did:sol:patient123",
  "identifier": [{
    "system": "https://biovault.io/did",
    "value": "did:sol:patient123"
  }],
  "name": [{
    "use": "official",
    "family": "Smith",
    "given": ["Alice"]
  }],
  "gender": "female",
  "birthDate": "1980-01-15"
}
```

**Example: Create Observation**

```http
POST /fhir/r4/Observation
Authorization: Bearer eyJhbGciOiJFZERTQSI...
Content-Type: application/fhir+json

{
  "resourceType": "Observation",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "vital-signs"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "85354-9",
      "display": "Blood pressure"
    }]
  },
  "subject": {
    "reference": "Patient/did:sol:patient123"
  },
  "effectiveDateTime": "2025-01-15T10:30:00Z",
  "valueQuantity": {
    "value": 120,
    "unit": "mmHg",
    "system": "http://unitsofmeasure.org",
    "code": "mm[Hg]"
  }
}

# Response: 201 Created
Location: /fhir/r4/Observation/obs456
```

**Search Parameters**:

```http
# Search observations by patient
GET /fhir/r4/Observation?patient=did:sol:patient123

# Search by date range
GET /fhir/r4/Observation?patient=did:sol:patient123&date=ge2024-01-01&date=le2024-12-31

# Search by category
GET /fhir/r4/Observation?patient=did:sol:patient123&category=vital-signs

# Include related resources
GET /fhir/r4/Observation?patient=did:sol:patient123&_include=Observation:subject
```

---

### 11.3 BioVault Native API

**Base URL**: `https://gateway.biovault.io/api/v1`

**Vault Operations**:

```http
# Initialize vault
POST /v1/vaults/initialize
Authorization: Bearer ...
Content-Type: application/json

{
  "patient_did": "did:sol:patient123",
  "emergency_profile": {
    "blood_type": "O+",
    "allergies": ["Penicillin"],
    "conditions": [],
    "emergency_contacts": [{"name": "John Doe", "phone": "+1234567890"}]
  }
}

# Response: 201 Created
{
  "vault_id": "vault_abc123",
  "patient_did": "did:sol:patient123",
  "created_at": "2025-01-15T10:00:00Z"
}
```

**File Operations**:

```http
# Register file
POST /v1/files/register
Authorization: Bearer ...
Content-Type: application/json

{
  "patient_did": "did:sol:patient123",
  "cid": "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  "file_type": "application/pdf",
  "size_bytes": 1048576,
  "wrapped_key": "encrypted_symmetric_key_base64",
  "iv": "initialization_vector_base64",
  "tags": ["lab_result", "2024"]
}

# Response: 201 Created

# Retrieve file
GET /v1/files/{cid}
Authorization: Bearer ...

# Response: 200 OK
{
  "cid": "bafybeig...",
  "patient_did": "did:sol:patient123",
  "file_type": "application/pdf",
  "size_bytes": 1048576,
  "wrapped_key": "encrypted_key",
  "iv": "iv",
  "storage_urls": [
    "https://ipfs.io/ipfs/bafybeig...",
    "https://gateway.pinata.cloud/ipfs/bafybeig..."
  ],
  "uploaded_at": "2025-01-15T10:00:00Z"
}
```

**Consent Operations**:

```http
# Grant consent
POST /v1/consents/grant
Authorization: Bearer ...
Content-Type: application/json

{
  "patient_did": "did:sol:patient123",
  "accessor_did": "did:sol:doctor456",
  "scope": {
    "resource_types": ["Observation", "DiagnosticReport"],
    "date_range": {"start": "2020-01-01", "end": "2025-12-31"}
  },
  "purpose": "treatment",
  "duration_days": 365
}

# Response: 201 Created
{
  "consent_id": "consent_xyz",
  "patient_did": "did:sol:patient123",
  "accessor_did": "did:sol:doctor456",
  "expires_at": "2026-01-15T00:00:00Z",
  "transaction_signature": "sig123"
}

# Revoke consent
DELETE /v1/consents/{consent_id}/revoke
Authorization: Bearer ...

# Response: 200 OK
{
  "consent_id": "consent_xyz",
  "revoked_at": "2025-01-15T12:00:00Z"
}

# Evaluate consent
GET /v1/consents/evaluate?patient=did:sol:patient123&accessor=did:sol:doctor456&resource_type=Observation&purpose=treatment
Authorization: Bearer ...

# Response: 200 OK
{
  "authorized": true,
  "consent_id": "consent_xyz",
  "capability_token": "eyJhbGciOiJFZERTQSI...",
  "expires_in": 3600
}
```

**Audit Operations**:

```http
# Query audit log
GET /v1/audit/query?patient=did:sol:patient123&start_date=2025-01-01&end_date=2025-01-31
Authorization: Bearer ...

# Response: 200 OK
{
  "events": [{
    "event_id": "evt_123",
    "event_type": "DataAccessed",
    "timestamp": "2025-01-15T10:30:00Z",
    "actor": "did:sol:doctor456",
    "target": "did:sol:patient123",
    "resource": "bafybeig...",
    "purpose": "treatment",
    "block_height": 1234567
  }],
  "total": 1,
  "page": 1
}
```

---

### 11.4 Rate Limiting

**Default Limits**:

| Endpoint Category  | Rate Limit   | Burst | Window   |
| ------------------ | ------------ | ----- | -------- |
| Authentication     | 10 req/min   | 20    | 1 minute |
| FHIR Read          | 100 req/min  | 200   | 1 minute |
| FHIR Write         | 50 req/min   | 100   | 1 minute |
| File Upload        | 10 files/min | 20    | 1 minute |
| Consent Operations | 30 req/min   | 60    | 1 minute |
| Audit Queries      | 50 req/min   | 100   | 1 minute |

**Rate Limit Headers**:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1610000000
```

**429 Too Many Requests Response**:

```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Please retry after 60 seconds.",
  "retry_after": 60
}
```

---

### 11.5 Error Handling

**Standard Error Response**:

```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "specific_field",
    "reason": "validation_failed"
  },
  "request_id": "req_abc123",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

**Common Error Codes**:

| HTTP Status | Error Code            | Description                       |
| ----------- | --------------------- | --------------------------------- |
| 400         | `invalid_request`     | Malformed request body            |
| 401         | `unauthorized`        | Missing or invalid authentication |
| 403         | `forbidden`           | Insufficient permissions          |
| 404         | `not_found`           | Resource does not exist           |
| 409         | `conflict`            | Resource already exists           |
| 429         | `rate_limit_exceeded` | Too many requests                 |
| 500         | `internal_error`      | Server error                      |
| 503         | `service_unavailable` | Temporary outage                  |

---

## 12) Deployment Models

### Executive Overview

BioVault supports multiple deployment models to accommodate different organizational needs: cloud-hosted SaaS, on-premises deployment, hybrid models, and regional consortia.

---

### 12.1 Cloud-Hosted SaaS (Phase 1)

**Description**: BioVault Foundation operates fully managed infrastructure.

**Architecture**:

```
┌───────────────────────────────────────────────────────┐
│  User Layer                                           │
│  - Mobile Apps (iOS, Android)                         │
│  - Web Portal (React SPA)                             │
└───────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌───────────────────────────────────────────────────────┐
│  CDN / Load Balancer (Cloudflare)                     │
│  - DDoS protection                                     │
│  - TLS termination                                     │
│  - Geographic routing                                  │
└───────────────────────────────────────────────────────┘
                          ↓
┌───────────────────────────────────────────────────────┐
│  API Gateway (Kubernetes)                              │
│  - Authentication / Authorization                      │
│  - Rate limiting                                       │
│  - Request routing                                     │
└───────────────────────────────────────────────────────┘
                          ↓
┌─────────────────┬───────────────┬─────────────────────┐
│ Blockchain      │ Storage       │ Indexer             │
│ (Validators)    │ (IPFS Pinning)│ (PostgreSQL)        │
│ - 7 nodes       │ - Pinata      │ - Event processing  │
│ - Multi-region  │ - Filebase    │ - Query optimization│
└─────────────────┴───────────────┴─────────────────────┘
```

**Pros**:

- Minimal setup for adopters
- Foundation manages infrastructure
- Automatic updates and patches
- Shared validator network (cost-efficient)

**Cons**:

- Trust in Foundation operations
- Limited customization
- Shared infrastructure (noisy neighbor risk)

**Target Users**: Individual patients, small clinics, pilot programs

---

### 12.2 On-Premises Deployment (Phase 2+)

**Description**: Organization operates its own BioVault infrastructure within its data center.

**Requirements**:

| Component          | Minimum Specs                | Recommended Specs            |
| ------------------ | ---------------------------- | ---------------------------- |
| **Validator Node** | 8 CPU, 32 GB RAM, 1 TB SSD   | 16 CPU, 64 GB RAM, 2 TB NVMe |
| **Gateway Server** | 4 CPU, 16 GB RAM, 500 GB SSD | 8 CPU, 32 GB RAM, 1 TB SSD   |
| **Storage Node**   | 8 CPU, 32 GB RAM, 10 TB HDD  | 16 CPU, 64 GB RAM, 50 TB HDD |
| **Indexer/DB**     | 8 CPU, 32 GB RAM, 2 TB SSD   | 16 CPU, 64 GB RAM, 4 TB NVMe |
| **Network**        | 1 Gbps                       | 10 Gbps                      |

**Architecture**:

```
┌────────────────────────────────────────────────────┐
│  Organization Network (On-Premises)                │
│                                                    │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ Validator    │  │ Validator    │             │
│  │ Node 1       │  │ Node 2       │             │
│  └──────────────┘  └──────────────┘             │
│         ↓                  ↓                      │
│  ┌──────────────────────────────────────┐       │
│  │ Internal Network (Secure VLAN)       │       │
│  └──────────────────────────────────────┘       │
│         ↓                                        │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Gateway      │  │ Storage      │            │
│  └──────────────┘  └──────────────┘            │
└────────────────────────────────────────────────────┘
                      ↓
┌────────────────────────────────────────────────────┐
│  External Validator Network (Federated)            │
│  - Connects to other validators globally           │
│  - Participates in consensus                       │
└────────────────────────────────────────────────────┘
```

**Pros**:

- Full control over infrastructure
- Data never leaves premises
- Customizable configuration
- Meets strict regulatory requirements

**Cons**:

- Significant capital expenditure
- Ongoing operational overhead
- Requires dedicated IT staff

**Target Users**: Large health systems, government agencies, high-security environments

---

### 12.3 Hybrid Deployment (Phase 2+)

**Description**: Combination of cloud and on-premises components.

**Example**: Organization operates validator on-premises but uses cloud storage and gateway.

**Architecture**:

```
On-Premises:                Cloud:
┌─────────────┐            ┌─────────────┐
│ Validator   │────────────│ Gateway     │
│ (Local)     │   VPN/VPC  │ (AWS)       │
└─────────────┘            └─────────────┘
                                  ↓
                           ┌─────────────┐
                           │ Storage     │
                           │ (IPFS Cloud)│
                           └─────────────┘
```

**Pros**:

- Balance of control and convenience
- Critical components on-premises
- Leverage cloud scalability for storage

**Cons**:

- Complex network configuration
- VPN/VPC required
- Mixed operational model

**Target Users**: Medium-sized hospitals, regional health networks

---

### 12.4 Regional Consortium (Phase 3)

**Description**: Multiple organizations collaborate to operate shared regional instance.

**Example**: 10 hospitals in California form consortium; each operates 1-2 validators.

**Governance**:

- Consortium board governs operations
- Shared operational costs
- Multi-organization validator set
- Regional data residency

**Pros**:

- Distributed trust (no single operator)
- Cost-sharing among members
- Regional compliance

**Cons**:

- Requires coordination
- Governance complexity

**Target Users**: Regional health information exchanges (HIEs), state health departments

---

## 13) Technical Glossary

### Cryptographic Primitives

**AES-256-GCM (Advanced Encryption Standard with Galois/Counter Mode)**

- **Definition**: Symmetric encryption algorithm using 256-bit keys with authenticated encryption mode
- **Properties**: Provides both confidentiality (encryption) and integrity (authentication tag)
- **BioVault Use**: Encrypts all medical records before off-chain storage
- **Performance**: ~5ms for 1MB file encryption on modern hardware
- **Example**:
  ```
  Input: Medical record JSON (plaintext)
  Key: 256-bit symmetric key (generated per-record)
  IV: 96-bit initialization vector (random, unique per encryption)
  Output: Ciphertext + 128-bit authentication tag
  ```
- **Security Guarantee**: No known practical attacks; post-quantum secure against classical computers
- **Alternative Considered**: ChaCha20-Poly1305 (rejected: less hardware acceleration)

**EdDSA (Edwards-Curve Digital Signature Algorithm)**

- **Definition**: Modern elliptic curve signature scheme using twisted Edwards curves
- **Curve**: Ed25519 (Curve25519 in Edwards form)
- **BioVault Use**: Transaction signing, DID authentication, consent authorization
- **Performance**: ~50μs signing, ~100μs verification
- **Key Properties**:
  - Deterministic signatures (same message + key = same signature)
  - Small signatures (64 bytes)
  - Fast verification
  - Side-channel resistant
- **Example**:
  ```
  Private Key (32 bytes): 0x3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c
  Public Key (32 bytes): 0xfc51cd8e6218a1a38da47ed00230f0580816ed13ba3303ac5deb911548908025
  Message: "grant_consent:did:sol:patient123:did:sol:provider456"
  Signature (64 bytes): 0x92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da...
  ```

**HKDF (HMAC-based Key Derivation Function)**

- **Definition**: Cryptographic function to derive multiple keys from single master secret
- **Standard**: RFC 5869
- **BioVault Use**: Derives encryption keys from DID master key
- **Properties**: One-way (derived key cannot reveal master key), domain separation
- **Example**:
  ```
  Master Key: Patient's DID private key
  Info Context: "biovault.v1.patient.encryption.2025"
  Output: 256-bit AES encryption key (deterministic)
  ```

**Shamir's Secret Sharing (SSS)**

- **Definition**: Cryptographic scheme to split secret into N shares, requiring threshold T to reconstruct
- **BioVault Use**: Emergency key recovery (e.g., 3-of-5 shares)
- **Properties**: Information-theoretic security (fewer than T shares reveal nothing)
- **Example**:
  ```
  Secret: Patient's master encryption key (256 bits)
  Configuration: 3-of-5 threshold
  Shares distributed to:
    - Share 1: Patient's secure hardware wallet
    - Share 2: Patient's family member (encrypted, offline)
    - Share 3: Patient's attorney (escrow)
    - Share 4: BioVault recovery service (encrypted)
    - Share 5: Patient's backup USB drive
  Recovery: Any 3 shares reconstruct master key
  ```
- **Security**: With 2 shares, attacker has 0% information about key

**Zero-Knowledge Proof (ZKP)**

- **Definition**: Cryptographic protocol proving statement truth without revealing underlying data
- **BioVault Use**: Prove patient age >18 without revealing birthdate, prove credential validity without revealing identity
- **Example Use Case**:
  ```
  Statement: "Patient is over 18 years old"
  Private Input: Birthdate = 1985-03-15 (never revealed)
  Public Input: Current date = 2025-02-15
  Proof: ZK-SNARK proof (256 bytes)
  Verifier checks: Proof valid → Patient age >18 (no birthdate exposed)
  ```
- **Algorithms**: zk-SNARKs (Groth16), zk-STARKs, Bulletproofs
- **Performance**: Proving ~200ms, verification ~50ms (age proof example)

---

### Identity & Access Control

**DID (Decentralized Identifier)**

- **Definition**: W3C standard for self-sovereign digital identity without central authority
- **Format**: `did:<method>:<identifier>`
- **BioVault Example**: `did:sol:5tKzmQchzqPZqZdBrD9vAzPvQ8uZh4xG3sF9zJPWjK7A`
- **Components**:
  - `did`: Scheme identifier
  - `sol`: Method (Solana blockchain)
  - `5tKzm...`: Base58-encoded public key
- **DID Document** (retrieved from blockchain):
  ```json
  {
    "id": "did:sol:5tKzmQchzqPZqZdBrD9vAzPvQ8uZh4xG3sF9zJPWjK7A",
    "verificationMethod": [
      {
        "id": "did:sol:5tKzm...#key-1",
        "type": "Ed25519VerificationKey2020",
        "publicKeyMultibase": "z6Mkw..."
      }
    ],
    "authentication": ["#key-1"],
    "service": [
      {
        "id": "#biovault-api",
        "type": "BioVaultAPI",
        "serviceEndpoint": "https://api.biovault.health"
      }
    ]
  }
  ```
- **Use Cases**: Patient identity, provider identity, transaction signing, consent authorization

**VC (Verifiable Credential)**

- **Definition**: Digitally signed attestation of attributes, verifiable without contacting issuer
- **Standard**: W3C Verifiable Credentials Data Model
- **BioVault Example**: Medical license credential
  ```json
  {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential", "MedicalLicenseCredential"],
    "issuer": "did:sol:StateHealthBoard",
    "issuanceDate": "2020-01-01T00:00:00Z",
    "expirationDate": "2026-01-01T00:00:00Z",
    "credentialSubject": {
      "id": "did:sol:Dr-Smith",
      "licenseNumber": "MD-123456",
      "specialty": "Cardiology",
      "state": "California"
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2020-01-01T00:00:00Z",
      "verificationMethod": "did:sol:StateHealthBoard#key-1",
      "proofValue": "z5e3Hj..."
    }
  }
  ```
- **Verification**: Anyone can verify signature using issuer's public key (from DID document)
- **Revocation**: Check on-chain revocation registry (Bloom filter for privacy)

**UCAN (User-Controlled Authorization Network)**

- **Definition**: Capability-based authorization using cryptographically signed tokens
- **BioVault Use**: Delegate access rights (e.g., patient → provider → specialist)
- **Token Structure**:
  ```json
  {
    "iss": "did:sol:patient",
    "aud": "did:sol:provider",
    "att": [
      {
        "with": "biovault://patient123/records/abc",
        "can": "read"
      }
    ],
    "exp": 1735689600,
    "prf": ["parent_ucan_cid"],
    "sig": "z58d..."
  }
  ```
- **Properties**: Offline verification, delegatable, time-bounded, scope-attenuated

---

### Blockchain & Distributed Systems

**BFT (Byzantine Fault Tolerance)**

- **Definition**: Consensus mechanism tolerating arbitrary failures including malicious actors
- **Requirement**: >66% honest validators (>2/3 majority)
- **Byzantine Fault**: Node may send conflicting messages, crash, or act maliciously
- **BioVault Context**: Solana uses Tower BFT (optimized PBFT variant)
- **Example Scenario**:
  ```
  Network: 100 validators
  Malicious: 30 validators (30%)
  Honest: 70 validators (70%)
  Result: Consensus achieved (70% > 66% threshold)
  Safety: Malicious validators cannot forge transactions or double-spend
  ```
- **Trade-off**: Lower throughput than non-BFT systems, but guarantees safety

**PDA (Program Derived Address)**

- **Definition**: Deterministic blockchain account address derived from program ID and seeds
- **Properties**: No private key exists (program controls), deterministic derivation
- **BioVault Use**: Patient consent accounts, medical record metadata storage
- **Derivation**:
  ```rust
  seeds = [
    b"consent",
    patient_did.as_bytes(),
    provider_did.as_bytes()
  ]
  (pda, bump) = Pubkey::find_program_address(&seeds, program_id)
  // Example PDA: 8qbHbw2BbbTHBW1sbeqakYXVKRQM8Ne7pLK7m6CVfeR
  ```
- **Security**: Only program can sign transactions from PDA (prevents unauthorized access)
- **Example Use**: Consent record at PDA derived from patient+provider DIDs

**CID (Content Identifier)**

- **Definition**: Cryptographic hash serving as immutable reference to content in decentralized storage
- **Format**: Self-describing (includes hash algorithm, encoding)
- **Structure**:
  ```
  CID v1: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
          │   │
          │   └─ SHA-256 hash of content
          └─ Multibase prefix (base32)
  ```
- **Properties**:
  - Content-addressed (same content = same CID)
  - Tamper-evident (any change = different CID)
  - Collision-resistant (2^256 space for SHA-256)
- **BioVault Example**:
  ```
  File: chest_xray_2025_02_15.dcm (10 MB)
  CID: bafybeif52r2wjqvzqc5vdhqg7w6h5k3d8k3pqvzqc5vdhqg7w6h5k3d8k3p
  Storage: IPFS nodes replicate encrypted file
  On-chain: Consent record stores CID as pointer
  Retrieval: Query IPFS using CID → retrieve encrypted file
  ```

**Merkle DAG (Directed Acyclic Graph)**

- **Definition**: Data structure where nodes are cryptographically linked via hashes
- **Properties**: Efficient versioning, deduplication, tamper-evident history
- **BioVault Use**: Large file chunking, versioned medical records
- **Structure Example**:
  ```
  [Root Block: bafyRootXYZ]
         |
    +----+----+
    |    |    |
  [Chunk1] [Chunk2] [Chunk3]
  (256KB)  (256KB)  (128KB)
  ```
- **Advantages**:
  - Incremental updates (only changed chunks re-uploaded)
  - Deduplication (identical chunks stored once)
  - Parallel retrieval (fetch chunks concurrently)
- **Version History**:
  ```
  Version 0.1.3: CID_v1 → [Chunks A, B, C]
  Version 0.1.3: CID_v2 → [Chunks A, B, D] (only chunk D changed)
  Shared storage: Chunks A and B reused
  ```

---

### Healthcare Standards

**FHIR (Fast Healthcare Interoperability Resources)**

- **Definition**: HL7 standard for healthcare data exchange using RESTful APIs and JSON/XML
- **Version**: R4 (BioVault uses FHIR R4)
- **Resource Example**: Patient resource
  ```json
  {
    "resourceType": "Patient",
    "id": "example",
    "identifier": [
      {
        "system": "urn:oid:1.2.36.146.595.217.0.1",
        "value": "12345"
      }
    ],
    "name": [
      {
        "family": "Doe",
        "given": ["John"]
      }
    ],
    "birthDate": "1974-12-25"
  }
  ```
- **BioVault Integration**:
  - Import: Legacy EHR → FHIR → BioVault encrypted storage
  - Export: BioVault → FHIR → external systems
  - Resources: Patient, Observation, MedicationRequest, DiagnosticReport, Immunization

**DICOM (Digital Imaging and Communications in Medicine)**

- **Definition**: Standard for medical imaging storage, transmission, and visualization
- **File Structure**: Binary format with metadata tags
- **BioVault Handling**:
  ```
  Input: chest_ct.dcm (500 MB DICOM file)
  Process:
    1. Parse DICOM metadata (patient ID, study date, modality)
    2. Extract image data (pixel arrays)
    3. Encrypt file with AES-256-GCM
    4. Upload to IPFS (chunked as Merkle DAG)
    5. Store CID + metadata on-chain
  Retrieval:
    1. Query on-chain for CID
    2. Fetch encrypted DICOM from IPFS
    3. Decrypt locally
    4. Render in DICOM viewer
  ```
- **Metadata Privacy**: Patient identifiers stripped before storage (de-identification)

**SNOMED CT (Systematized Nomenclature of Medicine -- Clinical Terms)**

- **Definition**: Comprehensive clinical terminology with hierarchical relationships
- **Example Concept**:
  ```
  Concept ID: 22298006
  Term: "Myocardial infarction" (heart attack)
  Parent: 410429000 ("Cardiac disorder")
  Synonym: "Heart attack", "MI", "Acute MI"
  ```
- **BioVault Use**: Standardize diagnosis codes, enable semantic search
  - Query: "Show all patients with cardiovascular disease"
  - System: Searches SNOMED CT hierarchy (includes MI, angina, arrhythmia, etc.)

---

### Performance & Infrastructure

**IPFS (InterPlanetary File System)**

- **Definition**: Content-addressed, peer-to-peer file storage network
- **Properties**: Decentralized, censorship-resistant, deduplication
- **BioVault Deployment**:
  ```
  Architecture: Private IPFS cluster + public gateways
  Nodes: 20 dedicated pinning nodes (geographically distributed)
  Replication: 3x minimum (each file pinned on 3 nodes)
  Performance:
    - Upload: 10-50 MB/s (depending on file size)
    - Download: 20-100 MB/s (parallel retrieval from multiple nodes)
    - Availability: 99.9% (redundancy + monitoring)
  ```
- **Pinning**: Ensures content persists (not garbage collected)
- **Gateway**: HTTP interface for legacy systems (https://ipfs.io/ipfs/<CID>)

**TPS (Transactions Per Second)**

- **Definition**: Measure of blockchain throughput
- **Solana Theoretical**: 65,000 TPS (lab conditions)
- **Solana Actual**: 2,000-4,000 TPS (mainnet, sustained)
- **BioVault Requirement**: 500 TPS (peak load: 10 million patients, 50 transactions/patient/year)
- **Transaction Types**:
  - Consent grant: ~250 bytes
  - Consent revoke: ~150 bytes
  - Record upload: ~500 bytes (metadata only, file off-chain)
  - Audit log: ~200 bytes

---

### Security Terminology

**Timelock**

- **Definition**: Cryptographic or protocol-level delay before action execution
- **BioVault Use**: Consent grants delayed by 24 hours (anti-coercion)
- **Exception**: Emergency access bypasses timelock with justification logging
- **Implementation**:
  ```rust
  pub struct ConsentGrant {
      effective_timestamp: i64,  // Unix timestamp
      grant_timestamp: i64,
      timelock_seconds: i64,     // 86400 (24 hours)
  }
  // Access allowed only if: current_time >= effective_timestamp
  ```

**Replay Attack**

- **Definition**: Adversary intercepts and re-sends valid transaction to duplicate action
- **BioVault Mitigation**:
  - Nonces: Each transaction includes unique, incrementing nonce
  - Timestamps: Transactions expire after 5 minutes
  - Signature: Includes nonce + timestamp in signed payload
- **Example**:
  ```
  Transaction 1: {nonce: 42, timestamp: 1700000000, action: "grant_consent"}
  Attacker intercepts and replays
  Blockchain rejects: Nonce 42 already used for this account
  ```

**Side-Channel Attack**

- **Definition**: Extract secrets by observing physical implementation (timing, power, EM)
- **BioVault Defenses**:
  - Constant-time cryptography (EdDSA, AES-GCM implementations)
  - Secure enclaves for key operations (iOS Secure Enclave, Android StrongBox)
  - Blinding: Add random noise to cryptographic operations
- **Example Threat**: Timing attack measures AES decryption time to infer key bits
- **Mitigation**: Constant-time AES implementation (same execution time regardless of key)

---

## 14) References

### Executive Overview

This chapter provides comprehensive references to standards, specifications, regulatory frameworks, technical resources, and academic research cited throughout this document.

---

### 14.1 Standards and Specifications

**Identity and Credentials**:

- **W3C Decentralized Identifiers (DIDs) v1.0**
  - URL: https://www.w3.org/TR/did-core/
  - Description: Specification for self-sovereign digital identifiers
  - Relevance: Foundation for BioVault identity architecture

- **W3C Verifiable Credentials Data Model 2.0**
  - URL: https://www.w3.org/TR/vc-data-model-2.0/
  - Description: Standard for digitally signed credentials
  - Relevance: Healthcare provider credential verification

- **OAuth 2.0 Authorization Framework (RFC 6749)**
  - URL: https://tools.ietf.org/html/rfc6749
  - Description: Industry-standard authorization protocol
  - Relevance: Third-party app integration

- **OpenID Connect Core 1.0**
  - URL: https://openid.net/specs/openid-connect-core-1_0.html
  - Description: Identity layer on top of OAuth 2.0
  - Relevance: User authentication flows

**Healthcare Interoperability**:

- **HL7 FHIR R4 Specification**
  - URL: https://hl7.org/fhir/R4/
  - Description: Fast Healthcare Interoperability Resources
  - Relevance: Primary data exchange standard

- **SMART on FHIR**
  - URL: https://docs.smarthealthit.org/
  - Description: OAuth-based app integration for FHIR
  - Relevance: Third-party application authorization

- **DICOM Standard (Digital Imaging and Communications in Medicine)**
  - URL: https://www.dicomstandard.org/
  - Description: Medical imaging storage and transmission
  - Relevance: Imaging data handling

- **HL7 Version 0.1.3x**
  - URL: https://www.hl7.org/implement/standards/product_brief.cfm?product_id=185
  - Description: Legacy healthcare messaging standard
  - Relevance: Integration with existing systems

- **CDA (Clinical Document Architecture)**
  - URL: https://www.hl7.org/implement/standards/product_brief.cfm?product_id=7
  - Description: XML-based clinical document markup
  - Relevance: Document exchange compatibility

**Terminology Standards**:

- **LOINC (Logical Observation Identifiers Names and Codes)**
  - URL: https://loinc.org/
  - Description: Universal standard for laboratory and clinical observations
  - Relevance: Lab result coding

- **SNOMED CT (Systematized Nomenclature of Medicine -- Clinical Terms)**
  - URL: https://www.snomed.org/
  - Description: Comprehensive clinical terminology
  - Relevance: Diagnosis and procedure coding

- **ICD-10 (International Classification of Diseases, 10th Revision)**
  - URL: https://www.who.int/standards/classifications/classification-of-diseases
  - Description: Global health condition classification
  - Relevance: Diagnosis coding for billing

- **RxNorm**
  - URL: https://www.nlm.nih.gov/research/umls/rxnorm/
  - Description: Normalized names for clinical drugs
  - Relevance: Medication coding

- **CPT (Current Procedural Terminology)**
  - URL: https://www.ama-assn.org/practice-management/cpt
  - Description: Medical procedure coding system
  - Relevance: Procedure billing codes

**Cryptographic Standards**:

- **NIST FIPS 197: Advanced Encryption Standard (AES)**
  - URL: https://csrc.nist.gov/publications/detail/fips/197/final
  - Description: Symmetric encryption standard
  - Relevance: Data encryption

- **NIST SP 800-38D: Galois/Counter Mode (GCM)**
  - URL: https://csrc.nist.gov/publications/detail/sp/800-38d/final
  - Description: Authenticated encryption mode
  - Relevance: Authenticated encryption implementation

- **RFC 8032: Edwards-Curve Digital Signature Algorithm (EdDSA)**
  - URL: https://tools.ietf.org/html/rfc8032
  - Description: Modern digital signature algorithm
  - Relevance: Transaction signing

- **RFC 7517: JSON Web Key (JWK)**
  - URL: https://tools.ietf.org/html/rfc7517
  - Description: JSON-based cryptographic key representation
  - Relevance: Key management

- **RFC 7519: JSON Web Token (JWT)**
  - URL: https://tools.ietf.org/html/rfc7519
  - Description: Compact token format for authorization
  - Relevance: Capability tokens

**Distributed Systems**:

- **IPFS Specification**
  - URL: https://docs.ipfs.tech/concepts/
  - Description: InterPlanetary File System protocol
  - Relevance: Content-addressed storage

- **Multiformats**
  - URL: https://multiformats.io/
  - Description: Self-describing data formats
  - Relevance: Content identifiers (CIDs)

- **Byzantine Fault Tolerance (PBFT)**
  - URL: Castro, M., & Liskov, B. (1999). Practical Byzantine Fault Tolerance.
  - Description: Consensus algorithm for distributed systems
  - Relevance: Validator consensus mechanism

---

### 14.2 Regulatory Frameworks

**Global Regulations**:

- **GDPR (General Data Protection Regulation)**
  - Jurisdiction: European Union
  - URL: https://gdpr.eu/
  - Key Requirements: Data minimization, right to erasure, consent requirements, data portability
  - BioVault Alignment: Client-side encryption, on-chain consent, audit logs, data export APIs

- **HIPAA (Health Insurance Portability and Accountability Act)**
  - Jurisdiction: United States
  - URL: https://www.hhs.gov/hipaa/
  - Key Requirements: Privacy Rule, Security Rule, Breach Notification Rule
  - BioVault Alignment: Access control, encryption, audit logs, breach detection

- **ISO/IEC 27001:2022 - Information Security Management**
  - Issuer: International Organization for Standardization
  - URL: https://www.iso.org/standard/27001
  - Scope: Comprehensive information security management framework
  - BioVault Alignment: Security controls, risk management, incident response

- **ISO/IEC 27701:2019 - Privacy Information Management**
  - Issuer: International Organization for Standardization
  - URL: https://www.iso.org/standard/71670.html
  - Scope: Extension of 27001 for privacy management
  - BioVault Alignment: Privacy-by-design, data subject rights, consent management

- **ISO/IEC 27017:2015 - Cloud Security**
  - Issuer: International Organization for Standardization
  - URL: https://www.iso.org/standard/43757.html
  - Scope: Cloud-specific security controls
  - BioVault Alignment: Cloud deployment security, SaaS model controls

- **ISO/IEC 27018:2019 - Cloud Privacy**
  - Issuer: International Organization for Standardization
  - URL: https://www.iso.org/standard/76559.html
  - Scope: Privacy protection in cloud services
  - BioVault Alignment: Cloud storage privacy, data residency

**United States Regulations**:

- **21st Century Cures Act (ONC Final Rule)**
  - Issuer: Office of the National Coordinator for Health IT
  - URL: https://www.healthit.gov/cures/
  - Key Requirements: Information blocking prevention, API access, standardized formats
  - BioVault Alignment: FHIR R4 APIs, patient data access, no blocking policies

- **FDA 21 CFR Part 11 - Electronic Records and Signatures**
  - Issuer: U.S. Food and Drug Administration
  - URL: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/part-11-electronic-records-electronic-signatures-scope-and-application
  - Scope: Electronic record integrity and authenticity
  - BioVault Alignment: Immutable audit logs, digital signatures, access controls

- **HITECH Act (Health Information Technology for Economic and Clinical Health)**
  - Jurisdiction: United States
  - URL: https://www.hhs.gov/hipaa/for-professionals/special-topics/hitech-act-enforcement-interim-final-rule/
  - Key Requirements: Breach notification, business associate liability, audit controls
  - BioVault Alignment: Breach detection, comprehensive audit trails

**Regional Regulations**:

- **PIPEDA (Personal Information Protection and Electronic Documents Act)**
  - Jurisdiction: Canada
  - URL: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/
  - Key Requirements: Consent, access rights, data breach notification
  - BioVault Alignment: Consent management, audit access, breach protocols

- **Australian Privacy Act 1988**
  - Jurisdiction: Australia
  - URL: https://www.oaic.gov.au/privacy/the-privacy-act
  - Key Requirements: Australian Privacy Principles (APPs), data breach notification
  - BioVault Alignment: Consent framework, audit trails, breach response

- **PIPL (Personal Information Protection Law)**
  - Jurisdiction: China
  - URL: https://www.gov.cn/
  - Key Requirements: Data localization, consent requirements, cross-border transfer restrictions
  - BioVault Alignment: Regional instances (Phase 3), data residency enforcement

- **LGPD (Lei Geral de Proteção de Dados)**
  - Jurisdiction: Brazil
  - URL: https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd
  - Key Requirements: Consent, data subject rights, security measures
  - BioVault Alignment: Consent management, privacy controls, encryption

---

### 14.3 Technical Resources

**Blockchain and Distributed Ledger**:

- **Solana Documentation**
  - URL: https://docs.solana.com/
  - Description: Official Solana blockchain documentation
  - Topics: Validator setup, transaction processing, account model

- **Anchor Framework**
  - URL: https://www.anchor-lang.com/
  - Description: Framework for Solana program development
  - Topics: Program structure, account constraints, testing

- **Solana Program Library (SPL)**
  - URL: https://spl.solana.com/
  - Description: Standard programs for Solana
  - Topics: Token programs, associated accounts

**Decentralized Storage**:

- **IPFS Documentation**
  - URL: https://docs.ipfs.tech/
  - Description: InterPlanetary File System guides and references
  - Topics: Content addressing, pinning, gateways

- **Filecoin Documentation**
  - URL: https://docs.filecoin.io/
  - Description: Decentralized storage network with economic incentives
  - Topics: Storage deals, proof-of-replication, retrieval

- **Arweave Documentation**
  - URL: https://docs.arweave.org/
  - Description: Permanent decentralized storage
  - Topics: Permaweb, storage economics

**Development Frameworks**:

- **TypeScript**
  - URL: https://www.typescriptlang.org/
  - Description: Typed superset of JavaScript
  - Usage: Gateway services, client applications

- **React**
  - URL: https://react.dev/
  - Description: JavaScript library for user interfaces
  - Usage: Web portal frontend

- **React Native**
  - URL: https://reactnative.dev/
  - Description: Framework for native mobile applications
  - Usage: iOS and Android apps

- **PostgreSQL**
  - URL: https://www.postgresql.org/
  - Description: Advanced open-source relational database
  - Usage: Event indexer, query optimization

**Security and Cryptography Libraries**:

- **libsodium**
  - URL: https://libsodium.gitbook.io/
  - Description: Modern, portable cryptographic library
  - Usage: Encryption, key derivation, signatures

- **tweetnacl-js**
  - URL: https://github.com/dchest/tweetnacl-js
  - Description: JavaScript port of TweetNaCl cryptographic library
  - Usage: Client-side cryptography

- **Web Crypto API**
  - URL: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
  - Description: Browser-native cryptographic operations
  - Usage: Client-side encryption in web apps

**BioVault Project Resources**:

- **BioVault GitHub Repository**
  - URL: https://github.com/biovault/biovault
  - Description: Open-source BioVault protocol implementation
  - Contents: Smart contracts, gateway services, client SDKs

- **BioVault Documentation**
  - URL: https://docs.biovault.io/
  - Description: Developer guides and API references
  - Topics: Integration guides, SDK documentation, examples

- **BioVault Community Forum**
  - URL: https://community.biovault.io/
  - Description: Discussion forum for developers and users
  - Topics: Technical support, feature requests, announcements

---

### 14.4 Academic Research

**Blockchain and Healthcare**:

- Azaria, A., Ekblaw, A., Vieira, T., & Lippman, A. (2016). **MedRec: Using Blockchain for Medical Data Access and Permission Management.** In 2016 2nd International Conference on Open and Big Data (OBD) (pp. 25-30). IEEE.
  - Relevance: Early blockchain-based medical record system

- Zhang, P., Schmidt, D. C., White, J., & Lenz, G. (2018). **Blockchain Technology Use Cases in Healthcare.** In Advances in Computers (Vol. 111, pp. 1-41). Elsevier.
  - Relevance: Comprehensive survey of blockchain healthcare applications

- Esposito, C., De Santis, A., Tortora, G., Chang, H., & Choo, K. K. R. (2018). **Blockchain: A Panacea for Healthcare Cloud-Based Data Security and Privacy?** IEEE Cloud Computing, 5(1), 31-37.
  - Relevance: Analysis of blockchain for healthcare data security

**Privacy-Preserving Technologies**:

- Narayanan, A., Bonneau, J., Felten, E., Miller, A., & Goldfeder, S. (2016). **Bitcoin and Cryptocurrency Technologies: A Comprehensive Introduction.** Princeton University Press.
  - Relevance: Foundational cryptographic concepts

- Dwork, C., & Roth, A. (2014). **The Algorithmic Foundations of Differential Privacy.** Foundations and Trends® in Theoretical Computer Science, 9(3–4), 211-407.
  - Relevance: Privacy-preserving analytics foundation

- McMahan, B., Moore, E., Ramage, D., Hampson, S., & y Arcas, B. A. (2017). **Communication-Efficient Learning of Deep Networks from Decentralized Data.** In Artificial Intelligence and Statistics (pp. 1273-1282). PMLR.
  - Relevance: Federated learning for healthcare analytics

**Decentralized Identity**:

- Dunphy, P., & Petitcolas, F. A. (2018). **A First Look at Identity Management Schemes on the Blockchain.** IEEE Security & Privacy, 16(4), 20-29.
  - Relevance: Decentralized identifier architectures

- Stokkink, Q., & Pouwelse, J. (2018). **Deployment of a Blockchain-Based Self-Sovereign Identity.** In 2018 IEEE International Conference on Internet of Things (iThings) (pp. 1336-1342). IEEE.
  - Relevance: Practical self-sovereign identity implementation

**Consent Management**:

- Hasan, H. R., & Salah, K. (2018). **Blockchain-Based Solution for Proof of Delivery of Physical Assets.** In International Conference on Blockchain (pp. 139-152). Springer.
  - Relevance: Immutable proof mechanisms applicable to consent

- Schanzenbach, M., Bramm, G., & Schütte, J. (2018). **reclaimID: Secure, Self-Sovereign Identities using Name Systems and Attribute-Based Encryption.** In 2018 17th IEEE International Conference on Trust, Security and Privacy in Computing and Communications (TrustCom) (pp. 946-957). IEEE.
  - Relevance: Attribute-based encryption for consent delegation

**Healthcare Interoperability**:

- Mandel, J. C., Kreda, D. A., Mandl, K. D., Kohane, I. S., & Ramoni, R. B. (2016). **SMART on FHIR: A Standards-Based, Interoperable Apps Platform for Electronic Health Records.** Journal of the American Medical Informatics Association, 23(5), 899-908.
  - Relevance: FHIR application architecture

- Bender, D., & Sartipi, K. (2013). **HL7 FHIR: An Agile and RESTful Approach to Healthcare Information Exchange.** In Proceedings of the 26th IEEE International Symposium on Computer-Based Medical Systems (pp. 326-331). IEEE.
  - Relevance: FHIR design principles

---

### 14.5 Industry Reports and Whitepapers

- **Gartner: Hype Cycle for Blockchain in Healthcare, 2023**
  - Description: Analysis of blockchain maturity in healthcare sector
  - Relevance: Market positioning and adoption timeline

- **HIMSS: Blockchain in Healthcare Report**
  - URL: https://www.himss.org/resources/blockchain-healthcare
  - Description: Healthcare Information and Management Systems Society analysis
  - Relevance: Industry adoption patterns

- **IEEE: Standards for Blockchain in Healthcare**
  - Description: Emerging technical standards
  - Relevance: Compliance with evolving standards

---

## 15) Document Information

### Version History

| Version | Date       | Changes                            | Author                  |
| ------- | ---------- | ---------------------------------- | ----------------------- |
| 0.1     | 2024-09-01 | Initial draft                      | BioVault Technical Team |
| 0.5     | 2024-11-15 | Added deployment models, use cases | BioVault Technical Team |
| 1.0     | 2025-01-15 | Public release version             | BioVault Technical Team |

### Document Metadata

**Title**: BioVault Technical Architecture - Protocol Architecture and Design Principles

**Version**: 1.0 — Public Release

**Date**: October 25, 2025

**Classification**: PUBLIC TECHNICAL ARCHITECTURE PAPER

**Target Audience**: Healthcare institutions, research partners, technology integrators, regulatory bodies, and technical stakeholders

**License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

- You are free to share and adapt this material with proper attribution
- Derivative works must use the same license
- URL: https://creativecommons.org/licenses/by-sa/4.0/

**Word Count**: ~20,000 words

**Page Count**: ~60 pages (estimated print format)

### Contact Information

**For Implementation Details and Operational Procedures**:

- Email: technical@biovault.foundation
- Technical Support Portal: https://support.biovault.io/

**For Partnership and Integration Inquiries**:

- Email: partnerships@biovault.foundation
- Partnership Portal: https://partners.biovault.io/

**For Regulatory and Compliance Questions**:

- Email: compliance@biovault.foundation
- Compliance Documentation: https://compliance.biovault.io/

**General Inquiries**:

- Website: https://biovault.io/
- Email: info@biovault.foundation
- Twitter: @BioVaultHQ
- LinkedIn: https://linkedin.com/company/biovault

### Legal Disclaimers

**No Warranty**: This document is provided "as is" without warranty of any kind, express or implied. BioVault Foundation makes no representations or warranties regarding the accuracy, completeness, or reliability of the information contained herein.

**Not Medical Advice**: This document describes a technical architecture for health data management. It does not constitute medical advice, diagnosis, or treatment recommendations.

**Regulatory Compliance**: Organizations implementing BioVault must ensure compliance with applicable regulations in their jurisdictions. This document provides guidance but does not guarantee regulatory compliance.

**Subject to Change**: The BioVault protocol and architecture are subject to evolution. Future versions may introduce breaking changes. Consult the official documentation and changelog for updates.

**Security Notice**: For full cryptographic implementation details, key management procedures, security configurations, and operational runbooks, see the **BioVault Internal Security & Infrastructure Reference** (restricted access). Contact technical@biovault.foundation for access authorization.

### Acknowledgments

BioVault is developed by a global community of contributors including healthcare professionals, software engineers, cryptographers, privacy researchers, and patient advocates.

**Core Contributors**:

- BioVault Foundation Technical Team
- Academic Partners: MIT Media Lab, Stanford Medicine, UCSF Digital Health
- Healthcare Partners: [Partner institutions listed under NDA]
- Open Source Community: Contributors on GitHub

**Funding and Support**:

- BioVault Foundation
- National Institutes of Health (NIH) SBIR Grant [pending]
- Patient-Centered Outcomes Research Institute (PCORI) [pending]

**Special Thanks**:

- Early adopter patients and clinicians providing feedback
- Healthcare IT professionals contributing integration insights
- Regulatory experts advising on compliance frameworks
- Open-source maintainers of dependencies

### Revision Requests

To suggest improvements or report errors in this document:

1. Open an issue on GitHub: https://github.com/biovault/docs/issues
2. Email technical@biovault.foundation with subject line "Architecture Doc Feedback"
3. Participate in community discussions: https://community.biovault.io/

All contributions are reviewed by the technical team and incorporated into subsequent versions.

---

## Appendix A: Acronyms and Abbreviations

| Acronym   | Full Form                                                             |
| --------- | --------------------------------------------------------------------- |
| AES       | Advanced Encryption Standard                                          |
| API       | Application Programming Interface                                     |
| BFT       | Byzantine Fault Tolerance                                             |
| CDA       | Clinical Document Architecture                                        |
| CDN       | Content Delivery Network                                              |
| CID       | Content Identifier                                                    |
| CLIA      | Clinical Laboratory Improvement Amendments                            |
| CPT       | Current Procedural Terminology                                        |
| DAO       | Decentralized Autonomous Organization                                 |
| DEA       | Drug Enforcement Administration                                       |
| DICOM     | Digital Imaging and Communications in Medicine                        |
| DID       | Decentralized Identifier                                              |
| DNR       | Do Not Resuscitate                                                    |
| EHR       | Electronic Health Record                                              |
| EMR       | Electronic Medical Record                                             |
| EMT       | Emergency Medical Technician                                          |
| FDA       | Food and Drug Administration                                          |
| FHIR      | Fast Healthcare Interoperability Resources                            |
| GCM       | Galois/Counter Mode                                                   |
| GDPR      | General Data Protection Regulation                                    |
| HIE       | Health Information Exchange                                           |
| HIMSS     | Healthcare Information and Management Systems Society                 |
| HIPAA     | Health Insurance Portability and Accountability Act                   |
| HITECH    | Health Information Technology for Economic and Clinical Health        |
| HL7       | Health Level Seven                                                    |
| HSM       | Hardware Security Module                                              |
| HTTP      | Hypertext Transfer Protocol                                           |
| ICD       | International Classification of Diseases                              |
| IEEE      | Institute of Electrical and Electronics Engineers                     |
| IPFS      | InterPlanetary File System                                            |
| IRB       | Institutional Review Board                                            |
| ISO       | International Organization for Standardization                        |
| IV        | Initialization Vector                                                 |
| JSON      | JavaScript Object Notation                                            |
| JWT       | JSON Web Token                                                        |
| LGPD      | Lei Geral de Proteção de Dados (Brazilian GDPR)                       |
| LOINC     | Logical Observation Identifiers Names and Codes                       |
| MVP       | Minimum Viable Product                                                |
| NDA       | Non-Disclosure Agreement                                              |
| NGO       | Non-Governmental Organization                                         |
| NHS       | National Health Service                                               |
| NIH       | National Institutes of Health                                         |
| NIST      | National Institute of Standards and Technology                        |
| NTP       | Network Time Protocol                                                 |
| OAuth     | Open Authorization                                                    |
| OCSP      | Online Certificate Status Protocol                                    |
| ONC       | Office of the National Coordinator for Health IT                      |
| PDA       | Program Derived Address                                               |
| PDF       | Portable Document Format                                              |
| PHI       | Protected Health Information                                          |
| PIPL      | Personal Information Protection Law (China)                           |
| PIPEDA    | Personal Information Protection and Electronic Documents Act (Canada) |
| REST      | Representational State Transfer                                       |
| RFC       | Request for Comments                                                  |
| SBIR      | Small Business Innovation Research                                    |
| SDK       | Software Development Kit                                              |
| SHA       | Secure Hash Algorithm                                                 |
| SLA       | Service Level Agreement                                               |
| SMS       | Short Message Service                                                 |
| SNOMED CT | Systematized Nomenclature of Medicine -- Clinical Terms               |
| SPL       | Solana Program Library                                                |
| SQL       | Structured Query Language                                             |
| SSD       | Solid-State Drive                                                     |
| SSS       | Shamir's Secret Sharing                                               |
| TLS       | Transport Layer Security                                              |
| TTL       | Time To Live                                                          |
| UCSF      | University of California, San Francisco                               |
| URL       | Uniform Resource Locator                                              |
| US        | United States                                                         |
| VA        | Veterans Affairs                                                      |
| VC        | Verifiable Credential                                                 |
| VLAN      | Virtual Local Area Network                                            |
| VPN       | Virtual Private Network                                               |
| VPC       | Virtual Private Cloud                                                 |
| W3C       | World Wide Web Consortium                                             |
| WHO       | World Health Organization                                             |
| XML       | Extensible Markup Language                                            |
| ZK        | Zero-Knowledge                                                        |

---

**End of Document**

**© 2025 BioVault Foundation. Licensed under CC BY-SA 4.0.**

---
