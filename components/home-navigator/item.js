// components/home-navigator/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
    index: Number,
    active: Boolean
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
    handleTap() {
      this.triggerEvent('select', {index: this.properties.index, item: this.properties.item})
    }
  }
})
