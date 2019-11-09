import React, { Component } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './addupdate'
import ProductDetail from './detail'

export default class product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/product'>ProductHome</Route>
        <Route path='/product/addupdate'>ProductAddUpdate</Route>
        <Route path='/product/detail'>ProductDetail</Route>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
