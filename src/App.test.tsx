import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the hero heading', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /your health data belongs to you/i })
    ).toBeInTheDocument()
  })

  it('renders the navigation', () => {
    render(<App />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders the waitlist CTA', () => {
    render(<App />)
    const waitlistButtons = screen.getAllByRole('link', {
      name: /join waitlist/i,
    })
    expect(waitlistButtons.length).toBeGreaterThan(0)
  })
})
