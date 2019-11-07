import React, { Component } from 'react'
import './login.less'
import logo from '../../assets/images/logo.png'
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
          message.success('登陆成功')

          const user = result.data
          memoryUtils.user = user 
          storageUtils.saveUser(user) 

          this.props.history.replace('/')

        } else { 
          message.error(result.msg)
        }

      } else {
        console.log('检验失败!')
      }
    });
	}

	validatePwd = (rule, value, callback) => {
    console.log('validatePwd()', rule, value)
    if(!value) {
      callback('密码必须输入')
    } else if (value.length<4) {
      callback('密码长度不能小于4位')
    } else if (value.length>12) {
      callback('密码长度不能大于12位')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback() // 验证通过
    }
    // callback('xxxx') // 验证失败, 并指定提示的文本
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
					<h2>用户登陆</h2>
					<Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {
                /*
              用户名/密码的的合法性要求
                1). 必须输入
                2). 必须大于等于4位
                3). 必须小于等于12位
                4). 必须是英文、数字或下划线组成
               */
              }
              {getFieldDecorator('username', {
                  rules: [
                    { required: true, whitespace: true, message: '用户名必须输入' },
                    { min: 4, message: '用户名至少4位' },
                    { max: 12, message: '用户名最多12位' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                  ],
                  initialValue: 'admin', // 初始值
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
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
                    placeholder="密码"
                  />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
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