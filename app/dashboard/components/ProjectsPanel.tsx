'use client'

import { useEffect, useState } from 'react'
import {
  fetchProjects, createProject, updateProject, deleteProject,
} from '../../lib/api'
import type { Project, ProjectInput } from '../../types'
import { Modal, ConfirmDialog, Field, inputCls, textareaCls, FormActions } from './Modal'

const empty: ProjectInput = {
  title: '', description: '', longDesc: '',
  techStack: [], liveUrl: '', repoUrl: '', imageUrl: '',
}

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ProjectInput
  onSave: (data: ProjectInput) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState<ProjectInput & { techRaw: string }>({
    ...initial,
    techRaw: initial.techStack.join(', '),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (k: keyof ProjectInput, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { techRaw, ...rest } = form
      await onSave({
        ...rest,
        techStack: techRaw.split(',').map((t) => t.trim()).filter(Boolean),
      })
    } catch (err: unknown) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Title" required>
        <input className={inputCls} value={form.title} onChange={(e) => f('title', e.target.value)} required />
      </Field>
      <Field label="Short description" required>
        <textarea className={textareaCls} rows={2} value={form.description} onChange={(e) => f('description', e.target.value)} required />
      </Field>
      <Field label="Full description">
        <textarea className={textareaCls} rows={3} value={form.longDesc ?? ''} onChange={(e) => f('longDesc', e.target.value)} />
      </Field>
      <Field label="Tech stack (comma separated)" required>
        <input className={inputCls} value={form.techRaw} onChange={(e) => setForm((p) => ({ ...p, techRaw: e.target.value }))} placeholder="NestJS, React, PostgreSQL" required />
      </Field>
      <Field label="Live URL">
        <input className={inputCls} type="url" value={form.liveUrl ?? ''} onChange={(e) => f('liveUrl', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Repo URL">
        <input className={inputCls} type="url" value={form.repoUrl ?? ''} onChange={(e) => f('repoUrl', e.target.value)} placeholder="https://github.com/..." />
      </Field>
      <Field label="Image URL">
        <input className={inputCls} type="url" value={form.imageUrl ?? ''} onChange={(e) => f('imageUrl', e.target.value)} placeholder="https://..." />
      </Field>
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
      <FormActions loading={loading} onCancel={onCancel} submitLabel="save project" />
    </form>
  )
}

export default function ProjectsPanel() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | Project | null>(null)
  const [delTarget, setDelTarget] = useState<Project | null>(null)
  const [delLoading, setDelLoading] = useState(false)

  const reload = () => fetchProjects().then(setItems).finally(() => setLoading(false))
  useEffect(() => { reload() }, [])

  const handleSave = async (data: ProjectInput) => {
    if (modal === 'create') await createProject(data)
    else if (modal) await updateProject((modal as Project).id, data)
    setModal(null)
    reload()
  }

  const handleDelete = async () => {
    if (!delTarget) return
    setDelLoading(true)
    try {
      await deleteProject(delTarget.id)
      setDelTarget(null)
      reload()
    } finally {
      setDelLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">Projects</h2>
        <button
          onClick={() => setModal('create')}
          className="px-4 py-1.5 text-xs font-mono font-bold bg-green-500 text-black hover:bg-green-400 transition-colors"
        >
          + new project
        </button>
      </div>

      {loading ? (
        <p className="text-green-900 font-mono text-sm animate-pulse">loading…</p>
      ) : items.length === 0 ? (
        <p className="text-gray-700 font-mono text-sm">No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="border border-green-900/25 bg-[#0d0d0d] px-4 py-3 flex items-start justify-between gap-4 hover:border-green-900/40 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-gray-200 text-sm font-semibold truncate">{p.title}</p>
                <p className="text-gray-600 text-xs font-mono mt-0.5 truncate">{p.techStack.join(' · ')}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => setModal(p)}
                  className="text-xs font-mono text-green-700 hover:text-green-400 transition-colors"
                >
                  edit
                </button>
                <button
                  onClick={() => setDelTarget(p)}
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
          title={modal === 'create' ? 'New Project' : `Edit: ${(modal as Project).title}`}
          onClose={() => setModal(null)}
        >
          <ProjectForm
            initial={modal === 'create' ? empty : { ...(modal as Project) }}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {delTarget && (
        <ConfirmDialog
          message={`Delete "${delTarget.title}"? This cannot be undone.`}
          loading={delLoading}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </>
  )
}
