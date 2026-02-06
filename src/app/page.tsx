import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/features/hero'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* Placeholder for future sections: Features, Pricing, etc. */}
      </main>
      <Footer />
    </div>
  )
}
