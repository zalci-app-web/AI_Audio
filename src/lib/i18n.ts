import { headers } from 'next/headers'

type Locale = 'en' | 'ja'

const dictionaries = {
    en: {
        hero: {
            title: 'AI Generated Music',
            subtitle: 'Premium royalty-free tracks for your projects',
        },
        featured: {
            title: 'Featured Tracks',
            description: 'Discover our latest AI-generated masterpieces. High-quality audio tracks ready for your next project.',
        },
        empty: 'No songs available at the moment.',
        card: {
            buyNow: 'Buy Now',
            processing: 'Processing...',
            error: 'Something went wrong. Please try again.',
        },
    },
    ja: {
        hero: {
            title: 'AI生成音楽',
            subtitle: 'プロジェクトに最適なロイヤリティフリー楽曲',
        },
        featured: {
            title: '注目トラック',
            description: '最新のAI生成傑作をご覧ください。あなたの次のプロジェクトのための高品質なオーディオトラックです。',
        },
        empty: '現在利用可能な楽曲はありません。',
        card: {
            buyNow: '購入する',
            processing: '処理中...',
            error: 'エラーが発生しました。もう一度お試しください。',
        },
    },
}

export async function getDictionary() {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || 'en'
    const locale: Locale = acceptLanguage.startsWith('ja') ? 'ja' : 'en'
    return dictionaries[locale] // Return plain object, not a promise
}
