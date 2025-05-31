import './InputSection.css'
import ExpTypeRadio from './inputUtilities/ExpTypeRadio';
import PersonalityRadio from './inputUtilities/PersonalityRadio';
import GrowthEnvRadio from './inputUtilities/GrowthEnvRadio';
import SleepScoreField from './inputUtilities/SleepScoreField';
import SleepBounsField from './inputUtilities/SleepBonusField';
import EventBonusRadio from './inputUtilities/EventBonusRadio';
import IncenseRadio from './inputUtilities/IncenseRadio';

const InputSection = ({ activeTab }) => {

  
  switch(activeTab) {
    case 'amenity':
      return (
        <div className="input-section">
            <ExpTypeRadio />          {/* 経験値タイプ */}
            <GrowthEnvRadio />        {/* 育成環境 */}
            <PersonalityRadio />      {/* 性格補正 */}
        </div>
      )
    case 'sleep':
      return (
        <div className="input-section">
          <ExpTypeRadio />            {/* 経験値タイプ */}
          <SleepScoreField />         {/* 睡眠スコア */}
          <SleepBounsField />         {/* 睡眠EXPボーナス */}
          <PersonalityRadio />        {/* 性格補正 */}
          <EventBonusRadio />         {/* イベント補正 */}
          <IncenseRadio />            {/* 成長のお香 */}
        </div>
      )
      default:
        return null;
  }
}

export default InputSection