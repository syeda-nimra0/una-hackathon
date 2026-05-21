// TeacherAnalytics.jsx
import { BarChart3, TrendingUp, Users, BookOpen, DollarSign, Award } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './TeacherPages.css'

const ENROLLMENT_DATA = [
  { month: 'Aug', enrollments: 18 }, { month: 'Sep', enrollments: 32 },
  { month: 'Oct', enrollments: 45 }, { month: 'Nov', enrollments: 38 },
  { month: 'Dec', enrollments: 56 }, { month: 'Jan', enrollments: 72 },
]

const REVENUE_DATA = [
  { month: 'Aug', revenue: 24000 }, { month: 'Sep', revenue: 42000 },
  { month: 'Oct', revenue: 58000 }, { month: 'Nov', revenue: 49000 },
  { month: 'Dec', revenue: 74000 }, { month: 'Jan', revenue: 96000 },
]

const COMPLETION_DATA = [
  { name: 'Full Stack React', rate: 68 },
  { name: 'Backend Dev', rate: 81 },
  { name: 'React Mastery', rate: 55 },
  { name: 'Frontend Mastery', rate: 72 },
  { name: 'MongoDB Basics', rate: 90 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#0A0F14', border: '1px solid rgba(186,252,4,0.2)', padding: '10px 14px', borderRadius: 2, fontFamily: 'var(--font-display)', fontSize: 12 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--green)', fontWeight: 700 }}>{payload[0].value}{payload[0].name === 'revenue' ? ' PKR' : ''}</p>
      </div>
    )
  }
  return null
}

export default function TeacherAnalytics() {
  return (
    <div className="teacher-page page-enter">
      <div className="teacher-page-header">
        <div><h1>Analytics</h1><p className="page-sub">Track your teaching performance and growth</p></div>
      </div>

      <div className="teacher-kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Total Revenue', value: 'PKR 128K', icon: DollarSign, color: '#FF8C00' },
          { label: 'Total Students', value: '284', icon: Users, color: '#64A0FF' },
          { label: 'Courses Published', value: '5', icon: BookOpen, color: 'var(--green)' },
          { label: 'Avg Rating', value: '4.8 ★', icon: Award, color: 'var(--green)' },
        ].map(k => (
          <div key={k.label} className="teacher-kpi-card">
            <div className="kpi-top"><span className="kpi-label">{k.label}</span><k.icon size={16} style={{ color: k.color }} /></div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {/* Enrollment Chart */}
        <div className="teacher-panel">
          <div className="teacher-panel-header"><span className="panel-label">Monthly Enrollments</span></div>
          <div className="teacher-panel-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ENROLLMENT_DATA} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#5F6265', fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5F6265', fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enrollments" fill="#BAFC04" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="teacher-panel">
          <div className="teacher-panel-header"><span className="panel-label">Monthly Revenue (PKR)</span></div>
          <div className="teacher-panel-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#5F6265', fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#5F6265', fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#BAFC04" strokeWidth={2} dot={{ fill: '#BAFC04', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rates */}
        <div className="teacher-panel teacher-panel-wide" style={{ gridColumn: '1 / -1' }}>
          <div className="teacher-panel-header"><span className="panel-label">Course Completion Rates</span></div>
          <div className="teacher-panel-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {COMPLETION_DATA.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, minWidth: 180, color: 'rgba(255,255,255,0.8)' }}>{c.name}</span>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.rate}%`, background: c.rate >= 70 ? 'var(--green)' : '#FFC800', borderRadius: 2, transition: 'width 1s ease' }} />
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--green)', minWidth: 44, textAlign: 'right' }}>{c.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

