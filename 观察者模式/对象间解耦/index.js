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
      console.log("regist:"+type);
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
      console.log("fire:"+type+" "+args);
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
      console.log("remove:"+type);
      return this;
    }
  }
})();



var student = function(result){
  var that = this;
  this.result = result;
  this.say = function(){
    console.log(that.result);
  }

}
student.prototype.answer = function(question){
  observer.regist(question,this.say);
}
student.prototype.sleep = function(question){
  observer.remove(question,this.say);
}

var teacher = function(){

}
teacher.prototype.ask = function(question){
  console.log("问题是"+question);
  observer.fire(question)
}

//test

var student1 = new student("学生一回答问题");
var student2 = new student("学生二回答问题");
var student3 = new student("学生三回答问题");

student1.answer("什么是设计模式");
student3.answer("什么是设计模式");
student1.answer("什么是观察者模式");
student2.answer("什么是观察者模式");


var teacher = new teacher();
teacher.ask("什么是设计模式");
teacher.ask("什么是观察者模式");
student2.sleep("什么是观察者模式");
teacher.ask("什么是观察者模式");