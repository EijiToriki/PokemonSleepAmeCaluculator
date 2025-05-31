import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import { calculateResults, selectSleepExpBonus, setSleepExpBonus } from '../../../store/calculatorSlice';

const SleepBounsField = () => {
  const dispatch = useDispatch();
  const sleepExpBonus = useSelector(selectSleepExpBonus);

  const handleSleepExpBonusChange = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= 5) {
      dispatch(setSleepExpBonus(value))
      dispatch(calculateResults())
    }
  }
  return (
    <div>
      <div className="input-row">
        <label className="input-label">睡眠EXPボーナス</label>
        <div className="input-field-container">
          <input 
            type="number" 
            className="input-field small" 
            value={sleepExpBonus}
            onChange={handleSleepExpBonusChange}
            min="0"
            max="5"
          />
          <span className="input-suffix">体</span>
        </div>
      </div>
    </div>
  )
}

export default SleepBounsField
