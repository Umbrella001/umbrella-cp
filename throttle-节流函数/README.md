### 节流函数 throttle

```js
import throttleFn from './throttle.js'

// 需要使用节流的原函数
function myFn(...args) {
  // do something
}

// 使用返回的节流函数 newMyFn
const newMyFn = throttleFn(myFn, 500, {
  leading: true,
  trailing: true
})
document.body.querySelector('.confirm-btn').onclick = newMyFn

// 取消节流
document.body.querySelector('.cancel-btn').onclick = newMyFn.cancel()
```

>
