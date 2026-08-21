import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { createScene } from './scene.js'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

/* Inline arrow — U+2197 renders as a colour emoji on iOS/Android, so it is drawn instead */
const ArrowUR = ({ className = '' }) => (
  <svg
    className={`icon-ar ${className}`}
    viewBox="0 0 12 12"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3.3 8.7 8.7 3.3M4.5 3.3h4.2v4.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CHAPTERS = ['arrival', 'architecture', 'interior', 'craft', 'lifestyle', 'stats', 'plan', 'collection', 'views', 'aesthetics', 'voices', 'compare', 'finale']

const RESIDENCES = [
  {
    name: 'The Horizon Residence',
    beds: 'Two Bedrooms',
    area: '168 m²',
    floors: 'Floors 8 – 16',
    price: 'From $6.4M',
    note: 'Double-aspect living over the river, with a winter garden that opens to the morning sun.',
  },
  {
    name: 'The Sky Residence',
    beds: 'Three Bedrooms',
    area: '242 m²',
    floors: 'Floors 17 – 27',
    price: 'From $9.8M',
    note: 'A full corner of the tower — salon, library, and a terrace held above the city’s noise.',
  },
  {
    name: 'The Sky Villa',
    beds: 'Four Bedrooms · Duplex',
    area: '388 m²',
    floors: 'Floors 28 – 35',
    price: 'From $16.5M',
    note: 'Two storeys joined by a sculpted bronze stair, with a private plunge pool in the sky.',
  },
  {
    name: 'The Penthouse',
    beds: 'Full Floor · Private Pool',
    area: '560 m²',
    floors: 'Floors 36 – 38',
    price: 'P.O.A.',
    note: 'The tower’s crown: one residence, one lift, three floors of horizon in every direction.',
  },
]

const VIEWS = [
  {
    cls: 'view-dawn',
    img: '/images/image 1.png',
    title: 'The River at Dawn',
    dir: 'East · Floors 8 – 20',
    desc: 'First light arrives over the water and pours the length of the residence. Mornings here are unhurried, gilded, entirely yours.',
  },
  {
    cls: 'view-skyline',
    img: '/images/image 2.png',
    title: 'The Skyline',
    dir: 'South · All Floors',
    desc: 'The city assembles itself into a single glittering line — near enough to feel, far enough to forget.',
  },
  {
    cls: 'view-park',
    img: '/images/image 3.png',
    title: 'The Royal Park',
    dir: 'West · Floors 12 – 30',
    desc: 'Four hundred acres of ancient oak canopies below your window, turning gold, then amber, then green again.',
  },
  {
    cls: 'view-sky360',
    img: '/images/image 4.png',
    title: 'The Open Sky',
    dir: '360° · Penthouse Only',
    desc: 'Above the last rooftop there is only weather, light, and silence. The penthouse keeps all three.',
  },
]

const MATERIALS = [
  ['mat-calacatta', 'Calacatta Oro', 'Book-matched · Tuscany'],
  ['mat-oak', 'Smoked Oak', 'Fumed & hand-planed'],
  ['mat-travertine', 'Silver Travertine', 'Vein-cut · unfilled'],
  ['mat-bronze', 'Champagne Bronze', 'Hand-patinated'],
  ['mat-basalt', 'Honed Basalt', 'Volcanic · matte'],
  ['mat-silk', 'Woven Silk', 'Atelier-dyed panels'],
]

const REVIEWS = [
  {
    quote:
      'We viewed every prime development from Knightsbridge to One Hyde Park. Nothing else felt inevitable. Elevia did.',
    name: 'J. Ashworth-Hale',
    role: 'Resident, Floor 34 · formerly Mayfair',
    stars: 5,
  },
  {
    quote:
      'The concierge arranged in an afternoon what our family office in London could not in a week. That is the difference.',
    name: 'S. Okonkwo-Vane',
    role: 'Resident, Floor 27 · formerly Chelsea',
    stars: 5,
  },
  {
    quote:
      'I have owned in three of the capital’s most celebrated towers. This is the first that is quieter inside than a country house.',
    name: 'The Hon. R. Calloway',
    role: 'Resident, Floor 31 · formerly Belgravia',
    stars: 5,
  },
]

const PRESS = [
  ['★★★★★', 'UK Property Awards — Best Luxury Residence'],
  ['9.8 / 10', 'Resident Satisfaction, Independent Survey 2026'],
  ['No. 1', 'Prime Residential Tower — London & UK, 2026'],
  ['100%', 'Of Owners Would Recommend Elevia'],
]

const COMPARE_ROWS = [
  ['Residences per floor', 'One — a private lift lobby each', 'Four to eight, shared corridors'],
  ['Ceiling height', '3.5 metres, floor-to-ceiling glass', '2.4–2.7 metres, standard'],
  ['Concierge', '24/7 dedicated team, 1:3 staff ratio', 'Front desk, office hours'],
  ['Skypool & wellness floor', 'Residents only, bookable privately', 'Shared with hotel guests'],
  ['Acoustic isolation', '68 dB party-wall rating', '45–50 dB, building regs minimum'],
  ['Service charge transparency', 'Fixed for five years, in writing', 'Reviewed annually, upward only'],
]

const NAV_MENUS = [
  {
    label: 'The Tower',
    items: [
      { t: 'Architecture', d: 'The form and the facade', hash: '#architecture' },
      { t: 'The Views', d: 'Choose your horizon', hash: '#views' },
      { t: 'Materials', d: 'A quiet inventory of ateliers', hash: '#aesthetics' },
      {
        t: 'The Architects',
        d: 'Studio, vision, provenance',
        body: 'Elevia is drawn by a Pritzker-laureate studio whose towers have redefined four skylines. Their brief was a single sentence: build a building that disappears into weather. A full monograph on the practice, the eleven-degree twist, and the kinetic facade will be published here soon.',
      },
    ],
  },
  {
    label: 'Residences',
    items: [
      { t: 'The Collection', d: 'Four ways to live in the sky', hash: '#collection' },
      { t: 'Penthouse 38', d: 'The floor plan', hash: '#plan' },
      {
        t: 'Availability',
        d: 'Current releases',
        body: 'Of twelve residences, five remain. Releases are made privately and in sequence, beginning with the Horizon Residences on floors 8 through 16. To receive the current schedule of availability and pricing, request the private portfolio through our enquiry desk.',
      },
      {
        t: 'Purchase Guide',
        d: 'From enquiry to key',
        body: 'Acquiring at Elevia follows five quiet steps: a private viewing, a reservation held for 28 days, exchange at 10 percent, staged payments tied to construction milestones, and completion with a two-year concierge settling-in service. The full guide, including UK stamp duty notes for domestic and overseas buyers, will be available here shortly.',
      },
    ],
  },
  {
    label: 'Lifestyle',
    items: [
      { t: 'Amenities', d: 'Skypool, cinema, cellar', hash: '#lifestyle' },
      {
        t: 'Concierge',
        d: '24/7 private service',
        body: 'A team of fourteen, led by a former head butler of a royal household, attends to twelve residences. Chauffeurs, chefs, florists, school runs, yacht provisioning — the concierge desk has never once said no. Their full service book is shared with residents on completion.',
      },
      {
        t: 'Wellness',
        d: 'Spa and longevity floor',
        body: 'Floor 6 is given entirely to wellness: a 25-metre skypool, cryotherapy and heat suites wrapped in eucalyptus steam, a private treatment wing, and a longevity clinic in partnership with a Harley Street practice. Detailed programmes will appear here ahead of opening.',
      },
    ],
  },
  {
    label: 'Company',
    items: [
      { t: 'Voices', d: 'Words from our residents', hash: '#voices' },
      { t: 'The Standard', d: 'Measured against UK prime', hash: '#compare' },
      {
        t: 'Press',
        d: 'Elevia in the news',
        body: 'Elevia has been named Best Luxury Residence at the UK Property Awards and ranked the No. 1 prime residential tower in the United Kingdom for 2026. Press enquiries and the media kit are available through press@elevia.residence. Selected coverage will be archived on this page.',
      },
      {
        t: 'Journal',
        d: 'Notes from above the clouds',
        body: 'A quarterly journal on architecture, craft, and the art of living at altitude — interviews with the ateliers behind every surface, essays on light and silence, and dispatches from the tower as it rises. The first issue arrives soon.',
      },
    ],
  },
]

const NAV_LINKS = [
  ['Home', '#arrival'],
  ['The Tower', '#architecture'],
  ['Interiors', '#interior'],
  ['Lifestyle', '#lifestyle'],
  ['Residences', '#plan'],
  ['Collection', '#collection'],
  ['Views', '#views'],
  ['Voices', '#voices'],
  ['Contact', '#finale'],
]

const ROOMS = {
  living: {
    name: 'Grand Salon',
    area: '86 m² · Double Height',
    desc: 'A nine-metre glass wall dissolves the boundary between salon and sky. Book-matched Calacatta, smoked oak, and a horizon that belongs to you alone.',
  },
  master: {
    name: 'Master Suite',
    area: '64 m² · East Light',
    desc: 'Wake to sunrise over the water. A private dressing gallery and travertine bath anchor the most serene room in the residence.',
  },
  kitchen: {
    name: 'Chef’s Kitchen',
    area: '38 m² · Bulthaup',
    desc: 'Hand-finished bronze, honed basalt counters, and a service corridor engineered for private chefs and effortless entertaining.',
  },
  terrace: {
    name: 'Sky Terrace',
    area: '112 m² · South-West',
    desc: 'An open-air room three hundred metres above the city — infinity pool, fire lounge, and evenings that refuse to end.',
  },
  study: {
    name: 'Library & Study',
    area: '29 m²',
    desc: 'Floor-to-ceiling walnut shelving and acoustic calm. The quietest address in the tower.',
  },
}

const SCRAMBLE_CHARS = 'ELEVIA·◆✦XKQZ'

function scramble(el) {
  const orig = el.dataset.text
  if (!orig || el._scrambling) return
  el._scrambling = true
  let frame = 0
  const iv = setInterval(() => {
    el.textContent = orig
      .split('')
      .map((c, i) =>
        c === ' ' ? ' ' : i < frame / 2 ? c : SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0]
      )
      .join('')
    frame++
    if (frame > orig.length * 2) {
      el.textContent = orig
      el._scrambling = false
      clearInterval(iv)
    }
  }, 28)
}

function SplitLines({ text }) {
  return (
    <span>
      {text.map((line, i) => (
        <span className="line" key={i}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </span>
      ))}
    </span>
  )
}

function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('has-cursor')
    const rx = gsap.quickTo(ringRef.current, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ringRef.current, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e) => {
      gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e) => {
      const hot = e.target.closest('a, button, .room, .burger, [data-hover]')
      gsap.to(ringRef.current, { scale: hot ? 2.4 : 1, opacity: hot ? 0.9 : 0.5, duration: 0.35 })
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.body.classList.remove('has-cursor')
    }
  }, [])
  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

function goTo(hash) {
  gsap.to(window, { scrollTo: { y: hash, autoKill: true }, duration: 1.6, ease: 'power3.inOut' })
}

export default function App() {
  const canvasRef = useRef(null)
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const [room, setRoom] = useState('living')
  const [menuOpen, setMenuOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [page, setPage] = useState(null)
  const overlayRef = useRef(null)
  const [portalOpen, setPortalOpen] = useState(false)
  const [portalTab, setPortalTab] = useState('enquire')
  const [sent, setSent] = useState(false)
  const portalRef = useRef(null)

  const openPortal = (tab) => {
    setPortalTab(tab)
    setSent(false)
    setMenuOpen(false)
    setPortalOpen(true)
  }

  // portal open/close cinematics
  useEffect(() => {
    const el = portalRef.current
    if (portalOpen) {
      document.body.classList.add('portal-lock')
      gsap.set(el, { visibility: 'visible', pointerEvents: 'auto' })
      const tl = gsap.timeline()
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(
          '.portal-side',
          { xPercent: -104 },
          { xPercent: 0, duration: 0.95, ease: 'power4.inOut' },
          0
        )
        .fromTo(
          '.portal-form-wrap',
          { xPercent: 104 },
          { xPercent: 0, duration: 0.95, ease: 'power4.inOut' },
          0
        )
        .fromTo(
          '.portal-anim',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'power3.out' },
          0.55
        )
    } else {
      document.body.classList.remove('portal-lock')
      const tl = gsap.timeline({
        onComplete: () => gsap.set(el, { visibility: 'hidden', pointerEvents: 'none' }),
      })
      tl.to('.portal-side', { xPercent: -104, duration: 0.7, ease: 'power4.in' }, 0)
        .to('.portal-form-wrap', { xPercent: 104, duration: 0.7, ease: 'power4.in' }, 0)
        .to(el, { opacity: 0, duration: 0.25 }, 0.55)
    }
  }, [portalOpen])

  // Esc closes the portal
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setPortalOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // fullscreen menu open/close
  useEffect(() => {
    const ov = overlayRef.current
    if (menuOpen) {
      gsap.to(ov, {
        clipPath: 'circle(150% at calc(100% - 3.5rem) 2.6rem)',
        duration: 1,
        ease: 'power3.inOut',
      })
      gsap.fromTo(
        '.menu-link',
        { yPercent: 120, opacity: 0, rotate: 4 },
        { yPercent: 0, opacity: 1, rotate: 0, stagger: 0.07, duration: 0.9, delay: 0.25, ease: 'power4.out' }
      )
      gsap.fromTo('.menu-meta', { opacity: 0 }, { opacity: 1, delay: 0.7, duration: 0.6 })
    } else {
      gsap.to(ov, {
        clipPath: 'circle(0% at calc(100% - 3.5rem) 2.6rem)',
        duration: 0.8,
        ease: 'power3.inOut',
      })
    }
  }, [menuOpen])

  useEffect(() => {
    const world = createScene(canvasRef.current)

    const ctx = gsap.context(() => {
      // ---- master scroll → 3D camera progress
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => world.setProgress(self.progress),
      })

      // ---- navbar: hide on scroll down, glass after leaving top
      let lastY = 0
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const nav = document.querySelector('.nav')
          const y = self.scroll()
          nav.classList.toggle('scrolled', y > 60)
          nav.classList.toggle('hidden', y > 300 && y > lastY)
          lastY = y
        },
      })

      // ---- chapter tracking for the side rail
      CHAPTERS.forEach((c, i) => {
        ScrollTrigger.create({
          trigger: `.ch-${c}`,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })

      // ---- LIGHT ACTS: circular portal wipe into ivory and back out, per zone.
      // The wash radius is computed from all zones each tick — radius 0 (dark)
      // unless the viewport is inside a zone's open/close ramp.
      const wash = document.querySelector('.theme-wash')
      const washZones = gsap.utils.toArray('.light-zone').map((zone) => [
        ScrollTrigger.create({ trigger: zone, start: 'top 90%', end: 'top 15%' }),
        ScrollTrigger.create({ trigger: zone, start: 'bottom 85%', end: 'bottom 20%' }),
      ])
      const washState = { r: 0 }
      const updateWash = () => {
        let target = 0
        washZones.forEach(([open, close]) => {
          target = Math.max(target, Math.min(open.progress, 1 - close.progress) * 120)
        })
        gsap.to(washState, {
          r: target,
          duration: 0.25,
          ease: 'power1.out',
          overwrite: true,
          onUpdate: () => {
            wash.style.clipPath = `circle(${washState.r}% at 50% 55%)`
          },
        })
      }
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: updateWash, onRefresh: updateWash })

      gsap.utils.toArray('.light-zone').forEach((zone) => {
        ScrollTrigger.create({
          trigger: zone,
          start: 'top 45%',
          end: 'bottom 55%',
          onToggle: (self) => document.body.classList.toggle('light', self.isActive),
        })
      })

      // ---- ARRIVAL
      gsap.fromTo(
        '.ch-arrival .line > span',
        { yPercent: 110, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.12, ease: 'power4.out', delay: 0.4 }
      )
      gsap.fromTo('.hero-sub, .scroll-cue', { opacity: 0 }, { opacity: 1, duration: 1.4, delay: 1.5 })
      gsap.to('.ch-arrival .hero-inner', {
        scrollTrigger: { trigger: '.ch-arrival', start: 'top top', end: 'bottom top', scrub: 0.6 },
        yPercent: -60,
        opacity: 0,
        letterSpacing: '0.2em',
        scale: 1.12,
        ease: 'none',
      })

      // ---- pinned narrative chapters
      const pinned = [
        ['.ch-architecture', 1],
        ['.ch-interior', -1],
        ['.ch-lifestyle', 1],
      ]
      pinned.forEach(([sel, dir]) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sel, start: 'top top', end: '+=180%', pin: true, scrub: 0.8 },
        })
        tl.fromTo(
          `${sel} .giant-word`,
          { xPercent: 30 * dir, opacity: 0 },
          { xPercent: -30 * dir, opacity: 1, ease: 'none', duration: 3 },
          0
        )
          .fromTo(
            `${sel} .chapter-copy`,
            { y: 120, opacity: 0, filter: 'blur(12px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
            0.3
          )
          .fromTo(
            `${sel} .float-card`,
            { y: 90, opacity: 0, rotate: -2 },
            { y: -40, opacity: 1, rotate: 0, stagger: 0.25, duration: 1.4 },
            0.6
          )
          .to(`${sel} .chapter-copy`, { y: -80, opacity: 0, filter: 'blur(8px)', duration: 1 }, 2.2)
          .to(`${sel} .float-card`, { y: -140, opacity: 0, stagger: 0.1, duration: 0.9 }, 2.3)
      })

      // ---- 3D tilt on float cards
      gsap.utils.toArray('.float-card').forEach((card) => {
        const qx = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' })
        const qy = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' })
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect()
          qx(((e.clientX - r.left) / r.width - 0.5) * 22)
          qy(-((e.clientY - r.top) / r.height - 0.5) * 22)
        })
        card.addEventListener('mouseleave', () => {
          qx(0)
          qy(0)
        })
      })

      // ---- CRAFT marquee rows drift with scroll on top of their CSS loop
      gsap.to('.mq-a', {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: '.ch-craft', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.mq-b', {
        xPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: '.ch-craft', start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
      gsap.fromTo(
        '.craft-caption',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: '.ch-craft', start: 'top 70%', end: 'center center', scrub: 0.6 },
        }
      )

      // ---- STATS
      const stats = gsap.utils.toArray('.stat .num i')
      const statTl = gsap.timeline({
        scrollTrigger: { trigger: '.ch-stats', start: 'top top', end: '+=140%', pin: true, scrub: 0.7 },
      })
      statTl.fromTo('.ch-stats .stat', { y: 100, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 1 }, 0)
      statTl.to('.ch-stats .rule', { height: 70, stagger: 0.2, duration: 1 }, 0.4)
      stats.forEach((el) => {
        const end = parseFloat(el.dataset.value)
        const obj = { v: 0 }
        statTl.to(
          obj,
          {
            v: end,
            duration: 1.6,
            ease: 'power1.out',
            onUpdate: () => {
              el.textContent = end % 1 === 0 ? Math.round(obj.v) : obj.v.toFixed(1)
            },
          },
          0.4
        )
      })
      statTl.to('.ch-stats .stats-inner', { opacity: 0, y: -70, duration: 0.8 }, 2.4)

      // ---- PLAN
      const planTl = gsap.timeline({
        scrollTrigger: { trigger: '.ch-plan', start: 'top top', end: '+=160%', pin: true, scrub: 0.7 },
      })
      planTl.fromTo(
        '.plan-svg .room',
        { opacity: 0, scale: 0.94, transformOrigin: '50% 50%' },
        { opacity: 1, scale: 1, stagger: 0.18, duration: 0.8, ease: 'power2.out' },
        0
      )
      planTl.fromTo('.plan-svg text', { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0.7)
      planTl.fromTo('.plan-info', { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 0.5)
      planTl.to({}, { duration: 1.2 })

      // ---- COLLECTION: residence cards rise in sequence
      gsap.fromTo(
        '.collection-head',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: '.ch-collection', start: 'top 75%', end: 'top 35%', scrub: 0.6 },
        }
      )
      gsap.utils.toArray('.res-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 140, opacity: 0, rotate: i % 2 ? 1.5 : -1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 55%', scrub: 0.6 },
          }
        )
      })

      // ---- VIEWS: horizontal cinematic gallery
      const track = document.querySelector('.views-track')
      const viewsTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: '.ch-views',
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      gsap.utils.toArray('.view-panel').forEach((panel) => {
        gsap.fromTo(
          panel.querySelector('.view-scene'),
          { scale: 1.18, filter: 'saturate(0.7)' },
          {
            scale: 1,
            filter: 'saturate(1)',
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: viewsTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          }
        )
        gsap.fromTo(
          panel.querySelector('.view-caption'),
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: viewsTween,
              start: 'left 85%',
              end: 'left 45%',
              scrub: true,
            },
          }
        )
      })

      // ---- AESTHETICS: swatches unveil top-down, copy drifts in
      gsap.fromTo(
        '.aes-copy',
        { opacity: 0, y: 90, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          scrollTrigger: { trigger: '.ch-aesthetics', start: 'top 75%', end: 'top 35%', scrub: 0.6 },
        }
      )
      gsap.fromTo(
        '.swatch',
        { clipPath: 'inset(100% 0 0 0)', y: 40 },
        {
          clipPath: 'inset(0% 0 0 0)',
          y: 0,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.swatch-grid', start: 'top 85%', end: 'top 40%', scrub: 0.6 },
        }
      )

      // ---- VOICES: cards rise + tilt in, stars pop, press counters fade up
      gsap.fromTo(
        '.voices-head',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: '.ch-voices', start: 'top 75%', end: 'top 35%', scrub: 0.6 },
        }
      )
      gsap.fromTo(
        '.review-card',
        { y: 120, opacity: 0, rotate: (i) => (i - 1) * 2.5 },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.reviews-row', start: 'top 85%', end: 'top 40%', scrub: 0.7 },
        }
      )
      gsap.fromTo(
        '.review-card .star',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.05,
          ease: 'back.out(2.5)',
          scrollTrigger: { trigger: '.reviews-row', start: 'top 60%', end: 'top 30%', scrub: 0.6 },
        }
      )
      gsap.fromTo(
        '.press-item',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          scrollTrigger: { trigger: '.press-row', start: 'top 90%', end: 'top 55%', scrub: 0.6 },
        }
      )

      // ---- COMPARE: rows draw in one by one, Elevia column glows
      gsap.fromTo(
        '.compare-head',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: { trigger: '.ch-compare', start: 'top 75%', end: 'top 40%', scrub: 0.6 },
        }
      )
      gsap.utils.toArray('.compare-table .cmp-row').forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, x: i % 2 ? 60 : -60 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: row, start: 'top 92%', end: 'top 65%', scrub: 0.5 },
          }
        )
      })

      // ---- FINALE
      gsap.fromTo(
        '.finale-inner',
        { opacity: 0, y: 120, scale: 0.96 },
        {
          scrollTrigger: { trigger: '.ch-finale', start: 'top 70%', end: 'center center', scrub: 0.8 },
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'none',
        }
      )
    }, rootRef)

    // ---- magnetic elements (outside context: plain listeners)
    const magnets = document.querySelectorAll('.magnetic')
    const magHandlers = []
    magnets.forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
      const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
      const move = (e) => {
        const r = el.getBoundingClientRect()
        x((e.clientX - r.left - r.width / 2) * 0.35)
        y((e.clientY - r.top - r.height / 2) * 0.35)
      }
      const leave = () => {
        x(0)
        y(0)
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      magHandlers.push([el, move, leave])
    })

    return () => {
      magHandlers.forEach(([el, move, leave]) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
      ctx.revert()
      world.dispose()
      document.body.classList.remove('light')
    }
  }, [])

  const r = ROOMS[room]

  const navigate = (hash) => {
    setMenuOpen(false)
    goTo(hash)
  }

  return (
    <div ref={rootRef}>
      <canvas ref={canvasRef} className="webgl" />
      <div className="theme-wash" />
      <div className="vignette" />
      <div className="film-grain" />
      <Cursor />

      {/* ------------------------------------------------ policy bar */}
      <div className={`policybar ${policyOpen ? 'is-open' : ''}`}>
        <div className="pb-inner">
          <button
            className="pb-toggle magnetic"
            aria-expanded={policyOpen}
            onClick={() => setPolicyOpen((v) => !v)}
          >
            <i className="pb-dot" />
            <span className="pb-label">Built by Hamza</span>
            <i className="pb-caret" />
          </button>

          <div className="pb-ticker" onClick={() => setPolicyOpen((v) => !v)}>
            <div className="pb-track">
              {[0, 1].map((k) => (
                <span className="pb-run" key={k}>
                  <b>Designed, built &amp; animated by Hamza Iqbal</b>
                  <i>·</i>
                  No template, no stock, no borrowed craft
                  <i>·</i>
                  Every image AI generated — copyright free
                  <i>·</i>
                  <b>Open for work &amp; commissions</b>
                  <i>·</i>
                  Want a site people stop scrolling for?
                  <i>·</i>
                </span>
              ))}
            </div>
          </div>

          <a
            className="pb-cta magnetic"
            href="https://hamzakanth.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pb-cta-glow" />
            <span className="pb-cta-text">Hire Me</span>
            <ArrowUR className="pb-cta-arrow" />
          </a>
        </div>

        <div className="pb-panel" aria-hidden={!policyOpen}>
          <div className="pb-panel-inner">
            <div className="pb-col">
              <span className="pb-k">01 — The Craft</span>
              <p className="pb-v">
                Every frame here is mine — layout, light, motion and type. Built from nothing,
                held under my <em>personal use</em>.
              </p>
            </div>
            <div className="pb-col">
              <span className="pb-k">02 — The Imagery</span>
              <p className="pb-v">
                All visuals are <em>AI generated</em> and copyright free. Nothing licensed, nothing
                borrowed, nothing to clear.
              </p>
            </div>
            <div className="pb-col">
              <span className="pb-k">03 — The Offer</span>
              <p className="pb-v">
                Landing pages, product sites, 3D &amp; scroll storytelling by{' '}
                <em>Hamza Iqbal</em>. Let&rsquo;s make yours the one they remember.
              </p>
              <a
                className="pb-panel-cta"
                href="https://hamzakanth.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                See the work <ArrowUR />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ navbar */}
      <nav className="nav">
        <a className="brand magnetic" href="#arrival" onClick={(e) => (e.preventDefault(), navigate('#arrival'))}>
          ELEVIA<span>.</span>
        </a>
        <div className="nav-links">
          {NAV_MENUS.map((menu) => (
            <div className="nav-item" key={menu.label}>
              <span className="nav-link">
                {menu.label}
                <i className="nav-caret" />
              </span>
              <div className="dropdown">
                <div className="dropdown-panel">
                  {menu.items.map((item) => (
                    <a
                      key={item.t}
                      href={item.hash || '#'}
                      className="dd-item"
                      onClick={(e) => {
                        e.preventDefault()
                        if (item.hash) navigate(item.hash)
                        else setPage(item)
                      }}
                    >
                      <span className="dd-title">{item.t}</span>
                      <span className="dd-desc">{item.d}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-signin magnetic" onClick={() => openPortal('signin')}>
            Sign In
          </button>
          <button className="nav-cta magnetic" onClick={() => openPortal('enquire')}>
            Enquire
          </button>
          <button
            className={`burger magnetic ${menuOpen ? 'open' : ''}`}
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ------------------------------------------------ fullscreen menu */}
      <div ref={overlayRef} className={`menu-overlay ${menuOpen ? 'is-open' : ''}`}>
        <div className="menu-links">
          {NAV_LINKS.map(([label, hash], i) => (
            <div className="menu-line" key={hash}>
              <a
                href={hash}
                className="menu-link"
                data-text={label}
                onMouseEnter={(e) => scramble(e.currentTarget)}
                onClick={(e) => (e.preventDefault(), navigate(hash))}
              >
                <i>0{i + 1}</i> {label}
              </a>
            </div>
          ))}
        </div>
        <div className="menu-meta">
          <span>private@elevia.residence</span>
          <span>By Appointment Only</span>
          <span>MMXXVI</span>
        </div>
      </div>

      {/* ------------------------------------------------ portal: sign in / enquire */}
      <div ref={portalRef} className="portal" aria-hidden={!portalOpen}>
        <button className="portal-close" aria-label="Close" onClick={() => setPortalOpen(false)}>
          <span />
          <span />
        </button>

        {/* left — brand panel */}
        <div className="portal-side">
          <div className="ps-orb" />
          <div className="ps-frame" />
          <div className="ps-top portal-anim">
            <button
              className="ps-brand"
              title="Return to the residence"
              onClick={() => setPortalOpen(false)}
            >
              ELEVIA<span>.</span>
            </button>
            <div className="ps-tag">Residences Above the Clouds</div>
          </div>
          <div className="ps-mid portal-anim">
            <h2>
              A private address,
              <br />
              <em>quietly kept.</em>
            </h2>
            <div className="ps-rule" />
            <p>
              Twelve residences. One concierge who answers before the second ring. Enquiries are
              read personally, and viewings are held for one party at a time.
            </p>
          </div>
          <div className="ps-meta portal-anim">
            <div>
              <span>Viewings</span>By appointment · Mon — Sat
            </div>
            <div>
              <span>Private line</span>+44 20 7946 0038
            </div>
            <div>
              <span>Write</span>private@elevia.residence
            </div>
          </div>
        </div>

        {/* right — forms */}
        <div className="portal-form-wrap">
          <button className="portal-back portal-anim" onClick={() => setPortalOpen(false)}>
            <span>←</span> Back to the residence
          </button>
          <div className="portal-tabs portal-anim">
            <button
              className={portalTab === 'enquire' ? 'on' : ''}
              onClick={() => (setPortalTab('enquire'), setSent(false))}
            >
              Enquire
            </button>
            <button
              className={portalTab === 'signin' ? 'on' : ''}
              onClick={() => (setPortalTab('signin'), setSent(false))}
            >
              Resident Sign In
            </button>
            <div className={`tab-ink ${portalTab}`} />
          </div>

          {!sent && portalTab === 'enquire' && (
            <form
              key="enquire"
              className="portal-form"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <div className="pf-head portal-anim">
                <span className="kicker">Private Enquiry</span>
                <h3>Request a viewing</h3>
              </div>
              <div className="pf-grid">
                <label className="field portal-anim">
                  <input type="text" placeholder=" " required autoComplete="name" />
                  <span>Full Name</span>
                  <i />
                </label>
                <label className="field portal-anim">
                  <input type="email" placeholder=" " required autoComplete="email" />
                  <span>Email Address</span>
                  <i />
                </label>
                <label className="field portal-anim">
                  <input type="tel" placeholder=" " autoComplete="tel" />
                  <span>Telephone (optional)</span>
                  <i />
                </label>
                <label className="field portal-anim">
                  <select defaultValue="" required>
                    <option value="" disabled></option>
                    {RESIDENCES.map((res) => (
                      <option key={res.name}>{res.name}</option>
                    ))}
                    <option>Undecided — advise me</option>
                  </select>
                  <span className="select-label">Residence of interest</span>
                  <i />
                </label>
                <label className="field field-wide portal-anim">
                  <textarea rows="3" placeholder=" " />
                  <span>Your message (optional)</span>
                  <i />
                </label>
              </div>
              <div className="pf-foot portal-anim">
                <button type="submit" className="portal-cta">
                  <em>Request Private Viewing</em>
                </button>
                <p>Answered personally within 24 hours. Never shared, never resold.</p>
              </div>
            </form>
          )}

          {!sent && portalTab === 'signin' && (
            <form
              key="signin"
              className="portal-form"
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <div className="pf-head portal-anim">
                <span className="kicker">Residents & Owners</span>
                <h3>Welcome back</h3>
              </div>
              <div className="pf-grid">
                <label className="field field-wide portal-anim">
                  <input type="email" placeholder=" " required autoComplete="email" />
                  <span>Email Address</span>
                  <i />
                </label>
                <label className="field field-wide portal-anim">
                  <input type="password" placeholder=" " required autoComplete="current-password" />
                  <span>Password</span>
                  <i />
                </label>
              </div>
              <label className="pf-check portal-anim">
                <input type="checkbox" />
                <span className="box" />
                Remember this device
              </label>
              <div className="pf-foot portal-anim">
                <button type="submit" className="portal-cta">
                  <em>Enter the Residence</em>
                </button>
                <p>
                  Access is extended to residents and their appointed advisors.{' '}
                  <button
                    type="button"
                    className="pf-link"
                    onClick={() => setPortalTab('enquire')}
                  >
                    Request access
                  </button>
                </p>
              </div>
            </form>
          )}

          {sent && (
            <div className="portal-sent">
              <svg viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="44" />
                <path d="M30 50 L43 62 L67 36" />
              </svg>
              <h3>{portalTab === 'enquire' ? 'Received, with thanks.' : 'Welcome home.'}</h3>
              <p>
                {portalTab === 'enquire'
                  ? 'Your enquiry is already on its way to our director of residences. Expect a personal reply within the day.'
                  : 'Your residence portal is being prepared. You will be redirected momentarily.'}
              </p>
              <button className="pf-link" onClick={() => setSent(false)}>
                ← Back
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ dummy pages */}
      {page && (
        <div className="page-overlay" onClick={(e) => e.target === e.currentTarget && setPage(null)}>
          <div className="page-card">
            <button className="page-close" aria-label="Close" onClick={() => setPage(null)}>
              ✕
            </button>
            <span className="kicker">Elevia — {page.d}</span>
            <h2 className="display page-title">{page.t}</h2>
            <div className="page-rule" />
            <p className="page-body">{page.body}</p>
            <div className="page-actions">
              <button className="cta" onClick={() => setPage(null)}>
                Return to the Tower
              </button>
            </div>
            <div className="page-meta">
              <span>private@elevia.residence</span>
              <span>By Appointment Only</span>
              <span>MMXXVI</span>
            </div>
          </div>
        </div>
      )}

      <div className="chrome">
        <div className="progress-rail">
          {CHAPTERS.map((c, i) => (
            <div key={c} className={`dot ${i === active ? 'active' : ''}`} />
          ))}
        </div>
        <div className="chapter-chip">
          <div className="chip-top">
            <span className="chip-num">{String(active + 1).padStart(2, '0')}</span>
            <span className="chip-total">/ {String(CHAPTERS.length).padStart(2, '0')}</span>
            <span className="chip-name">{CHAPTERS[active]}</span>
          </div>
          <div className="chip-track">
            <div
              className="chip-fill"
              style={{ width: `${((active + 1) / CHAPTERS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main>
        {/* 01 — ARRIVAL */}
        <section id="arrival" className="chapter ch-arrival">
          <div className="pin-stage" style={{ flexDirection: 'column' }}>
            <div className="hero-inner">
              <h1 className="display hero-title">
                <SplitLines text={['Your Sanctuary', 'In The <em>Clouds</em>']} />
              </h1>
              <p className="hero-sub">
                The most iconic of all addresses will now be
                <br />
                the location of the grandest residence of all.
              </p>
            </div>
            <div className="scroll-cue">Scroll to Explore</div>
          </div>
        </section>

        {/* 02 — ARCHITECTURE */}
        <section id="architecture" className="chapter ch-architecture">
          <div className="pin-stage">
            <div className="giant-word" style={{ top: '12%' }}>Architecture</div>
            <div className="chapter-copy copy-left">
              <span className="kicker">Chapter II — The Form</span>
              <h2 className="display">
                Sculpted by <em>light,</em>
                <br />
                engineered in silence
              </h2>
              <p>
                A monolith of low-iron glass and champagne bronze, the tower turns eleven degrees
                as it rises — so every residence faces the water, and no two ever share a view.
                The facade breathes: kinetic fins temper the sun by day and become a lantern by
                night.
              </p>
            </div>
            <div className="float-card" style={{ right: '10vw', top: '22%' }}>
              <div className="fc-label">Facade</div>
              <div className="fc-value">Kinetic Bronze</div>
            </div>
            <div className="float-card" style={{ right: '18vw', bottom: '18%' }}>
              <div className="fc-label">Twist</div>
              <div className="fc-value">11° Rise</div>
            </div>
          </div>
        </section>

        {/* ---- LIGHT ACT ---- */}
        <div className="light-zone">
          {/* 03 — INTERIOR */}
          <section id="interior" className="chapter ch-interior">
            <div className="pin-stage">
              <div className="orb orb-1" />
              <div className="orb orb-2" />
              <div className="orb orb-3" />
              <div className="giant-word" style={{ bottom: '10%' }}>Interior</div>
              <div className="chapter-copy copy-right">
                <span className="kicker">Chapter III — Within</span>
                <h2 className="display">
                  Rooms that <em>breathe</em>
                  <br />
                  with the horizon
                </h2>
                <p>
                  Ceilings of three and a half metres. Walls that retract entirely. Interiors by
                  Atelier Marchetti pair silver travertine with smoked oak and hand-woven silk —
                  every material chosen to hold the evening light a moment longer.
                </p>
              </div>
              <div className="float-card" style={{ left: '10vw', top: '20%' }}>
                <div className="fc-label">Ceilings</div>
                <div className="fc-value">3.5 Metres</div>
              </div>
              <div className="float-card" style={{ left: '16vw', bottom: '22%' }}>
                <div className="fc-label">Interiors</div>
                <div className="fc-value">Atelier Marchetti</div>
              </div>
            </div>
          </section>

          {/* 04 — CRAFT marquee */}
          <section id="craft" className="chapter ch-craft">
            <div className="craft-stage">
              <div className="orb orb-2" style={{ top: '10%', left: '70%' }} />
              <div className="marquee">
                <div className="marquee-track mq-a">
                  {[0, 1].map((k) => (
                    <span key={k}>
                      Calacatta Marble · Smoked Oak · <em>Hand-Woven Silk</em> · Champagne Bronze ·
                      Silver Travertine ·&nbsp;
                    </span>
                  ))}
                </div>
              </div>
              <div className="marquee">
                <div className="marquee-track mq-b">
                  {[0, 1].map((k) => (
                    <span key={k}>
                      <em>Atelier Crafted</em> · Bulthaup · Lutron · Bang &amp; Olufsen · Private
                      Gallery Lighting ·&nbsp;
                    </span>
                  ))}
                </div>
              </div>
              <p className="craft-caption">
                Every surface in Elevia is drawn, sourced, and finished by hand — a quiet
                inventory of the world's most patient ateliers.
              </p>
            </div>
          </section>
        </div>

        {/* 05 — LIFESTYLE */}
        <section id="lifestyle" className="chapter ch-lifestyle">
          <div className="pin-stage">
            <div className="giant-word" style={{ top: '14%' }}>Lifestyle</div>
            <div className="chapter-copy copy-left">
              <span className="kicker">Chapter V — The Life</span>
              <h2 className="display">
                Evenings measured
                <br />
                in <em>golden hours</em>
              </h2>
              <p>
                A 25-metre skypool suspended between floors 29 and 30. Private cinema, cigar
                lounge, sommelier-curated cellar, and a wellness floor wrapped in eucalyptus
                steam. Your concierge knows the city; the city does not know you.
              </p>
            </div>
            <div className="float-card" style={{ right: '9vw', top: '24%' }}>
              <div className="fc-label">Skypool</div>
              <div className="fc-value">25 m · Fl. 29</div>
            </div>
            <div className="float-card" style={{ right: '17vw', bottom: '16%' }}>
              <div className="fc-label">Service</div>
              <div className="fc-value">24 / 7 Concierge</div>
            </div>
          </div>
        </section>

        {/* 06 — STATISTICS */}
        <section id="stats" className="chapter ch-stats">
          <div className="pin-stage">
            <div className="stats-inner" style={{ textAlign: 'center' }}>
              <span className="kicker">Chapter VI — In Numbers</span>
              <div className="stats-wrap">
                <div className="stat">
                  <div className="num"><i data-value="300">0</i>m</div>
                  <div className="rule" />
                  <div className="lbl">Above the City</div>
                </div>
                <div className="stat">
                  <div className="num"><i data-value="12">0</i></div>
                  <div className="rule" />
                  <div className="lbl">Residences Only</div>
                </div>
                <div className="stat">
                  <div className="num"><i data-value="4.5">0</i>m</div>
                  <div className="rule" />
                  <div className="lbl">Glass Height</div>
                </div>
                <div className="stat">
                  <div className="num"><i data-value="360">0</i>°</div>
                  <div className="rule" />
                  <div className="lbl">Of Horizon</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — FLOOR PLAN */}
        <section id="plan" className="chapter ch-plan">
          <div className="pin-stage">
            <div className="plan-stage">
              <svg className="plan-svg" viewBox="0 0 300 210">
                <rect className={`room ${room === 'living' ? 'lit' : ''}`} x="10" y="10" width="150" height="120" onMouseEnter={() => setRoom('living')} />
                <text x="55" y="72">Grand Salon</text>
                <rect className={`room ${room === 'kitchen' ? 'lit' : ''}`} x="10" y="134" width="90" height="66" onMouseEnter={() => setRoom('kitchen')} />
                <text x="30" y="170">Kitchen</text>
                <rect className={`room ${room === 'study' ? 'lit' : ''}`} x="104" y="134" width="56" height="66" onMouseEnter={() => setRoom('study')} />
                <text x="116" y="170">Study</text>
                <rect className={`room ${room === 'master' ? 'lit' : ''}`} x="164" y="10" width="86" height="100" onMouseEnter={() => setRoom('master')} />
                <text x="182" y="62">Master</text>
                <rect className={`room ${room === 'terrace' ? 'lit' : ''}`} x="164" y="114" width="126" height="86" onMouseEnter={() => setRoom('terrace')} />
                <text x="200" y="160">Terrace</text>
                <rect className="room" x="254" y="10" width="36" height="100" />
                <text x="258" y="62">Bath</text>
              </svg>
              <div className="plan-info">
                <span className="kicker">Chapter VII — Penthouse 38</span>
                <h3>{r.name}</h3>
                <div className="area">{r.area}</div>
                <p>{r.desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---- LIGHT ACT II — the residences in detail ---- */}
        <div className="light-zone">
          {/* 08 — THE COLLECTION */}
          <section id="collection" className="chapter ch-collection">
            <div className="collection-stage">
              <div className="orb orb-1" style={{ top: '-14vw' }} />
              <div className="orb orb-3" style={{ top: '55%', left: '75%' }} />
              <div className="collection-head">
                <span className="kicker">Chapter VIII — The Collection</span>
                <h2 className="display">
                  Twelve residences,
                  <br />
                  <em>four ways</em> to live in the sky
                </h2>
                <p className="collection-sub">
                  From a pied-à-terre above the river to the crown of the tower itself — each
                  residence type occupies its own altitude, its own light, its own silence.
                </p>
              </div>
              <div className="res-grid">
                {RESIDENCES.map((res, i) => (
                  <article className="res-card" key={res.name}>
                    <div className="res-index">0{i + 1}</div>
                    <h3>{res.name}</h3>
                    <div className="res-specs">
                      <span>{res.beds}</span>
                      <span>{res.area}</span>
                      <span>{res.floors}</span>
                    </div>
                    <p>{res.note}</p>
                    <div className="res-price">{res.price}</div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 09 — THE VIEWS (horizontal gallery) */}
          <section id="views" className="chapter ch-views">
            <div className="views-viewport">
              <div className="views-track">
                <div className="views-intro">
                  <span className="kicker">Chapter IX — The Views</span>
                  <h2 className="display">
                    Choose your
                    <br />
                    <em>horizon</em>
                  </h2>
                  <p>Scroll — the tower turns for you.</p>
                </div>
                {VIEWS.map((v) => (
                  <div className="view-panel" key={v.cls}>
                    <div className={`view-scene ${v.cls}`}>
                      <img className="view-img" src={v.img} alt={v.title} loading="lazy" />
                    </div>
                    <div className="view-caption">
                      <span className="view-dir">{v.dir}</span>
                      <h3>{v.title}</h3>
                      <p>{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 10 — AESTHETICS */}
          <section id="aesthetics" className="chapter ch-aesthetics">
            <div className="aes-stage">
              <div className="orb orb-2" style={{ top: '8%', left: '-10vw' }} />
              <div className="aes-copy">
                <span className="kicker">Chapter X — Inner Aesthetics</span>
                <h2 className="display">
                  A palette drawn
                  <br />
                  from <em>quiet places</em>
                </h2>
                <p>
                  Atelier Marchetti composed each residence like a still life: stone that has
                  waited millennia, timber smoked to dusk, silk that carries the light across the
                  room. Nothing shines — everything glows.
                </p>
              </div>
              <div className="swatch-grid">
                {MATERIALS.map(([cls, name, origin]) => (
                  <div className={`swatch ${cls}`} key={cls}>
                    <div className="swatch-face" />
                    <div className="swatch-label">
                      <span className="sw-name">{name}</span>
                      <span className="sw-origin">{origin}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* 11 — VOICES (testimonials) */}
        <section id="voices" className="chapter ch-voices">
          <div className="voices-stage">
            <div className="giant-word" style={{ top: '4%' }}>Voices</div>
            <div className="voices-head">
              <span className="kicker">Chapter XI — In Their Words</span>
              <h2 className="display">
                Trusted by those who
                <br />
                could live <em>anywhere</em>
              </h2>
            </div>
            <div className="reviews-row">
              {REVIEWS.map((rv, i) => (
                <figure className="review-card" key={i}>
                  <div className="stars" aria-label={`${rv.stars} out of 5 stars`}>
                    {Array.from({ length: rv.stars }).map((_, s) => (
                      <span className="star" key={s}>✦</span>
                    ))}
                  </div>
                  <blockquote>“{rv.quote}”</blockquote>
                  <figcaption>
                    <span className="rv-name">{rv.name}</span>
                    <span className="rv-role">{rv.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="press-row">
              {PRESS.map(([big, small], i) => (
                <div className="press-item" key={i}>
                  <div className="press-big">{big}</div>
                  <div className="press-small">{small}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 09 — THE STANDARD (UK comparison) */}
        <section id="compare" className="chapter ch-compare">
          <div className="compare-stage">
            <div className="compare-head">
              <span className="kicker">Chapter XII — The Standard</span>
              <h2 className="display">
                Measured against the
                <br />
                <em>finest</em> in the United Kingdom
              </h2>
              <p className="compare-sub">
                Set beside the typical prime London development, the difference is not a matter
                of taste. It is a matter of record.
              </p>
            </div>
            <div className="compare-table">
              <div className="cmp-row cmp-head-row">
                <div className="cmp-cell cmp-label" />
                <div className="cmp-cell cmp-aurelia">Elevia</div>
                <div className="cmp-cell cmp-others">Typical UK Prime</div>
              </div>
              {COMPARE_ROWS.map(([label, us, them], i) => (
                <div className="cmp-row" key={i}>
                  <div className="cmp-cell cmp-label">{label}</div>
                  <div className="cmp-cell cmp-aurelia">
                    <span className="tick">✦</span> {us}
                  </div>
                  <div className="cmp-cell cmp-others">
                    <span className="dash">—</span> {them}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 — FINALE */}
        <section id="finale" className="chapter ch-finale">
          <div className="pin-stage" style={{ flexDirection: 'column' }}>
            <div className="finale finale-inner">
              <span className="kicker">Final Chapter — The Reveal</span>
              <h2 className="display" style={{ fontSize: 'clamp(2.8rem, 7vw, 6.5rem)' }}>
                One address.
                <br />
                <em>Twelve keys.</em>
              </h2>
              <div className="price">From $28,500,000</div>
              <button className="cta magnetic" onClick={() => openPortal('enquire')}>
                Request a Private Viewing
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ short footer */}
        <footer className="signature">
          <div className="sig-fine">
            <span className="sig-brand">Elevia Residences · MMXXVI</span>
            <span>© Hamza Iqbal · Personal use · AI-generated imagery, copyright free</span>
            <a
              className="sig-hire"
              href="https://hamzakanth.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hire me <ArrowUR />
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
