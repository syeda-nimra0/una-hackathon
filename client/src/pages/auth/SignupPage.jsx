import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import './Auth.css'
import logo from '../auth/logo.png'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') || 'student'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: defaultRole }
  })

  const role = watch('role')

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await signup(data)
      toast.success(`Welcome to UNA, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'teacher' ? '/teacher' : '/student')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <div className="logo-mark"><img src={logo} alt="" /></div>
            <span>UNA</span>
          </Link>
          <div className="auth-brand-text">
            <h2>Join 48,000+<br />Learners Today.</h2>
            <p>Create your account and start learning, competing, or teaching within minutes.</p>
          </div>
          <div className="auth-features">
            {['Free Account — No Credit Card', 'Access 5 Free Courses Immediately', 'Join Open Hackathons', 'Earn Verified Certificates'].map(f => (
              <div key={f} className="auth-feature-item">
                <span className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Role Toggle */}
            <div className="form-field">
              <label>I am joining as</label>
              <div className="role-toggle">
                <label className={`role-option ${role === 'student' ? 'active' : ''}`}>
                  <input type="radio" value="student" {...register('role')} />
                  <span>Student</span>
                </label>
                <label className={`role-option ${role === 'teacher' ? 'active' : ''}`}>
                  <input type="radio" value="teacher" {...register('role')} />
                  <span>Teacher / Instructor</span>
                </label>
              </div>
            </div>

            <div className="form-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            {role === 'teacher' && (
              <div className="form-field">
                <label>Subject / Expertise</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Development, UI/UX Design"
                  {...register('subject')}
                />
              </div>
            )}

            <div className="form-field">
              <label>Password</label>
              <div className="input-with-icon">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  {...register('password', {
                    required: 'Password required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
                  className={errors.password ? 'error' : ''}
                />
                <button type="button" className="input-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
