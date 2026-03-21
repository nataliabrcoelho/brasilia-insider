'use client'

import { useEffect, useRef, useState } from 'react'
import siteContent from '@/content/site.json'
import toursContent from '@/content/tours.json'
import experiencesContent from '@/content/experiences.json'
import testimonialsContent from '@/content/testimonials.json'
import restaurantsContent from '@/content/restaurants.json'
import conciergeContent from '@/content/concierge.json'

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedExps, setSelectedExps] = useState<Set<string>>(new Set())
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set())
  const [pace, setPace] = useState('slow')
  const [timing, setTiming] = useState('afternoon')
  const [activeTab, setActiveTab] = useState('brazilian')
  const [conciergeSubmitted, setConciergeSubmitted] = useState(false)
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set())
  const [shakingCard, setShakingCard] = useState<string | null>(null)

  const [nName, setNName] = useState('')
  const [nEmail, setNEmail] = useState('')
  const [nDate, setNDate] = useState('')
  const [nGroup, setNGroup] = useState('2 people')
  const [nNotes, setNNotes] = useState('')

  const [cName, setCName] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cDate, setCDate] = useState('')
  const [cGroup, setCGroup] = useState('2 people')
  const [cNotes, setCNotes] = useState('')

  const starsRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const conciergeConfirmRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = starsRef.current
    if (!container) return
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${2+Math.random()*4}s;--delay:${Math.random()*4}s;width:${Math.random()<0.8?1:2}px;height:${Math.random()<0.8?1:2}px;opacity:${0.2+Math.random()*0.6};`
      container.appendChild(star)
    }
    return () => { container.innerHTML = '' }
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.tour-card,.route-step,.vibe-card,.restaurant-card,.testimonial,.vp,.exp-card'
    )
    elements.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = `opacity 0.5s ease ${(i%6)*0.07}s,transform 0.5s ease ${(i%6)*0.07}s`
    })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      })
    }, { threshold: 0.08 })
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [activeTab])

  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current
      if (!nav) return
      nav.style.background = window.scrollY > 60 ? 'rgba(10,22,40,0.98)' : 'rgba(10,22,40,0.95)'
      const sections = document.querySelectorAll<HTMLElement>('section[id],header[id]')
      let current = ''
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id })
      document.querySelectorAll<HTMLAnchorElement>('.nav-links a').forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : 'rgba(255,255,255,0.8)'
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function toggleExp(id: string) {
    const next = new Set(selectedExps)
    if (next.has(id)) { next.delete(id) } else {
      if (next.size >= 5) { setShakingCard(id); setTimeout(() => setShakingCard(null), 400); return }
      next.add(id)
    }
    setSelectedExps(next)
  }

  function toggleVibe(id: string) {
    const next = new Set(selectedVibes)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedVibes(next)
  }

  function toggleChip(id: string) {
    const next = new Set(selectedChips)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelectedChips(next)
  }

  function handleNativeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const vibes = [...selectedVibes].join(', ') || 'not selected'
    const msg = encodeURIComponent(`Hi Brasília Insider! I'd like to book a "Get to Know Brasília with a Native" experience.\n\nName: ${nName}\nDate: ${nDate}\nGroup: ${nGroup}\nVibes: ${vibes}\nPace: ${pace}\nTiming: ${timing}\n${nNotes ? `Notes: ${nNotes}` : ''}`)
    window.open(`https://wa.me/${siteContent.whatsapp}?text=${msg}`, '_blank')
  }

  function handleConciergeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const places = [...selectedChips].join(', ') || 'not specified'
    const msg = encodeURIComponent(`Hi! I'd like to request a custom tour.\n\nName: ${cName}\nEmail: ${cEmail}\nDate: ${cDate}\nGroup: ${cGroup}\nAttractions: ${places}\n${cNotes ? `Notes: ${cNotes}` : ''}`)
    setConciergeSubmitted(true)
    setTimeout(() => conciergeConfirmRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    setTimeout(() => window.open(`https://wa.me/${siteContent.whatsapp}?text=${msg}`, '_blank'), 800)
  }

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="navbar" ref={navRef}>
        <div className="nav-inner">
          <a className="logo" href="#" data-sb-field-path="siteName">{siteContent.siteName.split(' ')[0]} <span>{siteContent.siteName.split(' ')[1]}</span></a>
          <ul className="nav-links">
            <li><a href="#tours">Tours</a></li>
            <li><a href="#photo-tour">Photo Tour</a></li>
            <li><a href="#airbnb-experience">Experiences</a></li>
            <li><a href="#native-experience">Local Life</a></li>
            <li><a href="#concierge">Concierge</a></li>
            <li><a href="#restaurants">Restaurants</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a className="nav-cta" href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          <button className="hamburger" aria-label="Menu" onClick={() => setMobileOpen(o => !o)}>&#9776;</button>
        </div>
        <ul className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
          {['tours','photo-tour','airbnb-experience','native-experience','concierge','restaurants','contact'].map(id => (
            <li key={id}><a href={`#${id}`} onClick={() => setMobileOpen(false)}>{id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <header className="hero" id="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-eyebrow" data-sb-field-path="heroEyebrow">{siteContent.heroEyebrow}</p>
          <h1>
            <span data-sb-field-path="heroTitle">{siteContent.heroTitle}</span><br />
            <em data-sb-field-path="heroSubtitle">{siteContent.heroSubtitle}</em>
          </h1>
          <p className="hero-sub" data-sb-field-path="heroDescription">{siteContent.heroDescription}</p>
          <div className="hero-actions">
            <a href="#tours" className="btn btn-primary">Explore Tours</a>
            <a href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Chat on WhatsApp</a>
          </div>
        </div>
        <div className="hero-stats">
          {siteContent.heroStats.map((stat, i) => (
            <div className="stat" key={i}>
              <span className="stat-n" data-sb-field-path={`heroStats:${i}.number`}>{stat.number}</span>
              <span className="stat-l" data-sb-field-path={`heroStats:${i}.label`}>{stat.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* TOURS */}
      <section className="section" id="tours">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow" data-sb-field-path="sectionEyebrow">{toursContent.sectionEyebrow}</p>
            <h2 data-sb-field-path="sectionTitle">{toursContent.sectionTitle}</h2>
            <p className="section-sub" data-sb-field-path="sectionSubtitle">{toursContent.sectionSubtitle}</p>
          </div>
          <div className="tour-grid">
            {toursContent.tours.map((tour, i) => (
              <div className="tour-card" key={tour.id}>
                <div className={`tour-img ${tour.imgClass}`}>
                  {tour.badge && <div className="tour-badge badge-popular" data-sb-field-path={`tours:${i}.badge`}>{tour.badge}</div>}
                </div>
                <div className="tour-body">
                  <p className="tour-duration" data-sb-field-path={`tours:${i}.duration`}>{tour.duration}</p>
                  <h3 data-sb-field-path={`tours:${i}.title`}>{tour.title}</h3>
                  <p data-sb-field-path={`tours:${i}.description`}>{tour.description}</p>
                  {tour.stops.length > 0 && (
                    <ul className="tour-stops">
                      {tour.stops.map((stop, j) => (
                        <li key={j} data-sb-field-path={`tours:${i}.stops:${j}`}>{stop}</li>
                      ))}
                    </ul>
                  )}
                  <div className="tour-footer">
                    <span className="price">{tour.priceLabel} <strong data-sb-field-path={`tours:${i}.price`}>{tour.price}</strong>/person</span>
                    <a href="#concierge" className="btn btn-outline">Book Now</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO TOUR DETAIL */}
      <section className="section section-alt" id="photo-tour">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow" data-sb-field-path="photoTour.eyebrow">{toursContent.photoTour.eyebrow}</p>
            <h2 data-sb-field-path="photoTour.title">{toursContent.photoTour.title}</h2>
            <p className="section-sub" data-sb-field-path="photoTour.subtitle">{toursContent.photoTour.subtitle}</p>
          </div>
          <div className="route-wrapper">
            <div className="route-info">
              <p className="route-intro" data-sb-field-path="photoTour.intro">{toursContent.photoTour.intro}</p>
              <div className="route-steps">
                {toursContent.photoTour.route.map((step, i, arr) => (
                  <div key={step.title}>
                    <div className={`route-step${i === arr.length - 1 ? ' route-step-last' : ''}`}>
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-text">
                        <strong data-sb-field-path={`photoTour.route:${i}.title`}>{step.title}</strong>
                        <span data-sb-field-path={`photoTour.route:${i}.desc`}>{step.desc}</span>
                      </div>
                    </div>
                    {i < arr.length - 1 && <div className="route-arrow">↓</div>}
                  </div>
                ))}
              </div>
              <div className="route-includes">
                <h4>What&apos;s included</h4>
                <ul>
                  {toursContent.photoTour.includes.map((item, i) => (
                    <li key={i} data-sb-field-path={`photoTour.includes:${i}`}>✅ {item}</li>
                  ))}
                </ul>
                <div className="route-cta">
                  <span className="price-lg">From <strong data-sb-field-path="photoTour.price">{toursContent.photoTour.price}</strong>/person</span>
                  <a href="#concierge" className="btn btn-primary">Reserve This Tour</a>
                  <a href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Ask a question</a>
                </div>
              </div>
            </div>
            <div className="route-map-visual">
              <div className="map-placeholder">
                <div className="map-pin" style={{ top:'8%', left:'45%' }}>⛪<span>Cathedral</span></div>
                <div className="map-pin" style={{ top:'20%', left:'50%' }}>🏛️<span>Museu da República</span></div>
                <div className="map-pin" style={{ top:'32%', left:'55%' }}>🇧🇷<span>Praça 3 Poderes</span></div>
                <div className="map-pin" style={{ top:'44%', left:'48%' }}>🏛️<span>Itamaraty</span></div>
                <div className="map-pin" style={{ top:'57%', left:'35%' }}>🏛️<span>Alvorada</span></div>
                <div className="map-pin" style={{ top:'70%', left:'60%' }}>🌉<span>Ponte JK</span></div>
                <div className="map-pin" style={{ top:'83%', left:'68%' }}>🌅<span>Pontão</span></div>
                <div className="map-label">Brasília route overview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AIRBNB EXPERIENCE */}
      <section className="section" id="airbnb-experience">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow" data-sb-field-path="airbnb.eyebrow">{experiencesContent.airbnb.eyebrow}</p>
            <h2 data-sb-field-path="airbnb.title">{experiencesContent.airbnb.title}</h2>
            <p className="section-sub" data-sb-field-path="airbnb.subtitle">{experiencesContent.airbnb.subtitle}</p>
          </div>
          <div className="airbnb-wrapper">
            <div className="airbnb-intro">
              <div className="airbnb-badge" data-sb-field-path="airbnb.badge">{experiencesContent.airbnb.badge}</div>
              <p data-sb-field-path="airbnb.intro">{experiencesContent.airbnb.intro}</p>
              <div className="airbnb-meta">
                <div className="meta-item">⏱️ <strong>3–4 hours</strong></div>
                <div className="meta-item">👤 <strong>Private or small group</strong></div>
                <div className="meta-item">🗣️ <strong>English &amp; Portuguese</strong></div>
                <div className="meta-item">🔧 <strong>Pick up to 5 stops</strong></div>
              </div>
            </div>
            <div className="experience-selector">
              <h3>Choose your experiences <span className="picker-note">(select up to 5)</span></h3>
              <div className="experience-grid">
                {experiencesContent.airbnb.items.map((exp, i) => (
                  <div
                    key={exp.id}
                    className={`exp-card${selectedExps.has(exp.id) ? ' selected' : ''}`}
                    style={shakingCard === exp.id ? { animation: 'shake 0.35s ease' } : {}}
                    onClick={() => toggleExp(exp.id)}
                  >
                    <div className="exp-num">{exp.num}</div>
                    <div className="exp-icon">{exp.icon}</div>
                    <h4 data-sb-field-path={`airbnb.items:${i}.title`}>{exp.title}</h4>
                    <p data-sb-field-path={`airbnb.items:${i}.desc`}>{exp.desc}</p>
                  </div>
                ))}
              </div>
              <div className="exp-counter" style={{ color: selectedExps.size===5?'#2a7a2a':'var(--gold-dark)', background: selectedExps.size===5?'rgba(42,122,42,0.08)':'rgba(201,168,76,0.08)' }}>
                {selectedExps.size} / 5 selected
              </div>
              <div className="airbnb-includes">
                <h4>What&apos;s included</h4>
                <ul>
                  {experiencesContent.airbnb.includes.map((item, i) => (
                    <li key={i} data-sb-field-path={`airbnb.includes:${i}`}>✅ {item}</li>
                  ))}
                </ul>
                <div className="route-cta">
                  <span className="price-lg">From <strong data-sb-field-path="airbnb.price">{experiencesContent.airbnb.price}</strong>/person</span>
                  <a href="#concierge" className="btn btn-primary">Book This Experience</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NATIVE EXPERIENCE */}
      <section className="section-dark" id="native-experience">
        <div className="stars" ref={starsRef}></div>
        <div className="container">
          <div className="section-header section-header-dark">
            <p className="eyebrow eyebrow-gold" data-sb-field-path="native.eyebrow">{experiencesContent.native.eyebrow}</p>
            <h2 data-sb-field-path="native.title">{experiencesContent.native.title}</h2>
            <p className="section-sub-dark" data-sb-field-path="native.subtitle">{experiencesContent.native.subtitle}</p>
          </div>
          <div className="value-props">
            {experiencesContent.native.valueProps.map((vp, i) => (
              <div className="vp" key={i}>
                <span className="vp-icon">{vp.icon}</span>
                <strong data-sb-field-path={`native.valueProps:${i}.title`}>{vp.title}</strong>
                <p data-sb-field-path={`native.valueProps:${i}.desc`}>{vp.desc}</p>
              </div>
            ))}
          </div>
          <div className="vibe-section">
            <h3>What&apos;s your vibe?</h3>
            <p className="vibe-sub">Pick everything that sounds like you — we&apos;ll do the rest.</p>
            <div className="vibe-grid">
              {experiencesContent.native.vibes.map((v, i) => (
                <div key={v.id} className={`vibe-card${selectedVibes.has(v.id) ? ' selected' : ''}`} onClick={() => toggleVibe(v.id)}>
                  <span className="vibe-emoji">{v.emoji}</span>
                  <strong data-sb-field-path={`native.vibes:${i}.title`}>{v.title}</strong>
                  <p data-sb-field-path={`native.vibes:${i}.desc`}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pace-section">
            <div className="pace-group">
              <h4>Pace</h4>
              <div className="pace-options">
                {[{val:'slow',label:'🐢 Slow & relaxed'},{val:'packed',label:'⚡ Pack it in'},{val:'spontaneous',label:'🎲 Spontaneous'}].map(b => (
                  <button key={b.val} className={`pace-btn${pace===b.val?' active':''}`} onClick={() => setPace(b.val)}>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="pace-group">
              <h4>When?</h4>
              <div className="pace-options">
                {[{val:'morning',label:'🌅 Morning'},{val:'afternoon',label:'☀️ Afternoon'},{val:'evening',label:'🌙 Evening'},{val:'fullday',label:'🗓️ Full Day'}].map(b => (
                  <button key={b.val} className={`pace-btn${timing===b.val?' active':''}`} onClick={() => setTiming(b.val)}>{b.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="native-form-wrapper">
            <h3>Tell us about you</h3>
            <form className="native-form" onSubmit={handleNativeSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nName">Your name</label>
                  <input type="text" id="nName" placeholder="First name" required value={nName} onChange={e => setNName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="nEmail">Email</label>
                  <input type="email" id="nEmail" placeholder="you@email.com" required value={nEmail} onChange={e => setNEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nDate">Preferred date</label>
                  <input type="date" id="nDate" required value={nDate} onChange={e => setNDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="nGroup">Group size</label>
                  <select id="nGroup" value={nGroup} onChange={e => setNGroup(e.target.value)}>
                    <option>1 person</option><option>2 people</option><option>3–4 people</option><option>5+ people</option>
                  </select>
                </div>
              </div>
              <div className="form-group form-full">
                <label htmlFor="nNotes">Surprise us</label>
                <textarea id="nNotes" rows={3} placeholder="Tell us what you love, hate, fear, or dream about. The weirder the better — we're good at this." value={nNotes} onChange={e => setNNotes(e.target.value)}></textarea>
              </div>
              <div className="native-form-cta">
                <button type="submit" className="btn btn-gold">Send My Preferences</button>
                <a href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 WhatsApp First</a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CONCIERGE */}
      <section className="section" id="concierge">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow" data-sb-field-path="eyebrow">{conciergeContent.eyebrow}</p>
            <h2 data-sb-field-path="title">{conciergeContent.title}</h2>
            <p className="section-sub" data-sb-field-path="subtitle">{conciergeContent.subtitle}</p>
          </div>
          <div className="concierge-wrapper">
            {!conciergeSubmitted ? (
              <form className="concierge-form" onSubmit={handleConciergeSubmit}>
                <div className="form-section-title">1. Select attractions that interest you</div>
                <div className="chips-grid">
                  {conciergeContent.chips.map((chip, i) => (
                    <button key={chip.id} type="button" className={`chip${selectedChips.has(chip.id)?' active':''}`} onClick={() => toggleChip(chip.id)} data-sb-field-path={`chips:${i}.label`}>{chip.label}</button>
                  ))}
                </div>
                <div className="form-section-title">2. Your details</div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cName">Full name</label>
                    <input type="text" id="cName" placeholder="Your name" required value={cName} onChange={e => setCName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cEmail">Email</label>
                    <input type="email" id="cEmail" placeholder="you@email.com" required value={cEmail} onChange={e => setCEmail(e.target.value)} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cDate">Date</label>
                    <input type="date" id="cDate" required value={cDate} onChange={e => setCDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cGroup">Group size</label>
                    <select id="cGroup" value={cGroup} onChange={e => setCGroup(e.target.value)}>
                      <option>1 person</option><option>2 people</option><option>3–4 people</option><option>5–8 people</option><option>9+ people</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cNotes">Any special requests or questions?</label>
                  <textarea id="cNotes" rows={3} placeholder="Dietary restrictions, mobility considerations, specific interests..." value={cNotes} onChange={e => setCNotes(e.target.value)}></textarea>
                </div>
                <div className="form-cta">
                  <button type="submit" className="btn btn-primary btn-lg">Send Booking Request</button>
                  <a href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">💬 WhatsApp Us</a>
                </div>
              </form>
            ) : (
              <div className="concierge-confirm" ref={conciergeConfirmRef}>
                <div className="confirm-icon">✅</div>
                <h3>We got your request!</h3>
                <p>We&apos;ll get back to you within a few hours to confirm your itinerary and answer any questions. Check your inbox — and feel free to reach out on WhatsApp if you&apos;d like a faster reply.</p>
                <a href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Message on WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow" data-sb-field-path="eyebrow">{testimonialsContent.eyebrow}</p>
            <h2 data-sb-field-path="title">{testimonialsContent.title}</h2>
          </div>
          <div className="testimonials-grid">
            {testimonialsContent.items.map((t, i) => (
              <div className="testimonial" key={i}>
                <div className="stars-row">★★★★★</div>
                <p data-sb-field-path={`items:${i}.quote`}>&ldquo;{t.quote}&rdquo;</p>
                <div className="test-author">— <span data-sb-field-path={`items:${i}.author`}>{t.author}</span>, <em data-sb-field-path={`items:${i}.location`}>{t.location}</em></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="section" id="restaurants">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow" data-sb-field-path="eyebrow">{restaurantsContent.eyebrow}</p>
            <h2 data-sb-field-path="title">{restaurantsContent.title}</h2>
            <p className="section-sub" data-sb-field-path="subtitle">{restaurantsContent.subtitle}</p>
          </div>
          <div className="cuisine-tabs">
            {restaurantsContent.cuisines.map((c, ci) => (
              <button key={c.id} className={`cuisine-tab${activeTab===c.id?' active':''}`} onClick={() => setActiveTab(c.id)} data-sb-field-path={`cuisines:${ci}.label`}>{c.label}</button>
            ))}
          </div>
          {restaurantsContent.cuisines.map((cuisine, ci) => (
            <div key={cuisine.id} className={`restaurant-panel${activeTab===cuisine.id?' active':''}`}>
              <div className="restaurant-grid">
                {cuisine.restaurants.map((r, ri) => (
                  <div className="restaurant-card" key={ri}>
                    <div className={`rest-header ${r.imgClass}`}></div>
                    <div className="rest-body">
                      <h4 data-sb-field-path={`cuisines:${ci}.restaurants:${ri}.name`}>{r.name}</h4>
                      <div className="rest-tags">
                        {r.tags.map((tag, ti) => <span key={ti} data-sb-field-path={`cuisines:${ci}.restaurants:${ri}.tags:${ti}`}>{tag}</span>)}
                      </div>
                      <p data-sb-field-path={`cuisines:${ci}.restaurants:${ri}.description`}>{r.description}</p>
                      <div className="must-try">
                        <strong>Must try:</strong> <span data-sb-field-path={`cuisines:${ci}.restaurants:${ri}.mustTry`}>{r.mustTry}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="restaurants-note">
            <p>🍽️ <strong data-sb-field-path="footerNote">{restaurantsContent.footerNote}</strong> <a href="#concierge">Contact us</a> for help planning your evenings.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section section-alt" id="contact">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Get in Touch</p>
            <h2>We&apos;re here to help</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-icon">💬</span>
              <h4>WhatsApp</h4>
              <p>The fastest way to reach us. We typically reply within 1–2 hours.</p>
              <a href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Open WhatsApp</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <h4>Email</h4>
              <p>For detailed questions or booking confirmations.</p>
              <a href={`mailto:${siteContent.email}`} className="btn btn-outline" data-sb-field-path="email">{siteContent.email}</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <h4>Based in</h4>
              <p>Brasília, Federal District, Brazil.<br />We cover the entire Pilot Plan and surrounding areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <p className="logo" data-sb-field-path="siteName">{siteContent.siteName.split(' ')[0]} <span>{siteContent.siteName.split(' ')[1]}</span></p>
            <p data-sb-field-path="tagline">{siteContent.tagline}</p>
          </div>
          <div className="footer-links">
            <a href="#tours">Tours</a>
            <a href="#photo-tour">Photography Tour</a>
            <a href="#airbnb-experience">Experiences</a>
            <a href="#concierge">Concierge</a>
            <a href="#restaurants">Restaurants</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copy" data-sb-field-path="copyright">{siteContent.copyright}</p>
        </div>
      </footer>

      {/* STICKY WHATSAPP */}
      <a className="sticky-wa" href={`https://wa.me/${siteContent.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.737 5.46 2.024 7.74L0 32l8.46-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.85l-.485-.288-5.02 1.194 1.215-4.886-.316-.5A13.24 13.24 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.24-9.84c-.397-.198-2.35-1.16-2.714-1.293-.363-.133-.627-.198-.89.198-.265.397-1.02 1.293-1.252 1.56-.23.265-.462.298-.858.1-.397-.2-1.675-.617-3.19-1.97-1.18-1.05-1.977-2.346-2.207-2.743-.23-.397-.025-.611.173-.808.177-.177.397-.462.595-.694.2-.23.265-.397.397-.66.133-.265.067-.497-.033-.694-.1-.198-.89-2.148-1.22-2.94-.32-.77-.645-.666-.89-.678-.23-.012-.495-.015-.76-.015s-.694.1-.1057.497c-.363.397-1.386 1.353-1.386 3.302s1.42 3.83 1.617 4.095c.198.265 2.795 4.267 6.77 5.982.946.408 1.684.652 2.26.834.95.302 1.815.26 2.498.158.762-.114 2.35-.96 2.68-1.888.33-.927.33-1.72.232-1.887-.1-.166-.364-.265-.76-.464z"/>
        </svg>
      </a>
    </>
  )
}
