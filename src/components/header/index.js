import React, { Component } from 'react'
import {reqWeather} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'
import {formateDate} from '../../utils/dateUtils'
import {withRouter} from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal} from 'antd'
import LinkButton from '../link-button'

class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()), 
    dayPictureUrl: '', 
    weather: '', 
  }

  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if (item.key===path) { 
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        if(cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京')
    this.setState({dayPictureUrl, weather})
  }

  componentDidMount () {
    this.getTime()
    this.getWeather()
  }

  logout = () => {
    Modal.confirm({
      content: 'Are you sure to exit?',
      onOk: () => {
        console.log('OK', this)
        storageUtils.removeUser()
        memoryUtils.user = {}
        this.props.history.replace('/login')
      }
    })
  }

  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  render() {

    const {currentTime, dayPictureUrl, weather} = this.state

    const username = memoryUtils.user.username

    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          <span>Welcome {username}</span>
          <LinkButton onClick={this.logout}>Logout</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)