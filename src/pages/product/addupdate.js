import React, { Component } from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Cascader,
  Button,
  message
} from 'antd'
import PicturesWall from './pictures-wall.js'
import RichTextEditor from './rich-text-editor'
import {reqCategorys, reqAddOrUpdateProduct} from '../../api'
import LinkButton from '../../components/link-button'
const {Item} = Form
const { TextArea } = Input

class ProductAddUpdate extends Component {

  state = {
    options: [],
  }
  constructor (props) {
    super(props)

    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, 
    }))

   
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {
      const subCategorys = await this.getCategorys(pCategoryId)
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      const targetOption = options.find(option => option.value===pCategoryId)

      targetOption.children = childOptions
    }

    this.setState({
      options
    })
  }

  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() // 验证通过
    } else {
      callback('Price must be greater than 0') // 验证没通过
    }
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]
    targetOption.loading = true

    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length>0) {
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
      targetOption.isLeaf = true
    }

    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        if(this.isUpdate) {
          product._id = this.product._id
        }

        const result = await reqAddOrUpdateProduct(product)

        if (result.status===0) {
          message.success(`${this.isUpdate ? 'Update' : 'Add'} Product Successed!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? 'Update' : 'Add'} Product Failed!`)
        }
      }
    })
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      
      if (parentId==='0') {
        this.initOptions(categorys)
      } else {
        return categorys 
      }
    }
  }

  componentDidMount () {
    this.getCategorys('0')
  }
  componentWillMount () {
    const product = this.props.location.state  
    this.isUpdate = !!product
    this.product = product || {}
  }

  render() {

    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    const categoryIds = []
    if(isUpdate) {
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    const formItemLayout = {
      labelCol: { span: 2 },  
      wrapperCol: { span: 8 }, 
    }

    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? 'Modify Product' : 'Add Product'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="Name">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  {required: true, message: 'Must enter the product name'}
                ]
              })(<Input placeholder='Please enter the product name'/>)
            }
          </Item>
          <Item label="Description">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  {required: true, message: 'Must enter a description of the product'}
                ]
              })(<TextArea placeholder="Please enter a description of the product" autoSize={{ minRows: 2, maxRows: 6 }} />)
            }

          </Item>
          <Item label="Price">

            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  {required: true, message: 'Must enter the price of the product'},
                  {validator: this.validatePrice}
                ]
              })(<Input type='number' placeholder='Please enter the price of the product' addonAfter='$'/>)
            }
          </Item>
          <Item label="Category">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: 'Product classification must be specified'},
                ]
              })(
                <Cascader
                  placeholder='Please specify the product classification'
                  options={this.state.options}  
                  loadData={this.loadData} 
                />
              )
            }

          </Item>
          <Item label="Picture">
            <PicturesWall ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label="Details" labelCol={{span: 2}} wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.editor} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>Submit</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)