'use client'

// JSON-LD Structured Data for rich search results
// https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

interface JsonLdProps {
    type: 'WebSite' | 'Organization'
}

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zalci Audio",
    "url": "https://audiostore.zalci.net",
    "description": "AI生成BGMを提供するオーディオ素材ストア。ゲーム、動画、配信向けの高品質なフリーBGMをダウンロードできます。",
    "inLanguage": "ja",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://audiostore.zalci.net/sounds?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
}

const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zalci Audio",
    "url": "https://audiostore.zalci.net",
    "logo": "https://audiostore.zalci.net/favicon.png",
    "description": "AI技術を活用した高品質なBGM・オーディオ素材を提供するストア。",
    "email": "zalciapp@gmail.com",
    "sameAs": [
        "https://x.com/zalciapp"
    ]
}

export function JsonLd({ type }: JsonLdProps) {
    const schema = type === 'WebSite' ? websiteSchema : organizationSchema

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
