import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd'
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants";

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, 
    previewImage: '', 
    fileList: [
      /*{
        uid: '-1', // 每个file都有自己唯一的id
        name: 'xxx.png', // 图片文件名
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
      },*/
    ],
  }

  constructor (props) {
    super(props)

    let fileList = []

    const {imgs} = this.props
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, // 建议用负数避免重复
        name: img, 
        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
        url: BASE_IMG_URL + img
      }))
    }

    this.state = {
      previewVisible: false, 
      previewImage: '', 
      fileList 
    }
  }

  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    console.log('handlePreview()', file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    console.log('handleChange()', file.status, fileList.length, file===fileList[fileList.length-1])

    if(file.status==='done') {
      const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      if(result.status===0) {
        message.success('上传图片成功!')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status==='removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success('删除图片成功!')
      } else {
        message.error('删除图片失败!')
      }
    }

    // 在操作(上传/删除)过程中更新fileList状态
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" /*上传图片的接口地址*/
          accept='image/*'  /*只接收图片格式*/
          name='image' /*请求参数名*/
          listType="picture-card"  /*卡片样式*/
          fileList={fileList}  /*所有已上传图片文件对象的数组*/
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}