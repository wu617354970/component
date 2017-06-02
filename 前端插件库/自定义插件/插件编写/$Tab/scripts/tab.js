/**tab切换*/
/************************************
 *	Version 		14.0.1
 *	Author			wuwg
 *  CreateTime      14.07.14
 *	UpdateTime		14.07.14
 **************************************/
(function ($, window) {

	//给jQuery添加方法
	$.fn.addTab = function (options) {

		//合并传入与默认的参数
		var opts = $.extend({}, $.fn.addTab.defaultOpts, options || {});

		//实现方法
		return this.each(function () {

			//当前对象   导航节点列表  内容借点列表  导航节点总长度   定时器
			var $that = $(this);
			var thatBuyd = $(this);
			var navList = $that.find("ul:first").children('li');
			var conList = $that.find("div:first").children();
			var size = navList.length;
			var timer = null;
			//当前索引  旧的索引
			var curIndex = oldIndex = opts.index;

			//初始化 导航节点
			setClass(curIndex);
			//初始化内容节点

			showContent(curIndex)

			//遍历导航节点
			navList.each(function (i) {
				//索引
				var index = i;
				//绑定事件
				$(this).bind(opts.mouseType, function (e) {
					//是否触发的是当前节点 如果是直接返回
					if (index == curIndex) {

						return;
					}
					//  最后一个返回
					if (opts.lastLiLoseEffect) {
						if (index == navList.length - 1) {
							return;
						} else {

							//赋值旧的节点值  当前节点值
							oldIndex = curIndex;
							curIndex = index;
							//当前导航
							setClass(curIndex);
							//当前导航下的内容
							showContent(index);
							// 回调函数
							callback(curIndex);
						}

					} else {
						//赋值旧的节点值  当前节点值
						oldIndex = curIndex;
						curIndex = index;
						//当前导航
						setClass(curIndex);
						//当前导航下的内容
						showContent(index);
						// 回调函数
						callback(curIndex);
					}
				});

			});

			//  设置导航 class函数
			function setClass(index) {

				var $that = navList.eq(index);
				//添加样式 移除样式

				if (opts.classType == 'only') {

					$that.addClass(opts.selectedClass).siblings().removeClass(opts.selectedClass);
				} else {
					$that.addClass(opts.selectedClass + String(curIndex + 1)).siblings().removeClass((opts.selectedClass + String(oldIndex + 1)));
				}
			}

			function showContent(index) {
				if (opts.isFade) {
					conList.css({
						"position" : "absolute",
						"left" : 0,
						"top" : 0,
						"width" : "100%"
					}).parent().css({
						"position" : "relative"
					})
					conList.eq(index).fadeIn(opts.tweenTime).siblings().fadeOut(opts.tweenTime);
				} else {
					conList.hide().eq(index).show();
				}
			}
			//  回调函数
			function callback(index) {
				opts.callback !== null ? opts.callback(index) : "";

			}
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
				var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;
				navList.eq(newIndex).trigger(opts.mouseType)
			}
			// 绑定容器事件
			$that.hover(function () {
				stopTimer();
			}, function () {
				autoTimer();
			}).trigger("mouseout");

			// 销毁不用的额引用
			$that = null;
		});

	}

	/*
	 *	默认参数
	 *	index					默认索引(默认第一个0)
	 *	selectedClass			选中样式
	 *	classType				样式为单个(only)还是多个(muilt) (默认为单个)
	 *	mouseType				鼠标类型(默认点击click)
	 *	isFade					是否使用渐隐效果
	 *	tweenTime				渐隐缓动时间
	 *	autoPlay				是否使用自动切换
	 *	delay					自动切换等待时间(默认6000----6秒)
	 */
	$.fn.addTab.defaultOpts = {
		index : 0,
		selectedClass : "on",
		classType : "only",
		mouseType : "click",
		isFade : false,
		lastLiLoseEffect : false,
		tweenTime : 500,
		autoPlay : false,
		delay : 6000,
		callback : null
	};

})(jQuery, window);
