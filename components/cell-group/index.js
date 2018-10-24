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
    onSelect({detail}) {
      this.triggerEvent('select', detail)
    },
    onChange({ detail }) {
      this.triggerEvent('pickerchange', detail)
    },
    onCancel({ detail }) {
      this.triggerEvent('pickercancel', detail)
    }
  }
})
