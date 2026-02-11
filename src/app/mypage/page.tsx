import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { dictionaries } from '@/lib/dictionaries'
import { AccountSettings } from '@/components/features/AccountSettings'

export default async function MyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Defaulting to JA for now as per project context
    const dict = dictionaries['ja']

    return (
        <div className="flex min-h-screen flex-col">
            <Header dict={dict.header} notifications={dict.notifications} />
            <main className="flex-1 container max-w-2xl py-12 md:py-24">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                            {dict.myPage.title}
                        </h1>
                    </div>

                    <AccountSettings dict={dict.myPage} email={user.email || ''} />
                </div>
            </main>
            <Footer />
        </div>
    )
}
