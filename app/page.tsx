import EventCard from "@/components/EventCard";
  {
    image: '/images/event2.png' ,
    title: 'Event 2',
    slug: 'event-2',
    location: 'location-2',
    date: 'date-2',
    time: 'time-2'
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