import React from 'react'

type P = {
  // Путь к песни
  url: string
  // Проигрывается ли данная песня
  active: boolean
  // Событие при клике
  onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
}
type S = {}

class LiAudio extends React.Component<P, S> {

  render() {
    const {url, active, onClick, children} = this.props
    return (
      <li className={active ? 'active' : ''} data-audiourl={url} onClick={onClick}>{children}</li>
    )
  }
}

export default LiAudio