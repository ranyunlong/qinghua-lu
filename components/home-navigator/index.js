// components/home-navigator/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array,
    current: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollIntoView: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      this.triggerEvent('change', {
        index: e.detail.index,
        data: e.detail.item
      })
    },
    onSearch() {
      this.triggerEvent('searchtap', {})
    }
  }
})
