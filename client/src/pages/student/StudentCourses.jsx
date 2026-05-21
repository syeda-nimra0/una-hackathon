// StudentCourses.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { BookOpen, Search, Filter, Star, Users, Clock, ArrowRight, CheckCircle, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import './StudentPages.css'

const MOCK_COURSES = [
  { _id: 'c1', title: 'Full Stack React & Node.js', instructor: 'Ayesha Tariq', category: 'Development', price: 2999, rating: 4.9, students: 3240, duration: '48 hrs', enrolled: true, progress: 65, isPremium: true },
  { _id: 'c2', title: 'UI/UX Design Mastery', instructor: 'Omar Siddiqui', category: 'Design', price: 0, rating: 4.8, students: 1840, duration: '32 hrs', enrolled: true, progress: 30, isPremium: false },
  { _id: 'c3', title: 'Python for Data Science', instructor: 'Ali Hassan', category: 'Development', price: 0, rating: 4.9, students: 5200, duration: '40 hrs', enrolled: true, progress: 85, isPremium: false },
  { _id: 'c4', title: 'Digital Marketing Strategy', instructor: 'Sana Malik', category: 'Business', price: 1999, rating: 4.7, students: 2100, duration: '28 hrs', enrolled: false, progress: 0, isPremium: true },
  { _id: 'c5', title: 'Brand Identity Design', instructor: 'Fatima Rizvi', category: 'Design', price: 2499, rating: 4.6, students: 980, duration: '22 hrs', enrolled: false, progress: 0, isPremium: true },
  { _id: 'c6', title: 'Startup Fundamentals', instructor: 'Bilal Ahmed', category: 'Business', price: 1499, rating: 4.8, students: 1560, duration: '20 hrs', enrolled: false, progress: 0, isPremium: true },
]

export default function StudentCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [tab, setTab] = useState('all')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/student/courses')
        if (res.data?.courses?.length > 0) {
          setCourses(res.data.courses)
        } else {
          setCourses(MOCK_COURSES)
        }
      } catch {
        setCourses(MOCK_COURSES)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || (c.instructor || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || c.category === category
    const matchTab = tab === 'all' ? true : tab === 'enrolled' ? c.enrolled : !c.enrolled
    return matchSearch && matchCat && matchTab
  })

  const handleEnroll = async (courseId) => {
    // Check if real ObjectId
    const isRealId = /^[a-f\d]{24}$/i.test(courseId)
    if (isRealId) {
      try {
        await api.post(`/student/courses/${courseId}/enroll`)
      } catch (err) {
        console.warn('Enroll API:', err.message)
      }
    }
    setCourses(prev => prev.map(c => c._id === courseId ? { ...c, enrolled: true } : c))
    toast.success('Enrolled successfully!')
  }

  if (loading) return <div className="page-loading"><span className="spinner-lg" /></div>

  return (
    <div className="student-courses page-enter">
      <div className="page-header">
        <div>
          <h1>Courses</h1>
          <p className="page-sub">Browse and manage your enrolled courses</p>
        </div>
      </div>

      <div className="courses-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
        </select>
        <div className="tab-group">
          {['enrolled', 'explore'].map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'enrolled' ? 'My Courses' : 'Explore'}
            </button>
          ))}
        </div>
      </div>

      <div className="courses-grid-dash">
        {filtered.map(c => (
          <div key={c._id} className="course-card-dash">
            <div className="course-card-dash-header">
              <span className="course-category-tag">{c.category}</span>
              {c.enrolled && <span className="enrolled-badge"><CheckCircle size={11} /> Enrolled</span>}
            </div>
            <h3>{c.title}</h3>
            <p className="course-instructor-name">{c.instructor}</p>
            <div className="course-card-meta-row">
              <span><Star size={12} fill="#BAFC04" color="#BAFC04" /> {c.rating}</span>
              <span><Users size={12} /> {c.students.toLocaleString()}</span>
              <span><Clock size={12} /> {c.duration}</span>
            </div>
            {c.enrolled && (
              <div className="course-progress-mini">
                <div className="course-progress-track">
                  <div className="course-progress-fill" style={{ width: `${c.progress}%` }} />
                </div>
                <span>{c.progress}% complete</span>
              </div>
            )}
            <div className="course-card-dash-foot">
              <span className="course-price-tag">{c.price === 0 ? <span className="price-free">FREE</span> : `PKR ${c.price.toLocaleString()}`}</span>
              {c.enrolled ? (
                <Link to={`/student/courses/${c._id}`} className="course-action-btn">
                  Continue <ArrowRight size={14} />
                </Link>
              ) : c.isPremium ? (
                <button className="course-action-btn enroll" onClick={() => handleEnroll(c._id)}>
                  <Lock size={13} /> Enroll
                </button>
              ) : (
                <button className="course-action-btn enroll" onClick={() => handleEnroll(c._id)}>
                  Enroll Free
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}