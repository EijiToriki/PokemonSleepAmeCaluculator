import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './FormCommon.css'
import RadioOption from './RadioOption';
import { calculateResults, selectGrowthEnvironment, setGrowthEnvironment } from '../../../store/calculatorSlice';

const GrowthEnvRadio = () => {
    const dispatch = useDispatch();
    const growthEnvironment = useSelector(selectGrowthEnvironment);

    return (
        <div className="input-row">
            <label className="input-label">育成環境</label>
            <div className="radio-group">
            <RadioOption 
                id="amenity-normal" 
                name="amenity-env" 
                label="通常育成" 
                checked={growthEnvironment === "normal"}
                onChange={
                () => {
                    dispatch(setGrowthEnvironment("normal"))
                    dispatch(calculateResults())
                }
                }
            />
            <RadioOption 
                id="amenity-mini" 
                name="amenity-env" 
                label="ミニアメブースト1週間含む" 
                checked={growthEnvironment === "mini"}
                onChange={
                () => {
                    dispatch(setGrowthEnvironment("mini"))
                    dispatch(calculateResults())
                }
                }
            />
            <RadioOption 
                id="amenity-full" 
                name="amenity-env" 
                label="アメブースト" 
                checked={growthEnvironment === "full"}
                onChange={
                () => {
                    dispatch(setGrowthEnvironment("full"))
                    dispatch(calculateResults())
                }
                }
            />
            </div>
        </div>
    )
}

export default GrowthEnvRadio
