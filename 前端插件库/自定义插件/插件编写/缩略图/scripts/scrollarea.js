
;(function($,window){
	
	//给Jquery添加方法
	$.fn.addScrollAble = function(options){
		
			/*合并默认设置的和传入的参数*/
			var opts = $.extend({},$.fn.addScrollAble.defaultOpts,options || {});			
			//遍历
			return this.each(function() {       			
							//当前对象   滚动目标外围	滚动目标	节点列表	当前索引	UL尺寸	节点尺寸	滚动歩长  节点总数量  当前页索引  总的页数
							var that = $(this);	  //当前对象 						
							var scroller = that.children("div:first");  //  滚动目标外围
							var scrollUl=scroller.find("ul:first")		//  滚动目标
							var liList = scroller.find("ul > li");  //  获取所有的list列表
							var curIndex = 0, ulSize = 0, itemSize = 0, margin = 0,  scrollStep = 0 , size = 0,timer = null;
							var curPage = 0 , totalPage = 0,maxValue=0,minValue=0,leftValue=0;
							//初始化UL		水平--垂直	
							scroller.css({
								"position":"relative",
								"overflow":"hidden",
								"z-Index":1
								});		
							scrollUl.css({
										"position":"absolute",
										"left":0,
										"top":0
										});	
							if(opts.dir == "h"){
									itemSize = liList.first().outerWidth(true);
									ulSize = itemSize * liList.length;
									scrollStep = itemSize*opts.step;	
									scroller.css({
												"width":itemSize*opts.clientStep
											});	
									scrollUl.css({
												"width":ulSize
											});				
								}else{
									itemSize = liList.first().outerHeight(true);
									ulSize = itemSize * liList.length;
									scrollStep = itemSize*opts.step;			
									scroller.css({
											"height":itemSize*opts.clientStep
										});	
									scrollUl.css({
											"height":ulSize
										});	
							}
							
							//计算总页数
							totalPage = Math.ceil(ulSize / scrollStep);
							// 最大值 
							 maxValue=0;
							 // 最大值 
							 minValue=-(totalPage-1)*scroller.width();
							//上一页
							that.find(opts.handlePrevious).click(function(){
										if(scrollUl.is(":animated")){
											return;
										}else{
											gotoAnimatePrevious();
										}	
							});
							
							//下一页
							that.find(opts.handleNext).click(function(){
										if(scrollUl.is(":animated")){
											return;
										}else{									
											gotoAnimateNext();																				
										}		
							});
																
							//执行动画
							function gotoAnimateNext(){
									leftValue= parseInt(scrollUl.css("left"));	
									if(leftValue<=minValue){
												return;
											}
									if(opts.dir == 'h'){	
												
											scrollUl.animate({
													"left": "-=" + scrollStep
													},
													opts.tweenTime,
													 function(){
															
													});
									}else{
										scrollUl.animate({
												"top": "-=" + scrollStep
												},
												opts.tweenTime,
												function(){
												});
									};									
							}; 
							//执行动画2
							function gotoAnimatePrevious(){
									leftValue= parseInt(scrollUl.css("left"));	
									if(leftValue>=maxValue){
												return;
											}
									if(opts.dir == 'h'){	
									
											scrollUl.animate({
													"left": "+=" + scrollStep
												},opts.tweenTime,function(){
												
												});
									}else{
									
											scrollUl.animate({
												"top": "+=" + scrollStep
												},opts.tweenTime,function(){
												
												});
												
									}									
							};
								//定时器
								function autoTimer(){
									if(!opts.autoPlay){	return;	}
									if(timer){	
											stopTimer();
											}
									timer = setInterval(autoPlay,opts.delay);
								}
								//暂停播放
								function stopTimer(){
									clearInterval(timer);
								}
								//自动播放
								function autoPlay(){
									if(!opts.reverse){
										gotoAnimateNext();
									}else{
										gotoAnimatePrevious();
										
									}
									
								};	
								//运行定时器
							that.hover(function(){
											stopTimer();
									},function(){
											autoTimer();
										}).trigger("mouseout");
										
							// 为关联对象绑定事件  	
							  $(opts.box).hover(function(){
										stopTimer();
									},function(){	
									   autoTimer();
								}).trigger("mouseout");	
								
								//导航节点绑定事件
							liList.each(function(i) {
									//当前节点索引
									var index = i;
									$(this).bind(opts.mosueType,function(){
										if(curIndex == index){ return; }
											curIndex = index;
											//添加移除样式
										$(this).addClass(opts.selectedClass).siblings().removeClass(opts.selectedClass);
											//回调函数   		索引    元素(jQuery对象)
											opts.callback(index,$(this));	
									});
							});	
      });
			
	}
		/*********
				box 									关联容器	
				*index 									默认选中的初始为第一个
				*dir 									方向 h水平 或者 v垂直	(默认垂直布局 v)
				*step 									1表示一个个滚动   其他数字多个一起滚动	(默认一个个滚动)	
				*handlePrevious							控制向前翻页的把锁	
				*handleNext								控制向后翻页的把锁		
				*clientStep								可视区域能容纳的条目数，必须为大于1的整数
				*tweenTime:500							缓动时间
				*mosueType 								列表项事件触发类型(默认点击 click)
				*selectedClass 							选中的类名
				*autoPlay 								boolean值默认为false
				*delay 									延迟时间							
				*reverse								滚动的方向boolean值默认为false
				*callback 								回调函数
		*********/
		$.fn.addScrollAble.defaultOpts = {
				box : "",
				index : 0,
				dir : "v",										
				step : 1,
				handlePrevious:".sp_pre",	
				handleNext:".sp_next",	
				clientStep:3,	
				tweenTime:500,				
				mosueType : "click",
				selectedClass : "on",
				autoPlay : false,
				delay : 2000,
				reverse:false,
				callback : function(){}
		};
	
})(jQuery,window);
