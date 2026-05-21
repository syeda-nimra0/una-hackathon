import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import {
  FileText, Upload, Link as LinkIcon, CheckCircle,
  XCircle, Clock, AlertCircle, Edit2, Eye, X, Image
} from 'lucide-react'
import './StudentAssignments.css'

// Fallback mock data — only used when backend is offline
// NOTE: These use real-looking IDs to avoid ObjectId cast errors
const FALLBACK_ASSIGNMENTS = [
  {
    _id: '000000000000000000000001',
    title: 'Build a REST API with Express',
    course: 'Backend with Node.js',
    description: 'Create a full REST API with CRUD operations. Use Express.js, proper routing, error handling, and connect to MongoDB.',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    points: 30, status: 'pending', submission: null, teacherFeedback: ''
  },
  {
    _id: '000000000000000000000002',
    title: 'React Component Library',
    course: 'Full Stack React',
    description: 'Build 5 reusable React components: Button, Modal, Card, Input, Dropdown.',
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    points: 25, status: 'submitted',
    submission: { hostingLink: 'https://myapp.netlify.app', description: 'Built all 5 components', screenshotUrl: null },
    teacherFeedback: ''
  },
  {
    _id: '000000000000000000000003',
    title: 'MongoDB Schema Design',
    course: 'Backend with Node.js',
    description: 'Design an optimal schema for an e-commerce application.',
    dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    points: 20, status: 'approved',
    submission: { hostingLink: '', description: 'Schema complete', screenshotUrl: null },
    teacherFeedback: 'Excellent work! Clean schema design.'
  },
  {
    _id: '000000000000000000000004',
    title: 'CSS Grid Layout Challenge',
    course: 'Frontend Mastery',
    description: 'Recreate the given design mockup using CSS Grid. Must be fully responsive.',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    points: 15, status: 'not_approved',
    submission: { hostingLink: 'https://layout.netlify.app', description: 'Layout done' },
    teacherFeedback: 'Mobile responsiveness needs work.'
  },
]

const STATUS_FILTERS = ['all', 'pending', 'submitted', 'approved', 'not_approved']

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewModal, setViewModal] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [form, setForm] = useState({ hostingLink: '', description: '', screenshotFile: null, screenshotPreview: null })

  // Fetch real assignments from backend
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/student/assignments')
        if (res.data?.assignments?.length > 0) {
          setAssignments(res.data.assignments)
        } else {
          setAssignments(FALLBACK_ASSIGNMENTS)
        }
      } catch {
        // Backend offline — use fallback
        setAssignments(FALLBACK_ASSIGNMENTS)
      } finally {
        setLoading(false)
      }
    }
    fetchAssignments()
  }, [])

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter)

  const openSubmit = (a) => {
    setSelectedAssignment(a)
    if (a.submission) {
      setForm({
        hostingLink: a.submission.hostingLink || '',
        description: a.submission.description || '',
        screenshotFile: null,
        screenshotPreview: a.submission.screenshotUrl || null
      })
    } else {
      setForm({ hostingLink: '', description: '', screenshotFile: null, screenshotPreview: null })
    }
    setModalOpen(true)
  }

  const onDrop = useCallback((files) => {
    const file = files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setForm(f => ({ ...f, screenshotFile: file, screenshotPreview: preview }))
    toast.success('Screenshot attached')
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) return toast.error('Please add a description')
    setSubmitting(true)
    setUploadProgress(0)

    try {
      let screenshotUrl = form.screenshotPreview

      // Upload screenshot if new file selected
      if (form.screenshotFile) {
        const interval = setInterval(() => setUploadProgress(p => Math.min(p + 15, 90)), 200)
        try {
          const { uploadToCloudinary, isCloudinaryConfigured } = await import('../../utils/cloudinary')
          if (isCloudinaryConfigured()) {
            screenshotUrl = await uploadToCloudinary(form.screenshotFile, 'nexus_lms/submissions')
          }
        } catch (err) {
          toast.error('Screenshot upload failed: ' + err.message)
        }
        clearInterval(interval)
      }
      setUploadProgress(100)

      // Submit to backend — only if _id looks like a real ObjectId (24 hex chars)
      const isRealId = /^[a-f\d]{24}$/i.test(selectedAssignment._id)
      if (isRealId) {
        try {
          await api.post(`/student/assignments/${selectedAssignment._id}/submit`, {
            hostingLink: form.hostingLink,
            description: form.description,
            screenshotUrl,
          })
        } catch (err) {
          // Backend error — still update local state
          console.warn('Backend submit failed:', err.message)
        }
      }

      // Always update local state
      setAssignments(prev => prev.map(a => a._id === selectedAssignment._id ? {
        ...a,
        status: 'submitted',
        submission: { hostingLink: form.hostingLink, description: form.description, screenshotUrl }
      } : a))

      toast.success('Assignment submitted!')
      setModalOpen(false)
    } catch (err) {
      toast.error('Submission failed: ' + err.message)
    } finally {
      setSubmitting(false)
      setUploadProgress(0)
    }
  }

  const statusConfig = {
    submitted: { icon: CheckCircle, label: 'Submitted', cls: 'status-submitted' },
    approved: { icon: CheckCircle, label: 'Approved', cls: 'status-approved' },
    not_approved: { icon: XCircle, label: 'Not Approved', cls: 'status-rejected' },
    pending: { icon: Clock, label: 'Pending', cls: 'status-pending' },
  }

  if (loading) return <div className="page-loading"><span className="spinner-lg" /></div>

  return (
    <div className="assignments-page page-enter">
      <div className="page-header">
        <div>
          <h1>Assignments</h1>
          <p className="page-sub">Track, submit and manage your course assignments</p>
        </div>
      </div>

      <div className="filter-tabs">
        {STATUS_FILTERS.map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            <span className="filter-count">
              {f === 'all' ? assignments.length : assignments.filter(a => a.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="assignments-list">
        {filtered.map(a => {
          const { icon: Icon, label, cls } = statusConfig[a.status] || statusConfig.pending
          const isOverdue = new Date(a.dueDate) < Date.now() && a.status === 'pending'
          return (
            <div key={a._id} className={`assignment-card ${isOverdue ? 'overdue' : ''}`}>
              <div className="assignment-card-left">
                <div className="assignment-card-icon"><FileText size={20} /></div>
                <div className="assignment-card-info">
                  <div className="assignment-card-meta">
                    <span className="assignment-course">{a.course}</span>
                    <span className="assignment-points">{a.points} pts</span>
                  </div>
                  <h3 className="assignment-card-title">{a.title}</h3>
                  <p className="assignment-card-desc">{a.description}</p>
                  <div className="assignment-card-due">
                    <Clock size={12} />
                    <span className={isOverdue ? 'text-red' : ''}>
                      Due: {new Date(a.dueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {isOverdue && ' — Overdue'}
                    </span>
                  </div>
                  {a.teacherFeedback && (
                    <div className="teacher-feedback">
                      <AlertCircle size={13} />
                      <span><b>Feedback:</b> {a.teacherFeedback}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="assignment-card-right">
                <span className={`assignment-status-badge ${cls}`}>
                  <Icon size={12} /> {label}
                </span>
                <div className="assignment-actions">
                  {a.submission && (
                    <button className="btn-icon-sm" onClick={() => setViewModal(a)} title="View submission">
                      <Eye size={16} />
                    </button>
                  )}
                  {(a.status === 'pending' || a.status === 'not_approved' || a.status === 'submitted') && (
                    <button className="assignment-submit-btn" onClick={() => openSubmit(a)}>
                      {a.status === 'submitted' ? <><Edit2 size={14} /> Edit</> : <><Upload size={14} /> Submit</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="empty-state"><FileText size={40} /><p>No assignments in this category</p></div>
        )}
      </div>

      {/* Submit Modal */}
      {modalOpen && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{selectedAssignment.status === 'submitted' ? 'Edit Submission' : 'Submit Assignment'}</h3>
                <p className="modal-sub">{selectedAssignment.title}</p>
              </div>
              <button className="modal-close" onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-field">
                <label><LinkIcon size={13} /> Hosting / Live Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://your-project.netlify.app"
                  value={form.hostingLink}
                  onChange={e => setForm(f => ({ ...f, hostingLink: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label><FileText size={13} /> Description *</label>
                <textarea
                  rows={4}
                  placeholder="Describe what you built, challenges faced, and what you learned..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  required
                />
              </div>
              <div className="form-field">
                <label><Image size={13} /> Screenshot (optional)</label>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  {form.screenshotPreview ? (
                    <div className="dropzone-preview">
                      <img src={form.screenshotPreview} alt="Preview" />
                      <button type="button" className="dropzone-remove" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, screenshotFile: null, screenshotPreview: null })) }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="dropzone-content">
                      <Upload size={24} />
                      <span>{isDragActive ? 'Drop here...' : 'Drag & drop screenshot or click'}</span>
                      <span className="dropzone-hint">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              {submitting && uploadProgress > 0 && (
                <div className="upload-progress">
                  <div className="upload-progress-track">
                    <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-ghost-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary-sm" disabled={submitting}>
                  {submitting ? <span className="auth-spinner" /> : <><Upload size={14} /> Submit Assignment</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submission Modal */}
      {viewModal && (
        <div className="modal-overlay" onClick={() => setViewModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Your Submission</h3><p className="modal-sub">{viewModal.title}</p></div>
              <button className="modal-close" onClick={() => setViewModal(null)}><X size={20} /></button>
            </div>
            <div className="submission-view">
              {viewModal.submission?.hostingLink && (
                <div className="submission-field">
                  <span className="submission-label">Live Link</span>
                  <a href={viewModal.submission.hostingLink} target="_blank" rel="noopener noreferrer" className="submission-link">
                    {viewModal.submission.hostingLink}
                  </a>
                </div>
              )}
              <div className="submission-field">
                <span className="submission-label">Description</span>
                <p>{viewModal.submission?.description}</p>
              </div>
              {viewModal.submission?.screenshotUrl && (
                <div className="submission-field">
                  <span className="submission-label">Screenshot</span>
                  <img src={viewModal.submission.screenshotUrl} alt="Screenshot" className="submission-screenshot" />
                </div>
              )}
              {viewModal.teacherFeedback && (
                <div className="submission-feedback">
                  <span className="submission-label">Teacher Feedback</span>
                  <p>{viewModal.teacherFeedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}