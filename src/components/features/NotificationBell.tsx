'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface NotificationItem {
    id: string
    date: string
    content: string
}

interface NotificationBellProps {
    dict: {
        title: string
        empty: string
        markRead: string
        items: NotificationItem[]
    }
}

export function NotificationBell({ dict }: NotificationBellProps) {
    const [open, setOpen] = useState(false)
    // Simple MVP unread logic: assume first load has unread items if any exist
    const [hasUnread, setHasUnread] = useState(dict.items.length > 0)

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen) {
            // Mark as read when opened
            setHasUnread(false)
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background border border-background" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
                    <h4 className="font-semibold text-sm">{dict.title}</h4>
                </div>
                <ScrollArea className="h-[300px]">
                    {dict.items.length > 0 ? (
                        <div className="divide-y">
                            {dict.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="px-4 py-3 hover:bg-muted/50 transition-colors"
                                >
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {item.date}
                                    </p>
                                    <p className="text-sm leading-relaxed text-foreground/90">
                                        {item.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            {dict.empty}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
