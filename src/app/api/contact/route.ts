import { NextResponse } from 'next/server'
import { getResendClient } from '@/lib/email'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, subject, otherDetail, message } = body

        const subjectMap: Record<string, string> = {
            general: '一般的なご質問',
            bug: '不具合の報告',
            purchase: '購入・決済について',
            request: '機能リクエスト',
            other: 'その他',
        }

        const subjectLabel = subjectMap[subject] || subject

        // Initialize Resend client only when actually sending email
        const resend = getResendClient()
        if (!resend) {
            throw new Error('Email service is not configured')
        }

        // Send email using Resend
        await resend.emails.send({
            from: 'Zalci Audio Contact <onboarding@resend.dev>',
            to: 'zalciapp@gmail.com',
            subject: `【Zalci Audio】お問い合わせ: ${subjectLabel}`,
            replyTo: email,
            text: `
Zalci Audio ウェブサイトから新しいお問い合わせがありました。

【お問い合わせ内容】
${subjectLabel}${otherDetail ? ` (${otherDetail})` : ''}

【送信元メールアドレス】
${email}

【詳細内容】
${message}
`,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
