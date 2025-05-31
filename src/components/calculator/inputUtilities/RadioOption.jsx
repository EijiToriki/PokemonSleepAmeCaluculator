// RadioOption.jsx
import { motion } from 'framer-motion'
import './RadioOption.css'

const RadioOption = ({ id, name, label, checked, onChange }) => (
  <label htmlFor={id} className="radio-option">
    <input
      type="radio"
      id={id}
      name={name}
      className="radio-input"
      checked={checked}
      onChange={onChange}
    />
    <div className="radio-indicator">
      <motion.div
        className="radio-active"
        initial={false}
        animate={{ scale: checked ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
    <span className="radio-label">{label}</span>
  </label>
)

export default RadioOption
