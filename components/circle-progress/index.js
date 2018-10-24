// components/circle-progress/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size: { // 进度条的大小
      type: Number,
      value: 30
    },
    id: { // canvas 的id 默认使用 canvas + 时间戳 防止重复
      type: String,
      value: 'canvas' + new Date().getTime()
    },
    value: { // 进度值
      type: Number,
      value: 0,
      observer: '_draw'
    },
    duration: { // 持续时间
      type: Number,
      value: 1000
    },
    color: {
      type: String,
      value: '#17AFF8'
    },
    animation: {
      type: Boolean
    },
    lineWidth: { // 画笔的宽度
      type: Number,
      value: 2
    },
    frame: { // 动画的播放帧数 按秒计
      type: Number,
      value: 60
    },
    showPercent: Boolean,
    percentSize: {
      type: Number,
      value: 8
    }
  },

  ready() {
    this.setData({
      isReady: true
    })
    this.draw()
  },

  /**
   * 组件的初始数据
   */
  data: {
    isReady: false, // 页面渲染是否完成
    timer: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _draw(v, o) {
      const { isReady } = this.data
      if (!isReady) return;
      this.draw(o, v < o ? 'reduce' : 'plus')
    },
    draw(origin ,type = 'plus') {
      // value 进度条的值
      // duration动画的持续时间
      let { value, duration, animation, frame, timer, color } = this.properties
      if (!animation) return this.drawCircle(color, value);
      clearInterval(timer)
      frame = duration / 1000 * frame

      // 如果value不是数字
      if (typeof value !== 'number') throw new Error('value is not number');
      // 如果value 小于0 value = 0
      if (value < 0) value = 0;
      // 如果value 大于 100 value = 100
      if (value > 100) value = 100
      // 原始值
      let v = origin || 0

      if (type === 'plus') {
        // 步长
        let step = value / frame,
        // 动画的次数
        count = 0;
        clearInterval(timer)
        this.data.timer = timer = setInterval(() => {
          if (v >= value) clearInterval(timer)
          this.drawCircle(color, v)
          v += step
        }, duration / frame)
      } else if (type === 'reduce') {
        let step = origin / frame,
          // 动画的次数
          count = 0;
          clearInterval(timer)
          this.data.timer = timer = setInterval(() => {
            if (v <= value) clearInterval(timer)
            this.drawCircle(color, v)
            v -= step
          }, duration / frame)
      }
    },
    drawCircle(color, value) {
      let { id, size, lineWidth, showPercent, percentSize } = this.properties
      if (typeof value !=='number') throw new Error('value is not number')
      if (value < 0) value = 0
      if (value > 100) value = 100
      let step = 0
      step = value / 50
      let x, y, r;
      x = y = size / 2
      r = x - lineWidth
      const context = wx.createCanvasContext(id, this)
      context.beginPath();
      context.setLineWidth(lineWidth)
      context.setStrokeStyle('#ccc')
      context.arc(x, y, r, 0, 2 * Math.PI, false)
      context.stroke()
      context.beginPath();
      context.setStrokeStyle(color)
      context.arc(x, y, r, -Math.PI / 2, step * Math.PI - Math.PI / 2, false)
      context.stroke()
      if (showPercent) {
        context.beginPath();
        context.setFontSize(percentSize)
        const text = Math.floor(value) + '%'
        context.setLineWidth(0.5)
        context.setTextAlign('center')
        context.setTextBaseline('middle')
        context.strokeText(text, x, y, size)
      }
      context.draw()
    }
  }
})
