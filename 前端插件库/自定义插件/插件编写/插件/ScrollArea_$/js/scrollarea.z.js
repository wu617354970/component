
;(function($,window){
	
	//给Jquery添加方法
	$.fn.addScroller = function(options){
		
			/*合并默认设置的和传入的参数*/
			var opts = $.extend({},$.fn.addScroller.defaultOpts,options || {});
			
			//遍历
			return this.each(function() {
        			
							//当前对象  滚动目标		节点列表		当前索引		UL尺寸		节点尺寸		节点边距值	滚动歩长  节点总数量  当前页索引 总的页数
							var that = $(this);							
							var scroller = that.children("div:first");
							var liList = scroller.find("ul > li");
							var curIndex = 0, ulSize = 0, itemSize = 0, margin = 0, scrollStep = 0 , size = 0;
							// var curPage = 0 , totalPage = 0;
							
							//初始化UL		水平--垂直				
							if(opts.dir == "h"){
									margin = Math.max(0,parseInt(liList.first().css('margin-right')));
									liList.last().css('margin-right',0);
									itemSize = liList.first().width();
									ulSize = (itemSize + margin) * liList.size() - margin;
									scroller.find("ul:first").width(ulSize);
									scrollStep = (opts.step == 0) ? scroller.width() + margin : itemSize + margin;									
							}else{
									margin = Math.max(0,parseInt(liList.first().css('margin-bottom')));
									liList.last().css("margin-bottom",0);
									itemSize = liList.first().height();
									ulSize = (itemSize + margin) * liList.size() - margin;
									scroller.find("ul:first").height(ulSize);
									scrollStep = (opts.step == 0) ? scroller.height() + margin  : itemSize + margin;;
							}
							
							//计算总页数
							//totalPage = Math.ceil(ulSize / scrollStep);
							 
							//上一页
							that.find("span:first").click(function(){
										//curPage--;
										gotoAnimate("-=");
							});
							
							//下一页
							that.find("span:last").click(function(){
										//curPage++;
										gotoAnimate("+=");
							});
							
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
							
							//执行动画
							function gotoAnimate(sign){
									if(opts.dir == 'h'){
											scroller.animate({"scrollLeft": sign + scrollStep},opts.tweenTime);
									}else{
											scroller.animate({"scrollTop": sign + scrollStep},opts.tweenTime);
									}									
							} 
							
							//设置默认第一个
							if(opts.index != -1){
									curIndex = opts.index;
									liList.eq(0).trigger(opts.mouseType);
							}
      });
			
	}
	
		/**
		*	box									容器
		*	mouseType						列表项事件触发类型(默认点击 click)
		*	dir									方向 h水平 或者 v垂直	(默认垂直布局 v)
		*	step								0表示一页一页滚动   1表示一个一个滚动	(默认一页一页滚动 0)
		*	tweenTime						缓动时间
		*	className						列表项当前选中想样式
		*	callback						回调函数
		*/
		$.fn.addScroller.defaultOpts = {
				box : "",
				index : -1,
				dir : "v",										
				step : 0,								
				tweenTime:500,				
				mosueType : "click",
				selectedClass : "on",
				autoBack : false,
				autoPlay : false,
				delay : 6000,
				callback : function(){}
		};
	
})(jQuery,window);


/*
	测试实例
	var imgItem = $("#img");
	
	$("#vbox").addScroller({dir:'v',step:0,tweenTime:500,callback:function(index,$elem){
				imgItem.fadeOut(0);
				imgItem.bing("load",function(){
						imgItem.unbind("load");
						imgItem.fadeIn(300);
				});
				imgItem.attr("src","images/" + (index + 1) + ".jpg");
	}});
*/



//右边导航广告
;(function($,window){
	
	$.fn.addAdver = function(options){
			
			//合并传入与默认的参数
			var opts = $.extend({},{
						startPoint : 0,
						tweenTime : 300
			},options || {});
			
			return this.each(function(){
					
					var that = $(this);										
					that.css({"top":opts.startPoint, "position":"absolute"});
					
					$(window).scroll(function(){
							var pos = opts.startPoint + $(window).scrollTop();
							that.stop().animate({"top":pos},opts.tweenTime);
					});
					
			});
				
	}
	
})(jQuery,window);
