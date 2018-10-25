const apis = require('../../../api/index.js')
const navigator = require('../../../api/navigator.js')
const { log } = console

// pages/find/topic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic_id: null,
    mid: null,
    topic_name: null,
    icon: null,
    collected: 0,
    topicList: []
  },


  /**
   * Handle follow & unfollow
   */
  handleTapFollow() {
    if (!apis.checkLogin()) return;
    const { topic_id, collected } = this.data
    const type = collected === 0 ? 1 : 0
    const uid = wx.getStorageSync('uid')
    apis.followTopic(uid, topic_id, type)
      .then(res => {
        wx.showToast({
          title: type ? '取消关注成功' : '已关注'
        })
        this.setData({ collected: type })
      })
      .catch(e => log(e))
  },
  
  /**
   * Open to article detail page
   */
  openDetailPage(e) {
    const { iid, algs } = e.detail.data
    navigator.openArticleDetailPage({ iid, algs})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
    this.setData(options)
    const { topic_id, mid, topic_name, icon } = options
    // From storage get openid
    const openid = wx.getStorageSync('openid')
    if (!openid) return;

    // Get topic detail & topics
    Promise.all([apis.getTopicDetail(openid, topic_id), apis.getTopics(openid, topic_id)])
    .then(res => {
      const [{ collected }, topicList] = res
      this.setData({
        collected,
        topicList,
        openid
      })
      wx.hideLoading()
    })
    .catch(e => log(e))
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