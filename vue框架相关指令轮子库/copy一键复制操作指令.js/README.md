## 自定义指令 - copy 复制

开箱即用~

> ### 说明
>
> - 优先使用 `navigator.clipboard` 再降级使用 `document.execCommand`(MDN 已废弃)
> - 支持复制换行文本
> - 如果不传入复制的文本，可以用修饰符 `.text` 直接获取节点文本
> - 内部可自定义提示弹窗，本指令使用 `element-ui`

---

> ### 用法
>
> ```js
> import Vue from 'vue'
> import DirectiveCopy from './directive-copy'
>
> Vue.directive('v-copy', DirectiveCopy)
>
> -------------模板部分------------
> <!-- 直接传入复制的文本 -->
> <button v-copy="我是要复制的文本内容">复制</button>
>
> <!-- 使用修饰符复制元素内的文本 -->
> <p v-copy.text>https://blog.csdn.net/Umbrella_Um</p>
>
> ```

---

> ### 深入学习
>
> [浏览器原生剪贴板 navigator.clipboard 与 document.execCommand 及 vue-clipboards 使用](https://blog.csdn.net/Umbrella_Um/article/details/111067720?spm=1001.2014.3001.5502)
