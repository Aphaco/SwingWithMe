import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, Plus, X, Check, Star, Quote } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import swingLogo from '../src/images/Swinglogo.png'
import img1 from '../src/images/c2.jpg'
import img2 from '../src/images/c3.jpg'
import img3 from '../src/images/c4.jpg'
import img4 from '../src/images/c5.jpg'
import img5 from '../src/images/c7.jpg'
import img6 from '../src/images/call.jpeg'
import img7 from '../src/images/callback.jpeg'

gsap.registerPlugin(ScrollTrigger)

const EVENT_PHOTOS = [img1, img2, img3, img4]

const GALLERY = [
  { src: img1, title: 'Golden hour celebration', tag: 'Weddings', size: 'tall' },
  { src: img2, title: 'A day to remember', tag: 'Birthdays', size: 'wide' },
  { src: img3, title: 'Details that delight', tag: 'Styling', size: 'wide' },
  { src: img4, title: 'Magic hour', tag: 'Celebrations', size: 'tall' },
  { src: img5, title: 'Bridal Room Decor', tag: 'Rose Petals Trail', size: 'tall' },
  { src: img6, title: 'Till Sunset', tag: 'Petals & Promises', size: 'tall' },
  { src: img7, title: 'Veil & Vows', tag: 'Toast At Noon', size: 'wide' },
]

const CONTACT_EMAIL = ''
const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate event', 'Baby shower', 'Graduation', 'Engagement', 'Other']

// 👇 The 5 Exact Reviews
const TESTIMONIALS = [
  {
    quote: "Moooommmy Swiiiing, What Can I say !!!! From the first day I contacted you to meeting you and putting this together within this short period is heartwarming!!! You overdid yourself and understood every concern I raised and offered advice in love. I really appreciate. I asked God for Good wedding vendors because I had limited planning time! And God, God over answered my prayers and delivered !!!! I am truly truly truly Grateful. I loved loved loved it! And all guests complimented your good and beautiful work!",
    name: "Mary #GODDIDIT",
    event: "Wedding Client"
  },
  {
    quote: "Awwwwww Lydia how can I thank u enough....this was beyond what we expected....everyone is talking about this....kyere s3 I haven't been able to sleep the calls keeps coming....kyere s3 the Engagement was off the hook but this wedding I give u a standing ovation whattttt it was beautiful and the coordination was on point.....thank u 4 everything. ur customer service I give it to u 👏👏👏👏❤️❤️❤️❤️❤️",
    name: "Engagement & Wedding Client",
    event: "Wedding Celebration"
  },
  {
    quote: "Your decor was nothing short of amazing. You didn’t just deliver what I asked for, you overdelivered and brought my vision to life even better than I imagined. What started as a simple client and vendor relationship quickly became something much more special. When you realized how overwhelmed and stressed I was, planning everything in just one month and two weeks, you didn’t just focus on the work. You stepped in like a big sister, allowed me to vent, encouraged me, and even became a prayer warrior for me. That meant more to me than words can express. Your professionalism, creativity, and genuine care truly set you apart. If you want your decor executed to perfection by someone who truly cares about you and your event, please contact her, you will not regret it. I’m forever grateful. 🤍✨",
    name: "Dorcas",
    event: "Wedding Decor"
  },
  {
    quote: "Lydiaaa my darling, God Richly bless you and your craft, you are such a selfless person, I cannot thank you enough for everything you’ve done during this whole process, my constant demands and change of mind every minute, you’ve been soo patient and accommodating. God bless you and your team, it’s my prayer that anything you and your team have lost during this process May you be refilled 10x may your business continue to flourish and expand, you will never lack anything good that life has to offer. thank you soo much.",
    name: "Grateful Client",
    event: "Event Planning & Decor"
  },
  {
    quote: "I met swing events through a friend after contacting so many others here on ig (FYI some of these Vendors were so rude as if they were doing me a favor 🙊). The reception I got from Lydia was everything, we instantly clicked as if we already knew each other 😊. She was very responsive and very understanding (I can't even count the number of times I changed what we have already agreed on 😅). Above all these personality traits, she is a very talented lady (did u all see our decor for both days? It was fire 👌🏼). @swingwithme_events my Husband and I can't thank u enough, u made both of our days very special, from the coordination to the breathtaking decorations, Lydia may the Almighty God bless u and ur husband for helping us create such wonderful memories ❤️🖤❤️",
    name: "Joana",
    event: "#foreverkj2022 Wedding"
  }
]

const PACKAGES = [
  {
    id: 'standard',
    name: 'Standard Signature',
    tagline: 'Pergola Package',
    items: [
      'Pergola Tents', 'Ceiling Work (Drapery, Rattans & floral installations)',
      'Carpet Grass', 'Customized Couple Backdrop', 'Couple Chairs and Table',
      'Customized Dancefloor', 'Guests Chairs', 'Guests Tables', 'Table Clothes',
      'Centerpieces (Florals & Table Place Cards)', 'Charger Plates', 'Wine Glasses',
      'Table Napkins', 'Cake Table', 'Gift Table', '2 Photo Backdrops',
      '3 Rectangular Tables & Table Clothes for Food', 'Mist fans'
    ],
    pricesWithoutLight: [
      { guests: '50 Guests', price: '15,000' },
      { guests: '100 Guests', price: '19,000' },
      { guests: '150 Guests', price: '24,000' },
      { guests: '200 Guests', price: '29,000' },
      { guests: '250 Guests', price: '33,000' },
      { guests: '300 Guests', price: '37,000' }
    ],
    pricesWithLight: [
      { guests: '50 Guests', price: '18,000' },
      { guests: '100 Guests', price: '22,000' },
      { guests: '150 Guests', price: '28,000' },
      { guests: '200 Guests', price: '33,000' },
      { guests: '250 Guests', price: '37,000' },
      { guests: '300 Guests', price: '41,000' }
    ]
  },
  {
    id: 'classic',
    name: 'Classic Signature',
    tagline: 'Indoor or Outdoor',
    items: [
      'Pergola tents', 'Ceiling work (Drapery, fabric design, rattans & floral installations)',
      'Carpet grass', 'Customized couple backdrop', 'Couple chairs and table',
      'Customized dancefloor', 'Guests chairs (rustic OR mid-luxury)', 'Guests tables',
      'Centerpieces (florals, candle holders, & table place cards)', 'Charger plates',
      'Wine glasses', 'Champagne OR Water glasses', 'Side plates', 'Table napkins',
      'Cake table', 'Gift table', 'Entrance decor', 'Welcome signage', '2 Photo backdrops',
      '3 Rectangular tables & table clothes for food', 'Mist fans',
      'Lighting (LEDs, low fog, pendants, pyro fireworks)'
    ],
    prices: [
      { guests: '50 guests', price: '24,000' },
      { guests: '100 guests', price: '31,000' },
      { guests: '150 guests', price: '37,000' },
      { guests: '200 guests', price: '40,000' },
      { guests: '250 guests', price: '46,000' },
      { guests: '300 guests', price: '51,000' }
    ]
  },
  {
    id: 'midluxe',
    name: 'Mid-Luxe Signature',
    tagline: 'Mixture of Classic & Luxury',
    items: [
      'Trusses', 'Ceiling work (Drapery, fabric design, rattans, chandeliers, Pendants & floral installations)',
      'Carpet grass', 'Customized couple backdrop', 'Couple chairs and table',
      'Customized dancefloor', 'Guests chairs (Luxury)',
      'Guests tables (Rustic OR Luxury tables & Regular tables with table clothes)',
      'Table clothes', 'Centerpieces (florals, candle holders & table place cards)',
      'Underplates', 'Wine glasses', 'Champagne glasses OR Water glasses', 'Table napkins',
      'Cake table', 'Gift table', 'Entrance decor', 'Welcome signage', '3 Photo backdrops',
      '3 Rectangular tables for food', 'Mist fans',
      'Lighting (LEDs, Moving Heads, Pyro Fireworks, Low Fog)'
    ],
    prices: [
      { guests: '50 guests', price: '30,000' },
      { guests: '100 guests', price: '41,000' },
      { guests: '150 guests', price: '49,000' },
      { guests: '200 guests', price: '58,000' },
      { guests: '250 guests', price: '66,000' },
      { guests: '300 guests', price: '72,000' }
    ]
  },
  {
    id: 'luxe',
    name: 'Luxe Signature',
    tagline: 'All Luxury',
    items: [
      'Trusses', 'Ceiling work (Drapery, fabric design, rattans, chandeliers & floral installations)',
      'Carpet grass', 'Customized couple backdrop', 'Couple chairs and table',
      'Customized dancefloor', 'Guests chairs (Luxury)',
      'Guests tables (Rustic OR Luxury tables & Regular tables with table clothes)',
      'Table clothes', 'Centerpieces (florals, candle holders, accessories & table place cards)',
      'Underplates', 'Wine glasses', 'Champagne glasses OR Water glasses', 'Table napkins',
      'Cake table', 'Gift table', 'Entrance decor', 'Welcome signage', '4 Photo backdrops',
      '3 Rectangular tables for food', 'Mist fans',
      'Lighting (LEDs, Moving Heads, Pendants Lights, Pyro Fireworks, Dry Ice)'
    ],
    prices: [
      { guests: '50 guests', price: '38,000' },
      { guests: '100 guests', price: '47,000' },
      { guests: '150 guests', price: '56,000' },
      { guests: '200 guests', price: '66,000' },
      { guests: '250 guests', price: '75,000' },
      { guests: '300 guests', price: '84,000' }
    ]
  },
  {
    id: 'full2027',
    name: 'Full Package 2027',
    tagline: 'The Ultimate Discounted Experience',
    isSpecial: true,
    bonuses: [
      'Free Bridal Room Decor',
      'Free Popcorn & Fresh Coconut',
      'Free Content Creation Videos',
      'Free 5 Dowry Bearers / Bridal Bouquet'
    ],
    prices: [
      { guests: '50 guests', price: '48,000' },
      { guests: '100 guests', price: '58,000' },
      { guests: '150 guests', price: '67,000' },
      { guests: '200 guests', price: '74,000' },
      { guests: '250 guests', price: '88,000' },
      { guests: '300 guests', price: '99,000' }
    ],
    sections: [
      {
        title: 'Event Planning, Coordination & Decoration',
        items: [
          'Pergola/Trusses', 'Carpet Grass', 'Floral Hangings', 'Rattan Hangings', 
          'Customized Couple Backdrop', 'Customized Dancefloor', 'Photo Backdrop', 
          'Couple Chairs & Table', 'Guests Chairs', 'Tables', 'Table Clothes', 
          'Centerpieces (Florals, Candelabra, Table Place Cards)', 'Underplates', 
          'Side Plates', 'Wine Glasses/Champagne Glasses', 'Napkins', 'Cake Table', 
          'Mist Fans', 'Gift Table'
        ]
      },
      {
        title: 'Drinks & Starter (Local Bar)',
        items: [
          'Alcohol/Non-Alcoholic Drinks', 'Bottle water', 'Can Malt', 'Can Fanta or Can Coke', 
          'Can BB Cocktail', 'Mini club', 'Smirnoff', 'Asana', 'Sobolo', 
          'Millet drink', '2 fruit juices', 'Spring rolls', 'Kosua ne meko', 
          'Pooja', 'Nkate cake', 'Plantain chips'
        ]
      },
      {
        title: 'Food',
        items: [
          'Fried Rice', 'Jollof', 'Waakye', 'Plain Rice', 'Banku', 'Grilled Tilapia', 
          'Grilled Chicken', 'Fried Fish', 'Spaghetti', 'Salads', 'Chilli Sauce', 
          'Gravy', 'Black Pepper Sauce', 'Dessert (Abele Walls)', 'Beautiful Buffet Table Set-up'
        ]
      },
      {
        title: 'Lighting',
        items: ['Chandeliers', 'LEDs', 'Ceiling Lights', 'Low Fog', 'Fireworks']
      },
      {
        title: 'Photography & Videography',
        items: [
          'Pre-wedding Shoot', 'Event Coverage', 'Soft copies', 'Photo book', 
          '2 Picture Frames', 'Full Video of the event', 'Trailer Video', 
          'Pendrive (pictures and video)'
        ]
      },
      {
        title: 'Additional Services',
        items: [
          'Ushers & Waiters', 'Professional DJ with Sound', 'Professional MC', 
          'Transportation within Accra', 'Cake (3 Tier)'
        ]
      }
    ]
  }
]

/* ---------------------------------- 3D ---------------------------------- */

function BloomScene() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.22, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.12, 0.035)
  })
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffe6fa" />
      <pointLight position={[-3, -1, 2]} intensity={2.3} color="#fe4eda" />
      <group ref={group} position={[0.3, 0, 0]}>
        <Sparkles count={70} scale={[5.5, 5.5, 3]} size={2.4} speed={0.25} color="#fe4eda" opacity={0.7} />
      </group>
    </>
  )
}

class CanvasBoundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err) { console.warn('3D layer disabled:', err) }
  render() { return this.state.failed ? null : this.props.children }
}

function ThreeHero() {
  return (
    <div className="hero-canvas" aria-hidden="true">
      <CanvasBoundary>
        <Canvas camera={{ position: [0, 0, 6.3], fov: 42 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }} eventSource={document.body} eventPrefix="client">
          <BloomScene />
        </Canvas>
      </CanvasBoundary>
    </div>
  )
}

/* --------------------------- SCROLL BACKGROUND --------------------------- */

const smoothstep = (t) => t * t * (3 - 2 * t)

function ScrollBackground() {
  const layers = useRef([])
  const [loaded, setLoaded] = useState([])

  useEffect(() => {
    EVENT_PHOTOS.forEach((src, i) => {
      const img = new Image()
      img.onload = () => setLoaded((prev) => (prev.includes(i) ? prev : [...prev, i]))
      img.src = src
    })
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const last = EVENT_PHOTOS.length - 1
    let target = 0
    let current = 0
    let raf

    const readScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      target = Math.min(1, Math.max(0, window.scrollY / max)) * last
    }

    const tick = () => {
      current += (target - current) * (reduce ? 1 : 0.07)
      layers.current.forEach((el, i) => {
        if (!el) return
        const raw = i === 0 ? 1 : Math.min(1, Math.max(0, current - (i - 1)))
        const o = smoothstep(raw)
        const drift = (current - i) * 1.6
        el.style.opacity = o.toFixed(4)
        el.style.transform = `translate3d(0, ${drift}%, 0) scale(${1.1 - 0.05 * o})`
      })
      raf = requestAnimationFrame(tick)
    }

    readScroll()
    current = target
    tick()
    window.addEventListener('scroll', readScroll, { passive: true })
    window.addEventListener('resize', readScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('resize', readScroll)
    }
  }, [])

  return (
    <div className="scroll-bg" aria-hidden="true">
      {EVENT_PHOTOS.map((src, i) => (
        <div key={src + i} ref={(el) => (layers.current[i] = el)} className={'scroll-bg__img' + (loaded.includes(i) ? ' is-loaded' : '')} style={{ backgroundImage: `url(${src})`, zIndex: i }} />
      ))}
      <div className="scroll-bg__scrim" />
      <div className="scroll-bg__grain" />
    </div>
  )
}

/* -------------------------------- GALLERY -------------------------------- */

function Gallery() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((dir) => setOpen((i) => (i === null ? null : (i + dir + GALLERY.length) % GALLERY.length)), [])

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, step])

  return (
    <>
      <div className="gallery-grid">
        {GALLERY.map((item, i) => (
          <button key={item.src + i} className={'gallery-item ' + item.size} onClick={() => setOpen(i)} aria-label={`Open photo: ${item.title}`}>
            <img src={item.src} alt={item.title} loading="lazy" />
            <span className="gallery-plus"><Plus size={18} /></span>
            <span className="gallery-caption"><small>{item.tag}</small>{item.title}</span>
          </button>
        ))}
      </div>
      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="lightbox-btn lightbox-close" onClick={close} aria-label="Close gallery"><X size={20} /></button>
          <button className="lightbox-btn lightbox-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous photo"><ChevronLeft size={22} /></button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY[open].src} alt={GALLERY[open].title} />
            <figcaption><small>{GALLERY[open].tag}</small> {GALLERY[open].title}<span>{String(open + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span></figcaption>
          </figure>
          <button className="lightbox-btn lightbox-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next photo"><ChevronRight size={22} /></button>
        </div>
      )}
    </>
  )
}

/* ------------------------------- TESTIMONIALS ------------------------------- */

function Testimonials() {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="testimonials-container reveal">
      {TESTIMONIALS.map((t, i) => {
        const isExpanded = expandedIndex === i
        
        return (
          <div className={`testimonial-card glass ${isExpanded ? 'is-expanded' : ''}`} key={i}>
            <Quote className="quote-icon" size={32} />
            <div className="testimonial-stars">
              {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="var(--pink)" stroke="var(--pink)" />)}
            </div>
            
            <p className={`testimonial-text ${isExpanded ? 'expanded' : 'clamped'}`}>
              "{t.quote}"
            </p>
            
            {/* Read More Button */}
            <button className="read-more-btn" onClick={() => toggleExpand(i)}>
              {isExpanded ? 'Read less' : 'Read more'}
            </button>

            <div className="testimonial-author">
              <strong>{t.name}</strong>
              <span>{t.event}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------- PRICING ------------------------------- */

function Pricing() {
  const [openPackage, setOpenPackage] = useState(null)
  const togglePackage = (id) => setOpenPackage(openPackage === id ? null : id)

  return (
    <div className="pricing-accordion-container reveal">
      {PACKAGES.map((pkg) => {
        const isOpen = openPackage === pkg.id
        return (
          <div key={pkg.id} className={`accordion-item glass ${isOpen ? 'is-open' : ''}`}>
            <button className="accordion-header" onClick={() => togglePackage(pkg.id)}>
              <div className="accordion-title-group">
                <h3>{pkg.name}</h3>
                <p>{pkg.tagline}</p>
              </div>
              <div className="accordion-icon">
                <Plus size={24} className={isOpen ? 'rotate' : ''} />
              </div>
            </button>
            <div className="accordion-body">
              <div className="accordion-inner">
                {pkg.isSpecial ? (
                  <div className="special-package-grid">
                    <div className="special-bonuses">
                      <h4>Exclusive 2027 Bonuses</h4>
                      <div className="bonus-grid">
                        {pkg.bonuses.map((b, i) => (
                          <div className="bonus-item" key={i}><span className="bonus-star">★</span> {b}</div>
                        ))}
                      </div>
                    </div>
                    <div className="price-table highlight special-price-table">
                      <h5>Discounted Full Package</h5>
                      {pkg.prices.map((p, i) => (
                        <div className="price-row" key={i}><span>{p.guests}</span><span className="price-val">{p.price} GHS</span></div>
                      ))}
                    </div>
                    <div className="special-details-grid">
                      {pkg.sections.map((sec, i) => (
                        <div className="special-detail-box" key={i}>
                          <h5>{sec.title}</h5>
                          <ul>{sec.items.map((item, j) => (<li key={j}>{item}</li>))}</ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pricing-grid">
                    <div className="pricing-items-col">
                      <h4>What's Included</h4>
                      <ul className="pricing-list">
                        {pkg.items.map((item, i) => (<li key={i}><Check size={14} className="check-icon" /> {item}</li>))}
                      </ul>
                    </div>
                    <div className="pricing-tables-col">
                      {pkg.id === 'standard' ? (
                        <>
                          <div className="price-table">
                            <h5>Without Lighting</h5>
                            {pkg.pricesWithoutLight.map((p, i) => (<div className="price-row" key={`nolight-${i}`}><span>{p.guests}</span><span className="price-val">{p.price} GHS</span></div>))}
                          </div>
                          <div className="price-table highlight">
                            <h5>With Basic Lighting <br/><small>(LEDs & String Lights)</small></h5>
                            {pkg.pricesWithLight.map((p, i) => (<div className="price-row" key={`light-${i}`}><span>{p.guests}</span><span className="price-val">{p.price} GHS</span></div>))}
                          </div>
                        </>
                      ) : (
                        <div className="price-table">
                          <h5>Indoor or Outdoor</h5>
                          {pkg.prices.map((p, i) => (<div className="price-row" key={i}><span>{p.guests}</span><span className="price-val">{p.price} GHS</span></div>))}
                        </div>
                      )}
                      <div className="pricing-note">* Transportation within Accra included.</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------- ENQUIRY FORM ------------------------------ */

const INITIAL_FORM = { name: '', email: '', phone: '', type: '', date: '', guests: '', venue: '', message: '' }

function EnquiryForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/.netlify/functions/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      const text = await res.text()
      let result = {}
      try { result = text ? JSON.parse(text) : {} } catch {}
      if (!res.ok || result.success === false) throw new Error(result.message || `Request failed (${res.status})`)
      setStatus('sent')
      setForm(INITIAL_FORM)
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-panel form-success">
        <span className="success-mark">✳</span>
        <h3>Thank you, lovely.</h3>
        <p>Your enquiry is on its way. We'll be in touch very soon to start dreaming with you.</p>
        <button className="button button-ghost" onClick={() => setStatus('idle')}>Send another enquiry</button>
      </div>
    )
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="field"><span>Full name</span><input name="name" value={form.name} onChange={onChange} placeholder="Your name" required autoComplete="name" /></label>
        <label className="field"><span>Email</span><input type="email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" required autoComplete="email" /></label>
        <label className="field"><span>Phone / WhatsApp</span><input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+233 ..." required autoComplete="tel" /></label>
        <label className="field"><span>Type of event</span><select name="type" value={form.type} onChange={onChange} required><option value="" disabled>Select one</option>{EVENT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}</select></label>
        <label className="field"><span>Event date</span><input type="date" name="date" value={form.date} onChange={onChange} /></label>
        <label className="field"><span>Number of guests</span><input type="number" min="1" name="guests" value={form.guests} onChange={onChange} placeholder="e.g. 80" /></label>
        <label className="field field-full"><span>Venue / location</span><input name="venue" value={form.venue} onChange={onChange} placeholder="Where are you thinking?" /></label>
        <label className="field field-full"><span>Tell us about your vision</span><textarea name="message" rows="4" value={form.message} onChange={onChange} placeholder="Theme, colours, mood, anything you're dreaming of..." required /></label>
      </div>
      <button className="button button-pink form-submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send my enquiry'} <ArrowRight size={17} /></button>
      {status === 'error' && (<p className="form-error" role="alert">Something went wrong. Please try again, or email us at {CONTACT_EMAIL}.</p>)}
    </form>
  )
}

/* ---------------------------------- APP ---------------------------------- */

const NAV = [
  { id: 'philosophy', label: 'Our approach' },
  { id: 'services', label: 'What we do' },
  { id: 'packages', label: 'Packages' },
  // { id: 'testimonials', label: 'Reviews' },
  { id: 'gallery', label: 'The gallery' },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState('home')
  const [cursor, setCursor] = useState({ x: -300, y: -300 })
  const root = useRef(null)

  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY })
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('mousemove', move)
    window.addEventListener('scroll', onScroll, { passive: true })

    const ctx = gsap.context(() => {
      gsap.from('.hero-kicker, .hero-title-line, .hero-copy, .hero-actions, .scroll-cue', { y: 28, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', delay: 0.2 })
      gsap.from('.hero-canvas', { scale: 0.9, opacity: 0, duration: 1.6, ease: 'power3.out', delay: 0.2 })
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(el, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      })
      gsap.utils.toArray('.gallery-item').forEach((el, i) => {
        gsap.fromTo(el, { y: 50, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 1, delay: (i % 2) * 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
    }, root)

    const sections = ['home', 'philosophy', 'services', 'packages', 'testimonials', 'gallery', 'contact'].map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => entries.forEach((en) => en.isIntersecting && setActiveId(en.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach((s) => io.observe(s))

    return () => {
      io.disconnect()
      window.removeEventListener('mousemove', move)
      window.removeEventListener('scroll', onScroll)
      ctx.revert()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div ref={root} className="site-shell">
      <ScrollBackground />
      <div className="cursor-glow" style={{ transform: `translate3d(${cursor.x - 140}px, ${cursor.y - 140}px, 0)` }} />

      <header className={'site-header' + (scrolled ? ' is-scrolled' : '') + (menuOpen ? ' is-open' : '')}>
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Swing With Me Events home"><img src={swingLogo} alt="Swing With Me Events" className="brand-logo" /></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
          {NAV.map((n) => (<a key={n.id} href={`#${n.id}`} onClick={closeMenu} className={activeId === n.id ? 'is-active' : ''}>{n.label}</a>))}
          <a href="#contact" onClick={closeMenu} className={'nav-cta' + (activeId === 'contact' ? ' is-active' : '')}>Plan something beautiful <ArrowUpRight size={14} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </header>

      <main>
        {/* 01 — HERO */}
        <section id="home" className="section hero">
          <ThreeHero />
          <div className="hero-content">
            <p className="eyebrow hero-kicker"><span className="eyebrow-line" /> THE ART OF GETTING TOGETHER</p>
            <h1 className="hero-title"><span className="hero-title-line">Some moments</span><span className="hero-title-line title-indent">deserve to <em>linger.</em></span></h1>
            <div className="hero-actions">
              <a className="button button-pink" href="#contact">Let's make a moment <ArrowUpRight size={16} /></a>
              <a className="button button-ghost" href="#gallery">See our work</a>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
        </section>

        {/* 02 — PHILOSOPHY */}
        <section id="philosophy" className="section">
          <div className="section-inner reveal">
            <div className="section-index"><span>01 / A NOTE ON HOW WE GATHER</span><span className="index-flower">✳</span></div>
            <div className="intro-grid">
              <h2 className="display-heading">Not just an event.<br /><em>A feeling</em> you keep.</h2>
              <div className="intro-aside glass">
                <p className="large-copy">The best celebrations don't just look beautiful. They make you feel something.</p>
                <p>From the first spark of an idea to the last song of the evening, we create experiences that feel considered, personal, and effortlessly memorable.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — SERVICES */}
        <section id="services" className="section">
          <div className="section-inner reveal">
            <div className="section-index"><span>02 / WHAT WE MAKE POSSIBLE</span><span>THOUGHTFULLY, ALWAYS</span></div>
            <h2 className="display-heading">Room for every<br /><em>kind of wonderful.</em></h2>
            <p className="large-copy">Different reasons to gather. One thoughtful approach.</p>
          </div>
        </section>

        {/* 04 — PACKAGES */}
        <section id="packages" className="section section-top">
          <div className="section-inner">
            <div className="section-index reveal"><span>03 / OUR PACKAGES</span><span>TAILORED TO YOU</span></div>
            <div className="gallery-head reveal"><h2 className="display-heading">Curated experiences<br /><em>for every budget.</em></h2></div>
            <Pricing />
          </div>
        </section>

        {/* 05 — TESTIMONIALS */}
        <section id="testimonials" className="section section-top">
          <div className="section-inner">
            <div className="section-index reveal"><span>04 / KIND WORDS</span><span>FROM OUR CLIENTS</span></div>
            <div className="gallery-head reveal"><h2 className="display-heading">Stories that<br /><em>stay with us.</em></h2></div>
            <Testimonials />
          </div>
        </section>

        {/* 06 — GALLERY */}
        <section id="gallery" className="section section-top">
          <div className="section-inner">
            <div className="section-index reveal"><span>05 / THE GALLERY</span><span>MOMENTS WE LOVED</span></div>
            <div className="gallery-head reveal"><h2 className="display-heading">A little glimpse of<br /><em>what we've made.</em></h2><p className="large-copy">Every celebration tells its own story. Here are a few of ours.</p></div>
            <Gallery />
          </div>
        </section>

        {/* 07 — BOOKING FORM */}
        <section id="contact" className="section section-top">
          <div className="section-inner">
            <div className="section-index reveal"><span>06 / LET'S TALK</span><span>YOUR MOMENT STARTS HERE</span></div>
            <div className="contact-grid">
              <div className="contact-copy reveal">
                <h2 className="display-heading">Shall we make<br /><em>something lovely?</em></h2>
                <p className="large-copy">Tell us what you're dreaming up. We'll bring the questions, the ideas, and the happy dance.</p>
              </div>
              <div className="reveal"><EnquiryForm /></div>
            </div>
            <footer className="site-footer">
              <div className="footer-grid">
                <div className="footer-brand-col">
                  <img src={swingLogo} alt="Swing With Me Events" className="footer-logo" />
                  <p className="footer-tagline">Crafting moments that linger forever.</p>
                </div>
                <div className="footer-col">
                  <h4>Contact</h4>
                  <p><a href="tel:+233559401814">Call: 0559401814</a></p>
                  <p><a href="https://wa.me/233544849283" target="_blank" rel="noreferrer">WhatsApp: 0544849283</a></p>
                  <p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p>
                </div>
                <div className="footer-col">
                  <h4>Socials</h4>
                  <p><a href="https://instagram.com/swingwithme_events" target="_blank" rel="noreferrer">Instagram: @swingwithme_events</a></p>
                  <p><a href="https://tiktok.com/@swingwithme_events" target="_blank" rel="noreferrer">TikTok: @swingwithme_events</a></p>
                  <p><a href="https://www.threads.net/@swingwithme_events" target="_blank" rel="noreferrer">Threads: Swing with me events</a></p>
                </div>
              </div>
              <div className="footer-bottom"><span>© {new Date().getFullYear()} Swing With Me Events & Experiences</span></div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}