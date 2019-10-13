// pages/agent/agentList.js

const App = getApp()
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
    App._get('/agent/partner/info',{}, (res) => {
      if(res.code==0){
        this.setData({
          ...res.data
        })
      }
    }, () => {

    }, () => {

    })
  }

})