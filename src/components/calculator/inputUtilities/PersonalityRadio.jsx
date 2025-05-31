import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import RadioOption from './RadioOption';
import { calculateResults, selectPersonalityAdjustment, setPersonalityAdjustment } from '../../../store/calculatorSlice';

const PersonalityRadio = () => {
    const dispatch = useDispatch();
    const personalityAdjustment = useSelector(selectPersonalityAdjustment)

    return (
    <div className="input-row">
        <label className="input-label">性格補正</label>
        <div className="radio-group">
        <RadioOption 
            id="personality-none" 
            name="personality" 
            label="無補正" 
            checked={personalityAdjustment === "none"}
            onChange={() => {
            dispatch(setPersonalityAdjustment("none"))
            dispatch(calculateResults())
            }
        }
        />
        <RadioOption 
            id="personality-up" 
            name="personality" 
            label="EXPアップ補正"
            checked={personalityAdjustment === "expUp"}
            onChange={
            () => {
                dispatch(setPersonalityAdjustment("expUp"))
                dispatch(calculateResults())
            }
            } 
        />
        <RadioOption 
            id="personality-down" 
            name="personality" 
            label="EXPダウン補正" 
            checked={personalityAdjustment === "expDown"}
            onChange={
            () => {
                dispatch(setPersonalityAdjustment("expDown"))
                dispatch(calculateResults())
            }
            } 
        />
        </div>
    </div>
    )
}

export default PersonalityRadio
