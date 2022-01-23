import { HYEventStore } from 'hy-event-store'
import {getSongDetail,getSongLyric} from "../service/api_player"
import {parseLyric} from "../utils/parse-lyric"
// const audioContext = wx.createInnerAudioContext() //audioContext
const audioContext = wx.getBackgroundAudioManager()
const playerStore = new HYEventStore({
  state:{
    isFirstPlay:true,
    isStopping:false,

    id:0,
    currentSong:{},
    durationTime:0,
    lyricInfos:[],
    
    currentTime:0,
    currentLyricIndex:0,
    currentLyricText:"",

    isPlaying:false,

    playModeIndex:0,  //0:循环播放,1:单曲循环,2:随机播放
    playListSongs:[],
    playListIndex:0,
  },
  actions:{
    playMusicWithSongIdAction(ctx,{id,isRefresh = false}){
      if(ctx.id == id && !isRefresh){
        this.dispatch("changeMusicPlayStatus")
        return
      }
      ctx.id = id
      // 0.修改播放的状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })
      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })
      // 2.播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true
      // 3.监听audioContext一些事件
      if(ctx.isFirstPlay){
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },
    setupAudioContextListenerAction(ctx){
      //监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
      // 监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000
        // 2.根据当前时间修改currentTime
        ctx.currentTime = currentTime
        // 3.根据当前时间去查找播放的歌词
        if(!ctx.lyricInfos.length) return
        let i = 0
        for(; i < ctx.lyricInfos.length; i++){
          const lyricInfo = ctx.lyricInfos[i]
          if(currentTime < lyricInfo.time){
            break
          }
        }
        //设置当前的歌词的索引和内容
        const currentIndex = i - 1
        if(ctx.currentLyricIndex !== currentIndex){
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricIndex = currentIndex
          if(currentLyricInfo === undefined){
            ctx.currentLyricText = ""
          }else{
            ctx.currentLyricText = currentLyricInfo.text
          }
        }
      })
      // 监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch("changeNewMusicAction")
      })
      // 监听音乐暂停/播放/停止
      // 播放状态
      audioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      // 暂停状态
      audioContext.onPause(() => {
        ctx.isPlaying = false
      })
      // 停止状态
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStopping = true
      })
      // 上一首(IOS)
      audioContext.onPrev(() => {
        this.dispatch("changeNewMusicAction",false)
      })
      // 下一首(IOS)
      audioContext.onNext(() => {
        this.dispatch("changeNewMusicAction")
      })
    },
    changeMusicPlayStatus(ctx, isPlaying = true){
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying && ctx.isStopping){
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = ctx.currentSong.name
        audioContext.startTime = ctx.currentTime / 1000
        ctx.isStopping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx,isNext = true){
      // 获取索引
      let index = ctx.playListIndex
      // 根据不同的播放模式，获取下一首歌的索引
      switch(ctx.playModeIndex){
        case 0: //顺序播放
          index = isNext ? index + 1 : index - 1
          if(index < 0) index = index + ctx.playListSongs.length
          index = ( index ) % ctx.playListSongs.length
          break
        case 1: //单曲循环
          break
        case 2: //随机播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          if(index === ctx.playModeIndex) index = index + 1
          break
      }
      // 获取歌曲
      let currentSong = ctx.playListSongs[index]
      if(!currentSong){
        currentSong = ctx.currentSong
      }else{
        // 记录最新的索引
        ctx.playListIndex = index
      }
      // 播放新的歌曲
      this.dispatch("playMusicWithSongIdAction",{ id:currentSong.id , isRefresh : true })
    }
  }
})

export{
  audioContext,
  playerStore
}

