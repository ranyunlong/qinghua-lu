const botHost = 'https://api.botbrain.ai'
const botbrainHost = 'https://cloud.botbrain.ai'
const bkdbrainHost = 'https://bkd.botbrain.ai'
const profluHost = 'https://wxapp.proflu.cn'
const appid = 'RVCQS9UR56'


function baseRequest(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      success(e) {
        resolve(e)
      },
      fail(e) {
        reject(e)
      }
    })
  })
}


/**
 * @api getHomeNavigators
 * @author <>
 * 获取首页栏目
 */
function getHomeNavigators() {
  return new Promise((resolve, reject) => {
    baseRequest(botbrainHost + '/config/v1/RVCQS9UR56', {appid})
    .then(res=>{
      resolve({
        columns: res.data.data.columns,
        cid: res.data.data.columns[0].id
      })
      }).catch( err => reject(err))
  })
}




/**
 * @api getHomeContents
 * @author <>
 * 获取首页内容
 * @param { Number } column_id
 * @param { String } openid
 */
 function getHomeContents(column_id, uid) {
  return new Promise((reslove, reject) => {
    baseRequest(botbrainHost + '/rec/v1/RVCQS9UR56/feed/', {
      column_id,
      uid
    })
    .then(res => reslove(res.data.data.items))
    .catch(err => reject(err))
  })
}


/**
 * @api getBotbrainOpenid
 * @author <>
 * 获取botbrain openid
 * @param { string } code wx.login() code
 */
function getBotbrainOpenid(code) {
  return new Promise((reslove, reject) => {
    const openid = wx.getStorageSync('openid')
    if (openid) {
      reslove(openid)
      return;
    }
    baseRequest(bkdbrainHost + '/wx/auth/login.json', {
      appid,
      jsCode: code,
      preview: false
    })
    .then(res => {
      const { openid } = res.data.data
      wx.setStorageSync('openid', openid)
      reslove(openid)
    })
      .catch(err => reject(err))
    
  })
}



/**
 * @api getWxCodeOpenid
 * @author <>
 * 获取微信code和openid
 */
function getWxCodeOpenid() {
  return new Promise((resolve, reject) => {
    // From storage get wxCode
    const wxCode = wx.getStorageSync('wxCode')
    
    if (wxCode) {
      getBotbrainOpenid(wxCode).then(openid => {
        resolve({
          code: wxCode,
          openid
        })
      }).catch(e => reject(e))
      return;
    }
    wx.login({
      success(e) {
        const { code } = e
        wx.setStorageSync('wxCode', code)
        getBotbrainOpenid(code).then(openid => {
          resolve({
            code,
            openid
          })
        }).catch(e => reject(e))
      },
      fail(e) {
        reject(e)
      }
    })
  })
}


/**
 * @api getNewsDetailArticle
 * @author <>
 * 获取新闻详情
 * @param { string } code wx.login() code
 */
function getNewsDetailArticle(iid) {
  const host = `${bkdbrainHost}/view/v1/RVCQS9UR56/article/${iid}.json`
  return new Promise((resolve, reject) => {
    baseRequest(host, {
      user_is_up: true
    }).then(res => {
      resolve(res.data)
    }).catch(e => reject(e))
  })
}

/**
 * @api getNewsRelated
 * @author <>
 * 获取新闻详情
 * @param { string } code wx.login() code
 */
function getNewsRelated(iid, uid, ct) {
  const host = botbrainHost + '/rec/v1/RVCQS9UR56/related/'
  return new Promise((resolve, reject) => {
    baseRequest(host, {
      iid,
      uid,
      ct
    }).then(res => {
      resolve(res.data.data.items)
    })
    .catch(err=> reject(err))
  })
}


/**
 * @api articleFeedBackDown
 * @author <>
 * 反馈内容太差
 * @param { string } openid
 * @param { string } iid
 * @param { Date } dt? 可选 默认 Date.parse(new Date()) / 1000
 * @param { plt } plt? 可选 默认 'wechat'
 */
function articleFeedBackDown(uid, openid, iid, dt, plt) {
  console.log(uid)
  return new Promise((resolve, reject) => {
    const url = `${botHost}/behavior/v1/RVCQS9UR56/down`
    baseRequest(url, {
      uid: uid || openid,
      guid: openid,
      dt: dt || Date.parse(new Date()) / 1000,
      iid,
      plt: plt || 'wechat'
    })
    .then(res => resolve(res))
    .catch(e => reject(e))
  })
}

/**
 * @api getNewsRelated
 * @author <>
 * 反馈内容太差
 * @param { string } uid
 * @param { Date } dt? 可选 默认 Date.parse(new Date()) / 1000
 * @param { plt } plt? 可选 默认 'wechat'
 */
function articleFeedBackDislike(uid, iid, dt, plt) {
  return new Promise((resolve, reject) => {
    const url = `${profluHost}/vipSystem/wxapp/getnews/dislike`
    baseRequest(url, {
      uid,
      iid,
      dt: dt || Date.parse(new Date()) / 1000,
      plt: plt || 'wechat'
    })
    .then(res => resolve(res))
    .catch(e => reject(e))
  })
}

/**
 * @api profluLogin
 * @author <>
 * 后台登录
 */
function profluLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        wx.setStorageSync('wxCode', res.code)
        const url = `${profluHost}/vipSystem/wxapp/wxuser/wxlogin`
        baseRequest(url, {
          jsCode: res.code
        })
        .then(res => {
          wx.setStorageSync('uid', res.data.uid)
          resolve(res.data)
        })
          .catch(e => reject(e))
      },
      fail(e) {
        reject(e)
      }
    })
  })
}


/**
 * @api profluUpdateWxUserInfo
 * @author <>
 * 更新用户信息
 */
function profluUpdateWxUserInfo(uid, user_name, icon, gender, city, province) {
  const url = `${profluHost}/vipSystem/wxapp/wxuser/updateWxUserInfo`
  return new Promise((resolve, reject) => {
    baseRequest(url, { uid, user_name, icon, gender, city, province})
      .then(res => resolve(res))
      .catch(e => reject(e))
  })
}
/**
 * @api profluLogin
 * @author <>
 * 查修计划
 */
function queryPlanInfo(uid) {
  const url = `${profluHost}/vipSystem/wxapp/personal/queryPlanInfo`
  return new Promise((resolve, reject) => {
    baseRequest(url, {uid})
      .then(res => resolve(res))
      .catch(e => reject(e))
  })
}


/**
 * @api articleSearch
 * @author <>
 * 文章搜索
 * @param { String } openid
 * @param { String } keyword
 * @param { Number } st default 1
 */
function articleSearch(openid, keyword, st = 1) {
  const url = `${botbrainHost}/rec/v1/RVCQS9UR56/search`
  return new Promise((resolve, reject) => {
    baseRequest(url, {
      uid: openid,
      keyword,
      st
    })
    .then(res => resolve(res.data.data.items))
    .catch(e => reject(e))
  })
}

/**
 * @api getTopic
 * @author <>
 * 获取热点话题
 * @param { String } openid
 * @param { Number } page_size default 10
 */
function getTopic(uid, page_size=10) {
  return new Promise((resolve, reject) => {
    const url = `${botbrainHost}/meta/v1/RVCQS9UR56/topic/hots`;
    const openid = wx.getStorageSync('openid')
    baseRequest(url, {
      uid: uid || openid,
      page_size
    }).then(res => resolve(res.data.data))
    .catch(e => reject(e))
  })
}

/**
 * @api getTopic
 * @author <>
 * 获取热点话题
 * @param { String } openid
 * @param { Number } page_size default 10
 */
function appendTopic(uid, page_size = 10) {
  return new Promise((resolve, reject) => {
    const url = `${botbrainHost}/meta/v1/8VA4S7UVAR/topic/hots`;
    const openid = wx.getStorageSync('openid')
    baseRequest(url, {
      uid: uid || openid,
      page_size
    }).then(res => resolve(res.data.data))
      .catch(e => reject(e))
  })
}


/**
 * @api getArticleCollect
 * @author <>
 * 获取已收藏文章
 * @param { String } uid as openid
 */
function getArticleCollect(uid) {
  const url = `${botbrainHost}/rec/v1/RVCQS9UR56/collect`
  const openid = wx.getStorageSync('openid')
  return new Promise((resolve, reject) => {
    baseRequest(url, {uid: uid || openid})
    .then(res => resolve(res.data.data.items))
    .catch(e => reject(e))
  })
}


/**
 * @api ArticleCollect
 * @author <>
 * 收藏/取消收藏 文章
 * @param { String } uid as openid
 * @param { String } iid article id
 * @param { String } type 0 as Collected 1 as not Collected
 * @param { String } plt 
 * @param { Date } dt
 */
function ArticleCollect(uid, iid, type=0, plt = 'wechat', dt = Date.parse(new Date()) / 1000) {
  const url = `${botHost}/behavior/v1/RVCQS9UR56/collect`
  const openid = wx.getStorageSync('openid')
  return new Promise((resolve, reject) => {
    baseRequest(url, {
      uid: uid || openid,
      guid: openid,
      dt,
      iid,
      plt,
      type
    })
    .then(res => resolve(res))
    .catch(e => reject(e))
  })
}

/**
 * @api ArticleUp
 * @author <>
 * 点赞/取消点赞 文章
 * @param { String } uid as openid
 * @param { String } iid article id
 * @param { String } type 0 as Collected 1 as not Collected
 * @param { String } plt 
 * @param { Date } dt
 */
function ArticleUp(uid, iid, type = 0, plt = 'wechat', dt = Date.parse(new Date()) / 1000) {
  const url = `${botHost}/behavior/v1/RVCQS9UR56/up`
  return new Promise((resolve, reject) => {
    baseRequest(url, {
      uid,
      guid: uid,
      dt,
      iid,
      plt,
      type
    })
      .then(res => resolve(res))
      .catch(e => reject(e))
  })
}


/**
 * @api followTopic
 * @author <>
 * 点赞/取消关注 话题
 * @param { String } uid as openid
 * @param { String } iid article id
 * @param { String } type 0 as Collected 1 as not Collected
 * @param { String } plt 
 * @param { Date } dt
 */
function followTopic(uid, topic_id, type = 0, plt = 'wechat', dt = Date.parse(new Date()) / 1000) {
  const url = `${botHost}/behavior/v1/RVCQS9UR56/subtopic`
  return new Promise((resolve, reject) => {
    const openid = wx.getStorageSync('openid')
    baseRequest(url, {
      uid: uid || openid,
      guid: openid,
      dt,
      topic_id,
      plt,
      type
    })
      .then(res => resolve(res))
      .catch(e => reject(e))
  })
}

/**
 * @api getTopicDetail
 * @author <>
 * 获取话题详情
 * @param { String } uid as openid
 * @param { String } id article id
 */
function getTopicDetail(uid, id) {
  const url = `${botbrainHost}/meta/v1/RVCQS9UR56/topic/detail`
  const guid = uid
  return new Promise((reslove, reject) => {
    baseRequest(url, { uid, guid, id})
      .then(res => reslove(res.data.data))
      .catch(e => reject(e))
  })
}


/**
 * @api getTopics
 * @author <>
 * 获取话题的新闻列表
 * @param { String } uid as openid
 * @param { String } id article id
 */
function getTopics(uid, topic_id) {
  const url = `${botbrainHost}/rec/v1/RVCQS9UR56/topic`
  const guid = wx.getStorageSync('openid')
  return new Promise((reslove, reject) => {
    baseRequest(url, { uid: uid || guid, guid, topic_id })
      .then(res => reslove(res.data.data.items))
      // .then(res => console.log(res))
      .catch(e => reject(e))
  })
}


/**
 * @api checkLogin
 * @author <>
 * 检查登录状态
 */
function checkLogin() {
  const userInfo = wx.getStorageSync('user:info')
  if (!userInfo) {
    wx.showModal({
      title: '提示',
      content: '登录之后，才可使用此功能！',
      confirmText: '去登陆',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/mine/index'
          })
        }
      }
    })
  }
  return Boolean(userInfo)
}


/**
 * @api getMyTopics
 * @author <>
 * 获取我的话题列表
 */
function getMyTopics(uid) {
  const url = `${botbrainHost}/meta/v1/RVCQS9UR56/personal/topic/list`
  const openid = wx.getStorageSync('openid')
  return new Promise((resolve, reject) => {
    if (!uid) uid = openid
    baseRequest(url, { uid }).then(res => resolve(res.data.data)).catch(e => reject(e))
  })
}

/**
 * @api getShareArticlePhoto
 * @author <>
 * 获取分享图片
 */
function getShareArticlePhoto(article_title, article_time, article_brand, path, article_content = '', template_key = 'efdf56345c95a82a49fd82c0cb492c0e') {
  const data = {
    article_title,
    article_time,
    article_brand,
    article_content,
    template_key,
    path
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://shareapi.aldwx.com/Main/action/Template/Template/applet_htmlpng',
      data,
      method: 'post',
      success: r => resolve(r.data.data),
      fail: e => reject(e)
    })
  })
}

/**
 * @api submitFeedback
 * @author <>
 * @url https://wxapp.proflu.cn/vipSystem/wxapp/personal/updateFeedback
 * 提交意见
 */
function submitFeedback(uid, feedback) {
  const url = `${profluHost}/vipSystem/wxapp/personal/updateFeedback`
  return baseRequest(url, { uid, feedback})
}

module.exports = {
  getHomeNavigators,
  getHomeContents,
  getBotbrainOpenid,
  getWxCodeOpenid,
  getNewsDetailArticle,
  getNewsRelated,
  articleFeedBackDown,
  articleFeedBackDislike,
  articleSearch,
  profluLogin,
  profluUpdateWxUserInfo,
  queryPlanInfo,
  getTopic,
  appendTopic,
  getArticleCollect,
  ArticleCollect,
  ArticleUp,
  checkLogin,
  getTopicDetail,
  getTopics,
  followTopic,
  getShareArticlePhoto,
  getMyTopics,
  submitFeedback
}