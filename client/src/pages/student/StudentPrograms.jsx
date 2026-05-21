// StudentPrograms.jsx
import { useState } from 'react'
import { Users, Clock, Trophy, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import './StudentPages.css'

const PROGRAMS = [
  { _id: 'p1', type: 'workshop', title: 'React & Next.js Bootcamp', desc: 'An intensive 4-week program covering React fundamentals, hooks, Next.js SSR/SSG, and deployment.', instructor: 'Ayesha Tariq', duration: '4 Weeks', seats: 40, joined: true, startDate: '20 Jan 2025' },
  { _id: 'p2', type: 'workshop', title: 'UI/UX Foundations Workshop', desc: 'Learn design thinking, wireframing, Figma, and building real-world UI systems.', instructor: 'Omar Siddiqui', duration: '2 Weeks', seats: 30, joined: false, startDate: '5 Feb 2025' },
  { _id: 'p3', type: 'competition', title: 'Data Science Olympiad', desc: 'A 30-day data challenge. Analyze datasets, build models, and compete for top rankings.', instructor: 'Ali Hassan', duration: '30 Days', seats: 100, joined: false, prize: 'PKR 150,000', startDate: '1 Feb 2025' },
  { _id: 'p4', type: 'workshop', title: 'Cloud & DevOps Fundamentals', desc: 'Hands-on sessions covering AWS, Docker, CI/CD pipelines, and production deployment.', instructor: 'Usman Farooq', duration: '3 Weeks', seats: 25, joined: true, startDate: '15 Jan 2025' },
]

export default function StudentPrograms() {
  const [programs, setPrograms] = useState(PROGRAMS)

  const handleJoin = (id) => {
    setPrograms(prev => prev.map(p => p._id === id ? { ...p, joined: true } : p))
    toast.success('Joined program successfully!')
  }

  return (
    <div className="programs-page page-enter">
      <div className="page-header">
        <div>
          <h1>Programs</h1>
          <p className="page-sub">Workshops, bootcamps, and learning programs</p>
        </div>
      </div>
      <div className="programs-grid">
        {programs.map(p => (
          <div key={p._id} className="program-card">
            <div className="program-card-top">
              <span className={`program-type-badge badge-${p.type}`}>{p.type}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="program-meta-row">
              <span><Clock size={12} /> {p.duration}</span>
              <span><Users size={12} /> {p.seats} seats</span>
              <span>Starts {p.startDate}</span>
            </div>
            {p.prize && <div className="program-prize"><Trophy size={14} /> Prize: {p.prize}</div>}
            <div className="program-footer">
              <span className="course-instructor-name">{p.instructor}</span>
              <button
                className={`program-join-btn ${p.joined ? 'joined' : ''}`}
                onClick={() => !p.joined && handleJoin(p._id)}
                disabled={p.joined}
              >
                {p.joined ? <><CheckCircle size={13} /> Joined</> : <>Join <ArrowRight size={13} /></>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
