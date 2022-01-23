import httpRequest from './index'
export function getSearchHot() {
  return httpRequest.get("/search/hot")
}

export function getSearchSuggest(keywords){
  return httpRequest.get("/search/suggest",{
    keywords,
    type:"mobile"
  })
}

export function getSearchResult(keywords){
  return httpRequest.get("/search",{
    keywords
  })
}