import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event, { type IEvent } from '@/database/event.model';

interface RouteContext {
  // In Next.js 15, params is asynchronous in route handlers
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/events/[slug] - fetch a single event by its slug
export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { slug } = await context.params;

  // Basic validation of slug parameter
  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    return NextResponse.json(
      { message: 'Invalid or missing slug parameter.' },
      { status: 400 },
    );
  }

  // Optional: enforce a simple slug format to catch obviously invalid input early
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { message: 'Invalid slug format. Expected lowercase letters, numbers, and dashes only.' },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    // Use lean query for a plain JSON-friendly object
    const event = await Event.findOne({ slug }).lean<IEvent>().exec();

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found for the provided slug.', slug },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'Event fetched successfully',
        event,
      },
      { status: 200 },
    );
  } catch (error) {
    // Log server-side for observability while returning a safe message to the client
    // eslint-disable-next-line no-console
    console.error('[GET /api/events/[slug]] Error fetching event by slug:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while fetching the event.';

    return NextResponse.json(
      {
        message: 'Failed to fetch event by slug',
        slug,
        error: message,
      },
      { status: 500 },
    );
  }
}
