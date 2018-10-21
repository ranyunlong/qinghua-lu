// components/home-detail-bar/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: Number,
    data: Object
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
      this.triggerEvent('select', this.properties)
    }
  }
})
