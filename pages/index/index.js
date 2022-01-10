// index.js
// 获取应用实例
const app = getApp()

Page({
  data:{
    message:"你好啊,李银河",
    movies:[
      "大话西游",
      "星际穿越",
      "少年派的奇幻漂流"
    ],
    counter:0
  },
  changeMessage:function(){
    // this.data.message = "Hello World"
    // 类似react this.setState()
    this.setData({message:"Hello World"})
  },
  handleIncrement:function () {
    this.setData({counter:this.data.counter+1})
  },
  handleDecrement:function () { 
    this.setData({counter:this.data.counter-1})
   }
})
