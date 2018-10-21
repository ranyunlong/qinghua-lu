// components/home-news-list-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object,
    index: Number,
    feedback: Boolean
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
    ontap(e) {
      this.triggerEvent('select', { ...e.detail, data: this.properties.data })
    },
    onFeedBack(e) {
      this.triggerEvent('feedback', { ...e.detail, ...this.properties })
    } 
  }
})
