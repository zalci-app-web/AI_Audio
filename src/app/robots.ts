import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://audiostore.zalci.net'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/mypage/', '/library/', '/login', '/forgot-password', '/update-password'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
