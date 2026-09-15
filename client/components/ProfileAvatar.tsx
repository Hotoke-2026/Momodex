interface ProfileAvatarProps {
  name?: string
  avatarUrl?: string | null
  size?: number
}

export function ProfileAvatar({ name, avatarUrl, size = 96 }: ProfileAvatarProps) {
  const initial = name?.[0]?.toUpperCase() ?? '?'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name}'s profile photo` : 'Profile photo'}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-(--color-green) font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-label={name ? `${name}'s profile photo placeholder` : 'Profile photo placeholder'}
    >
      {initial}
    </div>
  )
}