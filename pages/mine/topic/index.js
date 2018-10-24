const apis = require('../../../api/index.js')
const navigator = require('../../../api/navigator.js')
// pages/mine/topic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: [],
    loading: true
  },

  handlerSelect({detail}) {
    const { topic_id, title, icon } = detail.item
    navigator.to({
      url: '/pages/find/topic/index',
      data: { 
        topic_id, 
        topic_name: title, 
        icon, 
        mid: topic_id
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const uid = wx.getStorageSync('uid')
    wx.showLoading({
      title: '加载中'
    })
    apis.getMyTopics(uid).then(res => {
      if (Array.isArray(res)) {
        this.setData({
          loading: false,
          topics: res.map(k => {
            return { title: k.name, icon: k.icon, topic_id: k.topic_id, arrow: true, iconType: 'image' }
          })
        })
      }
      wx.hideLoading()
    }).catch(e => {
      this.setData({
        topics: [],
        loading: false
      })
      wx.hideLoading()
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