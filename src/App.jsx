import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { MAINS, SIPS, ALL, SHOTS, CONTACT, PROMO, OPENING, FAQ } from './menu.js'

const BY_ID = Object.fromEntries(ALL.map(c => [c.id, c]))

const EXPO = [0.16, 1, 0.3, 1]
const SOFT = [0.22, 0.61, 0.36, 1]
const PHONE = CONTACT.phone
const INTL = `44${PHONE.slice(1)}` // tel: and wa.me want the international form
const TEL = `tel:+${INTL}`
const WA = `https://wa.me/${INTL}`
const ext = { target: '_blank', rel: 'noopener noreferrer' }
const MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Gol Gappa, ' + CONTACT.address)}`

// Entrance helper: every hero element rises from a small offset, staggered so the
// eye is led nav -> badge -> headline -> copy -> CTA -> wheel -> window.
const rise = (y, delay, dur = 0.62, ease = EXPO, extra = {}) => ({
  initial: { opacity: 0, y, ...extra.from },
  animate: { opacity: 1, y: 0, ...extra.to },
  transition: { duration: dur, delay, ease },
})

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: EXPO },
}
const list = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const row = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EXPO } },
}

/* ---------- icons (Lucide paths) ---------- */
const I = {
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  insta: <><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4Z" /><path d="M17.5 6.5h0" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  alert: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h0" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  down: <path d="M12 5v14M19 12l-7 7-7-7" />,
}
const WhatsApp = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 3.5C9.1 3.5 3.5 9 3.5 15.8c0 2.3.7 4.5 1.9 6.4L3.6 28.5l6.5-1.7a12.7 12.7 0 0 0 5.9 1.4c6.9 0 12.5-5.5 12.5-12.4S22.9 3.5 16 3.5Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M12.4 9.6c-.4-.9-.8-.9-1.2-.9h-1c-.3 0-.9.1-1.3.6-.5.5-1.7 1.6-1.7 3.9s1.7 4.5 1.9 4.8c.2.3 3.3 5.2 8.1 7.1 4 1.6 4.8 1.3 5.7 1.2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.6l-3.1-1.5c-.4-.2-.7-.2-1 .2l-1.4 1.7c-.3.3-.5.3-1 .1-.5-.2-2-.7-3.7-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-1l.7-.8c.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8l-1.5-3.3Z" fill="currentColor" transform="translate(16 16) scale(.62) translate(-16 -17)" />
  </svg>
)

const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[name]}</svg>
)

// A puri: golden shell, cracked-open top.
const Mark = () => (
  <svg className="mark" viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <radialGradient id="puri" cx="38%" cy="34%" r="70%">
        <stop offset="0" stopColor="#fff1a8" /><stop offset=".45" stopColor="#ffc93a" /><stop offset="1" stopColor="#c27a07" />
      </radialGradient>
    </defs>
    <circle cx="24" cy="25" r="19" fill="url(#puri)" />
    <ellipse cx="25" cy="15" rx="8" ry="4.2" fill="#5a3504" />
    <ellipse cx="25" cy="14.4" rx="6" ry="2.6" fill="#2f6e1d" />
    <circle cx="16" cy="29" r="1.3" fill="#c98510" /><circle cx="30" cy="33" r="1.1" fill="#c98510" /><circle cx="22" cy="37" r="1" fill="#c98510" />
  </svg>
)

const Spark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0Z" fill="currentColor" /></svg>
)

// Clay diya with a flame that breathes.
const Diya = ({ className }) => (
  <svg className={className} viewBox="0 0 80 80" aria-hidden="true">
    <defs>
      <radialGradient id="glow"><stop offset="0" stopColor="#ffd23f" stopOpacity=".7" /><stop offset="1" stopColor="#ffd23f" stopOpacity="0" /></radialGradient>
      <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#ff7a1a" /><stop offset=".6" stopColor="#ffd23f" /><stop offset="1" stopColor="#fff6c8" /></linearGradient>
      <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e07a2e" /><stop offset="1" stopColor="#8c3b12" /></linearGradient>
    </defs>
    <motion.circle cx="40" cy="30" r="26" fill="url(#glow)" animate={{ opacity: [0.6, 1, 0.7] }} transition={{ duration: 2.2, repeat: Infinity, repeatType: 'mirror' }} />
    <motion.path d="M40 12c6 9 7 15 0 22-7-7-6-13 0-22Z" fill="url(#flame)" style={{ originX: '40px', originY: '34px' }}
      animate={{ scaleY: [1, 1.14, 0.94, 1.06], rotate: [-2, 2, -1, 1] }} transition={{ duration: 1.8, repeat: Infinity, repeatType: 'mirror' }} />
    <path d="M10 42h60c-2 14-14 22-30 22S12 56 10 42Z" fill="url(#clay)" />
    <path d="M10 42h60" stroke="#ffcf8a" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 52h36" stroke="#ffd23f" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
  </svg>
)

// Endless ticker: content is doubled and slid by exactly half its width.
function Marquee({ items, duration = 30, reverse = false, className = '' }) {
  const loop = [...items, ...items]
  return (
    <div className={`marquee ${className}`}>
      <motion.div className="marquee-track" animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}>
        {loop.map((t, i) => <span key={i} aria-hidden={i >= items.length}>{t}<Spark /></span>)}
      </motion.div>
    </div>
  )
}

/* ---------- glow button ---------- */
const Btn = ({ href, children, className = '', ...rest }) => (
  <motion.a href={href} className={`btn ${className}`} whileHover={{ y: -1 }} whileTap={{ y: 1, scale: 0.98 }} transition={{ duration: 0.2 }} {...rest}>
    <span>{children}</span>
  </motion.a>
)

/* ---------- nav ---------- */
const LINKS = [['Menu', '#menu'], ['Chaat', '#chaat'], ['Sips', '#lassi'], ['Find us', '#visit']]

function Nav() {
  const [open, setOpen] = useState(false)
  const nav = useRef(null)
  const burger = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); burger.current?.focus() } }
    const onClick = e => { if (!nav.current.contains(e.target)) setOpen(false) }
    const mq = matchMedia('(min-width: 901px)')
    const onMq = () => mq.matches && setOpen(false)
    addEventListener('keydown', onKey); addEventListener('pointerdown', onClick); mq.addEventListener('change', onMq)
    return () => { removeEventListener('keydown', onKey); removeEventListener('pointerdown', onClick); mq.removeEventListener('change', onMq) }
  }, [open])

  return (
    <motion.nav ref={nav} className="nav" aria-label="Main" {...rise(-9, 0.06)}>
      <a href="#top" className="brand" aria-label="Gol Gappa, back to top">
        <Mark />
        <span className="wm"><small>Indian street food</small><b>Gol Gappa</b></span>
      </a>
      <div className="links">
        {LINKS.map(([t, h], i) => (
          <motion.a key={h} href={h} {...rise(6, 0.215 + i * 0.045, 0.46, SOFT)}>{t}</motion.a>
        ))}
      </div>
      <Btn href={TEL} className="nav-cta"><Icon name="phone" size={16} /> Call to order</Btn>
      <button ref={burger} type="button" className={`burger ${open ? 'is-open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open} aria-controls="navmenu" onClick={() => setOpen(o => !o)}>
        <span /><span /><span />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div id="navmenu" className="navmenu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.16 } }} transition={{ duration: 0.26, ease: EXPO }}>
            {LINKS.map(([t, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
            <a href={TEL} className="btn calls" onClick={() => setOpen(false)}><span><Icon name="phone" size={18} /> Call {PHONE}</span></a>
            <a href={WA} className="wa-link" onClick={() => setOpen(false)} {...ext}><WhatsApp size={20} /> WhatsApp us</a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

/* ---------- 3D wheel ---------- */
// Cards sit on a cylinder of radius R viewed from its centre, so each card is
// tangent to the ring and faces the camera; the slant is perspective, not rotation.
// 36 cards -> 10deg apart; anything beyond +-42deg is behind the window and culled.
const R = 891, N = 36, STEP = 360 / N, CULL = 42, SPEED = 1.9

function Ring() {
  const cards = useRef([])
  const phase = useRef(-2)
  const reduce = useReducedMotion()

  useAnimationFrame((_, delta) => {
    if (!reduce) phase.current -= SPEED * Math.min(delta / 1000, 0.1) // clamp so a refocused tab doesn't jump
    cards.current.forEach((el, i) => {
      if (!el) return
      const a = (((i * STEP + phase.current) % 360) + 540) % 360 - 180
      if (Math.abs(a) > CULL) { el.style.visibility = 'hidden'; return }
      const r = (a * Math.PI) / 180, c = Math.cos(r)
      el.style.visibility = 'visible'
      el.style.transform = `translate3d(${R * Math.sin(r)}px,0,${R * (1 - c)}px) rotateY(${-a}deg)`
      el.style.filter = `brightness(${0.84 + 0.5 * (1 / c - 1)})`
    })
  })

  return (
    <div className="ring" aria-hidden="true">
      {Array.from({ length: N }, (_, i) => {
        const s = SHOTS[i % SHOTS.length]
        return (
          <div key={i} ref={el => (cards.current[i] = el)} className={`card ${s.v === 'word' ? 'card--word' : ''}`}
            style={s.v === 'word' ? { background: s.bg, color: s.fg } : undefined}>
            {s.img ? <><b>{s.t}</b><img src={s.img} alt="" loading="lazy" onError={e => e.currentTarget.remove()} /><CardItems id={s.id} /></>
              : <><strong>{s.t}</strong><Spark size={22} /><em>{s.sub}</em></>}
          </div>
        )
      })}
    </div>
  )
}

// Lower half of a wheel card: the category's own dishes, so the card is a mini menu.
function CardItems({ id }) {
  const names = BY_ID[id].items.map(([n]) => n)
  const shown = names.slice(0, 4)
  return (
    <ul className="card-items">
      {shown.map(n => <li key={n}>{n}</li>)}
      {names.length > 4 && <li className="more">+{names.length - 4} more</li>}
    </ul>
  )
}

/* ---------- hero ---------- */
function useStageScale() {
  // Wheel + window are authored on a 1172px-wide stage and scaled as one unit.
  // Floor the scale so phones show a few big cards (the sides clip) instead of a tiny wheel.
  // 1 on the server (prerender), real width in the browser
  const get = () => typeof window === 'undefined' ? 1 : Math.min(1.25, Math.max(innerWidth < 600 ? 0.9 : 0.62, innerWidth / 1172))
  const [k, setK] = useState(get)
  useEffect(() => {
    const on = () => setK(get())
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])
  return k
}

const stars = n => Array.from({ length: n }, () =>
  `${(Math.random() * 100).toFixed(2)}vw ${(Math.random() * 100).toFixed(2)}vh 0 0 rgba(255,${200 + ((Math.random() * 55) | 0)},120,${(0.05 + Math.random() * 0.3).toFixed(2)})`
).join(',')

// Dishes drifting at the hero's edges; scroll pushes them at different speeds for depth.
const FLOATERS = [
  { img: '/img/cut/samosa.webp', cls: 'f1', depth: 120, rot: -8 },
  { img: '/img/cut/lassi.webp', cls: 'f2', depth: 80, rot: 6 },
  { img: '/img/cut/vadapav.webp', cls: 'f3', depth: 160, rot: 5 },
  { img: '/img/cut/chai.webp', cls: 'f4', depth: 100, rot: -5 },
]
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 61) % 100}%`, top: `${(i * 37 + 11) % 70}%`, size: 8 + ((i * 7) % 12), delay: (i * 0.37) % 3,
}))

function Floater({ f, i }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 800], [0, -f.depth])
  return (
    <motion.div className={`floater ${f.cls}`} style={{ y }} aria-hidden="true"
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 1 + i * 0.12, ease: EXPO }}>
      <motion.img src={f.img} alt="" animate={{ y: [0, -12, 0], rotate: [f.rot, f.rot + 4, f.rot] }}
        transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }} />
    </motion.div>
  )
}

function Hero() {
  const k = useStageScale()
  const specks = useMemo(() => stars(120), [])
  const wipe = { from: { clipPath: 'inset(100% 0 -30% 0)' }, to: { clipPath: 'inset(-30% 0 -30% 0)' } }

  return (
    <header className="hero" id="top" style={{ '--k': k }}>
      <div className="specks" style={{ boxShadow: specks }} />
      <motion.div className="spot spot-l" aria-hidden="true" animate={{ rotate: [-4, 3, -4] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="spot spot-r" aria-hidden="true" animate={{ rotate: [4, -3, 4] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      {SPARKS.map((p, i) => (
        <motion.span key={i} className="twinkle" aria-hidden="true" style={{ left: p.left, top: p.top }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }} transition={{ duration: 2.6, delay: p.delay, repeat: Infinity, repeatDelay: 1.4 }}>
          <Spark size={p.size} />
        </motion.span>
      ))}
      {FLOATERS.map((f, i) => <Floater key={f.cls} f={f} i={i} />)}
      <div className="hero-copy">
        <motion.p className="badge" {...rise(11, 0.27, 0.56, EXPO, { from: { scale: 0.985 }, to: { scale: 1 } })}>
          <i><Spark size={14} /></i><span>Opening Sun 8 Nov · <b>£1.99 deal</b></span>
        </motion.p>
        <h1>
          <motion.span {...rise(15, 0.38, 0.9, EXPO, wipe)}>Crispy. Chatpata.</motion.span>
          <motion.span {...rise(15, 0.47, 0.9, EXPO, wipe)}>Irresistible.</motion.span>
        </h1>
        <motion.p className="sub" {...rise(10, 0.69)}>
          <b>Pani puri, vada pav, dabeli and chaat</b> — Indian street food in Cambridge,
          served straight from the truck window.
        </motion.p>
        <motion.div {...rise(13, 0.83, 0.62, EXPO, { from: { scale: 0.985 }, to: { scale: 1 } })}>
          <Btn href="#menu" className="cta">See the menu <Icon name="down" size={18} /></Btn>
        </motion.div>
      </div>

      <div className="stage">
        <motion.div className="ring-wrap" {...rise(18, 0.7, 0.95, EXPO, { from: { scale: 0.99 }, to: { scale: 1 } })}>
          <Ring />
        </motion.div>
        <motion.a href="#menu" className="window" aria-label="Open the full menu" {...rise(26, 0.9, 0.9)}>
          <div className="bar">
            <span className="dots"><i /><i /><i /></span>
            <span className="omni">golgappa.uk/menu</span>
          </div>
          <div className="page">
            <p className="ann">Diwali special · opening 8 Nov</p>
            <Marquee items={PROMO} duration={22} className="window-marquee" />
          </div>
        </motion.a>
      </div>
    </header>
  )
}

/* ---------- menu ---------- */
// Category chips roll on their own; touching or hovering pauses so a chip can be tapped.
function CategoryBar() {
  const x = useMotionValue(0)
  const track = useRef(null)
  const paused = useRef(false)
  const resume = useRef(0)
  const reduce = useReducedMotion()

  useAnimationFrame((_, delta) => {
    if (paused.current || reduce || !track.current) return
    const half = track.current.scrollWidth / 2
    let v = x.get() - 38 * Math.min(delta / 1000, 0.1)
    if (v <= -half) v += half
    x.set(v)
  })
  const pause = () => { clearTimeout(resume.current); paused.current = true }
  const play = (ms = 0) => { clearTimeout(resume.current); resume.current = setTimeout(() => (paused.current = false), ms) }

  return (
    <nav className="catbar" aria-label="Menu categories"
      onPointerEnter={pause} onPointerLeave={() => play()} onTouchStart={pause} onTouchEnd={() => play(2500)}
      onFocus={pause} onBlur={() => play()}>
      <div className="catbar-track">
        <motion.div ref={track} className="catbar-roll" style={{ x }}>
          {[...ALL, ...ALL].map((c, i) => {
            const copy = i >= ALL.length
            return (
              <a key={i} href={`#${c.id}`} aria-hidden={copy || undefined} tabIndex={copy ? -1 : undefined}>
                <img src={c.img} alt="" />{c.title}
              </a>
            )
          })}
        </motion.div>
      </div>
    </nav>
  )
}

// Hand-drawn underline that draws itself in when a heading scrolls into view.
const Squiggle = () => (
  <svg className="squiggle" viewBox="0 0 140 14" aria-hidden="true">
    <motion.path d="M3 9 Q 19 1 35 8 T 70 8 T 105 8 T 137 6" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: 'easeInOut' }} />
  </svg>
)

function Items({ items }) {
  return (
    <motion.ul className="items" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      {items.map(([name, ing]) => (
        <motion.li key={name} variants={row} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
          <span className="name">{name}</span>
          {ing && <span className="ing">{ing}</span>}
        </motion.li>
      ))}
    </motion.ul>
  )
}

function Category({ c, n }) {
  const ref = useRef(null)
  // Dish drifts and turns slightly as its section scrolls past.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const rotate = useTransform(scrollYProgress, [0, 1], n % 2 ? [6, -6] : [-6, 6])
  return (
    <section ref={ref} id={c.id} className={`cat ${n % 2 ? 'cat--flip' : ''}`} aria-labelledby={`${c.id}-h`}>
      <motion.figure className="plate" {...reveal} whileHover={{ y: -4, scale: 1.02 }}>
        <motion.img src={c.img} alt={c.alt} loading="lazy" style={{ y, rotate }} />
        <span className="plate-num">{String(n + 1).padStart(2, '0')}</span>
      </motion.figure>
      <div>
        <motion.header {...reveal}>
          <p className="eyebrow">{c.note}</p>
          <h2 id={`${c.id}-h`}>{c.title}</h2>
          <Squiggle />
        </motion.header>
        <Items items={c.items} />
      </div>
    </section>
  )
}

function Sips() {
  return (
    <section className="sips" aria-labelledby="sips-h">
      <motion.header className="sips-head" {...reveal}>
        <p className="eyebrow">Something to wash it down</p>
        <h2 id="sips-h">Lassi, drinks &amp; chai</h2>
        <Squiggle />
      </motion.header>
      <div className="sips-grid">
        {SIPS.map((s, i) => (
          <motion.article key={s.id} id={s.id} className="sip" aria-labelledby={`${s.id}-h`}
            {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} whileHover={{ y: -4 }}>
            <div className="sip-img"><motion.img src={s.img} alt={s.alt} loading="lazy"
              animate={{ y: [0, -8, 0] }} transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }} /></div>
            <h3 id={`${s.id}-h`}>{s.title}</h3>
            <Items items={s.items} />
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Ribbons() {
  return (
    <div className="ribbons" role="region" aria-label="Opening Sunday 8 November. Diwali offer: Pani Puri, Dahi Puri and Sev Puri £1.99 each, cash only.">
      <Marquee items={PROMO} duration={34} className="ribbon ribbon-a" />
      <Marquee items={PROMO} duration={40} reverse className="ribbon ribbon-b" />
    </div>
  )
}

function useCountdown(target) {
  const calc = () => Math.max(0, target - Date.now())
  const [ms, setMs] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setMs(calc()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.floor(ms / 1000)
  return { done: ms === 0, d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 }
}

function Promo() {
  const t = useCountdown(OPENING.getTime())
  return (
    <section className="promo" aria-labelledby="promo-h">
      <motion.div className="promo-card" {...reveal}>
        <Diya className="diya diya-l" />
        <Diya className="diya diya-r" />
        <p className="eyebrow">Diwali special</p>
        <h2 id="promo-h"><span className="fifty">£1.99</span> Pani Puri · Dahi Puri · Sev Puri</h2>
        <p className="promo-each">each, on Diwali day</p>
        <p className="deal-cash">Cash only</p>
        <p className="promo-date">Sunday 8 November</p>
        {!t.done && (
          <div className="count" role="timer" aria-label={`${t.d} days to go`}>
            {[['Days', t.d], ['Hours', t.h], ['Mins', t.m], ['Secs', t.s]].map(([l, v]) => (
              <div key={l}><b>{String(v).padStart(2, '0')}</b><small>{l}</small></div>
            ))}
          </div>
        )}
        <p className="promo-copy">Bring your family and friends — we serve the real taste of India.</p>
        <Btn href="#visit" className="cta">Find the truck</Btn>
      </motion.div>
    </section>
  )
}

function Visit() {
  const rows = [
    ['pin', 'Find us', CONTACT.address, MAP],
    ['phone', 'Call to order', PHONE, TEL],
    ['wa', 'Message us on WhatsApp', PHONE, WA],
    ['insta', "Today's spot on Instagram", `@${CONTACT.instagram}`, `https://instagram.com/${CONTACT.instagram}`],
    ['mail', 'Email', <>{CONTACT.email.replace(/@.*/, '')}<wbr />{CONTACT.email.replace(/^[^@]*/, '')}</>, `mailto:${CONTACT.email}`],
  ]
  return (
    <section id="visit" className="visit" aria-labelledby="visit-h">
      <motion.figure className="truck" {...reveal}>
        <img src="/img/truck.webp" alt="The Gol Gappa food truck" width="1310" height="810" loading="lazy" />
      </motion.figure>
      <div>
        <motion.header {...reveal}>
          <p className="eyebrow">Find the truck</p>
          <h2 id="visit-h">Hungry? Come say hi.</h2>
          <p className="lead">Find us at {CONTACT.address}. We also serve Cambridge and towns within 20 miles, including Ely, Newmarket, St Ives, Huntingdon, St Neots, Royston, Saffron Walden and Haverhill. Follow us on Instagram to see where we are today, or call or WhatsApp us to order.</p>
        </motion.header>
        <motion.ul className="contact" variants={list} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          {rows.map(([ic, label, val, href]) => (
            <motion.li key={href} variants={row}>
              <motion.a href={href} whileHover={{ x: 4 }} transition={{ duration: 0.2 }} {...(href.startsWith('http') ? ext : {})}>
                <span className={`ic ${ic === 'wa' ? 'ic-wa' : ''}`}>{ic === 'wa' ? <WhatsApp /> : <Icon name={ic} />}</span>
                <span><small>{label}</small>{val}</span>
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

// Native <details> accordions: no JS, keyboard and screen-reader friendly.
function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-h">
      <motion.header className="sips-head" {...reveal}>
        <p className="eyebrow">Good to know</p>
        <h2 id="faq-h">Questions &amp; answers</h2>
        <Squiggle />
      </motion.header>
      {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </section>
  )
}

// Menu + FAQ as schema.org data, built from the same content the page shows.
function Schema() {
  const item = ([name, description]) => ({ '@type': 'MenuItem', name, ...(description && { description }), suitableForDiet: 'https://schema.org/VegetarianDiet' })
  const data = [
    {
      '@context': 'https://schema.org', '@type': 'Menu', '@id': 'https://golgappa.uk/#menu', name: 'Gol Gappa menu', inLanguage: 'en-GB',
      hasMenuSection: ALL.map(c => ({ '@type': 'MenuSection', name: c.title, ...(c.note && { description: c.note }), hasMenuItem: c.items.map(item) })),
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

// Two floating actions: WhatsApp (green, pulsing, nudges every few seconds) and call.
function Fabs() {
  const reduce = useReducedMotion()
  const enter = d => ({ initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, delay: d, ease: EXPO } })
  return (
    <div className="fabs">
      <motion.a href={WA} className="fab fab-wa" aria-label="Message us on WhatsApp" {...ext} {...enter(1.26)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        {!reduce && <motion.span className="fab-pulse" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 2.4, ease: 'easeOut', repeat: Infinity }} />}
        <motion.span className="fab-ic" animate={reduce ? undefined : { rotate: [0, -14, 12, -8, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3.2 }}><WhatsApp size={30} /></motion.span>
      </motion.a>
      <motion.a href={TEL} className="fab" aria-label={`Call ${PHONE} to order`} {...enter(1.4)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
        <Icon name="phone" size={24} />
      </motion.a>
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <Hero />
      <Ribbons />
      <Promo />
      <CategoryBar />
      <main id="menu">
        <motion.div className="menu-head" {...reveal}>
          <p className="eyebrow">Our Indian street food menu</p>
          <h2>Everything on the board</h2>
          <p className="lead">Pani puri, chaat, vada pav, dabeli, wraps, fries and something to sip. All vegetarian. Tap a category to jump straight to it.</p>
        </motion.div>
        {MAINS.map((c, i) => <Category key={c.id} c={c} n={i} />)}
        <Sips />
        <motion.p className="allergy" role="note" {...reveal}>
          <Icon name="alert" size={22} /> <span><b>Allergies?</b> Please tell our staff before you order.</span>
        </motion.p>
      </main>
      <Visit />
      <Faq />
      <footer className="foot">
        <img src="/img/logo.webp" alt="Gol Gappa — Indian Street Food" width="880" height="470" loading="lazy" />
        <p>Crispy. Chatpata. Irresistible.</p>
        <address><a href={MAP} {...ext}>{CONTACT.address}</a> · <a href={TEL}>{PHONE}</a></address>
        <small>© {new Date().getFullYear()} Gol Gappa · Indian Street Food</small>
      </footer>
      <Schema />
      <Fabs />
    </MotionConfig>
  )
}
