import { useState } from 'react'
import { Trophy, Clock, Users, ArrowRight, CheckCircle, Zap, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import './StudentPages.css'

const HACKATHONS = [
  {
    _id: 'h1', title: 'National Web Dev Hackathon', type: 'hackathon',
    desc: 'Build a full-stack web application within 48 hours. Judged on functionality, design, and code quality.',
    prize: 'PKR 500,000', deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    participants: 840, maxTeam: 4, status: 'active', joined: true,
    tracks: ['Web Dev', 'Mobile', 'AI/ML']
  },
  {
    _id: 'h2', title: 'AI Innovation Challenge', type: 'competition',
    desc: 'Build an AI-powered solution to a real-world problem. Use any ML framework.',
    prize: 'PKR 300,000', deadline: new Date(Date.now() + 86400000 * 20).toISOString(),
    participants: 420, maxTeam: 3, status: 'open', joined: false,
    tracks: ['NLP', 'Computer Vision', 'Generative AI']
  },
  {
    _id: 'h3', title: 'Design Sprint 2025', type: 'workshop',
    desc: 'A 72-hour design sprint. Take a problem from brief to high-fidelity prototype.',
    prize: 'Certificate + Mentorship', deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    participants: 200, maxTeam: 2, status: 'open', joined: false,
    tracks: ['UI/UX', 'Product Design']
  },
  {
    _id: 'h4', title: 'Startup Weekend Karachi', type: 'competition',
    desc: 'Pitch your startup idea, form a team, and build an MVP in 54 hours.',
    prize: 'Incubation + PKR 200,000', deadline: new Date(Date.now() - 86400000 * 5).toISOString(),
    participants: 300, maxTeam: 5, status: 'ended', joined: true,
    tracks: ['Startup', 'Business', 'Tech']
  },
]

export default function StudentHackathons() {
  const [hackathons, setHackathons] = useState(HACKATHONS)

  const handleJoin = (id) => {
    setHackathons(prev => prev.map(h => h._id === id ? { ...h, joined: true, participants: h.participants + 1 } : h))
    toast.success('Registered for hackathon!')
  }

  const daysLeft = (deadline) => {
    const d = Math.ceil((new Date(deadline) - Date.now()) / (1000 * 60 * 60 * 24))
    return d > 0 ? `${d} days left` : 'Ended'
  }

  return (
    <div className="hackathons-page page-enter">
      <div className="page-header">
        <div>
          <h1>Hackathons</h1>
          <p className="page-sub">Compete, build, and win — real challenges, real stakes</p>
        </div>
      </div>

      <div className="hackathons-list">
        {hackathons.map(h => {
          const ended = h.status === 'ended'
          const dl = daysLeft(h.deadline)
          return (
            <div key={h._id} className={`hackathon-card ${h.joined && !ended ? 'active-card' : ''} ${ended ? 'ended-card' : ''}`}>
              <div className="hackathon-card-left">
                <div className="hackathon-card-header">
                  <span className={`program-type-badge badge-${h.type}`}>{h.type}</span>
                  {h.joined && !ended && <span className="enrolled-badge"><CheckCircle size={11} /> Registered</span>}
                  {ended && <span className="ended-tag">ENDED</span>}
                </div>
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
                <div className="hackathon-tracks">
                  {h.tracks.map(t => (
                    <span key={t} className="track-tag">{t}</span>
                  ))}
                </div>
                <div className="program-meta-row">
                  <span><Clock size={12} /> {dl}</span>
                  <span><Users size={12} /> {h.participants.toLocaleString()} participants</span>
                  <span><Users size={12} /> Max {h.maxTeam}/team</span>
                </div>
              </div>
              <div className="hackathon-card-right">
                <div className="hackathon-prize-block">
                  <span className="prize-label">Prize Pool</span>
                  <span className="prize-value">{h.prize}</span>
                </div>
                {!ended && (
                  <button
                    className={`program-join-btn ${h.joined ? 'joined' : ''}`}
                    onClick={() => !h.joined && handleJoin(h._id)}
                    disabled={h.joined}
                  >
                    {h.joined
                      ? <><CheckCircle size={13} /> Registered</>
                      : <><Zap size={13} /> Register Now</>
                    }
                  </button>
                )}
                {h.joined && !ended && (
                  <button className="hackathon-submit-btn">
                    <ExternalLink size={13} /> Submit Project
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
