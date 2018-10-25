const apis = require('../../api/index.js')
const navigator = require('../../api/navigator.js')

// pages/mine/index.js
Page({
  data: {
    uid: null,
    userInfo: null,
    percent: 0,
    cellGroups1: [
      {
        title: '我的收藏',
        icon: 'collection',
        arrow: true,
        auth: true
      },
      {
        title: '我的话题',
        icon: 'message',
        arrow: true,
        auth: true
      },
      {
        title: '我的课程',
        icon: 'task',
        arrow: true,
        auth: true
      },
      {
        title: '个人设置',
        icon: 'setup',
        arrow: true,
        auth: true
      }
    ],
    cellGroups2: [
      {
        title: '入学考试',
        icon: 'document',
        arrow: true,
        auth: true
      },
      {
        title: '意见反馈',
        icon: 'brush',
        arrow: true
      }
    ]
  },

  // 设置授权用户信息
  setUserInfo({detail}) {
    // 登录后台
    apis.profluLogin().then(({uid}) => {
      const { nickName, avatarUrl, gender, city, province } = detail.userInfo
      // 更新用户信息
      apis.profluUpdateWxUserInfo({
        user_name: nickName,
        icon: avatarUrl,
        gender,
        city,
        province,
        uid
      }).then(res => {
        
        // Storage save user:info
        wx.setStorage({
          key: 'user:info',
          data: detail.userInfo,
        })

        if(uid) {
          // Update view
          this.setData({
            userInfo: detail.userInfo,
            uid
          })
        } else {
          // Update view
          this.setData({
            userInfo: detail.userInfo
          })
        }
        
      }) 
      .catch(e => {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        })
      })
    })
    .catch(err => {
      console.log(err)
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    })
  },
  
  handleSelect({detail}) {
    const { title, auth } = detail.item
    if (this.data.userInfo) {
      switch(title) {
        case '我的收藏':
          wx.navigateTo({
            url: 'collection/index'
          })
        break;
        case '个人设置':
          wx.navigateTo({
            url: 'setting/index'
          })
        break;
        case '我的话题': 
          wx.navigateTo({
            url: 'topic/index',
          })
        break;
        case '我的课程':
        wx.navigateTo({
          url: 'curriculum/index',
        }) 
        break;
        case '入学考试':
        wx.navigateTo({
          url: 'exam/index'
        })
        break;
        case '意见反馈':
          wx.navigateTo({
            url: 'feedback/index'
          })
        break;
      }
    } else if (auth) {
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