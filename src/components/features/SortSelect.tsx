'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SortSelectProps {
    dict: {
        label: string
        latest: string
        oldest: string
        priceHigh: string
        priceLow: string
        nameAsc: string
        nameDesc: string
    }
}

export function SortSelect({ dict }: SortSelectProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get current sort value or default to 'latest'
    const currentSort = searchParams.get('sort') || 'latest'

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', value)

        // Push to URL, shallow not needed as we want to re-run server component
        router.push(`/sounds?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 hidden sm:inline">{dict.label}:</span>
            <Select value={currentSort} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px] bg-zinc-900 border-white/10 text-white">
                    <SelectValue placeholder={dict.latest} />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="latest">{dict.latest}</SelectItem>
                    <SelectItem value="oldest">{dict.oldest}</SelectItem>
                    <SelectItem value="name_asc">{dict.nameAsc}</SelectItem>
                    <SelectItem value="name_desc">{dict.nameDesc}</SelectItem>
                    <SelectItem value="price_asc">{dict.priceLow}</SelectItem>
                    <SelectItem value="price_desc">{dict.priceHigh}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
