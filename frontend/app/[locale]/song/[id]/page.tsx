'use client';

import { useCreatorStore } from '@/store/useCreatorStore';
import { useDAWStore } from '@/store/useDAWStore';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Play, Pause, Share2, Heart, MessageSquare, MoreVertical, Edit2, UploadCloud, ChevronLeft, Music } from 'lucide-react';

export default function SongDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { tracks } = useCreatorStore();
    const { currentPreviewTrack, setPreviewTrack } = useDAWStore();

    // Find song by id. Since params can be Promise in Next.js 15, we might need a generic approach, 
    // but typically params.id is available directly in client components if passed down, or via useParams.
    const trackId = params?.id as string;
    const track = tracks.find(t => t.id === trackId);

    if (!track) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-white/50">
                <Music size={64} className="mb-4 opacity-50" />
                <h1 className="text-2xl font-bold mb-2 text-white">Song Not Found</h1>
                <p>The song you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => router.push('/crear')}
                    className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    Return to Studio
                </button>
            </div>
        );
    }

    const isPlaying = currentPreviewTrack?.id === track.id;

    const handlePlayPause = () => {
        if (isPlaying) {
            setPreviewTrack(null);
        } else {
            setPreviewTrack(track);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] min-h-screen text-white p-6 md:p-12 pb-32">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
            </button>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16">
                {/* Left side: Cover Art */}
                <div className="w-full md:w-1/3 lg:w-[400px] shrink-0">
                    <div className="aspect-square bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group">
                        {track.image ? (
                            <img src={track.image} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Music size={80} className="text-white/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={handlePlayPause}
                                className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                {isPlaying ? (
                                    <Pause size={40} className="text-white" fill="white" />
                                ) : (
                                    <Play size={40} className="text-white ml-2" fill="white" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right side: Details & Actions */}
                <div className="flex-1 flex flex-col pt-2 md:pt-6">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {track.tags.map((tag, i) => (
                            <span key={i} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider text-white/80 uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">{track.title}</h1>
                    <p className="text-xl md:text-2xl text-white/60 mb-10 font-medium">{track.style}</p>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-12 pb-10 border-b border-white/10">
                        <button
                            onClick={handlePlayPause}
                            className={`h-12 px-8 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg ${isPlaying ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-white text-black shadow-white/20'}`}
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>

                        <button className="h-12 px-6 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors flex items-center gap-2">
                            <Heart size={20} className="text-white/70" />
                            {track.likes || 0}
                        </button>

                        <button className="h-12 px-6 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors flex items-center gap-2">
                            <Share2 size={20} className="text-white/70" />
                            Share
                        </button>

                        <div className="h-8 w-px bg-white/20 mx-2 hidden sm:block"></div>

                        <button className="h-12 px-6 bg-white/5 hover:bg-white/15 text-white/80 rounded-full font-medium transition-colors flex items-center gap-2">
                            <Edit2 size={18} />
                            Remake
                        </button>

                        <button className="h-12 px-6 bg-white/5 hover:bg-white/15 text-white/80 rounded-full font-medium transition-colors flex items-center gap-2">
                            <UploadCloud size={18} />
                            Stems
                        </button>

                        <div className="flex-1"></div>

                        <button className="w-12 h-12 bg-white/5 hover:bg-white/15 rounded-full flex items-center justify-center transition-colors">
                            <MoreVertical size={20} className="text-white/70" />
                        </button>
                    </div>

                    {/* Lyrics Section */}
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <MessageSquare size={24} className="text-white/50" />
                            Lyrics
                        </h2>
                        {track.lyrics ? (
                            <div className="text-lg md:text-xl leading-relaxed text-white/80 whitespace-pre-wrap font-sans bg-white/5 p-8 rounded-3xl border border-white/10 shadow-inner">
                                {track.lyrics}
                            </div>
                        ) : (
                            <div className="p-8 border border-dashed border-white/20 rounded-3xl text-center text-white/40 flex flex-col items-center gap-4">
                                <Music size={48} className="opacity-50" />
                                <p className="text-lg">No lyrics available for this instrumental track.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
