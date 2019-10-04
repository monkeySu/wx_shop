let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航

    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格

    detail: {}, // 商品详情信息
    goods_price: 0, // 商品价格
    line_price: 0, // 划线价格
    stock_num: 0, // 库存数量

    goods_num: 1, // 商品数量
    goods_sku_id: 0, // 规格id
    cart_total_num: 0, // 购物车商品总数量
    specData: {}, // 多规格信息

    spec_id: '', //规格id
  },

  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 商品id
    _this.data.goods_id = options.goods_id;
    // 获取商品信息
    _this.getGoodsDetail();
  },

  /**
   * 获取商品信息
   */
  getGoodsDetail() {
    let _this = this;
    App._get('/goods', {
      id: _this.data.goods_id
    }, function(result) {
      // 初始化商品详情数据
      let data = _this.initGoodsDetailData(result.data);
      console.log(data)
      _this.setData(data);
    });
  },

  /**
   * 初始化商品详情数据
   */
  initGoodsDetailData(data) {
    let _this = this;
    // 富文本转码
    if (data.content.length > 0) {
      wxParse.wxParse('content', 'html', data.content, _this, 0);
    }
    // 商品价格/划线价/库存
    // data.goods_sku_id = data.detail.spec[0].spec_sku_id;
    // data.goods_price = data.detail.spec[0].goods_price;
    // data.line_price = data.detail.spec[0].line_price;
    // data.stock_num = data.detail.spec[0].stock_num;
    // 初始化商品多规格
    // if (data.spec_attr == 20) {
      // data.spec_attr = _this.initManySpecData(data);
    // }
    return data;
  },

  /**
   * 初始化商品多规格
   */
  initManySpecData(data) {
    for (let i in data.spec_attr) {
      for (let j in data.spec_attr[i].items) {
        if (j < 1) {
          data.spec_attr[i].items[0].checked = true;
          this.goods_spec_arr[i] = data.spec_attr[i].spec_items[0].item_id;
        }
      }
    }
    return data;
  },

  /**
   * 点击切换不同规格
   */
  modelTap(e) {
    let attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      spec_attr = this.data.spec_attr,
      selectId = '';

    for (let i in spec_attr) {
      for (let j in spec_attr[i].items) {
        if (attrIdx == i) {
          spec_attr[i].items[j].checked = false;
          selectId = `${spec_attr[i].id}_${spec_attr[i].items[j].id}`
          if (itemIdx == j) {
            spec_attr[i].items[itemIdx].checked = true;
            this.goods_spec_arr[i] = spec_attr[i].items[itemIdx].id;
          }
        }
      }
    }
    this.setData({
      spec_attr
    });
    // console.log(attrIdx, itemIdx,selectId)

    // 更新商品规格信息
    this.updateSpecGoods(selectId);
  },

  /**
   * 更新商品规格信息
   */
  updateSpecGoods() {
    let spec_sku_id = this.goods_spec_arr.join('_');
    console.log(spec_sku_id)
    // 查找skuItem
    // let goods_spec = this.data.goods_spec,
    //   skuItem = goods_spec.find((val) => {
    //     return val.spec_sku_id == spec_sku_id;
    //   });

    // 记录goods_sku_id
    // 更新商品价格、划线价、库存

    // console.log(skuItem)
    if (this.data.goods_spec[spec_sku_id]) {

      const {
            price,
            integral_price,
            stock_num,
            id
          } = this.data.goods_spec[spec_sku_id]

      this.setData({
        price,
        integral_price,
        stock_num,
        spec_id: id
      });
    }
    // if(this.data.goods_spec[selectId]){
    //   const {
    //     price,
    //     integral_price,
    //     stock_num,
    //     id
    //   } = this.data.goods_spec[selectId]
  
    //   this.setData({
    //     price,
    //     integral_price,
    //     stock_num,
    //     spec_id: id
    //   });
    // }
    
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState() {
    this.setData({
      showView: !this.data.showView
    });
  },

  /**
   * 返回顶部
   */
  goTop(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  up() {
    this.setData({
      goods_num: ++this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  down() {
    if (this.data.goods_num > 1) {
      this.setData({
        goods_num: --this.data.goods_num
      });
    }
  },

  /**
   * 跳转购物车页面
   */
  flowCart: function () {
    wx.switchTab({
      url: "../flow/index"
    });
  },

  /**
   * 加入购物车and立即购买
   */
  submit(e) {
    let _this = this,
      submitType = e.currentTarget.dataset.type;
    const {
      spec_id,
      goods_id
    } = this.data
    if (submitType === 'buyNow') {
      // 立即购买
      wx.navigateTo({
        url: '../flow/checkout?' + App.urlEncode({
          order_type: 'buyNow',
          goods_id: _this.data.goods_id,
          goods_num: _this.data.goods_num,
          goods_sku_id: _this.data.goods_sku_id,
        })
      });
    } else if (submitType === 'addCart') {
      // 加入购物车
      App._post_form('/user/cart/add', {
        spec_id,
        id: goods_id
      }, function(result) {
        App.showSuccess(result.msg);
        _this.setData(result.data);
      });
    }
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function() {
    // 构建页面参数
    let _this = this;
    return {
      title: _this.data.detail.goods_name,
      path: "/pages/goods/index?goods_id=" + _this.data.goods_id
    };
  },

})