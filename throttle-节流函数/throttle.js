/**
 *
 * @param {Function} fn // 需要节流的函数
 * @param {Number} delay // 节流间隔时间
 * @param {Object} options // 额外参数，leading是否一开始就立即执行，trailing是否间隔时间内触发后到时间后也执行
 */
function throttleFn(fn, delay, options = { leading: true, trailing: false }) {
  let remainTime = 0
  let lastTime = 0
  let timer = null
  let { leading, trailing } = options

  function thrFn(...args) {
    let nowTime = +new Date()

    if (!leading) {
      lastTime = nowTime
    }

    // 剩余时间
    remainTime = delay - (nowTime - lastTime)

    if (remainTime <= 0) {
      // 避免因为定时器的延迟触发两次
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      fn.apply(this, args)
      lastTime = +new Date()
      return
    }

    if (trailing && !timer) {
      timer = setTimeout(() => {
        timer = null

        fn.apply(this, args)
        lastTime = +new Date()
      }, remainTime)
    }
  }

  thrFn.cancel = function () {
    clearTimeout(timer)
    timer = null
    lastTime = 0
  }

  return thrFn
}

export default throttleFn
