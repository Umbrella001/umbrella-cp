$(function(){
    //成为焦点
    $(".login-content .panel input").focus(function(){
        $(this).next().hide();
    });
    //失去焦点
    $(".login-content .panel input").blur(function(){
        var cur = $(this), value = cur.val(),filter,text1,text2;
        if(cur.attr('name')=='mobile'){
            filter = /^(13[0-9]|14[5|7]|15[0-9]|17[0|1|2]|18[0-9])\d{8}$/;
            text1 = '手机号不能为空';
            text2 = '手机号格式错误';
        }else if(cur.attr('name')=='password'){
            filter = /^[a-zA-Z0-9]\w{5,17}$/;
            text1 = '密码不能为空';
            text2 = '密码格式错误';
        }
        checkTip(value,cur,filter,text1,text2);
    });
    //公共方法
    function checkTip(value,cur,filter,text1,text2){
        if(value==''){
            cur.next().show().text(text1);
        }else if(!filter.test(value)){
            cur.next().show().text(text2);
        }else {
            cur.next().hide();
        }
    };
    //登录
    $(".panel .login").click(function(){
        var _mobile = $.trim($(".mobile").val()),
            _psd = $.trim($(".password").val());
        var data = {
            mobile:_mobile,
            password:_psd
        };
        //提交校验
        if(!_mobile || !_psd || $(".error-tip").is(":visible")){
            $(".msg-tip").show();
        }else {
            $.ajax({
                type:'post',
                url:'http://localhost:3333/form_info',
                data:data,
                dataType:'json',
                success:function(res){
                    console.log(res)
                    if(res.code=='200'){
                        window.location.href="index.html";   //跳转  
                    }
                },
                error:function(error){
                    console.log(error)
                }
            })
        }
        
    })
})