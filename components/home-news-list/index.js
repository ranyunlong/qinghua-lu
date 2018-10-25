// components/home-news-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array,
    loading: Boolean,
    showMenu: Boolean,
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
    handleSelect({detail}) {
      this.triggerEvent('select', detail)
    },
    handleOpenMenu({detail}) {
      this.triggerEvent('openmenu', detail)
    },
    handleScrollToLower({detail}){
      this.triggerEvent('scrolltolower', detail)
    },
    handleScrollToUpper({detail}) {
      this.triggerEvent('scrolltoupper', detail)
    },
    handleScroll({detail}) {
      this.triggerEvent('scroll', detail)
    }
  }
})
