import React from 'react'
import ReactDOM from 'react-dom'

import utils from '../utils'

const ITEM_HEIGHT = 55

export default class BoxItem extends React.Component {

  render () {
    const props = this.props
    const ingridients = props.ingridients.map((ingridient, index) => {
      if (ingridient)
        return <li key={index}>{utils.capitalize(ingridient)}</li>
    })
    const length = (ingridients[0]) ? ingridients.length : 0
    const styles = (props.current)
      ? {height: (ITEM_HEIGHT * length + ITEM_HEIGHT + ITEM_HEIGHT) + 'px'}
      : {}
    const classes = (props.current) ? ' opened' : ''

    return (
      <li className={`recipe${classes}`}>
        <a onClick={props.actions.toggle} href="#">{props.name}</a>
        <ol className="toggle-inner" style={styles}>
          <span className="header">Ingridients</span>
          {ingridients}
          <span className="filters-block">
            <button onClick={props.actions.edit}>Edit</button>
            <button onClick={props.actions.remove}>Delete</button>
          </span>
        </ol>
      </li>
    )
  }

}