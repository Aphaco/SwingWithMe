import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Sparkles } from '@react-three/drei'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, Plus, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import swingLogo from '../src/images/Swinglogo.png' 
import img1 from '../src/images/c2.jpg'
import img2 from '../src/images/c3.jpg'
import img3 from '../src/images/c4.jpg'
import img4 from '../src/images/c5.jpg'
import img5 from '../src/images/c7.jpg'

gsap.registerPlugin(ScrollTrigger)

const EVENT_PHOTOS = [img1, img2, img3, img4]

// 👇 Gallery tiles. Add as many as you like: { src, title, tag, size }
// size: 'tall' | 'wide' | '' (square)
const GALLERY = [
  { src: img1, title: 'Golden hour celebration', tag: 'Weddings', size: 'tall' },
  { src: img2, title: 'An evening to remember', tag: 'Birthdays', size: 'wide' },
  { src: img3, title: 'Details that delight', tag: 'Styling', size: 'wide' },
  { src: img4, title: 'Magic hour', tag: 'Celebrations', size: 'tall' },
  { src: img5, title: 'The happy dance', tag: 'Glam Dinners', size: 'tall' },
]

// 👇 Form delivery. Leave empty to open the visitor's email app with the enquiry pre-filled,
// or paste a Formspree / Getform URL (e.g. 'https://formspree.io/f/xxxxxx') to receive submissions directly.
const FORM_ENDPOINT = ''
const CONTACT_EMAIL = 'hello@swingwithme.events'

const EVENT_TYPES = ['Wedding', 'Birthday', 'Corporate event', 'Baby shower', 'Graduation', 'Engagement', 'Other']

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
      <group ref={group} position={[0.3, 0, 0]} />
      <Sparkles count={70} scale={[5.5, 5.5, 3]} size={2.4} speed={0.25} color="#fe4eda" opacity={0.7} />
      <Environment preset="studio" />
    </>
  )
}

function ThreeHero() {
  return (
    <div className="hero-canvas" aria-label="Interactive 3D sparkles">
      <Canvas
        camera={{ position: [0, 0, 6.3], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <BloomScene />
      </Canvas>
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
        <div
          key={src + i}
          ref={(el) => (layers.current[i] = el)}
          className={'scroll-bg__img' + (loaded.includes(i) ? ' is-loaded' : '')}
          style={{ backgroundImage: `url(${src})`, zIndex: i }}
        />
      ))}
      <div className="scroll-bg__scrim" />
      <div className="scroll-bg__grain" />
    </div>
  )
}

/* -------------------------------- GALLERY -------------------------------- */

function Gallery() {
  const [open, setOpen] = useState(null) // index or null

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (dir) => setOpen((i) => (i === null ? null : (i + dir + GALLERY.length) % GALLERY.length)),
    []
  )

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
          <button
            key={item.src + i}
            className={'gallery-item ' + item.size}
            onClick={() => setOpen(i)}
            aria-label={`Open photo: ${item.title}`}
          >
            <img src={item.src} alt={item.title} loading="lazy" />
            <span className="gallery-plus"><Plus size={18} /></span>
            <span className="gallery-caption">
              <small>{item.tag}</small>
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close}>
          <button className="lightbox-btn lightbox-close" onClick={close} aria-label="Close gallery">
            <X size={20} />
          </button>
          <button
            className="lightbox-btn lightbox-prev"
            onClick={(e) => { e.stopPropagation(); step(-1) }}
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY[open].src} alt={GALLERY[open].title} />
            <figcaption>
              <small>{GALLERY[open].tag}</small> {GALLERY[open].title}
              <span>{String(open + 1).padStart(2, '0')} / {String(GALLERY.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>
          <button
            className="lightbox-btn lightbox-next"
            onClick={(e) => { e.stopPropagation(); step(1) }}
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      )}
    </>
  )
}

/* ------------------------------- ENQUIRY FORM ------------------------------ */

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  type: '',
  date: '',
  guests: '',
  venue: '',
  message: '',
}
function EnquiryForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    
    try {
      // 👇 This connects directly to your Netlify function
      const res = await fetch('/.netlify/functions/send-enquiry', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Accept: 'application/json' 
        },
        body: JSON.stringify(form),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Request failed')
      }

      setStatus('sent')
      setForm(INITIAL_FORM)
    } catch (error) {
      console.error("Form submission error:", error)
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-panel form-success">
        <span className="success-mark">✳</span>
        <h3>Thank you, lovely.</h3>
        <p>Your enquiry is on its way. We'll be in touch very soon to start dreaming with you.</p>
        <button className="button button-ghost" onClick={() => setStatus('idle')}>
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>Full name</span>
          <input name="name" value={form.name} onChange={onChange} placeholder="Your name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" required autoComplete="email" />
        </label>
        <label className="field">
          <span>Phone / WhatsApp</span>
          <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+233 ..." required autoComplete="tel" />
        </label>
        <label className="field">
          <span>Type of event</span>
          <select name="type" value={form.type} onChange={onChange} required>
            <option value="" disabled>Select one</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Event date</span>
          <input type="date" name="date" value={form.date} onChange={onChange} />
        </label>
        <label className="field">
          <span>Number of guests</span>
          <input type="number" min="1" name="guests" value={form.guests} onChange={onChange} placeholder="e.g. 80" />
        </label>
        <label className="field field-full">
          <span>Venue / location</span>
          <input name="venue" value={form.venue} onChange={onChange} placeholder="Where are you thinking?" />
        </label>
        <label className="field field-full">
          <span>Tell us about your vision</span>
          <textarea
            name="message"
            rows="4"
            value={form.message}
            onChange={onChange}
            placeholder="Theme, colours, mood, anything you're dreaming of..."
            required
          />
        </label>
      </div>

      <button className="button button-pink form-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send my enquiry'} <ArrowRight size={17} />
      </button>

      {status === 'error' && (
        <p className="form-error" role="alert">
          Something went wrong. Please try again, or email us at {CONTACT_EMAIL}.
        </p>
      )}
    </form>
  )
}

/* ---------------------------------- APP ---------------------------------- */

const NAV = [
  { id: 'philosophy', label: 'Our approach' },
  { id: 'services', label: 'What we do' },
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
      gsap.from('.hero-kicker, .hero-title-line, .hero-copy, .hero-actions, .scroll-cue', {
        y: 28,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      })
      gsap.from('.hero-canvas', { scale: 0.9, opacity: 0, duration: 1.6, ease: 'power3.out', delay: 0.2 })

      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      })

      gsap.utils.toArray('.gallery-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: (i % 2) * 0.12,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        )
      })
    }, root)

    // Highlight the nav tab for the section currently on screen
    const sections = ['home', 'philosophy', 'services', 'gallery', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActiveId(en.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
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
        {/* <a className="brand" href="#home" onClick={closeMenu} aria-label="Swing With Me Events home">
          <span className="brand-mark">sw<span>m</span></span>
          <span className="brand-name">SWING WITH ME <small>EVENTS & EXPERIENCES</small></span>
        </a> */}
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Swing With Me Events home">
  <img src={swingLogo} alt="Swing With Me Events" className="brand-logo" /> {/* 👈 SWAPPED */}
  {/* <span className="brand-name">SWING WITH ME <small>EVENTS & EXPERIENCES</small></span> */}
</a>

        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={closeMenu}
              className={activeId === n.id ? 'is-active' : ''}
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={closeMenu}
            className={'nav-cta' + (activeId === 'contact' ? ' is-active' : '')}
          >
            Plan something beautiful <ArrowUpRight size={14} />
          </a>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main>
        {/* 01 — HERO */}
        <section id="home" className="section hero">
          <ThreeHero />
          <div className="hero-content">
            <p className="eyebrow hero-kicker">
              <span className="eyebrow-line" /> THE ART OF GETTING TOGETHER
            </p>
            <h1 className="hero-title">
              <span className="hero-title-line">Some moments</span>
              <span className="hero-title-line title-indent">
                deserve to <em>linger.</em>
              </span>
            </h1>
            <div className="hero-actions">
              <a className="button button-pink" href="#contact">
                Let's make a moment <ArrowUpRight size={16} />
              </a>
              <a className="button button-ghost" href="#gallery">
                See our work
              </a>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </section>

        {/* 02 — PHILOSOPHY */}
        <section id="philosophy" className="section">
          <div className="section-inner reveal">
            <div className="section-index">
              <span>01 / A NOTE ON HOW WE GATHER</span>
              <span className="index-flower">✳</span>
            </div>
            <div className="intro-grid">
              <h2 className="display-heading">
                Not just an event.
                <br />
                <em>A feeling</em> you keep.
              </h2>
              <div className="intro-aside glass">
                <p className="large-copy">
                  The best celebrations don't just look beautiful. They make you feel something.
                </p>
                <p>
                  From the first spark of an idea to the last song of the evening, we create experiences that feel
                  considered, personal, and effortlessly memorable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — SERVICES */}
        <section id="services" className="section">
          <div className="section-inner reveal">
            <div className="section-index">
              <span>02 / WHAT WE MAKE POSSIBLE</span>
              <span>THOUGHTFULLY, ALWAYS</span>
            </div>
            <h2 className="display-heading">
              Room for every
              <br />
              <em>kind of wonderful.</em>
            </h2>
            <p className="large-copy">Different reasons to gather. One thoughtful approach.</p>
          </div>
        </section>

        {/* 04 — GALLERY */}
        <section id="gallery" className="section section-top">
          <div className="section-inner">
            <div className="section-index reveal">
              <span>03 / THE GALLERY</span>
              <span>MOMENTS WE LOVED</span>
            </div>
            <div className="gallery-head reveal">
              <h2 className="display-heading">
                A little glimpse of
                <br />
                <em>what we've made.</em>
              </h2>
              <p className="large-copy">Every celebration tells its own story. Here are a few of ours.</p>
            </div>
            <Gallery />
          </div>
        </section>

        {/* 05 — BOOKING FORM */}
        <section id="contact" className="section section-top">
          <div className="section-inner">
            <div className="section-index reveal">
              <span>04 / LET'S TALK</span>
              <span>YOUR MOMENT STARTS HERE</span>
            </div>
            <div className="contact-grid">
              <div className="contact-copy reveal">
                <h2 className="display-heading">
                  Shall we make
                  <br />
                  <em>something lovely?</em>
                </h2>
                <p className="large-copy">
                  Tell us what you're dreaming up. We'll bring the questions, the ideas, and the happy dance.
                </p>
                <a className="contact-mail" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL} <ArrowUpRight size={15} />
                </a>
              </div>
              <div className="reveal">
                <EnquiryForm />
              </div>
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
  
  <div className="footer-bottom">
    <span>© {new Date().getFullYear()} Swing With Me Events & Experiences</span>
  </div>
</footer>
          </div>
        </section>
      </main>
    </div>
  )
}