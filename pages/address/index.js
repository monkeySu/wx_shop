let App = getApp();

Page({
  data: {
    list: [],
    default_id: null,
  },

  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
  },

  onShow: function() {
    // 获取收货地址列表
    this.getAddressList();
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function() {
    let _this = this;
    App._get('/user/address/list', {}, function(result) {
      result.data.list.map((value, index) => {
        let arr = result.data.list[index].tel_number.split('')
        arr.splice(3,4,'*','*','*','*')
        result.data.list[index].number = arr.join('')
      })
      _this.setData(result.data);
    });
  },

  /**
   * 添加新地址
   */
  createAddress: function() {
    App.globalData.address = {}

    wx.navigateTo({
      url: './create?id=0'
    });
  },

  /**
   * 编辑地址
   */
  editAddress: function(e) {
    const {
      dataset: {
        item
      }
    } = e.currentTarget
    App.globalData.address = item
    wx.navigateTo({
      url: "./create?id=" + item.id
    });
  },

  selectAddress(e){
    if(this.data.options.from == "flow"){
      const {
        dataset: {
          item
        }
      } = e.currentTarget
      App.globalData.address = item
      wx.navigateBack({
      })
    }
  },

  /**
   * 移除收货地址
   */
  removeAddress: function(e) {
    let _this = this,
      address_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function(o) {
        o.confirm && App._post_form('address/delete', {
          address_id
        }, function(result) {
          _this.getAddressList();
        });
      }
    });
  },

  /**
   * 设置为默认地址
   */
  setDefault: function(e) {
    let _this = this,
      address_id = e.detail.value;
    _this.setData({
      default_id: parseInt(address_id)
    });
    App._post_form('address/setDefault', {
      address_id
    }, function(result) {
      _this.data.options.from === 'flow' && wx.navigateBack();
    });
    return false;
  },

});