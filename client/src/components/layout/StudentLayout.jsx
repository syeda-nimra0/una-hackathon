import { useState } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, BookOpen, FileText, Trophy, Users,
  User, LogOut, Menu, X, Bell, ChevronRight, Zap
} from 'lucide-react'
import './StudentLayout.css'
import logo from '../layout/logo.png'

const NAV_ITEMS = [
  { to: '/student', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/student/courses', icon: BookOpen, label: 'My Courses' },
  { to: '/student/assignments', icon: FileText, label: 'Assignments' },
  { to: '/student/programs', icon: Users, label: 'Programs' },
  { to: '/student/hackathons', icon: Trophy, label: 'Hackathons' },
  { to: '/student/ai', icon: Zap, label: 'AI Assistant' },
  { to: '/student/profile', icon: User, label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="logo-mark"><img src={logo} alt="" /></div>
            <span>UNA</span>
          </Link>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user.name} />
            ) : (
              <span>{user?.name?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name}</span>
            <span className="sidebar-user-role">Student</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-nav-label">Navigation</span>
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

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar-right">
            <button className="topbar-notif">
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <div className="topbar-user">
              <div className="topbar-avatar">
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

        {/* Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
