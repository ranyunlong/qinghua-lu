const apis = require('../../api/index.js')
const navigator = require('../../api/navigator.js')

const { log } = console 

Page({
  data: {
    columns: [],
    cid: null,
    openid: null,
    wxCode: null,
    contents: {},
    cidIndex: 0,
    contentsLoading: false,
    refreshing: false
  },

  onFeedBack({detail}) {
    const { cid, contents, openid } = this.data

    wx.showActionSheet({
      itemList: ['内容太差', '对内容不感兴趣'],
      success:(res) => {
        const { tapIndex } = res
        const uid = wx.getStorageSync('uid')
        const { iid } = detail.data
        if (!uid) {
          // 检测是否提示过登录 false为需要提示
          if (!wx.getStorageSync('setting:confirm:login')) {
            wx.showModal({
              title: '提示!',
              content: '您可以前往“个人中心”登录后,即可获取更喜爱的新闻资讯！',
              cancelText: "不，谢谢",
              confirmText: "去登录",
              success(res) {
                const { confirm } = res
                if (confirm) {
                  wx.switchTab({
                    url: "/pages/mine/index"
                  })
                }
              }
            })
            wx.setStorage({
              key: 'setting:confirm:login',
              data: true,
            })
          } 
        } else {
          if(tapIndex === 1) {
            apis.articleFeedBackDislike(uid, iid)
            .then(res => {
              log(res)
            })
            .catch(e => log(e))
          }
        }

        if (tapIndex === 0) {
          apis.articleFeedBackDown(uid, openid, iid)
          .then(res => {
            log(res)
          })
          .catch(e => log(e))
        }

        return;
        
        // 删除用户不敢兴趣的类容
        contents[cid].splice(detail.index, 1)
        this.setData({contents})

        // 重新设置本地存储
        wx.setStorage({
          key: 'home:Contents',
          data: contents,
        })
      },
      fail() {

      }
    })
  },

  openSearchPage(e) {
    wx.navigateTo({
      url: '/pages/index/search/index'
    })
  },

  openDetailPage(e) {
    const { iid, algs } = e.detail.data
    navigator.openArticleDetailPage({iid, algs})
  },

  onSwiperChange({ detail}) {
    const { current } = detail
    const { columns } = this.data
    const cid = columns[current].id
    this.setData({
      cidIndex: current,
      cid
    })

    if (!this.data.contents[cid]) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      return this.getContents(cid, this.data.openid)
    }
  },

  onNavigatorChange({detail}) {
    const { data, index } = detail
    this.setData({
      cid: data.id,
      cidIndex: index,
      contentsLoading: false
    })
    if (!this.data.contents[data.id]){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      return this.getContents(data.id, this.data.openid)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // Get navigators & wxCode & openid
    Promise.all([apis.getHomeNavigators(), apis.getWxCodeOpenid()]).then(res => {
      const [navigators, codeAndOpenid] = res
      const { cid, columns } = navigators
      const { code, openid } = codeAndOpenid
      this.setData({
        ...navigators,
        ...codeAndOpenid
      })
      const homeContents = wx.getStorageSync('home:Contents')
      if (!homeContents) {
        this.getContents(cid, openid)
      } else {
        this.setData({
          contents: homeContents
        })
        wx.hideLoading()
      }

    }).catch(e => {
      wx.hideLoading()
    })
  },

  getContents(cid, openid, refresh) {
    let { contents } = this.data
    if (contents[cid] && !refresh) {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      return;
    }
    // Get Contents
    apis.getHomeContents(cid, openid).then(res => {
      contents[cid] = res
      this.setData({
        contents
      })
      this.setData({ refreshing: false })
      wx.setStorageSync('home:Contents', this.data.contents)
      wx.hideLoading()
      wx.stopPullDownRefresh()
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
    if (this.data.refreshing) return;
    this.setData({refreshing: true})
    const { cid, openid} = this.data
    wx.showLoading({
      title: '更新中',
      mask: true
    })
    this.getContents(cid, openid, this.data.refreshing)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 防止重复并发请求
    if (this.data.contentsLoading) return;
    this.setData({contentsLoading: true})

    const { cid, openid } = this.data
    apis.getHomeContents(cid, openid).then(res => {
      const contents = this.data.contents
      contents[cid].push(...res)
      this.setData({
        contents,
        contentsLoading: false
      })
    }).catch(e => log(e))

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '陆向谦推荐',
      desc: '为创业者提供最新的创业资讯',
      path: '/pages/index/index',
      success(){

      },
      fail(){

      }
    }
  }
})