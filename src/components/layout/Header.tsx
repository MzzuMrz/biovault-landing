import { useState, useEffect, useCallback } from 'react'
import { useIsScrolled } from '@/hooks'
import { navLinks } from '@/data/navigation'
import { Button, IconMenu, IconClose } from '@/components/ui'

export function Header(): React.JSX.Element {
  const isScrolled = useIsScrolled(10)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="focus:bg-navy focus:text-cream focus:ring-emerald sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:ring-2 focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/95 shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a
            href="/"
            className="flex items-baseline gap-0.5 text-2xl"
            aria-label="BioVault - Return to homepage"
          >
            <span className="font-display text-navy font-bold">bio</span>
            <span className="font-display text-emerald font-bold">Vault</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark/70 hover:text-navy focus:text-navy text-sm font-medium transition-colors focus:underline focus:underline-offset-4 focus:outline-none"
              >
                {link.label}
              </a>
            ))}
            <Button href="#contact" size="sm">
              Join Waitlist
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="text-dark hover:bg-navy/5 focus:ring-navy flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none md:hidden"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen)
            }}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <IconClose className="h-6 w-6" aria-hidden="true" />
            ) : (
              <IconMenu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`border-gray/20 bg-cream border-t px-6 py-4 md:hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark/70 hover:text-navy focus:text-navy text-base font-medium transition-colors focus:outline-none"
                onClick={() => {
                  closeMobileMenu()
                }}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            ))}
            <Button
              href="#contact"
              className="mt-2 w-full justify-center"
              onClick={() => {
                closeMobileMenu()
              }}
              tabIndex={isMobileMenuOpen ? 0 : -1}
            >
              Join Waitlist
            </Button>
          </nav>
        </div>
      </header>
    </>
  )
}

export default Header
