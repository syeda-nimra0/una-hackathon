import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import {
  BookOpen, FileText, Trophy, Bell, ArrowRight,
  TrendingUp, Clock, CheckCircle, AlertCircle, Zap, Users
} from 'lucide-react'
import './StudentDashboard.css'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard')
        setData(res.data)
      } catch {
        // Use mock data for display
        setData({
          enrolledCount: 4,
          completedCount: 1,
          pendingAssignments: 3,
          upcomingQuizzes: [
            { _id: '1', title: 'React Hooks Deep Dive', course: 'Full Stack React', dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), points: 20 },
            { _id: '2', title: 'MongoDB Aggregation', course: 'Backend with Node', dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), points: 15 },
          ],
          recentAssignments: [
            { _id: 'a1', title: 'Build a REST API', course: 'Backend Dev', status: 'submitted', dueDate: new Date(Date.now() - 86400000).toISOString() },
            { _id: 'a2', title: 'UI Component Library', course: 'React Mastery', status: 'pending', dueDate: new Date(Date.now() + 86400000 * 3).toISOString() },
            { _id: 'a3', title: 'Database Schema Design', course: 'MongoDB', status: 'approved', dueDate: new Date(Date.now() - 86400000 * 3).toISOString() },
          ],
          enrolledCourses: [
            { _id: 'c1', title: 'Full Stack React & Node.js', progress: 65, instructor: 'Ayesha Tariq', category: 'Development' },
            { _id: 'c2', title: 'UI/UX Design Mastery', progress: 30, instructor: 'Omar Siddiqui', category: 'Design' },
            { _id: 'c3', title: 'Python for Data Science', progress: 85, instructor: 'Ali Hassan', category: 'Development' },
            { _id: 'c4', title: 'Digital Marketing', progress: 10, instructor: 'Sana Malik', category: 'Business' },
          ],
          joinedHackathons: [
            { _id: 'h1', title: 'National Web Dev Hackathon', status: 'active', deadline: new Date(Date.now() + 86400000 * 10).toISOString() }
          ]
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <div className="page-loading"><span className="spinner-lg" /></div>

  const firstName = user?.name?.split(' ')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const assignmentStatus = (s) => ({
    submitted: { label: 'Submitted', cls: 'status-submitted' },
    approved: { label: 'Approved', cls: 'status-approved' },
    not_approved: { label: 'Not Approved', cls: 'status-rejected' },
    pending: { label: 'Pending', cls: 'status-pending' },
  }[s] || { label: s, cls: '' })

  return (
    <div className="student-dashboard page-enter">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">{greeting},</p>
          <h1 className="dash-name">{firstName} <span className="wave">👋</span></h1>
          <p className="dash-sub">Here's what's happening with your learning today.</p>
        </div>
        <Link to="/student/courses" className="dash-browse-btn">
          <BookOpen size={16} /> Browse Courses <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="stat-icon stat-icon-blue"><BookOpen size={20} /></div>
          <div>
            <span className="stat-num">{data?.enrolledCount}</span>
            <span className="stat-label">Enrolled Courses</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon stat-icon-green"><CheckCircle size={20} /></div>
          <div>
            <span className="stat-num">{data?.completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon stat-icon-yellow"><FileText size={20} /></div>
          <div>
            <span className="stat-num">{data?.pendingAssignments}</span>
            <span className="stat-label">Due Assignments</span>
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="stat-icon stat-icon-orange"><Trophy size={20} /></div>
          <div>
            <span className="stat-num">{data?.joinedHackathons?.length}</span>
            <span className="stat-label">Active Programs</span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid">
        {/* In-progress courses */}
        <div className="dash-card dash-card-wide">
          <div className="dash-card-header">
            <h3><TrendingUp size={16} /> In Progress</h3>
            <Link to="/student/courses" className="dash-see-all">See All <ArrowRight size={14} /></Link>
          </div>
          <div className="course-progress-list">
            {data?.enrolledCourses?.map(c => (
              <div key={c._id} className="course-progress-item">
                <div className="course-progress-info">
                  <div className="course-progress-cat">{c.category}</div>
                  <div className="course-progress-title">{c.title}</div>
                  <div className="course-progress-instructor">{c.instructor}</div>
                </div>
                <div className="course-progress-bar-wrap">
                  <div className="course-progress-meta">
                    <span>{c.progress}%</span>
                    <span>{c.progress === 100 ? 'Completed' : 'In Progress'}</span>
                  </div>
                  <div className="course-progress-track">
                    <div className="course-progress-fill" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3><Zap size={16} /> Upcoming Quizzes</h3>
            <span className="dash-card-count">{data?.upcomingQuizzes?.length}</span>
          </div>
          {data?.upcomingQuizzes?.length === 0 ? (
            <div className="dash-empty">No upcoming quizzes</div>
          ) : (
            <div className="quiz-list">
              {data?.upcomingQuizzes?.map(q => {
                const due = new Date(q.dueDate)
                const daysLeft = Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={q._id} className="quiz-item">
                    <div className="quiz-item-info">
                      <span className="quiz-item-title">{q.title}</span>
                      <span className="quiz-item-course">{q.course}</span>
                    </div>
                    <div className="quiz-item-right">
                      <span className={`quiz-due ${daysLeft <= 2 ? 'urgent' : ''}`}>
                        <Clock size={11} /> {daysLeft}d left
                      </span>
                      <span className="quiz-points">{q.points} pts</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3><FileText size={16} /> Recent Assignments</h3>
            <Link to="/student/assignments" className="dash-see-all">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="assignment-list">
            {data?.recentAssignments?.map(a => {
              const { label, cls } = assignmentStatus(a.status)
              return (
                <div key={a._id} className="assignment-item">
                  <div className="assignment-item-info">
                    <span className="assignment-item-title">{a.title}</span>
                    <span className="assignment-item-course">{a.course}</span>
                  </div>
                  <span className={`assignment-status-badge ${cls}`}>{label}</span>
                </div>
              )
            })}
          </div>
          <Link to="/student/assignments" className="dash-card-cta">
            <FileText size={14} /> Submit Assignment
          </Link>
        </div>

        {/* Active Hackathon */}
        {data?.joinedHackathons?.length > 0 && (
          <div className="dash-card dash-hackathon-card">
            <div className="dash-card-header">
              <h3><Trophy size={16} /> Active Hackathon</h3>
            </div>
            {data.joinedHackathons.map(h => {
              const daysLeft = Math.ceil((new Date(h.deadline) - Date.now()) / (1000 * 60 * 60 * 24))
              return (
                <div key={h._id} className="hackathon-banner">
                  <div className="hackathon-banner-bg" />
                  <div className="hackathon-banner-content">
                    <span className="hackathon-live-tag">LIVE</span>
                    <h4>{h.title}</h4>
                    <p className="hackathon-deadline"><Clock size={12} /> {daysLeft} days remaining</p>
                    <Link to="/student/hackathons" className="hackathon-btn">
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
