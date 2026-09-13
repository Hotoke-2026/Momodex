import type { AchievementWithStatus } from '../../models/types'
import { AchievementBadge } from '../components/AchievementBadge'
import { BadgeGallery } from '../components/BadgeGallery'

const PREVIEW_ACHIEVEMENTS: AchievementWithStatus[] = [
  {
    type: 'starter_bird',
    name: 'Starter Bird',
    description: 'Unlocked your first bird observation.',
    unlocked: true,
    unlocked_at: '2026-09-10T00:00:00.000Z',
  },
  {
    type: 'starter_insect',
    name: 'Starter Insect',
    description: 'Logged your first insect sighting.',
    unlocked: true,
    unlocked_at: '2026-09-11T00:00:00.000Z',
  },
  {
    type: 'starter_plant',
    name: 'Starter Plant',
    description: 'Found your first plant species.',
    unlocked: false,
    unlocked_at: null,
  },
  {
    type: 'ten_observations',
    name: 'Ten Observations',
    description: 'Reached ten total observations.',
    unlocked: false,
    unlocked_at: null,
  },
  {
    type: 'first_legendary',
    name: 'First Legendary',
    description: 'Discovered your first legendary species.',
    unlocked: true,
    unlocked_at: '2026-09-12T00:00:00.000Z',
  },
  {
    type: 'first_win',
    name: 'First Win',
    description: 'Won your first battle.',
    unlocked: true,
    unlocked_at: '2026-09-13T00:00:00.000Z',
  },
]

export function BadgePreviewPage() {
  return (
    <div className="min-h-screen">
      <header className="app-header">
        <h1>Badge Gallery Preview</h1>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-6 text-(--color-text-soft)">
          This preview demonstrates the badge gallery layout with sample
          achievement data.
        </p>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">Single badge achievement</h2>
          <div className="max-w-md">
            <AchievementBadge achievement={PREVIEW_ACHIEVEMENTS[0]} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Badge gallery</h2>
          <BadgeGallery
            userId="preview-user"
            previewAchievements={PREVIEW_ACHIEVEMENTS}
          />
        </section>
      </main>
    </div>
  )
}
