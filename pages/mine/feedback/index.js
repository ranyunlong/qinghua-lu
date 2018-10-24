const apis = require('../../../api/index.js')

// pages/mine/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    phone:''
  },


  handleTextChange({detail}) {
    this.setData({ text: detail.value})
  },
  handlePhoneChange({ detail}) {
    this.setData({ phone: detail.value })
  },
  handlerSubmit() {
    const { text } = this.data
    if (text) {
      const uid = wx.getStorageSync('uid')
      if (!uid) return;
      wx.showLoading({
        title: '提交中'
      })
      apis.submitFeedback(text).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功'
        })
      }).catch(e =>{
        wx.hideLoading()
        wx.showToast({
          title: '提交失败'
        })
      })
    }else {
      wx.showToast({
        title: '请输入您的意见或建议',
        icon: 'none'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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