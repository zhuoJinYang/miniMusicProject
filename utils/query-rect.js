export default function(selector){
  //获取图片的高度(获取组件的高度)
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec(resolve)
    // query.exec(res => {
    //   resolve(res)
    // })
  })
}