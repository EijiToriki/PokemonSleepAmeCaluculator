import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import { calculateResults, selectSleepScore, setSleepScore } from '../../../store/calculatorSlice';


const SleepScoreField = () => {
    const dispatch = useDispatch();
    const sleepScore = useSelector(selectSleepScore);

    const handleSleepScoreChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value >= 0 && value <= 100) {
            dispatch(setSleepScore(value))
            dispatch(calculateResults())
        }
    }

    return (
        <div className="input-row">
            <label className="input-label">睡眠スコア</label>
            <div className="input-field-container">
            <input 
                type="number" 
                className="input-field small" 
                value={sleepScore} 
                onChange={handleSleepScoreChange}
                min="0"
                max="100"
            />
            </div>
        </div>
    )
}

export default SleepScoreField
