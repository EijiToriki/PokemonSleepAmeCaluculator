import './InputSection.css'
import ExpTypeRadio from './inputUtilities/ExpTypeRadio';
import PersonalityRadio from './inputUtilities/PersonalityRadio';
import GrowthEnvRadio from './inputUtilities/GrowthEnvRadio';
import SleepScoreField from './inputUtilities/SleepScoreField';
import SleepBounsField from './inputUtilities/SleepBonusField';
import EventBonusRadio from './inputUtilities/EventBonusRadio';
import IncenseRadio from './inputUtilities/IncenseRadio';
import FixedConditionRadio from './inputUtilities/FixedConditionRadio';
import AmeCountBox from './inputUtilities/AmeCountBox';
import SleepDayBox from './inputUtilities/SleepDayBox';
const InputSection = ({ activeTab, fixedCondition, setFixedCondition }) => {

  
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
    case 'combined':
      switch(fixedCondition) {
        case 'amenity':
          return (
            <div className="input-section">
              <FixedConditionRadio fixedCondition={fixedCondition} setFixedCondition={setFixedCondition} />     {/* アメを固定か？睡眠EXPを固定か？ */}
              <h3 className="input-section-title">（共通条件）</h3>
              <ExpTypeRadio />            {/* 経験値タイプ */}
              <PersonalityRadio />        {/* 性格補正 */}
              <h3 className="input-section-title">（アメ条件）</h3>
              <AmeCountBox />
              <GrowthEnvRadio />          {/* 育成環境 */}
              <h3 className="input-section-title">（睡眠EXP条件）</h3>
              <SleepScoreField />         {/* 睡眠スコア */}
              <SleepBounsField />         {/* 睡眠EXPボーナス */}
              <EventBonusRadio />         {/* イベント補正 */}
              <IncenseRadio />            {/* 成長のお香 */}
            </div>
          )
        case 'sleep':
          return (
            <div className="input-section">
              <FixedConditionRadio fixedCondition={fixedCondition} setFixedCondition={setFixedCondition} />     {/* アメを固定か？睡眠EXPを固定か？ */}
              <h3 className="input-section-title">（共通条件）</h3>
              <ExpTypeRadio />            {/* 経験値タイプ */}
              <PersonalityRadio />        {/* 性格補正 */}
              <h3 className="input-section-title">（アメ条件）</h3>
              <GrowthEnvRadio />          {/* 育成環境 */}
              <h3 className="input-section-title">（睡眠EXP条件）</h3>
              <SleepDayBox />             {/* 睡眠日数 */}
              <SleepScoreField />         {/* 睡眠スコア */}
              <SleepBounsField />         {/* 睡眠EXPボーナス */}
              <EventBonusRadio />         {/* イベント補正 */}
              <IncenseRadio />            {/* 成長のお香 */}
            </div>
          )
        default:
          return null;
        }
    default:
      return null;
  }
}


export default InputSection