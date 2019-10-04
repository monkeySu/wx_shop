// pages/vip/index.js
let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    list: [],
    x: '20rpx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getVipList()
  },

  getVipList(){
    const _this = this
    App._get('/vip', {}, (res) => {
      _this.setData({
        ...res.data
      })
    })
  },

  changeSwiper(e) {
    const {
      current
    } = e.detail
    this.setData({
      current
    })
  },

  payVip() {
    let _this = this;
    const {
      current,
      list
    } = this.data
    let vip_id = list[current].id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('/vip/order', { vip_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          _this.getOrderDetail(order_id);
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  }
})