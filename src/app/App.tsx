import React from 'react'
import './App.css'
import LiAudio from '../components/liAudio/LiAudio'
import Playlist from '../components/playlist/Playlist'
import Tracker from '../components/tracker/Tracker'
import PlaylistApi from '../api/PlaylistApi'
import TimeFormatter from '../lib/formatter/timeFormatter'

type P = {}

type S = {
  title: string // Название аудио
  time: string // Текущее время аудио
  progress: number // Прогресс аудио от 0 до 1
  hintAudio: string // Текст хинтера(вплывающая подсказка) при наведение на трекер аудио
  isPaused: boolean // Состояние аудио
  volume: number // Громкость аудио
  hintVolume: string // Текст хинтера(вплывающая подсказка) при наведение на громкость
  mix: boolean // Флаг перемешки песен
  repeat: boolean // Флаг повторения аудио
  showPlaylist: boolean // Флаг показа плейлиста
  playlist: any[] // Плейлист
}

class App extends React.Component<P, S> {
  private playlistApi = new PlaylistApi()
  private audio = new Audio() // Объект для работы с аудио
  private favicon: any
  private index = 0 // Текущий индекс аудио
  private history: number[] = [] // Сохранение предыдущих проигранных аудио

  constructor(props: P) {
    super(props)
    this.state = {
      title: 'Название аудио',
      time: '0:00',
      progress: 0,
      hintAudio: '0:00',
      isPaused: true,
      volume: parseFloat(localStorage.getItem('volume') as string) || 0.8,
      hintVolume: '80%',
      mix: localStorage.getItem('mix') === 'true',
      repeat: localStorage.getItem('repeat') === 'true',
      showPlaylist: localStorage.getItem('showPlaylist') === 'true',
      playlist: [],
    }
    this.audio.volume = this.state.volume
    this.favicon = document.getElementById('favicon')
  }

  componentDidMount() {
    // Инициализировать плейлист
    this.playlistApi.getAll().then(playlist => {
      this.setState({
        playlist,
      }, () => {
        this.initAudio(0)
      })
    })

    // Инициализировать события
    this.audio.addEventListener('loadedmetadata', this.handleLoaded)
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.addEventListener('ended', this.handleEnded)
    this.audio.addEventListener('play', this.handleTogglePause)
    this.audio.addEventListener('pause', this.handleTogglePause)
  }

  componentWillUnmount() {
    this.audio.removeEventListener('loadedmetadata', this.handleLoaded)
    this.audio.removeEventListener('timeupdate', this.handleTimeUpdate)
    this.audio.removeEventListener('ended', this.handleEnded)
    this.audio.removeEventListener('play', this.handleTogglePause)
    this.audio.removeEventListener('pause', this.handleTogglePause)
    this.audio.src = ''
  }

  /**
   * Инициализации аудио из плейлист
   *
   * @param index индекс нужного аудио
   */
  initAudio = (index: number) => {
    let oldIndex = this.index
    this.index = index
    this.setState((state) => {
      state.playlist[oldIndex].active = false
      state.playlist[index].active = true
      document.title = state.playlist[index].title
      return {
        playlist: state.playlist,
        title: state.playlist[index].title,
        progress: 0,
      }
    })
    this.audio.src = this.state.playlist[index].url
  }

  /**
   * Событие загрузки аудио
   */
  handleLoaded = () => {
  }

  /**
   * Событие обновление времени
   */
  handleTimeUpdate = () => {
    if (isNaN(this.audio.duration)) {
      return
    }
    this.setState({
      time: TimeFormatter.secondToTime(this.audio.currentTime),
      progress: this.audio.currentTime / this.audio.duration,
    })
  }

  /**
   * Событие завершение аудио
   */
  handleEnded = () => {
    if (this.state.repeat) {
      this.audio.currentTime = 0
      this.audio.play()
    } else {
      this.handleNext()
    }
  }

  /**
   * Вызов события переключение режима паузы
   */
  initTogglePause = () => {
    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  /**
   * Событие переключения режима паузы
   */
  handleTogglePause = () => {
    if (this.audio.paused) {
      this.favicon.href = '/faviconPlay.ico'
    } else {
      this.favicon.href = '/faviconPause.ico'
    }
    this.setState({
      isPaused: this.audio.paused,
    })
  }

  /**
   * Играть предыдущую песню
   */
  handlePrev = () => {
    let oldIndex = this.history.pop()
    let index = oldIndex === undefined ? this.index - 1 : oldIndex
    if (index < 0) {
      index = this.state.playlist.length - 1
    }
    this.initAudio(index)
    this.audio.play()
  }

  /**
   * Играть следующую песню
   */
  handleNext = () => {
    this.history.push(this.index)
    if (this.state.mix) {
      let index
      do {
        index = Math.floor(Math.random() * this.state.playlist.length)
      } while (index === this.index)
      this.initAudio(index)
    } else {
      if (this.index + 1 === this.state.playlist.length) {
        this.initAudio(0)
      } else {
        this.initAudio(this.index + 1)
      }
    }
    this.audio.play()
  }

  /**
   * Клик по аудио из плейлиста
   *
   * @param index индекс кликнутой аудио
   */
  handleChangeSong = (index: number) => {
    this.history = []
    this.initAudio(index)
    this.audio.play()
  }

  /**
   * Переключение функции перемешки песен
   */
  handleMix = () => {
    this.setState((state) => {
      localStorage.setItem('mix', !state.mix + '')
      if (state.mix) {
        this.history = []
      }
      return {
        mix: !state.mix,
      }
    })
  }

  /**
   * Переключение режима повтора
   */
  handleRepeat = () => {
    this.setState((state) => {
      localStorage.setItem('repeat', !state.repeat + '')
      return {
        repeat: !state.repeat,
      }
    })
  }

  /**
   * Переключение видимости плейлиста
   */
  handlePlaylist = () => {
    this.setState((state) => {
      localStorage.setItem('showPlaylist', !state.showPlaylist + '')
      return {
        showPlaylist: !state.showPlaylist,
      }
    })
  }

  /**
   * Устанавливает значение хинтера трекера аудио при наведение мышкой
   *
   * @param progress прогресс аудио от 0 до 1
   */
  handleHoverAudio = (progress: number) => {
    this.setState({
      hintAudio: TimeFormatter.secondToTime(progress * this.audio.duration),
    })
  }

  /**
   * Устанавливает значение хинтера громкости при наведение мышкой
   *
   * @param progress прогресс громкости от 0 до 1
   */
  handleHoverVolume = (progress: number) => {
    this.setState({
      hintVolume: Math.floor(progress * 100) + '%',
    })
  }

  /**
   * Перематывает песню в указанны прогресс
   *
   * @param progress прогресс от 0 до 1
   */
  handleRewind = (progress: number) => {
    this.setState({
      progress,
    })
    this.audio.currentTime = progress * this.audio.duration
  }

  /**
   * Устанавливает громкость
   *
   * @param volume громкость от 0 до 1
   */
  handleVolume = (volume: number) => {
    this.setState({
      volume: volume,
    }, () => {
      localStorage.setItem('volume', '' + volume)
      this.audio.volume = volume
    })
  }

  render() {
    return (
      <div className="wrapper">
        <div className="player">
          <div className={this.state.isPaused ? 'play' : 'pause'} onClick={this.initTogglePause}/>
          <div className="rew" onClick={this.handlePrev}/>
          <div className="fwd" onClick={this.handleNext}/>
          <div className="title">{this.state.title}</div>
          <div className="time">{this.state.time}</div>
          <Tracker className="audio" progress={this.state.progress} hotChange={false}
                   onRewind={this.handleRewind} hint={this.state.hintAudio}
                   onChangePosHint={this.handleHoverAudio}/>
          <Tracker className="volume" progress={this.state.volume} hotChange={true}
                   onRewind={this.handleVolume} hint={this.state.hintVolume}
                   onChangePosHint={this.handleHoverVolume}/>
          <div className={this.state.mix ? 'mix-active' : 'mix'} onClick={this.handleMix}/>
          <div className={this.state.repeat ? 'repeat-active' : 'repeat'} onClick={this.handleRepeat}/>
          <div className="pl" onClick={this.handlePlaylist}/>
        </div>
        <Playlist isShow={this.state.showPlaylist}>
          {this.state.playlist.map((song, i) => <LiAudio key={song.id} url={song.url} active={song.active}
                                                         onClick={() => this.handleChangeSong(i)}>{song.title}</LiAudio>)}
        </Playlist>
      </div>
    )
  }
}

export default App
