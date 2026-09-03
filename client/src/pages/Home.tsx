/* Oipapa Guesthouse / Desert Editorial: real-place photography leads; doorway mark, thin rules, clay markers, and quiet direct booking. */
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X, MapPin, Phone, Mail, BedDouble, Wifi, CookingPot, CarFront, ChevronDown } from 'lucide-react';

// Netlify-safe assets: all images are bundled under client/public/assets.
const ASSETS = {
  hero: '/assets/oipapa-hero.png',
  rooms: '/assets/oipapa-rooms.jpeg',
  exterior: '/assets/oipapa-exterior.jpeg',
  breakfast: '/assets/oipapa-rooms.jpeg',
  landscape: '/assets/oipapa-exterior.jpeg',
};
const nav = [['Stay', '#stay'], ['The guesthouse', '#about'], ['Good to know', '#details'], ['Find us', '#find']];
const amenities = [
  { icon: BedDouble, title: 'Two comfortable beds', body: 'A cool, quiet room made for an easy night.' },
  { icon: CookingPot, title: 'Self-catering kitchen', body: 'Settle in, make breakfast, and keep your own rhythm.' },
  { icon: Wifi, title: 'The essentials', body: 'Practical comforts for short stays and longer visits.' },
  { icon: CarFront, title: 'Easy arrival', body: 'A calm base in Onhuno , helao nafidi, with room to come and go.' },
];

type GalleryCategory = 'kitchen' | 'rooms';
type GalleryMedia = {
  type: 'image' | 'video';
  src: string;
  alt: string;
  label: string;
  poster?: string;
};

const galleryMedia: Record<GalleryCategory, GalleryMedia[]> = {
  kitchen: [
    { type: 'image', src: '/assets/gallery-kitchen-1.jpeg', alt: 'Kitchen cabinets, countertop, sink, and cooking area', label: 'Kitchen / 01' },
    { type: 'image', src: '/assets/gallery-kitchen-2.jpeg', alt: 'Kitchen view with cabinets and seating area', label: 'Kitchen / 02' },
    { type: 'video', src: '/assets/gallery-kitchen-video.mp4', poster: '/assets/gallery-kitchen-1.jpeg', alt: 'Video tour of the kitchen and sitting area', label: 'Kitchen / Moving view' },
  ],
  rooms: [
    { type: 'image', src: '/assets/gallery-rooms-bedroom-1.jpeg', alt: 'Guesthouse bedroom with a neatly made bed', label: 'Rooms / 01' },
    { type: 'image', src: '/assets/gallery-rooms-living.jpeg', alt: 'Guesthouse living and sitting area', label: 'Rooms / 02' },
    { type: 'video', src: '/assets/gallery-rooms-video-1.mp4', poster: '/assets/gallery-rooms-bedroom-1.jpeg', alt: 'Video view of the guesthouse bedroom', label: 'Rooms / Moving view 01' },
    { type: 'image', src: '/assets/gallery-rooms-shower-1.jpeg', alt: 'Guesthouse shower with a window', label: 'Rooms / 03' },
    { type: 'image', src: '/assets/gallery-rooms-bedroom-2.jpeg', alt: 'Second view of a guesthouse bedroom', label: 'Rooms / 04' },
    { type: 'video', src: '/assets/gallery-rooms-video-2.mp4', poster: '/assets/gallery-rooms-bedroom-2.jpeg', alt: 'Vertical video view of a guesthouse bedroom', label: 'Rooms / Moving view 02' },
    { type: 'image', src: '/assets/gallery-rooms-bathroom.jpeg', alt: 'Guesthouse bathroom sink and mirror', label: 'Rooms / 05' },
    { type: 'image', src: '/assets/gallery-rooms-shower-2.jpeg', alt: 'Guesthouse shower interior', label: 'Rooms / 06' },
    { type: 'video', src: '/assets/gallery-rooms-video-3.mp4', poster: '/assets/gallery-rooms-bedroom-1.jpeg', alt: 'Video view of the guesthouse bedroom', label: 'Rooms / Moving view 03' },
    { type: 'image', src: '/assets/gallery-rooms-shower-3.jpeg', alt: 'Guesthouse shower and tiled bathroom', label: 'Rooms / 07' },
    { type: 'video', src: '/assets/gallery-rooms-video-4.mp4', poster: '/assets/gallery-rooms-living.jpeg', alt: 'Video view of the guesthouse interior', label: 'Rooms / Moving view 04' },
    { type: 'video', src: '/assets/gallery-rooms-video-5.mp4', poster: '/assets/gallery-rooms-living.jpeg', alt: 'Video view of the guesthouse sitting area', label: 'Rooms / Moving view 05' },
  ],
};

function GalleryTile({ item, index, onOpen }: { item: GalleryMedia; index: number; onOpen: (index: number) => void }) {
  return <button type="button" className="gallery-tile group relative block w-full overflow-hidden text-left" onClick={() => onOpen(index)} aria-label={`Open ${item.label}`}>
    {item.type === 'image' ? <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /> : <><video src={item.src} poster={item.poster} muted playsInline preload="none" className="pointer-events-none h-full w-full object-cover" /><span className="gallery-play" aria-hidden="true"><span /></span></>}
    <span className="gallery-tile__caption">{item.label}</span>
  </button>;
}

function BrandMark({ light = false }: { light?: boolean }) {
  return <span className={`brand-mark ${light ? 'brand-mark--light' : ''}`} aria-hidden="true"><span className="brand-mark__roof" /><span className="brand-mark__stem" /><span className="brand-mark__door" /><span className="brand-mark__base" /></span>;
}
function Markers() { return <span className="marker-row" aria-hidden="true"><i /><i /><i /></span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faq, setFaq] = useState<number | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [galleryCategory, setGalleryCategory] = useState<GalleryCategory>('kitchen');
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const activeGallery = galleryMedia[galleryCategory];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (viewerIndex === null) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setViewerIndex(null);
      if (event.key === 'ArrowRight') setViewerIndex((current) => current === null ? null : (current + 1) % activeGallery.length);
      if (event.key === 'ArrowLeft') setViewerIndex((current) => current === null ? null : (current - 1 + activeGallery.length) % activeGallery.length);
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [viewerIndex, activeGallery.length]);

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBookingStatus('sending');
    const form = event.currentTarget;
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
      await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      setBookingStatus('sent');
      form.reset();
    } catch {
      setBookingStatus('error');
    }
  }
  return (
    <main className="texture overflow-hidden">
      <header className="absolute top-0 left-0 z-20 w-full text-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
          <a href="#top" className="flex items-center gap-3" aria-label="Oipapa Guesthouse home"><BrandMark light /><span className="serif text-[1.45rem] leading-none tracking-wide">Oipapa</span></a>
          <nav className="desktop-nav flex items-center gap-9 text-[.69rem] font-bold uppercase tracking-[.15em]">{nav.map(([label, href]) => <a key={label} href={href} className="transition-opacity hover:opacity-70">{label}</a>)}</nav>
          <a href="#booking" className="desktop-nav border border-white/70 px-5 py-3 text-[.68rem] font-bold uppercase tracking-[.15em] transition hover:bg-white hover:text-[#2b1e18]">Book your stay <ArrowUpRight className="ml-2 inline h-3.5 w-3.5" /></a>
          <a href="#booking" className="mobile-booking-cta" aria-label="Book your stay">Book your stay <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></a>
          <button className="hidden rounded-full border border-white/70 p-2 max-[760px]:block" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        {menuOpen && <div className="mx-4 border border-white/30 bg-[#2b1e18]/95 p-6 backdrop-blur-md max-[760px]:block"><div className="flex flex-col gap-5 text-sm uppercase tracking-[.12em]">{nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<a href="tel:0813788797" className="border-t border-white/20 pt-5">Call to book</a></div></div>}
      </header>

      <section id="top" className="relative flex min-h-[760px] items-end bg-[#554138] text-white lg:min-h-[820px]"><img src={ASSETS.hero} alt="Oipapa Guesthouse rooms and self-catering kitchen" className="absolute inset-0 h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-[#2b1e18]/80 via-[#2b1e18]/35 to-transparent" /><div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-12 lg:pb-28"><div className="max-w-[720px] reveal"><p className="eyebrow mb-5 text-[#f0d4bd]">Onhuno , helao nafidi</p><h1 className="serif max-w-[760px] text-[clamp(4.2rem,10vw,9.5rem)] leading-[.8] tracking-[-.045em]"><span className="sr-only">Oipapa Guesthouse — </span>A quiet place<br /><em>to land.</em></h1><div className="mt-10 flex flex-col gap-6 border-l border-[#f0d4bd]/70 pl-5 sm:flex-row sm:items-start sm:gap-12"><p className="max-w-[290px] text-sm leading-6 text-white/85">Clean, comfortable self-catering rooms in the open calm of Onhuno , helao nafidi.</p><a href="#stay" className="group text-[.7rem] font-bold uppercase tracking-[.15em]">Explore the stay <ArrowUpRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a></div></div></div><div className="absolute bottom-6 right-6 z-10 flex items-center gap-3 text-[.62rem] uppercase tracking-[.15em] text-white/70 lg:right-12"><span className="h-px w-12 bg-white/50" />Oipapa Guesthouse · Self-catering</div></section>

      <section id="stay" className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-36"><div className="border-b border-[#d8c8b9] pb-10"><div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><div><p className="eyebrow text-[#b98568]">01 / Selective gallery</p><Markers /><h2 className="serif mt-5 max-w-[650px] text-6xl leading-[.88] tracking-[-.045em] lg:text-8xl">Explore<br /><em>the stay.</em></h2></div><p className="max-w-[330px] text-sm leading-6 text-[#75665c]">Take a closer look at the spaces waiting for you at OIPAPA Guesthouse.</p></div><div className="mt-12 flex flex-col gap-5 border-t border-[#d8c8b9] pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="eyebrow text-[#75665c]">Explore the space</p><div className="flex items-center gap-8" role="tablist" aria-label="Choose a gallery category">{(['kitchen', 'rooms'] as GalleryCategory[]).map((category, index) => <button key={category} type="button" role="tab" aria-selected={galleryCategory === category} className={`gallery-tab ${galleryCategory === category ? 'gallery-tab--active' : ''}`} onClick={() => { setGalleryCategory(category); setViewerIndex(null); }}><span>0{index + 1}</span> {category}</button>)}</div></div></div><div key={galleryCategory} className="gallery-grid mt-12 transition-opacity duration-500"><div className="gallery-grid__feature"><GalleryTile item={activeGallery[0]} index={0} onOpen={setViewerIndex} /></div><div className="gallery-grid__support"><GalleryTile item={activeGallery[1]} index={1} onOpen={setViewerIndex} /></div>{activeGallery.slice(2).map((item, index) => <div key={item.src} className={`gallery-grid__item gallery-grid__item--${index % 3}`}><GalleryTile item={item} index={index + 2} onOpen={setViewerIndex} /></div>)}</div>{viewerIndex !== null && <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={`${galleryCategory} gallery viewer`} onClick={() => setViewerIndex(null)} onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; touchStartX.current = null; if (start === null || end === undefined || Math.abs(end - start) < 45) return; setViewerIndex((current) => current === null ? null : end < start ? (current + 1) % activeGallery.length : (current - 1 + activeGallery.length) % activeGallery.length); }}><div className="gallery-viewer__inner" onClick={(event) => event.stopPropagation()}><button type="button" className="gallery-viewer__close" onClick={() => setViewerIndex(null)} aria-label="Close gallery">×</button><button type="button" className="gallery-viewer__prev" onClick={() => setViewerIndex((viewerIndex - 1 + activeGallery.length) % activeGallery.length)} aria-label="Previous media">←</button><div className="gallery-viewer__media">{activeGallery[viewerIndex].type === 'image' ? <img src={activeGallery[viewerIndex].src} alt={activeGallery[viewerIndex].alt} /> : <video src={activeGallery[viewerIndex].src} controls playsInline preload="metadata" poster={activeGallery[viewerIndex].poster} />}</div><button type="button" className="gallery-viewer__next" onClick={() => setViewerIndex((viewerIndex + 1) % activeGallery.length)} aria-label="Next media">→</button><p className="gallery-viewer__label">{activeGallery[viewerIndex].label} <span> / {viewerIndex + 1} of {activeGallery.length}</span></p></div></div>}</section>

      <section id="about" className="bg-[#2b1e18] text-[#fbf8f2]"><div className="mx-auto max-w-[900px] px-6 py-24 lg:px-12 lg:py-32"><div className="flex flex-col justify-center"><p className="eyebrow text-[#d1a487]">02 / The guesthouse</p><Markers /><h2 className="serif mt-5 max-w-[600px] text-6xl leading-[.92] tracking-[-.04em] lg:text-8xl">Stay a while.<br /><em>Make it yours.</em></h2><p className="mt-8 max-w-[475px] text-[1rem] leading-7 text-[#d8c9bd]">Oipapa Guesthouse is a small, welcoming base in Onhuno , helao nafidi. The rooms are clean, the kitchen is ready, and the surrounding landscape gives you space to breathe.</p></div></div></section>

      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32"><div className="flex flex-col justify-between gap-8 border-b border-[#d8c8b9] pb-10 sm:flex-row sm:items-end"><div><p className="eyebrow text-[#b98568]">03 / Good to know</p><Markers /><h2 className="serif mt-4 text-6xl leading-[.9] tracking-[-.04em] lg:text-7xl">The essentials,<br /><em>covered.</em></h2></div><p className="max-w-[240px] text-sm leading-6 text-[#75665c]">Everything you need for a comfortable, independent stay.</p></div><div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">{amenities.map(({ icon: Icon, title, body }, i) => <div key={title} className="border-b border-[#d8c8b9] py-8 lg:border-b-0 lg:border-r lg:pr-8"><span className="mb-9 flex h-11 w-11 items-center justify-center rounded-full border border-[#b98568] text-[#b98568]"><Icon size={19} strokeWidth={1.5} /></span><p className="eyebrow text-[#75665c]">0{i + 1}</p><h3 className="serif mt-3 text-3xl leading-none">{title}</h3><p className="mt-3 text-sm leading-6 text-[#75665c]">{body}</p></div>)}</div></section>

      <section id="details" className="bg-[#e7dbcf]"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-28"><div><p className="eyebrow text-[#b98568]">Before you arrive</p><Markers /><h2 className="serif mt-4 max-w-[450px] text-6xl leading-[.9] tracking-[-.04em] lg:text-7xl">A few useful<br /><em>things to know.</em></h2></div><div className="divide-y divide-[#cdbbae]">{['Where are you located?', 'How do I book?', 'What does self-catering mean here?'].map((q, i) => <div key={q}><button className="flex w-full items-center justify-between py-5 text-left" onClick={() => setFaq(faq === i ? null : i)}><span className="serif text-3xl">{q}</span><ChevronDown size={19} className={`text-[#b98568] transition-transform ${faq === i ? 'rotate-180' : ''}`} /></button>{faq === i && <p className="max-w-[580px] pb-6 text-sm leading-6 text-[#75665c]">{i === 0 ? 'We are in Onhuno , helao nafidi — a calm, practical base for travelers passing through or taking their time.' : i === 1 ? 'You can book through the enquiry form at the bottom of this page. You can also call 0813788797 or email oipapa2016@gmail.com with your dates, and we will confirm availability directly.' : 'You have the privacy and flexibility to prepare your own meals in the guesthouse kitchen, with the room and essentials ready for you.'}</p>}</div>)}</div></div></section>

      <section id="find" className="border-t border-[#d8c8b9] bg-[#f4eee5] text-[#2b1e18]"><div className="mx-auto grid max-w-[1440px] gap-14 px-6 py-24 lg:grid-cols-[1fr_.8fr] lg:items-end lg:px-12 lg:py-32"><div><p className="eyebrow text-[#b98568]">04 / Find us</p><Markers /><h2 className="serif mt-5 max-w-[700px] text-[clamp(4rem,8vw,8rem)] leading-[.8] tracking-[-.045em]">Call ahead,<br /><em>arrive easy.</em></h2></div><div className="border-l border-[#d8c8b9] pl-6"><div className="flex items-start gap-4"><MapPin size={18} className="mt-1 text-[#b98568]" /><p className="text-sm leading-6">Onhuno , helao nafidi</p></div><div className="mt-7 flex items-start gap-4"><Phone size={18} className="mt-1 text-[#b98568]" /><a href="tel:0813788797" className="text-sm leading-6 underline decoration-[#b98568]/40 underline-offset-4">081 378 8797</a></div><div className="mt-7 flex items-start gap-4"><Mail size={18} className="mt-1 text-[#b98568]" /><a href="mailto:oipapa2016@gmail.com" className="text-sm leading-6 underline decoration-[#b98568]/40 underline-offset-4">oipapa2016@gmail.com</a></div><a href="tel:0813788797" className="booking-cta mt-10 inline-flex items-center bg-[#2b1e18] px-6 py-4 text-[.7rem] font-bold uppercase tracking-[.14em] text-[#fbf8f2] transition hover:bg-[#49342b]">Book your stay <ArrowUpRight className="ml-3 h-4 w-4" /></a></div></div></section>

      <section id="booking" className="bg-[#e7dbcf] px-6 py-24 lg:px-12 lg:py-32"><div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div><p className="eyebrow text-[#b98568]">05 / Make an enquiry</p><Markers /><h2 className="serif mt-5 max-w-[430px] text-6xl leading-[.9] tracking-[-.04em] lg:text-7xl">Plan your<br /><em>stay.</em></h2><p className="mt-7 max-w-[320px] text-sm leading-6 text-[#75665c]">Tell us when you would like to arrive. We will check availability and reply directly by email.</p><p className="mt-10 text-[.68rem] uppercase tracking-[.14em] text-[#75665c]">Prefer to speak first? <a href="tel:0813788797" className="text-[#2b1e18] underline underline-offset-4">Call 081 378 8797</a></p></div><div>{bookingStatus === 'sent' ? <div className="border border-[#b98568] bg-[#f4eee5] p-8 lg:p-12"><p className="eyebrow text-[#b98568]">Enquiry received</p><h3 className="serif mt-4 text-5xl leading-none">Thank you.<br /><em>We’ll be in touch.</em></h3><p className="mt-6 max-w-[430px] text-sm leading-6 text-[#75665c]">Your booking request has been sent. We will confirm availability directly with you.</p><button type="button" onClick={() => setBookingStatus('idle')} className="mt-8 border-b border-[#2b1e18] pb-2 text-[.7rem] font-bold uppercase tracking-[.14em]">Send another enquiry <ArrowUpRight className="ml-2 inline h-4 w-4" /></button></div> : <form name="room-booking" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={submitBooking} className="grid gap-5 border-t border-[#cdbbae] pt-7"><input type="hidden" name="form-name" value="room-booking" /><input type="text" name="bot-field" className="hidden" tabIndex={-1} autoComplete="off" /><div className="grid gap-5 sm:grid-cols-2"><label className="form-label">Your name<input required name="name" autoComplete="name" className="form-input" /></label><label className="form-label">Email address<input required type="email" name="email" autoComplete="email" className="form-input" /></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="form-label">Phone number<input required name="phone" type="tel" autoComplete="tel" className="form-input" /></label><label className="form-label">Guests<select name="guests" className="form-input"><option>1 guest</option><option>2 guests</option><option>3 guests</option><option>4+ guests</option></select></label></div><div className="grid gap-5 sm:grid-cols-2"><label className="form-label">Arrival date<input required name="arrival" type="date" className="form-input" /></label><label className="form-label">Departure date<input required name="departure" type="date" className="form-input" /></label></div><label className="form-label">Room preference<select name="room" className="form-input"><option>Self-catering room</option><option>Any available room</option></select></label><label className="form-label">Anything we should know?<textarea name="message" rows={4} className="form-input resize-none" placeholder="Arrival time, special request, or a question…" /></label>{bookingStatus === 'error' && <p className="text-sm text-[#8f4f42]" role="alert">Something went wrong while sending. Please call 081 378 8797 or email oipapa2016@gmail.com.</p>}<button disabled={bookingStatus === 'sending'} type="submit" className="inline-flex w-fit items-center bg-[#2b1e18] px-6 py-4 text-[.7rem] font-bold uppercase tracking-[.14em] text-[#fbf8f2] transition hover:bg-[#49342b] disabled:opacity-60">{bookingStatus === 'sending' ? 'Sending…' : 'Send booking enquiry'} <ArrowUpRight className="ml-3 h-4 w-4" /></button><p className="text-[.68rem] leading-5 text-[#75665c]">Your details are used only to respond to this booking enquiry.</p></form>}</div></div></section>

      <footer className="bg-[#2b1e18] px-6 py-8 text-[#cdbbae] lg:px-12"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 text-[.67rem] uppercase tracking-[.14em] sm:flex-row"><p>© {new Date().getFullYear()} Oipapa Guesthouse</p><p>Onhuno , helao nafidi</p><a href="#top" className="text-[#f0d4bd]">Back to top ↑</a></div></footer>
    </main>
  );
}
