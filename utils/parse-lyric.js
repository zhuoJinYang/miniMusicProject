// 正则表达式：字符串匹配利器

const timePattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export function parseLyric(lyricString){
  const lyricStrings = lyricString.split("\n")
  const lyricInfos = []
  for(const lineString of lyricStrings){
    const timeResult = timePattern.exec(lineString)
    if(!timeResult) continue
    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
    const time = minute + second + millsecond
    // 2.获取歌词文本
    const text = lineString.replace(timePattern,"")
    lyricInfos.push({time,text})
  }
  return lyricInfos
}