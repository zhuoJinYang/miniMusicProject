import httpRequest from './index'
export function getBanners(){
  return httpRequest.get("/banner",{
    type:2
  })
}

export function getRankings(idx){
  return httpRequest.get("/top/list",{
    idx
  })
}

// cat -> category 类别
export function getSongMenuList(cat="全部",limit=6,offset=0){
  return httpRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return httpRequest.get("/playlist/detail/dynamic",{
    id
  })
}
