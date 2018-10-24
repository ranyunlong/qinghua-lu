// components/home-news-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array,
    loading: Boolean,
    feedback: Boolean,
    scrollY: Boolean,
    scrollX: Boolean,
    enableBackToTop: Boolean,
    scrollWithAnimation: Boolean,
    scrollIntoView: Boolean,
    scrollTop: Number,
    scrollLeft: Number,
    upperThreshold: Number,
    lowerThreshold: Number
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
    select({detail}) {
      this.triggerEvent('select', detail)
    },
    onFeedBack({detail}) {
      this.triggerEvent('feedback', detail)
    },
    onScrollToLower({detail}){
      this.triggerEvent('scrolltolower', detail)
    },
    onScrollToUpper({detail}) {
      this.triggerEvent('scrolltoupper', detail)
    },
    onScroll({detail}) {
      this.triggerEvent('scroll', detail)
    }
  }
})
