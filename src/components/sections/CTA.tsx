import { useState, type ChangeEvent } from 'react'
import { Section, Button, IconCheckCircle, IconSpinner } from '@/components/ui'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function CTA(): React.JSX.Element {
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
    <Section id="contact" background="navy" aria-labelledby="cta-heading">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="cta-heading"
          className="font-display text-cream text-3xl font-bold md:text-4xl lg:text-5xl"
        >
          Ready to Take Control?
        </h2>
        <p className="text-cream/80 mx-auto mt-6 max-w-xl text-lg md:text-xl">
          Join thousands of healthcare professionals and patients building a
          future where health data belongs to those it describes.
        </p>

        {status === 'success' ? (
          <div
            className="bg-emerald/20 text-cream mt-10 rounded-xl p-6"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-center gap-3">
              <IconCheckCircle
                className="text-mint h-6 w-6"
                aria-hidden="true"
              />
              <span className="text-lg font-medium">
                Welcome to the revolution!
              </span>
            </div>
            <p className="text-cream/80 mt-2">
              You&apos;re on the list. We&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10" noValidate>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-center">
              <div className="flex-1 sm:max-w-sm">
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={status === 'loading'}
                  aria-invalid={status === 'error'}
                  aria-describedby={
                    status === 'error' ? 'cta-email-error' : undefined
                  }
                  className={`bg-cream text-dark placeholder:text-gray focus:border-emerald focus:ring-emerald/50 w-full rounded-lg border-2 px-4 py-3 transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
                    status === 'error'
                      ? 'border-terracotta'
                      : 'border-transparent'
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
                id="cta-email-error"
                className="text-terracotta mt-3 text-sm"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
          </form>
        )}

        <p className="text-cream/60 mt-6 text-sm">
          We respect your privacy. Unsubscribe anytime.
        </p>

        {/* Social Proof */}
        <div className="border-cream/10 mt-12 flex flex-wrap items-center justify-center gap-8 border-t pt-8">
          <div className="text-center">
            <p className="text-cream text-2xl font-bold">2,500+</p>
            <p className="text-cream/60 text-sm">On the waitlist</p>
          </div>
          <div className="text-center">
            <p className="text-cream text-2xl font-bold">50+</p>
            <p className="text-cream/60 text-sm">Healthcare orgs interested</p>
          </div>
          <div className="text-center">
            <p className="text-cream text-2xl font-bold">$2.5M</p>
            <p className="text-cream/60 text-sm">Seed funding raised</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default CTA
