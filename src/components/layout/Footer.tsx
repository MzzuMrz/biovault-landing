import { navLinks, socialLinks } from '@/data/navigation'
import { IconTwitter, IconLinkedIn, IconGitHub } from '@/components/ui'

const iconMap = {
  twitter: IconTwitter,
  linkedin: IconLinkedIn,
  github: IconGitHub,
} as const

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-cream" role="contentinfo">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a
              href="https://biovault.health"
              className="inline-flex items-baseline gap-0.5 text-2xl"
              aria-label="bioWORLD - Visit main site"
            >
              <span className="font-display text-cream font-bold">bio</span>
              <span className="text-gray text-sm font-medium tracking-[0.3em]">
                WORLD
              </span>
            </a>
            <p className="text-gray mt-4 max-w-md text-sm leading-relaxed">
              Sovereign Health Data Infrastructure. Your health data belongs to
              you—cryptographically enforced, not just promised.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-cream text-sm font-semibold tracking-wide uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray hover:text-cream focus:text-cream text-sm transition-colors focus:underline focus:outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h3 className="text-cream text-sm font-semibold tracking-wide uppercase">
              Connect
            </h3>
            <ul className="mt-4 flex gap-4" aria-label="Social media links">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.icon]
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray hover:bg-cream/10 hover:text-cream focus:bg-cream/10 focus:text-cream focus:ring-cream/50 inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus:ring-2 focus:outline-none"
                      aria-label={`Follow us on ${social.label}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                )
              })}
            </ul>
            <a
              href="https://biovault.health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald hover:text-mint focus:text-mint mt-6 inline-block text-sm transition-colors focus:underline focus:outline-none"
            >
              biovault.health
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-gray/20 mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-gray text-sm">
              &copy; {currentYear} BioVault Initiative. All rights reserved.
            </p>
            <p className="text-gray text-sm">
              Published under{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream decoration-gray/50 hover:decoration-cream focus:decoration-cream underline focus:outline-none"
              >
                CC BY-SA 4.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
