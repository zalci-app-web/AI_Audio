import { createHmac, timingSafeEqual } from 'crypto'

// A claim is only accepted for a token issued when the share window was opened,
// and not before MIN_AGE_MS has passed (the time it takes to actually post).
export const SHARE_TOKEN_MIN_AGE_MS = 15 * 1000
export const SHARE_TOKEN_MAX_AGE_MS = 60 * 60 * 1000

const getSecret = () => {
    const secret = process.env.SHARE_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!secret) throw new Error('SHARE_TOKEN_SECRET is not set')
    return secret
}

const sign = (userId: string, issuedAt: number) =>
    createHmac('sha256', getSecret()).update(`${userId}.${issuedAt}`).digest('hex')

export function createShareToken(userId: string, now = Date.now()): string {
    return `${now}.${sign(userId, now)}`
}

export function verifyShareToken(
    userId: string,
    token: unknown,
    now = Date.now()
): 'ok' | 'invalid' | 'too_early' | 'expired' {
    if (typeof token !== 'string') return 'invalid'
    const [issuedAtStr, mac] = token.split('.')
    const issuedAt = Number(issuedAtStr)
    if (!mac || !Number.isFinite(issuedAt)) return 'invalid'

    const expected = Buffer.from(sign(userId, issuedAt))
    const actual = Buffer.from(mac)
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return 'invalid'

    const age = now - issuedAt
    if (age < SHARE_TOKEN_MIN_AGE_MS) return 'too_early'
    if (age > SHARE_TOKEN_MAX_AGE_MS) return 'expired'
    return 'ok'
}
