'use client';

import { useEffect, useState } from 'react';
import {
  fetchUser,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../../lib/api';
import type { Skill, SkillInput } from '../../types';
import { Modal, ConfirmDialog, Field, inputCls, FormActions } from './Modal';

const empty: SkillInput = {
  name: '',
  category: '',
  level: 50,
  iconUrl: undefined,
};

function SkillForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: SkillInput;
  onSave: (data: SkillInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(form);
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name" required>
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </Field>
      <Field label="Category" required>
        <input
          className={inputCls}
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Backend, Frontend, DevOps…"
          required
        />
      </Field>
      <Field label={`Level — ${form.level}%`} required>
        <input
          type="range"
          min={1}
          max={100}
          value={form.level}
          onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
          className="w-full accent-green-500"
        />
        <div className="flex justify-between text-xs font-mono text-gray-700 mt-1">
          <span>1</span>
          <span>100</span>
        </div>
      </Field>
      {/* <Field label="Icon URL">
        <input
          className={inputCls}
          type="url"
          value={form.iconUrl ?? ''}
          onChange={(e) => setForm({ ...form, iconUrl: e.target.value })}
          placeholder="https://..."
        />
      </Field> */}
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
      <FormActions
        loading={loading}
        onCancel={onCancel}
        submitLabel="save skill"
      />
    </form>
  );
}

export default function SkillsPanel() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | Skill | null>(null);
  const [delTarget, setDelTarget] = useState<Skill | null>(null);
  const [delLoading, setDelLoading] = useState(false);

  const reload = () =>
    fetchUser()
      .then((u) => setItems(u.skills ?? []))
      .finally(() => setLoading(false));
  useEffect(() => {
    reload();
  }, []);

  const handleSave = async (data: SkillInput) => {
    if (modal === 'create') await createSkill(data);
    else if (modal) await updateSkill((modal as Skill).id, data);
    setModal(null);
    reload();
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setDelLoading(true);
    try {
      await deleteSkill(delTarget.id);
      setDelTarget(null);
      reload();
    } finally {
      setDelLoading(false);
    }
  };

  const categories = [...new Set(items.map((s) => s.category))];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg">Skills</h2>
        <button
          onClick={() => setModal('create')}
          className="px-4 py-1.5 text-xs font-mono font-bold bg-green-500 text-black hover:bg-green-400 transition-colors"
        >
          + new skill
        </button>
      </div>

      {loading ? (
        <p className="text-green-900 font-mono text-sm animate-pulse">
          loading…
        </p>
      ) : items.length === 0 ? (
        <p className="text-gray-700 font-mono text-sm">No skills yet.</p>
      ) : (
        <div className="space-y-5">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="text-green-800 text-xs font-mono tracking-widest uppercase mb-2">
                {cat}
              </p>
              <div className="space-y-1.5">
                {items
                  .filter((s) => s.category === cat)
                  .sort((a, b) => b.level - a.level)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="border border-green-900/25 bg-[#0d0d0d] px-4 py-2.5 flex items-center justify-between gap-4 hover:border-green-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <span className="text-gray-300 text-sm w-28 truncate shrink-0">
                          {s.name}
                        </span>
                        <div className="flex-1 h-px bg-green-950 relative">
                          <div
                            className="absolute inset-y-0 left-0 bg-green-600"
                            style={{ width: `${s.level}%` }}
                          />
                        </div>
                        <span className="text-gray-600 text-xs font-mono w-10 text-right shrink-0">
                          {s.level}%
                        </span>
                      </div>
                      <div className="flex gap-3 shrink-0">
                        <button
                          onClick={() => setModal(s)}
                          className="text-xs font-mono text-green-700 hover:text-green-400 transition-colors"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => setDelTarget(s)}
                          className="text-xs font-mono text-red-900 hover:text-red-400 transition-colors"
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={
            modal === 'create' ? 'New Skill' : `Edit: ${(modal as Skill).name}`
          }
          onClose={() => setModal(null)}
        >
          <SkillForm
            initial={modal === 'create' ? empty : { ...(modal as Skill) }}
            onSave={handleSave}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}

      {delTarget && (
        <ConfirmDialog
          message={`Delete "${delTarget.name}"? This cannot be undone.`}
          loading={delLoading}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </>
  );
}
