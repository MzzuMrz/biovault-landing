import { type HTMLAttributes, forwardRef, memo } from 'react'

type CardVariant = 'default' | 'elevated' | 'dark'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hover?: boolean
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border-2 border-navy/10 shadow-sm',
  elevated: 'bg-white/80 shadow-md ring-1 ring-dark/5',
  dark: 'bg-navy/50 backdrop-blur-sm border border-cream/10',
}

const hoverStyles: Record<CardVariant, string> = {
  default: 'hover:-translate-y-1 hover:border-navy/20 hover:shadow-lg',
  elevated: 'hover:-translate-y-1 hover:shadow-xl hover:ring-navy/10',
  dark: 'hover:bg-navy/60',
}

export const Card = memo(
  forwardRef<HTMLDivElement, CardProps>(function Card(
    { variant = 'default', hover = true, className = '', children, ...props },
    ref
  ) {
    const baseStyles = 'group rounded-2xl transition-all duration-300'
    const classes = `${baseStyles} ${variantStyles[variant]} ${hover ? hoverStyles[variant] : ''} ${className}`

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  })
)

export default Card
