let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航
    options: {}, // 当前页面参数

    address: {}, // 默认收货地址
    exist_address: false, // 是否存在收货地址
    goods: {}, // 商品信息
    goods_pay_type: {},

    disabled: false,

    hasError: false,
    error: '',
    modalData: {
      title: '输入支付密码',
      type: 'pay'
    },

    showModal: false,

    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取当前订单信息
    this.setData({
      address: App.globalData.address
    }, () => {
      this.getOrderBudget();
    })
  },

  /**
   * 获取当前订单信息
   */
  getOrderData: function() {
    let _this = this,
      options = _this.data.options;

    // 获取订单信息回调方法
    let callback = function(result) {
      if (result.code !== 0) {
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.data.hasError = true;
        _this.data.error = result.data.error_msg;
        App.showError(_this.data.error);
      }
      _this.setData(result.data);
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._post_form('/goods/trade/budget', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
      }, function(result) {
        callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._post_form('/goods/trade/budget', {

      }, function(result) {
        callback(result);
      });
    }

  },

  /**
   * 选择收货地址
   */
  selectAddress: function() {
    wx.navigateTo({
      url: '../address/index?from=flow'
    });
  },

  // 选择支付方式
  selectPay(e){
    const value = e.detail.value
    const id  = value.split(',')[0];
    const type =  value.split(',')[1];
    console.log(id, type)

    this.setData({
      goods_pay_type: {
        ...this.data.goods_pay_type,
        [id]: type
      }
    }, () => {
      this.getOrderBudget()
    })
  },

  getOrderBudget() {
    const {
      address,
      goods_pay_type
    } = this.data

    const _this = this

    App._post('/goods/trade/budget', {
      address_id: address.id || '',
      goods_pay_type
    }, function(result) {
      _this.setData({
        ...result.data
      })
    });
  },

  showPayModal() {
    this.setData({
      modalData: {
        title: '输入支付密码',
        type: 'pay',
      },
      showModal: true
    })
  },

  modalConfirm(e) {
    const {
      modalData
    } = this.data

    if(modalData.type == "pay"){
      this.data.password = e.detail.val
      this.submitOrder()
    }else{
      wx.navigateTo({
        url: '/pages/password/list'
      })
    }

    this.setData({
      showModal: false
    })
  },

  /**
   * 订单提交
   */
  submitOrder: function() {
    let _this = this,
      options = _this.data.options;

    if (_this.data.disabled) {
      return false;
    }

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function(result) {
      if (result.code === -10) {
        App.showError(result.msg, function() {
          // 跳转到未付款订单
          wx.redirectTo({
            url: '../order/index?type=payment',
          });
        });
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: ''+result.data.time_stamp,
        nonceStr: result.data.nonce_str,
        package: result.data.package,
        signType: 'MD5',
        paySign: result.data.pay_sign,
        success: function(res) {
          // 跳转到订单详情
          wx.redirectTo({
            url: '../order/detail?order_id=' + result.data.order_id,
          });
        },
        fail: function() {
          App.showError('订单未支付', function() {
            // 跳转到未付款订单
            wx.redirectTo({
              url: '../order/index?type=payment',
            });
          });
        },
      });
    };

    const getTradeData = function (result) {
      App._post_form('/goods/trade/pay', {
        trade_id: result.trade_id
      },(res) => {
        callback(res)
      },(err) => {

      }, () => {
        _this.data.disabled = false;
      })
    }

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });

    const {
      address,
      goods_pay_type,
      password
    } = this.data

    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      App._post('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
      }, function(result) {
        // success
        console.log('success');
        getTradeData(result.data);
      }, function(result) {
        // fail
        console.log('fail');
      }, function() {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

    // 创建订单-购物车结算
    else if (options.order_type === 'cart') {
      App._post('/goods/trade/create', {
        address_id: address.id || '',
        goods_pay_type,
        pay_passwd: password
      }, function(result) {
        // success

        getTradeData(result.data);
      }, function(result) {
        // fail
        console.log('fail');
      }, function() {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

  },


});