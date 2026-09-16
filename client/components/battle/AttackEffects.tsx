// Maps a species' type to its themed hit-effect class — falls back to
// 'bird' styling for any type not explicitly listed.
const typeEffectClass: Record<string, string> = {
  bird: 'attack-effect--bird',
  mammal: 'attack-effect--mammal',
  plant: 'attack-effect--plant',
  insect: 'attack-effect--insect',
  reptile: 'attack-effect--herp',
  amphibian: 'attack-effect--herp',
  fungi: 'attack-effect--fungi',
}

export function getAttackEffectClass(type: string): string {
  return typeEffectClass[type] ?? 'attack-effect--bird'
}

// Plant and insect effects need extra child elements for their
// vine/leaf/thorn or swarming-bug animations. Other types only use
// ::before/::after, so they render nothing extra.
export function AttackEffectExtras({ type }: { type: string }) {
  if (type === 'bird') {
    return (
      <>
        <div className="feather feather-1" />
        <div className="feather feather-2" />
        <div className="feather feather-3" />
        <div className="feather feather-4" />
      </>
    )
  }
  if (type === 'plant') {
    return (
      <>
        <div className="vine vine-1" />
        <div className="vine vine-2" />
        <div className="vine vine-3" />
        <div className="leaf leaf-1" />
        <div className="leaf leaf-2" />
        <div className="leaf leaf-3" />
        <div className="leaf leaf-4" />
        <div className="thorn thorn-1" />
        <div className="thorn thorn-2" />
        <div className="thorn thorn-3" />
        <div className="thorn thorn-4" />
      </>
    )
  }
  if (type === 'insect') {
    return (
      <>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`bug bug-${i + 1}`} />
        ))}
      </>
    )
  }
  return null
}
