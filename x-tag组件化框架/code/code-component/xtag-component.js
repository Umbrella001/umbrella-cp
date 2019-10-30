/**
 * 定义说明：
 *   将web component中的方法封装到一个闭包空间中（检测机）
 * 逻辑说明:
 *   ↓ web component即[xtag-netease.html]中的逻辑代码必须遵循这里的设置（映射）
 *   ↓ 对参数可用性进行检测,避免传参错误缺失等
 *   ↓ 克隆一个操作template中所有元素的根,即HTMLElement,之后在克隆对象中进行方法的执行
 *   ↓ 获取web component中的template模版封闭到shadowRoot中
 *   ↓ 获取web component中的方法,并修改this指向组件
 *   ↓ 抛出注册的原型element,此时组件就会使用这个副本进行逻辑的编写
 * 参数说明：
 *   tagName为标签名  option即为逻辑
 * 特点优化：
 *    ① 代码健壮性,考虑参数的问题
 *    ② 代码干净,不污染根节点
 *    ③ 代码封闭,只作用于当前组件
 * 拓展槽说明:
 *    这里写了一个createdCallback的自定义方法,该方法就是上面说的主要负责副本对象克隆及其封闭作用域处理
 *    还可以写一个attributeChangedCallback的自定义方法,监听组件中template内的元素发生改变需要规定的规则等...
 */

;var _xtag = (function(globle, factory, plug){
   return globle[plug] = factory.call(globle);
})(this, function(){
    // 定义默认值
    var __DEFS__ = {
        lifecycle: {},
        methods: {}
    }
    var __X__ = {
        // 检查值兼容值
        register: function(tagName, option){
            if(!tagName) throw new Error("TagName is a required parameter,Pass in the alias of the plug!");
            this.__tname__ = tagName;
            this.__ops__ = option = option || __DEFS__;
            option.lifecycle = option.lifecycle || __DEFS__.lifecycle;
            option.methods = option.methods || __DEFS__.methods;
            
            this.init();
        },
        init: function(){
            // 注意两个this指向,写在createdCallback的指向为window,方法内部的this就指向xtag-netease元素
            var that = this;

            // 克隆HTMLElement根节点的原型链深拷贝给element,此时element就有HTMLElement原型上的所有方法
            var element = Object.create(HTMLElement.prototype);

            // 获取xtag-netease中的template内部的所有元素;
            var xtagDoc = document.currentScript.ownerDocument;
            var template = xtagDoc.querySelector('template').content;

            // 定义一个element的方法createdCallback
            element.createdCallback = function(){
                // 创建一个shadowRoot节点
                var shadowDoc = this.createShadowRoot();

                // 使用importNode克隆出一个template内容节点,true表示深度克隆
                var temClone = document.importNode(template, true);

                // 将克隆的节点添加到xtag-netease中,就能使用shadowRoot特有的严格作用域(html css js)
                shadowDoc.appendChild(temClone);

                // 将全局中的xtag.register里面的方法遍历到该
                var options = that.__ops__;
                this.xtag = shadowDoc;
                for(var method in options.methods){
                    this[method] = options.methods[method];
                }
                if(options && options.lifecycle && options.lifecycle.created){
                    options.lifecycle.created.call(this); // 将这里的循环的方法指向web component中,这样循环中的方法就可以在组组价中使用
                }

                element.attributeChangedCallback = function(){
                    // ... 拓展逻辑
                }
            }

            // 对外部抛出原型为element的plug别名(注册元素)
            document.registerElement(this.__tname__,{
                prototype: element
            })
        }
    }
    return __X__;
},"xtag");