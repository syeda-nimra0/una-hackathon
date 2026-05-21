// TeacherCourses.jsx
import { useState } from 'react'
import { Plus, Edit2, Trash2, Users, Eye, BookOpen, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import './TeacherPages.css'

const MOCK_COURSES = [
  { _id: 'c1', title: 'Full Stack React & Node.js', category: 'Development', price: 2999, students: 96, status: 'published', lessons: 9 },
  { _id: 'c2', title: 'Backend with Node', category: 'Development', price: 2499, students: 74, status: 'published', lessons: 7 },
  { _id: 'c3', title: 'React Mastery', category: 'Development', price: 1999, students: 58, status: 'published', lessons: 6 },
  { _id: 'c4', title: 'Frontend Mastery', category: 'Design', price: 1499, students: 34, status: 'draft', lessons: 4 },
  { _id: 'c5', title: 'MongoDB Basics', category: 'Development', price: 0, students: 22, status: 'published', lessons: 5 },
]

export default function TeacherCourses() {
  const [courses, setCourses] = useState(MOCK_COURSES)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Development', price: '', description: '' })
  const [saving, setSaving] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/teacher/courses', form)
    } catch {}
    const newCourse = { _id: Date.now().toString(), ...form, price: Number(form.price), students: 0, status: 'draft', lessons: 0 }
    setCourses(prev => [newCourse, ...prev])
    toast.success('Course created!')
    setModal(false)
    setForm({ title: '', category: 'Development', price: '', description: '' })
    setSaving(false)
  }

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(c => c._id !== id))
    toast.success('Course deleted')
  }

  return (
    <div className="teacher-page page-enter">
      <div className="teacher-page-header">
        <div><h1>Courses</h1><p className="page-sub">Create and manage your course catalog</p></div>
        <button className="teacher-action-btn primary" onClick={() => setModal(true)}><Plus size={14} /> New Course</button>
      </div>

      <div className="teacher-table-wrap">
        <div className="teacher-table-head">
          <span>Title</span><span>Category</span><span>Price</span><span>Students</span><span>Status</span><span>Actions</span>
        </div>
        {courses.map(c => (
          <div key={c._id} className="teacher-table-row">
            <div className="table-cell-main">
              <div className="table-icon"><BookOpen size={16} /></div>
              <div>
                <span className="table-title">{c.title}</span>
                <span className="table-sub">{c.lessons} lessons</span>
              </div>
            </div>
            <span className="table-tag">{c.category}</span>
            <span className="table-cell">{c.price === 0 ? <span className="price-free">FREE</span> : `PKR ${c.price.toLocaleString()}`}</span>
            <span className="table-cell"><Users size={12} style={{ display: 'inline', marginRight: 4 }} />{c.students}</span>
            <span className={`status-pill ${c.status}`}>{c.status}</span>
            <div className="table-actions">
              <button className="tbl-btn"><Edit2 size={14} /></button>
              <button className="tbl-btn danger" onClick={() => deleteCourse(c._id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Create New Course</h3></div>
              <button className="modal-close" onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-field"><label>Course Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Advanced React Patterns" required />
              </div>
              <div className="form-row">
                <div className="form-field"><label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option>Development</option><option>Design</option><option>Business</option>
                  </select>
                </div>
                <div className="form-field"><label>Price (PKR, 0 = free)</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" required />
                </div>
              </div>
              <div className="form-field"><label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will students learn?" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-ghost-sm" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary-sm" disabled={saving}><Save size={14} /> Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
