import React from 'react'
import ReactDOM from 'react-dom'
import Sortable from 'react-sortablejs';
import Modal from 'boron/ScaleModal'

import BoxItem from './BoxItem'

import utils from '../utils'
import data from '../data'

export default class RecipeBox extends React.Component {

  componentWillMount () {
    let storage = JSON.parse(localStorage.getItem('state'))
    storage = storage ? storage.items : []

    this.state = {
      current: null,
      editing: null,
      items: storage
    }
    // Modal Style object
    this.modalStyle = {
      width: '60%'
    }
  }

  componentDidUpdate () {
    localStorage.setItem('state', JSON.stringify(this.state))
  }

  addItem (e) {
    let name = this.refs.recipeName.value
    let stuff = this.refs.recipeIngridients.value

    name = name ? utils.capitalize(name) : 'Untitled'
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
    const state = {
      current: null,
      editing: null,
      items: []
    }
    localStorage.setItem('state', JSON.stringify(state))
    this.setState(state)
  }

  _onShow (index, e) {
    let name = this.refs.recipeName.value
    let stuff = this.refs.recipeIngridients.value
    this.state.items[index].name = name ? utils.capitalize(name) : 'Untitled'
    this.state.items[index].ingridients = stuff

    this.setState({items: this.state.items, editing: null})
    this.closeFormDialog()
  }

  toggleCurentRecipe (current, e) {
    e.preventDefault()
    current = (this.state.current === current)  ? null : current
    this.setState({current})
  }

  updaterecipesOrder (o, c, event) {
    const result = utils.arrayMoveItem(this.state.items, event.oldIndex, event.newIndex)
    this.setState({
      current: null,
      items: result
    })
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
        .map((item, index) =>
          <BoxItem
            dataIdAttr="index"
            key={index}
            index={index}
            ingridients={item.ingridients.split(',')}
            current={this.state.current == index}
            name={item.name}
            actions={{
              toggle: this.toggleCurentRecipe.bind(this, index),
              edit: this.editItem.bind(this, index),
              remove: this.removeItem.bind(this, index)
            }}
          />
      )
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
        <div className="recipe-box-app">
          <div className="dynamic-block">
            <Sortable
              tag="ul"
              onChange={this.updaterecipesOrder.bind(this)}
            >
              {this.renderItems()}
            </Sortable>
            {this.renderButtons()}
          </div>
        </div>
        {this.renderModal()}
      </div>
    )
  }
}