window.onload = function(){
    //选择器封装
   function $(name){
       return document.querySelector(name);
   };
    var small_pic = $(".small_pic"),  //左侧图片
        slider = $(".slider"),  //滑块
        big_pic = $(".big_pic"),   //右侧图片
        big_img = $(".big_img");
    //事件
    small_pic.onmousemove = function(e){   //移入
        slider.style.display = 'block';
        big_pic.style.display = 'block';
        var left = e.clientX-slider.offsetWidth/2;
        var top = e.clientY - slider.offsetHeight/2;
        //移动范围
        var w = small_pic.offsetWidth -slider.offsetWidth;
        var h = small_pic.offsetHeight -slider.offsetHeight;
        if(left <0){
            left = 0;
        }else if(left >w){
            left = w;
        };
        if(top <0){
            top = 0;
        }else if(top >h){
            top = h;
        };
        slider.style.left = left+'px';
        slider.style.top = top+'px';
        big_img.style.left = -(left*2)+'px';
        big_img.style.top = -(top*2)+'px';
    };
    small_pic.onmouseout = function(){   //移出
        slider.style.display = 'none';
        big_pic.style.display = 'none';
    };
}