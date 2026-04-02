import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#0ff] font-[var(--font-vt323)] selection:bg-[#f0f] selection:text-[#050505] flex flex-col relative overflow-hidden uppercase">
      <div className="static-noise" />
      <div className="scanlines" />

      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between relative z-10 border-b-4 border-[#f0f] bg-[#050505]">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 text-[#0ff] animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-[var(--font-pixel)] text-[#fff] glitch-text" data-text="SYS.SNAKE_PROTOCOL">
            SYS.SNAKE_PROTOCOL
          </h1>
        </div>
        <div className="text-2xl text-[#f0f] hidden sm:block animate-pulse">
          STATUS: ONLINE
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-start justify-center gap-12 relative z-10 screen-tear">
        
        {/* Game Section */}
        <div className="w-full lg:w-3/5 flex flex-col items-center border-2 border-[#0ff] p-2 bg-[#050505] relative">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-[#f0f] -translate-x-2 -translate-y-2 pointer-events-none mix-blend-screen" />
          <SnakeGame />
        </div>

        {/* Sidebar / Music Player */}
        <div className="w-full lg:w-2/5 flex flex-col gap-12">
          <div className="border-2 border-[#f0f] p-6 bg-[#050505] relative">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-[#0ff] translate-x-2 translate-y-2 pointer-events-none mix-blend-screen" />
            <h2 className="text-xl font-[var(--font-pixel)] text-[#0ff] mb-6 flex items-center gap-3">
              <span className="w-4 h-4 bg-[#f0f] animate-ping" />
              AUDIO_SUBSYSTEM
            </h2>
            <MusicPlayer />
          </div>

          {/* Instructions / Lore */}
          <div className="border-2 border-[#0ff] p-6 bg-[#050505] relative">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-[#f0f] -translate-x-2 translate-y-2 pointer-events-none mix-blend-screen" />
            <h3 className="text-lg font-[var(--font-pixel)] text-[#f0f] mb-4">EXECUTION_LOG</h3>
            <ul className="space-y-2 text-2xl text-[#0ff]">
              <li className="flex gap-2">
                <span className="text-[#f0f]">&gt;</span>
                <span>BOOT_SEQUENCE_INITIATED...</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f0f]">&gt;</span>
                <span>MEMORY_ALLOCATION: 0x00F4C</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#f0f]">&gt;</span>
                <span className="animate-pulse">AWAITING_OPERATOR_INPUT_</span>
              </li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
