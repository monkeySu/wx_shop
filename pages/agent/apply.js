// pages/agent/apply.js
const qiniuUploader = require('../../utils/qiniu')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCropper: false,
    imageSrc: 'https://img-mall.irishoney.com/FiugSF8_Hj96xXc_YPgLpRqlaKcu.png',
    imgkey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  hideCut(e) {
    console.log(e)
    if(e.detail){
      this.uploadImage(e.detail.path)
    }

    this.setData({
      showCropper: false
    })
  },

  showCropper() {
    console.log(true)
    this.setData({
      showCropper: true
    })
  },

  uploadImage(path) {
    console.log(qiniuUploader)
    qiniuUploader.upload(path, (res) => {
      console.log(res)
      const {
        key,
        url
      } = res
      this.setData({
        imgkey: key,
        imageSrc: url
      })
      // that.state.imageData.push({
      //   field_id: field_id,
      //   value: res.base_url,
      //   template_id: 0
      // })
    }, (err) => {
      wx.showToast({
        title: '上传图片出错啦~',
        image: '../../image/error.png',
        duration: 2000
      })
    }, {
      region: 'SCN',
      domain: 'https://up-z2.qbox.me',
      uptokenURL: `/common/upload/image-token`,
      shouldUseQiniuFileName: true
    })
  }

})