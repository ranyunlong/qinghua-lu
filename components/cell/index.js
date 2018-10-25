// components/cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: Object,
    icon: String,
    arrow: Boolean,
    arrowDirection: String,
    navigateTo: String,
    title: String,
    value: String,
    type: String,
    pickerMode: String,
    pickerRange: Array,
    pickerRangeKey: String,
    disabled: Boolean,
    iconType: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerIndex: 0
  },

  ready() {
    const { pickerRange, value, type } = this.properties
    if (Array.isArray(pickerRange) && type === 'picker') {
      this.setData({
        pickerIndex: pickerRange.indexOf(value)
      })
    }
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap() {
      this.triggerEvent('select', this.properties)
      if (this.properties.navigateTo) {
        wx.navigateTo({
          url: this.properties.navigateTo
        })
      }
    },
    handleChange({detail}) {
      this.triggerEvent('pickerchange', { 
        ...detail, 
        origin: this.properties.pickerRange, 
        selected: this.properties.pickerRange[detail.value]
      })
    },
    handleCancel({detail}) {
      this.triggerEvent('pickercancel', detail)
    }
  }
})
