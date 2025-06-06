import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import LevelSection from './calculator/LevelSection'
import InputSection from './calculator/InputSection'
import ExplainCard from './ExplainCard'
import './Calculator.css'
import { useState } from 'react'

/**
 * ポケモンの育成に必要なアメまたは睡眠日数を計算するメインコンポーネント
 * @param {string} activeTab - 現在選択中のタブ（'amenity'/'sleep'/'combined'）
 */
const Calculator = ({ activeTab }) => {
  const [fixedCondition, setFixedCondition] = useState("amenity")
  // Reduxストアから計算結果を取得
  const result = useSelector(state => state.calculator.result)
  
  // アクティブなタブに応じて表示する結果のタイトルを取得
  const getTitle = () => {
    switch(activeTab) {
      case 'amenity': 
        return { value: result.amenitiesRequired, unit: '個のアメが必要' }
      case 'sleep': 
        return { value: result.daysRequired, unit: '日の睡眠が必要' }
      default:
        if(fixedCondition === 'amenity'){
          return { value: result.fixedDaysRequired, unit: '日の睡眠が必要' }
        }else if(fixedCondition === 'sleep'){
          return { value: result.fixedAmenitiesRequired, unit: '個のアメが必要' }
        }
    }
  }

  const title = getTitle()

  // メインの計算機UI
  return (
    <div className="calculator-container">
      {/* アニメーション付きのメインカード */}
      <motion.div 
        className="calculator-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* 計算結果の表示部分 */}
        <div className="calculator-result">
          <h2 className="result-title">
            <span className="result-value">{title.value}</span> {title.unit}
          </h2>
        </div>
        
        {/* レベル設定セクション */}
        <LevelSection />
        
        <div className="divider" />
        
        <h3 className="section-title">条件入力</h3>
        
        {/* タブ切り替え時のアニメーション */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <InputSection activeTab={activeTab} fixedCondition={fixedCondition} setFixedCondition={setFixedCondition} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 説明カードコンポーネント */}
      <ExplainCard activeTab={activeTab} />
    </div>
  )
}

export default Calculator