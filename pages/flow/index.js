let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_list: [], // 商品列表
    order_total_num: 0,
    order_total_price: 0,
    selectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    if (_this.data.isLogin) {
      // 获取购物车列表
      _this.getCartList();
    }
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    App._get('/user/cart/list', {}, function(result) {
      _this.setData(result.data);
      // _this.InitArray(result.data.list)
    });
  },

  // 初始化选中列表
  // InitArray(list){
  //   let selectList = []
  //   list.map((value, index) => {
  //     if(value.select){
  //       selectList.push(index)
  //     } 
  //   })

  //   this.setData({
  //     selectList
  //   })
  // },

  /**
   * 递增指定的商品数量
   */
  addCount(e) {
    const {
      dataset: {
        index,
        specId,
        id
      }
    } = e.currentTarget

    let _this = this,
      goods = _this.data.list[index],
      order_total_price = _this.data.order_total_price;

    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    App._post_form('/user/cart/change', {
      id,
      original_spec_id: specId,
      num: goods.num++
    }, () => {
      // goods.total_num++;
      // _this.setData({
      //   ['list[' + index + ']']: goods,
      //   order_total_price: _this.mathadd(order_total_price, goods.goods_price)
      // });
    });
  },

  /**
   * 递减指定的商品数量
   */
  minusCount(e) {

    const {
      dataset: {
        index,
        specId,
        id
      }
    } = e.currentTarget
    let _this = this,
      goods = _this.data.goods_list[index],
      order_total_price = _this.data.order_total_price;

    if (goods.total_num > 1) {
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form('/user/cart/change', {
        goods_id: goods.goods_id,
        goods_sku_id: goodsSkuId
      }, () => {
        goods.total_num--;
        goods.total_num > 0 &&
          _this.setData({
            ['goods_list[' + index + ']']: goods,
            order_total_price: _this.mathsub(order_total_price, goods.goods_price)
          });
      });

    }
  },

  /**
   * 删除商品
   */
  del(e) {
    let _this = this,
      goods_id = e.currentTarget.dataset.goodsId,
      goodsSkuId = e.currentTarget.dataset.specId;

      console.log(e)
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前商品吗?",
      success(e) {
        e.confirm && App._post_form('/user/cart/del', {
          goods_id,
          spec_id: goodsSkuId
        }, function(result) {
          _this.getCartList();
        });
      }
    });
  },

  /**
   * 购物车结算
   */
  submit(t) {
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart'
    });
  },

  /**
   * 加法
   */
  mathadd(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  selectGoods(e){
    const {
      value
    } = e.detail

    const _this = this
    let { list } = this.data

    let select_cart = []

    value.map((item, key) => {
      select_cart.push({
        goods_id: list[item].goods_id,
        spec_id: list[item].goods_spec_id,
      })
    })
    // if(value.length > selectList.length){
    //   value.map((item, key) => {
    //     var res = selectList.find((val) => {
    //       return val == item
    //     })
  
    //     if(typeof(res == 'undefined')){
    //       selectValue = item
    //       selectList.push(item)
    //     }
    //   })
    // }else{
    //   selectList.map((item, key) => {
    //     var res = value.find((val) => {
    //       return item == val
    //     })
  
    //     if(typeof(res == 'undefined')){
    //       selectValue = item
    //       selectList.splice(key, 1)
    //     }
    //   })
    // }
    // return console.log(value)
    
    
    App._post('/user/cart/select', {
      select_cart
    }, () => {
      _this.getCartList();
    });
  },

  /**
   * 去购物
   */
  goShopping() {
    wx.switchTab({
      url: '../index/index',
    });
  },

})