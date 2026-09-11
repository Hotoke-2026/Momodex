/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './Pages/App'
import { Deck } from './Pages/Deck'
import { BattleScreen } from './Pages/BattleScreen'

const routes = createRoutesFromElements(
  <>
    <Route index element={<App />} />
    <Route path="deck" element={<Deck />} />
    <Route path="battle" element={<BattleScreen />} />
  </>,
)

export default routes
