import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import Booking from '@/database/booking.model';

interface BookingRequestBody {
  email: string;
  slug: string;
}

interface BookingSuccessResponse {
  message: string;
  bookingId: string;
  eventId: string;
}

interface BookingErrorResponse {
  message: string;
  error?: string;
  fieldErrors?: {
    email?: string;
    slug?: string;
  };
}

type BookingResponseBody = BookingSuccessResponse | BookingErrorResponse;

// Simple email validation to fail fast before hitting the database
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest): Promise<NextResponse<BookingResponseBody>> {
  let body: BookingRequestBody;

  try {
    body = (await request.json()) as BookingRequestBody;
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Invalid JSON body.',
        error: error instanceof Error ? error.message : 'unknown',
      },
      { status: 400 },
    );
  }

  const { email, slug } = body;
  const normalizedEmail = email?.toLowerCase().trim();
  const trimmedSlug = slug?.trim();

  const fieldErrors: BookingErrorResponse['fieldErrors'] = {};

  if (!normalizedEmail) {
    fieldErrors.email = 'Email is required.';
  } else if (!emailRegex.test(normalizedEmail)) {
    fieldErrors.email = 'Please provide a valid email address.';
  }

  if (!trimmedSlug) {
    fieldErrors.slug = 'Event slug is required.';
  } else if (!/^[a-z0-9-]+$/.test(trimmedSlug)) {
    fieldErrors.slug = 'Invalid slug format. Expected lowercase letters, numbers, and dashes only.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        message: 'Validation failed.',
        fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await connectDB();

    const event = await Event.findOne({ slug: trimmedSlug }).select('_id').exec();

    if (!event) {
      return NextResponse.json(
        {
          message: 'Event not found for the provided slug.',
          fieldErrors: { slug: 'No event exists for the given slug.' },
        },
        { status: 404 },
      );
    }

    try {
      const booking = await Booking.create({
        eventId: event._id,
        email: normalizedEmail,
      });

      return NextResponse.json(
        {
          message: 'Booking created successfully.',
          bookingId: booking._id.toString(),
          eventId: booking.eventId.toString(),
        },
        { status: 201 },
      );
    } catch (error) {
      // Handle duplicate key (user already booked this event) and other validation errors
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: number }).code === 11000
      ) {
        return NextResponse.json(
          {
            message: 'You have already booked this event with this email.',
            fieldErrors: { email: 'Duplicate booking for this event and email.' },
          },
          { status: 409 },
        );
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: string }).name === 'ValidationError'
      ) {
        return NextResponse.json(
          {
            message: 'Booking validation failed.',
            error: (error as Error).message,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          message: 'Failed to create booking.',
          error: error instanceof Error ? error.message : 'unknown',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Unexpected error while creating booking.',
        error: error instanceof Error ? error.message : 'unknown',
      },
      { status: 500 },
    );
  }
}
