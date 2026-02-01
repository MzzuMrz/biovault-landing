import { Header, Footer } from '@/components/layout'
import {
  Hero,
  Problem,
  Pillars,
  Features,
  Stakeholders,
  CTA,
} from '@/components/sections'

function App(): React.JSX.Element {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Problem />
        <Pillars />
        <Features />
        <Stakeholders />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default App
