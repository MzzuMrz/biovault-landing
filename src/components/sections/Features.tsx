import type { ComponentType, SVGProps } from 'react'
import {
  Section,
  SectionHeader,
  Card,
  IconShield,
  IconUsers,
  IconBolt,
  IconLock,
  IconGlobe,
  IconClipboardCheck,
} from '@/components/ui'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

interface Feature {
  icon: IconComponent
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: IconShield,
    title: 'Granular Consent',
    description:
      'Authorize cardiologist for cardiac imaging only, not psych records. Fine-grained permissions you control.',
  },
  {
    icon: IconUsers,
    title: 'Delegated Access',
    description:
      'Pre-authorize labs, pharmacies, family members with scoped permissions and time-limited access.',
  },
  {
    icon: IconBolt,
    title: 'Emergency Break-Glass',
    description:
      'Verified responders unlock minimal datasets with full accountability. Safety without compromising sovereignty.',
  },
  {
    icon: IconLock,
    title: 'Privacy-Preserving Analytics',
    description:
      'Federated learning and differential privacy ensure no raw data ever leaves your device.',
  },
  {
    icon: IconGlobe,
    title: 'Cross-Border Ready',
    description:
      'Mutual recognition frameworks and data residency compliance. Your records travel with you globally.',
  },
  {
    icon: IconClipboardCheck,
    title: 'Compliance by Construction',
    description:
      'GDPR, HIPAA, ISO 27001/27701 built-in from day one. Not a checkbox—an architecture.',
  },
]

export function Features(): React.JSX.Element {
  return (
    <Section
      id="features"
      background="cream"
      aria-labelledby="features-heading"
    >
      <SectionHeader
        titleId="features-heading"
        title="Built for Real Healthcare"
        description="Sovereignty is cryptographically enforced, not rhetorically promised. Every feature designed for clinical reality."
        centered
      />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <li key={feature.title}>
              <Card variant="elevated" className="h-full p-6">
                <div
                  className="bg-navy/5 text-navy group-hover:bg-navy group-hover:text-cream mb-4 inline-flex rounded-xl p-3 transition-colors duration-300"
                  aria-hidden="true"
                >
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-display text-dark mb-2 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-dark/70 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export default Features
