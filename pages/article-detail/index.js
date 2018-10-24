// pages/index/detail/index.js

const apis = require('../../api/index.js')
const navigator = require('../../api/navigator.js')
const baidu = require('../../api/baidu.js')

let { baidu_ApiKey, baidu_SecretKey, baidu_Token } = getApp().globalData

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
    playing: false,
    barItems: [
      {
        label: '收藏',
        icon: '/assets/icons/collection-defalut.png',
        iconActive: '/assets/icons/collection-active.png',
        active: false
      },
      // {
      //   label: '点赞',
      //   icon: '/assets/icons/like-defalut.png',
      //   iconActive: '/assets/icons/like-active.png',
      //   active: false
      // },
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

  playIndex: 0,
  playTexts: [],
  pageIsHide: false,

  // 播放文章事件

  onPlay() {
    const { title, content } = this.data.article
    const audio = wx.getBackgroundAudioManager()
    const host = 'http://tsn.baidu.com/text2audio?'
    const settings = wx.getStorageSync('user:settings')
    
    // per ['1普通女声', '2普通男声', '3性感男性', '4可爱女生']
    const args = {
      lan: 'zh',
      ctp: 1,
      cuid: 'abcdxxx',
      tok: baidu_Token,
      tex: '',
      vol: 9,
      per: 5,
      spd: 5,
      pit: 5
    }

    if (typeof settings === 'object') {
      switch (settings.reader) {
        case '普通女声':
          args.per = 0
        break;
        case '普通男声':
          args.per = 1
        break;
        case '性感男性':
          args.per = 3
        break;
        case '可爱女声':
          args.per = 4
        break;  
        default:
          args.per = 0
      }
    }

    this.playTexts = content.filter(k => {
      return k.type === 'paragraphs' && k.content.length > 0
    }).map(k => k.content)

    const play = () => {
      args.tex = this.playTexts[this.playIndex]
      const dataUrl = host + navigator.qs(args)
      wx.playBackgroundAudio({
        dataUrl,
        title
      })
    }

    const next = () => {
      if (this.pageIsHide) return;
      if (this.playIndex >= this.playTexts.length - 1) return;
      this.playIndex++;
      play()
    }

    // On stop
    wx.onBackgroundAudioStop(next)

    // Check is playing
    if (!this.data.playing) {
      if (!audio.src) {
        play()
      } else {
        audio.play()
      }
      // Update view
      this.setData({
        playing: true
      })
    } else {
      // Update view
      this.setData({
        playing: false
      })
      audio.pause()
    }
  },

  // 工具栏选择时间
  onBarSelect({detail}) { 
    const { index, data } = detail
    const { iid, openid } = this.data

    // If not openid or iid
    if (!openid || !iid) return;

    // Get type 
    let type = data.active ? 1 : 0;
    switch (data.label) {
      case '收藏':
        // Check login state
        if (!apis.checkLogin()) return;
        
        apis
          .ArticleCollect(openid, iid, type).then(res => {
            const { barItems } = this.data
            // 设置收藏显示状态
            barItems[index].active = !data.active
            this.setData({ barItems})
            wx.showToast({
              title: barItems[index].active ? '收藏成功' : '已取消收藏'
            })
          }).catch(e => log(e))
      break;
      case '点赞':
        // Check login state
        if (!apis.checkLogin()) return;
        apis
          .ArticleUp(openid, iid, type).then(res => {
            const { barItems } = this.data
            // 设置收藏显示状态
            barItems[index].active = !data.active
            this.setData({ barItems })
            wx.showToast({
              title: barItems[index].active ? '点赞成功' : '已取消点赞'
            })
          }).catch(e => log(e))
      break;
      case '分享':
        wx.showLoading({
          title: '分享生成中'
        })
        const { article } = this.data
        
        const { title, pubTimeStr, soureName, content } = article
        const text = content.filter(k => {
          return k.type === 'paragraphs'
        }).map(k => {
          return k.content
        }).join('')
        const path = this.route
        apis.getShareArticlePhoto(title, pubTimeStr, soureName, path, text)
          .then(res=> {
            wx.hideLoading()
            if (res)  {
              console.log(res)
              wx.previewImage({
                urls: [res]
              })
            }
          })
          .catch(e =>{
            wx.hideLoading()
          })
      break;
      case '置顶': 
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
    navigator.openArticleDetailPage({iid, algs})
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
    // Get baidu tk
    baidu()
    .then(res => {
      baidu_Token = res.data.access_token
    })
    .catch(e => log(e))

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
    this.pageIsHide = false
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.pageIsHide = true
    wx.stopBackgroundAudio()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.pageIsHide = true
    wx.stopBackgroundAudio()
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