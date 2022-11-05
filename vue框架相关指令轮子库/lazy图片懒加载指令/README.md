## 自定义指令 - v-lazy 图片懒加载

> ### 指令说明
>
> - 兼容处理：优先使用 IntersectionObserver 类，向下兼容 > getBoundingClientRect()
> - 额外支持：可以开启获取载入图片的几何信息
> - 优势：可直接用于公司业务，不需要额外使用第三方插件去完成懒加载

> ### 使用方法说明

```js
import LazyLoad from './directive-lazy'
// 全局插件注入
Vue.use(LazyLoad, {
  // 图片的祖先容器元素选择器（请确保可以监听滚动，不传默认为文档视口）
  root: '.img-box',
  // 祖先容器和图片的相交区域比例：0.0 ~ 1.0，默认0.0即元素触碰到容器边缘就触发加载
  threshold: 0,
  // 图片占位图
  defaultImg: 'https://img.lanrentuku.com/img/allimg/1212/5-121204193R0-50.gif',
  // 节流间隔时间（只有不支持IntersectionObserver时才会使用，兼容方法需要设计滚动, 默认300ms）
  delay: 300,
  // 自定义指令名，不传默认是 v-lazy指令
  directive: 'lazy'
})

---------html部分----------
<section class="img-box">
  <img v-lazy="./img1.png" />
  <img v-lazy="./img2.png" />
  <img v-lazy="./img3.png" />
  <img v-lazy="./img4.png" />
  ...
</section>
```
