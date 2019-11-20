import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option

class UserForm extends PureComponent {

  static propTypes = {
    setForm: PropTypes.func.isRequired, 
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {

    const {roles, user} = this.props
    const { getFieldDecorator } = this.props.form
    
    const formItemLayout = {
      labelCol: { span: 4 },  
      wrapperCol: { span: 15 }, 
    }

    return (
      <Form {...formItemLayout}>
        <Item label='Username'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
            })(
              <Input placeholder='please enter user name'/>
            )
          }
        </Item>

        {
          user._id ? null : (
            <Item label='Password'>
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                })(
                  <Input type='password' placeholder='Please enter your password'/>
                )
              }
            </Item>
          )
        }

        <Item label='Phone Number'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
            })(
              <Input placeholder='Please enter your phone number'/>
            )
          }
        </Item>
        <Item label='Email'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
            })(
              <Input placeholder='Please enter your email'/>
            )
          }
        </Item>

        <Item label='Role'>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id,
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UserForm)