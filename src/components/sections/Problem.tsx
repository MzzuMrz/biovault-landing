import { memo } from 'react'
import { useInView, useCountUp } from '@/hooks'
import { Section, SectionHeader, Card } from '@/components/ui'

interface Stat {
  value: string
  numericValue: number
  prefix?: string
  suffix?: string
  label: string
  description: string
}

const stats: Stat[] = [
  {
    value: '250K+',
    numericValue: 250000,
    suffix: '+',
    label: 'Deaths Per Year',
    description:
      'Americans die annually from medical errors rooted in fragmented records',
  },
  {
    value: '$500B',
    numericValue: 500,
    prefix: '$',
    suffix: 'B',
    label: 'Administrative Waste',
    description:
      'Spent annually on billing disputes, verification, and claims reconciliation',
  },
  {
    value: '133M',
    numericValue: 133,
    suffix: 'M',
    label: 'Records Breached',
    description:
      'Patient records exposed in 2023 alone—the worst year on record',
  },
  {
    value: '$230B',
    numericValue: 230,
    prefix: '$',
    suffix: 'B',
    label: 'Healthcare Fraud',
    description:
      'Lost annually to fraud enabled by opaque systems and weak audit trails',
  },
]

interface StatCardProps {
  stat: Stat
}

const StatCard = memo(function StatCard({
  stat,
}: StatCardProps): React.JSX.Element {
  const [ref, isVisible] = useInView({ threshold: 0.3, triggerOnce: true })
  const count = useCountUp(stat.numericValue, {
    duration: 2000,
    start: isVisible,
  })

  const formatNumber = (num: number): string => {
    if (stat.numericValue >= 1000) {
      return num.toLocaleString()
    }
    return num.toString()
  }

  return (
    <Card ref={ref} variant="dark" className="p-8">
      <div
        className="text-cream mb-4 text-4xl font-bold sm:text-5xl"
        aria-label={`${stat.prefix ?? ''}${stat.value} ${stat.label}`}
      >
        <span aria-hidden="true">
          {stat.prefix}
          {formatNumber(count)}
          {stat.suffix}
        </span>
      </div>
      <h3 className="text-mint mb-2 text-lg font-semibold">{stat.label}</h3>
      <p className="text-cream/70 text-sm leading-relaxed">
        {stat.description}
      </p>
    </Card>
  )
})

export function Problem(): React.JSX.Element {
  return (
    <Section id="problem" background="navy" aria-labelledby="problem-heading">
      <SectionHeader
        titleId="problem-heading"
        title="Healthcare Data is Broken"
        description="Legacy EMR systems were designed for billing and institutional control, not patient sovereignty. The consequences are measured in lives and billions."
        dark
        centered
      />

      {/* Stats Grid */}
      <div
        className="grid gap-6 sm:grid-cols-2"
        role="list"
        aria-label="Healthcare data statistics"
      >
        {stats.map((stat) => (
          <div key={stat.label} role="listitem">
            <StatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* Bottom Message */}
      <p className="text-mint mt-12 text-center text-lg font-medium">
        These aren&apos;t bugs to be patched. They&apos;re architectural
        failures demanding a new foundation.
      </p>
    </Section>
  )
}

export default Problem
