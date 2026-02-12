import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zalci-audio.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/auth/', '/mypage/', '/library/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
