//style classes for battle log entries
export function getLogEntryClass(entry: string): string {
  if (entry.includes('super effective')) return 'log-entry log-entry--super'
  if (entry.includes('Not very effective')) return 'log-entry log-entry--weak'
  if (entry.toLowerCase().includes('poison'))
    return 'log-entry log-entry--poison'
  if (entry.toLowerCase().includes('lifesteal'))
    return 'log-entry log-entry--lifesteal'
  if (entry.toLowerCase().includes('fainted'))
    return 'log-entry log-entry--faint'
  return 'log-entry'
}
