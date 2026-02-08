'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export function DeleteSongButton({ songId, songTitle }: { songId: string; songTitle: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`「${songTitle}」を削除してもよろしいですか？`)) {
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/songs?id=${songId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete song')
            }

            // Reload page to reflect changes
            window.location.reload()
        } catch (error) {
            console.error('Delete error:', error)
            alert('削除に失敗しました')
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-500/20 p-2 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
            title="削除"
        >
            <Trash2 size={18} />
        </button>
    )
}
