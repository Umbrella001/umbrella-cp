window.onload = function(){
    new Vue({
        el:'#my',
        data:{   //数据
            adBack:true,  //显示
            n:5,
            timer:null,   //定时器
            mobile:'',  //手机号
            password:'' , //密码
        },
        methods:{   //方法
            play:function(){
               this.timer = setInterval(this.autoPlay,1000);
            },
            autoPlay:function(){
                this.n--;
                if(this.n==0){
                    this.jump();
                }
            },
            jump:function(){    //点击跳转
                 this.adBack = false;   //隐藏
                 clearInterval(this.timer);   //清除定时器
            },
            login:function(){   //登录
                //alert(this.mobile)
                var data = {
                    mobile:this.mobile,
                    password:this.password
                };
                if(this.mobile =='' || this.password==''){
                    alert('请输入信息');
                }else {
                    axios({
                        method:'post',
                        url:'http://localhost:3333/list_add',
                        //data:data
                    }).then(function(res){
                        console.log('ok')
                        if(res.code=='200'){
                            //页面跳转（路由）
                        }
                    }).catch(function(error){
                        console.log(error)
                    })
                }
            }
        },
        mounted:function(){   //生命周期  挂载完成
            this.play();
        }
    })
}