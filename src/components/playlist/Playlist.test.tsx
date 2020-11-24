import React from 'react'
import {render, screen} from '@testing-library/react'
import Playlist from './Playlist'

const text = 'song.mp3'

test('renders playlist', () => {
  render(<Playlist isShow={true}>{text}</Playlist>)
  const playlist = screen.getByText(text)
  expect(playlist).toBeInTheDocument()
})

test('hide playlist', () => {
  const elem = render(<Playlist isShow={false}>{text}</Playlist>)
  const playlist = elem.container.getElementsByClassName('playlist-outer')[0] as HTMLElement
  expect(playlist.style.height).toEqual('0px')
  elem.rerender(<Playlist isShow={true}>{text}</Playlist>)
  expect(playlist.style.height).toEqual('80vh')
})