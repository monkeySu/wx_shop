// components/model/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modal: {
      type: Object,
      value: {},
      observer: function(newVal) {
        console.log(newVal)
        this.setData({
          value: {
            ...this.data.value,
            ...newVal
          }
        })
      }
    },

    isShow: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: {
      cancelText: '取消',
      confirmText: '确定',
      desc: '',
      title: '提示',
      type: 'tip'
    },

    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: true,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: true,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "90rpx",//输入框高度
      width: "495rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    },

    passWord: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {
      this.setData({
        isShow: false
      })

      this.triggerEvent('cancel')
    },

    confirm() {
      const {
        value,
        passWord
      } = this.data

      let val = ""
      if(value.type == 'pay'){
        if(passWord.length<6){
          wx.showToast({
            title: '请先输入支付密码',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
            success: (result)=>{
              
            },
            fail: ()=>{},
            complete: ()=>{}
          });
          return false
        }
        val = passWord
      }
      this.triggerEvent('confirm', {val})
      this.data.passWord = ""
    },

    valueSix(e) {
      console.log(e.detail)
      this.data.passWord = e.detail
    }
  }
})
