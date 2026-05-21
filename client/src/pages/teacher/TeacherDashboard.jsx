import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { gsap } from 'gsap'
import {
  Users, BookOpen, FileText, TrendingUp, CheckCircle, XCircle,
  Clock, Zap, BarChart3, ArrowRight, Activity, Eye, Bell,
  Award, AlertCircle, ChevronRight, ClipboardList
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './TeacherDashboard.css'

const MOCK_DATA = {
  stats: {
    totalStudents: 284,
    activeCourses: 5,
    pendingReview: 12,
    avgCompletionRate: 74,
    totalRevenue: 128400,
    newEnrollmentsToday: 7,
  },
  pendingAssignments: [
    { _id: 'a1', student: 'Amna Khalid', assignment: 'REST API Build', course: 'Full Stack React', submittedAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { _id: 'a2', student: 'Hassan Raza', assignment: 'UI Component Library', course: 'React Mastery', submittedAt: new Date(Date.now() - 3600000 * 5).toISOString() },
    { _id: 'a3', student: 'Zara Niazi', assignment: 'MongoDB Schema Design', course: 'Backend Dev', submittedAt: new Date(Date.now() - 3600000 * 8).toISOString() },
    { _id: 'a4', student: 'Faisal Mahmood', assignment: 'CSS Grid Challenge', course: 'Frontend Mastery', submittedAt: new Date(Date.now() - 3600000 * 12).toISOString() },
    { _id: 'a5', student: 'Sana Mirza', assignment: 'React Router Setup', course: 'Full Stack React', submittedAt: new Date(Date.now() - 3600000 * 20).toISOString() },
  ],
  recentActivity: [
    { id: 1, type: 'enroll', msg: 'Amna Khalid enrolled in Full Stack React', time: '2m ago' },
    { id: 2, type: 'submit', msg: 'Hassan Raza submitted Assignment #4', time: '15m ago' },
    { id: 3, type: 'quiz', msg: 'Quiz "Hooks Deep Dive" completed by 14 students', time: '1h ago' },
    { id: 4, type: 'review', msg: 'Zara Niazi assignment approved', time: '2h ago' },
    { id: 5, type: 'enroll', msg: 'Faisal Mahmood enrolled in Backend Dev', time: '3h ago' },
    { id: 6, type: 'feedback', msg: 'New feedback received from Ali Hassan', time: '5h ago' },
  ],
  courseProgress: [
    { name: 'Full Stack React', students: 96, completion: 68, revenue: 48000 },
    { name: 'Backend with Node', students: 74, completion: 81, revenue: 37000 },
    { name: 'React Mastery', students: 58, completion: 55, revenue: 29000 },
    { name: 'Frontend Mastery', students: 34, completion: 72, revenue: 17000 },
    { name: 'MongoDB Basics', students: 22, completion: 90, revenue: 0 },
  ],
  // Heatmap: 7 days x 24 hours grid (showing activity intensity)
  heatmapData: Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 12 }, (_, slot) => ({
      day, slot,
      value: Math.floor(Math.random() * 100),
    }))
  ),
  upcomingQuizzes: [
    { _id: 'q1', title: 'React Hooks Deep Dive', course: 'Full Stack React', scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(), students: 96 },
    { _id: 'q2', title: 'Express Middleware', course: 'Backend with Node', scheduledAt: new Date(Date.now() + 86400000 * 4).toISOString(), students: 74 },
  ]
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SLOTS = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '9pm', '10pm', '11pm', '12am']

const activityIcon = (type) => {
  const map = { enroll: Users, submit: FileText, quiz: ClipboardList, review: CheckCircle, feedback: Bell }
  const Icon = map[type] || Activity
  return <Icon size={13} />
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [data] = useState(MOCK_DATA)
  const [assignments, setAssignments] = useState(MOCK_DATA.pendingAssignments)
  const tickerRef = useRef(null)

  useEffect(() => {
    gsap.to(tickerRef.current, { x: '-50%', duration: 20, ease: 'none', repeat: -1 })
  }, [])

  const approve = (id) => setAssignments(prev => prev.filter(a => a._id !== id))
  const reject = (id) => setAssignments(prev => prev.filter(a => a._id !== id))

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso)
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return h > 0 ? `${h}h ago` : `${m}m ago`
  }

  const heatColor = (v) => {
    if (v === 0) return 'rgba(255,255,255,0.03)'
    if (v < 25) return 'rgba(186,252,4,0.12)'
    if (v < 50) return 'rgba(186,252,4,0.28)'
    if (v < 75) return 'rgba(186,252,4,0.5)'
    return 'rgba(186,252,4,0.85)'
  }

  return (
    <div className="teacher-dashboard page-enter">

      {/* Live ticker strip */}
      <div className="teacher-ticker">
        <span className="ticker-label">LIVE</span>
        <div className="teacher-ticker-scroll">
          <div ref={tickerRef} className="teacher-ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="teacher-ticker-content">
                {data.recentActivity.map(a => (
                  <span key={a.id} className="teacher-ticker-item">
                    <span className="ticker-sep">◆</span> {a.msg} <span className="ticker-time">{a.time}</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="teacher-dash-header">
        <div>
          <div className="teacher-dash-label">COMMAND CENTER</div>
          <h1>{user?.name?.split(' ')[0]}'s Overview</h1>
          <p className="page-sub">{new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="teacher-dash-actions">
          <Link to="/teacher/courses" className="teacher-action-btn primary">
            <BookOpen size={14} /> New Course
          </Link>
          <Link to="/teacher/quizzes" className="teacher-action-btn outline">
            <ClipboardList size={14} /> Schedule Quiz
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="teacher-kpi-row">
        {[
          { label: 'Total Students', value: data.stats.totalStudents, icon: Users, delta: `+${data.stats.newEnrollmentsToday} today`, color: '#64A0FF' },
          { label: 'Active Courses', value: data.stats.activeCourses, icon: BookOpen, delta: 'All live', color: 'var(--green)' },
          { label: 'Pending Review', value: data.stats.pendingReview, icon: FileText, delta: 'Assignments', color: '#FFC800' },
          { label: 'Avg Completion', value: `${data.stats.avgCompletionRate}%`, icon: TrendingUp, delta: '+4% this month', color: 'var(--green)' },
          { label: 'Revenue (PKR)', value: `${(data.stats.totalRevenue / 1000).toFixed(0)}K`, icon: BarChart3, delta: 'This month', color: '#FF8C00' },
        ].map(k => (
          <div key={k.label} className="teacher-kpi-card">
            <div className="kpi-top">
              <span className="kpi-label">{k.label}</span>
              <div className="kpi-icon" style={{ color: k.color }}><k.icon size={16} /></div>
            </div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="kpi-delta">{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Main 3-col grid */}
      <div className="teacher-main-grid">

        {/* COL 1-2: Assignment Review (Swipe/Approve) */}
        <div className="teacher-panel teacher-panel-wide">
          <div className="teacher-panel-header">
            <span className="panel-label">ASSIGNMENT REVIEW</span>
            <span className="panel-count">{assignments.length} pending</span>
            <Link to="/teacher/assignments" className="panel-view-all">View All <ChevronRight size={13} /></Link>
          </div>
          <div className="teacher-panel-body">
            {assignments.length === 0 ? (
              <div className="panel-empty"><CheckCircle size={32} /><span>All assignments reviewed</span></div>
            ) : (
              <div className="assignment-review-list">
                {assignments.map(a => (
                  <div key={a._id} className="review-row">
                    <div className="review-student-avatar">{a.student[0]}</div>
                    <div className="review-info">
                      <span className="review-assignment">{a.assignment}</span>
                      <span className="review-meta">{a.student} · {a.course} · {timeAgo(a.submittedAt)}</span>
                    </div>
                    <div className="review-actions">
                      <button className="review-btn reject" onClick={() => reject(a._id)} title="Reject">
                        <XCircle size={16} />
                      </button>
                      <button className="review-btn approve" onClick={() => approve(a._id)} title="Approve">
                        <CheckCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COL 3: Activity Feed */}
        <div className="teacher-panel">
          <div className="teacher-panel-header">
            <span className="panel-label">ACTIVITY FEED</span>
            <Activity size={14} className="panel-icon-accent" />
          </div>
          <div className="teacher-panel-body">
            <div className="activity-feed">
              {data.recentActivity.map(a => (
                <div key={a.id} className="activity-item">
                  <div className={`activity-icon-wrap activity-${a.type}`}>{activityIcon(a.type)}</div>
                  <div className="activity-content">
                    <span className="activity-msg">{a.msg}</span>
                    <span className="activity-time">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COL 1-2: Course Performance */}
        <div className="teacher-panel teacher-panel-wide">
          <div className="teacher-panel-header">
            <span className="panel-label">COURSE PERFORMANCE</span>
            <Link to="/teacher/analytics" className="panel-view-all">Analytics <ChevronRight size={13} /></Link>
          </div>
          <div className="teacher-panel-body">
            <div className="course-perf-table">
              <div className="course-perf-head">
                <span>Course</span>
                <span>Students</span>
                <span>Completion</span>
                <span>Revenue</span>
              </div>
              {data.courseProgress.map(c => (
                <div key={c.name} className="course-perf-row">
                  <span className="course-perf-name">{c.name}</span>
                  <span className="course-perf-students">{c.students}</span>
                  <div className="course-perf-bar-wrap">
                    <div className="course-perf-bar">
                      <div className="course-perf-fill" style={{ width: `${c.completion}%` }} />
                    </div>
                    <span>{c.completion}%</span>
                  </div>
                  <span className="course-perf-revenue">
                    {c.revenue > 0 ? `PKR ${(c.revenue / 1000).toFixed(0)}K` : <span style={{ color: 'var(--text-muted)' }}>Free</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COL 3: Upcoming Quizzes */}
        <div className="teacher-panel">
          <div className="teacher-panel-header">
            <span className="panel-label">SCHEDULED QUIZZES</span>
            <Link to="/teacher/quizzes" className="panel-view-all">Manage <ChevronRight size={13} /></Link>
          </div>
          <div className="teacher-panel-body">
            {data.upcomingQuizzes.map(q => {
              const daysLeft = Math.ceil((new Date(q.scheduledAt) - Date.now()) / 86400000)
              return (
                <div key={q._id} className="quiz-panel-item">
                  <div className="quiz-panel-dot" />
                  <div className="quiz-panel-info">
                    <span className="quiz-panel-title">{q.title}</span>
                    <span className="quiz-panel-meta">{q.course} · {q.students} students</span>
                  </div>
                  <div className="quiz-panel-due">
                    <Clock size={11} />
                    <span className={daysLeft <= 2 ? 'urgent' : ''}>{daysLeft}d</span>
                  </div>
                </div>
              )
            })}
            <Link to="/teacher/quizzes" className="panel-add-btn">
              <Zap size={13} /> Schedule New Quiz
            </Link>
          </div>
        </div>

        {/* Student Heatmap — full width */}
        <div className="teacher-panel teacher-panel-full">
          <div className="teacher-panel-header">
            <span className="panel-label">STUDENT ACTIVITY HEATMAP</span>
            <span className="panel-subtitle">When are your students most active?</span>
          </div>
          <div className="teacher-panel-body">
            <div className="heatmap-wrap">
              <div className="heatmap-days">
                {DAYS.map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="heatmap-grid">
                {data.heatmapData.map((row, di) => (
                  <div key={di} className="heatmap-row">
                    {row.map((cell, si) => (
                      <div
                        key={si}
                        className="heatmap-cell"
                        style={{ background: heatColor(cell.value) }}
                        title={`${DAYS[di]} ${SLOTS[si]}: ${cell.value} active`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="heatmap-slots">
                {SLOTS.map(s => <span key={s}>{s}</span>)}
              </div>
              <div className="heatmap-legend">
                <span>Less</span>
                {[0, 20, 40, 60, 80, 100].map(v => (
                  <div key={v} className="legend-cell" style={{ background: heatColor(v) }} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
