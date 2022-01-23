import httpRequest from "./index"

export function getSongDetail(ids){
  return httpRequest.get("/song/detail",{
    ids
  })
}

export function getSongLyric(id){
  return httpRequest.get("/lyric",{
    id
  })
}