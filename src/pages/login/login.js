import React, { Component } from 'react'
import './login.less'
// import logo from '../../assets/images/logo.png'
import logo from '../../assets/images/react.svg'
// import logo from '../../logo.svg'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {
  Form,
  Icon,
  Input,
  Button,
  message
} from 'antd'
const Item = Form.Item 

class Login extends Component {

	handleSubmit = (event) => {
		event.preventDefault()
		this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {username, password} = values
        const result = await reqLogin(username, password) 
        if (result.status===0) { 
          message.success('login successed')

          const user = result.data
          memoryUtils.user = user 
          storageUtils.saveUser(user) 

          this.props.history.replace('/')

        } else { 
          message.error(result.msg)
        }

      } else {
        console.log('information check failed')
      }
    });
	}

	validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('you should input password')
    } else if (value.length<4) {
      callback('password length must > 4')
    } else if (value.length>12) {
      callback('password length must < 4')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('The password must be in English letter, numeric or underlined')
    } else {
      callback() 
    }
    
	}
	
	render() {
		const form = this.props.form
    const { getFieldDecorator } = form;
		return (
			<div className='login'>
				<header className='login-header'>
					<img src={logo} alt='logo' />
					<h1>Warden</h1>
				</header>
				<section className="login-content">
					<h2>Login</h2>
					<Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                  rules: [
                    { required: true, whitespace: true, message: 'Username must be entered' },
                    { min: 4, message: 'User name at least 4' },
                    { max: 12, message: 'User name up to 12' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: 'The password must be in English letter, numeric or underlined' },
                  ],
                  initialValue: 'admin', 
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />
                )
              }
            </Item>
            <Form.Item>
              {
								getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Login
              </Button>
            </Form.Item>
          </Form>
				</section>
			</div>
		)
	}
}
const WrapLogin = Form.create()(Login)
export default WrapLogin