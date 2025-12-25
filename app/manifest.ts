import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'vibeflow - Project Management',
    short_name: 'vibeflow',
    description: 'Project management for vibe coders. Kinetic Flow aesthetic with kanban boards and task management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#06b6d4',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png.tsx',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png.tsx',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['productivity', 'business'],
    screenshots: [],
  }
}
