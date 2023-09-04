import { useState } from 'react'
import './styles/App.css'
import Sidebar from './components/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{display: 'flex', flexDirection:'row'}}>
      <Sidebar/>
      
      
    </div>
  )
}

export default App
