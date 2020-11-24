import React from 'react'

type P = {
  // Дополнительные css классы
  className?: string
  // Прогресс от 0 до 1
  progress: number // от 0 до 1
  // Флаг горящей перемотки иначе перемотка будет после отжатии клавиши мыши
  hotChange: boolean
  // Событие при перемотке
  onRewind: (progress: number) => void
  // Значение хинтера (всплывающая подсказка)
  hint: string
  // Событие изменения позиции хинтера
  onChangePosHint: (pos: number) => void
}

type S = {
  // внутренний прогресс, который перекрывает внешний при перемотке
  progress: number
  // Флаг показа хинта и хандлера(кружка)
  showHint: boolean
  // Позиция хандлера(кружка)
  posHandler: string
  // Позиция хинта(всплывающая подсказка)
  posHint: string
}

class Tracker extends React.Component<P, S> {
  private tracker: HTMLDivElement | null = null
  private trackerHandler: HTMLDivElement | null = null
  private trackerHint: HTMLDivElement | null = null
  private mouseDown = false // Флаг зажатие перемотки

  constructor(props: P) {
    super(props)
    this.state = {
      progress: props.progress,
      showHint: false,
      posHandler: this.calcPosHandler(props.progress),
      posHint: '0',
    }
  }

  componentDidMount() {
    if (this.tracker) {
      this.tracker.addEventListener('mousemove', this.handleMouseMove)
    }
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>) {
    // Если изменяется внешний прогресс, то меняем внутренний, если не включен режим перемотки
    if (prevProps.progress !== this.props.progress && !this.mouseDown) {
      this.setState({
        progress: this.props.progress,
      })
    }

    // Изменение позиции хандрела относительно внутреннего прогресса
    let posHandler = this.calcPosHandler(this.state.progress)
    if (posHandler !== this.state.posHandler) {
      this.setState({
        posHandler: posHandler,
      })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    this.tracker!.removeEventListener('mousemove', this.handleMouseMove)
  }

  /**
   * Вычислить позицию хандлера относительно прогресса учитивая его ширину
   *
   * @param progress прогресс трекера
   */
  calcPosHandler = (progress: number): string => {
    if (this.trackerHandler && this.tracker) {
      return progress * 100 - this.trackerHandler.clientWidth / 2 * 100 / this.tracker.clientWidth + '%'
    }
    return progress * 100 + '%'
  }

  /**
   * Вычислить значение курсора относительно трекера от 0 до 1
   *
   * @param clientX X координата курсора
   */
  calcPosCursor = (clientX: number): number => {
    let pos = (clientX - this.tracker!.getBoundingClientRect().left) / this.tracker!.clientWidth
    if (pos < 0) {
      pos = 0
    }
    if (pos > 1) {
      pos = 1
    }
    return pos
  }

  /**
   * Показ хинтера и хандлера при наведения мышки на трекер
   */
  handleMouseEnter = () => {
    this.setState({
      showHint: true,
    })
  }

  /**
   * Скрытие хинтера и хандлера при покидании мышки, если не включен режим перемотки
   */
  handleMouseLeave = () => {
    if (!this.mouseDown) {
      this.setState({
        showHint: false,
      })
    }
  }

  /**
   * Установить хинтер в область курсора
   * Перемотать трекер, если активна перемотка
   *
   * @param event
   */
  handleMouseMove = (event: MouseEvent) => {

    // Позиция курсора относительно трекера от 0 до 1
    let pos = this.calcPosCursor(event.clientX)

    // Установить хинтер на позицию x курсора
    if (this.trackerHint) {
      // Вычесть половину ширины хинтера для отцентровки
      let posHint = pos - this.trackerHint.clientWidth / 2 / this.tracker!.clientWidth
      this.setState({
        posHint: posHint * 100 + '%',
      })

      // Вызвать событие вычисления значение хинтера
      this.props.onChangePosHint(pos)
    }

    // если перематываем трекер, то изменяем прогресс
    if (this.mouseDown) {
      this.setState({
        progress: pos,
      })
      // Если включена моментальная перемотка, то вызываем событие перемотки
      if (this.props.hotChange) {
        this.props.onRewind(pos)
      }
    }
  }

  /**
   * Событие зажатии клавиши мышки
   *
   * @param event
   */
  handleMouseDown = (event: MouseEvent | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.mouseDown = true

    // Открепить локальное отслеживание и прикрепить глобальное
    this.tracker!.removeEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)

    this.handleMouseMove(event as MouseEvent) // Перемотать трекер к мышке
  }

  /**
   * Событие отжатии мышки
   *
   * @param event
   */
  handleMouseUp = (event: MouseEvent) => {
    this.mouseDown = false

    // Если курсор вышел за границы трекера, то убрать хинтер
    {
      let posX = (event.clientX - this.tracker!.getBoundingClientRect().left) / this.tracker!.clientWidth
      let posY = (event.clientY - this.tracker!.getBoundingClientRect().top) / this.tracker!.clientHeight
      if (posX < 0 || posX > 1 || posY < 0 || posY > 1) {
        this.setState({
          showHint: false,
        })
      }
    }

    // Вычислить позицию курсора относительно трекера
    let pos = this.calcPosCursor(event.clientX)
    // Перематываем на эту позицию трекер
    this.props.onRewind(pos)

    // Отслеживать только локальные события
    this.tracker!.addEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  render() {
    return (
      <div className={`tracker ${this.props.className || ''}`}
           ref={(instance) => this.tracker = instance}
           onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
           onMouseDown={this.handleMouseDown}>
        <div className="tracker_track">
          <div className="tracker_amount" style={{width: this.state.progress * 100 + '%'}}/>
          {this.state.showHint &&
          <div className="tracker_handler" style={{left: this.state.posHandler}}
               ref={(instance) => this.trackerHandler = instance}/>}
        </div>
        {this.state.showHint &&
        <div className="tracker_hint" style={{left: this.state.posHint}}
             ref={(instance) => this.trackerHint = instance}>{this.props.hint}</div>}
      </div>
    )
  }
}

export default Tracker