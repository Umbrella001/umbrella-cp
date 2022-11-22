## Introduce

- 目前 Vue3 和 React 框架中没有对应的 API 去完成这个事件总线
- 如果不想引入第三方库，可以使用这个简易版的事件总线完成绝大多数事务

---

## API

> ### emit

<br />
派发事件：Dispatch event

- `eventName` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** Type of eventName to listen for, or `'*'` for all events >>> [事件名称]
- `payload` **([any](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures))** Any value (object is recommended and powerful), passed to each handler >>> [参数]

> ### on

<br />
订阅/监听事件：Subscribe Events

- `eventName` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** Type of eventName to listen for, or `'*'` for all events >>> [事件名称]
- `handler` **([Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** Function to call in response to given event >>> [回调函数]
- `thisArg` You can pass in the thisArg to use in the callback >>> [指定_this_指向]

> ### once

<br />
订阅/监听事件(一次性)：Subscribe Events（once）

- `eventName` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** Type of eventName to listen for, or `'*'` for all events >>> [事件名称]
- `handler` **([Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** Function to call in response to given event >>> [回调函数]
- `thisArg` You can pass in the thisArg to use in the callback >>> [指定_this_指向]

> ### off

<br />
取消订阅/监听事件：Unsubscribe Events

- `eventName` **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** Type of eventName to listen for, or `'*'` for all events >>> [事件名称]
- `handler` **([Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function))** Function to call in response to given event，If no handler function is passed in, all listening events corresponding to the event name will be cleared >>> [回调函数，不指定对应回调函数将清除对应事件中的所有监听/订阅]

> ### clear

<br />
取消所有订阅/监听事件：Unsubscribe All Events

---

## Usage

```js
import EventBus from './eventbus.js'

const $Event = new EventBus()

/*------- [emit] 派发事件 -------*/
$Event.emit('eventName', 'arg1', 'arg2')

/*------- [on] 监听事件 -------*/
$Event.on('eventName', handler(...payload){
  // do something...
}, this)

/*------- [on*] 监听所有事件* -------*/
$Event.on('*', handler(...payload){
  // do something...
})

/*------- [once] 监听事件被触发后移除该监听 -------*/
$Event.once('eventName', handler(...payload){
  // do something...
})

/*------- [off] 取消指定事件的监听回调事件 -------*/
$Event.off('eventName', handler)

/*------- [off] 取消对应事件名所有的监听事件 -------*/
$Event.off('eventName')

/*------- [clear] 取消所有事件名的监听事件 -------*/
$Event.clear()

```
