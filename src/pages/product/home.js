import React, { Component } from 'react'
import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class home extends Component {

  state = {
    total: 0, // 商品的总数量
    products: [], // 商品的数组
    loading: false, // 是否正在加载中
    searchName: '', // 搜索的关键字
    searchType: 'productName', // 根据哪个字段搜索
  }

  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if(result.status===0) {
      message.success('Update product successfully')
      this.getProducts(this.pageNum)
    }
  }
  
  initColumns = () => {
    this.columns = [
      {
        title: 'Product Name',
        dataIndex: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'desc',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (price) => '¥' + price 
      },
      {
        width: 100,
        title: 'Status',
        // dataIndex: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status===1 ? 2 : 1
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status===1 ? 'Remove' : 'Put on Sale'}
              </Button>
              <span>{status===1 ? 'On Sale' : 'Removed'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: 'Options',
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>Detail</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>Modify</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum 
    this.setState({loading: true}) 

    const {searchName, searchType} = this.state
    let result
    if (searchName) {
      result = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else { 
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    this.setState({loading: false})
    if (result.status === 0) {
      const {total, list} = result.data
      this.setState({
        total,
        products: list
      })
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getProducts(1)
  }

  render() {
    const {products, total, loading, searchType, searchName} = this.state

    const title = (
      <span>
        <Select
          value= {searchType}
          style={{width: 150}}
          onChange={value => this.setState({searchType:value})}
        >
          <Option value='productName'>Search by Name</Option>
          <Option value='productDesc'>Search by Description</Option>
        </Select>
        <Input
          placeholder='Key Word'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={event => this.setState({searchName:event.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>Search</Button>
      </span>
    )

    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        Add Product
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}
