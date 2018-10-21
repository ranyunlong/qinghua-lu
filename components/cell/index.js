// components/cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: String,
    arrow: Boolean,
    arrowDirection: String,
    navigateTo: String,
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap() {
      this.triggerEvent('select',this.properties)
      if (this.properties.navigateTo) {
        wx.navigateTo({
          url: this.properties.navigateTo
        })
      }
    }
  }
})
