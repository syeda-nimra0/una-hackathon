import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Play, CheckCircle, Lock, Clock, BookOpen, ArrowLeft } from 'lucide-react'
import './StudentPages.css'

const MOCK_COURSE = {
  _id: 'c1',
  title: 'Full Stack React & Node.js',
  instructor: 'Ayesha Tariq',
  category: 'Development',
  progress: 65,
  description: 'Master full-stack development with React on the frontend and Node.js/Express on the backend. Build real production apps with authentication, APIs, and database integration.',
  lessons: [
    { _id: 'l1', title: 'Project Setup & Tooling', duration: '18 min', completed: true },
    { _id: 'l2', title: 'React Component Architecture', duration: '32 min', completed: true },
    { _id: 'l3', title: 'State Management with Zustand', duration: '28 min', completed: true },
    { _id: 'l4', title: 'React Router v6 Deep Dive', duration: '25 min', completed: true },
    { _id: 'l5', title: 'Building the REST API with Express', duration: '40 min', completed: false },
    { _id: 'l6', title: 'MongoDB & Mongoose ODM', duration: '35 min', completed: false },
    { _id: 'l7', title: 'JWT Authentication Flow', duration: '30 min', completed: false },
    { _id: 'l8', title: 'File Uploads with Cloudinary', duration: '22 min', completed: false },
    { _id: 'l9', title: 'Deployment on Vercel & Railway', duration: '20 min', completed: false },
  ]
}

export default function CourseDetail() {
  const { id } = useParams()
  const [activeLesson, setActiveLesson] = useState(MOCK_COURSE.lessons.find(l => !l.completed) || MOCK_COURSE.lessons[0])
  const course = MOCK_COURSE

  const completedCount = course.lessons.filter(l => l.completed).length

  return (
    <div className="course-detail-page page-enter">
      <div className="course-detail-header">
        <div className="course-detail-breadcrumb">
          <Link to="/student/courses"><ArrowLeft size={14} /> Courses</Link>
          <ChevronRight size={12} />
          <span>{course.title}</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>{course.title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>{course.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-muted)' }}>
            <BookOpen size={13} style={{ display: 'inline', marginRight: 5 }} />
            {completedCount}/{course.lessons.length} lessons
          </span>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${course.progress}%`, background: 'var(--green)', borderRadius: 2 }} />
            </div>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>{course.progress}%</span>
        </div>
      </div>

      <div className="course-detail-grid">
        <div className="course-detail-main">
          <div style={{ aspectRatio: '16/9', background: '#0A0F14', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Play size={48} style={{ marginBottom: 12, color: 'var(--green)' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{activeLesson.title}</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>{activeLesson.duration}</p>
            </div>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>{activeLesson.title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
            In this lesson you will learn key concepts and apply them through hands-on exercises. 
            Follow along with the video and complete the practice tasks before moving to the next lesson.
          </p>
        </div>

        <div className="course-detail-sidebar">
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, letterSpacing: 0.04, marginBottom: 4 }}>
            Course Content
          </h4>
          <div className="course-lesson-list">
            {course.lessons.map((l, i) => (
              <div
                key={l._id}
                className={`course-lesson-item ${l.completed ? 'completed' : ''} ${activeLesson._id === l._id ? 'active-lesson' : ''}`}
                onClick={() => setActiveLesson(l)}
                style={activeLesson._id === l._id ? { borderColor: 'var(--border-green)', background: 'var(--green-dim)' } : {}}
              >
                <span className="lesson-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-duration">
                  {l.completed
                    ? <CheckCircle size={13} style={{ color: 'var(--green)' }} />
                    : <><Clock size={11} style={{ marginRight: 3 }} />{l.duration}</>
                  }
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
