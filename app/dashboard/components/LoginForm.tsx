'use client'

import { useState } from 'react'
import { login } from '../../lib/api'

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      onLogin()
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="text-green-900 text-xs font-mono tracking-widest mb-2">
          // dashboard
        </p>
        <h1 className="text-2xl font-bold text-white mb-8">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-600 tracking-widest uppercase mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full bg-[#0d0d0d] border border-green-900/30 px-3 py-2.5 text-sm text-gray-200 font-mono focus:outline-none focus:border-green-700 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-600 tracking-widest uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0d0d0d] border border-green-900/30 px-3 py-2.5 text-sm text-gray-200 font-mono focus:outline-none focus:border-green-700 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-green-500 text-black font-bold text-sm hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'signing in…' : 'sign in'}
          </button>
        </form>

        <a
          href="/"
          className="block mt-6 text-center text-xs font-mono text-gray-700 hover:text-gray-500 transition-colors"
        >
          ← back to portfolio
        </a>
      </div>
    </div>
  )
}
