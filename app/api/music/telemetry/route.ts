import { NextRequest, NextResponse } from 'next/server';
import { updateJSON } from '@/lib/fs-json';
import { createTelemetryEvent, getClientIP } from '@/lib/analytics';
import { TelemetryEventSchema, type TelemetryEvent } from '@/lib/types';

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate event
    const validatedEvent = TelemetryEventSchema.omit({ ts: true, ipHash: true }).parse(body);
    
    // Create telemetry event
    const event = createTelemetryEvent(ip, validatedEvent.event, validatedEvent.data);
    
    // Append to telemetry log
    await updateJSON<TelemetryEvent[]>('data/telemetry.json', (events) => {
      events.push(event);
      
      // Keep only last 10000 events to prevent file from growing too large
      if (events.length > 10000) {
        return events.slice(-10000);
      }
      
      return events;
    });

    return NextResponse.json({
      success: true,
      message: 'Event recorded',
    });
  } catch (error) {
    console.error('Error recording telemetry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could return aggregated stats
    // For now, return a simple message
    return NextResponse.json({
      success: true,
      message: 'Telemetry endpoint active',
    });
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch telemetry' },
      { status: 500 }
    );
  }
}

