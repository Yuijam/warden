import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data={}, type='GET') {

  return new Promise((resolve, reject) => {
    let promise
    if(type==='GET') { 
      promise = axios.get(url, { 
        params: data 
      })
    } else { 
      promise = axios.post(url, data)
    }
    promise.then(response => {
      resolve(response.data)
    // 不调用reject(reason)
    }).catch(error => {
      message.error('请求出错了: ' + error.message)
    })
  })
}