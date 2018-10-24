const appData = getApp().globalData
const getToken = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://openapi.baidu.com/oauth/2.0/token',
      data: {
        grant_type: 'client_credentials',
        client_id: appData.baidu_ApiKey,
        client_secret: appData.baidu_SecretKey
      },
      success: function (res) {
        resolve(res)
        appData.baidu_Token = res.data.access_token
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

module.exports = getToken