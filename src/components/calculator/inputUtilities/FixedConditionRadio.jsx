import React from 'react'
import RadioOption from './RadioOption'

const FixedConditionRadio = ({fixedCondition, setFixedCondition}) => {
    return (
        <div className="input-row">
            <label className="input-label">固定する育成方法</label>
            <div className="radio-group">
                <RadioOption 
                    id="amenity" 
                    name="amenity" 
                    label="アメ" 
                    checked={fixedCondition === "amenity"}
                    onChange={() => {setFixedCondition("amenity")}}
                />
                <RadioOption 
                    id="sleep" 
                    name="sleep" 
                    label="睡眠EXP" 
                    checked={fixedCondition === "sleep"}
                    onChange={() => {setFixedCondition("sleep")}}
                />
            </div>
        </div>
    )
}

export default FixedConditionRadio
