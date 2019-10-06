//index.js
//获取应用实例
const App = getApp()

Page({
  data: {
    step: 1,
    password: '',
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "98rpx",//输入框高度
      width: "604rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    }
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix(e) {
    console.log(e)
    const {
      step,
      inputData,
      password
    } = this.data

    const {
      detail
    } = e

    console.log(step)
    // 模态交互效果
    if(step == 1) {
      this.setData({
        inputData: {
          ...inputData,
          input_value: '',
        },
        password: detail,
        step: 2
      })
    }else if(step == 2){
      // if(password == detail){
        // 密码正确处理
        App._post_form('/user/passwd/create-pay', {
          passwd: password,
          passwd_repeat: detail
        }, function(result) {
          App.showSuccess(result.msg);
          // _this.setData(result.data);
        });
      // }else{
      //   wx.showToast({
      //     title: '密码不一致，请重新输入',
      //     icon: 'none',
      //     duration: 2000
      //   })
      //   this.setData({
      //     inputData: {
      //       ...inputData,
      //       input_value: '',
      //     },
      //     password: '',
      //     step: 1
      //   })
      // }
    }
    
    
  },

  onload: function () {
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
      }
    })
  }

})
