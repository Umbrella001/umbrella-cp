### 对比一下传统组件开发和web 2.0 component 最新组件化开发

**传统组件化开发（代码组成部分）：**

- css组件样式部分
- js组件封账逻辑部分
- html组件模板代码
- js组件创建脚本代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<!-- 1.引入组件ui的css -->
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<!-- 2.引入组件ui的js -->
<script type="text/javascript" src="https://code.jquery.com/jquery-1.1214.js"></script>
<script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
<body>
<!-- 3.编写组件HTML模版代码 -->
<div id="dialog" title="Basic dialog">
    <p>This is the default cross origin null created callback attrChangeCallback</p>
</div>
<!-- 4.调用渲染组件的js初始化代码 -->
<script>
    $(function(){
        $("#dialog").dialog(); // 使用id为dialog实例化dialog对象
    });
</script>
</body>
</html>
```

**web 2.0 component 组件化开发:**

- link中rel为import的方式引入html组件源文件（该文件写的就是template模版包含css,html还有script）
- 在主入口body中直接使用这个标签即可

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width initial-scale=1 maximun-scale=1 minimum-scale=1 user-scalabel=no">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Web component组件案例</title>
        <!-- 1.引入web component 组件 -->
        <link rel="import" href="./code/webComponent/netease-color.html">
    </head>
    <body>
        <h1>React</h1>
        <!-- 2.使用组件标签名作为web component标签 -->
        <netease-color></netease-color>
    </body>
</html>
```

### 使用web compont测试阶段时出现跨域问题：

**报错截图CORS policy：**

![1564641882435](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1564641882435.png)

**原因：**

浏览器本身默认是不允许请求访问本地文件的，就假设浏览器可以随便访问本地文件的话，像我们C盘中很多操作系统安全系统的配置文件，而黑客啥的随随便便通过一个脚本文件就可以修改或者添加一些乱七八杂的文件在我们客户端上，那我们的电脑系统肯定很容易奔溃或者入侵，所以这也是跨域中限制的【不能本机访问】;同理就是浏览器中的跨域请求也是一个道理;

**解决方法：**

这里用的是谷歌（目前似乎只有chrome浏览器可以设置本机访问跨域），且以window操作系统进行讲解

① 右键谷歌浏览器，"属性"中打开文件所在位置，进入浏览器安装文件夹

② 在文件位置栏中启动cmd命令行，输入chrome.exe，确定是否能启动浏览器。如果不能请检查自己浏览器文件的路径是否正确

③ 然后关掉chrome浏览器，在命令行输入`chrome.exe --disable-web-security --user-data-dir` ||  `chrome.exe --args --disable-web-security --user-data-dir`两种都可以![1564643190690](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\1564643190690.png)

如上图回车后，会打开谷歌浏览器，并且提示使用特殊 --dis...性能和安全性降低的提示，说明本机跨域解决了;如果没有成功打开浏览器的话，原因一回车该命令行之前谷歌浏览器未关闭;原因二命令行输入错误或者缺少空行，要注意命令之间的空格;

完成上面三步，打开的chrome也就是通过把安全机制关闭后实现的同源政策;

有关这部分跨域的可以看博客 https://blog.csdn.net/Umbrella_Um/article/details/98222981

### 进入正题

这个小组件分为三部分 主文档html[index.html] 组件文档web component[xtag-netease.html] 组件规则js[xtag-component.js]

主要作用分析都写代码头部注释里了,这里就不写了...


