'use client';

import { useEffect, useState } from 'react';
import { fetchUser, updateProfile } from '../../lib/api';
import type { User, ProfileInput } from '../../types';
import { Field, inputCls, textareaCls, FormActions } from './Modal';

export default function ProfilePanel() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileInput>({
    name: '',
    surname: '',
    nickname: '',
    phone1: '',
    phone2: '',
    title: '',
    subtitle: '',
    bio: '',
    github: '',
    linkedin: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser().then((u) => {
      setUser(u);
      setForm({
        name: u.name ?? '',
        surname: u.surname ?? '',
        nickname: u.nickname ?? '',
        phone1: u.phone1 ?? '',
        phone2: u.phone2 ?? '',
        title: u.title ?? '',
        subtitle: u.subtitle ?? '',
        bio: u.bio ?? '',
        github: u.github ?? '',
        linkedin: u.linkedin ?? '',
        instagram: u.instagram ?? '',
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const payload: ProfileInput = {
        ...form,
        surname:   form.surname   || undefined,
        nickname:  form.nickname  || undefined,
        phone1:    form.phone1    || undefined,
        phone2:    form.phone2    || undefined,
        title:     form.title     || undefined,
        subtitle:  form.subtitle  || undefined,
        bio:       form.bio       || undefined,
        github:    form.github    || undefined,
        linkedin:  form.linkedin  || undefined,
        instagram: form.instagram || undefined,
      };
      const updated = await updateProfile(payload);
      setUser((prev) => (prev ? { ...prev, ...updated } : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p className="text-green-900 font-mono text-sm animate-pulse">loading…</p>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h2 className="text-white font-bold text-lg">Profile</h2>
        <p className="text-gray-600 text-xs font-mono mt-1">{user.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <input
              className={inputCls}
              value={form.name ?? ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Surname">
            <input
              className={inputCls}
              value={form.surname ?? ''}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
            />
          </Field>
        </div>

        <Field label="Nickname">
          <input
            className={inputCls}
            value={form.nickname ?? ''}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="@handle"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone 1">
            <input
              className={inputCls}
              type="tel"
              value={form.phone1 ?? ''}
              onChange={(e) => setForm({ ...form, phone1: e.target.value })}
              placeholder="+964 777 000 0000"
            />
          </Field>
          <Field label="Phone 2">
            <input
              className={inputCls}
              type="tel"
              value={form.phone2 ?? ''}
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              placeholder="+964 772 000 0000"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Job Title">
            <input
              className={inputCls}
              value={form.title ?? ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Full Stack Developer"
            />
          </Field>
          <Field label="Subtitle">
            <input
              className={inputCls}
              value={form.subtitle ?? ''}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Building things for the web"
            />
          </Field>
        </div>

        <Field label="Bio">
          <textarea
            className={textareaCls}
            rows={3}
            value={form.bio ?? ''}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="A short description about yourself…"
          />
        </Field>

        <Field label="GitHub URL">
          <input
            className={inputCls}
            type="url"
            value={form.github ?? ''}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
            placeholder="https://github.com/..."
          />
        </Field>

        <Field label="LinkedIn URL">
          <input
            className={inputCls}
            type="url"
            value={form.linkedin ?? ''}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/..."
          />
        </Field>

        <Field label="Instagram URL">
          <input
            className={inputCls}
            type="url"
            value={form.instagram ?? ''}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </Field>

        {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
        {saved && (
          <p className="text-green-500 text-xs font-mono">Profile saved.</p>
        )}

        <FormActions
          loading={loading}
          onCancel={() => {}}
          submitLabel="save changes"
        />
      </form>
    </div>
  );
}
