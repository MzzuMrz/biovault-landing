export interface NavLink {
  label: string
  href: string
}

export const navLinks: NavLink[] = [
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Features', href: '#features' },
  { label: 'Stakeholders', href: '#stakeholders' },
  { label: 'Contact', href: '#contact' },
]

export interface SocialLink {
  label: string
  href: string
  icon: 'twitter' | 'linkedin' | 'github'
}

export const socialLinks: SocialLink[] = [
  { label: 'Twitter', href: 'https://twitter.com/biovault', icon: 'twitter' },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/biovault',
    icon: 'linkedin',
  },
  { label: 'GitHub', href: 'https://github.com/biovault', icon: 'github' },
]
