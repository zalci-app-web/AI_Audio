'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Music, Loader2, X, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Add webkitdirectory to InputHTMLAttributes
declare module 'react' {
    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        webkitdirectory?: string;
        directory?: string;
    }
}

export function AddSongForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [uploadResults, setUploadResults] = useState<{ name: string; status: 'pending' | 'success' | 'error'; message?: string }[]>([])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const mp3Files = Array.from(files).filter(file => file.name.toLowerCase().endsWith('.mp3'))

        if (mp3Files.length === 0) {
            alert('MP3ファイルが見つかりませんでした。')
            return
        }

        setSelectedFiles(prev => [...prev, ...mp3Files])
        setUploadResults(prev => [
            ...prev,
            ...mp3Files.map(f => ({ name: f.name, status: 'pending' as const }))
        ])
    }

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
        setUploadResults(prev => prev.filter((_, i) => i !== index))
    }

    const uploadFile = async (file: File, title: string) => {
        const supabase = createClient()
        // songs/Title/Title.mp3
        const ext = file.name.split('.').pop()
        const path = `${title}/${title}.${ext}`

        const { data, error } = await supabase.storage
            .from('songs')
            .upload(path, file, {
                upsert: true
            })

        if (error) {
            console.error('Storage upload error:', error)
            throw new Error(`Storage upload failed: ${error.message}`)
        }

        const { data: { publicUrl } } = supabase.storage
            .from('songs')
            .getPublicUrl(path)

        return publicUrl
    }

    const handleUploadAll = async () => {
        setIsLoading(true)
        setUploadProgress('アップロードを開始します...')

        const newResults = [...uploadResults]
        let successCount = 0

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i]
            const title = file.name.replace(/\.[^/.]+$/, "") // Remove extension

            // Skip if already success
            if (newResults[i].status === 'success') {
                successCount++
                continue
            }

            try {
                setUploadProgress(`(${i + 1}/${selectedFiles.length}) ${title} を処理中...`)

                // 1. Upload to Storage
                const mp3Url = await uploadFile(file, title)

                // 2. Register to DB & Stripe
                const response = await fetch('/api/admin/songs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: title,
                        // description is set default in backend/API
                        mp3_url: mp3Url,
                        // Defaults
                        has_wav: false,
                        has_loop: false,
                        has_high_res: false,
                        has_midi: false,
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                    throw new Error(errorData.error || response.statusText)
                }

                newResults[i] = { name: file.name, status: 'success' }
                successCount++

            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error)
                newResults[i] = {
                    name: file.name,
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                }
            }

            setUploadResults([...newResults])
        }

        setIsLoading(false)
        setUploadProgress(`完了: ${successCount} / ${selectedFiles.length} 曲`)

        if (successCount === selectedFiles.length) {
            setTimeout(() => {
                setIsOpen(false)
                window.location.reload()
            }, 1500)
        }
    }

    if (!isOpen) {
        // Admin check should be done by parent or we need to pass user/admin status. 
        // However, for strict security, we should check it here or in parent.
        // For now, let's assume parent controls visibility or we add a check.
        // UPDATE: User requested "UI Control: Hide ... for non-admins".
        // We will accept an isAdmin prop.
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            >
                <Music size={18} className="mr-2" />
                MP3を追加 (一括)
            </Button>
        )
    }

    return (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">楽曲を追加 (MP3)</h2>

            <div className="space-y-6">
                {/* File Input */}
                <div className="rounded-lg border-2 border-dashed border-white/20 p-8 text-center hover:border-blue-500/50 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".mp3"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={48} className="text-gray-400" />
                        <p className="text-lg font-medium text-white">
                            クリックしてMP3ファイルを選択
                        </p>
                        <p className="text-sm text-gray-500">
                            複数選択可能 • ファイル名がタイトルになります
                        </p>
                    </div>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between rounded bg-white/5 p-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Music size={16} className="text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-white truncate">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {uploadResults[index]?.status === 'success' && <CheckCircle size={16} className="text-green-500" />}
                                    {uploadResults[index]?.status === 'error' && <span className="text-xs text-red-500">{uploadResults[index].message || 'Error'}</span>}
                                    {uploadResults[index]?.status === 'pending' && !isLoading && (
                                        <button onClick={() => removeFile(index)} className="text-gray-500 hover:text-white">
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Progress & Actions */}
                <div className="space-y-4">
                    {uploadProgress && (
                        <div className="text-sm text-blue-200 text-center animate-pulse">
                            {uploadProgress}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <Button
                            onClick={handleUploadAll}
                            disabled={isLoading || selectedFiles.length === 0}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    アップロード中...
                                </>
                            ) : (
                                `すべてのファイルを登録 (${selectedFiles.length})`
                            )}
                        </Button>
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                            disabled={isLoading}
                            className="border-white/10 hover:bg-white/10"
                        >
                            キャンセル
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
