import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react'
import { Section, SectionHeader, Card, IconCheck } from '@/components/ui'

interface Stakeholder {
  id: string
  label: string
  title: string
  benefits: string[]
  highlight: string
}

const stakeholders: Stakeholder[] = [
  {
    id: 'patients',
    label: 'Patients',
    title: 'Take Control of Your Health Data',
    benefits: [
      'True ownership and dignity over your medical records',
      'Enhanced safety through complete, accurate health histories',
      'Granular control over who accesses what and when',
      'Seamless portability across providers, systems, and borders',
    ],
    highlight: 'Your health data finally belongs to you',
  },
  {
    id: 'clinicians',
    label: 'Clinicians',
    title: 'Practice Medicine, Not Paperwork',
    benefits: [
      'Access complete patient histories instantly',
      'Reduced liability through transparent, auditable records',
      'Less administrative burnout with streamlined workflows',
      'Better clinical decisions with comprehensive data',
    ],
    highlight: 'Focus on care, not documentation',
  },
  {
    id: 'hospitals',
    label: 'Hospitals',
    title: 'Compliance Without Complexity',
    benefits: [
      'Compliance-by-construction for HIPAA, GDPR, and beyond',
      'No vendor lock-in with open standards',
      'True interoperability across systems and networks',
      'Reduced operational costs and legal exposure',
    ],
    highlight: 'Built-in compliance, not bolted-on',
  },
  {
    id: 'payers',
    label: 'Payers',
    title: 'Eliminate Fraud, Accelerate Claims',
    benefits: [
      'Fraud reduction saving $68-230 billion annually',
      'Faster claim adjudication with verified data',
      'Reduced disputes through immutable audit trails',
      'Transparent, verifiable provider credentials',
    ],
    highlight: 'Integrity you can verify, not assume',
  },
  {
    id: 'researchers',
    label: 'Researchers',
    title: 'Research with Integrity',
    benefits: [
      'Access to properly consented, high-integrity datasets',
      'Privacy-preserving analytics protect participants',
      'Verifiable provenance for reproducible research',
      'Streamlined IRB compliance with built-in consent tracking',
    ],
    highlight: 'Ethical data access at scale',
  },
  {
    id: 'governments',
    label: 'Governments',
    title: 'Accountability You Can Trust',
    benefits: [
      'Observable accountability across healthcare systems',
      'Cross-border coordination with jurisdictional sovereignty',
      'Real-time public health insights without privacy compromise',
      'Fraud detection and prevention at national scale',
    ],
    highlight: 'Sovereignty meets transparency',
  },
]

export function Stakeholders(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Focus the active tab when it changes via keyboard
  useEffect(() => {
    tabRefs.current[activeTab]?.focus()
  }, [activeTab])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let newIndex = index
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          newIndex = index === 0 ? stakeholders.length - 1 : index - 1
          break
        case 'ArrowRight':
          event.preventDefault()
          newIndex = index === stakeholders.length - 1 ? 0 : index + 1
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = stakeholders.length - 1
          break
        default:
          return
      }
      setActiveTab(newIndex)
    },
    []
  )

  const activeStakeholder = stakeholders[activeTab]

  return (
    <Section
      id="stakeholders"
      background="cream-alt"
      aria-labelledby="stakeholders-heading"
    >
      <SectionHeader
        titleId="stakeholders-heading"
        title="Benefits for Everyone"
        description="BioVault transforms healthcare for every participant in the ecosystem, from patients to policymakers."
        centered
      />

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Stakeholder benefits"
        className="mb-10 flex flex-wrap justify-center gap-2 lg:mb-14"
      >
        {stakeholders.map((stakeholder, index) => (
          <button
            key={stakeholder.id}
            ref={(el) => {
              if (el !== null) {
                tabRefs.current[index] = el
              }
            }}
            id={`tab-${stakeholder.id}`}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`panel-${stakeholder.id}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => {
              setActiveTab(index)
            }}
            onKeyDown={(e) => {
              handleKeyDown(e, index)
            }}
            className={`focus:ring-navy rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
              activeTab === index
                ? 'bg-navy text-cream shadow-md'
                : 'border-gray/30 text-dark/80 hover:bg-navy/5 hover:text-navy border bg-white'
            }`}
          >
            {stakeholder.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <Card
        id={`panel-${activeStakeholder.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeStakeholder.id}`}
        tabIndex={0}
        variant="elevated"
        className="p-8 lg:p-12"
      >
        <div className="mb-6">
          <p className="text-emerald text-sm font-semibold tracking-wide uppercase">
            {activeStakeholder.label}
          </p>
          <h3 className="text-dark text-xl font-bold lg:text-2xl">
            {activeStakeholder.title}
          </h3>
        </div>

        <ul
          className="mb-8 space-y-4"
          aria-label={`${activeStakeholder.label} benefits`}
        >
          {activeStakeholder.benefits.map((benefit, idx) => (
            <li key={idx} className="text-dark/80 flex items-start gap-3">
              <IconCheck
                className="text-emerald mt-0.5 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="border-emerald from-navy/5 to-emerald/5 rounded-lg border-l-4 bg-gradient-to-r p-4">
          <p className="text-navy font-medium italic">
            &quot;{activeStakeholder.highlight}&quot;
          </p>
        </div>
      </Card>
    </Section>
  )
}

export default Stakeholders
