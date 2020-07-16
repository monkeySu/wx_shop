// pages/index/com/upload.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: {
      type: Number,
      value: 9
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    uploadImage() {
      let {
        imageList,
        count
      } = this.data

      const imgCount = count - imageList.length 

      wx.chooseImage({
        count: imgCount,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const list = res.tempFilePaths
          this.setData({
            imageList: imageList.concat(list)
          }, () => {
            this.onChange(list)
          })
        },
        fail: (err) => {

        }
      })
    },

    deleteImage(e) {
      console.log(e.currentTarget.dataset.index)
      const {
        dataset: {
          index
        }
      } = e.currentTarget
      let {imageList} = this.data
      imageList.splice(index, 1)

      this.setData({
        imageList
      })
    },

    onChange(file) {
      this.triggerEvent('onChange', {
        flieList: this.data.imageList,
        file
      })
    }
  }
})
