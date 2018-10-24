function qs(args) {

  //Is not args
  if(!args) return '';

  // 检测参数是否为对象 或空对象
  const arg = JSON.stringify(args)
  if (arg.charAt(0) !== '{' || arg === '{}') return '';
  
  return Object.keys(args).map(k => {
    return `${k}=${args[k]}`
  }).join('&')
}

// 跳转页面方法
function to(navigate = {url: '', data: {}}) {
  if (navigate.url === '') return;
  if (!/\?$/.test(navigate.url)) navigate.url = navigate.url + '?'
  wx.navigateTo({
    url: navigate.url + qs(navigate.data)
  })
}

/**
 * @api openArticleDetailPage
 * @author <>
 * 跳转到详情页面
 * @param {Object} args
 */
function openArticleDetailPage(args) {
  wx.navigateTo({
    url: '/pages/article-detail/index?' + qs(args)
  })
}


module.exports = {
  qs,
  to,
  openArticleDetailPage
}