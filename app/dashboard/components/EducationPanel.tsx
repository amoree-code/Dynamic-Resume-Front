'use client'

import { useEffect, useState } from 'react'
import {
  fetchUser, createEducation, updateEducation, deleteEducation,
} from '../../lib/api'
import type { Education, EducationInput } from '../../types'
import { Modal, ConfirmDialog, Field, inputCls, FormActions } from './Modal'

const empty: EducationInput = {
  institution: '', degree: '', field: '',
  startDate: '', endDate: '', current: false, gpa: '',
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const range = (s: string, e?: string, cur?: boolean) =>
  `${fmt(s)} — ${cur ? 'Present' : e ? fmt(e) : 'Present'}`

function EducationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: EducationInput
  onSave: (data: EducationInput) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: keyof EducationInput, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }))

  const toISO = (d?: string) => (d ? new Date(d).toISOString() : undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSave({
        ...form,
        startDate: toISO(form.startDate)!,
        endDate: form.current ? undefined : toISO(form.endDate),
        gpa: form.gpa || undefined,
      })
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Institution" required>
        <input className={inputCls} value={form.institution} onChange={(e) => f('institution', e.target.value)} required />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Degree" required>
          <input className={inputCls} value={form.degree} onChange={(e) => f('degree', e.target.value)} placeholder="Bachelor's" required />
        </Field>
        <Field label="Field" required>
          <input className={inputCls} value={form.field} onChange={(e) => f('field', e.target.value)} placeholder="Computer Science" required />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start date" required>
          <input className={inputCls} type="date" value={form.startDate} onChange={(e) => f('startDate', e.target.value)} required />
        </Field>
        <Field label="End date">
          <input className={inputCls} type="date" value={form.endDate ?? ''} onChange={(e) => f('endDate', e.target.value)} disabled={!!form.current} />
        </Field>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form.current}
          onChange={(e) => f('current', e.target.checked)}
          className="accent-green-500"
        />
        <span className="text-xs font-mono text-gray-400">Currently enrolled</span>
      </label>
      <Field label="GPA">
        <input className={inputCls} value={form.gpa ?? ''} onChange={(e) => f('gpa', e.target.value)} placeholder="3.8" />
      </Field>
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
      <FormActions loading={loading} onCancel={onCancel} submitLabel="save education" />
    </form>
  )
}

export default function EducationPanel() {
  const [items, setItems] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | Education | null>(null)
  const [delTarget, setDelTarget] = useState<Education | null>(null)
  const [delLoading, setDelLoading] = useState(false)

  const reload = () => fetchUser().then((u) => setItems(u.educations ?? [])).finally(() => setLoading(false))
  useEffect(() => { reload() }, [])

  const handleSave = async (data: EducationInput) => {
    if (modal === 'create') await createEducation(data)
    else if (modal) await updateEducation((modal as Education).id, data)
    setModal(null)
    reload()
  }

  const handleDelete = async () => {
    if (!delTarget) return
    setDelLoading(true)
    try {
      await deleteEducation(delTarget.id)
      setDelTarget(null)
      reload()
    } finally {
      setDelLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">Education</h2>
        <button
          onClick={() => setModal('create')}
          className="px-4 py-1.5 text-xs font-mono font-bold bg-green-500 text-black hover:bg-green-400 transition-colors"
        >
          + new entry
        </button>
      </div>

      {loading ? (
        <p className="text-green-900 font-mono text-sm animate-pulse">loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-700 font-mono text-sm">No education entries yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((e) => (
            <div
              key={e.id}
              className="border border-green-900/25 bg-[#0d0d0d] px-4 py-3 flex items-start justify-between gap-4 hover:border-green-900/40 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-gray-200 text-sm font-semibold">
                  {e.degree} in {e.field}
                </p>
                <p className="text-green-700 text-xs font-mono mt-0.5">{e.institution}</p>
                <p className="text-gray-600 text-xs font-mono mt-0.5">
                  {range(e.startDate, e.endDate, e.current)}
                  {e.gpa && <span className="ml-3">GPA {e.gpa}</span>}
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setModal(e)}
                  className="text-xs font-mono text-green-700 hover:text-green-400 transition-colors"
                >
                  edit
                </button>
                <button
                  onClick={() => setDelTarget(e)}
                  className="text-xs font-mono text-red-900 hover:text-red-400 transition-colors"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'create' ? 'New Education' : `Edit: ${(modal as Education).institution}`}
          onClose={() => setModal(null)}
        >
          <EducationForm
            initial={modal === 'create' ? empty : { ...(modal as Education) }}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {delTarget && (
        <ConfirmDialog
          message={`Delete "${delTarget.degree} at ${delTarget.institution}"? This cannot be undone.`}
          loading={delLoading}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </>
  )
}
