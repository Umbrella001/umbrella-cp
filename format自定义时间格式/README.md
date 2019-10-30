## 写一个可拓展的日期格式化 new Date().format("yyyy-MM-dd HH:mm:ss 自定")方法

### 参数fmt
在Date原型上写format方法,接收fmt的参数为时间输出的文本格式

### 调用format

```javascript
    new Date().format("yyyy-MM-dd w hh:mm:ss q");
```

### 输出结果

![img](https://img-blog.csdnimg.cn/20190801223111188.png)

### 扩展性( 后续我补上 )

> 在函数format中的`pattern`中你还可以类比一下星期几的获取来写：
> `getFullYear()`写一个简单的函数获取【生肖】
> `getMonth()`去写一个简单的函数获取【星座】
> …

### 注意：

1. 调用的函数应该要有返回值，如`getWeek()`
2. 添加的类目通过自定义字母来获取，不要和`pattern`里面的键名一样即可
3. 需要使用的新样式，只需要在`fmt`中文本格式出现即可，这个函数是拼接而成的所以不需要自己写上拼接符，如代码中的`new Date().format("yyyy-MM-dd w hh:mm:ss q")`

------------------------------------------------------------------------------------------------------------------------

【本代码博客】

https://blog.csdn.net/Umbrella_Um/article/details/98115917