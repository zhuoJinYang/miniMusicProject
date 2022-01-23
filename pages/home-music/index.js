// pages/home-music/index.js
import {rankingStore,rankingMap, playerStore} from '../../store/index'

import {getBanners,getSongMenuList} from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect,1000,{trailing:true})

Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    swiperHeight:0,
    recommendSongs:[],
    hotSongMenu:[],
    recommendSongMenu:[],
    rankings:{ 0:{},2:{},3:{} },
    currentSong:{},
    isPlaying:false,
    playAnimState:"paused"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取页面数据
    this.getPageData()
    //发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")
    //从store获取共享的数据
    this.setupPlayerStoreListener()
    
  },

  //网络请求
  getPageData:function(){
    getBanners().then(res => {
      //  setData是同步的还是异步的
      //  setData设置data数据,是同步的
      //  通过最新的数据对wxml进行渲染,是异步的
      this.setData({banners:res.banners})
      //  react -> setState是异步
    })
    getSongMenuList().then(res => {
      this.setData({hotSongMenu:res.playlists})
    })
    getSongMenuList("华语").then(res => {
      this.setData({recommendSongMenu:res.playlists})
    })
  },
  //事件处理
  handleSearchClick:function(){
    wx.navigateTo({
      url: '/packageDetail/pages/detail-search/index',
    })
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.recommendSongs)
    playerStore.setState("playListIndex",index)
  },
  handlePlayBtnClick:function(event){
    playerStore.dispatch("changeMusicPlayStatus",!this.data.isPlaying)
    // Propagation 繁殖
    // event.stopPropagation()
  },
  handlePlayBarClick:function(){
    wx.navigateTo({
      url: '/packageDetail/pages/music-player/index?id='+this.data.currentSong.id,
    })
  },
  //处理图片和swiper高度
  handleSwiperImageLoaded:function(){
    throttleQueryRect('.swiper-image').then(res => {
      const rect = res[0]
      this.setData({swiperHeight:rect.height})
    })
  },
  handleMoreClick:function(){
    this.navigateToDetailSongPage("hotRanking")
  },
  handleRankingItemClick:function(event){
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongPage(rankingName)
  },
  navigateToDetailSongPage:function (rankingName) {
    wx.navigateTo({
      url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  //卸载页面
  onUnload: function () {
    // rankingStore.offState("newRanking",this.getNewRankingHandler)
  },
  setupPlayerStoreListener:function(){
    // 排行榜
    rankingStore.onState("hotRanking",(res) => {
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6)
      this.setData({recommendSongs})
    })
    rankingStore.onState("newRanking",this.getRankingHandler(0))
    rankingStore.onState("originRanking",this.getRankingHandler(2))
    rankingStore.onState("upRanking",this.getRankingHandler(3))
    // 播放器监听
    playerStore.onStates(["currentSong","isPlaying"],({currentSong,isPlaying}) => {
      if(currentSong) this.setData({currentSong})
      if(isPlaying !== undefined) this.setData({
        isPlaying,
        playAnimState:isPlaying ? "running":"paused"
      })
    })
  },
  getRankingHandler:function(idx,res){
    return (res) => {
      if(Object.keys(res).length === 0) return
      const name = res.name
      const coverImage = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0,3)
      const rankingObj = {name,coverImage,songList,playCount}
      const newRankings = {...this.data.rankings,[idx]:rankingObj}
      this.setData({
        rankings:newRankings
      })
    }
  }
})