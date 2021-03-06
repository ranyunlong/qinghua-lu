// components/cell-group/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Array
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
    handleChange({ detail }) {
      this.triggerEvent('pickerchange', detail)
    },
    handleCancel({ detail }) {
      this.triggerEvent('pickercancel', detail)
    }
  }
})
