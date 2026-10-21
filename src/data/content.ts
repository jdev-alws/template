/**
 * All page copy and imagery lives here so the components stay presentational.
 * Images are Unsplash CDN URLs; swap any ID for your own photography.
 */
const u = (id: string, w = 1000, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`;

export const img = {
  heroBg: u('1544161515-4ab6ce6db874', 2000),
  massage: u('1540555700478-4be289fbecef', 900),
  massageB: u('1600334089648-b0d9d3028eb2', 900),
  spaTreatment: u('1600334129128-685c5582fd35', 900),
  facial: u('1570172619644-dfd03ed5d881', 900),
  facialB: u('1616394584738-fc6e612e71b9', 900),
  facialMask: u('1512290923902-8a9f81dc236c', 900),
  skincare: u('1556228720-195a672e8a03', 900),
  stones: u('1519823551278-64ac92734fb1', 900),
  candles: u('1507652313519-d4e9174996dd', 900),
  salon: u('1560750588-73207b1ef5b8', 900),
  salonB: u('1522337360788-8b13dee7a37e', 900),
  salonC: u('1600948836101-f9ffda59d250', 900),
  hairColour: u('1562322140-8baeececf3df', 900),
  nails: u('1604654894610-df63bc536371', 900),
  nailsB: u('1610992015732-2449b76344bc', 900),
  makeup: u('1519699047748-de8e457a634e', 900),
  skinPortrait: u('1487412947147-5cebf100ffc2', 1400),
  wellness: u('1515377905703-c4788e51af15', 900),
  // portraits
  w1: u('1494790108377-be9c29b29330', 700),
  w2: u('1438761681033-6461ffad8d80', 700),
  w3: u('1534528741775-53994a69daeb', 700),
  w4: u('1544005313-94ddf0286df2', 700),
  w5: u('1580489944761-15a19d654956', 700),
  w6: u('1517841905240-472988babdf9', 700),
  w7: u('1531746020798-e6953c6e8e04', 700),
  w8: u('1508214751196-bcfd4ca60f91', 700),
  m1: u('1500648767791-00dcc994a43e', 700),
  m2: u('1507003211169-0a1dd7228f2d', 700),
  m3: u('1506794778202-cad84cf45f1d', 700),
};

export const nav = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Academy', href: '#academy' },
  { label: 'Journal', href: '#journal' },
];

export const heroCards = [
  img.stones, img.facial, img.salon, img.massage, img.nails,
  img.facialMask, img.hairColour, img.candles, img.spaTreatment,
];

export const valueProps = [
  { icon: 'award', title: 'Certified Beauty Experts', text: 'Licensed, senior-trained specialists' },
  { icon: 'sparkles', title: 'Premium Treatments', text: 'Results-led rituals, every visit' },
  { icon: 'gem', title: 'Premium Products', text: 'Clean, professional-grade formulas' },
  { icon: 'shield-check', title: 'Trusted Results', text: 'Loved by 2,400+ returning guests' },
] as const;

export const features = [
  { icon: 'mirror', title: 'Trendy Styles', text: 'Always in Fashion' },
  { icon: 'lotus', title: 'Relaxing Ambience', text: 'Feel the Difference' },
  { icon: 'calendar', title: 'Easy Booking', text: 'Hassle Free' },
  { icon: 'bottle', title: 'Premium Products', text: 'Safe & Hair-Friendly' },
  { icon: 'dryer', title: 'Expert Stylists', text: 'Certified & Experienced' },
  { icon: 'sparkles', title: 'Personalized Care', text: 'Beauty, Your Way' },
] as const;

export const featurePortraits = [
  { image: img.w7, alt: 'Radiant guest with natural glow', label: 'Radiance Glow' },
  { image: img.w3, alt: 'Guest after luxury styling ritual', label: 'Trendy Style' },
];

export const satisfaction = {
  percent: 87,
  title: 'Our Happy Clients',
  subtitle: 'Come Back Again & Again',
  metrics: [
    { label: 'Clean & Hygienic', icon: 'bath' },
    { label: 'Luxury Experience', icon: 'leaf' },
    { label: 'Visible Results', icon: 'heart' },
  ],
};

export const reels = [
  { label: 'Precision Cut', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80', video: '' },
  { label: 'Botanical Facial', image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80', video: '' },
  { label: 'Balayage', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80', video: '' },
  { label: 'Colour Studio', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=80', video: '' },
  { label: 'Styling Floor', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80', video: '' },
];

export const services = [
  {
    title: 'Scalp Wash & Hydro-Therapy',
    text: 'A deep-cleansing scalp ritual using warm botanical water, steam and a slow pressure-point massage that resets the scalp and leaves hair weightless.',
    features: ['Steam-infused cleanse', 'Pressure-point massage', 'Botanical scalp serum', 'Blow-dry finish'],
    duration: '60 min',
    therapist: { name: 'Lucas Reynolds', role: 'Scalp & Trichology Expert', image: img.m3 },
    image: img.massageB,
  },
  {
    title: 'Luxury Nail Artistry',
    text: 'Sculpted, long-wearing nails shaped to your hands. Gentle cuticle care, a nourishing soak and hand-painted detail finished with a high-gloss seal.',
    features: ['Cuticle & shape care', 'Nourishing hand soak', 'Hand-painted detail', 'Chip-resistant gloss'],
    duration: '75 min',
    therapist: { name: 'Olivia Hayes', role: 'Nail Artistry Specialist', image: img.w5 },
    image: img.nails,
  },
  {
    title: 'Aromatherapy Scalp Therapy',
    text: 'Essential oils blended to your mood, warmed and massaged through the scalp, neck and shoulders to release tension and restore shine.',
    features: ['Custom oil blend', 'Neck & shoulder release', 'Warm towel wrap', 'Gloss treatment'],
    duration: '50 min',
    therapist: { name: 'Sophia Bennett', role: 'Senior Skin Therapist', image: img.w4 },
    image: img.spaTreatment,
  },
];

export const steps = [
  { title: 'Consult & Relax', text: 'We listen first: your goals, skin, hair and how much time you have.', image: img.makeup },
  { title: 'Cleanse & Prep', text: 'A gentle double cleanse prepares skin and scalp for treatment.', image: img.facialB },
  { title: 'Treat & Heal', text: 'Your therapist performs the ritual with products matched to you.', image: img.facial },
  { title: 'Refresh & Glow', text: 'Massage, mask and finishing touches seal in the result.', image: img.massage },
  { title: 'Maintain & Shine', text: 'You leave with a home-care plan and your next visit booked.', image: img.skincare },
];

export const plans = [
  { name: 'Basic Glow', price: 145, unit: 'Per session', duration: '60 min', image: img.facialMask,
    features: ['Hygienic skin cleanse', 'Facial steam & extraction', 'Hydrating mask', 'Hand & arm massage', 'Skin type consultation'] },
  { name: 'Radiant Care', price: 210, unit: 'Per session', duration: '90 min', image: img.spaTreatment, featured: true,
    features: ['Deep pore treatment', 'Vitamin C brightening', 'Lymphatic face massage', 'Scalp & shoulder release', 'Complimentary hair styling'] },
  { name: 'Luxury Beauty', price: 320, unit: 'Per session', duration: '120 min', image: img.salonC,
    features: ['Signature facial', 'Cut, colour gloss & blow-dry', 'Express manicure', 'Brow shaping & tint', 'Herbal tea ritual'] },
  { name: 'Ultimate Spa', price: 490, unit: 'Per session', duration: '180 min', image: img.stones,
    features: ['Full-body hot stone massage', 'Aromatherapy scalp therapy', 'Luxury nail artistry', 'Signature glow facial', 'Private suite & champagne'] },
];

export const courses = [
  { category: 'Business', title: 'Salon Business & Chair Rental', price: 1890, image: img.salonC,
    text: 'Build a profitable chair or studio: pricing, client retention, bookings and the numbers behind a full column.',
    weeks: '8 weeks', weekly: '4 hrs / week', mode: 'Hybrid', modeIcon: 'monitor' },
  { category: 'Hair', title: 'Colour Correction Intensive', price: 2450, image: img.hairColour,
    text: 'Fix banding, brassiness and box-dye disasters with confidence. Small cohorts, live models, senior colour educators.',
    weeks: '6 weeks', weekly: '6 hrs / week', mode: 'In person', modeIcon: 'map-pin' },
  { category: 'Wellness', title: 'Aromatherapy Scalp & Head Spa Therapy', price: 1290, image: img.massageB,
    text: 'Learn the Japanese-inspired head spa sequence, oil blending and pressure work behind our most booked ritual.',
    weeks: '4 weeks', weekly: '5 hrs / week', mode: 'In person', modeIcon: 'map-pin' },
] as const;

export const team = [
  { name: 'Ethan Parker', role: 'Spa & Wellness Lead', image: img.m1 },
  { name: 'Isabella Moore', role: 'Creative Colour Director', image: img.w1 },
  { name: 'Sophia Bennett', role: 'Senior Skin Therapist', image: img.w4 },
  { name: 'Olivia Hayes', role: 'Nail Artistry Specialist', image: img.w5 },
  { name: 'Liam Carter', role: 'Master Barber & Stylist', image: img.m2 },
  { name: 'Lucas Reynolds', role: 'Scalp & Trichology Expert', image: img.m3 },
];

export const testimonials = [
  { name: 'Amelia Ward', role: 'Radiant Care guest', image: img.w2,
    quote: 'I came in for a facial and left feeling like I’d had a week off. My skin hasn’t looked this even in years, and the team remembered every detail from my first visit.' },
  { name: 'Charlotte Kim', role: 'Colour Studio guest', image: img.w3,
    quote: 'Isabella corrected two years of uneven colour in one sitting. Honest advice, no upselling, and the most beautiful dimensional blonde I’ve ever had.' },
  { name: 'Natalie Brooks', role: 'Ultimate Spa guest', image: img.w6,
    quote: 'The hot stone ritual is the calmest three hours of my month. Every room smells incredible and nobody ever rushes you out the door.' },
  { name: 'Grace Turner', role: 'Nail Artistry guest', image: img.w7,
    quote: 'My nails lasted almost four weeks without a single chip. Olivia’s hand-painted detail gets compliments everywhere I go.' },
  { name: 'Hannah Lee', role: 'Head Spa guest', image: img.w8,
    quote: 'The aromatherapy scalp therapy fixed the tension headaches I’d had since spring. I book it every fortnight now.' },
];

export const posts = [
  { category: 'Skin Sanctuary', date: 'Oct 08, 2026', author: 'Sophia Bennett', image: img.facial,
    title: 'What to expect from your first professional facial',
    excerpt: 'From consultation to cool-down, a calm walk-through of a 60-minute treatment and how to prepare.' },
  { category: 'Therapy', date: 'Sep 26, 2026', author: 'Ethan Parker', image: img.massage,
    title: 'The case for monthly aromatherapy massage',
    excerpt: 'How regular, oil-based massage supports sleep, posture and stress, and the blends we reach for most.' },
  { category: 'Hair Artistry', date: 'Sep 12, 2026', author: 'Isabella Moore', image: img.salonB,
    title: 'Balayage vs. highlights: choosing the right lift',
    excerpt: 'A colourist’s guide to maintenance, cost and how each technique grows out over three months.' },
];

export const orbit = {
  inner: [img.w1, img.facial, img.w4, img.nails],
  outer: [img.m1, img.stones, img.w3, img.salon, img.w6, img.candles],
};

export const footerCols = [
  { title: 'Explore', links: [['Home', '#top'], ['About', '#about'], ['Services', '#services'], ['Pricing', '#pricing']] },
  { title: 'Company Info', links: [['Our team', '#team'], ['Academy', '#academy'], ['Journal', '#journal'], ['Careers', '#']] },
  { title: 'Support', links: [['Book online', '#book'], ['Gift cards', '#'], ['Privacy policy', '#'], ['Terms of service', '#']] },
] as const;

export const contact = {
  address: '24 Rosewood Avenue, London W1',
  phone: '+44 20 7946 0123',
  email: 'hello@glowence.com',
  hours: 'Tue – Sun, 9am – 8pm',
};
