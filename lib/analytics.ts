import crypto from 'crypto';
import type { TelemetryEvent } from './types';

/**
 * Hash IP address for privacy
 */
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

/**
 * Get client IP from request
 */
export function getClientIP(request: Request): string {
  // Try various headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

/**
 * Create telemetry event
 */
export function createTelemetryEvent(
  ip: string,
  event: TelemetryEvent['event'],
  data: Record<string, unknown>
): TelemetryEvent {
  return {
    ts: new Date().toISOString(),
    ipHash: hashIP(ip),
    event,
    data,
  };
}

/**
 * Aggregate play counts by track
 */
export function aggregatePlayCounts(
  events: TelemetryEvent[]
): Record<string, number> {
  const counts: Record<string, number> = {};

  events
    .filter(e => e.event === 'play_start')
    .forEach(e => {
      const trackId = e.data.trackId as string;
      if (trackId) {
        counts[trackId] = (counts[trackId] || 0) + 1;
      }
    });

  return counts;
}

/**
 * Get popular tracks
 */
export function getPopularTracks(
  events: TelemetryEvent[],
  limit: number = 10
): Array<{ trackId: string; count: number }> {
  const counts = aggregatePlayCounts(events);
  
  return Object.entries(counts)
    .map(([trackId, count]) => ({ trackId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(events: TelemetryEvent[]): number {
  const starts = events.filter(e => e.event === 'play_start').length;
  const completes = events.filter(e => e.event === 'complete').length;

  if (starts === 0) return 0;
  return (completes / starts) * 100;
}

