'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FolderInput, CheckCircle, Loader2 } from 'lucide-react'
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

    const [formData, setFormData] = useState({
        title: '',
        description: 'ライブラリに追加されます。audiostore.zalci.net',
        // price and image are fixed in backend
        // stripe_price_id is generated in backend
        has_wav: false,
        has_loop: false,
        has_high_res: false,
        has_midi: false,
    })

    const [filesToUpload, setFilesToUpload] = useState<{
        mp3?: File;
        wav?: File;
        loop?: File;
        high_res?: File;
        midi?: File;
    }>({})

    const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Get folder name from the first file's path
        // path is usually "FolderName/FileName.ext"
        const firstFilePath = files[0].webkitRelativePath || files[0].name
        const folderName = firstFilePath.split('/')[0]

        const newFormData = { ...formData }
        const newFiles: typeof filesToUpload = {}

        // Set Title from Folder Name
        newFormData.title = folderName

        // Reset flags
        newFormData.has_wav = false
        newFormData.has_loop = false
        newFormData.has_high_res = false
        newFormData.has_midi = false

        Array.from(files).forEach(file => {
            const lowerName = file.name.toLowerCase()

            if (lowerName.endsWith('.mp3')) {
                newFiles.mp3 = file
            } else if (lowerName.endsWith('.wav')) {
                newFormData.has_wav = true
                newFiles.wav = file
            } else if (lowerName.includes('loop')) {
                newFormData.has_loop = true
                newFiles.loop = file
            } else if (lowerName.includes('high') || lowerName.includes('96k') || lowerName.includes('24bit')) {
                newFormData.has_high_res = true
                newFiles.high_res = file
            } else if (lowerName.endsWith('.mid') || lowerName.endsWith('.midi')) {
                newFormData.has_midi = true
                newFiles.midi = file
            }
        })

        setFormData(newFormData)
        setFilesToUpload(newFiles)
        setUploadProgress(`フォルダ "${folderName}" を読み込みました。${Object.keys(newFiles).length} 個のファイルを検出。`)
    }

    const uploadFile = async (file: File, path: string) => {
        const supabase = createClient()
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setUploadProgress('アップロードを開始します...')

        try {
            let mp3Url = ''

            // Upload MP3
            if (filesToUpload.mp3) {
                setUploadProgress('MP3ファイルをアップロード中...')
                // songs/Title/Title.mp3
                const ext = filesToUpload.mp3.name.split('.').pop()
                const path = `${formData.title}/${formData.title}.${ext}`
                mp3Url = await uploadFile(filesToUpload.mp3, path)
            }

            // Note: DB insertions & Stripe creation
            setUploadProgress('データベースとStripeに登録中...')
            const response = await fetch('/api/admin/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    mp3_url: mp3Url,
                    // Flags
                    has_wav: formData.has_wav,
                    has_loop: formData.has_loop,
                    has_high_res: formData.has_high_res,
                    has_midi: formData.has_midi,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                console.error('API Error:', errorData)
                throw new Error(`Failed to add song: ${errorData.error || response.statusText}`)
            }

            setUploadProgress('完了しました！')

            // Reset
            setTimeout(() => {
                setFormData({
                    title: '',
                    description: 'ライブラリに追加されます。audiostore.zalci.net',
                    has_wav: false,
                    has_loop: false,
                    has_high_res: false,
                    has_midi: false,
                })
                setFilesToUpload({})
                setIsOpen(false)
                window.location.reload()
            }, 1000)

        } catch (error) {
            console.error('Error adding song:', error)
            alert('エラーが発生しました: ' + (error instanceof Error ? error.message : 'Unknown error'))
            setUploadProgress('')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
            >
                <FolderInput size={18} className="mr-2" />
                フォルダから楽曲を追加
            </Button>
        )
    }

    return (
        <div className="rounded-xl border border-white/10 bg-zinc-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">フォルダから楽曲追加</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Folder Input */}
                <div className="rounded-lg border-2 border-dashed border-white/20 p-8 text-center hover:border-blue-500/50 transition-colors">
                    <input
                        ref={fileInputRef}
                        type="file"
                        webkitdirectory=""
                        directory=""
                        onChange={handleFolderSelect}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <FolderInput size={48} className="text-gray-400" />
                        <p className="text-lg font-medium text-white">
                            {formData.title ? `選択中: ${formData.title}` : '楽曲フォルダを選択'}
                        </p>
                        <p className="text-sm text-gray-500">
                            フォルダ内のMP3を自動検出し、一括アップロードします
                        </p>
                    </div>
                </div>

                {uploadProgress && (
                    <div className="rounded-lg bg-blue-500/20 p-4 text-blue-200 text-sm flex items-center gap-2">
                        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                        {uploadProgress}
                    </div>
                )}

                {/* Detect Files Summary */}
                {formData.title && (
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                        <div className={filesToUpload.mp3 ? "text-green-400" : "text-gray-500"}>
                            MP3: {filesToUpload.mp3 ? "✓ " + filesToUpload.mp3.name : "未検出 (必須)"}
                        </div>
                        <div className="text-gray-400">
                            画像: 固定画像を使用
                        </div>
                        <div className={filesToUpload.wav ? "text-green-400" : "text-gray-500"}>
                            WAV: {filesToUpload.wav ? "✓ あり" : "なし"}
                        </div>
                        <div className={filesToUpload.midi ? "text-green-400" : "text-gray-500"}>
                            MIDI: {filesToUpload.midi ? "✓ あり" : "なし"}
                        </div>
                    </div>
                )}

                {/* Title (Editable) */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        タイトル (フォルダ名から自動入力)
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        説明
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        placeholder="楽曲の説明"
                        rows={2}
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading || !filesToUpload.mp3}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90"
                    >
                        <Upload size={18} className="mr-2" />
                        {isLoading ? '処理中...' : 'アップロードして登録'}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        variant="outline"
                        className="border-white/10 hover:bg-white/10"
                    >
                        キャンセル
                    </Button>
                </div>
            </form>
        </div>
    )
}
