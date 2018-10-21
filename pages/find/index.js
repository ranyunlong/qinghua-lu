const apis = require('../../api/index.js')
const { log } = console

// pages/find/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    topics: []
  },

  first: false,

  openTopicPage({detail}) {
    const { topic_id, mid, topic_name, icon } = detail.data
    wx.navigateTo({
      url: `topic/index?topic_id=${topic_id}&topic_name=${topic_name}&mid=${mid}&icon=${icon}`,
    })
  },

  // 打开文章详情页面
  openDetailPage(e) {
    const { mid } = e.detail.data
    wx.navigateTo({
      url: '/pages/index/detail/index?iid=' + mid
    })
  },  

  // 关注/取消关注
  onTapFollow({detail}) {
    if (!apis.checkLogin()) return;
    const { openid } = this.data 
    const { topic_id, collected } = detail.data
    const type = collected === 0 ? 1 : 0
    apis.followTopic(openid, topic_id, type)
      .then(res => {
        const index = detail.index
        const topics = this.data.topics
        topics[index].collected = type
        wx.showToast({
          title: type ? '取消关注成功' : '已关注'
        })
        this.setData({ topics })
      })
      .catch(e => log(e))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showLoading({
      title: '加载中'
    })
    // From stroage get openid
    const openid = wx.getStorageSync('openid')
    this.getTopics(openid)
  },

  getTopics(openid) {
    // Get Topics
    apis.getTopic(openid).then(res => {
      this.setData({
        openid,
        topics: res
      })
      wx.hideLoading()
    }).catch(e => log(e))
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
    // 防止首次加载多次
    if (this.first) {
      const { openid } = this.data
      this.getTopics(openid)
      return;
    }
    this.first = true
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