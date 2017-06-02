(function($,window){
		
		//给jQuery添加方法
		$.fn.addTab = function(options){
				
				//合并传入与默认的参数
				var opts = $.extend({},$.fn.addTab.defaultOpts,options || {});
				
				//实现方法
				return this.each(function() {
								
								//当前对象   导航节点列表  内容借点列表
								var that = $(this);
								var navList = that.find("ul:first").children('li');
								var conList = that.find("div:first").children("div");
								
								//当前索引  旧的索引								
								var curIndex = oldIndex = opts.index;
								
								
								//初始化内容节点  导航节点
								conList.hide().eq(curIndex).show();
								navList.eq(curIndex).addClass((opts.classType == 'only') ? opts.selectedClass :  opts.selectedClass + String(curIndex + 1));
								
								//遍历导航节点 
								navList.each(function(i){
										//索引
										var index = i;		
										//绑定事件
										$(this).bind(opts.mouseType,function(){
													//是否触发的是当前节点 如果是直接返回
													if(index == curIndex){ return; }
													//赋值旧的节点值  当前节点值
													oldIndex = curIndex;
													curIndex = index;
													//添加样式 移除样式
													if (opts.classType == 'only') {
															$(this).addClass(opts.selectedClass).siblings().removeClass(opts.selectedClass);
													} else {
															$(this).addClass(opts.selectedClass + String(curIndex + 1)).siblings().removeClass((opts.selectedClass + String(oldIndex + 1)));
													}
													//是否使用渐隐效果
													if(opts.isFade){
														conList.eq(curIndex).fadeIn(opts.tweenTime).siblings().fadeOut(opts.tweenTime);
													}else{
														conList.hide().eq(curIndex).show();
													}
										});
													
								});
								 
								 //是否自动切换
								if(opts.autoPlay){
									//定时器  导航节点总个数
									var timer = null;
									var size = navList.size();
									//鼠标移入停止定时器 移出开始定时器
										that.hover(function(){
												clearInterval(timer);
										},function(){
												timer = setInterval(function(){
														//切换下一个节点
														var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;
														navList.eq(newIndex).trigger(opts.mouseType);
												},opts.delay);
										}).trigger("mouseleave");	
								}
								
								//是否引用渐隐效果(父节点必须相对定位)
								if(opts.isFade){
									conList.css({"position":"absolute", "left":0, "top":0});		//防止定位不是绝对而其他的DIV跑到下面去了
								}
								
								//销毁不用的引用
								that = null;
								
        });
				
		}
		
		
		/*
		*	默认参数			
		*	index						默认索引(默认第一个0)
		*	selectedClass		选中样式
		*	classType				样式为单个(only)还是多个(muilt) (默认为单个)
		*	mouseType				鼠标类型(默认点击click)
		*	isFade					是否使用渐隐效果
		*	tweenTime				渐隐缓动时间
		*	autoPlay				是否使用自动切换
		*	delay						自动切换等待时间(默认6000----6秒)
		*/
		$.fn.addTab.defaultOpts = {
				index : 0,
				selectedClass : "on",
				classType : "only",			
				mouseType : "click",
				isFade : false,
				tweenTime : 500,
				autoPlay : false,
				delay : 6000
		};
	
})(jQuery,window);