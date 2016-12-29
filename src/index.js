import React from 'react'
import { render } from 'react-dom'
import App from './components/App'

const run = () => {
  render(
    <App />
    , document.getElementById('root')
  )
}

run()