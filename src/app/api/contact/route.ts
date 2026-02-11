import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, subject, otherDetail, message } = body

        // Here you would integrate with an email service like Resend or SendGrid
        // For now, we just log the inquiry
        console.log('--- New Contact Inquiry ---')
        console.log('Email:', email)
        console.log('Subject:', subject)
        if (otherDetail) console.log('Other Detail:', otherDetail)
        console.log('Message:', message)
        console.log('---------------------------')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
