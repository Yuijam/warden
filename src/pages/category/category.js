import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Modal
} from 'antd'
import LinkButton from '../../components/link-button'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class category extends Component {

  state = {
    loading: false, 
    categorys: [],
    subCategorys: [], 
    parentId: '0', 
    parentName: '',
    showStatus: 0, 
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'category name',
        dataIndex: 'name', 
      },
      {
        title: 'options',
        width: 300,
        render: (category) => ( 
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>Modify category</LinkButton>
            {this.state.parentId==='0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>View subcategories</LinkButton> : null}

          </span>
        )
      }
    ]
  }

  showSubCategorys = (category) => {
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => { 
      console.log('parentId', this.state.parentId) // '0'
      this.getCategorys()
    })
  }

  showUpdate = (category) => {
    this.category = category
    this.setState({
      showStatus: 2
    })
  }

  getCategorys = async (parentId) => {
    console.log('getCategorys', parentId)
    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({loading: false})
    console.log('getCategorys result', result)
 
    if(result.status===0) {
      const categorys = result.data
      if(parentId==='0') {
        this.setState({
          categorys
        })
        console.log('----', this.state.categorys.length)
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    } else {
      message.error('Failed to get list of categories')
    }
  }

  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }

  updateCategory = () => {
    console.log('updateCategory()')
    this.form.validateFields(async (err, values) => {
      if(!err) {
        this.setState({
          showStatus: 0
        })

        const categoryId = this.category._id
        const {categoryName} = values
        this.form.resetFields()

        const result = await reqUpdateCategory({categoryId, categoryName})
        if (result.status===0) {
          this.getCategorys()
        }
      }
    })
  }

  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showStatus: 0
        })

        const {parentId, categoryName} = values
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status===0) {

          if(parentId===this.state.parentId) {
            this.getCategorys()
          } else if (parentId==='0'){
            this.getCategorys('0')
          }
        }
      }
    })
  }

  handleCancel = () => {
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getCategorys()
  }

  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  render() {
    const {categorys, subCategorys, parentId, parentName, loading, showStatus} = this.state
    
    const category = this.category || {} 

    const title = parentId === '0' ? 'First Classification' : (
      <span>
        <LinkButton onClick={this.showCategorys}>First Classification</LinkButton>
        <Icon type='arrow-right' style={{marginRight: 5}}/>
        <span>{parentName}</span>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'/>
        Add
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId==='0' ? categorys : subCategorys}
          columns={this.columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="Add category"
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {this.form = form}}
          />
        </Modal>

        <Modal
          title="Update category"
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {this.form = form}}
          />
        </Modal>
      </Card>
    )
  }
}
