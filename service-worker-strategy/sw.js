/**
 * Created by Sandon on 2017/9/20.
 */
var cacheName = 'wuage-version-2'

var filesToCache = [
  /* 首页 */
  //'/',
  //'/index.html',
  //'/index.html?from=pwa',
  'https://static.wuage.com/m-home/pages/home/dist/static/css/app.css',
  
    
  'https://static.wuage.com/m-home/pages/home/dist/static/js/manifest.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/js/vendor.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/js/app.js',

    
  'https://static.wuage.com/m-home/pages/home/dist/static/modelEs5Home.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/modelEs5Service.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/modelEs5Account.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/niceslidernew.min.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/jquery-2.1.1.min.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/iscroll.min.js',
  'https://static.wuage.com/m-home/pages/home/dist/static/imgLoad.min.js',
    
  
    
  'https://static.wuage.com/m-home/common/pwa-entry.js',
  'https://static.wuage.com/common/statistic/footer.js',
  'https://static.wuage.com/??common/statistic/common.js,common/statistic/dopsa.js,common/statistic/data-collect.js',
  '//static.wuage.com/m-home/pages/home/dist/static/??jquery-2.1.1.min.js,iscroll.min.js,niceslidernew.min.js,modelEs5Home.js,imgLoad.min.js'
]

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(filesToCache))
      .then(() => self.skipWaiting()) // 激活当前service worker
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      const delPromises = cacheNames.filter(name => {
        return name !== cacheName
      }).map(name => {
        return caches.delete(name)
      })
      Promise.all(
        delPromises
      ).then(() => {
        return self.clients.claim() // 接管页面
      })
    })
  )
})

self.addEventListener('fetch', function(e) {
  var url = e.request.url
  // css/js文件，或者图片文件(图片文件需要带上cache=1这样一个参数)
  if (/\.(css|js)(\?.*)?$|\.(jpg|png|webp|gif)\?cache=1$/.test(url)) {
    // use cache
    /*
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    // 对缓存的资源（静态资源）去掉参数来进行匹配
    var index = url.indexOf('?')
    if (index !== -1) {
      url = url.slice(0, index)
    }
    e.respondWith(
      caches.match(url).then(function(response) {
        return response || fetch(e.request);
      })
    )
  } else {
  }
  /*var index = url.indexOf('?')
  if (index !== -1) {
    url = url.slice(0, index)
  }
  e.respondWith(
    caches.match(url).then(function(response) {
      return response || fetch(e.request);
    })
  )*/
})
