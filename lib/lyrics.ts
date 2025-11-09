import type { Lyrics } from './types';

/**
 * Find current lyric line based on current time
 */
export function getCurrentLyricLine(
  lyrics: Lyrics,
  currentTime: number
): { index: number; line: string } | null {
  if (!lyrics.lines.length) return null;

  // Find the last line that has started
  let currentIndex = -1;
  for (let i = 0; i < lyrics.lines.length; i++) {
    if (lyrics.lines[i].t <= currentTime) {
      currentIndex = i;
    } else {
      break;
    }
  }

  if (currentIndex === -1) return null;

  return {
    index: currentIndex,
    line: lyrics.lines[currentIndex].l,
  };
}

/**
 * Get upcoming lyric lines for preview
 */
export function getUpcomingLines(
  lyrics: Lyrics,
  currentTime: number,
  count: number = 3
): Array<{ index: number; time: number; line: string }> {
  const upcoming: Array<{ index: number; time: number; line: string }> = [];

  for (let i = 0; i < lyrics.lines.length; i++) {
    if (lyrics.lines[i].t > currentTime) {
      upcoming.push({
        index: i,
        time: lyrics.lines[i].t,
        line: lyrics.lines[i].l,
      });

      if (upcoming.length >= count) break;
    }
  }

  return upcoming;
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

/**
 * Find member singing at current time
 */
export function getCurrentMember(
  membersParts: Array<{ member: string; from: number; to: number }> | undefined,
  currentTime: number
): string | null {
  if (!membersParts) return null;

  const part = membersParts.find(
    p => currentTime >= p.from && currentTime <= p.to
  );

  return part?.member || null;
}

