import {
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  forwardRef,
} from 'react'
import { IconSpinner } from './Icon'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

type ButtonElementProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never
  }

type AnchorElementProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string
  }

type ButtonProps = ButtonElementProps | AnchorElementProps

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-cream hover:bg-navy/90 focus-visible:ring-navy',
  secondary: 'bg-emerald text-dark hover:bg-mint focus-visible:ring-emerald',
  outline:
    'border-2 border-navy text-navy bg-transparent hover:bg-navy/5 focus-visible:ring-navy',
  ghost: 'text-navy bg-transparent hover:bg-navy/5 focus-visible:ring-navy',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'

function isAnchorProps(props: ButtonProps): props is AnchorElementProps {
  return 'href' in props && props.href !== undefined
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...rest
  } = props

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  const content = (
    <>
      {isLoading ? (
        <IconSpinner size={20} className="animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </>
  )

  // Render as anchor if href is provided
  if (isAnchorProps(props)) {
    const { href, ...anchorProps } = rest as Omit<
      AnchorElementProps,
      keyof BaseProps
    >
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorProps}
      >
        {content}
      </a>
    )
  }

  // Render as button
  const buttonProps = rest as Omit<ButtonElementProps, keyof BaseProps>
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={isLoading || buttonProps.disabled}
      {...buttonProps}
    >
      {content}
    </button>
  )
})

export default Button
