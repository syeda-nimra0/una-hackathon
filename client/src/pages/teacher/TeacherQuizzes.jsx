import { useState } from 'react'
import { Plus, Trash2, ClipboardList, Clock, Users, X, Save, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import './TeacherPages.css'

const MOCK_QUIZZES = [
  { _id: 'q1', title: 'React Hooks Deep Dive', course: 'Full Stack React', questionCount: 10, scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), duration: 30, students: 96, status: 'scheduled' },
  { _id: 'q2', title: 'Express Middleware', course: 'Backend with Node', questionCount: 8, scheduledAt: new Date(Date.now() + 86400000 * 4).toISOString(), duration: 20, students: 74, status: 'scheduled' },
  { _id: 'q3', title: 'MongoDB Aggregation', course: 'Backend with Node', questionCount: 12, scheduledAt: new Date(Date.now() - 86400000 * 2).toISOString(), duration: 40, students: 74, status: 'completed', avgScore: 72 },
  { _id: 'q4', title: 'CSS Grid & Flexbox', course: 'Frontend Mastery', questionCount: 6, scheduledAt: new Date(Date.now() - 86400000 * 5).toISOString(), duration: 15, students: 34, status: 'completed', avgScore: 84 },
]

const EMPTY_Q = { text: '', optA: '', optB: '', optC: '', optD: '', answer: 'A' }

export default function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState(MOCK_QUIZZES)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', course: '', scheduledAt: '', duration: 20 })
  const [questions, setQuestions] = useState([])
  const [newQ, setNewQ] = useState(EMPTY_Q)

  const addQuestion = () => {
    if (!newQ.text.trim()) return toast.error('Question text is required')
    if (!newQ.optA.trim() || !newQ.optB.trim()) return toast.error('At least options A and B are required')
    setQuestions(prev => [...prev, { ...newQ }])
    setNewQ(EMPTY_Q)
    toast.success('Question added')
  }

  const removeQuestion = (idx) => setQuestions(prev => prev.filter((_, i) => i !== idx))

  const createQuiz = async (e) => {
    e.preventDefault()
    if (questions.length === 0) return toast.error('Add at least one question first')
    setSaving(true)
    try {
      const { default: api } = await import('../../utils/api')
      await api.post('/teacher/quizzes', { ...form, questions })
    } catch { /* backend optional in dev */ }

    setQuizzes(prev => [{
      _id: Date.now().toString(),
      title: form.title,
      course: form.course,
      scheduledAt: form.scheduledAt,
      duration: Number(form.duration),
      questionCount: questions.length,
      students: 0,
      status: 'scheduled',
    }, ...prev])

    toast.success('Quiz scheduled!')
    closeModal()
    setSaving(false)
  }

  const deleteQuiz = (id) => {
    setQuizzes(prev => prev.filter(q => q._id !== id))
    toast.success('Quiz deleted')
  }

  const daysLeft = (iso) => {
    const d = Math.ceil((new Date(iso) - Date.now()) / 86400000)
    if (d > 0) return `In ${d}d`
    if (d === 0) return 'Today'
    return 'Past'
  }

  const closeModal = () => {
    setModal(false)
    setForm({ title: '', course: '', scheduledAt: '', duration: 20 })
    setQuestions([])
    setNewQ(EMPTY_Q)
  }

  return (
    <div className="teacher-page page-enter">
      <div className="teacher-page-header">
        <div><h1>Quizzes</h1><p className="page-sub">Schedule and manage student quizzes</p></div>
        <button className="teacher-action-btn primary" onClick={() => setModal(true)}><Plus size={14} /> Create Quiz</button>
      </div>

      <div className="teacher-table-wrap">
        <div className="teacher-table-head" style={{ gridTemplateColumns: '2fr 1.5fr 80px 80px 110px 110px 60px' }}>
          <span>Quiz</span><span>Course</span><span>Questions</span><span>Duration</span><span>Scheduled</span><span>Status</span><span></span>
        </div>

        {quizzes.map(q => (
          <div key={q._id} className="teacher-table-row" style={{ gridTemplateColumns: '2fr 1.5fr 80px 80px 110px 110px 60px' }}>
            <div className="table-cell-main">
              <div className="table-icon" style={{ background: 'rgba(255,200,0,0.1)', color: '#FFC800' }}><ClipboardList size={16} /></div>
              <div>
                <span className="table-title">{q.title}</span>
                <span className="table-sub"><Users size={10} style={{ display: 'inline', marginRight: 3 }} />{q.students} students</span>
              </div>
            </div>
            <span className="table-tag">{q.course}</span>
            <span className="table-cell">{q.questionCount} Qs</span>
            <span className="table-cell"><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{q.duration}m</span>
            <span className="table-cell" style={{ fontFamily: 'var(--font-display)', fontSize: 12 }}>
              {q.status === 'completed'
                ? new Date(q.scheduledAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
                : daysLeft(q.scheduledAt)}
            </span>
            <span className={`status-pill ${q.status}`}>
              {q.status === 'completed' ? `${q.avgScore}% avg` : q.status}
            </span>
            <button className="tbl-btn danger" onClick={() => deleteQuiz(q._id)}><Trash2 size={14} /></button>
          </div>
        ))}

        {quizzes.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: 13 }}>
            No quizzes yet
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 660 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Create Quiz</h3><p className="modal-sub">Build questions and schedule</p></div>
              <button className="modal-close" onClick={closeModal}><X size={20} /></button>
            </div>

            <form onSubmit={createQuiz} className="modal-form">
              <div className="form-row">
                <div className="form-field">
                  <label>Quiz Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. React Hooks Assessment" required />
                </div>
                <div className="form-field">
                  <label>Course</label>
                  <input value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} placeholder="Course name" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Scheduled Date & Time</label>
                  <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} required />
                </div>
                <div className="form-field">
                  <label>Duration (minutes)</label>
                  <input type="number" min="5" max="180" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} required />
                </div>
              </div>

              {/* Question Builder */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)' }}>
                    Questions
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--text-muted)' }}>{questions.length} added</span>
                </div>

                {questions.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                    {questions.map((q, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                        <CheckCircle size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{q.text}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--green)', fontWeight: 700, marginRight: 6 }}>Ans: {q.answer}</span>
                        <button type="button" onClick={() => removeQuestion(i)} style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ background: 'var(--black)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-field">
                    <label>Question</label>
                    <input value={newQ.text} onChange={e => setNewQ(q => ({ ...q, text: e.target.value }))} placeholder="Type your question..." />
                  </div>
                  <div className="form-row">
                    <div className="form-field"><label>Option A</label><input value={newQ.optA} onChange={e => setNewQ(q => ({ ...q, optA: e.target.value }))} placeholder="Option A" /></div>
                    <div className="form-field"><label>Option B</label><input value={newQ.optB} onChange={e => setNewQ(q => ({ ...q, optB: e.target.value }))} placeholder="Option B" /></div>
                    <div className="form-field"><label>Option C</label><input value={newQ.optC} onChange={e => setNewQ(q => ({ ...q, optC: e.target.value }))} placeholder="Option C (optional)" /></div>
                    <div className="form-field"><label>Option D</label><input value={newQ.optD} onChange={e => setNewQ(q => ({ ...q, optD: e.target.value }))} placeholder="Option D (optional)" /></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                    <div className="form-field" style={{ width: 140 }}>
                      <label>Correct Answer</label>
                      <select value={newQ.answer} onChange={e => setNewQ(q => ({ ...q, answer: e.target.value }))}>
                        <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                      </select>
                    </div>
                    <button type="button" className="btn-primary-sm" onClick={addQuestion}>
                      <Plus size={13} /> Add Question
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-ghost-sm" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary-sm" disabled={saving}>
                  {saving ? <span style={{ width: 14, height: 14, border: '2px solid rgba(8,12,15,0.3)', borderTopColor: 'var(--black)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> : <><Save size={13} /> Schedule Quiz</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
