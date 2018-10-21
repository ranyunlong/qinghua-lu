// components/search-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: String,
    value: null,
    showClear: Boolean,
    placeholderClass: String,
    placeholderStyle: String,
    button: String
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
    onInput(e){
      this.triggerEvent('input', { value: e.detail.value })
    },
    onClear() {
      this.triggerEvent('clear', {})
    },
    onTap() {
      this.triggerEvent('ok', {})
    },
    onConfirm(e) {
      this.triggerEvent('confirm', { value: e.detail.value })
    }
  }
})
