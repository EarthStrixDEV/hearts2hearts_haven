'use client';

import { useState, useEffect } from 'react';
import { getCurrentLyricLine, getCurrentMember } from '@/lib/lyrics';
import type { Lyrics, Track } from '@/lib/types';

interface LyricsDisplayProps {
  lyrics: Lyrics[];
  track: Track;
  currentTime: number;
}

export function LyricsDisplay({ lyrics, track, currentTime }: LyricsDisplayProps) {
  const [selectedLang, setSelectedLang] = useState<string>('ko');

  useEffect(() => {
    if (lyrics.length > 0 && !lyrics.find(l => l.lang === selectedLang)) {
      setSelectedLang(lyrics[0].lang);
    }
  }, [lyrics, selectedLang]);

  const currentLyrics = lyrics.find(l => l.lang === selectedLang);
  const currentLine = currentLyrics ? getCurrentLyricLine(currentLyrics, currentTime) : null;
  const currentMember = getCurrentMember(track.membersParts, currentTime);

  const langNames: Record<string, string> = {
    ko: '한국어',
    en: 'English',
    th: 'ไทย',
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-6">
      {/* Language Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {lyrics.map((lyric) => (
          <button
            key={lyric.lang}
            onClick={() => setSelectedLang(lyric.lang)}
            className={`px-4 py-2 font-medium transition ${
              selectedLang === lyric.lang
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {langNames[lyric.lang] || lyric.lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Current Member */}
      {currentMember && (
        <div className="mb-4 text-sm text-blue-400 font-medium">
          Now singing: {currentMember}
        </div>
      )}

      {/* Lyrics */}
      {currentLyrics && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {currentLyrics.lines.map((line, index) => {
            const isActive = currentLine?.index === index;
            const isPast = currentLine && index < currentLine.index;
            const isMemberLine = track.membersParts?.some(
              part => currentTime >= part.from && currentTime <= part.to && 
              line.t >= part.from && line.t <= part.to
            );

            return (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  isActive
                    ? 'text-2xl font-bold text-white scale-105'
                    : isPast
                    ? 'text-gray-500'
                    : 'text-gray-400'
                } ${isMemberLine ? 'text-blue-400' : ''}`}
              >
                {line.l}
              </div>
            );
          })}
        </div>
      )}

      {!currentLyrics && (
        <div className="text-center text-gray-500 py-8">
          No lyrics available
        </div>
      )}
    </div>
  );
}

