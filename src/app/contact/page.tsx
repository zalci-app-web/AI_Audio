import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/features/ContactForm'
import { dictionaries } from '@/lib/dictionaries'

export default function ContactPage() {
    const dict = dictionaries['ja']

    return (
        <div className="flex min-h-screen flex-col">
            <Header dict={dict.header} notifications={dict.notifications} />
            <main className="flex-1 container max-w-2xl py-12 md:py-24">
                <ContactForm />
            </main>
            <Footer />
        </div>
    )
}
