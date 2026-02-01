# BioVault Landing Page - Project Context

## What is BioVault?

BioVault is a **sovereign, collaborative Electronic Medical Record (EMR) system** that replaces institutional control with patient ownership. It's not a consumer app or health dashboard—it's a complete EMR (orders, results, medications, allergies, imaging, notes, care plans) re-architected around trust, transparency, and patient dignity.

**Core proposition**: Patients own their health data, and ownership must be cryptographically enforceable, not rhetorically promised.

---

## The Problem BioVault Solves

| Issue                                  | Impact                                                       |
| -------------------------------------- | ------------------------------------------------------------ |
| Medical errors from fragmented records | 250,000+ deaths/year (US)                                    |
| Administrative waste                   | $500 billion/year                                            |
| Healthcare data breaches               | 133M records exposed (2023), $10M avg cost per breach        |
| Healthcare fraud                       | $68-230 billion/year                                         |
| Patient access                         | 60% need multiple logins; most can't access complete history |

**Root cause**: Legacy EMRs were designed for billing and institutional control, not patient sovereignty.

---

## Three Pillars of Sovereignty

### 1. Control (Consent-as-Code)

- Granular, revocable permissions
- Patient decides: who, what, why, how long
- Real-time enforcement via cryptographic mechanisms
- Instant revocation

### 2. Transparency (Immutable Audit Trails)

- Every access produces a signed, timestamped receipt
- Patient-accessible audit logs
- Cannot be edited/deleted by anyone
- Non-repudiable evidence for disputes/audits

### 3. Portability (Data as Sovereign Asset)

- Records travel with patients across providers, borders, systems
- No vendor lock-in
- Standards-compliant exports (FHIR, DICOM)
- Patient controls encryption keys

---

## Technical Foundation

| Technology                                       | Purpose                                     |
| ------------------------------------------------ | ------------------------------------------- |
| Distributed Ledger (Solana-based)                | Immutable consent & audit records           |
| End-to-end Encryption (AES-256-GCM + Curve25519) | Client-side encryption, PQC-ready           |
| FHIR/DICOM/LOINC/SNOMED                          | Healthcare interoperability standards       |
| Verifiable Credentials                           | Trust without bureaucracy                   |
| Zero-Knowledge Proofs                            | Verification without disclosure             |
| Federated Architecture                           | Jurisdictional sovereignty + global interop |

---

## Key Features

- **Granular consent**: Authorize cardiologist for cardiac imaging only, not psych records
- **Delegated access**: Pre-authorize labs, pharmacies, family members with scoped permissions
- **Emergency break-glass**: Verified responders unlock minimal datasets with accountability
- **Privacy-preserving analytics**: Federated learning, differential privacy, no raw data leaves device
- **Cross-border ready**: Mutual recognition frameworks, data residency compliance

---

## Stakeholder Benefits

| Stakeholder     | Benefits                                             |
| --------------- | ---------------------------------------------------- |
| **Patients**    | Dignity, safety, control, portability                |
| **Clinicians**  | Complete histories, reduced liability, less burnout  |
| **Hospitals**   | Compliance-by-construction, no vendor lock-in        |
| **Payers**      | Fraud reduction, faster claim adjudication           |
| **Researchers** | Consented, high-integrity datasets                   |
| **Governments** | Observable accountability, cross-border coordination |

---

## Brand Voice & Messaging

### Tone

- Professional, authoritative, trustworthy
- Technical but accessible
- Morally grounded without being preachy
- Empowering, not fear-mongering

### Key Messages

1. "Your health data belongs to you"
2. "Sovereignty is cryptographically enforced, not promised"
3. "Privacy by design, compliance by construction"
4. "Control without sacrifice"

### Tagline Options (from whitepapers)

- "A Future Where Health Is Truly Yours"
- "Sovereign Health Data Infrastructure"
- "Where Dignity Meets Data"

---

## Target Audiences (for landing page)

1. **Primary**: Healthcare institutions, policymakers, investors
2. **Secondary**: Patients, healthcare professionals, researchers
3. **Tertiary**: Journalists, tech community

---

## Visual Direction & Branding

### Parent Brand

BioVault is part of **bioWORLD** ecosystem. The landing page uses BioVault-specific styling within the bioWORLD design system.

### Logo System

- **Isologo**: "bio" (serif) + hexagonal icon + "WORLD" (spaced caps)
- **Isotipo**: Hexagonal 8-segment node icon (standalone)
- **BioVault variant**: Dark colored icon represents VAULT product

### Color Palette (Design Tokens)

```
BASE COLORS:
--color-cream:       #f6f1e6  (primary background)
--color-gray:        #9eacb9  (muted text, borders)
--color-dark:        #1b2229  (text, dark backgrounds)

PRINCIPAL COLORS:
--color-navy:        #153963  (primary brand)
--color-emerald:     #1fa678  (secondary/CTA)

ACCENT COLORS:
--color-mint:        #7ef2c9  (highlights)
--color-sky:         #5f9dff  (links, info)
--color-terracotta:  #d8854a  (warnings, emphasis)

EXTENDED (for product differentiation):
--color-purple:      #A78BFA
--color-coral:       #F28C8C
--color-gold:        #F4C36A
```

### Product Color Coding

| Product  | Color      | Hex       |
| -------- | ---------- | --------- |
| VAULT    | Dark Navy  | `#1b2229` |
| INSIGHTS | Terracotta | `#d8854a` |
| NUMA     | Emerald    | `#1fa678` |
| BRIDGE   | Sky Blue   | `#5f9dff` |

### Typography

- **Logo/Display**: Redaction (serif) - or fallback: Spectral, Paragon
- **Headings**: Serif font (elegant, trustworthy)
- **Body**: Clean sans-serif (Inter, system-ui)
- **"WORLD" styling**: Wide letter-spacing (0.3em+)

### Design Principles

- Warm cream backgrounds (not clinical white)
- Hexagonal motifs (represents network/nodes)
- Generous whitespace
- Serif + geometric balance (tradition + innovation)
- Subtle gradients using accent colors

---

## Regulatory Compliance

- GDPR (EU)
- HIPAA (US)
- ISO 27001 / 27701
- LGPD (Brazil)

---

## Links & Resources

- Website: https://biovault.health
- License: CC BY-SA 4.0

---

## Development Notes

This is a **landing page** for BioVault. Focus on:

- Clear value proposition
- Problem/solution narrative
- Stakeholder benefits
- Call-to-action (waitlist, contact, learn more)
- Mobile-first, accessible design
- Performance optimized
