import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Lock, Shield, ArrowLeft } from 'lucide-react'
import { authService } from '../services/authService'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    resetCode: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState('reset') // 'reset' or 'success'
  
  const navigate = useNavigate()
  const location = useLocation()

  // Get email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }))
    }
  }, [location.state])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (formData.resetCode.length !== 6) {
      setError('Reset code must be 6 digits')
      setLoading(false)
      return
    }

    try {
      const response = await authService.resetPassword(
        formData.email,
        formData.resetCode,
        formData.newPassword,
        formData.confirmPassword
      )
      setMessage(response.message)
      setStep('success')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatResetCode = (value) => {
    // Remove non-digits and limit to 6 characters
    const digits = value.replace(/\D/g, '').slice(0, 6)
    // Add spaces for better readability
    return digits.replace(/(\d{3})(\d{1,3})/, '$1 $2').trim()
  }

  const handleResetCodeChange = (e) => {
    const formatted = formatResetCode(e.target.value)
    const digitsOnly = formatted.replace(/\s/g, '')
    setFormData(prev => ({ ...prev, resetCode: digitsOnly }))
    setError('')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Glass morphism container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Glass Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                {step === 'reset' ? (
                  <Shield className="h-8 w-8 text-white" />
                ) : (
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {step === 'reset' ? 'Reset Password' : 'Password Reset!'}
              </h2>
              <p className="text-white/70 text-lg font-medium">
                {step === 'reset' 
                  ? 'Enter the code sent to your email'
                  : 'Your password has been successfully reset'
                }
              </p>
            </div>

            {step === 'reset' ? (
              // Reset Form Step
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 backdrop-blur border border-red-300/30 text-red-100 px-4 py-3 rounded-xl text-sm font-medium">
                    ⚠️ {error}
                  </div>
                )}

                <div className="space-y-5">
                  {!location.state?.email && (
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="resetCode" className="block text-sm font-semibold text-white/90 mb-2">
                      6-Digit Reset Code
                    </label>
                    <div className="relative">
                      <input
                        id="resetCode"
                        name="resetCode"
                        type="text"
                        required
                        value={formatResetCode(formData.resetCode)}
                        onChange={handleResetCodeChange}
                        className="block w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm text-center text-2xl tracking-widest font-mono"
                        placeholder="000 000"
                        maxLength={7}
                      />
                      <Shield className="h-5 w-5 text-white/60 absolute left-4 top-3.5" />
                    </div>
                    <p className="text-white/50 text-xs mt-1">
                      Check your email for the 6-digit code
                    </p>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-white/90 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter new password"
                      />
                      <Lock className="h-5 w-5 text-white/60 absolute left-4 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-white/60 hover:text-white/80 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/90 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Confirm new password"
                      />
                      <Lock className="h-5 w-5 text-white/60 absolute left-4 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-3.5 text-white/60 hover:text-white/80 transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !formData.email || !formData.resetCode || !formData.newPassword || !formData.confirmPassword}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      <>
                        <span className="mr-2">Reset Password</span>
                        <Shield className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // Success Step
              <div className="text-center space-y-6">
                <div className="bg-green-500/20 backdrop-blur border border-green-300/30 text-green-100 px-4 py-3 rounded-xl text-sm font-medium">
                  ✅ {message}
                </div>
                
                <div className="space-y-4">
                  <p className="text-white/80 text-sm">
                    🎉 You can now log in with your new password
                  </p>
                  <p className="text-white/60 text-xs">
                    Redirecting to login page in 3 seconds...
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Go to Login →
                </button>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-white/10">
              <Link
                to="/login"
                className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>

          {/* Bottom text */}
          <p className="mt-8 text-center text-white/50 text-sm">
            © 2025 Excel Analytics. Secure password recovery.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
