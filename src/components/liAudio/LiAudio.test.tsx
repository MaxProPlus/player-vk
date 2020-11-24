import React from 'react'
import {render, screen} from '@testing-library/react'
import LiAudio from './LiAudio'
import userEvent from '@testing-library/user-event'

const url = '/data/song.mp3',
  text = 'title'


test('renders LiAudio', () => {
  render(<LiAudio url={url} active={false} onClick={() => {
  }}>{text}</LiAudio>)
  const liAudio = screen.getByText(text)
  expect(liAudio).toBeInTheDocument()
})

test('onClick LiAudio', () => {
  const onClick = jest.fn()

  render(<LiAudio url={url} active={false} onClick={onClick}>{text}</LiAudio>)
  const liAudio = screen.getByText(text)
  userEvent.click(liAudio)
  liAudio.classList.contains('active')
  expect(onClick).toBeCalled()
})

test('change active', () => {
  const onClick = jest.fn()
  const {rerender} = render(<LiAudio url={url} active={false} onClick={onClick}>{text}</LiAudio>)
  const liAudio = screen.getByText(text)
  expect(liAudio.classList.contains('active')).not.toBeTruthy()
  rerender(<LiAudio url={url} active={true} onClick={onClick}>{text}</LiAudio>)
  expect(liAudio.classList.contains('active')).toBeTruthy()
})