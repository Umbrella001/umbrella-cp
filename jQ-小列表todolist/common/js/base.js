;(function(){
    'use strict';

    $(function(){
        var $form_add_task = $('.add-task').children(".btn")
        , $form_input = $('.add-task').children('input')
        , $task_delect_trigger
        , $task_detail_trigger
        , $task_detail = $('.task-detail')
        , $task_detail_mask = $('.task-detail-mask')
        , task_list = []
        , current_index
        , $update_form
        , $task_detail_content
        , $task_detail_content_input
        , $checkbox_complete
        , $msg = $('.msg')
        , $msg_content = $msg.find('.msg-content')
        , $msg_confirm = $msg.find('.anchor')
        , $notify = $('.notify')
        , $body = $('body')
        , $window = $(window)
        , timer_index
        ;

    /*
    将store中的get和set做成个整体方法 
    */
    var callStore  = {
        get: function(obj,index){
            if(typeof(obj) !== "string") throw new Error("Please enter the correct parameter type --obj(string)");
            // 修复BUG第一条不能进行数据更新问题
            if(index === 0 || index){
                try{
                    return store.get(obj)[index];
                }catch(e){
                    console.log(e);
                }
                
            }
            return store.get(obj);
        },
        set: function(obj,param){
            if(typeof(obj) !== "string") throw new Error("Please enter the correct parameter type --obj(string)");
            return store.set(obj,param);
        }
    }

    init();

    /* 
       初始化并且读取localStorage数据
    */
    function init(){

        // 读取当前localStorage的数据,没有则返回空数组
        task_list = callStore.get('task_list') || [];

        // 如果当前浏览器的localStorage有数据task_list就渲染模版
        if(task_list.length) render_task_list();

        // 开启对比设置事时间和当前时间函数
        task_remind_check();

        // 开启提醒功能
        listen_msg_event();
     }


    /* 
      监听输入框提交按钮的点击事件及输入框回车输出功能（监听调用）
    */
    $form_add_task.on('click', add_task_fn);
    $form_input.on('keydown',function(e){
        var e = e || window.event;
        if(e.keyCode == 13){
            // 13keyCode为回车键
            add_task_fn();
        }
    })

    /*
       [输入框]添加task条目的（方法） 
     */
    function add_task_fn(){
        var new_task = {}, $inputVal;
        
       
        // 获取新Task的值
        $inputVal = $form_input;
        new_task.content = $inputVal.val();

        // 如果Task值为空，则直接返回 否则继续执行
        
        if(!new_task.content &&  new_task.content == '') return;
        
        
        if(add_task(new_task)){
        // 清空输入框的内容
        $inputVal.val(null);
        
        }
    }

    /* 添加清单条目 */ 
    function add_task(new_task){
        

        // 将新Task推入task_list
        task_list.push(new_task);

        // 更新localStrage并返回一个boolean
        refresh_task_list();
        return true;
    }

    /* 
      添加、删除、更新详情时调用该方法 >>> 刷新localStorage储存的数据并且更新页面
     */
    function refresh_task_list(){
        
        callStore.set('task_list',task_list);       
        render_task_list();
    }

    /* 
      每一次添加删除以及提交都调用 渲染全部Task模板
     */
    function render_task_list(){
        
        var $task_list = $('.task-list');
        $task_list.html('');
        var complete_items = []; // 声明定义一个接受完成task的空数组容器

        // 循环调用渲染单条Task模板（调用）
        for(var i = 0; i < task_list.length; i++){
            var complete_item = task_list[i];
            if(complete_item && complete_item.complete){
                complete_items[i] = complete_item;
            }else{
                var $task_item = render_list_item(task_list[i],i);
                $task_list.prepend($task_item);
            }        
        }

        for(var j = 0; j < complete_items.length; j++){
                    var $task_item = render_list_item(complete_items[j],j);
    
                    if(!$task_item) continue;
                    $task_item.addClass('completed');
                    $task_list.append($task_item);
                }

        // 拿到渲染后的页面进行对应的监听事件(注意必须是渲染完list内的item后才有对应的item元素,JQ是不会再次去更新的)
        $task_delect_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        $checkbox_complete = $('.task-item .complete');

        // 开启[删除][详情][checkbox]按钮的监听
        listen_task_delete();
        listen_task_detail();
        listen_checkbox_complete();
    }

     /* 
       渲染单条Task模板（方法） 
     */
     function render_list_item(data, index){
        
        if(!data) return;
        
         var list_item = 
            '<div class="task-item" data-index=" ' + index + '">' + 
            '<span><input class="complete" ' + (data.complete ? "checked" : "" )+ ' type="checkbox"></span>' + 
            '<span class="task-content"> '+ data.content + '</span>' + 
            '<span class="fright">' +
            '<span class="action delete"> 删除</span>' + 
            '<span class="action detail"> 详情</span>' + 
            '</span>' +
            '</div>';

        return $(list_item);
    }

    /* 
      确认删除当前task清单条目 
    */
   function delete_task(index){
        
    // 如果没有index或者不存在则直接return
    if( index === undefined || !task_list[index]) return;
    delete task_list[index];
    refresh_task_list()
}

    /* 
      查找并监听task[删除]按钮的点击事件 
    */
    function listen_task_delete(){
        $task_delect_trigger.on('click', function(){
        var $this = $(this);

        // 找到删除按钮对应的task元素
        var $item = $this.parent().parent();
        var index = Number($item.data('index'));

        // 确认是否删除询问
        popup(task_list[index]).then(function(result){
            result ? delete_task(index) : null;
        });
        
    })
    }

    /* 
      查找并监听对应task的[详情]按钮点击事件 
    */
    function listen_task_detail(){
        var index;

        // 双击task对应条目打开详情
        $('.task-item').on('dblclick',function(){
            index = Number($(this).data('index'));
            // 调用详情列表展示方法
            show_task_detail(index);
        })

        $task_detail_trigger.on('click',function(){
            var $this = $(this);
            var $item = $this.parent().parent();
            index = Number($item.data('index'));
            show_task_detail(index);
        })
    }

    /* 
      查找并监听对应task的[checkbox]按钮完成任务task事件 
    */
    function listen_checkbox_complete(){
        $checkbox_complete.on('click',function(){
            var $this = $(this)

            var index = Number($this.parent().parent().data("index"));

            // 拿到点击的item切换complete中的值
            var item = callStore.get("task_list",index);
            if(item.complete){
                update_task(index,{complete: false});             
            }else{
                update_task(index,{complete: true});
            }
        })
    }

    /*
      监听弹出的提示信息的[知道了]元素的点击事件
    */
   function listen_msg_event(){    
       $msg_confirm.on('click',function(){
           hide_msg();
       })
   }

    /* 
      点击[详情]展示遮罩和详情框 
    */
    function show_task_detail(index){

        // 点开对应task拿到最新的localStorage数据
        render_task_detail(index);
        current_index = index;
        $task_detail.show();
        $task_detail_mask.show();
    }

    /* 
      隐藏详情框（监听调用）
     */
    $task_detail_mask.on('click', hide_task_detail);

    /* 
      点击mask隐藏遮罩和详情框（方法）
    */
    function hide_task_detail(){
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    /*
      接收task的data数据,并调用渲染模板refresh_task_list更新localStorage数据
    */
    function update_task(index,data){
        if(index === undefined || !task_list[index]) return;
        task_list[index] = $.extend({},task_list[index],data);

        refresh_task_list();
    }

    /*
      在Date的原型链上增加一个日期格式为(yyyy-MM-dd hh:mm:ss)的format方法
    */
    Date.prototype.format = function (fmt) {
        var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /* 
      渲染指定task对应详情框的数据
     */
    function render_task_detail(index){
        if( index === undefined || !task_list[index]) return;
        var item = task_list[index];

        var detail_content = 
            '<form>'  +
            '<div class="item-content">'  +
            item.content + 
            '</div>'  +
            '<div>' +
            '<input style="display: none;" name="content" value="'+ (item.content || '') +'">' +
            '</div>' +
            '<div class="item-desc">'  +
            '<textarea name="desc">' + (item.desc || '') + '</textarea>'  +
            '</div>'  +
            '<div class="item-remind">' +
            '<label style="margin-bottom: 4px">提醒时间</label>' +
            '<input class="datetime" name="remind_date" value="' + (item.remind_date || new Date().format("yyyy-MM-dd hh:mm")) + '" type="text">'  +
            '</div>' +
            '<div><button type="submit">更新</button></div>' + 
            '</form>' ;

        // 用新模版代替旧模板
        $task_detail.html(null);
        $task_detail.html(detail_content);

       
        $('.datetime').datetimepicker();

        // 获取对应详情列表的元素
        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find('.item-content');
        $task_detail_content_input = $update_form.find('[name = content]') 

        // 双击[详情标题]可以更改当前标题名字
        $task_detail_content.on('dblclick',function(){
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })

        // 监听详情页面[更新]按钮执行
        $update_form.on('submit',function(e){
            e.preventDefault();
            var data = {};

            // 获取表单中元素的值,整合为新数据去渲染模板
            data.content = $(this).find('[name = content]').val();
            data.desc = $(this).find('[name = desc]').val();
            data.remind_date = $(this).find('[name = remind_date]').val();

            // 点击[更新]按钮当前更改或未更改的详情数据并隐藏详情列表
            update_task(index, data);
            hide_task_detail();
        })
    }

    /*
       对比当前task中设置的事件和当前时间开启提醒功能 
     */
    function task_remind_check(){
        var current_time
        , item
        , task_time
        ;
        var timer = setInterval(function(){
            for(var i = 0; i < task_list.length; i++){
                item = callStore.get('task_list',i);
                
                if(!item || item.informed) continue;
    
                current_time = (new Date().getTime());
                task_time = (new Date(item.remind_date).getTime());
                
                if(current_time - task_time >= 1 && current_time - task_time <= 60000){
                    // 如果当前时间到达设置时间则更新localStorage中informed的值
                    update_task(i,{informed: true});
                    timer_index = i;
                    show_msg(item.content);
                }
            }
        },300);
        
    }

    /*
       弹出对应task名字的提示框同时播放提醒音乐
     */
    function show_msg(content){
        $msg.show();
        $notify.get(0).play(); // 开始播放
        $msg_content.html(content) 
    }

    /*
       隐藏对应task名字的提示框并暂停重置提醒音乐
     */
    function hide_msg(){
        $msg.hide();
        $notify.get(0).currentTime = 0; // 重置播放时间
        $notify.get(0).pause();  // 暂停播放

        // 修复BUG当前任务不能二次提醒
        var hide_timer = setTimeout(function(){
            update_task(timer_index,{informed: false})
            clearTimeout(hide_timer);
        },60300)
    }

    /*
       自定义pop确定删除窗口 
     */
    function popup(data){
        if(!data) throw new Error("Lack of parameters data!");
        var conf = {}
        , $pop
        , $pop_mask
        , $pop_title
        , $pop_content
        , $callBack
        , $pop_primary
        , $pop_cancel
        , timer
        , confirmed
        ;
        
        conf = $.extend({},data);

        $callBack = $.Deferred();

        // 定义pop弹窗及pop_mask遮罩的样式
        $pop = $(
            '<div>' + 
            '<div class="pop-title">' +
            '确定删除吗(ಥ _ ಥ)' +
            '</div>' +
            '<div class="pop-content">' +
            '【任务/计划标题】' +
            data.content +
            '<hr>' +
            '【描述】' +
            (data.desc || "暂无") +
            '<hr>' + 
            '【时间】' +
            (data.remind_date || "暂无") +
            '</div>' + 
            '<div class="btn">' +
            '<button class="pop-primary">确定</button>' +
            '<button class="pop-cancel">取消</button>' +
            '</div>' +
            '</div>'
        ).css({
            position: "fixed",
            width: 360,
            height: "auto",
            background: "#fff",
            borderRadius: 4,
            boxShadow: '0 1px 2px rgba(0,0,0,.5)',

        })
        $pop_mask = $('<div></div>').css({
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,.5)",
        })

        $pop_title = $pop.find('.pop-title').css({
            padding: '5px 10px',
            fontSize: 18,
            textAlign: 'center',
            background: '#fbff00'
        })

        $pop_content = $pop.find('.pop-content').css({
            padding: '10px 10px',
            
        })

        // 将写好的弹窗和遮罩添加到body层下面
        $pop_mask.appendTo($body);
        $pop.appendTo($body);

        // 监听浏览器窗口缩放调用响应式函数pop_position
        $window.resize();
        pop_position($pop);
       

        $pop_primary = $pop.find('.pop-primary');
        $pop_cancel = $pop.find('.pop-cancel');

        timer = setInterval(function(){
            if(confirmed !== undefined){
                $callBack.resolve(confirmed);
                clearInterval(timer)
                close_pop();
            }
        },50);

        // 监听弹窗中的[确认]按钮的点击事件
        $pop_primary.on('click',function(){
            confirmed = true;
        })

        // 监听弹窗中的[取消]按钮的点击事件
        $pop_cancel.on('click',function(){
            confirmed = false;
        })

        function close_pop(){
            $pop.remove();
            $pop_mask.remove();
        }

       // 使弹窗在用户伸缩浏览器窗口的响应式处理obj为需要响应式的对象
        function pop_position(obj){
            var window_width = $window.width()
            , window_height = $window.height()
            , pop_width = obj.width()
            , pop_height = obj.height()
            , pop_x
            , pop_y
            , pop_clientY = 20
    
            pop_x = (window_width - pop_width) / 2 ;
            pop_y = ((window_height - pop_height) / 2) - pop_clientY;
            
            obj.css({
                left: pop_x,
                top: pop_y
            })

            $window.on('resize',function(){
                pop_position(obj);
            })
        }

        return $callBack.promise();

    }
    

    })
})();

