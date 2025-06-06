import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import { calculateResults, selectAmeNum, setAmeNum } from '../../../store/calculatorSlice';

const AmeCountBox = () => {
    const dispatch = useDispatch();
    const sleepScore = useSelector(selectAmeNum);

    const handleAmeChange = (e) => {
        const value = parseInt(e.target.value)
        if (!isNaN(value) && value >= 0) {
            dispatch(setAmeNum(value))
            dispatch(calculateResults())
        }
    }

    return (
        <div className="input-row">
            <label className="input-label">アメ個数</label>
            <div className="input-field-container">
            <input 
                type="number" 
                className="input-field small" 
                value={sleepScore} 
                onChange={handleAmeChange}
                min="0"
            />
            <span className="input-suffix">個</span>
            </div>
        </div>
    )
    }

export default AmeCountBox
