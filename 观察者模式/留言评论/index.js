//观察者模式
var observer = (function(){
  var _messages = {};
  return {
    //注册信息接口
    regist: function(type,fn){
      //消息不存在则创建一个
      if(typeof _messages[type] === 'undefined'){
        _messages[type] = [fn];
      }else{
        _messages[type].push(fn);
      }
      return this;
    },
    //发布信息接口
    fire: function(type,args){
      //如果该消息没有被注册，则返回
      if(!_messages[type]){
        return this;
      }
      //定义消息信息
      var events = {
            type: type,//消息类型
            args: args||{}//消息携带的数据 
          },
          i = 0,
          len = _messages[type].length;
      for( ; i<len; i++){
        _messages[type][i].call(this,events);
      }
      return this;
    },
    //移除信息接口
    remove: function(type,fn){
      if(_messages[type] instanceof Array){
        var i = _messages[type].length - 1;
        for(; i>=0; i--){
          if(_messages[type][i] === fn){
            _messages[type].splice(i,1);
          }
        }
      }
      return this;
    }
  }
})();


function $(id){
  return document.getElementById(id);
}

//留言评论展示模块
(function(){
  //追加一则消息
  function addMsgItem(e){
    var text = e.args.text,
        ul = $('msg'),
        li = document.createElement('li'),
        span = document.createElement('span');//删除按钮

    span.innerHTML="删除";
    li.innerHTML = text;

    span.addEventListener('click',function(){
      ul.removeChild(li);
      observer.fire('removeCommentMessage',{
        num: -1
      });
    });
    li.appendChild(span);
    ul.appendChild(li);
  }
  //注册添加评论信息
  observer.regist('addCommentMessage',addMsgItem);
})();

//用户消息模块
(function(){
  //更改用户消息数目
  function changeMsgNum(e){
    //获取需要增加的用户消息数目
    var num = e.args.num;
    //增加用户消息数目并写入页面中
    $('msg_num').innerHTML = parseInt($('msg_num').innerHTML) + num;
  }

  //注册添加评论信息
  observer.regist('addCommentMessage',changeMsgNum)
          .regist('removeCommentMessage',changeMsgNum);
})();

//提交模块
(function(){
  //用户点击提交按钮
  $('user_submit').addEventListener('click',function(){
    var text = $('user_input');
    if(text.value === ''){
      return;
    }
    observer.fire('addCommentMessage',{
      text: text.value,
      num: 1
    });
    text.value = '';
    console.log(observer);
  });
})();

