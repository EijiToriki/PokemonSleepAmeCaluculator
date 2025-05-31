import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import LevelSection from './calculator/LevelSection'
import InputSection from './calculator/InputSection'
import ExplainCard from './ExplainCard'
import './Calculator.css'


const Calculator = ({ activeTab }) => {
  const result = useSelector(state => state.calculator.result)
  
  // Different titles based on active tab
  const getTitle = () => {
    switch(activeTab) {
      case 'amenity': 
        return { value: result.amenitiesRequired, unit: '個のアメが必要' }
      case 'sleep': 
        return { value: result.daysRequired, unit: '日の睡眠が必要' }
      default: 
        return { value: '', unit: '' }
    }
  }

  const title = getTitle()

  if (activeTab === 'combined') {
    return (
      <motion.div 
        className="calculator-card coming-soon"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="coming-soon-title">Coming Soon!</h2>
        <p className="coming-soon-text">アメ＆睡眠EXP育成の計算機は開発中です。</p>
      </motion.div>
    )
  }

  return (
    <div className="calculator-container">
      <motion.div 
        className="calculator-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="calculator-result">
          <h2 className="result-title">
            <span className="result-value">{title.value}</span> {title.unit}
          </h2>
        </div>
        
        <LevelSection />
        
        <div className="divider" />
        
        <h3 className="section-title">条件入力</h3>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <InputSection activeTab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <ExplainCard activeTab={activeTab} />
    </div>
  )
}

export default Calculator