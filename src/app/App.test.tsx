import React from 'react'
import {render} from '@testing-library/react'
import App from './App'

test('renders player', () => {
  const elem = render(<App/>)
  expect(elem.container.getElementsByClassName('player')[0]).toBeInTheDocument()
})
