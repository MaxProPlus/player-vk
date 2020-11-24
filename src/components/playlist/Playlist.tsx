import React, {RefObject} from 'react'

type P = {
  isShow: boolean // Показ плейлиста
}
type S = {
  height: string
  scrollHeight: number
}

class Playlist extends React.Component<P, S> {
  private content: RefObject<HTMLDivElement>

  constructor(props: P) {
    super(props)
    this.state = {
      height: '0px',
      scrollHeight: 0,
    }
    this.content = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('resize', this.handleResize)
    this.setState({
      scrollHeight: this.content.current!.scrollHeight,
    })
  }

  componentWillUnmount() {
    document.removeEventListener('resize', this.handleResize)
  }

  // Событие при изменения размера окна
  handleResize = () => {
    this.setState({
      scrollHeight: this.content.current!.scrollHeight,
    })
  }

  render() {
    return (
      <div className="playlist-outer" ref={this.content}
           style={{height: this.props.isShow ? '80vh' : '0px'}}>
        <ul className="playlist">{this.props.children}</ul>
      </div>
    )
  }
}

export default Playlist