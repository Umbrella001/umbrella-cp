const statusMap = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
}

// 将promise设置为fulfilled状态
function fulfilledPromise(promise, value) {
  // 只能从pending状态转换为其他状态
  if (promise.status !== statusMap.PENDING) {
    return
  }
  promise.status = statusMap.FULFILLED
  promise.value = value
  runCbs(promise.fulfilledCbs, value)
}

// 将promise设置为rejected状态
function rejectedPromise(promise, reason) {
  // 只能从pending状态转换为其他状态
  if (promise.status !== statusMap.PENDING) {
    return
  }
  promise.status = statusMap.REJECTED
  promise.reason = reason
  runCbs(promise.rejectedCbs, reason)
}

function runCbs(cbs, value) {
  cbs.forEach(cb => cb(value))
}

function isFunction(fn) {
  return (
    Object.prototype.toString.call(fn).toLocaleLowerCase() ===
    '[object function]'
  )
}

function isObject(obj) {
  return (
    Object.prototype.toString.call(obj).toLocaleLowerCase() ===
    '[object object]'
  )
}

function isPromise(p) {
  return p instanceof Promise
}

// promise的解析
function resolvePromise(promise, x) {
  // x 与promise相同
  if (promise === x) {
    rejectedPromise(promise, new TypeError('cant be the same'))
    return
  } // x 是promise
  if (isPromise(x)) {
    if (x.status === statusMap.FULFILLED) {
      fulfilledPromise(promise, x.value)
      return
    }
    if (x.status === statusMap.REJECTED) {
      rejectedPromise(promise, x.reason)
      return
    }
    if (x.status === statusMap.PENDING) {
      x.then(
        () => {
          fulfilledPromise(promise, x.value)
        },
        () => {
          rejectedPromise(promise, x.reason)
        }
      )
      return
    }
    return
  }
  if (isObject(x) || isFunction(x)) {
    let then
    let called = false
    try {
      then = x.then
    } catch (error) {
      rejectedPromise(promise, error)
      return
    }
    if (isFunction(then)) {
      try {
        then.call(
          x,
          y => {
            if (called) {
              return
            }
            called = true
            resolvePromise(promise, y)
          },
          r => {
            if (called) {
              return
            }
            called = true
            rejectedPromise(promise, r)
          }
        )
      } catch (error) {
        if (called) {
          return
        }
        called = true
        rejectedPromise(promise, error)
      }
      return
    } else {
      fulfilledPromise(promise, x)
      return
    } // x不是对象或者函数
  } else {
    fulfilledPromise(promise, x)
    return
  }
}

class Promise {
  constructor(fn) {
    this.status = statusMap.PENDING
    this.value = undefined
    this.reason = undefined
    this.fulfilledCbs = [] // then fulfilled callback    this.rejectedCbs = []; // then rejected callback
    fn(
      value => {
        // fulfilledPromise(this, value);
        resolvePromise(this, value)
      },
      reason => {
        rejectedPromise(this, reason)
      }
    )
  }

  then(onFulfilled, onRejected) {
    const promise1 = this
    const promise2 = new Promise(() => {})
    if (promise1.status === statusMap.FULFILLED) {
      if (!isFunction(onFulfilled)) {
        return promise1
      }
      setTimeout(() => {
        try {
          const x = onFulfilled(promise1.value)
          resolvePromise(promise2, x)
        } catch (error) {
          rejectedPromise(promise2, error)
        }
      }, 0)
    }
    if (promise1.status === statusMap.REJECTED) {
      if (!isFunction(onRejected)) {
        return promise1
      }
      setTimeout(() => {
        try {
          const x = onRejected(promise1.reason)
          resolvePromise(promise2, x)
        } catch (error) {
          rejectedPromise(promise2, error)
        }
      }, 0)
    }
    if (promise1.status === statusMap.PENDING) {
      onFulfilled = isFunction(onFulfilled)
        ? onFulfilled
        : value => {
            return value
          }
      onRejected = isFunction(onRejected)
        ? onRejected
        : err => {
            throw err
          }
      promise1.fulfilledCbs.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(promise1.value)
            resolvePromise(promise2, x)
          } catch (error) {
            rejectedPromise(promise2, error)
          }
        }, 0)
      })
      promise1.rejectedCbs.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(promise1.reason)
            resolvePromise(promise2, x)
          } catch (error) {
            rejectedPromise(promise2, error)
          }
        }, 0)
      })
    }
    return promise2
  }
}
