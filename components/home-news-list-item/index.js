// components/home-news-list-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object,
    index: Number,
    showMenu: Boolean
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
    handleTap(e) {
      this.triggerEvent('select', { ...e.detail, data: this.properties.data })
    },
    handleOpenMenu(e) {
      this.triggerEvent('openmenu', { ...e.detail, ...this.properties })
    } 
  }
})
