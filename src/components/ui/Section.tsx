import { type HTMLAttributes, forwardRef } from 'react'

type SectionBackground = 'cream' | 'navy' | 'dark' | 'cream-alt'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: SectionBackground
  containerSize?: 'sm' | 'md' | 'lg' | 'xl'
}

const backgroundStyles: Record<SectionBackground, string> = {
  cream: 'bg-cream',
  'cream-alt': 'bg-cream/50',
  navy: 'bg-navy',
  dark: 'bg-dark',
}

const containerSizes: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  {
    background = 'cream',
    containerSize = 'lg',
    className = '',
    children,
    ...props
  },
  ref
) {
  return (
    <section
      ref={ref}
      className={`px-6 py-20 md:py-28 ${backgroundStyles[background]} ${className}`}
      {...props}
    >
      <div className={`mx-auto ${containerSizes[containerSize]}`}>
        {children}
      </div>
    </section>
  )
})

interface SectionHeaderProps {
  title: string
  description?: string
  centered?: boolean
  titleId?: string
  dark?: boolean
}

export function SectionHeader({
  title,
  description,
  centered = true,
  titleId,
  dark = false,
}: SectionHeaderProps): React.JSX.Element {
  const textColor = dark ? 'text-cream' : 'text-navy'
  const descColor = dark ? 'text-cream/80' : 'text-dark/70'

  return (
    <header className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''}`}>
      <h2
        id={titleId}
        className={`font-display text-3xl font-bold md:text-4xl lg:text-5xl ${textColor}`}
      >
        {title}
      </h2>
      {description !== undefined && description !== '' && (
        <p className={`mx-auto mt-4 max-w-2xl text-lg ${descColor}`}>
          {description}
        </p>
      )}
    </header>
  )
}

export default Section
