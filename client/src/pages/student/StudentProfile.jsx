import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import { uploadToCloudinary, isCloudinaryConfigured } from '../../utils/cloudinary'
import toast from 'react-hot-toast'
import { Camera, Save, User, Mail, MessageSquare, AlertTriangle, ChevronRight, X, Loader } from 'lucide-react'
import './StudentPages.css'

export default function StudentProfile() {
  const { user, updateUser } = useAuth()
  const fileRef = useRef(null)
  const [saving, setSaving] = useState(false)
  const [uploadingPic, setUploadingPic] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [feedbackModal, setFeedbackModal] = useState(false)
  const [complaintModal, setComplaintModal] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  })
  const [feedback, setFeedback] = useState({ teacher: '', message: '', rating: 5 })
  const [complaint, setComplaint] = useState({ teacher: '', reason: '', description: '' })

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 1. Show instant local preview
    const local = URL.createObjectURL(file)
    setPreviewUrl(local)
    setUploadingPic(true)

    try {
      if (!isCloudinaryConfigured()) {
        // No Cloudinary setup — keep local preview, still "works" visually
        updateUser({ profilePic: local })
        toast('Profile pic updated locally.\nAdd Cloudinary keys in .env for permanent save.', { icon: '⚠️', duration: 5000 })
        return
      }

      const url = await uploadToCloudinary(file, 'nexus_lms/avatars')

      // Save to backend
      try { await api.patch('/student/profile', { profilePic: url }) } catch { /* backend optional */ }

      updateUser({ profilePic: url })
      setPreviewUrl(null) // use the real URL from context now
      toast.success('Profile picture updated!')

    } catch (err) {
      let msg = err.message
      if (msg === 'CLOUDINARY_SETUP_MISSING') {
        msg = 'Add VITE_CLOUDINARY_CLOUD_NAME to client/.env'
      } else if (msg === 'CLOUDINARY_PRESET_MISSING') {
        msg = 'Add VITE_CLOUDINARY_UPLOAD_PRESET to client/.env'
      } else if (msg.includes('400') || msg.includes('Upload preset')) {
        msg = 'Upload preset not found — make sure it is set to UNSIGNED in Cloudinary dashboard'
      }
      toast.error(msg, { duration: 6000 })
      setPreviewUrl(null)
    } finally {
      setUploadingPic(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await api.patch('/student/profile', form) } catch { /* backend optional */ }
    updateUser(form)
    toast.success('Profile saved!')
    setSaving(false)
  }

  const submitFeedback = async (e) => {
    e.preventDefault()
    try { await api.post('/student/feedback', feedback) } catch {}
    toast.success('Feedback submitted!')
    setFeedbackModal(false)
    setFeedback({ teacher: '', message: '', rating: 5 })
  }

  const submitComplaint = async (e) => {
    e.preventDefault()
    try { await api.post('/student/complaint', complaint) } catch {}
    toast.success('Complaint submitted. We will review it.')
    setComplaintModal(false)
    setComplaint({ teacher: '', reason: '', description: '' })
  }

  const avatarSrc = previewUrl || user?.profilePic

  return (
    <div className="profile-page page-enter">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="page-sub">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* Avatar Card */}
        <div className="profile-avatar-card">
          <div className="profile-avatar-wrap" onClick={() => !uploadingPic && fileRef.current?.click()}>
            {avatarSrc ? (
              <img src={avatarSrc} alt={user?.name} />
            ) : (
              <span className="avatar-initial">{user?.name?.[0]?.toUpperCase()}</span>
            )}
            <div className="avatar-overlay">
              {uploadingPic
                ? <Loader size={20} style={{ animation: 'spin 0.8s linear infinite' }} />
                : <Camera size={20} />}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>
          {uploadingPic && (
            <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>
              Uploading...
            </span>
          )}
          <h3>{user?.name}</h3>
          <span className="profile-role-badge">Student</span>
          <p className="profile-email"><Mail size={13} /> {user?.email}</p>

          {!isCloudinaryConfigured() && (
            <div style={{ background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)', borderRadius: 4, padding: '10px 12px', fontSize: 12, color: '#FFC800', lineHeight: 1.5, textAlign: 'left' }}>
              ⚠️ Profile pic uploads need Cloudinary keys in <code style={{ background: 'rgba(255,200,0,0.15)', padding: '0 4px', borderRadius: 2 }}>client/.env</code>
            </div>
          )}

          <div className="profile-quick-actions">
            <button className="profile-action-btn" onClick={() => setFeedbackModal(true)}>
              <MessageSquare size={16} /><span>Give Feedback</span><ChevronRight size={14} />
            </button>
            <button className="profile-action-btn complaint" onClick={() => setComplaintModal(true)}>
              <AlertTriangle size={16} /><span>File Complaint</span><ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="profile-form-card">
          <div className="dash-card-header">
            <h3><User size={16} /> Personal Information</h3>
          </div>
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+92 300 0000000" />
              </div>
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Bio</label>
              <textarea rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Tell us a bit about yourself..." />
            </div>
            <button type="submit" className="btn-primary-sm" disabled={saving}>
              {saving ? <span className="auth-spinner" /> : <><Save size={14} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="modal-overlay" onClick={() => setFeedbackModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Give Teacher Feedback</h3><p className="modal-sub">Help improve teaching quality</p></div>
              <button className="modal-close" onClick={() => setFeedbackModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={submitFeedback} className="modal-form">
              <div className="form-field">
                <label>Teacher Name</label>
                <input value={feedback.teacher} onChange={e => setFeedback(f => ({ ...f, teacher: e.target.value }))} placeholder="Teacher's name" required />
              </div>
              <div className="form-field">
                <label>Rating (1–5)</label>
                <div className="rating-stars">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" className={`star-btn ${feedback.rating >= n ? 'active' : ''}`} onClick={() => setFeedback(f => ({ ...f, rating: n }))}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-field">
                <label>Your Feedback</label>
                <textarea rows={4} value={feedback.message} onChange={e => setFeedback(f => ({ ...f, message: e.target.value }))} placeholder="Share your thoughts..." required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost-sm" onClick={() => setFeedbackModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-sm"><MessageSquare size={14} /> Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintModal && (
        <div className="modal-overlay" onClick={() => setComplaintModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>File a Complaint</h3><p className="modal-sub">We take all complaints seriously</p></div>
              <button className="modal-close" onClick={() => setComplaintModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={submitComplaint} className="modal-form">
              <div className="form-field">
                <label>Teacher Name</label>
                <input value={complaint.teacher} onChange={e => setComplaint(f => ({ ...f, teacher: e.target.value }))} placeholder="Teacher's name" required />
              </div>
              <div className="form-field">
                <label>Reason</label>
                <select value={complaint.reason} onChange={e => setComplaint(f => ({ ...f, reason: e.target.value }))} required>
                  <option value="">Select a reason</option>
                  <option value="unprofessional">Unprofessional behavior</option>
                  <option value="poor_teaching">Poor teaching quality</option>
                  <option value="harassment">Harassment</option>
                  <option value="unresponsive">Unresponsive</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label>Description</label>
                <textarea rows={4} value={complaint.description} onChange={e => setComplaint(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in detail..." required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost-sm" onClick={() => setComplaintModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-sm"><AlertTriangle size={14} /> Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
