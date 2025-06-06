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

  ameNum: 0,
  sleepDays: 0,
  
  // Calculation results
  result: {
    daysRequired: 16,           // 現在レベル1、目標レベル10、その他デフォルト値の必要日数
    amenitiesRequired: 63,      // 現在レベル1、目標レベル10、その他デフォルト値の必要アメ個数
    fixedDaysRequired: 16,       // 現在レベル1、目標レベル10、その他デフォルト値のアメを固定した際の必要日数
    fixedAmenitiesRequired: 63,  // 現在レベル1、目標レベル10、その他デフォルト値の睡眠EXPを固定した際の必要アメ個数
  }
}

// 定数定義
const PERSONALITY_ADJUSTMENT_RATE = {
  "none": 1,
  "expUp": 1.18,
  "expDown": 0.82
};

const AME_BASE_EXP = {
  "none": 25,
  "expUp": 30,
  "expDown": 21
};

const GOOD_SLEEP_CYCLE = 30;
const GOOD_SLEEP_START_DAY = 15;
const MINI_AME_BOOST_LIMIT = 350;

// ヘルパー関数
const calculateTotalExp = (currentLevel, targetLevel, experienceType) => {
  let totalExp = 0;
  for(let i = currentLevel + 1; i <= targetLevel; i++) {
    totalExp += expMaster[i][experienceType];
  }
  return totalExp;
};

const calculateBasicSleepExp = (sleepScore, personalityAdjustment, sleepExpBonus) => {
  return Math.round(
    sleepScore * 
    PERSONALITY_ADJUSTMENT_RATE[personalityAdjustment] * 
    (1 + (0.14 * sleepExpBonus))
  );
};

const calculateGoodSleepDayExp = (basicExp, dayOffset, incenseType) => {
  // グッドスリープデイのみお香を使用する場合
  if (incenseType === "goodsleep") {
    switch(dayOffset) {
      case -1: // 満月の1日前
        return basicExp * 4;
      case 0:  // 満月当日
        return basicExp * 6;
      case 1:  // 満月の1日後
        return basicExp * 4;
      default:
        return basicExp;
    }
  }
  
  // 毎日お香を使用する場合
  const incenseMultiplier = incenseType === "daily" ? 2 : 1;
  switch(dayOffset) {
    case -1: // 満月の1日前
      return basicExp * 2 * incenseMultiplier;
    case 0:  // 満月当日
      return basicExp * 3 * incenseMultiplier;
    case 1:  // 満月の1日後
      return basicExp * 2 * incenseMultiplier;
    default:
      return basicExp * incenseMultiplier;
  }
};

const calculateSleepDaysWithGoodSleep = (targetExp, basicExp, incenseType = "none") => {
  let days = 0;
  let totalExp = 0;
  let goodSleepDay = GOOD_SLEEP_START_DAY;

  while(totalExp <= targetExp) {
    days++;
    const dayOffset = days === goodSleepDay - 1 ? -1 :
                     days === goodSleepDay ? 0 :
                     days === goodSleepDay + 1 ? 1 : null;
                     
    if (dayOffset === 1) {
      goodSleepDay += GOOD_SLEEP_CYCLE;
    }

    totalExp += calculateGoodSleepDayExp(basicExp, dayOffset, incenseType);
  }

  return days;
};

const calculateAmeCount = (targetExp, personalityAdjustment, growthEnvironment) => {
  let ameExp = AME_BASE_EXP[personalityAdjustment];
  
  if (growthEnvironment === "mini" || growthEnvironment === "full") {
    ameExp *= 2;
  }

  let ameCnt = Math.ceil(targetExp / ameExp);

  // ミニアメブースト期間の補正
  if (growthEnvironment === "mini" && ameCnt > MINI_AME_BOOST_LIMIT) {
    const boostedExp = ameExp * MINI_AME_BOOST_LIMIT;
    const remainingExp = targetExp - boostedExp;
    const remainingAmeCnt = Math.ceil(remainingExp / (ameExp / 2));
    ameCnt = MINI_AME_BOOST_LIMIT + remainingAmeCnt;
  }

  return ameCnt;
};

const calculateTotalSleepExpWithGoodSleep = (sleepDays, basicExp, incenseType = "none") => {
  let totalExp = 0;
  let goodSleepDay = GOOD_SLEEP_START_DAY;

  for(let day = 1; day <= sleepDays; day++) {
    const dayOffset = day === goodSleepDay - 1 ? -1 :
                     day === goodSleepDay ? 0 :
                     day === goodSleepDay + 1 ? 1 : null;

    if (dayOffset === 1) {
      goodSleepDay += GOOD_SLEEP_CYCLE;
    }

    totalExp += calculateGoodSleepDayExp(basicExp, dayOffset, incenseType);
  }

  return totalExp;
};

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

    // Set ame number
    setAmeNum: (state, action) => {
      state.ameNum = action.payload
    },

    // Set sleep days
    setSleepDays: (state, action) => {
      state.sleepDays = action.payload
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
      totalExp = 0;
      for(let i=state.currentLevel+1; i<=state.targetLevel; i++){
        totalExp += expMaster[i][state.experienceType];
      }

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

      // アメを固定した際の睡眠日数の計算ロジック
      //// totalExpを再度計算する（上のロジックで、totalExpの値が期待値と異なる可能性があるため）
      totalExp = 0;
      for(let i=state.currentLevel+1; i<=state.targetLevel; i++){
        totalExp += expMaster[i][state.experienceType];
      }

      ameExp = 25;
      if(state.personalityAdjustment == "expUp"){
        ameExp = 30
      }else if(state.personalityAdjustment == "expDown"){
        ameExp = 21
      }
      //// アメの個数と育成環境からアメによる獲得経験値を計算
      let totalAmeExp = 0;
      if(state.growthEnvironment === "normal"){
        totalAmeExp = ameExp * state.ameNum;
      }else if(state.growthEnvironment === "mini"){
        if(state.ameNum <= 350){
          totalAmeExp = ameExp * state.ameNum * 2;
        }else{
          totalAmeExp = ameExp * 350 * 2 + ameExp * (state.ameNum - 350);
        }
      }else if(state.growthEnvironment === "full"){
        totalAmeExp = ameExp * state.ameNum * 2;
      }
      //// 睡眠EXPで目標レベルまで達するための必要経験値を計算
      let fixedSleepExp = totalExp - totalAmeExp;
      //// 睡眠EXPで目標レベルまで達するための必要な日数を計算
      //// ロジックは上記の睡眠EXP育成の計算ロジックと同じ

      sleepExp = 0
      personalityAdjustmentRate = {
        "none": 1,
        "expUp": 1.18,
        "expDown": 0.82
      }
      let fixedSleepDays = 0
      //// イベント補正　なし、成長のお香　なし
      if(state.eventBonus === "none" && state.incense === "none"){
        sleepExp = Math.round(
          state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
        )
        fixedSleepDays = Math.floor(fixedSleepExp / sleepExp);
        amari = fixedSleepExp % sleepExp
        if(amari !== 0){
          fixedSleepDays += 1
        }
      //// イベント補正　なし、成長のお香　毎日
      }else if(state.eventBonus === "none" && state.incense === "daily"){
        sleepExp = Math.round(
          2 * state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
        )
        fixedSleepDays = Math.floor(fixedSleepExp / sleepExp);
        amari = fixedSleepExp % sleepExp
        if(amari !== 0){
          fixedSleepDays += 1
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　なし
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "none"){
        fixedSleepDays=0;
        sleepExp = 0
        let goodSleepDay = 15;
        while(sleepExp <= fixedSleepExp){
          fixedSleepDays += 1
          let basicExp = Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(fixedSleepDays === goodSleepDay-1){       // 満月の1日前
            sleepExp += 2 * basicExp; 
          }else if(fixedSleepDays === goodSleepDay){   // 満月当日
            sleepExp += 3 * basicExp;
          }else if(fixedSleepDays === goodSleepDay+1){ // 満月の1日後
            sleepExp += 2 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            sleepExp += basicExp;
          }
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　毎日
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "daily"){
        fixedSleepDays=0;
        sleepExp = 0
        let goodSleepDay = 15;
        while(sleepExp <= fixedSleepExp){
          fixedSleepDays += 1
          let basicExp = 2 * Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(fixedSleepDays === goodSleepDay-1){       // 満月の1日前
            sleepExp += 2 * basicExp; 
          }else if(fixedSleepDays === goodSleepDay){   // 満月当日
            sleepExp += 3 * basicExp;
          }else if(fixedSleepDays === goodSleepDay+1){ // 満月の1日後
            sleepExp += 2 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            sleepExp += basicExp;
          }
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　グッドスリープデイの日のみ
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "goodsleep"){
        fixedSleepDays=0;
        sleepExp = 0
        let goodSleepDay = 15;
        while(sleepExp <= fixedSleepExp){
          fixedSleepDays += 1
          let basicExp = Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(fixedSleepDays === goodSleepDay-1){       // 満月の1日前
            sleepExp += 4 * basicExp; 
          }else if(fixedSleepDays === goodSleepDay){   // 満月当日
            sleepExp += 6 * basicExp;
          }else if(fixedSleepDays === goodSleepDay+1){ // 満月の1日後
            sleepExp += 4 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            sleepExp += basicExp;
          }
        }
      }


      // 睡眠EXPを固定した際のアメの個数の計算ロジック
      //// totalExpを再度計算する（上のロジックで、totalExpの値が期待値と異なる可能性があるため）
      totalExp = 0;
      for(let i=state.currentLevel+1; i<=state.targetLevel; i++){
        totalExp += expMaster[i][state.experienceType];
      }
      //// 睡眠日数とその他睡眠に関するパラメータから睡眠による獲得経験値を計算
      let totalSleepExp = 0
      personalityAdjustmentRate = {
        "none": 1,
        "expUp": 1.18,
        "expDown": 0.82
      }
      
      //// イベント補正　なし、成長のお香　なし
      if(state.eventBonus === "none" && state.incense === "none"){
        totalSleepExp = state.sleepDays * Math.round(
          state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
        )
      //// イベント補正　なし、成長のお香　毎日
      }else if(state.eventBonus === "none" && state.incense === "daily"){
        totalSleepExp = state.sleepDays * Math.round(
          2 * state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
        )
      //// イベント補正　グッドスリープデイを含める、成長のお香　なし
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "none"){
        let goodSleepDay = 15;
        for(let day=1; day<=state.sleepDays; day++){
          let basicExp = Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(day === goodSleepDay-1){       // 満月の1日前
            totalSleepExp += 2 * basicExp; 
          }else if(day === goodSleepDay){   // 満月当日
            totalSleepExp += 3 * basicExp;
          }else if(day === goodSleepDay+1){ // 満月の1日後
            totalSleepExp += 2 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            totalSleepExp += basicExp;
          }
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　毎日
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "daily"){
        let goodSleepDay = 15;
        for(let day=1; day<=state.sleepDays; day++){
          let basicExp = Math.round(
            2 * state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(day === goodSleepDay-1){       // 満月の1日前
            totalSleepExp += 2 * basicExp; 
          }else if(day === goodSleepDay){   // 満月当日
            totalSleepExp += 3 * basicExp;
          }else if(day === goodSleepDay+1){ // 満月の1日後
            totalSleepExp += 2 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            totalSleepExp += basicExp;
          }
        }
      //// イベント補正　グッドスリープデイを含める、成長のお香　グッドスリープデイの日のみ
      //// グッドスリープデイは14日、16日を満月前後、15日を満月の日として扱う
      }else if(state.eventBonus === "goodsleep" && state.incense === "goodsleep"){
        let goodSleepDay = 15;
        for(let day=1; day<=state.sleepDays; day++){
          let basicExp = Math.round(
            state.sleepScore * personalityAdjustmentRate[state.personalityAdjustment] * (1 + (0.14 * state.sleepExpBonus))
          )
          if(day === goodSleepDay-1){       // 満月の1日前
            totalSleepExp += 4 * basicExp; 
          }else if(day === goodSleepDay){   // 満月当日
            totalSleepExp += 6 * basicExp;
          }else if(day === goodSleepDay+1){ // 満月の1日後
            totalSleepExp += 4 * basicExp;
            goodSleepDay += 30    // グッドスリープデイを30日後に
          }else{
            totalSleepExp += basicExp;
          }
        }
      }

      //// アメで目標レベルまで達するための必要経験値を計算
      let fixedAmeExp = totalExp - totalSleepExp;

      //// アマで目標レベルまで達するための必要なアメの個数を計算
      //// ロジックは上記のアメ育成の計算ロジックと同じ
      //// アメ1個あたりの経験値量
      ameExp = 25;
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
      let fixedAmeCnt = Math.floor(fixedAmeExp / ameExp);
      amari = fixedAmeExp % ameExp;
      if(amari !== 0){
        fixedAmeCnt += 1;
      }

      //// 育成環境でミニアメブーストを選択しており、
      //// アメの必要個数が351個以上（ミニアメブースト期間は1週間で使えるアメが350個）の場合
      //// 超過分を補正する
      if(state.growthEnvironment === "mini" && fixedAmeCnt > 350){
        fixedAmeExp = fixedAmeExp - (ameExp * 350)
        fixedAmeCnt = Math.floor(fixedAmeExp / (ameExp / 2))
        if(amari !== 0){
          fixedAmeCnt += 1;
        }
        fixedAmeCnt += 350;
      }

      state.result = {
        daysRequired: sleepDays,
        amenitiesRequired: ameCnt,
        fixedDaysRequired: fixedSleepDays > 0 ? fixedSleepDays : 0,
        fixedAmenitiesRequired: fixedAmeCnt > 0 ? fixedAmeCnt : 0,
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
  setAmeNum,
  setSleepDays,
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
export const selectAmeNum = state => state.calculator.ameNum
export const selectSleepDays = state => state.calculator.sleepDays
export const selectResult = state => state.calculator.result

// Export reducer
export default calculatorSlice.reducer