$(function () {
    var $main = $('.main');
    var $list = $('.talk_list');
    var $drager = $('.drager');
    var $mainh = $main.outerHeight(false);
    var $listh = $list.outerHeight(false);

    var $rate = $mainh / $listh;
    var $dragh = $mainh * $rate;
    var $top = 0;
    $drager.css({ 'height': $dragh });

    $drager.draggable({
        containment: "parent",
        drag: function (ev, ui) {
            $top = ui.position.top;
            $list.css({ 'top': -$top / $rate });
        }
    });

    $(window).resize(function () {
        resetui();
    });

    //var timer = null;
    var flag = false;

    $main.mousewheel(function(ev,delta){
        //console.log(delta);
        //clearTimeout(timer);
        //timer = setTimeout(function(){
            // 向上滚动正值，向下滚动负值
        if(flag){
            return;
        }

        flag = true;
        
        setTimeout(function(){
            flag = false;
        },300);

        if($listh <= $mainh){
            return;
        }else{
            if(delta>0){
                $top = $top-60;
                if($top<0){
                    $top=0;
                }
                $drager.animate({ 'top': $top },200);
                $list.animate({ 'top': -$top / $rate },200);
            }else{
                $top = $top+60;
                if($top>($mainh-$dragh)){
                    $top=parseInt($mainh-$dragh);
                }
                $drager.animate({ 'top': $top },200);
                $list.animate({ 'top': -parseInt($top / $rate) },200); 
            }
        }

        //},300);        
    });
    if ($listh <= $mainh) {
        $('.drag_bar').hide();
        $('.drager').hide();
    }

    function resetui(){
        $mainh = $main.outerHeight(false);
        $listh = $list.outerHeight(false);
        $rate = $mainh / $listh;
        $dragh = $mainh * $rate;
        $drager.css({ 'height': $dragh });
        
        if ($listh <= $mainh) {
            $('.drag_bar').hide();
            $drager.hide();
            $list.css({ 'top':0 });
        } else {
            $('.drag_bar').show();
            $drager.show();
            $drager.css({ 'top': $mainh-$dragh });
            $list.css({ 'top': -($listh-$mainh) });
        }
    }

    window.resetui = resetui;
})


$(function () {
  // 初始化右侧滚动条
  // 这个方法定义在scroll.js中
  resetui()

  // 为发送按钮绑定鼠标点击事件
  $('#btnSend').on('click', function () {
    var text = $('#ipt').val().trim()
    if (text.length <= 0) {
      return $('#ipt').val('')
    }
    // 如果用户输入了聊天内容，则将聊天内容追加到页面上显示
    $('#talk_list').append('<li class="right_word"><img src="img/person02.png" /> <span>' + text + '</span></li>')
    $('#ipt').val('')
    // 重置滚动条的位置
    resetui()
    // 发起请求，获取聊天内容
    getMsg(text)
  })

  // 获取聊天机器人发送回来的消息
  function getMsg(text) {
    $.ajax({
      method: 'GET',
      //url: 'http://ajax.frontend.itheima.net:3006/api/robot',
	  url:'http://www.liulongbin.top:3006/api/robot',
      data: {
        spoken: text
      },
      success: function (res) {
        // console.log(res)
        if (res.message === 'success') {
          // 接收聊天消息
          var msg = res.data.info.text
          $('#talk_list').append('<li class="left_word"><img src="img/person01.png" /> <span>' + msg + '</span></li>')
          // 重置滚动条的位置
          resetui()
          // 调用 getVoice 函数，把文本转化为语音
          getVoice(msg)
        }
      }
    })
  }

  // 把文字转化为语音进行播放
  function getVoice(text) {
    $.ajax({
      method: 'GET',
      //url: 'http://ajax.frontend.itheima.net:3006/api/synthesize',
	  url:'http://www.liulongbin.top:3006/api/synthesize',
      data: {
        text: text
      },
      success: function (res) {
        // console.log(res)
        if (res.status === 200) {
          // 播放语音
          $('#voice').attr('src', res.voiceUrl)
        }
      }
    })
  }

  // 为文本框绑定 keyup 事件
  $('#ipt').on('keyup', function (e) {
    // console.log(e.keyCode)
    if (e.keyCode === 13) {
      // console.log('用户弹起了回车键')
      $('#btnSend').click()
    }
  })
})
