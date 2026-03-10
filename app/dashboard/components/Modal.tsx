'use client'

import { useEffect } from 'react'

/* ─── Modal wrapper ─────────────────────────────────── */
interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-xl bg-[#111] border border-green-900/30 shadow-2xl shadow-black/80 max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-900/20 shrink-0">
          <h2 className="text-white font-bold text-sm tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-300 transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
        {/* body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

/* ─── Confirm delete dialog ─────────────────────────── */
interface ConfirmDialogProps {
  message: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  message,
  loading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-sm bg-[#111] border border-red-900/40 p-6 shadow-2xl">
        <p className="text-gray-300 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-mono text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-mono bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {loading ? 'deleting…' : 'delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared form field components ──────────────────── */
export function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-gray-500 tracking-widest uppercase mb-1.5">
        {label}
        {required && <span className="text-green-700 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

export const inputCls =
  'w-full bg-[#0d0d0d] border border-green-900/30 px-3 py-2 text-sm text-gray-200 placeholder-gray-700 font-mono focus:outline-none focus:border-green-700 transition-colors'

export const textareaCls =
  'w-full bg-[#0d0d0d] border border-green-900/30 px-3 py-2 text-sm text-gray-200 placeholder-gray-700 font-mono focus:outline-none focus:border-green-700 transition-colors resize-none'

export function FormActions({
  loading,
  onCancel,
  submitLabel,
}: {
  loading: boolean
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="flex gap-3 justify-end pt-4 border-t border-green-900/20 mt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 text-sm font-mono text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
      >
        cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 text-sm font-mono font-bold bg-green-500 text-black hover:bg-green-400 transition-colors disabled:opacity-50"
      >
        {loading ? 'saving…' : submitLabel}
      </button>
    </div>
  )
}
