// pages/home-profile/index.js
import {getUserInfo} from '../../service/api_login'
Page({
  data: {
    userInfo:{}
  },
  handleGetUser: async function(){
    const userInfo = await getUserInfo()
  }
})
