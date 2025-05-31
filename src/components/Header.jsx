import { motion } from 'framer-motion'
import './Header.css'

const Header = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'amenity', label: 'アメ育成', icon: '🍬' },
    { id: 'sleep', label: '睡眠EXP育成', icon: '💤' },
    { id: 'combined', label: '🍬 アメ&睡眠EXP育成 💤' }
  ]

  return (
    <header className="header">
      <div className="container">
        <h1 className="title">ポケモンスリープ EXP 計算機</h1>
        
        <div className="tabs-container">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.95 }}
            >
              {tab.id !== 'combined' && (
                <span className="icon">{tab.icon}</span>
              )}
              <span className={`tab-label ${tab.id === 'combined' ? 'combined-label' : ''}`}>
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header