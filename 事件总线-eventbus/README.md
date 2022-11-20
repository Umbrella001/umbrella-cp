### 前言

- 目前 Vue3 和 React 框架中没有对应的 API 去完成这个事件总线
- 如果不想引入第三方库，可以使用这个简易版的事件总线完成绝大多数事务

---

### 事件总线 EventBus

- 实现了 `emit` `on` `off` `once` 方法，直接可以用在项目中完成总线事务
- on/once 支持第三个参数指定 `this` 方法

---

## 使用方法

```js
import EventBus from './eventbus.js'

const $Event = new EventBus()

// emit 派发事件
$Event.emit('eventName', 'arg1', 'arg2')

// on 监听事件
$Event.on('eventName', fn(...arg){
  // do something...
}, this)

// off 取消对应时间
$Event.off('eventName', fn)

// once 监听一次事件后移出
$Event.once('eventName', fn(...arg){
  // do something...
})
```
