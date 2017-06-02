/************************************
 *	Version 		14.0.2
 *	Author			wuwg
 *  CreateTime      14.07.14
 *	UpdateTime		14.12.16
 **************************************/
;(function ($, window) {
	$.fn.addAccordion = function (options) {
		//合并传入与默认参数
		var opts = $.extend({}, defaultOpts, options || {});

		//实现方法
		return this.each(function () {
			//当前对象		列表节点	 列表导航节点	列表内容节点		当前索引,定时器
			var $that = $(this);
			var itemList = $that.children("ul:first-child").children("li");
			var navList = itemList.children(":first-child");
			var conList = itemList.children(":last-child");
			var curIndex = opts.index;
			var timer = null;
			var len = navList.length;

			//初始化默认行为
			navList.eq(curIndex).addClass(opts.selectedClass);
			conList.hide().eq(curIndex).show();
			//遍历导航节点列表
			navList.each(function (i) {
				//保存当前节点索引
				var index = i;
				//绑定事件
				$(this).bind(opts.mouseType, function () {
					if (curIndex == index) {
						if($(this).hasClass(opts.selectedClass)){
							navList.removeClass(opts.selectedClass);
							conList.stop(true,true).slideUp(opts.tweenTime);
						
						}else{
							navList.removeClass(opts.selectedClass).eq(curIndex).addClass(opts.selectedClass);
							//展开隐藏内容层
							conList.stop(true,true).slideUp(opts.tweenTime).eq(curIndex).slideDown(opts.tweenTime, opts.ease);		
						}
						
						return;
					}
					
					//赋值当前索引
					curIndex = index;
					//添加移除样式
					navList.removeClass(opts.selectedClass).eq(curIndex).addClass(opts.selectedClass);
					//展开隐藏内容层
					conList.slideUp(opts.tweenTime).eq(curIndex).slideDown(opts.tweenTime, opts.ease);
					opts.callBack != null ? changeCallback(curIndex) : "";
				});
			});

			//定时器
			function autoTimer() {
				if (!opts.autoPlay) {
					return;
				}
				if (timer) {
					clearInterval(timer);
				}
				timer = setInterval(autoPlay, opts.delay);
			}
			//暂停播放
			function stopTimer() {
				clearInterval(timer);
			}

			//自动播放
			function autoPlay() {
				var newIndex = ((curIndex + 1) >= len) ? 0 : curIndex + 1;
				navList.eq(newIndex).trigger(opts.mouseType)
			}
			//回调函数 传入当前索引
			function changeCallback() {
				if (opts.callBack != null) {
					opts.callBack(curIndex);
				}
			}

			// 绑定容器事件
			$that.hover(function () {
				stopTimer();
			}, function () {
				autoTimer();
			}).trigger("mouseout");

			//销毁不用的引用
			$that = null;

		});

	};
	/*
	 *	默认参数
	 *	index							索引(0)
	 *	selectedClass					选中的节点样式(默认 on)
	 *	mouseType						鼠标事件类型	(默认点击 click)
	 *	autoPlay						是否自动播放(默认false)
	 *	tweenTime						缓动时间(默认300毫秒)
	 *	ease							缓动函数(默认 swing)
	 *	delay							自动播放等待切换时间(默认6000 --- 6秒)
	 */
	var defaultOpts = {
		index : 0,
		selectedClass : "on",
		mouseType : "click",
		autoPlay : false,
		timeween : 300,
		delay : 6000,
		ease : "swing",
		callBack : null
	}

})(jQuery, window)