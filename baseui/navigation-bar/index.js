// components/navigation-bar/index.js
const globalData = getApp().globalData
Component({
  options:{
    multipleSlots:true
  },
  properties: {
    title:{
      type:String,
      value:"默认标题"
    }
  },
  data: {
    statusBarHeight:globalData.statusBarHeight,
    navBarHeight:globalData.navBarHeight
  },
  lifetimes:{

  },
  methods: {
    handleLeftClick:function(){
      this.triggerEvent('click')
    }
  }
})
