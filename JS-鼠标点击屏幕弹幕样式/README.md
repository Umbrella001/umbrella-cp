### 弹幕说明

纯属娱乐，借鉴网上的骚操作，自己做了一些整改，喜欢的可以试试，变更样式槽我在下面贴出来，这部分代码可以根据自己喜欢进行自定义话，改这部分代码即可；

爱心弹幕 `love_type_js.js`：

i()括号里面的一大串就是绘制爱心的，自己想怎么绘制形状都行，position为fixed即可；

```javascript
e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function (e) {
        setTimeout(e, 1000 / 60)
        }, i(".heart{width: 10px;height: 10px;position: fixed;background: #f00;-khtml-transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);;-ms-transform: rotate(45deg);transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;-khtml-border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;-ms-border-radius: 50%;border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"), n(), r()
}(window, document);
```

文字弹幕`text_type_js.js`：

fnTextPopup里面就是弹幕出来的文字，需要什么名字自己定义，其他逻辑是有关排序和定位的，哪些不需要动；

```javascript
fnTextPopup(['可爱', '矜持', '乖巧', '温柔', '声甜', '貌美', '端正', '体面', '淑女', '优雅', '萝莉', '娇喘']);
```

文字弹幕`text_type_css.css`：

动画这里简单，需要改的话不改到css便签名就行；

```css
.text-popup {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 16px;
    text-shadow: 0 1px 1px 2px rgba(0, 0, 0, .5);
    animation: textPopup 1s;
    color: red;
    user-select: none;
    white-space: nowrap;
    position: absolute;
    z-index: 99;
}
@keyframes textPopup {
    0% {
        opacity: 0;
        transform: scale(1, 1);
    }
    5% {
        opacity: 1;
    }
    70% {
        opacity: .3;
    }
    100% {
        opacity: 0;
        transform: translateY(-50px) scale(0.8, 0.8);    
    }
}
```

### 引用说明

爱心弹幕引入一个javascript即可  `love_type_js.js`

文字弹幕引入一个`text_type_js.js`和一个`text_type_css.css`，名字都很好理解，看着引入就行

### 兼容性问题

两个弹幕由于`creatElement` 和 动画回调第三个参数的兼容性问题，IE9以下暂不支持哦~或许有空可以研究一下，这个问题