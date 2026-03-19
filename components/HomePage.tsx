'use client'

import { useEffect, useRef, useState } from 'react'

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

  // Native form state
  const [nName, setNName] = useState('')
  const [nEmail, setNEmail] = useState('')
  const [nDate, setNDate] = useState('')
  const [nGroup, setNGroup] = useState('2 people')
  const [nNotes, setNNotes] = useState('')

  // Concierge form state
  const [cName, setCName] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cDate, setCDate] = useState('')
  const [cGroup, setCGroup] = useState('2 people')
  const [cNotes, setCNotes] = useState('')

  const starsRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const conciergeConfirmRef = useRef<HTMLDivElement>(null)

  // Star field
  useEffect(() => {
    const container = starsRef.current
    if (!container) return
    for (let i = 0; i < 120; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --dur: ${2 + Math.random() * 4}s;
        --delay: ${Math.random() * 4}s;
        width: ${Math.random() < 0.8 ? 1 : 2}px;
        height: ${Math.random() < 0.8 ? 1 : 2}px;
        opacity: ${0.2 + Math.random() * 0.6};
      `
      container.appendChild(star)
    }
    return () => { container.innerHTML = '' }
  }, [])

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      '.tour-card, .route-step, .vibe-card, .restaurant-card, .testimonial, .vp, .exp-card'
    )
    elements.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(24px)'
      el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.07}s, transform 0.5s ease ${(i % 6) * 0.07}s`
    })
    const observer = new IntersectionObserver((entries) => {
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

  // Nav scroll + active link highlight
  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current
      if (!nav) return
      nav.style.background = window.scrollY > 60
        ? 'rgba(10, 22, 40, 0.98)'
        : 'rgba(10, 22, 40, 0.95)'

      const sections = document.querySelectorAll<HTMLElement>('section[id], header[id]')
      let current = ''
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 120) current = section.id
      })
      document.querySelectorAll<HTMLAnchorElement>('.nav-links a').forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}`
          ? 'var(--gold)'
          : 'rgba(255,255,255,0.8)'
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function toggleExp(id: string) {
    const next = new Set(selectedExps)
    if (next.has(id)) {
      next.delete(id)
    } else {
      if (next.size >= 5) {
        setShakingCard(id)
        setTimeout(() => setShakingCard(null), 400)
        return
      }
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
    const msg = encodeURIComponent(
      `Hi Brasília Insider! I'd like to book a "Get to Know Brasília with a Native" experience.\n\n` +
      `Name: ${nName}\nDate: ${nDate}\nGroup: ${nGroup}\n` +
      `Vibes: ${vibes}\nPace: ${pace}\nTiming: ${timing}\n` +
      (nNotes ? `Notes: ${nNotes}` : '')
    )
    window.open(`https://wa.me/5561981075629?text=${msg}`, '_blank')
  }

  function handleConciergeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const places = [...selectedChips].join(', ') || 'not specified'
    const msg = encodeURIComponent(
      `Hi! I'd like to request a custom tour.\n\n` +
      `Name: ${cName}\nEmail: ${cEmail}\nDate: ${cDate}\nGroup: ${cGroup}\n` +
      `Attractions: ${places}\n` +
      (cNotes ? `Notes: ${cNotes}` : '')
    )
    setConciergeSubmitted(true)
    setTimeout(() => {
      conciergeConfirmRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    setTimeout(() => window.open(`https://wa.me/5561981075629?text=${msg}`, '_blank'), 800)
  }

  const expData = [
    { id: '1', num: '01', icon: '🏛️', title: 'Iconic Architecture', desc: 'Cathedral, National Museum, Congress & Praça dos Três Poderes.' },
    { id: '2', num: '02', icon: '⚖️', title: 'The Power of Brazil', desc: 'Planalto, Supreme Court & the political center of the country.' },
    { id: '3', num: '03', icon: '📐', title: 'Modernist Brasília', desc: 'The Pilot Plan, Lúcio Costa\'s urban vision & the monumental axis.' },
    { id: '4', num: '04', icon: '🔍', title: 'Hidden Brasília', desc: 'Gems, viewpoints & corners that most tourists never see.' },
    { id: '5', num: '05', icon: '🏘️', title: 'Superquadra Life', desc: 'Daily life in Brasília — local shops, green areas & residential architecture.' },
    { id: '6', num: '06', icon: '🎨', title: 'Art & Culture', desc: 'Cultural centers, the National Museum & public art across the city.' },
    { id: '7', num: '07', icon: '📸', title: 'Best Views', desc: 'The most beautiful viewpoints of the city and Lake Paranoá.' },
    { id: '8', num: '08', icon: '🚣', title: 'Lakeside Brasília', desc: 'The relaxed side of the city near Lake Paranoá — how locals unwind.' },
    { id: '9', num: '09', icon: '☕', title: 'Food & Coffee Break', desc: 'A local café or bakery stop — Brazilian coffee, snacks & real conversation.' },
    { id: '10', num: '10', icon: '🔬', title: 'Architecture Deep Dive', desc: 'For enthusiasts: a deeper look at Niemeyer\'s design concepts and legacy.' },
  ]

  const vibeData = [
    { id: 'street-food', emoji: '🥘', title: 'Street Food', desc: 'Pastelarias, food trucks & the kind of lunch spots only regulars know about.' },
    { id: 'nightlife', emoji: '🎶', title: 'Music & Nightlife', desc: 'Live forró, bars in the 405 Sul, and whatever is happening tonight.' },
    { id: 'nature', emoji: '🌿', title: 'Nature', desc: 'Cerrado trails, wild orchids & places where the city just disappears.' },
    { id: 'art', emoji: '🎨', title: 'Art', desc: 'Street murals, gallery openings & the public installations most people walk past.' },
    { id: 'neighborhoods', emoji: '🏘️', title: 'Neighborhoods', desc: 'Walk through a superquadra, visit a feira & feel what real life here is like.' },
    { id: 'sports', emoji: '⚽', title: 'Sports', desc: 'From paddle courts to a Brasiliense match — the city\'s sporting soul.' },
    { id: 'history', emoji: '📖', title: 'Hidden History', desc: 'The stories behind the construction — the candangos, the city\'s forgotten origins.' },
    { id: 'sunsets', emoji: '🌇', title: 'Sunsets & Views', desc: 'The best sunset spots in the city — some so beautiful they don\'t feel real.' },
  ]

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="navbar" ref={navRef}>
        <div className="nav-inner">
          <a className="logo" href="#">Brasília <span>Insider</span></a>
          <ul className="nav-links">
            <li><a href="#tours">Tours</a></li>
            <li><a href="#photo-tour">Photo Tour</a></li>
            <li><a href="#airbnb-experience">Experiences</a></li>
            <li><a href="#native-experience">Local Life</a></li>
            <li><a href="#concierge">Concierge</a></li>
            <li><a href="#restaurants">Restaurants</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <a className="nav-cta" href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
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
          <p className="hero-eyebrow">Your local gateway to Brazil&apos;s capital</p>
          <h1>See Brasília<br /><em>the way locals do</em></h1>
          <p className="hero-sub">Private tours, curated experiences &amp; insider tips — guided by a bilingual native who actually knows this city.</p>
          <div className="hero-actions">
            <a href="#tours" className="btn btn-primary">Explore Tours</a>
            <a href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Chat on WhatsApp</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-n">12+</span><span className="stat-l">Years guiding</span></div>
          <div className="stat"><span className="stat-n">300+</span><span className="stat-l">Five-star reviews</span></div>
          <div className="stat"><span className="stat-n">100%</span><span className="stat-l">Private &amp; flexible</span></div>
        </div>
      </header>

      {/* TOURS */}
      <section className="section" id="tours">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Our Tours</p>
            <h2>Choose your Brasília</h2>
            <p className="section-sub">Every tour is private, fully flexible, and led by a bilingual native of the city.</p>
          </div>
          <div className="tour-grid">
            <div className="tour-card">
              <div className="tour-img tour-img-arch">
                <div className="tour-badge badge-popular">Most Popular</div>
              </div>
              <div className="tour-body">
                <p className="tour-duration">📷 Full Day · Hotel Pickup</p>
                <h3>Iconic Photography Tour</h3>
                <p>The definitive visual journey through Brasília. We start at your hotel and end at the Pontão — hitting every unmissable landmark along the way.</p>
                <ul className="tour-stops">
                  <li>🏨 Hotel pickup</li>
                  <li>⛪ Catedral Metropolitana</li>
                  <li>🏛️ Museu da República</li>
                  <li>🏛️ Praça dos Três Poderes</li>
                  <li>🏛️ Palácio do Itamaraty</li>
                  <li>🏛️ Palácio da Alvorada</li>
                  <li>🌉 Ponte JK</li>
                  <li>🌅 Pontão do Lago Sul</li>
                </ul>
                <div className="tour-footer">
                  <span className="price">From <strong>USD 120</strong>/person</span>
                  <a href="#concierge" className="btn btn-outline">Book Now</a>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-img tour-img-power"></div>
              <div className="tour-body">
                <p className="tour-duration">🏛️ 3–4 hours · Private</p>
                <h3>The Power of Brazil</h3>
                <p>Go behind the architecture and discover how Brazil is governed. Visit the Palácio do Planalto, Supreme Court, and the congressional buildings at the heart of the republic.</p>
                <div className="tour-footer">
                  <span className="price">From <strong>USD 90</strong>/person</span>
                  <a href="#concierge" className="btn btn-outline">Book Now</a>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-img tour-img-modernist"></div>
              <div className="tour-body">
                <p className="tour-duration">🏙️ 3–4 hours · Private</p>
                <h3>Modernist Brasília</h3>
                <p>Understand the urban genius behind the Pilot Plan. We explore the monumental axis and Lúcio Costa&apos;s original vision for the world&apos;s greatest planned city.</p>
                <div className="tour-footer">
                  <span className="price">From <strong>USD 90</strong>/person</span>
                  <a href="#concierge" className="btn btn-outline">Book Now</a>
                </div>
              </div>
            </div>

            <div className="tour-card">
              <div className="tour-img tour-img-hidden"></div>
              <div className="tour-body">
                <p className="tour-duration">🔍 3–4 hours · Private</p>
                <h3>Hidden Brasília</h3>
                <p>Skip the well-worn tourist trail. Discover architectural gems, secret viewpoints, and surprising corners that most visitors — and even many residents — never find.</p>
                <div className="tour-footer">
                  <span className="price">From <strong>USD 90</strong>/person</span>
                  <a href="#concierge" className="btn btn-outline">Book Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO TOUR DETAIL */}
      <section className="section section-alt" id="photo-tour">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Featured Experience</p>
            <h2>The Iconic Photography Tour</h2>
            <p className="section-sub">A full-day journey through the most photogenic landmarks in Brasília, with hotel pickup and drop-off at the Pontão.</p>
          </div>
          <div className="route-wrapper">
            <div className="route-info">
              <p className="route-intro">Oscar Niemeyer designed Brasília to be photographed. This tour is built around that idea. You&apos;ll have time at every stop to capture the light, the angles, and the stories — guided by someone who knows exactly where to stand.</p>
              <div className="route-steps">
                {[
                  { icon: '🏨', title: 'Hotel Pickup', desc: 'We start at your door — no taxis, no stress.' },
                  { icon: '⛪', title: 'Catedral Metropolitana', desc: 'Niemeyer\'s crown of thorns in glass and concrete. Stunning inside and out.' },
                  { icon: '🏛️', title: 'Museu da República (Museu JK)', desc: 'A floating dome of history, surrounded by reflecting pools.' },
                  { icon: '🇧🇷', title: 'Praça dos Três Poderes', desc: 'The symbolic center of Brazilian democracy — Congress, Planalto & Supreme Court in one frame.' },
                  { icon: '🏛️', title: 'Palácio do Itamaraty', desc: 'The Ministry of Foreign Affairs — arches reflected in still water. One of Niemeyer\'s finest.' },
                  { icon: '🏛️', title: 'Palácio da Alvorada', desc: 'The presidential residence, with its iconic curved colonnade reflected on the lakeside.' },
                  { icon: '🌉', title: 'Ponte JK', desc: 'Three asymmetric arches over Lake Paranoá — one of the most beautiful bridges in Brazil.' },
                  { icon: '🌅', title: 'Pontão do Lago Sul', desc: 'End the day at Brasília\'s favorite lakeside spot — bars, restaurants, and a perfect sunset view.', last: true },
                ].map((step, i, arr) => (
                  <div key={step.title}>
                    <div className={`route-step${step.last ? ' route-step-last' : ''}`}>
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-text">
                        <strong>{step.title}</strong>
                        <span>{step.desc}</span>
                      </div>
                    </div>
                    {i < arr.length - 1 && <div className="route-arrow">↓</div>}
                  </div>
                ))}
              </div>
              <div className="route-includes">
                <h4>What&apos;s included</h4>
                <ul>
                  <li>✅ Hotel pickup &amp; drop-off at Pontão</li>
                  <li>✅ Bilingual guide (English &amp; Portuguese)</li>
                  <li>✅ Best photo spots &amp; composition tips</li>
                  <li>✅ Stories behind every landmark</li>
                  <li>✅ Flexible pace — you set the speed</li>
                </ul>
                <div className="route-cta">
                  <span className="price-lg">From <strong>USD 120</strong>/person</span>
                  <a href="#concierge" className="btn btn-primary">Reserve This Tour</a>
                  <a href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Ask a question</a>
                </div>
              </div>
            </div>
            <div className="route-map-visual">
              <div className="map-placeholder">
                <div className="map-pin" style={{ top: '8%', left: '45%' }}>⛪<span>Cathedral</span></div>
                <div className="map-pin" style={{ top: '20%', left: '50%' }}>🏛️<span>Museu da República</span></div>
                <div className="map-pin" style={{ top: '32%', left: '55%' }}>🇧🇷<span>Praça 3 Poderes</span></div>
                <div className="map-pin" style={{ top: '44%', left: '48%' }}>🏛️<span>Itamaraty</span></div>
                <div className="map-pin" style={{ top: '57%', left: '35%' }}>🏛️<span>Alvorada</span></div>
                <div className="map-pin" style={{ top: '70%', left: '60%' }}>🌉<span>Ponte JK</span></div>
                <div className="map-pin" style={{ top: '83%', left: '68%' }}>🌅<span>Pontão</span></div>
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
            <p className="eyebrow">Airbnb Experience</p>
            <h2>Get to Know Brasília<br />with a Local</h2>
            <p className="section-sub">Discover Brasília through the eyes of someone who lives here. Choose up to 5 experiences from 10 options — we build your tour around you.</p>
          </div>
          <div className="airbnb-wrapper">
            <div className="airbnb-intro">
              <div className="airbnb-badge">⭐ Available on Airbnb Experiences</div>
              <p>Instead of a fixed itinerary, you choose what interests you most. When booking, you select up to five experiences from the list. During the tour (3–4 hours), we visit the places you chose and explore them together with your guide — a born-and-raised Brasiliense who speaks fluent English.</p>
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
                {expData.map(exp => (
                  <div
                    key={exp.id}
                    className={`exp-card${selectedExps.has(exp.id) ? ' selected' : ''}`}
                    style={shakingCard === exp.id ? { animation: 'shake 0.35s ease' } : {}}
                    onClick={() => toggleExp(exp.id)}
                  >
                    <div className="exp-num">{exp.num}</div>
                    <div className="exp-icon">{exp.icon}</div>
                    <h4>{exp.title}</h4>
                    <p>{exp.desc}</p>
                  </div>
                ))}
              </div>
              <div
                className="exp-counter"
                style={{
                  color: selectedExps.size === 5 ? '#2a7a2a' : 'var(--gold-dark)',
                  background: selectedExps.size === 5 ? 'rgba(42,122,42,0.08)' : 'rgba(201,168,76,0.08)',
                }}
              >
                {selectedExps.size} / 5 selected
              </div>
              <div className="airbnb-includes">
                <h4>What&apos;s included</h4>
                <ul>
                  <li>✅ Local bilingual guide (English &amp; Portuguese)</li>
                  <li>✅ Flexible itinerary based on your choices</li>
                  <li>✅ Historical &amp; cultural explanations</li>
                  <li>✅ Photo opportunities &amp; insider stories</li>
                </ul>
                <div className="route-cta">
                  <span className="price-lg">From <strong>USD 75</strong>/person</span>
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
            <p className="eyebrow eyebrow-gold">Local Life</p>
            <h2>Get to Know Brasília<br />with a Native</h2>
            <p className="section-sub-dark">Brasília is famous for being hard to explore on your own. The best spots — where locals actually eat, hang out, and spend their weekends — don&apos;t show up in guidebooks. We take you there.</p>
          </div>
          <div className="value-props">
            <div className="vp">
              <span className="vp-icon">🚫</span>
              <strong>No tourist traps</strong>
              <p>We skip the overpriced, overcrowded spots and take you where people actually go.</p>
            </div>
            <div className="vp">
              <span className="vp-icon">🎯</span>
              <strong>Built around you</strong>
              <p>Tell us your vibe and we design the experience on the fly — nothing is fixed in advance.</p>
            </div>
            <div className="vp">
              <span className="vp-icon">✨</span>
              <strong>Genuinely unique</strong>
              <p>No two experiences are the same. This one will be yours.</p>
            </div>
          </div>

          <div className="vibe-section">
            <h3>What&apos;s your vibe?</h3>
            <p className="vibe-sub">Pick everything that sounds like you — we&apos;ll do the rest.</p>
            <div className="vibe-grid">
              {vibeData.map(v => (
                <div
                  key={v.id}
                  className={`vibe-card${selectedVibes.has(v.id) ? ' selected' : ''}`}
                  onClick={() => toggleVibe(v.id)}
                >
                  <span className="vibe-emoji">{v.emoji}</span>
                  <strong>{v.title}</strong>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pace-section">
            <div className="pace-group">
              <h4>Pace</h4>
              <div className="pace-options">
                {[
                  { val: 'slow', label: '🐢 Slow & relaxed' },
                  { val: 'packed', label: '⚡ Pack it in' },
                  { val: 'spontaneous', label: '🎲 Spontaneous' },
                ].map(b => (
                  <button
                    key={b.val}
                    className={`pace-btn${pace === b.val ? ' active' : ''}`}
                    onClick={() => setPace(b.val)}
                  >{b.label}</button>
                ))}
              </div>
            </div>
            <div className="pace-group">
              <h4>When?</h4>
              <div className="pace-options">
                {[
                  { val: 'morning', label: '🌅 Morning' },
                  { val: 'afternoon', label: '☀️ Afternoon' },
                  { val: 'evening', label: '🌙 Evening' },
                  { val: 'fullday', label: '🗓️ Full Day' },
                ].map(b => (
                  <button
                    key={b.val}
                    className={`pace-btn${timing === b.val ? ' active' : ''}`}
                    onClick={() => setTiming(b.val)}
                  >{b.label}</button>
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
                    <option>1 person</option>
                    <option>2 people</option>
                    <option>3–4 people</option>
                    <option>5+ people</option>
                  </select>
                </div>
              </div>
              <div className="form-group form-full">
                <label htmlFor="nNotes">Surprise us</label>
                <textarea id="nNotes" rows={3} placeholder="Tell us what you love, hate, fear, or dream about. The weirder the better — we're good at this." value={nNotes} onChange={e => setNNotes(e.target.value)}></textarea>
              </div>
              <div className="native-form-cta">
                <button type="submit" className="btn btn-gold">Send My Preferences</button>
                <a href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 WhatsApp First</a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CONCIERGE */}
      <section className="section" id="concierge">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Concierge Service</p>
            <h2>Build Your Own Itinerary</h2>
            <p className="section-sub">Not sure which tour to pick? Tell us which attractions interest you and we&apos;ll design a private experience just for you.</p>
          </div>
          <div className="concierge-wrapper">
            {!conciergeSubmitted ? (
              <form className="concierge-form" onSubmit={handleConciergeSubmit}>
                <div className="form-section-title">1. Select attractions that interest you</div>
                <div className="chips-grid">
                  {[
                    { id: 'cathedral', label: '⛪ Catedral Metropolitana' },
                    { id: 'museu-republica', label: '🏛️ Museu da República' },
                    { id: 'tres-poderes', label: '🇧🇷 Praça dos Três Poderes' },
                    { id: 'congresso', label: '🏛️ Congresso Nacional' },
                    { id: 'itamaraty', label: '🏛️ Palácio do Itamaraty' },
                    { id: 'alvorada', label: '🏛️ Palácio da Alvorada' },
                    { id: 'planalto', label: '⚖️ Palácio do Planalto' },
                    { id: 'stf', label: '⚖️ Supremo Tribunal Federal' },
                    { id: 'ponte-jk', label: '🌉 Ponte JK' },
                    { id: 'pontao', label: '🌅 Pontão do Lago Sul' },
                    { id: 'museu-jk', label: '🏛️ Memorial JK' },
                    { id: 'tv-tower', label: '📡 TV Tower' },
                    { id: 'superquadra', label: '🏘️ Superquadra (local neighborhood)' },
                    { id: 'lago', label: '🚣 Lake Paranoá' },
                  ].map(chip => (
                    <button
                      key={chip.id}
                      type="button"
                      className={`chip${selectedChips.has(chip.id) ? ' active' : ''}`}
                      onClick={() => toggleChip(chip.id)}
                    >{chip.label}</button>
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
                      <option>1 person</option>
                      <option>2 people</option>
                      <option>3–4 people</option>
                      <option>5–8 people</option>
                      <option>9+ people</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cNotes">Any special requests or questions?</label>
                  <textarea id="cNotes" rows={3} placeholder="Dietary restrictions, mobility considerations, specific interests..." value={cNotes} onChange={e => setCNotes(e.target.value)}></textarea>
                </div>
                <div className="form-cta">
                  <button type="submit" className="btn btn-primary btn-lg">Send Booking Request</button>
                  <a href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">💬 WhatsApp Us</a>
                </div>
              </form>
            ) : (
              <div className="concierge-confirm" ref={conciergeConfirmRef}>
                <div className="confirm-icon">✅</div>
                <h3>We got your request!</h3>
                <p>We&apos;ll get back to you within a few hours to confirm your itinerary and answer any questions. Check your inbox — and feel free to reach out on WhatsApp if you&apos;d like a faster reply.</p>
                <a href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">💬 Message on WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Reviews</p>
            <h2>What guests say</h2>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: 'Absolutely the best way to see Brasília. Our guide knew every angle, every story, every hidden detail. We left feeling like we actually understood the city.', author: 'Sarah M.', location: 'New York' },
              { quote: 'We did the photography tour and got shots we could never have found on our own. The Palácio do Itamaraty at that hour was unreal. Worth every cent.', author: 'James & Lena T.', location: 'London' },
              { quote: "I've visited Brasília twice before and thought I knew the city. This tour showed me things I'd completely missed. The local knowledge is genuinely extraordinary.", author: 'Carlos V.', location: 'São Paulo' },
            ].map(t => (
              <div className="testimonial" key={t.author}>
                <div className="stars-row">★★★★★</div>
                <p>&ldquo;{t.quote}&rdquo;</p>
                <div className="test-author">— {t.author}, <em>{t.location}</em></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESTAURANTS */}
      <section className="section" id="restaurants">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Where to Eat</p>
            <h2>Brasília&apos;s Best Restaurants</h2>
            <p className="section-sub">Curated by a local — these are the places worth your time (and your appetite).</p>
          </div>
          <div className="cuisine-tabs">
            {[
              { id: 'brazilian', label: '🇧🇷 Contemporary Brazilian' },
              { id: 'japanese', label: '🍣 Japanese & Nikkei' },
              { id: 'mediterranean', label: '🫒 Mediterranean' },
              { id: 'cerrado', label: '🌿 Cerrado & Regional' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`cuisine-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >{tab.label}</button>
            ))}
          </div>

          <div className={`restaurant-panel${activeTab === 'brazilian' ? ' active' : ''}`}>
            <div className="restaurant-grid">
              <div className="restaurant-card">
                <div className="rest-header rest-br1"></div>
                <div className="rest-body">
                  <h4>Aquavit</h4>
                  <div className="rest-tags"><span>Contemporary</span><span>Lake Views</span></div>
                  <p>Brasília&apos;s most celebrated upscale dining experience. Chef Caio Soter takes regional Brazilian ingredients and elevates them into something extraordinary. The tasting menu changes seasonally.</p>
                  <div className="must-try"><strong>Must try:</strong> Braised pork belly with pequi cream · Guará fish from the Cerrado rivers</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-br2"></div>
                <div className="rest-body">
                  <h4>Mangai Brasília</h4>
                  <div className="rest-tags"><span>Buffet</span><span>Northeastern</span></div>
                  <p>A sprawling celebration of northeastern Brazilian cuisine — over 100 dishes served fresh every day. The kind of lunch that makes you cancel your afternoon plans. Always packed, always worth it.</p>
                  <div className="must-try"><strong>Must try:</strong> Baião de dois · Carne de sol com macaxeira · Cocada for dessert</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-br3"></div>
                <div className="rest-body">
                  <h4>Fogo de Chão</h4>
                  <div className="rest-tags"><span>Churrascaria</span><span>Classic</span></div>
                  <p>The original Brazilian steakhouse experience. Gauchos carve tableside, the salad bar is a meal in itself, and the picanha is consistently the best in the city. A quintessential Brazilian ritual.</p>
                  <div className="must-try"><strong>Must try:</strong> Picanha · Fraldinha · Pão de queijo from the bread basket</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`restaurant-panel${activeTab === 'japanese' ? ' active' : ''}`}>
            <div className="restaurant-grid">
              <div className="restaurant-card">
                <div className="rest-header rest-jp1"></div>
                <div className="rest-body">
                  <h4>Kan Suke</h4>
                  <div className="rest-tags"><span>Traditional Japanese</span><span>Chef&apos;s Table</span></div>
                  <p>A quiet, intimate space where the chef&apos;s craft takes center stage. Brasília has a significant Japanese-Brazilian community and the quality of the fish here reflects it. Booking essential.</p>
                  <div className="must-try"><strong>Must try:</strong> Omakase menu · Tuna tataki · Yuzu sake pairing</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-jp2"></div>
                <div className="rest-body">
                  <h4>Nikkei 405</h4>
                  <div className="rest-tags"><span>Nikkei Fusion</span><span>Trendy</span></div>
                  <p>Where Japanese technique meets Brazilian flavors. The Nikkei cuisine of Brazil is its own distinct tradition and this restaurant does it better than almost anywhere in the city.</p>
                  <div className="must-try"><strong>Must try:</strong> Tiradito with passion fruit · Ceviche nikkei · Maki rolls with tropical fruit</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-jp3"></div>
                <div className="rest-body">
                  <h4>Kamy Sushi</h4>
                  <div className="rest-tags"><span>Sushi Bar</span><span>Casual</span></div>
                  <p>The neighborhood sushi spot that locals actually go to. No tourist pricing, no unnecessary theatre — just excellent fish and a warm, unpretentious atmosphere in the South Wing.</p>
                  <div className="must-try"><strong>Must try:</strong> Temaki tropeiro · Salmon skin rolls · Cold Sapporo draft</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`restaurant-panel${activeTab === 'mediterranean' ? ' active' : ''}`}>
            <div className="restaurant-grid">
              <div className="restaurant-card">
                <div className="rest-header rest-md1"></div>
                <div className="rest-body">
                  <h4>Áttimo</h4>
                  <div className="rest-tags"><span>Italian</span><span>Fine Dining</span></div>
                  <p>Refined Italian cooking with exceptional imported ingredients and a wine list that rivals São Paulo&apos;s best. The pasta is handmade daily and the tiramisu is the real version.</p>
                  <div className="must-try"><strong>Must try:</strong> Tagliolini al tartufo · Branzino in acqua pazza · Seasonal risotto</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-md2"></div>
                <div className="rest-body">
                  <h4>Oliva</h4>
                  <div className="rest-tags"><span>Greek &amp; Middle Eastern</span><span>Meze</span></div>
                  <p>Share everything at this exuberant space in the South Wing. The meze plates keep coming and the lamb dishes are the best in Brasília by a wide margin. Loud, social, and absolutely delicious.</p>
                  <div className="must-try"><strong>Must try:</strong> Lamb saganaki · Hummus with lamb · Spanakopita · Baklava</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-md3"></div>
                <div className="rest-body">
                  <h4>Leblon Grill</h4>
                  <div className="rest-tags"><span>Mediterranean-Brazilian</span><span>Lakeside</span></div>
                  <p>A relaxed lakeside setting with a menu that spans the Mediterranean coast. The seafood is flown in fresh, the views of the lake are beautiful, and the weekend brunch is a Brasília institution.</p>
                  <div className="must-try"><strong>Must try:</strong> Grilled octopus · Grilled sea bass · Weekend brunch buffet</div>
                </div>
              </div>
            </div>
          </div>

          <div className={`restaurant-panel${activeTab === 'cerrado' ? ' active' : ''}`}>
            <div className="restaurant-grid">
              <div className="restaurant-card">
                <div className="rest-header rest-cer1"></div>
                <div className="rest-body">
                  <h4>Couve-Flor</h4>
                  <div className="rest-tags"><span>Cerrado Cuisine</span><span>Tasting Menu</span></div>
                  <p>The most adventurous restaurant in Brasília. Chef Ana Paula Junqueira forages and sources directly from the Cerrado savanna, creating dishes that taste like nowhere else on earth.</p>
                  <div className="must-try"><strong>Must try:</strong> Pequi risotto · Baru nut dessert · Piqui oil braised chicken</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-cer2"></div>
                <div className="rest-body">
                  <h4>Na Cozinha</h4>
                  <div className="rest-tags"><span>Homestyle Regional</span><span>Lunch Only</span></div>
                  <p>The kind of lunch your Brazilian grandmother would make if she lived in Brasília. Rotating daily specials, always sold out by 1pm. The rice and beans alone are worth the visit.</p>
                  <div className="must-try"><strong>Must try:</strong> Whatever the daily special is · Feijão tropeiro · Sopa de mocotó on Fridays</div>
                </div>
              </div>
              <div className="restaurant-card">
                <div className="rest-header rest-cer3"></div>
                <div className="rest-body">
                  <h4>Goiabeiras</h4>
                  <div className="rest-tags"><span>Regional</span><span>Casual</span></div>
                  <p>Central Brazilian cooking done simply and beautifully. The name comes from the guava tree, and guava appears in some form in almost every dish — including the most surprising desserts.</p>
                  <div className="must-try"><strong>Must try:</strong> Carne de sol plate · Goiabada with queijo mineiro · Guaraná caipirinha</div>
                </div>
              </div>
            </div>
          </div>

          <div className="restaurants-note">
            <p>🍽️ <strong>Want a dinner reservation?</strong> Our concierge service includes restaurant recommendations and reservations. <a href="#concierge">Contact us</a> for help planning your evenings.</p>
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
              <a href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Open WhatsApp</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <h4>Email</h4>
              <p>For detailed questions or booking confirmations.</p>
              <a href="mailto:hello@brasiliainsider.com" className="btn btn-outline">hello@brasiliainsider.com</a>
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
            <p className="logo">Brasília <span>Insider</span></p>
            <p>Private tours &amp; local experiences in Brasília, Brazil.</p>
          </div>
          <div className="footer-links">
            <a href="#tours">Tours</a>
            <a href="#photo-tour">Photography Tour</a>
            <a href="#airbnb-experience">Experiences</a>
            <a href="#concierge">Concierge</a>
            <a href="#restaurants">Restaurants</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-copy">© 2026 Brasília Insider. All rights reserved.</p>
        </div>
      </footer>

      {/* STICKY WHATSAPP */}
      <a className="sticky-wa" href="https://wa.me/5561981075629" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" fill="currentColor" width="28" height="28">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.737 5.46 2.024 7.74L0 32l8.46-2.01A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.85l-.485-.288-5.02 1.194 1.215-4.886-.316-.5A13.24 13.24 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.24-9.84c-.397-.198-2.35-1.16-2.714-1.293-.363-.133-.627-.198-.89.198-.265.397-1.02 1.293-1.252 1.56-.23.265-.462.298-.858.1-.397-.2-1.675-.617-3.19-1.97-1.18-1.05-1.977-2.346-2.207-2.743-.23-.397-.025-.611.173-.808.177-.177.397-.462.595-.694.2-.23.265-.397.397-.66.133-.265.067-.497-.033-.694-.1-.198-.89-2.148-1.22-2.94-.32-.77-.645-.666-.89-.678-.23-.012-.495-.015-.76-.015s-.694.1-.1057.497c-.363.397-1.386 1.353-1.386 3.302s1.42 3.83 1.617 4.095c.198.265 2.795 4.267 6.77 5.982.946.408 1.684.652 2.26.834.95.302 1.815.26 2.498.158.762-.114 2.35-.96 2.68-1.888.33-.927.33-1.72.232-1.887-.1-.166-.364-.265-.76-.464z"/>
        </svg>
      </a>
    </>
  )
}
