import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import type { IEvent } from "@/database";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";

const getEventBySlug = cache(async (slug: string): Promise<IEvent | null> => {
  await connectDB();
  const event = (await Event.findOne({ slug }).lean().exec()) as IEvent | null;
  return event;
});

const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string; }) => (
  <div className='flex-row-gap-2 items-center'>
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      )
      )}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className=" flex flex-row gap-1.5">
    {tags.map((tag) => (<div key={tag} className="pill">{tag}</div>))}
  </div>
);

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

  if (!description) {
    return notFound();
  }

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id='event'>
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left -side-Event Content */}
        <div className="content">
          <Image className='banner' src={image} alt='event banner' width={800} height={800} />

          <section className="flex-col-gap-2">
            <h2>{overview}</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem icon='/icons/calendar.svg' alt='calendar' label={date} />
            <EventDetailItem icon='/icons/clock.svg' alt='clock' label={time} />
            <EventDetailItem icon='/icons/pin.svg' alt='pin' label={location} />
            <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
            <EventDetailItem icon='/icons/audience.svg' alt='audience' label={audience} />
          </section>

          <EventAgenda agendaItems={(agenda)} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={(tags)} />

        </div>

        {/* right-side -Booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Seat Now!</h2>
            {/* TODO: Replace this placeholder with real booking count once bookings are implemented */}
            <p className="text-sm">Join our community and reserve your seat today</p>
            <BookEvent slug={slug} />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events You May Like</h2>
          {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.slug} {...similarEvent} />
          ))}
      </div>
    </section>
  )
};

export default EventDetailsPage;