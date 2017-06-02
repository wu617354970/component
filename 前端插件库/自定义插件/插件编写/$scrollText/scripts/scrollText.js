/**连续滚动文本*/
/************************************
 *	Version 		14.0.1
 *	Author			wuwg
 *  CreateTime      14.07.06
 *	UpdateTime		14.07.06
 **************************************/

(function ($, window) {

	//给jQuery添加方法
	$.fn.addScrollText = function (options) {

		//合并传入与默认的参数
		var opts = $.extend({}, {
				dir : 'top', // 参数   top  ,bottom  ,left  ,right
				minSize : 1, // 最小条目数
				tweenTime : 30, // 缓动时间
				delay : 30, // 延迟时间
				step : 1, // 移动的条目数
				easing : "swing", //  参数  swing  或者 linear  过度采取哪一种函数
				autoPlay : true, //是否自动播放	  参数   true   或者  false
				series : true, //是否连续 	   参数   true 为连续滚动     false 为间隔滚动
				callBack : null //回调函数  function(){};
			}, options || {});

		//实现方法
		return $(this).each(function () {

			//  box对象
			var _that = $(this);
			_that.css({
				"position" : "relative",
				"z-index" : 999
			});
			//  定义定时器和 效果函数
			var timer = null,
			effectFn = null,
			len;
			//UL对象  ------ 滚动的容器
			var scrollUL = _that.children('ul:first-child');
			scrollUL.css({
				"position" : "absolute"
			});
			//判断可视窗口大于内容窗口不需要滚动
			len = scrollUL.children('li').length;
			if (len < opts.minSize) {
				return;
			}

			//  创建滚动函数的数组，包含所有子元素的宽度；
			var scrollWidthArray = [];
			for (var i = 0; i < len; i++) {
				var singleWidth = Math.ceil(scrollUL.children("li").eq(i).innerWidth());
				scrollWidthArray.push(singleWidth);
			}
			//  定义滚动容器的宽度
			var scrollWidth = 0;
			// 将数组的所有数值相加 获得最终的宽度
			for (var j = 0; j < scrollWidthArray.length; j++) {
				var currentWidth = scrollWidthArray[j];
				scrollWidth += currentWidth;
			}

			//根据传进的参数，定义效果函数
			switch (opts.dir) {
			case "top":
				scrollUL.css({
					top : 0,
					left : 0

				});
				effectFn = scrollTop;
				break;
			case "bottom":
				scrollUL.css({
					bottom : 0,
					left : 0
				});
				effectFn = scrollBottom;
				break;
			case "left":
				scrollUL.css({
					top : 0,
					left : 0,
					width : scrollWidth
				});
				scrollUL.children("li").css({
					"float" : "left"
				});
				effectFn = scrollLeft;
				break;
			case "right":
				scrollUL.css({
					top : 0,
					right : 0,
					width : scrollWidth
				});
				scrollUL.children("li").css({
					"float" : "right"
				});
				effectFn = scrollRight;
				break;
			}

			//自动播放函数
			function autoPlay() {
				if (!opts.autoPlay) {
					return;
				}
				if (timer) {
					stopPlay();
				}
				timer = setTimeout(function () {
						effectFn();
					}, opts.delay);
			}

			//停止播放函数
			function stopPlay() {
				clearTimeout(timer);
			};

			//鼠标移入停止定时器	鼠标移出开始定时器
			_that.hover(function () {
				stopPlay();
			}, function () {
				autoPlay();
			}).trigger("mouseleave");

			// 向上滚动的函数
			function scrollTop() {

				if (opts.series) { //  连续滚动函数执行方法
					//获取第一个子元素的高度
					var fisrtLiheight = Math.ceil(parseInt(scrollUL.find("li:first").outerHeight()));
					scrollUL.animate({
						"top" : "-=1"
					}, opts.tweenTime, function () {
						if (parseInt(scrollUL.css("top")) <= (-fisrtLiheight)) {
							scrollUL.css({
								"top" : 0
							});
							scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
						};
					});
				} else { // 间隔滚动函数执行方法
					//  滚动距离数组
					var scrollDistanceArray = [];
					//  滚动的距离 ， 单个条目的高度， 当前条目高度, 滚动的条目数
					var scrollDistance = 0,
					singleItem,
					currentItem,
					step;
					//  滚动的条目数
					step = opts.step > len ? len : opts.step;

					for (var i = 0; i < step; i++) {
						singleItem = Math.ceil(scrollUL.children("li").eq(i).outerHeight());
						//加入到数组
						scrollDistanceArray.push(singleItem);
					};
					for (var j = 0; j < scrollDistanceArray.length; j++) {
						currentItem = scrollDistanceArray[j];
						scrollDistance += currentItem //   单个条目数之和就是要滚动的距离
					};
					//  执行动画
					scrollUL.animate({
						"top" : -scrollDistance
					}, opts.tweenTime, opts.easing, function () {
						for (var i = 0; i < opts.step; i++) { //   根据滚动条目数决定循环几次
							scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
						};
						// 重新给父元素top赋值
						scrollUL.css({
							"top" : 0
						});
					});
				};
				if (opts.callBack != null) {
					opts.callBack();
				};
				// 重新调用
				autoPlay();
			};

			// 向下滚动的函数
			function scrollBottom() {
				if (opts.series) { //  连续滚动函数执行方法
					//获取最后一个子元素的高度
					var lastLiheight = Math.ceil(parseInt(scrollUL.find("li:last").outerHeight()));
					scrollUL.animate({
						"bottom" : "-=1"
					}, opts.tweenTime, function () {
						if (parseInt(scrollUL.css("bottom")) <= (-lastLiheight)) {
							scrollUL.css({
								"bottom" : 0
							});
							scrollUL.find("li:last").prependTo(scrollUL); //prependTo能直接移动元素
						};
					});
				} else { // 间隔滚动函数执行方法
					//  滚动距离数组
					var scrollDistanceArray = [];
					//  滚动的距离 ， 单个条目的高度， 当前条目高度, 滚动的条目数
					var scrollDistance = 0,
					singleItem,
					currentItem,
					step;
					//  滚动的条目数
					step = opts.step > len ? len : opts.step;

					for (var i = 0; i < step; i++) {
						singleItem = Math.ceil(scrollUL.children("li").eq(len - 1 - i).outerHeight());
						//加入到数组
						scrollDistanceArray.push(singleItem);
					};
					for (var j = 0; j < scrollDistanceArray.length; j++) {
						currentItem = scrollDistanceArray[j];
						scrollDistance += currentItem //   单个条目数之和就是要滚动的距离
					};

					//  执行动画
					scrollUL.animate({
						"bottom" : -scrollDistance
					}, opts.tweenTime, opts.easing, function () {
						for (var i = 0; i < opts.step; i++) { //   根据滚动条目数决定循环几次
							scrollUL.find("li:last").prependTo(scrollUL); //prependTo能直接移动元素
						};
						// 重新给父元素top赋值
						scrollUL.css({
							"bottom" : 0
						});
					});
				};
				if (opts.callBack != null) {
					opts.callBack();
				}
				// 重新调用
				autoPlay();
			};

			// 向左滚动的函数
			function scrollLeft() {
				if (opts.series) { //  连续滚动函数执行方法
					//获取第一个子元素的宽度
					var firstLiWidth = Math.ceil(parseInt(scrollUL.find("li:first").outerWidth()));

					scrollUL.animate({
						"left" : "-=1"
					}, opts.tweenTime, function () {
						if (parseInt(scrollUL.css("left")) <= (-firstLiWidth)) {
							scrollUL.css({
								"left" : 0
							});
							scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
						};
					});
				} else { // 间隔滚动函数执行方法
					//  滚动距离数组
					var scrollDistanceArray = [];
					//  滚动的距离 ， 单个条目的高度， 当前条目高度, 滚动的条目数
					var scrollDistance = 0,
					singleItem,
					currentItem,
					step;
					//  滚动的条目数
					step = opts.step > len ? len : opts.step;

					for (var i = 0; i < step; i++) {
						singleItem = Math.ceil(scrollUL.children("li").eq(i).outerWidth());
						//加入到数组
						scrollDistanceArray.push(singleItem);
					};
					for (var j = 0; j < scrollDistanceArray.length; j++) {
						currentItem = scrollDistanceArray[j];
						scrollDistance += currentItem //  单个条目数之和就是要滚动的距离
					};

					//  执行动画
					scrollUL.animate({
						"left" : -scrollDistance
					}, opts.tweenTime, opts.easing, function () {
						for (var i = 0; i < opts.step; i++) { //   根据滚动条目数决定循环几次
							scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
						};
						// 重新给父元素top赋值
						scrollUL.css({
							"left" : 0
						});
					});

				}
				// 回调函数
				if (opts.callBack != null) {
					opts.callBack();
				}
				// 重新调用
				autoPlay();
			};

			// 向右滚动的函数
			function scrollRight() {
				if (opts.series) { //  连续滚动函数执行方法
					//获取第一子元素的宽度
					var lastLiWidth = Math.ceil(parseInt(scrollUL.find("li:last").innerWidth()));

					scrollUL.animate({
						"right" : "-=1"
					}, opts.tweenTime, function () {
						if (parseInt(scrollUL.css("right")) <= (-lastLiWidth)) {
							scrollUL.css({
								"right" : 0
							});
							scrollUL.find("li:last").prependTo(scrollUL); //appendTo能直接移动元素
						};
					});
				} else { // 间隔滚动函数执行方法
					//  滚动距离数组
					var scrollDistanceArray = [];
					//  滚动的距离 ， 单个条目的高度， 当前条目高度, 滚动的条目数
					var scrollDistance = 0,
					singleItem,
					currentItem,
					step;
					//  滚动的条目数
					step = opts.step > len ? len : opts.step;

					for (var i = 0; i < step; i++) {
						singleItem = Math.ceil(scrollUL.children("li").eq(i).outerWidth());
						//加入到数组
						scrollDistanceArray.push(singleItem);
					};
					for (var j = 0; j < scrollDistanceArray.length; j++) {
						currentItem = scrollDistanceArray[j];
						scrollDistance += currentItem //  单个条目数之和就是要滚动的距离
					};

					//  执行动画
					scrollUL.animate({
						"right" : -scrollDistance
					}, opts.tweenTime, opts.easing, function () {
						for (var i = 0; i < opts.step; i++) { //   根据滚动条目数决定循环几次
							scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
						};
						// 重新给父元素top赋值
						scrollUL.css({
							"right" : 0
						});
					});
				};
				// 回调函数
				if (opts.callBack != null) {
					opts.callBack();
				}
				// 重新调用
				autoPlay();
			};
		});
	}
})(jQuery, window);