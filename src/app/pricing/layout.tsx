import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '料金プラン',
    description: 'Zalci Audioの料金プランページです。高品質なAI生成BGMを取得するためのプランをご覧ください。',
    alternates: { canonical: '/pricing' },
}

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
