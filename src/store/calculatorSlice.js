import { createSlice } from '@reduxjs/toolkit'
import { expMaster } from '../data/expMaster'


// Initial state for the calculator
const initialState = {
  // Current level parameters
  currentLevel: 1,
  targetLevel: 10,
  
  // Pokemon details
  experienceType: 'exp-600', // exp-600, exp-900, exp-1080, exp-1320
  
  // Sleep mode specific
  sleepScore: 100,
  sleepExpBonus: 0,
  eventBonus: 'none', // 'none', 'goodsleep'
  incense: 'none', // 'none', 'daily', 'goodsleep'
  
  // Amenity mode specific
  growthEnvironment: 'normal', // 'normal', 'mini', 'full'
  
  // Common parameters
  personalityAdjustment: 'none', // 'none', 'expUp', 'expDown'
  
  // Calculation results
  result: {
    daysRequired: 16,           // 現在レベル1、目標レベル10、その他デフォルト値の必要日数
    amenitiesRequired: 63,      // 現在レベル1、目標レベル10、その他デフォルト値の必要アメ個数
  }
}

export const calculatorSlice = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    // Set the current level
    setCurrentLevel: (state, action) => {
      state.currentLevel = action.payload
    },
    
    // Set the target level
    setTargetLevel: (state, action) => {
      state.targetLevel = action.payload
    },
    
    // Set Experience Type
    setExperienceType: (state, action) => {
      state.experienceType = action.payload
    },
    
    // Set sleep score
    setSleepScore: (state, action) => {
      state.sleepScore = action.payload
    },
    
    // Set sleep exp bonus
    setSleepExpBonus: (state, action) => {
      state.sleepExpBonus = action.payload
    },
    
    // Set event bonus
    setEventBonus: (state, action) => {
      state.eventBonus = action.payload
    },
    
    // Set incense
    setIncense: (state, action) => {
      state.incense = action.payload
    },
    
    // Set growth environment
    setGrowthEnvironment: (state, action) => {
      state.growthEnvironment = action.payload
    },
    
    // Set personality adjustment
    setPersonalityAdjustment: (state, action) => {
      state.personalityAdjustment = action.payload
    },
    
    // Calculate results based on current state
    calculateResults: (state) => {
      // 目標レベルへの総経験値量
      let totalExp = 0;
      for(let i=state.currentLevel+1; i<=state.targetLevel; i++){
        totalExp += expMaster[i][state.experienceType];
      }

      // アメ育成の計算ロジック
      //// アメ1個あたりの経験値量
      let ameExp = 25;
      if(state.personalityAdjustment == "expUp"){
        ameExp = 30
      }else if(state.personalityAdjustment == "expDown"){
        ameExp = 21
      }

      //// 育成環境の考慮
      ////// ミニアメブースト or アメブーストの場合、アメの経験値量を2倍にする
      if(state.growthEnvironment === "mini" || state.growthEnvironment === "full"){
        ameExp *= 2;
      }

      //// 目標レベルへ必要なアメの個数
      let ameCnt = Math.floor(totalExp / ameExp);
      let amari = totalExp % ameExp;
      if(amari !== 0){
        ameCnt += 1;
      }

      //// 育成環境でミニアメブーストを選択しており、
      //// アメの必要個数が351個以上（ミニアメブースト期間は1週間で使えるアメが350個）の場合
      //// 超過分を補正する
      if(state.growthEnvironment === "mini" && ameCnt > 350){
        totalExp = totalExp - (ameExp * 350)
        ameCnt = Math.floor(totalExp / (ameExp / 2))
        if(amari !== 0){
          ameCnt += 1;
        }
        ameCnt += 350;
      }


      // 睡眠EXP育成の計算ロジック
      let sleepExp = 0
      let personalityAdjustmentRate = {
        "none": 1,
        "expUp": 1.18,
        "expDown": 0.82
      }
      let sleepDays = 0
      //// イベント補正　なし、成長のお香　なし
      if(state.eventBonus === "none" && state.incense === "none"){
        sleepExp = Math.round(
          state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
        )
        sleepDays = Math.floor(totalExp / sleepExp);
        amari = totalExp % sleepExp
        if(amari !== 0){
          sleepDays += 1
        }
      //// イベント補正　なし、成長のお香　毎日
      }else if(state.eventBonus === "none" && state.incense === "daily"){
        sleepExp = Math.round(
          2 * state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
        )
        sleepDays = Math.floor(totalExp / sleepExp);
        amari = totalExp % sleepExp
        if(amari !== 0){
          sleepDays += 1
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　なし
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "none"){
        sleepDays=0;
        sleepExp = 0
        let goodSleepDay = 15;
        while(sleepExp <= totalExp){
          sleepDays += 1
          let basicExp = Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(sleepDays === goodSleepDay-1){       // 満月の1日前
            sleepExp += 2 * basicExp; 
          }else if(sleepDays === goodSleepDay){   // 満月当日
            sleepExp += 3 * basicExp;
          }else if(sleepDays === goodSleepDay+1){ // 満月の1日後
            sleepExp += 2 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            sleepExp += basicExp;
          }
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　毎日
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "daily"){
        sleepDays=0;
        sleepExp = 0
        let goodSleepDay = 15;
        while(sleepExp <= totalExp){
          sleepDays += 1
          let basicExp = 2 * Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(sleepDays === goodSleepDay-1){       // 満月の1日前
            sleepExp += 2 * basicExp; 
          }else if(sleepDays === goodSleepDay){   // 満月当日
            sleepExp += 3 * basicExp;
          }else if(sleepDays === goodSleepDay+1){ // 満月の1日後
            sleepExp += 2 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            sleepExp += basicExp;
          }
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　グッドスリープデイの日のみ
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "goodsleep"){
        sleepDays=0;
        sleepExp = 0
        let goodSleepDay = 15;
        while(sleepExp <= totalExp){
          sleepDays += 1
          let basicExp = Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(sleepDays === goodSleepDay-1){       // 満月の1日前
            sleepExp += 4 * basicExp; 
          }else if(sleepDays === goodSleepDay){   // 満月当日
            sleepExp += 6 * basicExp;
          }else if(sleepDays === goodSleepDay+1){ // 満月の1日後
            sleepExp += 4 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            sleepExp += basicExp;
          }
        }
      }
      // Example calculation (you'll replace this with your actual logic)
      state.result = {
        daysRequired: sleepDays, 
        amenitiesRequired: ameCnt,
      }
    }
  }
})

// Export actions
export const {
  setCurrentLevel,
  setTargetLevel,
  setExperienceType,
  setSleepScore,
  setSleepExpBonus,
  setEventBonus,
  setIncense,
  setGrowthEnvironment,
  setPersonalityAdjustment,
  calculateResults
} = calculatorSlice.actions

// Export selectors
export const selectCurrentLevel = state => state.calculator.currentLevel
export const selectTargetLevel = state => state.calculator.targetLevel
export const selectExperienceType = state => state.calculator.experienceType
export const selectSleepScore = state => state.calculator.sleepScore
export const selectSleepExpBonus = state => state.calculator.sleepExpBonus
export const selectGrowthEnvironment = state => state.calculator.growthEnvironment
export const selectPersonalityAdjustment = state => state.calculator.personalityAdjustment
export const selectEventBonus = state => state.calculator.eventBonus
export const selectIncense = state => state.calculator.incense
export const selectResult = state => state.calculator.result

// Export reducer
export default calculatorSlice.reducer