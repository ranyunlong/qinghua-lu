// components/home-news-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array,
    loading: Boolean,
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
    select(e) {
      this.triggerEvent('select', { ...e.detail })
    },
    onFeedBack(e) {
      this.triggerEvent('feedback', { ...e.detail })
    }
  }
})
