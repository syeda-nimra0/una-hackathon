import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, BookOpen, FileText, Users,
  BarChart3, LogOut, Menu, X, Bell, ChevronRight,
  HelpCircle, Terminal, ClipboardList
} from 'lucide-react'
import './TeacherLayout.css'
import logo from '../layout/logo.png'

const NAV_ITEMS = [
  { to: '/teacher', icon: LayoutDashboard, label: 'Command Center', end: true },
  { to: '/teacher/courses', icon: BookOpen, label: 'Courses' },
  { to: '/teacher/assignments', icon: FileText, label: 'Assignments' },
  { to: '/teacher/quizzes', icon: ClipboardList, label: 'Quizzes' },
  { to: '/teacher/students', icon: Users, label: 'Students' },
  { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function TeacherLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="teacher-layout">
      <aside className={`teacher-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="teacher-sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-mark"><img src={logo} alt="" /></div>
            <span>UNA</span>
          </Link>
          <div className="teacher-badge">INSTRUCTOR</div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="teacher-sidebar-user">
          <div className="teacher-avatar">
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user.name} />
            ) : (
              <span>{user?.name?.[0]?.toUpperCase()}</span>
            )}
            <span className="teacher-status-dot" />
          </div>
          <div>
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="teacher-user-subject">{user?.subject || 'Full Stack Dev'}</span>
          </div>
        </div>

        <nav className="teacher-sidebar-nav">
          <span className="sidebar-nav-label">Operations</span>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              <ChevronRight size={14} className="sidebar-link-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <div className="teacher-main">
        <header className="teacher-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="teacher-topbar-label">
            <Terminal size={14} />
            <span>INSTRUCTOR COMMAND CENTER</span>
          </div>
          <div className="topbar-right">
            <button className="topbar-notif">
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <div className="topbar-user">
              <div className="teacher-topbar-avatar">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <span className="topbar-name">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        <main className="teacher-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
