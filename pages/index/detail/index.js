// pages/index/detail/index.js

const apis = require('../../../api/index.js')
const { log } = console

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: null,
    recommend: null,
    iid: null,
    openid: null,
    scrollTop: 0,
    barItems: [
      {
        label: '收藏',
        icon: '/assets/icons/collection-defalut.png',
        iconActive: '/assets/icons/collection-active.png',
        active: false
      },
      {
        label: '点赞',
        icon: '/assets/icons/like-defalut.png',
        iconActive: '/assets/icons/like-active.png',
        active: false
      },
      {
        label: '分享',
        icon: '/assets/icons/share.png'
      },
      {
        label: '置顶',
        icon: '/assets/icons/back-top.png'
      }
    ]
  },

  onBarSelect({detail}) { 
    const { index, data } = detail
    const { iid, openid } = this.data

    // If not openid or iid
    if (!openid || !iid) return;

    // Get type 
    let type = data.active ? 1 : 0;

    switch(index) {
      case 0:
        // Check login state
        if (!apis.checkLogin()) return;
        
        apis
          .ArticleCollect(openid, iid, type).then(res => {
            const { barItems } = this.data
            // 设置收藏显示状态
            barItems[0].active = !data.active
            this.setData({ barItems})
            wx.showToast({
              title: barItems[0].active ? '收藏成功' : '已取消收藏'
            })
          }).catch(e => log(e))
      break;
      case 1:
        // Check login state
        if (!apis.checkLogin()) return;
        apis
          .ArticleUp(openid, iid, type).then(res => {
            const { barItems } = this.data
            // 设置收藏显示状态
            barItems[1].active = !data.active
            this.setData({ barItems })
            wx.showToast({
              title: barItems[1].active ? '收藏成功' : '已取消收藏'
            })
          }).catch(e => log(e))
      break;
      case 3: 
        wx.pageScrollTo({
          scrollTop: 0
        })
      break;
    } 
  },

  /**
   * 进入详情页
   */
  openDetailPage(e) {
    const { iid, algs } = e.detail.data
    wx.navigateTo({
      url: '/pages/index/detail/index?iid=' + iid + '&algs=' + algs
    })
  },

  // 显示图片预览
  showImageView({target}) {
    // 此处可添加用户行为分析
    const images = this.data.article.content.filter(k => {
      return k.type === 'img' && k.url.length > 0
    })
    wx.previewImage({
      current: target.dataset.src,
      urls: images.map(k => k.url),
    })
  },

  // 长按保存图片
  saveImage({target}) {
    // 此处可添加用户行为分析
    wx.showActionSheet({
      itemList: ['保存图片到相册'],
      success: ({tapIndex}) => {
        if (tapIndex === 0) {
          wx.saveImageToPhotosAlbum({
            filePath: target.dataset.src,
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // From options get iid
    const { iid } = options

    // From storage get openid
    const openid = wx.getStorageSync('openid')

    this.setData({
      ...options,
      iid,
      openid,
      currentIndex: 0
    })

    wx.showLoading({
      title: '加载中',
      mask: true
    })

    apis
    .getNewsDetailArticle(iid)
    .then(res=> {
      let { article, appConf } = res 
      console.log(article)
      article.content = JSON.parse(article.content)
      this.setData({
        article
      })
      wx.hideLoading()
    })
    .catch(e => log(e))

    // 获取推荐文章
    apis
      .getNewsRelated(iid, openid, 3).then(res => {
        this.setData({
          recommend: res
        })
      }).catch(err => log(err))

    // 检测该文章是否已收藏
    apis
      .getArticleCollect(openid).then(res => {
        if (!Array.isArray(res)) return;
        const result = res.filter(k => {
          return k.iid === iid
        })
        const { barItems } = this.data
        barItems[0].active = result.length > 0
        this.setData({ barItems})
      }).catch(err => log(err))

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
    const { title } = this.data.article
    return {
      title: `欢迎关注小程序-陆向谦推荐-为创业者提供最新的创业资讯`,
      desc: title,
      path: '/pages/index/index',
      success() {

      },
      fail() {

      }
    }
  }
})