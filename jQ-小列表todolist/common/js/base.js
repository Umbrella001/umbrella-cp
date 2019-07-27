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
        ;

    init();

    /* 
       初始化并且读取localStorage数据
     */
    function init(){
        task_list = store.get('task_list') || []; 


        if(task_list.length) render_task_list();
     }

    /* 
      监听输入框提交按钮的点击事件及输入框回车输出功能（监听调用）
    */
    $form_add_task.on('click', add_task_fn);
    $form_input.on('keydown',function(e){
        var e = e || window.event;
        if(e.keyCode == 13){
            add_task_fn();
        }
    })

    /*
       [输入框]添加task条目的（方法） 
     */
    function add_task_fn(){
        var new_task = {}, $inputVal;
        console.log("++++111+++");
       
        // 获取新Task的值
        $inputVal = $form_input;
        new_task.content = $inputVal.val();

        // 如果Task值为空，则直接返回 否则继续执行
        console.log("++++222+++");
        if(!new_task.content &&  new_task.content == '') return;
        console.log("+++333++++");
        
        if(add_task(new_task)){
            // 清空输入框的内容
        $inputVal.val(null);
        
        }
    }

    /* 添加清单条目 */ 
    function add_task(new_task){
        console.log("++++444+++",new_task);

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
        console.log("+++555++++",task_list);
        store.set('task_list',task_list);       
        render_task_list();
    }

    /* 
      每一次添加删除以及提交都调用 渲染全部Task模板
     */
    function render_task_list(){
        console.log("++++666+++");
        var $task_list = $('.task-list');
        $task_list.html('');

        // 循环调用渲染单条Task模板（调用）
        for(var i = 0; i < task_list.length; i++){
            var $task_item = render_list_item(task_list[i],i);
            $task_list.prepend($task_item);
        }

        // 拿到渲染后的页面进行删除监听(注意必须是渲染完list内的item后才有对应的item元素,JQ是不会再次去更新的)
        $task_delect_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
    }

     /* 
       渲染单条Task模板（方法） 
     */
     function render_list_item(data, index){
        console.log("+++777++++");
        if(!data) return;
        console.log("+++888++++");
         var list_item = 
            '<div class="task-item" data-index=" ' + index + '">' + 
            '<span><input type="checkbox"></span>' + 
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
        var pop = confirm('确认删除吗?');
        pop ? delete_task(index) : null;
    })
    }

    /* 
      查找并监听对应task的详情按钮点击事件 
    */
    function listen_task_detail(){
        $task_detail_trigger.on('click',function(){
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = Number($item.data('index'));

            // 调用详情列表展示方法
            show_task_detail(index);
    })
    }

    /* 
      点击[详情]展示遮罩和详情框 
    */
    function show_task_detail(index){
        render_task_detail(index);
        current_index = index;
        $task_detail.show();
        $task_detail_mask.show();
        $update_form = $task_detail.find('form');
        $update_form.on('submit',function(e){
            e = e || window.event;
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();

            // 传递当前task的最新数据
            update_task(index,data);
        })
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
        if(!index || !task_list[index]) return;
        task_list[index] = data;
        refresh_task_list();
    }

    /* 
      渲染指定task对应详情框的数据
     */
    function render_task_detail(index){
        if( index === undefined || !task_list[index]) return;
        var item = task_list[index];

        console.log("item",item);
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
            '<input name="remind_date" type="date" value=' + item.remind_date + '>'  +
            '</div>' +
            '<div><button type="submit">更新</button></div>' + 
            '</form>' ;
        $task_detail.html(null);
        $task_detail.html(detail_content);
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
            data.content = $(this).find('[name = content]').val();
            data.desc = $(this).find('[name = desc]').val();
            data.remind_date = $(this).find('[name = remind_date]').val();

            // 点击[更新]按钮当前更改或未更改的详情数据并隐藏详情列表
            update_task(index, data);
            hide_task_detail();
        })
    }
 
    })
})();

