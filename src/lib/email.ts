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
            subject: '【Zalci Audio】ご購入ありがとうございます / Thank you for your purchase',
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2>ご購入ありがとうございます</h2>
                    <p>以下の楽曲の${isFree ? '無料' : ''}購入が完了しました。</p>
                    <p><strong>楽曲名: ${songTitle}</strong></p>
                    <p>マイページ（ライブラリ）よりダウンロードが可能です。</p>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/library" style="display: inline-block; margin-top: 10px; margin-bottom: 30px; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">ライブラリへ移動</a>
                    
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin-bottom: 30px;" />

                    <h2>Thank you for your purchase</h2>
                    <p>Your ${isFree ? 'free ' : ''}purchase for the following track is complete.</p>
                    <p><strong>Track Name: ${songTitle}</strong></p>
                    <p>You can download your asset from your Library.</p>
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL}/library" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Library</a>
                </div>
            `
        })
    } catch (error) {
        console.error('Failed to send purchase email:', error)
    }
}
