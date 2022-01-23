// pages/detail-search/index.js
import { getSearchHot,getSearchSuggest,getSearchResult } from '../../../service/api_search' 
import { playerStore } from '../../../store/index'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords:[],
    suggestSongs:[],
    suggestSongsNodes:[],
    resultSongs:[],
    searchValue:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },

  //网络请求
  getPageData:function(){
    getSearchHot().then(res => {
      this.setData({hotKeywords:res.result.hots})
    })
  },

  // 事件处理
  hadnleSearchChange:function(event){
    // 1.获取输入的数字
    const searchValue = event.detail
    // 2.保留关键字
    this.setData({searchValue})
    this.setData({resultSongs:[]})
    // 3.判断关键字为空字符的处理逻辑
    if(!searchValue.length) {
      this.setData({suggestSongs:[]})
      debounceGetSearchSuggest.cancel()
      return
    }
    // 4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // 获取建议的关键字
      const suggestSongs = res.result.allMatch
      this.setData({suggestSongs})
      if(!suggestSongs) return
      // 转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for(const keyword of suggestKeywords){
        const nodes = stringToNodes(keyword,searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
    })
  },
  handleSearchAction:function(){
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({resultSongs:res.result.songs})
    })
  },
  handleKeywordItemClick:function(event){
    // 1.获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword
    // 2.将关键字设置到searchValue中
    this.setData({searchValue:keyword})
    // 3.发送网络请求
    this.handleSearchAction()
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.resultSongs)
    playerStore.setState("playListIndex",index)
  }
})