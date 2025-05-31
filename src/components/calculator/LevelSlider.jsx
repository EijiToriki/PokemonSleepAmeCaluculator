import { Slider, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import './LevelSlider.css';

const LevelSlider = ({ value, onChange, min, max }) => {
  const handleSliderChange = (_, newValue) => {
    onChange(Math.max(min, Math.min(max, newValue)));
  };
  
  const handleInputChange = (e) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };
  
  const decrementLevel = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };
  
  const incrementLevel = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };
  
  return (
    <div className="level-slider-container">
      <button 
        className="level-button" 
        onClick={decrementLevel}
        disabled={value <= min}
      >
        -
      </button>
      
      <div className="slider-wrapper">
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={1}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: 'var(--accent-light)',
              '&:hover, &.Mui-active': {
                backgroundColor: 'var(--accent)',
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: 'var(--accent-light)',
            },
            '& .MuiSlider-rail': {
              backgroundColor: 'var(--gray-medium)',
            },
          }}
        />
      </div>
      
      <button 
        className="level-button" 
        onClick={incrementLevel}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default LevelSlider;