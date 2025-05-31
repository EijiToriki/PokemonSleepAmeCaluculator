import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion'
import LevelSlider from './LevelSlider'
import './LevelSection.css'
import { calculateResults, selectCurrentLevel, selectTargetLevel, setCurrentLevel, setTargetLevel } from '../../store/calculatorSlice';

const LevelSection = () => {
  const dispatch = useDispatch();
  const currentLevel = useSelector(selectCurrentLevel)
  const targetLevel = useSelector(selectTargetLevel)
  
  const handleCurrentLevelChange = (value) => {
    dispatch(setCurrentLevel(value))
    if (value >= targetLevel) {
      dispatch(setTargetLevel(Math.min(value + 1, 65)))      
    }
    dispatch(calculateResults())
  }
  
  const handleTargetLevelChange = (value) => {
    dispatch(setTargetLevel(value))
    if (value <= currentLevel) {
      dispatch(setCurrentLevel(Math.max(value - 1, 1)))
    }
    dispatch(calculateResults())
  }
  
  return (
    <div className="level-section">
      <div className="level-column">
        <h3 className="level-title">現在レベル</h3>
        <div className="level-display">
          <motion.div 
            className="level-value"
            key={`current-${currentLevel}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentLevel}
          </motion.div>
          <span className="level-label">レベル</span>
        </div>
        <LevelSlider 
          value={currentLevel} 
          onChange={handleCurrentLevelChange} 
          min={1} 
          max={65} 
        />
      </div>
      
      <div className="level-column">
        <h3 className="level-title">目標レベル</h3>
        <div className="level-display">
          <motion.div 
            className="level-value"
            key={`target-${targetLevel}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {targetLevel}
          </motion.div>
          <span className="level-label">レベル</span>
        </div>
        <LevelSlider 
          value={targetLevel} 
          onChange={handleTargetLevelChange} 
          min={2} 
          max={65} 
        />
      </div>
    </div>
  )
}

export default LevelSection