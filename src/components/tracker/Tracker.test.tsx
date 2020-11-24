import React from 'react'
import Tracker from './Tracker'
import {fireEvent, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('renders tracker', () => {
  const onRewind = jest.fn()
  const onChangePosHint = jest.fn()
  const elem = render(<Tracker progress={0} hotChange={false} onRewind={onRewind} hint={'0:00'}
                               onChangePosHint={onChangePosHint}/>)
  expect(elem.container.getElementsByClassName('tracker')[0]).toBeInTheDocument()
})

test('events mouseEnter/mouseLeave', () => {
  const onRewind = jest.fn()
  const onChangePosHint = jest.fn()
  const elem = render(<Tracker progress={0} hotChange={false} onRewind={onRewind} hint={'0:00'}
                               onChangePosHint={onChangePosHint}/>)
  expect(elem.container.getElementsByClassName('tracker_handler')[0]).toBeUndefined()
  expect(elem.container.getElementsByClassName('tracker_handler')[0]).toBeUndefined()
  expect(elem.container.getElementsByClassName('tracker_hint')[0]).toBeUndefined()
  userEvent.hover(elem.container.getElementsByClassName('tracker')[0])
  expect(elem.container.getElementsByClassName('tracker_handler')[0]).toBeInTheDocument()
  expect(elem.container.getElementsByClassName('tracker_hint')[0]).toBeInTheDocument()
  userEvent.unhover(elem.container.getElementsByClassName('tracker')[0])
  expect(elem.container.getElementsByClassName('tracker_handler')[0]).toBeUndefined()
  expect(elem.container.getElementsByClassName('tracker_hint')[0]).toBeUndefined()
})

test('event onChangePosHint', () => {
  const onRewind = jest.fn()
  const onChangePosHint = jest.fn()
  const elem = render(<Tracker progress={0} hotChange={false} onRewind={onRewind} hint={'0:00'}
                               onChangePosHint={onChangePosHint}/>)
  userEvent.hover(elem.container.getElementsByClassName('tracker')[0])
  elem.rerender(<Tracker progress={.1} hotChange={false} onRewind={onRewind} hint={'0:00'}
                         onChangePosHint={onChangePosHint}/>)
  expect(onChangePosHint).toHaveBeenCalled()
})

test('event onRewind', () => {
  const onRewind = jest.fn()
  const onChangePosHint = jest.fn()
  const elem = render(<Tracker progress={0} hotChange={false} onRewind={onRewind} hint={'0:00'}
                               onChangePosHint={onChangePosHint}/>)
  userEvent.click(elem.container.getElementsByClassName('tracker')[0])
  expect(onRewind).toHaveBeenCalled()
})

test('hotChange', () => {
  const onRewind = jest.fn()
  const onChangePosHint = jest.fn()
  const elem = render(<Tracker progress={0} hotChange={false} onRewind={onRewind} hint={'0:00'}
                               onChangePosHint={onChangePosHint}/>)
  fireEvent.mouseDown(elem.container.getElementsByClassName('tracker')[0])
  fireEvent.mouseMove(elem.container.getElementsByClassName('tracker')[0])
  expect(onRewind).not.toHaveBeenCalled()
  fireEvent.mouseUp(elem.container.getElementsByClassName('tracker')[0])
  expect(onRewind).toHaveBeenCalled()
  elem.rerender(<Tracker progress={0} hotChange={true} onRewind={onRewind} hint={'0:00'}
                         onChangePosHint={onChangePosHint}/>)
  fireEvent.mouseDown(elem.container.getElementsByClassName('tracker')[0])
  fireEvent.mouseMove(elem.container.getElementsByClassName('tracker')[0])
  expect(onRewind).toHaveBeenCalled()
  fireEvent.mouseUp(elem.container.getElementsByClassName('tracker')[0])
  expect(onRewind).toHaveBeenCalled()
})