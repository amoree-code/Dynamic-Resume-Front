import type { MetadataRoute } from 'next';
import { fetchUser } from './api';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    const user = await fetchUser();
    const now = new Date();

    // Each visible section becomes a sitemap entry with its anchor.
    const sections: MetadataRoute.Sitemap = [
      {
        url: `${base}/#about`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 1,
      },
    ];

    if ((user.experiences ?? []).length > 0)
      sections.push({
        url: `${base}/#experience`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });

    if ((user.projects ?? []).length > 0)
      sections.push({
        url: `${base}/#projects`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      });

    if ((user.skills ?? []).length > 0)
      sections.push({
        url: `${base}/#skills`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });

    if ((user.educations ?? []).length > 0)
      sections.push({
        url: `${base}/#education`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.6,
      });

    sections.push({
      url: `${base}/#contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    });

    return sections;
  } catch {
    return [
      {
        url: base,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
    ];
  }
}
