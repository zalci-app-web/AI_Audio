export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#000000] text-gray-100 font-sans">
            <div className="flex flex-col items-center space-y-8 relative z-10 w-full max-w-sm px-6 py-10 rounded-3xl border border-white/5 bg-zinc-900/30 backdrop-blur-md shadow-2xl">
                {/* エンタメ感のあるオーディオウェーブ風アニメーション（スピナー） */}
                <div className="flex items-center justify-center h-20 space-x-2.5">
                    <div className="h-8 w-2.5 rounded-full bg-gradient-to-t from-blue-600 to-blue-400 animate-pulse" style={{ animationDelay: '0ms', animationDuration: '800ms' }}></div>
                    <div className="h-14 w-2.5 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400 animate-pulse" style={{ animationDelay: '150ms', animationDuration: '800ms' }}></div>
                    <div className="h-20 w-2.5 rounded-full bg-gradient-to-t from-purple-600 to-purple-400 animate-pulse" style={{ animationDelay: '300ms', animationDuration: '800ms' }}></div>
                    <div className="h-12 w-2.5 rounded-full bg-gradient-to-t from-pink-600 to-pink-400 animate-pulse" style={{ animationDelay: '450ms', animationDuration: '800ms' }}></div>
                    <div className="h-6 w-2.5 rounded-full bg-gradient-to-t from-rose-600 to-rose-400 animate-pulse" style={{ animationDelay: '600ms', animationDuration: '800ms' }}></div>
                </div>

                <div className="flex flex-col items-center space-y-3">
                    <h2 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 uppercase drop-shadow-lg">
                        Zalci Audio
                    </h2>
                    <div className="flex items-center justify-center space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                        <p className="text-sm font-medium text-gray-400/80 tracking-widest uppercase">
                            Loading...
                        </p>
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '750ms' }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
