'use server';

import Event from '@/database/event.model';
import type { IEvent } from '@/database';
import connectDB from "@/lib/mongodb";

// Fetch events that share at least one tag with the target event, excluding the event itself
export async function getSimilarEventsBySlug(slug: string): Promise<IEvent[]> {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean<IEvent>().exec();

    if (!event || !Array.isArray(event.tags) || event.tags.length === 0) {
      return [];
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    })
      .lean<IEvent>()
      .exec();

    return similarEvents;
  } catch (error) {
    console.error('[getSimilarEventsBySlug] Error fetching similar events:', error);
    return [];
  }
}
