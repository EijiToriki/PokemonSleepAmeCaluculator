import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { calculateResults, selectEventBonus, selectIncense, setIncense } from '../../../store/calculatorSlice';
import RadioOption from './RadioOption';

const IncenseRadio = () => {
    const dispatch = useDispatch();
    const incense = useSelector(selectIncense);
    const eventBonus = useSelector(selectEventBonus);

    return (
        <div className="input-row">
            <label className="input-label">成長のお香</label>
            <div className="radio-group">
                <RadioOption 
                    id="incense-none" 
                    name="incense" 
                    label="なし" 
                    checked={incense === "none"}
                    onChange={() => {
                        dispatch(setIncense("none"))
                        dispatch(calculateResults())
                    }}
                />
                <RadioOption 
                    id="incense-daily" 
                    name="incense" 
                    label="毎日" 
                    checked={incense === "daily"}
                    onChange={() => {
                        dispatch(setIncense("daily"))
                        dispatch(calculateResults())
                    }}
                />
                {eventBonus !== "none" && (
                    <RadioOption 
                        id="incense-goodsleep" 
                        name="incense" 
                        label="グッドスリープデイのみあり" 
                        checked={incense === "goodsleep"}
                        onChange={() => {
                            dispatch(setIncense("goodsleep"))
                            dispatch(calculateResults())
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default IncenseRadio
