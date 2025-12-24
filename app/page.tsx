import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";

const events = [
  {
    image: '/images/event1.png' ,
    title: 'Event 1',
    slug: 'event-1',
    location: 'location-1',
    date: 'date-1',
    time: 'time-1'
  }
]

const page = ( ) => {
  return(
    <section>
      <h1 className="text-center">The Hub of Every Dev <br /> Event You Can&apos;t Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Event</h3>

        <ul className="events">
          {events.map((event) => {
            return  (<li key={event.title}>
              <EventCard {...event}/>
            </li>)
          })}
        </ul>
      </div>
    </section>
  );
}

export default page