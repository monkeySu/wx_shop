// pages/agent/agent_user.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    modalData: {
      title: '提示',
      type: 'default',
    },
    showModal: true,
    data: {
      
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      data: App.globalData.applicationUser
    })
  },

  refuse(){
    this.setData({
      type: 'refuse',
      modalData: {
        title: '提示',
        desc: '拒绝后不在收到该用户的申请',
        type: 'default',
      },
      showModal: true
    })
  },

  agree(){
    this.setData({
      type: 'agree',
      modalData: {
        title: '提示',
        desc: '通过后马上成为您的下级销售',
        type: 'default',
        okText:'通过'
      },
      showModal: true
    })
  },

  modalConfirm(){
    const {
      data: {id},
      type
    } = this.data
    App._post_form('/agent/partner/audit', {
      id,
      status: type=="agree"?1:0
    }, () => {
      this.setData({
        showModal: false
      }, () => {
        wx.navigateBack()
      })
    })
    
  }
})