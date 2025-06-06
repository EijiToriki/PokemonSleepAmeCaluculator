import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { calculateResults, selectSleepDays, setSleepDays } from '../../../store/calculatorSlice';

const SleepDayBox = () => {
    const dispatch = useDispatch();
    const sleepDays = useSelector(selectSleepDays);

    const handleSleepDayChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value >= 0) {
            dispatch(setSleepDays(value))
            dispatch(calculateResults())
        }
    }
    return (
        <div>
            <div className="input-row">
                <label className="input-label">睡眠日数</label>
                <div className="input-field-container">
                <input 
                    type="number" 
                    className="input-field small" 
                    value={sleepDays}
                    onChange={handleSleepDayChange}
                    min="0"
                />
                <span className="input-suffix">日</span>
                </div>
            </div>
        </div>
    )
}

export default SleepDayBox
