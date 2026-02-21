import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/features/ContactForm'
import { getDictionary } from '@/lib/i18n'

export const metadata: Metadata = {
    title: 'お問い合わせ',
    description: 'Zalci Audioへのご質問、ご意見、不具合報告はこちらからお問い合わせください。通常2〜3営業日以内にご返答いたします。',
    alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
    const dict = await getDictionary()

    return (
        <div className="flex min-h-screen flex-col">
            <Header dict={dict.header} notifications={dict.notifications} />
            <main className="flex-1 container max-w-2xl py-12 md:py-24">
                <ContactForm dict={dict.contact} />
            </main>
            <Footer />
        </div>
    )
}
