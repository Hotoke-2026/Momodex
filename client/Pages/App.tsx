// client/Pages/App.tsx
import { NavBar } from '../components/NavBar'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/home/HeroSection'
import { ConservationSection } from '../components/home/ConservationSection'
import { ObservationForm } from '../components/home/ObservationForm'
import { GamificationSection } from '../components/home/GamificationSection'
import { CallToActionSection } from '../components/home/CallToActionSection'
import '../styles/index.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-(--color-base) text-(--color-text)">
      <NavBar />
      <div className="grow">
        <HeroSection />
        <ConservationSection />
        <ObservationForm />
        <GamificationSection />
        <CallToActionSection />
      </div>
      <Footer />
    </div>
  )
}

export default App
