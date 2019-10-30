;(function(globle, factory){
    return factory.call();
})(this, function(){
    /**
     * 在Date原型上定义一个format
     */
    Date.prototype.format = function (fmt) {

        // 拓展自定义时间文本格式pattern
        var pattern = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "w+": getWeek(this.getDay()), // 星期
        "q+": "第" + Math.floor((this.getMonth() + 3) / 3) + "季度", //季度
        "S": this.getMilliseconds() //毫秒
        };

        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, 
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in pattern)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, 
        (RegExp.$1.length == 1) ? (pattern[k]) : (("00" + pattern[k]).substr(("" + pattern[k]).length)));
        return fmt;
    }

    /**
     * 获取星期方法
     */
    function getWeek(i){
        switch(i){
                 case 0: return "星期日"; 
                 case 1: return "星期一"; 
                 case 2: return "星期二"; 
                 case 3: return "星期三"; 
                 case 4: return "星期四"; 
                 case 5: return "星期五";
                 case 6: return "星期六";
             }
    }

    /**
     * 调用方法,format()内部可输入需要展示的时间文本
     */
    var date_time =  new Date('2018/3/25 20:24:42').format("yyyy-MM-dd w hh:mm:ss q");
    alert(date_time);
});