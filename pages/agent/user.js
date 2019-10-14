const App = getApp()
// pages/agent/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  getData() {
    App._get('/agent/info',{}, (res) => {
      this.setData({
        ...res.data
      })
    })
  }

})