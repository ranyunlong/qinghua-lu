const apis = require('../../../api/index.js')
const navigator = require('../../../api/navigator.js')
const { log } = console

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: null,
    collectList: [],
    loading: true
  },
  

  /**
   * Open article detail page
   */
  openDetailPage({detail}) {
    const { iid, algs } = detail.data
    navigator.openArticleDetailPage({iid, algs})
  },

  // Handle list arrow down menu
  handleOpenMenu({detail}) {
    const uid = wx.getStorageSync('uid')
    const { data, index } = detail
    const { iid, type } = data
    wx.showActionSheet({
      itemList: ['取消收藏'],
      success: ({tapIndex}) => {
        if (!tapIndex) {
          // Cancel collect
          apis
            .ArticleCollect(uid, iid, 1).then(res => {
              // Tips
              wx.showToast({
                title: '取消成功'
              })
              
              // Update view
              const { collectList } = this.data
              collectList.splice(index, 1)
              this.setData({collectList})
            }).catch(e => {
              // Handle error
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              })
            })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // Get article collect
    const uid = wx.getStorageSync('uid')
    const openid = wx.getStorageSync('openid')
    apis.getArticleCollect(uid).then(res => {
      this.setData({
        openid,
        collectList: res,
        loading: false
      })
    }).catch(e => {
      // Handle error
      this.setData({
        openid,
        collectList: [],
        loading: false
      })
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