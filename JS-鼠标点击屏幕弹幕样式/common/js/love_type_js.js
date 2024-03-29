;(function(){
    !function (e, t, a) {

        /**
         * 检测爱心div存放的数组中,如果透明度为0时就删除该div
         * 制定爱心衰减样式特征及速度及更新style样式
         * 使用requestAnimationFrame要求浏览器在下次重绘之前调用指定的回调函数更新动画
         */
        function r() {
        for (var e = 0; e < s.length; e++) s[e].alpha <= 0 ? (t.body.removeChild(s[e].el), s.splice(e, 1)) : 
        (s[e].y--, s[e].scale += .004, s[e].alpha -= .013, s[e].el.style.cssText = "left:" + s[e].x + "px;top:" + s[e].y + "px;opacity:" + s[e].alpha + ";transform:scale(" + s[e].scale + "," + s[e].scale + ") rotate(45deg);background:" + s[e].color + ";z-index:99999");
        requestAnimationFrame(r)
        }

        /**
         * 判断监听点击事件存在与否并且添加点击事件
         */
        function n() {
        var t = "function" == typeof e.onclick && e.onclick;
        e.onclick = function (e) {
        var e = e || window.event;
        t && t(), o(e)
        }
        }

        /**
         * 将爱心div插入页面中,使用数组形式，所以可以同时出现多个爱心div
         */
        function o(e) {
        var a = t.createElement("div");
        a.className = "heart", s.push({
        el: a,
        x: e.clientX - 5,
        y: e.clientY - 5,
        scale: 1,
        alpha: 1,
        color: c()
        }), t.body.appendChild(a)
        }

        /**
         * e传入的是爱心的css样式
         */
        function i(e) {
        var a = t.createElement("style");
        a.type = "text/css";
        try {
        a.appendChild(t.createTextNode(e))
        } catch (t) {
        a.style.cssText = e
        }
        t.getElementsByTagName("head")[0].appendChild(a)
        }

        /**
         * 获取爱心的随机颜色值rgb
         */
        function c() {
        return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
        }

        var s = [];
        e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function (e) {
        setTimeout(e, 1000 / 60)
        }, i(".heart{width: 10px;height: 10px;position: fixed;background: #f00;-khtml-transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);;-ms-transform: rotate(45deg);transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;-khtml-border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;-ms-border-radius: 50%;border-radius: 50%;position: fixed;}.heart::after{top: -5px;}.heart::before{left: -5px;}"), n(), r()
        }(window, document);
})();