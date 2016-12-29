import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'boron/ScaleModal'

import data from '../data'

export default class RecipeBox extends React.Component {

  componentWillMount () {
    this.state = {
      current: null,
      editing: null,
      items: []
    }
    // Modal Style object
    this.modalStyle = {
      width: '60%'
    }
  }

  addItem (e) {
    let name = this.refs.recipeName.value
    let stuff = this.refs.recipeIngridients.value

    name = name ? this._toUpperCase(name) : 'Untitled'
    this.state.items.push(
      {name, ingridients: stuff, editing: null},
    )
    this.setState({
      items: this.state.items
    })
    this.closeFormDialog()
  }

  removeItem (index) {
    this.state.items.splice(index, 1)
    this.setState({
      items: this.state.items
    })
  }

  editItem (index, e) {
    this.setState({editing: index})
    this.openFormDialog()
  }

  pasteDummyData () {
    this.setState({
      current: null,
      editing: null,
      items: data.items
    })
  }

  clearAllData () {
    this.setState({
      current: null,
      editing: null,
      items: []
    })
  }

  _onShow (index, e) {
    let name = this.refs.recipeName.value
    let stuff = this.refs.recipeIngridients.value
    this.state.items[index].name = name ? this._toUpperCase(name) : 'Untitled'
    this.state.items[index].ingridients = stuff

    this.setState({items: this.state.items, editing: null})
    this.closeFormDialog()
  }

  toggleCurentRecipe (current, e) {
    e.preventDefault()
    current = (this.state.current === current)  ? false : current
    this.setState({current})
  }

  openFormDialog (e = null) {
    if (e) {
      e.preventDefault()
    }
    this.refs.recipeFormModal.show()
  }

  closeFormDialog () {
    this.refs.recipeFormModal.hide()
  }

  _toUpperCase (text) {
    text = (text.charAt(0) === ' ') ? text.replace(' ', '') : text
    return text.replace(
      text.charAt(0),
      text.charAt(0).toUpperCase()
    )
  }

  _next (e) {
    if (e.keyCode == 13) {
      if (e.target.id == 'recipe-name' && e.target.value) {
        this.refs.recipeIngridients.focus()
      } else if (e.target.id == 'recipe-ingridients' && e.target.value) {
        this.refs.modalConfirmButton.click()
      }
    }
    return false
  }

  renderItems () {
    if (this.state.items.length) {
      return this.state.items
        .map((item, index) => {
          const classes = (this.state.current === index) ? ' opened' : ''
          const ingridients = item.ingridients.split(',').map((ingridient, idx) => {
            if (ingridient)
              return <li key={idx}>{this._toUpperCase(ingridient)}</li>
          })
          const length = (ingridients[0]) ? ingridients.length : 0
          const styles = (this.state.current === index) ? {height: (55 * length + 55 + 55) + 'px'} : {}

          return (
            <li key={index} className={`recipe${classes}`}>
              <a onClick={this.toggleCurentRecipe.bind(this, index)} href="#">{item.name}</a>
              <ol className="toggle-inner" style={styles}>
                <li className="header">Ingridients</li>
                {ingridients}
                <li className="filters-block">
                  <button onClick={this.editItem.bind(this, index)}>Edit</button>
                  <button onClick={this.removeItem.bind(this, index)}>Delete</button>
                </li>
              </ol>
            </li>
          )
        })
    }
    return <li className="no-items">There's no items. <a href="#" onClick={this.openFormDialog.bind(this)}>Add one</a></li>
  }

  renderButtons () {
    return (
      <nav className='material-buttons'>
        <ul>
          <li id='paste-dummy-data' onClick={this.pasteDummyData.bind(this)} className='secondary'>&crarr;<span>Paste dummy data</span></li>
          <li id='clear-all-data' onClick={this.clearAllData.bind(this)} className='secondary'>&#x021BA;<span>Clear all data</span></li>
          <li id='add-new-recipe' onClick={this.openFormDialog.bind(this)}><span>Add new recipe</span></li>
        </ul>
      </nav>
    )
  }

  renderModal () {
    const editing = (this.state.editing !== null) ? this._onShow.bind(this, this.state.editing) : this.addItem.bind(this)
    let title = 'Add new recipe'
    let button = 'Add Recipe'
    let stuff
    let name

    if (this.state.editing !== null) {
      title = 'Edit recipe'
      title = 'Save Changes'
      name = this.state.items[this.state.editing].name
      stuff = this.state.items[this.state.editing].ingridients
    }

    return (
      <Modal
        ref="recipeFormModal"
        className="modal"
        backdrop={true}
        modalStyle={this.modalStyle}>
        <header className='modal-header'>
          <h3>{title}</h3>
          <button onClick={this.closeFormDialog.bind(this)}>⨯</button>
        </header>
        <section className='form'>
          <label htmlFor="recipe-name">Recipe</label>
          <input
            ref="recipeName"
            id="recipe-name"
            autoFocus={true}
            defaultValue={name}
            type="text"
            placeholder="Recipe Name"
            onKeyUp={this._next.bind(this)}
          />
          <label htmlFor="recipe-ingridients">Ingridients</label>
          <input
            ref="recipeIngridients"
            id="recipe-ingridients"
            defaultValue={stuff}
            placeholder="Enter Ingredients, separated by commas"
            type="text"
            onKeyUp={this._next.bind(this)}
          />
        </section>
        <footer>
          <button ref="modalConfirmButton" onClick={editing}>{button}</button>
        </footer>
      </Modal>
    )
  }

  render () {
    return (
      <div>
        <div className="panel">
          <h3>Recipes</h3>
        </div>
        <div className="todo-app">
          <div className="dynamic-block">
            <ul>
              {this.renderItems()}
            </ul>
            {this.renderButtons()}
          </div>
        </div>
        {this.renderModal()}
      </div>
    )
  }
}