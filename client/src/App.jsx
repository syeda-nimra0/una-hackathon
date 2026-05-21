import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useEffect } from 'react'
import Lenis from 'lenis'

// Pages
import LandingPage from './pages/landing/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentCourses from './pages/student/StudentCourses'
import StudentAssignments from './pages/student/StudentAssignments'
import StudentProfile from './pages/student/StudentProfile'
import CourseDetail from './pages/student/CourseDetail'
import StudentPrograms from './pages/student/StudentPrograms'
import StudentHackathons from './pages/student/StudentHackathons'
import AIAssistant from './pages/student/AIAssistant'

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherCourses from './pages/teacher/TeacherCourses'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherAnalytics from './pages/teacher/TeacherAnalytics'
import TeacherQuizzes from './pages/teacher/TeacherQuizzes'

// Layout
import StudentLayout from './components/layout/StudentLayout'
import TeacherLayout from './components/layout/TeacherLayout'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen"><span>Loading...</span></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

const LenisInit = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LenisInit />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D1217',
              color: '#fff',
              border: '1px solid rgba(186,252,4,0.2)',
              fontFamily: 'Cabin, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#BAFC04', secondary: '#080C0F' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student routes */}
          <Route path="/student" element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="programs" element={<StudentPrograms />} />
            <Route path="hackathons" element={<StudentHackathons />} />
            <Route path="ai" element={<AIAssistant />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher routes */}
          <Route path="/teacher" element={
            <ProtectedRoute role="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }>
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="analytics" element={<TeacherAnalytics />} />
            <Route path="quizzes" element={<TeacherQuizzes />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
