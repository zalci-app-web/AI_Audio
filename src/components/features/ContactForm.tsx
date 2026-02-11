'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface ContactFormProps {
    dict: any // Ideally type this properly, e.g. typeof dictionaries['en']['contact']
}

export function ContactForm({ dict }: ContactFormProps) {
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
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    {dict.title}
                </h1>
                <p className="text-muted-foreground">
                    {dict.description}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        {dict.form.email} <span className="text-red-500">*</span>
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
                        {dict.form.subject} <span className="text-red-500">*</span>
                    </Label>
                    <Select value={subject} onValueChange={setSubject} required>
                        <SelectTrigger>
                            <SelectValue placeholder={dict.form.subject} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">{dict.form.subjectOptions.general}</SelectItem>
                            <SelectItem value="bug">{dict.form.subjectOptions.bug}</SelectItem>
                            <SelectItem value="purchase">{dict.form.subjectOptions.purchase}</SelectItem>
                            <SelectItem value="request">{dict.form.subjectOptions.request}</SelectItem>
                            <SelectItem value="other">{dict.form.subjectOptions.other}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {subject === 'other' && (
                    <div className="space-y-2">
                        <Label htmlFor="otherDetail">
                            {dict.form.otherDetail}
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
                        {dict.form.message} <span className="text-red-500">*</span>
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
                        {dict.form.success}
                    </div>
                )}

                {status === 'error' && (
                    <div className="p-4 rounded-md bg-red-500/10 text-red-500 text-sm">
                        {dict.form.error}
                    </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? dict.form.sending : dict.form.submit}
                </Button>
            </form>
        </div>
    )
}
