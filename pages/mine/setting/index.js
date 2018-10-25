// pages/mine/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    settings: {},
    cellGroups1: []
  },

  handlePickerChange({detail}) {
    const { cellGroups1, settings } = this.data
    const result = cellGroups1.map(k => {
      if (k.title === '朗读设置') {
        k.value = detail.selected
      }
      return k
    })
    this.setData({ cellGroups1: result })
    settings.reader = detail.selected
    wx.setStorage({
      key: 'user:settings',
      data: settings,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const settings = wx.getStorageSync('user:settings')
    const reader = {
      title: '朗读设置',
      icon: 'systemprompt',
      arrow: true,
      auth: true,
      value: '普通女声',
      type: 'picker',
      pickerRange: ['普通女声', '普通男声', '性感男性', '可爱女声']
    }
    if (settings) {
      this.setData({ settings })
      if (settings.reader) reader.value = settings.reader
    }

    this.setData({
      cellGroups1: [reader] 
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})