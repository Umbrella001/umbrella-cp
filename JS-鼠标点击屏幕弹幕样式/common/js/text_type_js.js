;(function(){
    var fnTextPopup = function (arr, options) {
        /**
         * arr参数是必须的
         */ 
        if (!arr || !arr.length) throw new Error("This parameter is a must-pass term --arr!");
        /**对监听事件做兼容处理
         * 参数解释：
         * element: 监听事件源
         * type: 为监听事件名,如click,submit等
         * handler: 为监听事件所执行的函数
         * 调用： EventUtil.addHandler(添加事件)/removeHandler(移除事件)
         */
    var EventUtil = {
        addHandler : function(type, handler, element){
			this.checked(type, handler, element);
            if(element.addEventListener){
                element.addEventListener(type, handler, false);
            }else if(element.attachEvent){
                element.attachEvent('on' + type, handler);
            }else{
                element['on' + type] = handler;
            }
        },
        removeHandler : function(type, handler, element){
        	this.checked(type, handler, element);
            if(element.removeEventListener){
                element.removeEventListener(type, handler, false);
            }else if(element.detachEvent){
                element.detachEvent('on' + type, handler);
            }else{
                element['on' + type] = null;
            }
        },
        checked: function(type, handler, element){
        	if(!(typeof(type) == 'string')) throw new Error("The parameter is required and the parameter type is String");
        	if(!(handler instanceof Function)) throw new Error("The parameter is required and the parameter type is Function");
        	return element = element ? element : document;
        }
    }
        /**
         * 监听鼠标点击事件
         */
        var index = 0;
            EventUtil.addHandler('click', function (event) {
            event = event || window.event;
            var x = event.pageX, y = event.pageY;
            var eleText = document.createElement('span');
            eleText.className = 'text-popup';
            document.body.appendChild(eleText);
            if (arr[index]) {
                eleText.innerHTML = arr[index];
            } else {
                index = 0;
                eleText.innerHTML = arr[0];
            }
            // 动画结束后删除当前元素
            EventUtil.addHandler('animationend', function () {
                eleText.parentNode.removeChild(eleText);
            },eleText);
            // 当前元素出现的位置
            eleText.style.left = (x - eleText.clientWidth / 2) + 'px';
            eleText.style.top = (y - eleText.clientHeight) + 'px';
            eleText.style.color = random_color();
            function random_color() {
                return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
            }
            // index递增
            index++;
        },document);    
    };
    
    fnTextPopup(['可爱', '矜持', '乖巧', '温柔', '声甜', '貌美', '端正', '体面', '淑女', '优雅', '萝莉', '娇喘']);
})();