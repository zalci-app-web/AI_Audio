'use client'

import { useState } from 'react'
import { dictionaries } from '@/lib/dictionaries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function ContactPage() {
    // Ideally we would detect locale, but for now defaulting to 'ja' as per assumption
    const dict = dictionaries['ja']

    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [otherDetail, setOtherDetail] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setStatus('idle')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    subject,
                    otherDetail: subject === 'other' ? otherDetail : undefined,
                    message,
                }),
            })

            if (!res.ok) throw new Error('Failed to send')

            setStatus('success')
            setEmail('')
            setSubject('')
            setOtherDetail('')
            setMessage('')
        } catch (error) {
            console.error(error)
            setStatus('error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header dict={dict.header} notifications={dict.notifications} />
            <main className="flex-1 container max-w-2xl py-12 md:py-24">
                <div className="space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            {dict.contact.title}
                        </h1>
                        <p className="text-muted-foreground">
                            {dict.contact.description}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                {dict.contact.form.email} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@zalci.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">
                                {dict.contact.form.subject} <span className="text-red-500">*</span>
                            </Label>
                            <Select value={subject} onValueChange={setSubject} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={dict.contact.form.subject} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">{dict.contact.form.subjectOptions.general}</SelectItem>
                                    <SelectItem value="bug">{dict.contact.form.subjectOptions.bug}</SelectItem>
                                    <SelectItem value="purchase">{dict.contact.form.subjectOptions.purchase}</SelectItem>
                                    <SelectItem value="request">{dict.contact.form.subjectOptions.request}</SelectItem>
                                    <SelectItem value="other">{dict.contact.form.subjectOptions.other}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {subject === 'other' && (
                            <div className="space-y-2">
                                <Label htmlFor="otherDetail">
                                    {dict.contact.form.otherDetail}
                                </Label>
                                <Input
                                    id="otherDetail"
                                    value={otherDetail}
                                    onChange={(e) => setOtherDetail(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="message">
                                {dict.contact.form.message} <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="message"
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="min-h-[150px]"
                            />
                        </div>

                        {status === 'success' && (
                            <div className="p-4 rounded-md bg-green-500/10 text-green-500 text-sm">
                                {dict.contact.form.success}
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="p-4 rounded-md bg-red-500/10 text-red-500 text-sm">
                                {dict.contact.form.error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? dict.contact.form.sending : dict.contact.form.submit}
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}
