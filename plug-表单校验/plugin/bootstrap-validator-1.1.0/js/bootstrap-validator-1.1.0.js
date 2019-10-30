/*!
 * PluginName: bootstrap-validator-1.1.0 
 * Version: @1.1.0
 * Include: jQuery@2.2.4 || Bootstrap@3.3.5
 * ----------------------------------------------
 * Author: liber
 * Date: 2019-03-20T13:01Z
 */

;(function(global, factory, plug){
    /* 
     * call调用factory创建闭包
     */
    return factory.call(global, global.jQuery, plug);

})(this, function($,plug){
    
    var __TYPECHECK__ = {
        raise : "change"  // 表单检测默认值
    };
    /* 
     * 声明：检测规则定义引擎,return 后写对应表达式
     * 扩展：可定义需要的校验器
     * 特定：返回值 true/false
     */
    var __RULES__ = {
        "require": function(){
            return !!this.val();
        }, // 必填项
        "email": function(){
            return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.val());
        }, // 邮箱地址 
        "mobile": function(){
            return /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(this.val());
        }, // 手机号码 || 新增了166、198、199号段的手机号--china
        "phone": function(){
            return  /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(this.val());
        }, // 固定号码 || 支持400 或 800开头
        "ip_address": function(){
            return /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/.test(this.val());
        }, // ip地址
        "id_card": function(){
            return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/.test(this.val());
        }, // 身份证--china 15位和18位数
        "maxlength": function(){
            return this.val().length <= 20;
        }, // 最大长度--用户邮箱长度（自定义可忽略..）
        "password_regex": function(){
            return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(this.val());
        }, // 自定义正则--用户密码
        "minlength": function(){
            return true;
        }, // 最小长度
        "maxvalue": function(){
            return true;
        }, // 最大值
        "number" :function(){
            return true;
        }, // 数字
        "amount": function(){
            return true;
        }, // 金额

        /* ↓
         *  ...扩展规则槽...
         * ↓
         */
    }

    /*
     * 定义：创建jquery插件($.prototype原型上添加)
     * 调用：HTML直接调用plug插件名
     */ 

    $.fn[plug] = function(ops){
        this.each(function(){
            var $this = $(this);
            $.extend($this,ops);
            /*
             * 作用：获取form表单的监听type
             * 范围（插件开启关闭权）：默认作用于所用表单,如果部分表单不适用该插件的功能,input上就不开启data-bv即可
             * 优先级：先获取form表单上的规则 > 调用plug的ops规则 > 使用bv的默认值
             */ 
            $this.raise = $this.data("bv-type") || $this.raise || __TYPECHECK__.raise;
            var $fields = $this.find("[data-bv=true]");
            $fields.on($this.raise,function(){
                var $fields = $(this);
                var $group = $fields.parents(".form-group").removeClass("has-success has-error"); // 初始化检验状态
                $group.find(".help-tip").remove(); // 清空错误提示
                var result = true; // 默认规则正确
                $.each(__RULES__,function(rule, vaild){
                    if($fields.data("bv-"+ rule)){
                        var $error_tip = $fields.data("bv-"+ rule + "-error");
                        /*
                         * 作用: 得到当前call的元素标签上的属性相对应的vaild返回值
                         * 多重规则顺序验：根据规则定义引擎里的顺序进行顺验,如果不成立不进行下一个校验,并提示当前的错误信息
                         */
                        result = vaild.call($fields);
                        if(!result){
                            $fields.after('<span class="help-tip">'+ $error_tip +'</span>'); // 获取错误提示
                        }
                        return result;
                    }
                });
                $group.addClass(result ? "has-success" : "has-error");
            })
        });
    };
}, "bootstrapValidtor");