import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { 
  Code2, Briefcase, Palette, ArrowRight, ChevronDown, 
  Trophy, Users, BookOpen, Zap, Star, Play, 
  Shield, Globe, TrendingUp, Award, Clock, CheckCircle,
  Terminal, Layers, Cpu, BarChart3, Monitor
} from 'lucide-react'
import './LandingPage.css'
import logo from '../landing/logo.png'

gsap.registerPlugin(ScrollTrigger)

// ---- DATA ----
const NAV_LINKS = [
  { label: 'Courses', href: '#courses' },
  { label: 'Programs', href: '#programs' },
  { label: 'Competitions', href: '#competitions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Teach', href: '#teach' },
]

const CATEGORIES = [
  { icon: Code2, label: 'Development & Programming', count: '240+ Courses', color: '#BAFC04' },
  { icon: Briefcase, label: 'Business & Entrepreneurship', count: '180+ Courses', color: '#BAFC04' },
  { icon: Palette, label: 'Design & Creativity', count: '150+ Courses', color: '#BAFC04' },
]

const STATS = [
  { value: '48K+', label: 'Active Students' },
  { value: '1,200+', label: 'Expert Courses' },
  { value: '320+', label: 'Live Instructors' },
  { value: '98%', label: 'Completion Rate' },
]

const COURSES = [
  { id: 1, title: 'Full Stack React & Node.js', instructor: 'Ayesha Tariq', category: 'Development', price: 2999, rating: 4.9, students: 3240, tag: 'BESTSELLER', free: false },
  { id: 2, title: 'UI/UX Design Mastery', instructor: 'Omar Siddiqui', category: 'Design', price: 0, rating: 4.8, students: 1840, tag: 'FREE', free: true },
  { id: 3, title: 'Digital Marketing Strategy', instructor: 'Sana Malik', category: 'Business', price: 1999, rating: 4.7, students: 2100, tag: 'NEW', free: false },
  { id: 4, title: 'Python for Data Science', instructor: 'Ali Hassan', category: 'Development', price: 0, rating: 4.9, students: 5200, tag: 'FREE', free: true },
  { id: 5, title: 'Brand Identity Design', instructor: 'Fatima Rizvi', category: 'Design', price: 2499, rating: 4.6, students: 980, tag: 'HOT', free: false },
  { id: 6, title: 'Startup Fundamentals', instructor: 'Bilal Ahmed', category: 'Business', price: 1499, rating: 4.8, students: 1560, tag: 'POPULAR', free: false },
]

const COMPETITIONS = [
  { id: 1, title: 'National Web Dev Hackathon', type: 'HACKATHON', prize: 'PKR 500,000', deadline: '30 Jan', participants: 840, status: 'OPEN' },
  { id: 2, title: 'AI Innovation Challenge', type: 'COMPETITION', prize: 'PKR 300,000', deadline: '15 Feb', participants: 420, status: 'OPEN' },
  { id: 3, title: 'Design Sprint 2025', type: 'WORKSHOP', prize: 'Certificate + Mentorship', deadline: '20 Jan', participants: 200, status: 'OPEN' },
]

const TESTIMONIALS = [
  { name: 'Amna Khalid', role: 'Frontend Developer @ Systems Ltd', text: 'NEXUS transformed my career. The React course was incredibly practical — I landed my first job within 2 months of completing it.', rating: 5 },
  { name: 'Hassan Raza', role: 'UX Designer @ NED University', text: 'The hackathon experience here is unmatched. I competed in 3 events and built a portfolio that speaks for itself.', rating: 5 },
  { name: 'Zara Niazi', role: 'Product Manager @ Careem', text: 'The business courses gave me real frameworks I apply every day. The instructors are industry practitioners, not theorists.', rating: 5 },
  { name: 'Faisal Mahmood', role: 'Full Stack Engineer @ Arbisoft', text: 'I went from zero to deployed full-stack apps in 4 months. The assignment system with real feedback was a game changer.', rating: 5 },
]

const PRICING = [
  {
    name: 'LEARNER', price: 0, period: 'Free Forever',
    features: ['5 Free Courses', 'Community Access', 'Basic Assignments', 'Certificate of Completion', 'Join Open Workshops'],
    cta: 'Start Free', highlight: false
  },
  {
    name: 'BUILDER', price: 2499, period: 'per month',
    features: ['All 1200+ Courses', 'Priority Assignments Review', 'Join All Hackathons', 'Live Mentorship Sessions', 'Career Support', 'Verified Badge'],
    cta: 'Get Builder', highlight: true
  },
  {
    name: 'TEAM', price: 9999, period: 'per month',
    features: ['Everything in Builder', 'Up to 10 Seats', 'Custom Learning Paths', 'Analytics Dashboard', 'Dedicated Instructor', 'Private Workshops'],
    cta: 'Get Team', highlight: false
  }
]

const TEACHER_ROLES = [
  { icon: Monitor, title: 'Course Creator', desc: 'Build structured courses with video, quizzes, and assignments. Earn per enrollment.' },
  { icon: BarChart3, title: 'Workshop Host', desc: 'Run live workshops and interactive sessions. Reach hundreds of learners at once.' },
  { icon: Award, title: 'Hackathon Mentor', desc: 'Guide teams through competitions. Be the expert students trust on deadline night.' },
  { icon: Layers, title: 'Program Director', desc: 'Design full learning programs. Curate content, assignments, and milestones end-to-end.' },
]

export default function LandingPage() {
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const sectionsRef = useRef([])

  useEffect(() => {
    // Hero entrance
    const tl = gsap.timeline({ delay: 0.2 })
    tl.fromTo('.hero-tag', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .fromTo('.hero-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3')

    // Section scroll animations
    gsap.utils.toArray('.scroll-reveal').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        }
      )
    })

    // Stagger children reveal
    gsap.utils.toArray('.stagger-children').forEach((container) => {
      const children = container.children
      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: container, start: 'top 80%', toggleActions: 'play none none none' }
        }
      )
    })

    // Background color transform
    ScrollTrigger.create({
      trigger: '.section-transform',
      start: 'top 60%',
      end: 'bottom 60%',
      onEnter: () => gsap.to('body', { backgroundColor: '#060C05', duration: 0.8, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to('body', { backgroundColor: '#080C0F', duration: 0.8, ease: 'power2.out' }),
      onLeave: () => gsap.to('body', { backgroundColor: '#080C0F', duration: 0.8, ease: 'power2.out' }),
    })

    // Horizontal ticker
    gsap.to('.ticker-inner', {
      x: '-50%',
      duration: 25,
      ease: 'none',
      repeat: -1,
    })

    // Course cards hover effect handled via CSS

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="landing grain">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="nav-inner container-wide">
          <Link to="/" className="nav-logo">
            {/* REPLACE: swap this with your actual logo image */}
            <div className="logo-mark"><img src={logo} alt="" /> </div>
            <span>UNA</span>
          </Link>
          <ul className="nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <Link to="/login" className="btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn-primary">Join Free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-video-wrap">
          <video
            ref={videoRef}
            src="https://res.cloudinary.com/dy7z0znum/video/upload/v1778598058/hero-video_--_ctezbs.mp4"
            autoPlay muted loop playsInline
            className="hero-video"
          />
          <div className="hero-video-overlay" />
        </div>

        <div className="hero-content container">
          <div className="hero-tag scroll-reveal">
            <span className="tag">
              <Zap size={10} />
              Pakistan's #1 Learning Platform
            </span>
          </div>
          <h1 className="hero-title">
            <span className="hero-title-line">LEARN.</span>
            <span className="hero-title-line accent">BUILD.</span>
            <span className="hero-title-line">COMPETE.</span>
          </h1>
          <p className="hero-sub">
            Master in-demand skills, join elite hackathons, and launch your career —
            all in one platform built for the next generation of creators.
          </p>
          <div className="hero-cta-group">
            <Link to="/signup" className="hero-cta btn-primary-lg">
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <a href="#courses" className="hero-cta btn-outline-lg">
              <Play size={16} /> Browse Courses
            </a>
          </div>
          <div className="hero-stats stagger-children">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-scroll-hint">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="ticker-content">
              {['FULL STACK DEV', 'UI/UX DESIGN', 'DATA SCIENCE', 'DIGITAL MARKETING', 'HACKATHONS', 'LIVE WORKSHOPS', 'PYTHON', 'REACT', 'NODE.JS', 'MONGODB', 'FIGMA', 'FREE COURSES'].map(t => (
                <span key={t} className="ticker-item">
                  <span className="ticker-dot">●</span> {t}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section" id="courses">
        <div className="container">
          <div className="section-head scroll-reveal">
            <span className="tag"><Layers size={10} /> Categories</span>
            <h2 className="section-title">Three Worlds.<br />Infinite Paths.</h2>
            <p className="section-sub">Every track leads somewhere real. Pick yours.</p>
          </div>
          <div className="categories-grid stagger-children">
            {CATEGORIES.map(c => (
              <div key={c.label} className="category-card">
                <div className="category-icon"><c.icon size={28} /></div>
                <div className="category-body">
                  <h3>{c.label}</h3>
                  <span className="category-count">{c.count}</span>
                </div>
                <ArrowRight size={20} className="category-arrow" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="section section-transform" id="courses-list">
        <div className="container">
          <div className="section-head scroll-reveal">
            <span className="tag"><BookOpen size={10} /> Curriculum</span>
            <h2 className="section-title">Courses Built<br />For the Real World.</h2>
          </div>
          <div className="courses-grid stagger-children">
            {COURSES.map(c => (
              <div key={c.id} className="course-card">
                <div className="course-card-top">
                  <div className="course-thumb">
                    <div className="course-thumb-bg" style={{ background: c.free ? 'rgba(186,252,4,0.08)' : 'rgba(255,255,255,0.04)' }}>
                      <Code2 size={32} className="course-thumb-icon" />
                    </div>
                  </div>
                  <span className={`course-badge ${c.free ? 'free' : ''}`}>{c.tag}</span>
                </div>
                <div className="course-card-body">
                  <span className="course-category">{c.category}</span>
                  <h3 className="course-title">{c.title}</h3>
                  <span className="course-instructor">{c.instructor}</span>
                  <div className="course-meta">
                    <span className="course-rating">
                      <Star size={12} fill="#BAFC04" color="#BAFC04" /> {c.rating}
                    </span>
                    <span className="course-students">
                      <Users size={12} /> {c.students.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="course-card-foot">
                  <span className="course-price">
                    {c.free ? <span className="price-free">FREE</span> : <span>PKR {c.price.toLocaleString()}</span>}
                  </span>
                  <Link to="/signup" className="course-enroll">Enroll <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta scroll-reveal">
            <Link to="/signup" className="btn-outline-lg">
              View All 1,200+ Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section className="section" id="competitions">
        <div className="container">
          <div className="section-head scroll-reveal">
            <span className="tag"><Trophy size={10} /> Compete</span>
            <h2 className="section-title">Hackathons,<br />Workshops & More.</h2>
            <p className="section-sub">Build under pressure. Ship real products. Win real prizes.</p>
          </div>
          <div className="competitions-list stagger-children">
            {COMPETITIONS.map(c => (
              <div key={c.id} className="competition-row">
                <div className="comp-left">
                  <span className={`comp-type-badge ${c.type.toLowerCase()}`}>{c.type}</span>
                  <div>
                    <h3 className="comp-title">{c.title}</h3>
                    <div className="comp-meta">
                      <span><Clock size={12} /> Closes {c.deadline}</span>
                      <span><Users size={12} /> {c.participants} joined</span>
                    </div>
                  </div>
                </div>
                <div className="comp-right">
                  <div className="comp-prize">
                    <span className="comp-prize-label">Prize Pool</span>
                    <span className="comp-prize-value">{c.prize}</span>
                  </div>
                  <Link to="/signup" className="btn-primary comp-join">Join Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-head scroll-reveal">
            <span className="tag"><Star size={10} /> Reviews</span>
            <h2 className="section-title">What Our<br />Students Say.</h2>
          </div>
          <div className="testimonials-grid stagger-children">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`testimonial-card ${i === 0 ? 'featured' : ''}`}>
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#BAFC04" color="#BAFC04" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEACH */}
      <section className="section section-teach" id="teach">
        <div className="container">
          <div className="teach-inner scroll-reveal">
            <div className="teach-left">
              <span className="tag"><Globe size={10} /> Become a Teacher</span>
              <h2 className="section-title">Share What<br />You Know.</h2>
              <p className="section-sub">Join 320+ instructors already earning on NEXUS. No studio required — just expertise and commitment.</p>
              <Link to="/signup?role=teacher" className="btn-primary-lg">
                Apply as Teacher <ArrowRight size={18} />
              </Link>
            </div>
            <div className="teach-roles stagger-children">
              {TEACHER_ROLES.map(r => (
                <div key={r.title} className="teach-role-card">
                  <div className="teach-role-icon"><r.icon size={22} /></div>
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-head scroll-reveal">
            <span className="tag"><Zap size={10} /> Pricing</span>
            <h2 className="section-title">Simple,<br />Honest Pricing.</h2>
            <p className="section-sub">No hidden fees. Cancel anytime. Real value or your money back.</p>
          </div>
          <div className="pricing-grid stagger-children">
            {PRICING.map(p => (
              <div key={p.name} className={`pricing-card ${p.highlight ? 'pricing-highlight' : ''}`}>
                {p.highlight && <div className="pricing-popular-tag">MOST POPULAR</div>}
                <div className="pricing-header">
                  <span className="pricing-name">{p.name}</span>
                  <div className="pricing-price">
                    {p.price === 0 ? <span className="price-num">Free</span> : (
                      <><span className="price-currency">PKR</span><span className="price-num">{p.price.toLocaleString()}</span></>
                    )}
                    <span className="price-period">/ {p.period}</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  {p.features.map(f => (
                    <li key={f}><CheckCircle size={15} /> {f}</li>
                  ))}
                </ul>
                <Link to="/signup" className={`pricing-cta ${p.highlight ? 'btn-primary' : 'btn-outline'}`}>
                  {p.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section cta-section scroll-reveal">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-bg" />
            <div className="cta-banner-content">
              <h2>Your next chapter<br />starts today.</h2>
              <p>Join 48,000+ learners already building on NEXUS.</p>
              <Link to="/signup" className="btn-primary-lg">
                Get Started — It's Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-mark"><img src={logo} alt="" /></div>
                <span>UNA</span>
              </div>
              <p>Pakistan's platform for builders, learners, and creators. Learn today. Lead tomorrow.</p>
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h5>Platform</h5>
                <a href="#courses">Courses</a>
                <a href="#competitions">Hackathons</a>
                <a href="#programs">Programs</a>
                <a href="#teach">Teach on NEXUS</a>
              </div>
              <div className="footer-col">
                <h5>Company</h5>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
              </div>
              <div className="footer-col">
                <h5>Legal</h5>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Refund Policy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 NEXUS Learning. All rights reserved.</span>
            <span>Made in Karachi, Pakistan</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
