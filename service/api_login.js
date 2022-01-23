import httpRequest, { LoginRequest } from './index'
export function getLoginCode(){
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export function codeToToken(code){
  return LoginRequest.post("/login",{code})
}

export function checkToken(){
  return LoginRequest.post("/auth",{},true)
}

export function postFavorRequest(id){
  return httpRequest.post("/api/favor",{id},true)
}

export function checkSession(){
  return new Promise((resolve) => {
    wx.checkSession({
      success: (res) => {
        resolve(true)
      },
      fail:() => {
        resolve(false)
      }
    })
  })
}

// 获取用户的信息
export function getUserInfo(){
  return new Promise((resolve,reject) => {
    wx.getUserProfile({
      desc: '你好啊，卓锦扬',
      success:(res) => {
        resolve(res)
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}