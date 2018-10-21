// components/find-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array,
    loading: Boolean
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
    onTapToptic({detail}) {
      this.triggerEvent('toptic', detail)
    },
    onTapFollow({ detail}) {
      this.triggerEvent('follow', detail)
    },
    onTapSelect({detail}) {
      this.triggerEvent('select', detail)
    }
  }
})
