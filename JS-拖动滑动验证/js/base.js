/*!
 * functionName: 原生js实现拖动滑块逻辑（兼容PC和移动）
 * Version: @1.1.0
 * Github: 
 * ----------------------------------------------
 * Author: liber
 * Date: 2019-04-07T20:30Z
 */

 window.onload = function(){

    /* 选择器封装 */
    function seletor(param, obj) {
        obj = obj || document;
        //根据id名查找元素
        if (param[0] === "#")
            return document.getElementById(param.slice(1));
        // 根据指定类名查找元素
        if (param.indexOf(".") === 0)
            return getByClass(param.substring(1), obj);
        //根据标签名查找
        return obj.getElementsByTagName(param);
    }
    
    //类名查找元素实现方法
    function getByClass(className, obj) {
        obj = obj || document;
        if (obj.getElementsByClassName)
            return obj.getElementsByClassName(className);
    
        var result = [];
        var tags = obj.getElementsByTagName("*");
        for (var i = 0, len = tags.length; i < len; i++) {
            var classNames = tags[i].className.split(" "); // 获取当前遍历元素的类名
            for (var j = 0, l = classNames.length; j < l; j++) {
                if (className === classNames[j]) { // 找到所需要进行查找的一个元素
                    result.push(tags[i]);
                    break;
                }
            }
        }
        return result;
    }

    /* 封装addEventListener()和attachEvent()跨浏览器的兼容性（IE） */
    var EventUtil = {
        addHandler : function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else if(element.attachEvent){
                element.attachEvent('on' + type,handler);
            }else{
                element['on' + type] = handler;
            }
        },
        removeHandler : function(element,type,handler){
            if(element.removeEventListener){
                element.removeEventListener(type,handler,false);
            }else if(element.detachEvent){
                element.detachEvent('on' + type,handler);
            }else{
                element['on' + type] = null;
            }
        }
    }

    /* 兼容事件冒泡和事件的默认行为（IE） */
    var preStop = {
        stopPropagation: function(e){
            var e = e || window.event;
            if(e.stopPropagation){
                e.stopPropagation
            }else{
                e.cancelBubble = true; // 取消冒泡事件
            }
        },
        preventDefault: function(e){
            var e = e || window.event;
            if(e.preventDefault){
                e.preventDefault();
            }else{
                e.returnValue = false; // 取消默认行为
            }
        }   
    }

    /* 封装cssText -- 尽量避免页面reflow，提高页面性能 */
    function sty(element, cssText){
        element.style.cssText += ";" + cssText;
    }

    

    /* 获取滑块元素 */
    var btn = seletor(".btn")[0]; // 获取滑块
    var box = seletor("#box"); // 获取盒子
    var text = seletor(".text")[0]; // 获取文本
    var bg = seletor(".bg")[0];  // 获取拖动背景
    var flag = false; // 验证开关变量
    var downX;
    
    /* 监听鼠标事件 */
    var start = function(e){
        var e = e || window.event;
        preStop.stopPropagation();
        try{
            this.classList.remove("animation");
            bg.classList.remove("animation");
        }catch(e){
           console.warn("Current browsers do not support this animation for the time being --remove"); 
        }
        
        downX =  e.touches ? e.touches[0].clientX : e.clientX;
        EventUtil.addHandler(btn,"mousemove",move);
    }
    var move = function(e){    
        var e = e || window.event;
        preStop.stopPropagation();
        if(!flag){
            var btn_left = e.touches ? e.touches[0].clientX : e.clientX;
            var moveX = btn_left - downX;

            var btn_move_maxleft = box.offsetWidth - this.offsetWidth
            if(moveX > 0){
               /* 修复bug： 移动端快速拖动时出现moveX值大于btn_move_maxleft */
               moveX = moveX >= btn_move_maxleft ? btn_move_maxleft : moveX;
               sty(btn, "left:"+ moveX + "px;");
               sty(bg, "width:"+ moveX + "px;");
               if(moveX == btn_move_maxleft){
                  text.innerText = "验证成功";
                  sty(text,"color:#fff;")
                  flag = true;
      
                /* 验证成功后禁止移动和点击监听 */
                  EventUtil.removeHandler(btn,"mousedown",start);
                  EventUtil.removeHandler(btn,"movsemove",move);
               }
            }
         }
      }
   var end = function(e){
    
       var e = e || window.event;
       preStop.stopPropagation();

    /* 清除事件监听 */
       EventUtil.removeHandler(btn,"mousemove",move);
       
       if(flag) return;

       // 鼠标鼠标松开时将滑块初始化
       try{
            this.classList.add("animation");
            bg.classList.add("animation");
        }catch(e){
            console.warn("Current browsers do not support this animation for the time being --add");
        }
       
       sty(btn, "left:0;");
       sty(bg, "width:0;");
   }

   
/* 兼容PC和移动的点击||触摸事件 */

   // 鼠标按下 || 触摸开始
   EventUtil.addHandler(btn,"mousedown",start);
   EventUtil.addHandler(btn,"touchstart",start);

   // 鼠标滑动 || 触摸滑动
   EventUtil.addHandler(btn,"mousemove",move);
   EventUtil.addHandler(btn,"touchmove",move);
//    btn.addEventListener("touchmove",move);

   // 鼠标抬起 || 触摸结束
   EventUtil.addHandler(btn,"mouseup",end);
   EventUtil.addHandler(btn,"touchend",end);

/* 封装一个元素到body最顶级父级的距离（备用:差不多等同于pageX/pageY） */    
   function getPosition(name){
       var left = name.offsetLeft;
       var top = name.offsetTop;

       current = name.offsetParent;

       while( current != null){
           left += current.offsetLeft;
           top += current.offsetTop;
           current = current.offsetParent;
       }

       return{
           "left" : left,
           "top" : top
       };
   }
   /* 另类封装 -- 选择器(忽视) */
   
   /*
   var seletor = {
    check: function(isName){
      console.log('ccc',typeof(isName));
      if(typeof(isName) !== 'string') throw new Error("Please check the parameter type or whether it contains the parameter label!");   
    },
    id: function(name){
        seletor.check(name);
        console.log(document.getElementById(name))
        return document.getElementById(name);
    },
    class: function(name){
        seletor.check(name);
        console.log(document.getElementsByClassName(name)[0])
        return document.getElementsByClassName(name)[0];
    },
    tagName: function(name){
        seletor.check(name);
        console.log(document.getElementsByTagName(name)[0])
        return document.getElementsByTagName(name)[0];
    }
}
*/
}