/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './Pages/App'
import { Deck } from './Pages/Deck'

const routes = createRoutesFromElements(
  <>
    <Route index element={<App />} />
    <Route path="deck" element={<Deck />} />
  </>,
)

export default routes
