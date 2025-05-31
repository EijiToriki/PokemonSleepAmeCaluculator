import React from 'react'
import { motion } from 'framer-motion'
import './ExplainCard.css'
import { explainText } from '../data/explainText'

const ExplainCard = ({ activeTab }) => {
    const items = explainText[activeTab]

    return (
        <>
            {activeTab !== 'combined' && (
                <motion.div 
                    className="calculator-card explanation-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <h2 className="explanation-title">補足</h2>
                    {items.map((item, index) => (
                        <div key={index} className="explanation-item">
                            <h3 className="explanation-subtitle">{item.subtitle}</h3>
                            <p className="explanation-text">{item.text}</p>
                        </div>
                    ))}
                </motion.div>
            )}
        </>
    )
}

export default ExplainCard
