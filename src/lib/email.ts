import { Resend } from 'resend'

export const getResendClient = () => {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        console.warn('RESEND_API_KEY is not configured, skipping email')
        return null
    }
    return new Resend(apiKey)
}

export const sendPurchaseEmail = async (email: string, songTitle: string, isFree: boolean = false) => {
    const resend = getResendClient()
    if (!resend) return

    try {
        await resend.emails.send({
            from: 'Zalci Audio <noreply@zalci.net>',
            to: email,
            subject: '【Zalci Audio】ご購入ありがとうございます',
            html: `
                <h1>ご購入ありがとうございます</h1>
                <p>以下の楽曲の${isFree ? '無料' : ''}購入が完了しました。</p>
                <p><strong>楽曲名: ${songTitle}</strong></p>
                <p>マイページ（ライブラリ）よりダウンロードが可能です。</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/library">ライブラリへ移動</a>
            `
        })
    } catch (error) {
        console.error('Failed to send purchase email:', error)
    }
}
