const playlist = [
  {
    id: 1,
    title: 'Класическая музыка',
    url: '/data/Класическая музыка.mp3',
  },
  {
    id: 2,
    title: 'Красивая мелодия',
    url: '/data/Красивая мелодия.mp3',
  },
  {
    id: 3,
    title: 'Серьезная музыка',
    url: '/data/Серьезная музыка.mp3',
  },
]

class PlaylistApi {
  // todo связь с серверной частью
  getAll() {
    let list = JSON.parse(JSON.stringify(playlist))
    return Promise.resolve(list)
  }
}

export default PlaylistApi