import { v2 as cloudinary } from 'cloudinary';
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// Basic auth helper for event creation.
// TODO: Replace this with your real auth layer (e.g. NextAuth, JWT, or custom middleware)
// before deploying to production.
async function authenticateEventRequest(req: NextRequest): Promise<NextResponse | null> {
  const authHeader = req.headers.get('authorization');

  // Allow all requests during development, but log a warning to avoid shipping this by mistake.
  if (process.env.NODE_ENV !== 'production') {
    if (!authHeader) {
      console.warn('[events POST] Missing Authorization header (allowed in non-production).');
    }
    return null;
  }

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json(
      { message: 'Unauthorized: missing or invalid Authorization header.' },
      { status: 401 },
    );
  }

  const token = authHeader.slice('bearer '.length).trim();

  // Placeholder token check. Replace with real verification (e.g. JWT verify, session lookup, etc.).
  if (!token || token !== process.env.INTERNAL_API_TOKEN) {
    return NextResponse.json(
      { message: 'Forbidden: invalid or expired credentials.' },
      { status: 403 },
    );
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    // Enforce authentication/authorization before hitting the database or parsing request body
    const authErrorResponse = await authenticateEventRequest(req);
    if (authErrorResponse) {
      return authErrorResponse;
    }

    await connectDB();
    const formData = await req.formData();

    // Validate required scalar fields before attempting to create the event
    const requiredFields = [
      'title',
      'description',
      'overview',
      'image',
      'venue',
      'location',
      'date',
      'time',
      'mode',
      'audience',
      'organizer',
    ];

    for (const field of requiredFields) {
      const value = formData.get(field);
      if (value === null || String(value).trim().length === 0) {
        return NextResponse.json(
          { message: `Field "${field}" is required and cannot be empty.` },
          { status: 400 },
        );
      }
    }

    const file = formData.get('image') as File | null;
    if (!file) {
      return NextResponse.json({ message: 'Image file is required' }, { status: 400 });
    }

    const rawTags = formData.get('tags');
    const rawAgenda = formData.get('agenda');

    let tags: unknown;
    let agenda: unknown;

    // Parse JSON for tags with field-specific error handling
    try {
      tags = rawTags ? JSON.parse(String(rawTags)) : [];
    } catch (error) {
      return NextResponse.json(
        {
          message: 'Invalid JSON in "tags" field.',
          error: error instanceof Error ? error.message : 'unknown',
        },
        { status: 400 },
      );
    }

    // Parse JSON for agenda with field-specific error handling
    try {
      agenda = rawAgenda ? JSON.parse(String(rawAgenda)) : [];
    } catch (error) {
      return NextResponse.json(
        {
          message: 'Invalid JSON in "agenda" field.',
          error: error instanceof Error ? error.message : 'unknown',
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string')) {
      return NextResponse.json(
        { message: '"tags" must be a JSON array of strings.' },
        { status: 400 },
      );
    }

    if (!Array.isArray(agenda) || !agenda.every((a) => typeof a === 'string')) {
      return NextResponse.json(
        { message: '"agenda" must be a JSON array of strings.' },
        { status: 400 },
      );
    }

    const event = Object.fromEntries(formData.entries());

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadResult = await new Promise ((resolve, reject) => {
      cloudinary.uploader.upload_stream({resource_type: 'image', folder: 'DevEvent'}, (error, results) => {

        if (error) return reject(error);

        resolve(results);
      }).end(buffer);
    });

    event.image = (uploadResult as {secure_url: string}).secure_url;

    const createdEvent = await Event.create({...event, tags: tags, 
    agenda: agenda,
  });

    return NextResponse.json({message: 'Event Creation Successfully', event: createdEvent}, {status: 201});

  } catch (e) {
    console.log(e)
    return NextResponse.json({message: 'Event Creation Failed', error: e instanceof Error ? e.message  : 'unknown'}, {status: 500})
  }
};

export async function GET() {
  try {
    await connectDB();
    
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ message: 'Failed to fetch events', error: e instanceof Error ? e.message : 'unknown' }, { status: 500 });
  }
};