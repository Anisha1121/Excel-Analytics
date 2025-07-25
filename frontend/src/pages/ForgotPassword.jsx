import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import { authService } from '../services/authService'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState('email') // 'email' or 'success'
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await authService.forgotPassword(email)
      setMessage(response.message)
      setStep('success')
      
      // After 3 seconds, redirect to reset password page with email
      setTimeout(() => {
        navigate('/reset-password', { state: { email } })
      }, 3000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
    setMessage('')
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
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {step === 'email' ? 'Forgot Password?' : 'Check Your Email'}
              </h2>
              <p className="text-white/70 text-lg font-medium">
                {step === 'email' 
                  ? 'Enter your email to receive a reset code'
                  : 'We\'ve sent a reset code to your email'
                }
              </p>
            </div>

            {step === 'email' ? (
              // Email Step
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/20 backdrop-blur border border-red-300/30 text-red-100 px-4 py-3 rounded-xl text-sm font-medium">
                    ⚠️ {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                    <Mail className="h-5 w-5 text-white/60 absolute left-4 top-3.5" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        Sending Reset Code...
                      </div>
                    ) : (
                      <>
                        <span className="mr-2">Send Reset Code</span>
                        <Mail className="h-5 w-5" />
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
                    📧 Check your email for a 6-digit reset code
                  </p>
                  <p className="text-white/60 text-xs">
                    The code will expire in 15 minutes
                  </p>
                  <p className="text-white/60 text-xs">
                    Redirecting to reset password page in 3 seconds...
                  </p>
                </div>

                <button
                  onClick={() => navigate('/reset-password', { state: { email } })}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Go to Reset Password →
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

export default ForgotPassword
