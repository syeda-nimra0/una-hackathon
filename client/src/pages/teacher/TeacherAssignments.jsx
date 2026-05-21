// TeacherAssignments.jsx
import { useState } from 'react'
import { CheckCircle, XCircle, Eye, Plus, X, Save, FileText, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import './TeacherPages.css'

const MOCK_SUBMISSIONS = [
  { _id: 's1', student: 'Amna Khalid', assignment: 'REST API Build', course: 'Full Stack React', status: 'submitted', submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(), hostingLink: 'https://api-demo.netlify.app', description: 'Built complete CRUD API with auth middleware and MongoDB.' },
  { _id: 's2', student: 'Hassan Raza', assignment: 'UI Component Library', course: 'React Mastery', status: 'submitted', submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(), hostingLink: 'https://components.netlify.app', description: 'All 5 components done with TypeScript and Storybook docs.' },
  { _id: 's3', student: 'Zara Niazi', assignment: 'MongoDB Schema', course: 'Backend Dev', status: 'approved', submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(), hostingLink: '', description: 'Designed relational schema with proper indexes.', feedback: 'Excellent work!' },
  { _id: 's4', student: 'Faisal Mahmood', assignment: 'CSS Grid Challenge', course: 'Frontend Mastery', status: 'not_approved', submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(), hostingLink: 'https://grid.netlify.app', description: 'Layout complete.', feedback: 'Mobile breakpoints need revision.' },
]

const FILTERS = ['all', 'submitted', 'approved', 'not_approved']

export default function TeacherAssignments() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS)
  const [filter, setFilter] = useState('all')
  const [viewSub, setViewSub] = useState(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [createModal, setCreateModal] = useState(false)
  const [form, setForm] = useState({ title: '', course: '', description: '', dueDate: '', points: 10 })

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter)

  const approve = (id) => {
    setSubmissions(prev => prev.map(s => s._id === id ? { ...s, status: 'approved', feedback: feedbackText } : s))
    toast.success('Assignment approved')
    setViewSub(null)
  }

  const reject = (id) => {
    if (!feedbackText.trim()) return toast.error('Please add feedback before rejecting')
    setSubmissions(prev => prev.map(s => s._id === id ? { ...s, status: 'not_approved', feedback: feedbackText } : s))
    toast.success('Assignment returned with feedback')
    setViewSub(null)
  }

  const createAssignment = async (e) => {
    e.preventDefault()
    try { await api.post('/teacher/assignments', form) } catch {}
    toast.success('Assignment created and published!')
    setCreateModal(false)
    setForm({ title: '', course: '', description: '', dueDate: '', points: 10 })
  }

  const statusConfig = {
    submitted: { label: 'Submitted', cls: 'status-submitted' },
    approved: { label: 'Approved', cls: 'status-approved' },
    not_approved: { label: 'Not Approved', cls: 'status-rejected' },
  }

  return (
    <div className="teacher-page page-enter">
      <div className="teacher-page-header">
        <div><h1>Assignments</h1><p className="page-sub">Review student submissions and provide feedback</p></div>
        <button className="teacher-action-btn primary" onClick={() => setCreateModal(true)}><Plus size={14} /> Create Assignment</button>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            <span className="filter-count">{f === 'all' ? submissions.length : submissions.filter(s => s.status === f).length}</span>
          </button>
        ))}
      </div>

      <div className="teacher-table-wrap">
        <div className="teacher-table-head"><span>Student</span><span>Assignment</span><span>Course</span><span>Status</span><span>Actions</span></div>
        {filtered.map(s => {
          const sc = statusConfig[s.status] || { label: s.status, cls: '' }
          return (
            <div key={s._id} className="teacher-table-row">
              <div className="table-cell-main">
                <div className="review-student-avatar">{s.student[0]}</div>
                <div><span className="table-title">{s.student}</span></div>
              </div>
              <span className="table-cell" style={{ fontWeight: 600 }}>{s.assignment}</span>
              <span className="table-tag">{s.course}</span>
              <span className={`assignment-status-badge ${sc.cls}`}>{sc.label}</span>
              <div className="table-actions">
                <button className="tbl-btn" onClick={() => { setViewSub(s); setFeedbackText(s.feedback || '') }}><Eye size={14} /></button>
                {s.status === 'submitted' && (
                  <>
                    <button className="tbl-btn approve-btn" onClick={() => { setSubmissions(prev => prev.map(x => x._id === s._id ? { ...x, status: 'approved' } : x)); toast.success('Approved') }}><CheckCircle size={14} /></button>
                    <button className="tbl-btn danger" onClick={() => { setViewSub(s); setFeedbackText('') }}><XCircle size={14} /></button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* View/Review Modal */}
      {viewSub && (
        <div className="modal-overlay" onClick={() => setViewSub(null)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Submission Review</h3><p className="modal-sub">{viewSub.student} · {viewSub.assignment}</p></div>
              <button className="modal-close" onClick={() => setViewSub(null)}><X size={20} /></button>
            </div>
            <div className="submission-view">
              {viewSub.hostingLink && (
                <div className="submission-field">
                  <span className="submission-label">Live Link</span>
                  <a href={viewSub.hostingLink} target="_blank" rel="noopener noreferrer" className="submission-link">
                    <ExternalLink size={13} style={{ display: 'inline', marginRight: 5 }} />{viewSub.hostingLink}
                  </a>
                </div>
              )}
              <div className="submission-field">
                <span className="submission-label">Description</span>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{viewSub.description}</p>
              </div>
              {viewSub.status === 'submitted' && (
                <div className="form-field">
                  <label>Your Feedback</label>
                  <textarea rows={3} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Write feedback for the student..." />
                </div>
              )}
              {viewSub.feedback && viewSub.status !== 'submitted' && (
                <div className="submission-feedback">
                  <span className="submission-label">Feedback Given</span>
                  <p>{viewSub.feedback}</p>
                </div>
              )}
            </div>
            {viewSub.status === 'submitted' && (
              <div className="modal-actions" style={{ padding: '0 24px 24px' }}>
                <button className="btn-ghost-sm" onClick={() => setViewSub(null)}>Close</button>
                <button className="btn-ghost-sm" style={{ color: '#ff6060', borderColor: 'rgba(255,80,80,0.3)' }} onClick={() => reject(viewSub._id)}><XCircle size={13} /> Return</button>
                <button className="btn-primary-sm" onClick={() => approve(viewSub._id)}><CheckCircle size={13} /> Approve</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {createModal && (
        <div className="modal-overlay" onClick={() => setCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Create Assignment</h3></div>
              <button className="modal-close" onClick={() => setCreateModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={createAssignment} className="modal-form">
              <div className="form-field"><label>Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title" required />
              </div>
              <div className="form-row">
                <div className="form-field"><label>Course</label>
                  <input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} placeholder="Course name" required />
                </div>
                <div className="form-field"><label>Points</label>
                  <input type="number" min="1" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} required />
                </div>
              </div>
              <div className="form-field"><label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
              </div>
              <div className="form-field"><label>Description / Instructions</label>
                <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what students should build..." required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost-sm" onClick={() => setCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-sm"><Save size={13} /> Publish Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

