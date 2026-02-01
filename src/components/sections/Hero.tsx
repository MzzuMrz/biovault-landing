import { useState, type ChangeEvent } from 'react'
import { useReducedMotion } from '@/hooks'
import {
  Button,
  IconCheckCircle,
  IconChevronDown,
  IconSpinner,
} from '@/components/ui'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const trustIndicators = [
  'HIPAA Compliant',
  'GDPR Ready',
  'End-to-End Encrypted',
]

export function Hero(): React.JSX.Element {
  const prefersReducedMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault()

    if (email.trim() === '') {
      setStatus('error')
      setErrorMessage('Please enter your email address.')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    // TODO: Replace with actual API endpoint
    void (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setStatus('success')
        setEmail('')
      } catch {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again.')
      }
    })()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  return (
    <section
      className="bg-cream relative flex min-h-screen items-center justify-center px-6 pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className={`bg-mint/20 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl ${
            !prefersReducedMotion ? 'animate-pulse' : ''
          }`}
          style={{ animationDuration: '4s' }}
        />
        <div
          className={`bg-sky/20 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl ${
            !prefersReducedMotion ? 'animate-pulse' : ''
          }`}
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="bg-navy/5 text-navy mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
          <span
            className="bg-emerald h-2 w-2 rounded-full"
            aria-hidden="true"
          />
          Sovereign Health Data Infrastructure
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="font-display text-dark text-4xl leading-tight font-bold sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your Health Data <span className="text-navy">Belongs to You</span>
        </h1>

        {/* Subheadline */}
        <p className="text-dark/70 mx-auto mt-6 max-w-2xl text-lg sm:text-xl">
          BioVault is a sovereign EMR system that makes patient ownership
          cryptographically enforceable, not just promised. Control who sees
          your records, when, and why.
        </p>

        {/* Email Capture Form - Primary CTA */}
        <div className="mt-10">
          {status === 'success' ? (
            <div
              className="bg-emerald/10 mx-auto max-w-md rounded-xl p-6 text-center"
              role="status"
              aria-live="polite"
            >
              <IconCheckCircle
                className="text-emerald mx-auto h-8 w-8"
                aria-hidden="true"
              />
              <p className="text-dark mt-2 font-medium">
                You&apos;re on the list!
              </p>
              <p className="text-dark/70 mt-1 text-sm">
                We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-md"
              noValidate
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="hero-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="hero-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={status === 'loading'}
                    aria-invalid={status === 'error'}
                    aria-describedby={
                      status === 'error' ? 'hero-email-error' : undefined
                    }
                    className={`text-dark placeholder:text-gray focus:border-navy focus:ring-navy/20 w-full rounded-lg border-2 bg-white px-4 py-3 transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                      status === 'error'
                        ? 'border-terracotta'
                        : 'border-gray/30'
                    }`}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <>
                      <IconSpinner
                        className="h-5 w-5 animate-spin"
                        aria-hidden="true"
                      />
                      Joining...
                    </>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </div>
              {status === 'error' && (
                <p
                  id="hero-email-error"
                  className="text-terracotta mt-2 text-sm"
                  role="alert"
                >
                  {errorMessage}
                </p>
              )}
              <p className="text-dark/50 mt-3 text-xs">
                Join 2,500+ healthcare professionals already on the waitlist
              </p>
            </form>
          )}
        </div>

        {/* Secondary CTA */}
        <div className="mt-6">
          <Button href="#solution" variant="ghost" size="lg">
            Learn How It Works
            <IconChevronDown className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div
          className="text-dark/50 mt-16 flex flex-wrap items-center justify-center gap-6 text-sm"
          aria-label="Trust certifications"
        >
          {trustIndicators.map((indicator) => (
            <span key={indicator} className="flex items-center gap-2">
              <IconCheckCircle
                className="text-emerald h-5 w-5"
                aria-hidden="true"
              />
              {indicator}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 ${
          !prefersReducedMotion ? 'animate-bounce' : ''
        }`}
        aria-hidden="true"
      >
        <IconChevronDown className="text-dark/30 h-6 w-6" />
      </div>
    </section>
  )
}

export default Hero
