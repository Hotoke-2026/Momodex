import { useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useMapObservations } from '../hooks/useMapObservations'
import { NavBar } from '../components/NavBar'

const DATE_RANGES = {
  all: { label: 'All time', days: null },
  '7d': { label: 'Last 7 days', days: 7 },
  '30d': { label: 'Last 30 days', days: 30 },
  '1y': { label: 'Last year', days: 365 },
} as const

type DateRangeKey = keyof typeof DATE_RANGES

export function MapPage() {
  const { data: pins, isLoading, isError } = useMapObservations()
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [dateRange, setDateRange] = useState<DateRangeKey>('all')

  const speciesOptions = useMemo(
    () => Array.from(new Set(pins?.map((p) => p.species) ?? [])).sort(),
    [pins],
  )

  const filteredPins = useMemo(() => {
    if (!pins) return []

    return pins.filter((pin) => {
      if (speciesFilter !== 'all' && pin.species !== speciesFilter) return false

      const days = DATE_RANGES[dateRange].days
      if (days !== null) {
        if (!pin.observedOn) return false
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        if (new Date(pin.observedOn) < cutoff) return false
      }

      return true
    })
  }, [pins, speciesFilter, dateRange])

  return (
    <div className="min-h-screen bg-(--color-base)">
      <NavBar />

      <header className="px-6 pb-4 pt-6">
        <h1 className="font-display text-(length:--text-heading-md) font-black text-(--color-text)">
          Sightings Map
        </h1>
        <p className="mt-1 text-sm text-(--color-text-soft)">
          {filteredPins.length} verified sightings shown
        </p>
      </header>

      <div className="flex flex-wrap gap-3 px-6 pb-4">
        <select
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
          className="rounded-md border border-(--color-tan) bg-(--color-surface) px-3 py-1.5 text-sm"
        >
          <option value="all">All species</option>
          {speciesOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRangeKey)}
          className="rounded-md border border-(--color-tan) bg-(--color-surface) px-3 py-1.5 text-sm"
        >
          {Object.entries(DATE_RANGES).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="px-6 pb-8">
        {isLoading && (
          <p className="text-(--color-text-soft)">Loading sightings...</p>
        )}
        {isError && (
          <p className="text-(--color-red)">Couldn&apos;t load map data.</p>
        )}

        {!isLoading && !isError && (
          <div className="overflow-hidden rounded-xl border border-(--color-tan) shadow-sm">
            <MapContainer
              center={[-41.3, 174.8]}
              zoom={5}
              style={{ height: '70vh', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {filteredPins.map((pin) => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]}>
                  <Popup>
                    <strong>{pin.species}</strong>
                    <br />
                    {pin.observedOn
                      ? `Observed ${pin.observedOn}`
                      : 'Date unknown'}
                    <br />
                    {pin.qualityGrade === 'research' && '✓ Verified sighting'}
                    {pin.obscured && (
                      <>
                        <br />
                        📍 Exact location protected
                      </>
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}