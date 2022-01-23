// pages/detail-songs/index.js
import { rankingStore,playerStore } from '../../../store/index'
import { getSongMenuDetail } from '../../../service/api_music'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranking:"",
    songInfo:{},
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({type})
    const ranking = options.ranking
    if(type === "menu"){
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({songInfo:res.playlist})
      })
    }else if(type === "rank"){
      this.setData({ranking})
      // 1.获取数据
      rankingStore.onState(ranking,this.getRankingDataHandler)
    }
  },

  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.songInfo.tracks)
    playerStore.setState("playListIndex",index)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.ranking){
      rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
    }
  },

  getRankingDataHandler:function (res) {
    this.setData({songInfo:res})
  }
})