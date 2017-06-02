
;(function($,window){

		//添加Jquery方法
		$.fn.addAccordion = function(options){
					
					//合并传入与默认参数
					var opts = $.extend({},$.fn.addAccordion.defaultOpts,options || {});
					
					//遍历
					return this.each(function(){
																
									//当前对象		列表节点	 导航列表节点	内容列表节点		当前索引
									var that = $(this);	
									var liList = that.find("ul:first").find("li > div");
									var navList = liList.children("h3:first-child");
									var conList = liList.children("div");									
									var curIndex = opts.index;
									
									//初始化默认行为
									navList.eq(curIndex).addClass("on");												
									conList.hide().eq(curIndex).show();
									
									//遍历导航节点列表
									navList.each(function(i){
													//保存当前节点索引						
													var index = i;
													//绑定事件
													$(this).bind(opts.mouseType,function(){
																if(curIndex == index){ return; }
																//赋值当前索引
																curIndex = index;
																//添加移除样式
																navList.removeClass("on").eq(index).addClass("on");
																//展开隐藏内容层										
																conList.slideUp(opts.tweenTime).eq(index).slideDown(opts.tweenTime,opts.ease);
													});
									});
									
									//判断是否自动播放
									if(opts.autoPlay){
											
											//定时器		导航节点总个数
											var timer = null;
											var size = navList.size();
											
											//鼠标移入停止定时器 		鼠标移出开始定时器
											that.hover(function(){
													clearInterval(timer);
											},function(){
													timer = setInterval(function(){
															var newIndex = (curIndex + 1 >= size) ? 0 : curIndex + 1;	
															navList.eq(newIndex).trigger(opts.mouseType);
													},opts.delay);
											}).trigger("mouseleave");
									}
									
									//销毁不用的引用
									that = liList = null;
							
					});
										
		}
		
		/*
		*	默认参数
		*	index							索引(0)
		*	selectedClass			选中的节点样式(默认 on)
		*	mouseType					鼠标事件类型	(默认点击 click)
		*	tweenTime					缓动时间(默认300毫秒)
		*	ease							缓动函数(默认 swing)
		*	autoPlay					是否自动播放(默认false)
		*	delay							自动播放等待切换时间(默认6000 --- 6秒)
		*/
		$.fn.addAccordion.defaultOpts = {
				index : 0,
				selectedClass : "on",
				mouseType : "click",
				tweenTime : 300,
				ease : "swing",
				autoPlay : false,
				delay : 6000
		};
	
})(jQuery,window);