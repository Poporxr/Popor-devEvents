export interface EventItem {
  id: string;
  title: string;
  image: string;
  slug?: string;
  date?: string; // ISO date
  time?: string;
  location?: string;
  description?: string;
  url?: string;
  tags?: string[];
}

export const events: EventItem[] = [
  {
    id: 'react-summit-2026',
    title: 'React Summit 2026',
    image: '/images/event1.png',
    slug: 'react-summit-2026',
    date: '2026-03-18',
    time: '09:00',
    location: 'Amsterdam, NL',
    description: 'A hands-on conference for React developers featuring workshops, talks, and community meetups.',
    url: 'https://reactsummit.com',
    tags: ['react', 'frontend', 'conference'],
  },
  {
    id: 'nextjs-conf-2026',
    title: 'Next.js Conf 2026',
    image: '/images/event2.png',
    slug: 'nextjs-conf-2026',
    date: '2026-05-12',
    time: '10:00',
    location: 'San Francisco, USA',
    description: 'Official Next.js conference with product announcements, talks and labs.',
    url: 'https://nextjs.org/conf',
    tags: ['nextjs', 'react', 'ssr'],
  },
  {
    id: 'google-io-2026',
    title: 'Google I/O 2026',
    image: '/images/event3.png',
    slug: 'google-io-2026',
    date: '2026-05-14',
    time: '09:30',
    location: 'Mountain View, USA & Online',
    description: 'Google’s flagship developer conference covering Android, web, AI and cloud.',
    url: 'https://events.google.com/io',
    tags: ['google', 'android', 'web', 'ai'],
  },
  {
    id: 'ms-build-2026',
    title: 'Microsoft Build 2026',
    image: '/images/event4.png',
    slug: 'microsoft-build-2026',
    date: '2026-05-05',
    time: '11:00',
    location: 'Seattle, USA & Online',
    description: 'Developer event focused on Azure, .NET, and the Microsoft developer ecosystem.',
    url: 'https://mybuild.microsoft.com',
    tags: ['microsoft', 'azure', '.net'],
  },
  {
    id: 'aws-reinvent-2026',
    title: 'AWS re:Invent 2026',
    image: '/images/event5.png',
    slug: 'aws-reinvent-2026',
    date: '2026-11-30',
    time: '08:30',
    location: 'Las Vegas, USA',
    description: 'AWS’s large annual conference covering cloud, infrastructure, and AI services.',
    url: 'https://reinvent.awsevents.com',
    tags: ['aws', 'cloud', 'devops'],
  },
  {
    id: 'jsconf-eu-2026',
    title: 'JSConf EU 2026',
    image: '/images/event6.png',
    slug: 'jsconf-eu-2026',
    date: '2026-07-10',
    time: '09:00',
    location: 'Berlin, DE',
    description: 'Community-driven JavaScript conference in Europe with a mix of tutorials and talks.',
    url: 'https://jsconf.com',
    tags: ['javascript', 'community'],
  },
  {
    id: 'hackmit-2026',
    title: 'HackMIT 2026',
    image: '/images/event-full.png',
    slug: 'hackmit-2026',
    date: '2026-09-20',
    time: '18:00',
    location: 'Cambridge, USA',
    description: 'Student-run hackathon at MIT attracting hackers worldwide for 24+ hours of building.',
    url: 'https://hackmit.org',
    tags: ['hackathon', 'students', 'hardware'],
  },
];

export default events;