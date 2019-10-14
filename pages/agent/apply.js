// pages/agent/apply.js
const qiniuUploader = require('../../utils/qiniu')
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCropper: false,
    imageSrc: 'https://img-mall.irishoney.com/FiugSF8_Hj96xXc_YPgLpRqlaKcu.png',
    imgkey: '/FiugSF8_Hj96xXc_YPgLpRqlaKcu.pngs',

    addressList: [[],[],[]],
    addressCheck: [0,0,0],

    formData: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options,
      isNew: options.isNew?true:false
    })
    const isNew = options.isNew || false
    if(isNew){
      this.getRegion(0, 0, (res) => {
        this.getRegion(res.list[0].id, 1, (result) => {
          this.getRegion(result.list[0].id, 2)
        })
      })
    }else{
      const formData = app.globalData.formData
      this.setData({
        formData
      })

      this.getRegion(0, 0, (res) => {
        this.getRegion(res.list[0].id, 1, (result) => {
          this.getRegion(result.list[0].id, 2)
        })
      })
    }
    
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

  //获取地理位置
  getRegion(pid, listId, callback) {
    const _this = this
    let addressList = this.data.addressList
    App._get('/user/address/region', {
      pid
    }, function(result) {
      addressList[listId] = result.data.list
      _this.setData({
        addressList
      });
      if(typeof(callback) == "function"){
        callback(result.data)
      }
    });
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
  },

  bindRegionColumnChange(e) {
    const {
      column,
      value
    } = e.detail


    const {
      addressCheck,
      addressList
    } = this.data

    switch(column) {
      case 0:
        this.getRegion(addressList[column][value].id ,1, (res) => {
          this.getRegion(res.list[0].id, 2)
        })
        addressCheck[0] = value
        addressCheck[1] = 0
        addressCheck[2] = 0
        this.setData({
          addressCheck
        })
      break;
      case 1:
        this.getRegion(addressList[column][value].id ,2)
        addressCheck[1] = value
        addressCheck[2] = 0
        this.setData({
          addressCheck
        })
      break;
      case 2:
        addressCheck[2] = value
        this.setData({
          addressCheck
        })
      break;
    }
  },

  submit(val) {
    wx.showLoading({ title: '提交中...', });
    
    const {
      value
    } = val.detail

    const {
      type,
      addressCheck,
      addressList,
      imgkey
    } = this.data

    const data = {
      ...value,
      avatar: imgkey,
      province_id: addressList[0][addressCheck[0]].id,
      city_id: addressList[1][addressCheck[1]].id,
      county_id: addressList[2][addressCheck[2]].id,
    }

    // if(id>0){
    //   this.creat()
    // }

    if(type == "partner"){
      App._post_form('/agent/partner/submit', { ...data },  (result) => {
        wx.navigateBack({
          delta: 1
        });
      }, () => {

      }, () => {
        wx.hideLoading();
      })
    }else if(type=="agent"){
      App._post_form('/agent/submit', { ...data },  (result) => {
        wx.navigateBack({
          delta: 1
        });
      }, () => {

      }, () => {
        wx.hideLoading();
      })
    }
  },

  creat(data) {
    if(type == "partner"){
      App._post_form('/agent/partner/submit', { ...data },  (result) => {
        wx.navigateBack({
          delta: 1
        });
      }, () => {

      }, () => {
        wx.hideLoading();
      })
    }else if(type=="agent"){
      App._post_form('/agent/submit', { ...data },  (result) => {
        wx.navigateBack({
          delta: 1
        });
      }, () => {

      }, () => {
        wx.hideLoading();
      })
    }
  },

})