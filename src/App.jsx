import { useState } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('amenity')
  
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="container">
        <Calculator activeTab={activeTab} />
      </main>
      <Footer />
    </div>
  )
}

export default App