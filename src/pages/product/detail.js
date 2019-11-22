import React, {Component} from 'react'
import {
  Card,
  Icon,
  List
} from 'antd'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item

export default class ProductDetail extends Component {

  state = {
    cName1: '', 
    cName2: '', 
  }

  async componentDidMount () {

    const {pCategoryId, categoryId} = this.props.location.state.product
    if(pCategoryId==='0') { // 一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { // 二级分类下的商品
     
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }

  }

  render() {

    const {name, desc, price, detail, imgs} = this.props.location.state.product
    const {cName1, cName2} = this.state
    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{marginRight: 10, fontSize: 20}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>Description</span>
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className="left">Product Name:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">Description:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">Price:</span>
            <span>{price}$</span>
          </Item>
          <Item>
            <span className="left">Category:</span>
            <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">Picture:</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">Product Detail:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
          </Item>

        </List>
      </Card>
    )
  }
}