const apis = require('../../../api/index.js')
const navigator = require('../../../api/navigator.js')
const { log } = console
// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: '',
    searchList: null,
    openid: null,
    keywords: null,
    st: 1,
    loading: false,
    history: []
  },
  setSearch({detail}) {
    this.setData({
      search: detail.title
    })
    this.handleSearch(this.data.openid, detail.title)
  },

  /**
   * Handle event input
   */
  handleInput({ detail}) {
    const { value } = 
    this.setData({
      search: value
    })
    if (value === '' || !value) {
      this.setData({
        searchList: null
      })
      return;
    }
    const openid = wx.getStorageSync('openid')
    if (openid) {
      this.handleSearch(openid, value)
    } else {
      apis.getWxCodeOpenid().then(res=> {
        wx.setStorageSync('openid', res.openid)
        this.handleSearch(res.openid, detail.value)
      }).catch(err => log(err))
    }
  },

  /**
   * Handle event search
   */
  handleSearch(openid, keywords) {
    wx.showLoading({
      title: '搜索中',
      mask: true
    })
    apis.articleSearch(openid, keywords)
    .then(res=> {
      this.setData({
        searchList: res,
        keywords,
        openid,
        st: 0
      })
      wx.hideLoading()
      this.setHistory(keywords)
    })
    .catch(err => log(err))
  },
  
  /**
   * Handle event clear
   */
  handleClear(e) {
    this.setData({
      search: ''
    })
    this.handleInput({detail:{value:''}})
  },

  /**
   * Handle event setHistory
   */
  setHistory(value) {
    let { history } = this.data
    let repeat = false
    if (!Array.isArray(history)) history = []
    history.forEach(k => {
      if (k.title === value) repeat = true
    })
    if (!repeat) history.unshift({ title: value })
    const his = history.reverse().slice(0, 10).reverse()
    this.setData({
      history: his
    })
    wx.setStorage({
      key: 'search:history',
      data: his,
    })
  },
  clearHistory() {
    wx.setStorage({
      key: 'search:history',
      data: [],
    })
    this.setData({
      history: []
    })
  },

  /**
   * 进入详情页
   */
  openDetailPage(e) {
    const { iid, algs } = e.detail.data
    navigator.openArticleDetailPage({iid, algs})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const history = wx.getStorageSync('search:history')
    if (Array.isArray(history)) {
      this.setData({
        history
      })
    }
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
    const { keywords, openid, st, loading } = this.data
    // 防止重复刷新
    if (loading) return;
    this.setData({
      loading: true,
      st: st + 1
    })
    apis.articleSearch(openid, keywords, st + 1)
      .then(res => {
        if (res.length > 0) {
          this.setData({
            searchList: [...this.data.searchList, ...res],
          })
        } else {
          wx.showToast({
            title: '没有内容了！',
            icon: 'none'
          })
        }
        this.setData({
          loading: false
        })
      })
      .catch(err => {
        this.setData({
          loading: false
        })
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})