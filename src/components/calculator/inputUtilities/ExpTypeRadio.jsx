import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import RadioOption from './RadioOption';
import { calculateResults, selectExperienceType, setExperienceType } from '../../../store/calculatorSlice';

const ExpTypeRadio = () => {
    const dispatch = useDispatch();
    const expType = useSelector(selectExperienceType)

    return (
        <div className="input-row">
            <label className="input-label">経験値タイプ</label>
            <div className="radio-group">
            <RadioOption 
                id="exp-600" 
                name="exp-type" 
                label="600" 
                checked={expType === "exp-600"}
                onChange={
                    () => {
                        dispatch(setExperienceType("exp-600"))
                        dispatch(calculateResults())
                    }}
            />
            <RadioOption 
                id="exp-900" 
                name="exp-type" 
                label="900" 
                checked={expType === "exp-900"}
                onChange={
                    () => {
                        dispatch(setExperienceType("exp-900"))
                        dispatch(calculateResults())
                    }
                }
            />
            <RadioOption 
                id="exp-1080" 
                name="exp-type" 
                label="1080" 
                checked={expType === "exp-1080"}
                onChange={
                    () => {
                        dispatch(setExperienceType("exp-1080"))
                        dispatch(calculateResults())
                    }
                }
            />
            <RadioOption 
                id="exp-1320" 
                name="exp-type" 
                label="1320" 
                checked={expType === "exp-1320"}
                onChange={
                    () => {
                        dispatch(setExperienceType("exp-1320"))
                        dispatch(calculateResults())
                    }
                }
            />
            </div>
        </div>
    )
}

export default ExpTypeRadio
