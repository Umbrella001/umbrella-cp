const LazyLoad = {
  IO: null,
  rootElement: null,
  handler: null,
  install(
    Vue,
    { root, threshold = 0, defaultImg, delay = 300, directive = 'lazy' }
  ) {
    const defaultSrc = defaultImg || ''
    Vue.directive(directive, {
      bind(el, binding) {
        LazyLoad._init(el, binding.value, defaultSrc, {
          root,
          threshold
        })
      },
      inserted(el) {
        // 兼容处理
        if ('IntersectionObserver' in window) {
          LazyLoad._observe(el)
        } else {
          LazyLoad._listenerScroll(el, delay)
        }
      }
    })
  },

  // 初始化
  _init(el, val, def, { root, threshold }) {
    el.setAttribute('data-src', val)
    el.setAttribute('src', def)

    if (!LazyLoad.rootElement && root) {
      const refDom = document.querySelector(root)
      LazyLoad.rootElement = refDom ? refDom : null
    }

    if (!LazyLoad.IO) {
      LazyLoad.IO = new IntersectionObserver(
        (entries, observer) => {
          if (entries[0].intersectionRatio > threshold) {
            // 取消监听，避免反复触发
            observer.unobserve(el)
            el.src = el.dataset.src
            el.removeAttribute('data-src')
          }
        },
        root ? { root: LazyLoad.rootElement, threshold } : Object.create(null)
      )
    }
  },

  // 利用IntersectionObserver监听el
  _observe(el) {
    LazyLoad.IO.observe(el)
  },

  // 监听scroll事件
  _listenerScroll(el, delay) {
    LazyLoad.handler = LazyLoad._throttle(
      () => LazyLoad._load(el),
      delay
    )(LazyLoad.rootElement || window).addEventListener('scroll', () => {
      LazyLoad.handler()
    })
  },

  // 加载图片
  _load(el) {
    let windowHeight = document.documentElement.clientHeight
    let elTop = el.getBoundingClientRect().top
    let elBtm = el.getBoundingClientRect().bottom
    if (elTop - windowHeight < 0 && elBtm > 0) {
      if (realSrc) {
        el.src = el.dataset.src
        el.removeAttribute('data-src')
      }
    }
  },

  // 节流
  _throttle(fn, delay) {
    let timer
    let prevTime
    return function (...args) {
      let currTime = Date.now()
      let context = this
      if (!prevTime) prevTime = currTime
      clearTimeout(timer)

      if (currTime - prevTime > delay) {
        prevTime = currTime
        fn.apply(context, args)
        clearTimeout(timer)
        return
      }

      timer = setTimeout(function () {
        prevTime = Date.now()
        timer = null
        fn.apply(context, args)
      }, delay)
    }
  }
}
export default LazyLoad
