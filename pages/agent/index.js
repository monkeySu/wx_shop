// pages/agent/index.js
const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      type
    } = options
    this.setData({
      ...options
    })
    if (type == 'partner') {
      this.getPartnerData()
    } else if (type == 'agent') {
      this.getAgentData()
    }
  },

  getAgentData() {
    App._get('/agent/index', {}, (res) => {
      this.setData({
        data: {
          ...res.data
        }
      })
    })
  },

  getPartnerData() {

    App._get('/agent/partner/index', {}, (res) => {
      this.setData({
        data: {
          ...res.data
        }
      })
    })
  },

  shoeMore(e) {
    console.log(e)
    const {
      dataset: {
        index
      }
    } = e.currentTarget

    let data = this.data.data

    data.text[index].status = !data.text[index].status
    this.setData({
      data
    })
  },

  navigateToApply() {
    const {
      type
    } = this.data

    wx.navigateTo({
      url: `/pages/agent/apply?type=${type}`
    })
  }
})