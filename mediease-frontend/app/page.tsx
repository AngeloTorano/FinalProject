"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios, { CancelTokenSource } from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Eye, EyeOff, Loader2 } from "lucide-react"

// Secure API configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
  headers: { 
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
})

// Secure storage utility
const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value)
    } catch (e) {
      console.warn("Session storage unavailable, using fallback")
      localStorage.setItem(key, value)
    }
  },
  
  getItem: (key: string) => {
    try {
      return sessionStorage.getItem(key) || localStorage.getItem(key)
    } catch (e) {
      return localStorage.getItem(key)
    }
  },
  
  removeItem: (key: string) => {
    try {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
    } catch (e) {
      localStorage.removeItem(key)
    }
  },
  
  clear: () => {
    try {
      sessionStorage.clear()
      localStorage.clear()
    } catch (e) {
      localStorage.clear()
    }
  }
}

interface LoginForm {
  username: string
  password: string
  role: string
}

interface FormErrors {
  username: string
  password: string
  general: string
}

export default function MediEasePage() {
  const [loginForm, setLoginForm] = useState<LoginForm>({ 
    username: "", 
    password: "", 
    role: "" 
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTime, setLockTime] = useState(0)
  
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
    general: ""
  })
  
  const router = useRouter()

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = { username: "", password: "", general: "" }
    let isValid = true

    // Username validation
    if (!loginForm.username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    } else if (loginForm.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      isValid = false
    }

    // Password validation
    if (!loginForm.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (loginForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }, [loginForm.username, loginForm.password])

  // Real-time validation
  useEffect(() => {
    if (loginForm.username || loginForm.password) {
      validateForm()
    }
  }, [loginForm.username, loginForm.password, validateForm])

  // Check if account is locked
  useEffect(() => {
    const checkLockStatus = () => {
      const storedAttempts = parseInt(secureStorage.getItem('loginAttempts') || '0')
      const lastAttempt = parseInt(secureStorage.getItem('lastLoginAttempt') || '0')
      const lockTimeRemaining = parseInt(secureStorage.getItem('lockTime') || '0')
      
      if (storedAttempts >= 5 && Date.now() - lastAttempt < 300000) { // 5 minutes lock
        setIsLocked(true)
        setLockTime(Math.ceil((300000 - (Date.now() - lastAttempt)) / 1000))
      } else if (storedAttempts >= 5) {
        // Reset attempts after lock period
        secureStorage.removeItem('loginAttempts')
        secureStorage.removeItem('lastLoginAttempt')
        secureStorage.removeItem('lockTime')
        setLoginAttempts(0)
        setIsLocked(false)
      }
    }

    checkLockStatus()
    
    if (isLocked) {
      const timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            secureStorage.removeItem('loginAttempts')
            secureStorage.removeItem('lastLoginAttempt')
            secureStorage.removeItem('lockTime')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [isLocked])

  // Auto-fill remembered username
  useEffect(() => {
    const rememberedUser = secureStorage.getItem('rememberedUser')
    if (rememberedUser) {
      setLoginForm(prev => ({ ...prev, username: rememberedUser }))
      setRememberMe(true)
    }
  }, [])

  // Check existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = secureStorage.getItem("token")
        const storedRole = secureStorage.getItem("userRole")
        
        if (token && storedRole) {
          // Verify token is still valid
          const response = await api.get("/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          if (response.status === 200) {
            router.push("/dashboard")
          }
        }
      } catch (err) {
        // Token expired or invalid, clear storage
        secureStorage.clear()
      }
    }

    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ username: "", password: "", general: "" })

    if (isLocked) {
      setErrors(prev => ({
        ...prev,
        general: `Account temporarily locked. Please try again in ${lockTime} seconds.`
      }))
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    let source: CancelTokenSource | null = null

    try {
      source = axios.CancelToken.source()
      const timeout = setTimeout(() => source?.cancel("Request timeout"), 10000)

      const res = await api.post("/api/auth/login", {
        username: loginForm.username.trim(),
        password: loginForm.password,
      }, {
        cancelToken: source.token
      })

      clearTimeout(timeout)

      if (res.status !== 200) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      // CHANGE: Use res.data.data.token and res.data.data.user
      const { token, user } = res.data.data

      if (!token || !user || !user.roles) {
        throw new Error("Invalid authentication response from server")
      }

      // Store authentication data securely
      secureStorage.setItem("token", token)
      secureStorage.setItem("user", JSON.stringify(user))
      // Store the first role or all roles as needed
      secureStorage.setItem("userRole", Array.isArray(user.roles) ? user.roles[0] : user.roles)

      // Handle remember me
      if (rememberMe) {
        secureStorage.setItem("rememberedUser", loginForm.username.trim())
      } else {
        secureStorage.removeItem("rememberedUser")
      }

      // Reset login attempts on successful login
      secureStorage.removeItem('loginAttempts')
      secureStorage.removeItem('lastLoginAttempt')
      secureStorage.removeItem('lockTime')
      setLoginAttempts(0)

      // Update form with actual role from server
      setLoginForm(prev => ({ ...prev, role: user.role }))

      router.push("/dashboard")
    } catch (err: any) {
      // Handle cancellation
      if (axios.isCancel(err)) {
        setErrors(prev => ({ ...prev, general: "Request timed out. Please try again." }))
        return
      }

      // Handle different error types
      if (err.response?.status === 401) {
        const attempts = loginAttempts + 1
        setLoginAttempts(attempts)
        secureStorage.setItem('loginAttempts', attempts.toString())
        secureStorage.setItem('lastLoginAttempt', Date.now().toString())

        if (attempts >= 5) {
          setIsLocked(true)
          setLockTime(300) // 5 minutes
          secureStorage.setItem('lockTime', '300')
          setErrors(prev => ({
            ...prev,
            general: "Too many failed attempts. Account locked for 5 minutes."
          }))
        } else {
          setErrors(prev => ({
            ...prev,
            general: `Invalid username or password. ${5 - attempts} attempts remaining.`
          }))
        }
      } else if (err.response?.status >= 500) {
        setErrors(prev => ({
          ...prev,
          general: "Server unavailable. Please try again later."
        }))
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network')) {
        setErrors(prev => ({
          ...prev,
          general: "Network error. Please check your connection."
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          general: err.response?.data?.message || err.message || "Login failed. Please try again."
        }))
      }
    } finally {
      setLoading(false)
      if (source) {
        source = null
      }
    }
  }

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Heart className="h-10 w-10 text-red-500 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MediEase
            </h1>
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-700">Starkey Hearing Foundation - Philippines</p>
            <p className="text-sm text-gray-600">Unified Health Management & Reporting System</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-3 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`h-11 ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter your username"
                  disabled={loading || isLocked}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`h-11 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Enter your password"
                    disabled={loading || isLocked}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isLocked}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={loading || isLocked}
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
                  disabled={loading || isLocked}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading || isLocked || !!errors.username || !!errors.password}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : isLocked ? (
                  `Locked (${lockTime}s)`
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 text-center">
                🔒 Secure authentication system. Your data is protected.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} MediEase System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}