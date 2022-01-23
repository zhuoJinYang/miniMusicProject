// pages/music-player/index.js
import {audioContext,playerStore} from '../../../store/index'
const playModeNames = ["order","repeat","random"]
Page({
  data: {
    id:0,

    currentSong:{},
    durationTime:0,
    lyricInfos:[],

    currentTime:0,
    currentLyricIndex:0,
    currentLyricText:"",

    isPlaying:false,

    playModeIndex:0,
    playModeName:"order",

    currentPage:0,
    contentHeight:0,
    sliderValue:0,
    isMusicLyric:true,
    isSliderChanging:false,
    lyricScrollTop:0
  },
  onLoad: function (options) {
    //1.获取传入的id
    const id = options.id
    this.setData({id})
    //2.根据id获取歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()
    //3.计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({contentHeight,isMusicLyric:deviceRadio>=2})
    //4.使用autoContext播放歌曲
  },
  // =========================== 事件处理 ===========================
  handleSwiperChange:function(event){
    const current = event.detail.current
    this.setData({currentPage:current})
  },
  handleSliderChange:function(event){
    // 1.获取slider变化的值
    const value = event.detail.value
    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100
    // 3.设置context播放currentTime位置的音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)
    playerStore.setState("isPlaying",true)
    // 4.记录最新的sliderValue,并且需要将isSliderChanging设置回false
    this.setData({sliderValue:value,isSliderChanging:false})
  },
  handleSliderChanging:function(event){
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({isSliderChanging:true,currentTime})
  },
  handleBackClick:function(){
    wx.navigateBack()
  },
  handleModeBtnClick:function(){
    // 计算最新的playModeIndex
    const playModeIndex = (this.data.playModeIndex + 1) % 3
    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex",playModeIndex)
  },
  handlePlayBtnClick:function(){
    playerStore.dispatch("changeMusicPlayStatus",!this.data.isPlaying)
  },
  handlePrevBtnClick:function(){
    playerStore.dispatch("changeNewMusicAction",false)
  },
  handleNextBtnClick:function(){
    playerStore.dispatch("changeNewMusicAction")
  },
  // =========================== 数据监听 ===========================
  handleCurrentMusicListener:function({currentSong,durationTime,lyricInfos}){
    if(currentSong) this.setData({currentSong})
    if(durationTime) this.setData({durationTime})
    if(lyricInfos) this.setData({lyricInfos})
  },

  setupPlayerStoreListener:function(){
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong","durationTime","lyricInfos"],this.handleCurrentMusicListener)

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime","currentLyricIndex","currentLyricText"],({
      currentTime,currentLyricIndex,currentLyricText
    }) => {
      // 时间变化
      if(currentTime && !this.data.isSliderChanging){
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({currentTime,sliderValue})
      }
      // 歌词变化
      if(currentLyricIndex){
        this.setData({currentLyricIndex,lyricScrollTop:currentLyricIndex * 35})
      }
      if(currentLyricText) this.setData({currentLyricText})
    })

    // 3.监听播放模式相关的数据
    playerStore.onStates(["playModeIndex","isPlaying"],({
      playModeIndex,isPlaying
    }) => {
      if(playModeIndex !== undefined) this.setData({playModeIndex,playModeName:playModeNames[playModeIndex]})
      if(isPlaying !== undefined) this.setData({isPlaying})
    })
  },
  onUnload: function () { 
  }
})