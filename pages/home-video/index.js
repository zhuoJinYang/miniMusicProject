import {getTopMV}  from '../../service/api_video'
Page({
  data: {
    topMVs:[],
    hasMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   * aysnc await
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },
  //封装网络请求的方法
  getTopMVData:async function(offset){
    //判断是否可以请求
    if(!this.data.hasMore && offset !== 0) return
    wx.showNavigationBarLoading()
    
    //真正请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs
    if(offset === 0){
      newData = res.data
    }else{
      newData = newData.concat(res.data)
    }
    this.setData({topMVs:newData})
    this.setData({hasMore:res.hasMore})
    wx.hideNavigationBarLoading()
    if(offset === 0){
      wx.stopPullDownRefresh()
    }
  },
  // 封装事件处理的方法
  handleVideoItemClick:function(event){
    // 获取id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: `/packageDetail/pages/detail-video/index?id=${id}`
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:async function () {
    this.getTopMVData(0)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:async function () {
    this.getTopMVData(this.data.topMVs.length)
  },
  
})