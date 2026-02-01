import {
  Section,
  SectionHeader,
  Card,
  IconHexagon,
  IconCheck,
} from '@/components/ui'

interface Pillar {
  id: string
  title: string
  subtitle: string
  points: string[]
}

const pillars: Pillar[] = [
  {
    id: 'control',
    title: 'Control',
    subtitle: 'Consent-as-Code',
    points: [
      'Granular, revocable permissions',
      'Patient decides: who, what, why, how long',
      'Real-time cryptographic enforcement',
      'Instant revocation at any time',
    ],
  },
  {
    id: 'transparency',
    title: 'Transparency',
    subtitle: 'Immutable Audit Trails',
    points: [
      'Every access produces a signed, timestamped receipt',
      'Patient-accessible audit logs',
      'Cannot be edited or deleted by anyone',
      'Non-repudiable evidence for disputes and audits',
    ],
  },
  {
    id: 'portability',
    title: 'Portability',
    subtitle: 'Data as Sovereign Asset',
    points: [
      'Records travel with patients across providers, borders, systems',
      'No vendor lock-in',
      'Standards-compliant exports (FHIR, DICOM)',
      'Patient controls encryption keys',
    ],
  },
]

export function Pillars(): React.JSX.Element {
  return (
    <Section id="solution" background="cream" aria-labelledby="pillars-heading">
      {/* Hexagon decoration */}
      <div className="mb-4 flex justify-center" aria-hidden="true">
        <IconHexagon className="text-navy/20 h-12 w-12" />
      </div>

      <SectionHeader
        titleId="pillars-heading"
        title="Three Pillars of Sovereignty"
        description="BioVault's architecture is built on three foundational principles that ensure your health data remains truly yours—cryptographically enforced, not just promised."
        centered
      />

      {/* Pillars Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar, index) => (
          <article key={pillar.id}>
            <Card variant="elevated" className="flex h-full flex-col p-8">
              {/* Header with number */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative" aria-hidden="true">
                  <IconHexagon className="text-navy/10 group-hover:text-navy/20 h-14 w-14 transition-colors duration-300" />
                  <span className="font-display text-navy absolute inset-0 flex items-center justify-center text-xl font-bold">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-navy text-2xl font-bold">
                    {pillar.title}
                  </h3>
                  <p className="text-emerald text-sm font-medium">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>

              {/* Points */}
              <ul
                className="flex-1 space-y-3"
                aria-label={`${pillar.title} features`}
              >
                {pillar.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-3">
                    <IconCheck
                      className="text-emerald mt-0.5 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-dark/80 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </article>
        ))}
      </div>
    </Section>
  )
}

export default Pillars
