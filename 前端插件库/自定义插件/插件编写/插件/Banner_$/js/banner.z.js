
;(function($,window){
	
	//给jQuery添加方法
	$.fn.addBanner = function(options){		
	
		//合并传入与默认的参数
		var opts = $.extend({},$.fn.addBanner.defaultOpts,options || {});
		
		//实现方法
		$(this).each(function() {
				
				//导航节点列表  内容节点列表
				var navList = $(this).children('ul:last-child').children('li');
				var conList = $(this).children('ul:first-child').children('li');
				
				
				//当前索引  之前的索引	 定时器  效果引用函数
				var curIndex = oldIndex = opts.index;				
				var timer = null, effectFn = null;		
				
				//是否正在移动  导航节点总个数  内容节点每一个宽度		
				var isMoving = false;
				var size = navList.size();
				var itemSize = conList.eq(0).width();
				
				//滚动容器
				var conBox = $(this).find("ul:first-child");
				
				
				//遍历导航节点列表
				navList.each(function(i) {
						//节点索引
						var index = i;
						//绑定事件
						$(this).bind(opts.mouseType,function(e){
								//判断是否是当前索引 如果是直接返回
								if(index == curIndex){ return; }
								//是否正在缓动 如果是直接返回
								if(isMoving){ return; }
								
								//赋值旧的索引 新的索引
								oldIndex = curIndex;
								curIndex = index;
								
								//添加样式 移除样式
								if (opts.classType == 'only') {
									$(this).addClass(opts.selectedClass).siblings().removeClass(opts.selectedClass);
								} else {
									$(this).addClass(opts.selectedClass + String(curIndex + 1)).siblings().removeClass((opts.selectedClass + String(oldIndex + 1)));
								}
								
								//运行执行效果方法  重置定时器	 阻止默认行为
								effectFn();
								autoTimer();
								e.preventDefault();
						});
				});
				
				
				//定时器
				function autoTimer(){
					if(!opts.autoPlay){	return;	}
					if(timer){	clearInterval(timer);	}
					timer = setInterval(autoPlay,opts.delay);
				}
				
				//自动播放
				function autoPlay(){
					var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;
					navList.eq(newIndex).trigger(opts.mouseType)
				}
			
				
				//初始化导航节点样式
				navList.eq(curIndex).addClass((opts.classType == 'only') ? opts.selectedClass :  opts.selectedClass + String(curIndex + 1));
				
				//设置内容节点样式  效果函数
				switch(opts.effect){
						case "fade" :
						 		conList.css({'position':'absolute', 'left':0, 'top':0}).hide().eq(curIndex).show();								
								effectFn = changeFade;
									break;
						case "twin" : 
								conList.css({'position':'absolute', 'top':0, 'left':itemSize, 'width':itemSize}).eq(curIndex).css('left',0);								
								effectFn = changeTwin;
									break;
						case "order" 	: 	
								conBox.css({'position':'relative', 'width':size * itemSize});
								conList.css("float","left");						
								effectFn = changeOrder;		
									break;
						case "back" :
								effectFn = changeCallback;
									break;
				}
				
				
				//渐隐切换
				function changeFade(){
						conList.eq(curIndex).fadeIn(opts.tweenTime,opts.ease).siblings().fadeOut(opts.tweenTime + 200,opts.ease);
				}
		
				//不间断序列切换
				function changeTwin(){
						isMoving = true;
						var pos = (curIndex > oldIndex) ? itemSize : -itemSize;
						conList.eq(curIndex).css('left',pos).animate({"left":0},opts.tweenTime).end().eq(oldIndex).animate({"left": -pos},opts.tweenTime,function(){ isMoving = false;});
				}
				
				//序列切换
				function changeOrder(){
						conBox.animate({'left': -curIndex * itemSize},opts.tweenTime,opts.ease);
				}
				
				//直接调用回调函数返回  传入当前索引
				function changeCallback(){
						if(opts.itemHandler != null){
								opts.itemHandler(curIndex);
						}
				}
				
				//运行定时器
				autoTimer();
    });		
	}
	
	
	/*
	*	默认参数
	*	effect				设置那种效果(fade  twin  order)(默认渐隐fade)
	*	index					默认索引
	*	selectedClass	导航节点选中样式
	*	classType			样式类型单个(only)多个(muilt)	(默认单个only)
	*	mouseType			事件类型
	*	tweenTime			缓动时间
	*	delay					自动播放等待时间(默认6000---6秒)
	*	autoPlay			是否自动播放
	* ease					缓动函数(计算函数)		swing		linear
	*/
	$.fn.addBanner.defaultOpts = {
			effect : "fade",
			index : 0,
			selectedClass : "on",
			classType : "only",
			mouseType : "click",
			tweenTime : 600,
			delay : 6000,
			autoPlay : false,
			ease : "swing",
			itemHandler : null
	};
	
})(jQuery,window);


