/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './Pages/App'
import { Deck } from './Pages/Deck'
import { BattleScreen } from './Pages/BattleScreen'
import { MapPage } from './Pages/Map'
import { Profile } from './Pages/Profile'

const routes = createRoutesFromElements(
  <>
    <Route index element={<App />} />
    <Route path="deck" element={<Deck />} />
    <Route path="battle" element={<BattleScreen />} />
    <Route path="map" element={<MapPage />} />
    <Route path="profile" element={<Profile />} />

  </>,
)

export default routes
