// components/input/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    // text || textarea || password || number
    type: {
      type: String,
      value: 'text'
    },
    disabled: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: ''
    },
    autofocus: {
      type: Boolean,
      value: false
    },
    mode: {
      type: String,
      value: 'normal'
    },
    right: {
      type: Boolean,
      value: false
    },
    error: {
      type: Boolean,
      value: false
    },
    maxlength: {
      type: Number
    },
    value: {
      type: String
    },
    confirmType: {
      type: String,
      value: 'done'
    }
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
    handleInputChange({detail}) {
      this.triggerEvent('change', detail);
    },

    handleInputFocus({ detail}) {
      this.triggerEvent('focus', detail);
    },

    handleInputBlur({ detail}) {
      this.triggerEvent('blur', detail);
    }
  }
})
