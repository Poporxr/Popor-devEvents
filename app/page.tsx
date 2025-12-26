import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async ( ) => {
  'use cache';
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`);

  const {events} = await response.json();

  return(
    <section>
      <h1 className="text-center">The Hub of Every Dev <br /> Event You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Event</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => {
            return  (<li key={event.slug} className="list-none">
              <EventCard {...event}/>
            </li>)
          })}
        </ul>
      </div>
    </section>
  );
}

export default page