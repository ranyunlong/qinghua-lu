// components/detail-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array
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
    handleTap({detail}) {
      this.triggerEvent('select', detail)
    }
  }
})
