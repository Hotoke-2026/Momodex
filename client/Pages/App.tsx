import { useFruits } from '../hooks/useFruits.ts'
import '../styles/index.css'

function App() {
  const { data } = useFruits()

  return (
    <>
      <div className="app">
        <h1>Momodex!</h1>

        <ul>{data && data.map((fruit) => <li key={fruit}>{fruit}</li>)}</ul>
      </div>
    </>
  )
}

export default App
