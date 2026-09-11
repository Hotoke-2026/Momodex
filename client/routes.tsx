/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './Pages/App'
import { Deck } from './Pages/Deck'
import { Gallery } from './Pages/Gallery'

const routes = createRoutesFromElements(
  <>
    <Route index element={<App />} />
    <Route path="deck" element={<Deck />} />
    <Route path="gallery" element={<Gallery />} />
  </>,
)

export default routes
