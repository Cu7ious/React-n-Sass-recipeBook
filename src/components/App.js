import React from 'react'
import RecipeBox from './RecipeBox'

export default class App extends React.Component {

  componentWillMount () {
    this.sidebarCloseButton = document.querySelector('#main-sidebar button')
    this.sidebarCloseButton.addEventListener('click', this._closeSidebar, false)
    this.magnetOverlay = document.getElementById('magnet-overlay')
    this.magnetOverlay.addEventListener('click', this._closeSidebar, false)
    document.addEventListener('keyup', this._closeSidebar, false)

    this.navButton = document.getElementById('app-main-nav-button')
    this.navButton.addEventListener('click', (e) => {
      e.preventDefault()
      document.body.classList.toggle('active-left-place')
    }, false)
  }

  _closeSidebar (e) {
    if (e.type == 'keyup' && e.keyCode == 27) {
      if (document.body.classList.length) {
        document.body.classList.toggle('active-left-place')
      }
    } else if (e.type == 'click') {
      document.body.classList.toggle('active-left-place')
    }
  }

  render () {
    return (
      <RecipeBox />
    )
  }

}