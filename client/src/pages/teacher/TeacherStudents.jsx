import { useState } from 'react'
import { Search, Users, TrendingUp, MessageSquare, AlertTriangle, Eye, X } from 'lucide-react'
import './TeacherPages.css'

const MOCK_STUDENTS = [
  { _id: 's1', name: 'Amna Khalid', email: 'amna@example.com', courses: ['Full Stack React', 'Backend Dev'], progress: 72, assignments: { submitted: 5, approved: 4, pending: 1 }, lastActive: new Date(Date.now() - 3600000).toISOString(), feedback: '', complaints: [] },
  { _id: 's2', name: 'Hassan Raza', email: 'hassan@example.com', courses: ['React Mastery'], progress: 45, assignments: { submitted: 3, approved: 2, pending: 1 }, lastActive: new Date(Date.now() - 86400000).toISOString(), feedback: '', complaints: [] },
  { _id: 's3', name: 'Zara Niazi', email: 'zara@example.com', courses: ['Full Stack React'], progress: 90, assignments: { submitted: 7, approved: 7, pending: 0 }, lastActive: new Date(Date.now() - 7200000).toISOString(), feedback: 'Excellent teacher!', complaints: [] },
  { _id: 's4', name: 'Faisal Mahmood', email: 'faisal@example.com', courses: ['Backend Dev', 'MongoDB Basics'], progress: 38, assignments: { submitted: 2, approved: 1, pending: 2 }, lastActive: new Date(Date.now() - 86400000 * 3).toISOString(), feedback: '', complaints: ['Assignments are unclear'] },
  { _id: 's5', name: 'Sana Mirza', email: 'sana@example.com', courses: ['Full Stack React'], progress: 60, assignments: { submitted: 4, approved: 3, pending: 1 }, lastActive: new Date(Date.now() - 86400000 * 2).toISOString(), feedback: '', complaints: [] },
]

export default function TeacherStudents() {
  const [students] = useState(MOCK_STUDENTS)
  const [search, setSearch] = useState('')
  const [viewStudent, setViewStudent] = useState(null)

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso)
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    return d > 0 ? `${d}d ago` : `${h}h ago`
  }

  return (
    <div className="teacher-page page-enter">
      <div className="teacher-page-header">
        <div><h1>Students</h1><p className="page-sub">Monitor student progress and engagement</p></div>
        <div className="search-box" style={{ width: 280 }}>
          <Search size={15} />
          <input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 16 }}>
        {[
          { label: 'Total Students', value: students.length, icon: Users },
          { label: 'Avg Progress', value: `${Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length)}%`, icon: TrendingUp },
          { label: 'Pending Assignments', value: students.reduce((a, s) => a + s.assignments.pending, 0), icon: AlertTriangle },
          { label: 'Feedback Received', value: students.filter(s => s.feedback).length, icon: MessageSquare },
        ].map(k => (
          <div key={k.label} className="teacher-kpi-card">
            <div className="kpi-top"><span className="kpi-label">{k.label}</span><k.icon size={15} style={{ color: 'var(--green)' }} /></div>
            <div className="kpi-value" style={{ color: 'var(--green)', fontSize: '1.6rem' }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="teacher-table-wrap">
        <div className="teacher-table-head" style={{ gridTemplateColumns: '2fr 1.5fr 80px 1fr 100px 60px' }}>
          <span>Student</span><span>Courses</span><span>Progress</span><span>Assignments</span><span>Last Active</span><span></span>
        </div>
        {filtered.map(s => (
          <div key={s._id} className="teacher-table-row" style={{ gridTemplateColumns: '2fr 1.5fr 80px 1fr 100px 60px' }}>
            <div className="table-cell-main">
              <div className="review-student-avatar">{s.name[0]}</div>
              <div>
                <span className="table-title">{s.name}</span>
                <span className="table-sub">{s.email}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {s.courses.map(c => <span key={c} className="table-tag" style={{ fontSize: 10, padding: '2px 6px' }}>{c}</span>)}
            </div>
            <div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ height: '100%', width: `${s.progress}%`, background: s.progress >= 70 ? 'var(--green)' : s.progress >= 40 ? '#FFC800' : '#ff6060', borderRadius: 2 }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)' }}>{s.progress}%</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--green)' }}>{s.assignments.approved} ✓</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: '#FFC800' }}>{s.assignments.pending} pending</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)' }}>{timeAgo(s.lastActive)}</span>
            <button className="tbl-btn" onClick={() => setViewStudent(s)}><Eye size={14} /></button>
          </div>
        ))}
      </div>

      {viewStudent && (
        <div className="modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{viewStudent.name}</h3>
                <p className="modal-sub">{viewStudent.email}</p>
              </div>
              <button className="modal-close" onClick={() => setViewStudent(null)}><X size={20} /></button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Overall Progress', value: `${viewStudent.progress}%` },
                  { label: 'Approved', value: viewStudent.assignments.approved },
                  { label: 'Pending', value: viewStudent.assignments.pending },
                  { label: 'Submitted', value: viewStudent.assignments.submitted },
                ].map(i => (
                  <div key={i.label} style={{ background: '#0A0F14', border: '1px solid rgba(186,252,4,0.1)', padding: '14px 16px', borderRadius: 2 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>{i.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--green)' }}>{i.value}</span>
                  </div>
                ))}
              </div>
              {viewStudent.feedback && (
                <div style={{ padding: '14px 16px', background: 'rgba(186,252,4,0.05)', border: '1px solid var(--border-green)', borderRadius: 2 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)', display: 'block', marginBottom: 6 }}>Feedback</span>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>{viewStudent.feedback}</p>
                </div>
              )}
              {viewStudent.complaints.length > 0 && (
                <div style={{ padding: '14px 16px', background: 'rgba(255,80,80,0.05)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: 2 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff6060', display: 'block', marginBottom: 6 }}>Complaints</span>
                  {viewStudent.complaints.map((c, i) => <p key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{c}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
