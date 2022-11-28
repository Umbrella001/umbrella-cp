### 防抖函数 debounce

```js
import debounce from './debounce.js'

// 需要使用防抖的原函数
function myFn(...args) {
  // do something
}

// 支持接收回调函数，回调函数为原函数（myFn）的返回值
function getMyFnReturn(res) {
  console.log(res, 'myFn返回值')
}

// 使用返回的防抖函数 newMyFn
const newMyFn = debounce(myFn, 500, true, getMyFnReturn)
document.body.querySelector('.confirm-btn').onclick = newMyFn

// 取消防抖
document.body.querySelector('.cancel-btn').onclick = newMyFn.cancel()
```

>
