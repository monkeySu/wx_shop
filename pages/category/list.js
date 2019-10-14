let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    scrollHeight: null,
    showView: false,
    arrange: "",

    sortType: 'all',    // 排序类型
    sortPrice: false,   // 价格从低到高

    option: {},
    list: {},

    noList: true,
    no_more: false,

    page: 1,

    pageData: {
      current_page: 0,
      page_count: 1
    },

    showSlide: false,
    isnew: 0,
    
    categorySelect: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;

    // 设置商品列表高度
    _this.setListHeight();

    // 记录option
    _this.setData({ option}, function () {
      // 获取商品列表
      _this.getCategory()
      _this.getGoodsList(true);
    });

  },

  // 获取分类
  getCategory() {
    App._get('/category', {}, (res) => {
      this.setData({
        categoryList: res.data.list
      })
    })
  },

  /**
   * 获取商品列表
   */
  getGoodsList: function (is_super, page) {
    let _this = this;
    let {
      pageData: {
        current_page,
        page_count
      },
      list,
      isnew
    } = _this.data

    current_page+=1

    if(current_page>page_count) {
      wx.showToast({
        title: '没有更多咯~',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });

      return false  
    }
    App._get('/category/list', {
      page: page || 1,
      isnew,
      price: _this.data.sortPrice ? 1: 0,
      category_id: _this.data.option.category_id || 0,
      search: _this.data.option.search || '',
    }, function (result) {
      console.log(result)
      if(result.code===0){
        

        _this.setData({
          list: current_page==1?result.data.list:list.concat(result.data.list),
          pageData: {
            ...result.data.page_data
          }
        })
      }
    });
  },

  // 展示侧边栏
  showSlide(){
    this.setData({
      showSlide: true
    })
  },

  closeSlide() {
    this.setData({
      showSlide: false
    })
  },

  // 选择分类
  selectCategory(e) {
    const {
      dataset: {
        id,
        index
      }
    } = e.currentTarget

    const {
      categorySelect
    } = this.data

    if(categorySelect[index] == id){
      delete categorySelect[index]
    }else{
      categorySelect[index] = id
    }
    this.setData({
      categorySelect
    })
    console.log(categorySelect, id)
  },

  // 确定搜索
  confirm(){
    this.closeSlide()
  },

  // 重置分类
  reset() {
    this.setData({
      categorySelect: {}
    })
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;



    _this.setData({
      list: {},
      page: 1,
      isnew: newSortType=="new"?1:0,
      sortType: newSortType,
      sortPrice: newSortPrice
    }, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });
  },

  /**
   * 跳转筛选
   */
  toSynthesize: function (t) {
    wx.navigateTo({
      url: "../category/screen?objectId="
    });
  },

  
  /**
   * 切换列表显示方式
   */
  onChangeShowState: function () {
    let _this = this;
    _this.setData({
      showView: !_this.data.showView,
      arrange: _this.data.arrange ? "" : "arrange"
    });
  },

  // 选中分类

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    let {
      pageData: {
        current_page,
        page_count
      },
      list
    } = _this.data

    current_page+=1

    if(current_page>page_count) {
      this.setData({ no_more: true });

      wx.showToast({
        title: '没有更多咯~',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });

      return false  
    }
    this.getGoodsList(false);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function () {
    return {
      title: "全部分类",
      desc: "",
      path: "/pages/category/index"
    };
  },

});
