import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, TerminalSquare } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "DATA_STREAM_01.WAV",
    artist: "SYS.AI_GEN_001",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "text-[#0ff]",
    bg: "bg-[#0ff]"
  },
  {
    id: 2,
    title: "CORRUPT_SECTOR.MP3",
    artist: "SYS.AI_GEN_002",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "text-[#f0f]",
    bg: "bg-[#f0f]"
  },
  {
    id: 3,
    title: "VOID_RESONANCE.FLAC",
    artist: "SYS.AI_GEN_003",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "text-[#fff]",
    bg: "bg-[#fff]"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full uppercase">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-800 pb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-2 border-2 border-current ${currentTrack.color}`}>
            <TerminalSquare className="w-8 h-8" />
          </div>
          <div>
            <h3 className={`font-[var(--font-pixel)] text-sm md:text-base ${currentTrack.color}`}>
              {currentTrack.title}
            </h3>
            <p className="text-gray-500 text-lg font-[var(--font-vt323)]">AUTHOR: {currentTrack.artist}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-4 border-2 border-gray-800 mb-6 cursor-pointer relative group bg-[#050505]"
        onClick={handleProgressClick}
      >
        <div 
          className={`h-full ${currentTrack.bg} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button 
            onClick={prevTrack}
            className="text-gray-500 hover:text-[#0ff] transition-colors"
          >
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-3 border-2 border-current ${currentTrack.color} hover:bg-current hover:text-[#050505] transition-colors`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-gray-500 hover:text-[#0ff] transition-colors"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center space-x-3 text-gray-500">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="hover:text-[#f0f] transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 accent-[#f0f] h-2 bg-gray-800 appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
