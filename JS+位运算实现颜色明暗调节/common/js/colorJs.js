(function(global,factor){
    return factor.call(global)
})(this,function(){
    // 判断Function的原型上是否存在此属性（方法）,有则报错
    if(Function.prototype.hasOwnProperty('changeColor')) throw new Error('This method already exists in the prototype chain of function!')
    
    // 给Function的原型链上添加changeColor方法
    Function.prototype.changeColor = function(options){
        var rect = document.getElementById("rect"),
        light = document.getElementById("light"),
        reset = document.getElementById("reset"),
        dark = document.getElementById("dark");
    
        const __DEFAULT__ = {
            initColor: '#fa71cd',
            lightRange: 1.1,
            darkRange: 0.9
        }

        if(options.lightRange < 1 || (options.darkRange > 1 || options.darkRange < 0)){
            console.error('Please pass in the correct value range - lightRange among (1,2] and darkRange among (0,1)')
        }
        
        var initColor = options.initColor || __DEFAULT__.initColor,
        newColor = initColor;
        rect.style.backgroundColor = initColor;
    
        light.addEventListener("click", function () {
            ld(options.lightRange || __DEFAULT__.lightRange, Math.min, 255);
        });
        dark.addEventListener("click", function () {
            ld(options.darkRange || __DEFAULT__.darkRange, Math.max, 0);
        });
        reset.addEventListener("click", function () {
            newColor = initColor;
            rect.style.backgroundColor = newColor;
        });
    
        // 计算明暗程度值（rgb值）
        function ld(factor, func, mom) {
            var obj = fl(newColor);
            console.log(factor,obj.r * factor,obj.g * factor,obj.b * factor)
            obj.r = func(obj.r * factor, mom) | 0;
            obj.g = func(obj.g * factor, mom) | 0;
            obj.b = func(obj.b * factor, mom) | 0;
    
            console.log(obj.r,obj.g,obj.b)
            newColor = "#" + hc(obj).toString(16);
            rect.style.backgroundColor = newColor;
        }
        //分离R/G/B
        function fl(rgb) {
            if (rgb.constructor == String)
                rgb = parseInt(rgb.replace(/^\s*#|\s*$/g, ""), 16);
            var obj = {};
            obj.r = rgb >> 16;
            obj.g = rgb >> 8 & 0xff;
            obj.b = rgb & 0xff;
    
            return obj;
        }
        //合并RGB
        function hc(obj) {
            console.log('xx', (obj.r << 16) | (obj.g << 8) | (obj.b))
            return (obj.r << 16) | (obj.g << 8) | (obj.b);
        }
    }
})
