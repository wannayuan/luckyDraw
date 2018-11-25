// 初始化组件
// @param element指定父容器 
// @param number为滚动码的个数
function init (element,number) {
  var element=arguments[0]?arguments[0]:'slots';
  var number=arguments[1]?arguments[1]:7;
  var slot='',slot_item='';
  var arr=[];
  for(var j=0;j<number;j++){
   slot_item='';
   arr=(j>0)?randomArray():[];
   arr=randomArray();
   for (var i=0;i<10;i++){
    var value=j>0?arr[i]:'M';
  	slot_item+=`<div class="slot-item">
	              <div class="slot-number" value=`+value+`>
	                <span>`+value+`</span>
	              </div>
	            </div>
	            `;
   }
   slot+=`<li class="slot">
              <div class="slotMechineContainer">`
              +slot_item+`
              </div>
          </li>
          `;
  }
 $('.'+element).append(slot);
}

//随机指定范围内N个不重复的数
//@param min 指定范围最小值
//@param max 指定范围最大值
//@param n 随机数的个数
function randomArray(min,max,n){
   // 设置参数默认值
   var min=arguments[0]?arguments[0]:0;
   var max=arguments[1]?arguments[1]:10;
   var n=arguments[2]?arguments[2]:10;
   // console.log('min'+min+'max'+max+'n'+n);
   // 验证参数
   if(n>(max-min+1)||min>max){
   	return null;
   }
   var arr=new Array();
   var count=0;
   var num;
   for(var i=0;i<n;i++){
   	num=parseInt(Math.random()*(max-min))+min;
    if(arr.indexOf(num)<=-1){
      arr.push(num);
    }else{
      do{
       num=parseInt(Math.random()*(max-min))+min;
      }while(arr.indexOf(num)>-1);
      arr.push(num);
    }
   }
   return arr;
}

// 开始抽奖
// @param 每一列对应的项的高度
// @param length 每一列项的数量
// @param speed 滚动的速度
// @param radio px与rem的转换比率
function startDraw(height,speed,length,radio){
  var top=0;
  var trans;
  var height=arguments[0]?arguments[0]:220;
  var speed=arguments[1]?arguments[1]:25;  //每20毫秒执行一次函数
  var length=arguments[2]?arguments[2]:9; 
  var radio=arguments[3]?arguments[3]:100;
  // 为父元素添加遮罩蒙层
  $('.slotMechineContainer').parent().addClass('slotMachineGradient');
  var time=setInterval(function(){
    top+=height;
    if(Math.abs(top)>Math.abs(height*length)){
    	top=0;
    }
    //以1rem等于100px为基准
    trans=-top/radio+'rem';
    $('.slotMechineContainer').addClass('slotMachineBlurFas').css({
    	transition: 'all '+speed/1000+'s'+' ease-out 0s',
    	transform: 'translateY('+trans+")"
    })
  },speed);
  // 返回间歇函数句柄
  return time;
}

// 结束抽奖
// @param time 间歇函数的句柄  必填
// @param ptizeNumber 中奖号码  
// callback 函数执行完的回调函数
// @param speed 过渡时间
// @param height 每个项的高度
// @param radio px与rem的转换比率
function endDraw(time,prizeNumber,callback,height,speed,radio){
  var height=arguments[3]?arguments[3]:220;
  var speed=arguments[4]?arguments[4]:2000;
  var radio=arguments[5]?arguments:100;
  if(!time){
  	return false;
  }
  // 清除间歇函数
  clearInterval(time);
  //去除遮罩蒙层
  $('.slotMechineContainer').parent().removeClass('slotMachineGradient');
  // 中奖号码 返回一个数组
  var prize=randomArray();
  prize.unshift('M');
  for(var i=0;i<prize.length;i++){
  	var slot=$('.slotMechineContainer:eq('+i+')').find('.slot-number');
    for(var j=0;j<slot.length;j++){
    	var slot_num=$(slot[j]).attr('value');
    	if(slot_num==prize[i]){
          var top=height*j;
          var trans=-top/radio+'rem';
          // 过渡效果的时间
          var tran_speed=randomArray(1400,speed,1);
          $('.slotMechineContainer:eq('+i+')').removeClass('slotMachineBlurFas').css({
            transition:'all '+tran_speed/1000+'s'+' ease-out 0s',
            transform: 'translateY('+trans+")"
          })
    	}
    }  
  }
  // 抽奖结束后的回调函数
  var callback=callback?callback:function(){time=''};
  callback();
}