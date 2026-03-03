'use client'

import { useEffect, useState } from 'react'
import {
  fetchUser, createExperience, updateExperience, deleteExperience,
} from '../../lib/api'
import type { Experience, ExperienceInput } from '../../types'
import { Modal, ConfirmDialog, Field, inputCls, textareaCls, FormActions } from './Modal'

const empty: ExperienceInput = {
  company: '', role: '', description: '',
  startDate: '', endDate: '', current: false, location: '',
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const range = (s: string, e?: string, cur?: boolean) =>
  `${fmt(s)} — ${cur ? 'Present' : e ? fmt(e) : 'Present'}`

function ExperienceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ExperienceInput
  onSave: (data: ExperienceInput) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: keyof ExperienceInput, v: string | boolean) =>
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
        description: form.description || undefined,
        location: form.location || undefined,
      })
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Company" required>
        <input className={inputCls} value={form.company} onChange={(e) => f('company', e.target.value)} required />
      </Field>
      <Field label="Role" required>
        <input className={inputCls} value={form.role} onChange={(e) => f('role', e.target.value)} required />
      </Field>
      <Field label="Location">
        <input className={inputCls} value={form.location ?? ''} onChange={(e) => f('location', e.target.value)} placeholder="City, Country" />
      </Field>
      <Field label="Description">
        <textarea className={textareaCls} rows={3} value={form.description ?? ''} onChange={(e) => f('description', e.target.value)} />
      </Field>
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
        <span className="text-xs font-mono text-gray-400">Currently working here</span>
      </label>
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
      <FormActions loading={loading} onCancel={onCancel} submitLabel="save experience" />
    </form>
  )
}

export default function ExperiencePanel() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | Experience | null>(null)
  const [delTarget, setDelTarget] = useState<Experience | null>(null)
  const [delLoading, setDelLoading] = useState(false)

  const reload = () => fetchUser().then((u) => setItems(u.experiences ?? [])).finally(() => setLoading(false))
  useEffect(() => { reload() }, [])

  const handleSave = async (data: ExperienceInput) => {
    if (modal === 'create') await createExperience(data)
    else if (modal) await updateExperience((modal as Experience).id, data)
    setModal(null)
    reload()
  }

  const handleDelete = async () => {
    if (!delTarget) return
    setDelLoading(true)
    try {
      await deleteExperience(delTarget.id)
      setDelTarget(null)
      reload()
    } finally {
      setDelLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">Experience</h2>
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
        <p className="text-gray-700 font-mono text-sm">No experience entries yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((e) => (
            <div
              key={e.id}
              className="border border-green-900/25 bg-[#0d0d0d] px-4 py-3 flex items-start justify-between gap-4 hover:border-green-900/40 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-gray-200 text-sm font-semibold">{e.role}</p>
                <p className="text-green-700 text-xs font-mono mt-0.5">{e.company}</p>
                <p className="text-gray-600 text-xs font-mono mt-0.5">
                  {range(e.startDate, e.endDate, e.current)}
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
          title={modal === 'create' ? 'New Experience' : `Edit: ${(modal as Experience).role}`}
          onClose={() => setModal(null)}
        >
          <ExperienceForm
            initial={modal === 'create' ? empty : { ...(modal as Experience) }}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {delTarget && (
        <ConfirmDialog
          message={`Delete "${delTarget.role} at ${delTarget.company}"? This cannot be undone.`}
          loading={delLoading}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </>
  )
}
