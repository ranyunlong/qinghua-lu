const apis = require('../../api/index.js')

// pages/mine/index.js
Page({
  data: {
    uid: null,
    userInfo: null,
    percent: 0,
    cellGroups1: [
      {
        title: '我的收藏',
        icon: '../../assets/icons/collection.png',
        arrow: true
      },
      {
        title: '我的话题',
        icon: '../../assets/icons/topic.png',
        arrow: true
      },
      {
        title: '我的课程',
        icon: '../../assets/icons/curriculum.png',
        arrow: true
      }
    ],
    cellGroups2: [
      {
        title: '入学考试',
        icon: '../../assets/icons/test.png',
        arrow: true
      },
      {
        title: '意见反馈',
        icon: '../../assets/icons/feedback.png',
        arrow: true
      }
    ]
  },

  // 设置授权用户信息
  setUserInfo(e) {
    // 登录后台
    apis.profluLogin().then(res => {
      this.setData({
        userInfo: e.detail.userInfo,
        uid: res.uid
      })
      wx.setStorage({
        key: 'user:info',
        data: e.detail.userInfo,
      })
    })
    .catch(err => {
      this.setData({
        userInfo: e.detail.userInfo
      })
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    })
  },
  
  onSelect({detail}) {
    const { title } = detail
    if (this.data.userInfo) {
      switch(title) {
        case '我的收藏':
          wx.navigateTo({
            url: 'collection/index'
          })
        break;
      }
    } else {
      wx.showModal({
        title: '提示！',
        content: '请登录后操作。'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('user:info')
    if (userInfo) {
      // 设置用户信息
      this.setData({ userInfo })
      this.setUserInfo({ detail: { userInfo}})
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
  onPullDownRefresh: function (e) {
    console.log(e)
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