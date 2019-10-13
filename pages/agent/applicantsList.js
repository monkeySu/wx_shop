// pages/agent/applicantsList.js
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  getList(){
    App._get('/agent/partner/audit-list',{}, (res) => {
      this.setData({
        list: [
          ...res.data.list
        ]
      })
    })
  },

  navigateToagentUser(e){
    console.log(e)
    const {
      dataset: {
        item
      }
    } = e.currentTarget
    
    App.globalData.applicationUser = item
    wx.navigateTo({
      url: "/pages/agent/agent_user"
    });
  }
})