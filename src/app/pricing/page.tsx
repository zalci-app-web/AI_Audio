'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Mock Data - In production, fetch from Stripe or DB
const PRODUCTS = [
    {
        id: 'price_12345', // Replace with real Stripe Price ID
        name: 'Starter Pack',
        description: 'Perfect for hobbyists',
        price: '$19',
        features: ['10 AI Audio Tracks', 'Commercial License', 'MP3 & WAV Download'],
    },
    {
        id: 'price_67890', // Replace with real Stripe Price ID
        name: 'Pro Pack',
        description: 'For professional creators',
        price: '$49',
        features: ['50 AI Audio Tracks', 'Stem Files Included', 'Priority Support', 'Commercial License'],
    },
]

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null)
    const router = useRouter()

    const handleCheckout = async (priceId: string) => {
        try {
            setLoading(priceId)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            })

            if (response.status === 401) {
                router.push('/login')
                return
            }

            const data = await response.json()
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong.")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="container py-10">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple Pricing</h1>
                <p className="text-muted-foreground text-lg">Choose the perfect plan for your creative needs.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
                {PRODUCTS.map((product) => (
                    <Card key={product.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{product.name}</CardTitle>
                            <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="text-4xl font-bold mb-4">{product.price}</div>
                            <ul className="space-y-2">
                                {product.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleCheckout(product.id)}
                                disabled={loading === product.id}
                            >
                                {loading === product.id ? 'Processing...' : 'Buy Now'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
