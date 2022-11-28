/**
 * 防抖函数 debounce
 * @param {Function} fn
 * @param {Number} wait
 * @param {Boolean} immediate
 * @param {Function} callback
 * @returns debounce Funtion
 */
export function deboundFn(fn, wait = 300, immediate = false, callback) {
  if (typeof fn !== 'function') {
    throw new Error('The first argument should be a function')
  }

  let timer = null
  let flag = false

  function dbFn(...args) {
    if (immediate && !flag) {
      const result = fn.apply(this, args)
      flag = true
      callback && callback(result)
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const result = fn.apply(this, args)
        flag = false
        callback && callback(result)
      }, wait)
    }
  }

  dbFn.cancel = function () {
    clearTimeout(timer)
    timer = null
    flag = false
  }

  return dbFn
}

export default deboundFn
