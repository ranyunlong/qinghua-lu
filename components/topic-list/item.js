// components/topic-list/item.js
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
    handleTapToptic() {
      this.triggerEvent('toptic', this.properties)
    },
    handleTapFollow() {
      this.triggerEvent('follow', this.properties)
    },
    handleTapSelect() {
      this.triggerEvent('select', this.properties)
    }
  }
})
