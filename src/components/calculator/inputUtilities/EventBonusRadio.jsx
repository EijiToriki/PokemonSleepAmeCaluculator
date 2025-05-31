import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import { calculateResults, selectEventBonus, setEventBonus } from '../../../store/calculatorSlice';
import RadioOption from './RadioOption';

const EventBonusRadio = () => {
    const dispatch = useDispatch();
    const eventBonus = useSelector(selectEventBonus);


    return (
        <div className="input-row">
            <label className="input-label">イベント補正</label>
            <div className="radio-group">
                <RadioOption 
                    id="event-none" 
                    name="event" 
                    label="なし" 
                    checked={eventBonus === "none"}
                    onChange={
                        () => {
                        dispatch(setEventBonus("none"))
                        dispatch(calculateResults())
                        }
                    } 
                />
                <RadioOption 
                    id="event-goodsleep" 
                    name="event" 
                    label="グッドスリープデイを含める" 
                    checked={eventBonus === "goodsleep"}
                    onChange={
                        () => {
                        dispatch(setEventBonus("goodsleep"))
                        dispatch(calculateResults())
                        }
                    }
                />
            </div>
        </div>
    )
}

export default EventBonusRadio
