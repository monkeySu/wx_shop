let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false, // 快捷导航

    user_name: '',
    region: '',
    tel_number: '',
    detail_info: '',

    error: '',
    
    addressList: [[],[],[]],
    
    addressCheck: [0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.id> 0) {
      const {
        address: {
          province,
          city,
          county,
          tel_number,
          user_name
        }
      } = app.globalData

      this.getRegion(province.id, 0, (res) => {
        this.getRegion(city.id, 1, (result) => {
          this.getRegion(county.id, 2)
        })
      })

      this.setData({
        tel_number,
        user_name
      })
    }else{
      this.getRegion(0, 0, (res) => {
        this.getRegion(res.list[0].id, 1, (result) => {
          this.getRegion(result.list[0].id, 2)
        })
      })
    }
  },

  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
      values = e.detail.value
      const {
        addressList,
        addressCheck
      } = this.data
      values.province_id = addressList[0][addressCheck[0]].id
      values.city_id = addressList[1][addressCheck[1]].id
      values.county_id =addressList[2][addressCheck[2]].id
    // 记录formId
    // App.saveFormId(e.detail.formId);

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    if(options.id> 0) {
      // 提交到后端
      App._post_form('/user/address/update', values, function(result) {
        App.showSuccess(result.msg, function() {
          wx.navigateBack();
        });
      }, false, function() {
        // 解除禁用
        _this.setData({
          disabled: false
        });
      });
    }else{
      // 提交到后端
      App._post_form('/user/address/add', values, function(result) {
        App.showSuccess(result.msg, function() {
          wx.navigateBack();
        });
      }, false, function() {
        // 解除禁用
        _this.setData({
          disabled: false
        });
      });
    }
    
  },

  //获取地理位置
  getRegion(pid, listId, callback) {
    const _this = this
    let addressList = this.data.addressList
    App._get('/user/address/region', {
      pid
    }, function(result) {
      addressList[listId] = result.data.list
      _this.setData({
        addressList
      });
      if(typeof(callback) == "function"){
        callback(result.data)
      }
    });
  },

  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.user_name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.tel_number.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.tel_number.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    // let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // if (!reg.test(values.phone)) {
    //   this.data.error = '手机号不符合要求';
    //   return false;
    // }
    // if (!this.data.region) {
    //   this.data.error = '省市区不能空';
    //   return false;
    // }
    if (values.detail_info === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 修改地区
   */
  bindRegionChange: function(e) {
    // this.setData({
    //   region: e.detail.value
    // })
  },

  bindRegionColumnChange(e) {
    const {
      column,
      value
    } = e.detail


    const {
      addressCheck,
      addressList
    } = this.data

    switch(column) {
      case 0:
        this.getRegion(addressList[column][value].id ,1, (res) => {
          this.getRegion(res.list[0].id, 2)
        })
        addressCheck[0] = value
        addressCheck[1] = 0
        addressCheck[2] = 0
        this.setData({
          addressCheck
        })
      break;
      case 1:
        this.getRegion(addressList[column][value].id ,2)
        addressCheck[1] = value
        addressCheck[2] = 0
        this.setData({
          addressCheck
        })
      break;
      case 2:
        addressCheck[2] = value
        this.setData({
          addressCheck
        })
      break;
  }


  }

})