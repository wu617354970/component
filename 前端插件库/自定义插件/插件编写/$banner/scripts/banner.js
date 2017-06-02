/*javascript document*/
/************************************
 *	Version 		14.07.01
 *	Author			wuwg
 *  CreateTime      14.07.10
 *	UpdateTime		14.12.17
 **************************************/
;
(function ($, window) {
	$.fn.addBanner = function (options) {
		//合并传入与默认的参数
		var opts = $.extend({}, $.fn.addBanner.defaultOpts, options || {});

		//实现方法
		$(this).each(function () {
			//导航节点列表  内容节点列表
			var $that = $(this);
			var conBox=opts.contentBox!=null? $that.find(opts.contentBox):$that.children("ul:first-child");  //滚动容器的父元素
			var navBox=opts.navigationBox!=null? $that.find(opts.navigationBox):$that.children('ul:last-child'); //导航容器
			var navList = navBox.children(); //导航节点列表
			var conList =conBox.children();	 //内容节点列表
			var $prev = opts.handlePrev != null ? $(this).find(opts.handlePrev) : opts.handlePrev;
			var $next = opts.handleNext != null ? $(this).find(opts.handleNext) : opts.handleNext;
			//当前索引  之前的索引	 定时器  效果引用函数
			var curIndex = oldIndex = opts.index;
			var timer = null,
			effectFn = null;

			//是否正在移动  导航节点总个数  内容节点每一个宽度	或者高度
			var isMoving = false;
			var flag = false;

			var size = navList.length;

			//  判断是否是垂直方向
			var itemSize = opts.isVertical ? Math.ceil(conList.eq(0).innerHeight()) : Math.ceil(conList.eq(0).innerWidth());

			opts.isFullScreen ? conList.css({
				width : $(window).width()
			}) : ""

			//  浏览器事件
			if (opts.isFullScreen) {
				//  水平方向才需要执行下面的事件
				if (!opts.isVertical) {

					$(window).bind("resize", function () {

						switch (opts.effect) {
						case "twin":
							itemSize = $(window).width();
							conList.css({
								'left' : itemSize,
								'width' : itemSize
							}).eq(curIndex).css('left', 0);
							conBox.css({
								"width" : itemSize
							});
							break;
						case "order":
							itemSize = $(window).width();
							conList.width(itemSize);
							conBox.css({
								"width" : itemSize * size
							});
							if (isMoving) {
								conBox.stop(true, true);
								effectFn();
							} else {
								effectFn();
							};

							break;
						default:
							return;
						};

					});
				} else {
					//  跳过
				};
			};

			// 上一张
			$prev != null ? $prev.bind("click", function () {

				switch (opts.effect) {
				case "twin":
					var newIndex = ((curIndex) - 1 < 0) ? size - 1 : curIndex - 1;

					if (isMoving || conList.is(":animated")) {
						return;
					}

					//赋值旧的索引 新的索引
					oldIndex = curIndex;
					curIndex = newIndex;

					// 设置导航的当前节点

					setClass(curIndex);

					// 执行函数 一直朝上
					changeTwinPrevious();

					break;
				default:
					var newIndex = ((curIndex) - 1 < 0) ? size - 1 : curIndex - 1;
					navList.eq(newIndex).trigger(opts.mouseType);

					return;
				};
			}) : "";
			// 下一张
			$next != null ? $next.bind("click", function () {

				switch (opts.effect) {
				case "twin":
					var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;

					if (isMoving || conList.is(":animated")) {
						return;
					}

					//赋值旧的索引 新的索引
					oldIndex = curIndex;
					curIndex = newIndex;

					// 设置导航的当前节点

					setClass(curIndex);

					// 执行函数 一直朝下
					changeTwinNext();

					break;
				default:
					//赋值旧的索引 新的索引
					var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;

					navList.eq(newIndex).trigger(opts.mouseType);

					return;
				};
			}) : "";
			//遍历导航节点列表
			navList.each(function (i) {
				//节点索引
				var index = i;
				//绑定事件
				$(this).bind(opts.mouseType, function (e) {

					//判断是否是当前索引 如果是直接返回
					if (index == curIndex) {
						return;
					}
					//是否正在缓动 如果是直接返回

					if (isMoving || conBox.is(":animated")) {
						return;
					}

					//赋值旧的索引 新的索引
					oldIndex = curIndex;
					curIndex = index;

					// 设置导航的当前节点
					setClass(curIndex);

					//运行执行效果方法  重置定时器	 阻止默认行为
					effectFn();
				
					e.preventDefault();
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
			//初始化导航节点样式

			setClass(opts.index);

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
				
				switch(opts.effect){
					case "twin":

						//赋值旧的索引 新的索引
						oldIndex = curIndex;
						curIndex = newIndex;

						// 设置导航的当前节点

						setClass(curIndex);

						// 执行函数 一直朝下
						changeTwinNext();
	
						break;
						
					default:
						navList.eq(newIndex).trigger(opts.mouseType);
				
				}
			}

			//设置内容节点样式  效果函数

			switch (opts.effect) {
			case "fade":
				conList.css({
					'position' : 'absolute',
					'left' : 0,
					'top' : 0
				}).hide().eq(curIndex).show();
				effectFn = changeFade;
				break;
			case "minMove":
				conBox.css({
					'position' : 'relative'
				});
				conList.css({
					position : "absolute",
					'left' : opts.distance,
					'opacity' : 0
				}).eq(opts.index).css({
					'left' : 0,
					'opacity' : 1
				});
				effectFn = changeMinMove;

				break;
			case "twin":
				if (opts.isVertical) {
					// 垂直方向调用的函数
					conList.css({
						'position' : 'absolute',
						'top' : 0,
						'top' : itemSize,
						'height' : itemSize
					}).eq(curIndex).css('top', 0);
					effectFn = changeTwinV;

				} else {
					// 水平方向调用的函数
					conList.css({
						'position' : 'absolute',
						'top' : 0,
						'left' : itemSize,
						'width' : itemSize
					}).eq(curIndex).css('left', 0);
					effectFn = changeTwinH;
				}

				break;
			case "order":
				if (opts.isVertical) {
					// 垂直方向调用的函数
					conBox.css({
						'position' : 'relative',
						'height' : size * itemSize
					});
					effectFn = changeOrderV;

				} else {
					// 水平方向调用的函数
					conBox.css({
						'position' : 'relative',
						'width' : size * itemSize
					});
					conList.css("float", "left");
					effectFn = changeOrderH;
				}
				break;
			case "back":
				effectFn = changeCallback;
				break;

			}
			//渐隐切换
			function changeFade() {
				conList.eq(curIndex).css({
					"z-index" : "999"
				}).stop(true, true).fadeIn(opts.tweenTime, opts.ease)
				.siblings().css("z-index", "0").fadeOut(opts.tweenTime + 200, opts.ease);
				opts.callBack != null ? changeCallback(curIndex) : "";
			}
			//微小移动切换效果
			function changeMinMove(index) {
				isMoving = true;
				conList.eq(oldIndex).animate({
					"left" : opts.distance,
					'opacity' : 0
				}, opts.time, function () {
					isMoving = false;
				})
				.end().eq(curIndex).animate({
					"left" : 0,
					'opacity' : 1
				}, opts.time, function () {
					isMoving = false;
				});
			}
			//不间断序列切换水平方向
			function changeTwinH() {
				isMoving = true;
				var pos = (curIndex > oldIndex) ? itemSize : -itemSize;
				conList.eq(curIndex).css('left', pos).animate({
					"left" : 0
				}, opts.tweenTime)
				.end().eq(oldIndex).animate({
					"left" : -pos
				}, opts.tweenTime, function () {
					isMoving = false;
				});
				opts.callBack != null ? changeCallback(curIndex) : "";

			}
			//不间断序列切换垂直方向
			function changeTwinV() {
				isMoving = true;
				var pos = (curIndex > oldIndex) ? itemSize : -itemSize;
				conList.eq(curIndex).css('top', pos).animate({
					"top" : 0
				}, opts.tweenTime)
				.end().eq(oldIndex).animate({
					"top" : -pos
				}, opts.tweenTime, function () {
					isMoving = false;
				});
				opts.callBack != null ? changeCallback(curIndex) : "";

			}
			//不间断序列切换一直朝前面一张
			function changeTwinPrevious() {
				isMoving = true;
				if (!opts.isVertical) { //  水平方向
					var pos = -itemSize //(curIndex > oldIndex) ? itemSize : -itemSize;
						conList.eq(curIndex).css('left', pos).animate({
							"left" : 0
						}, opts.tweenTime)
						.end().eq(oldIndex).animate({
							"left" : -pos
						}, opts.tweenTime, function () {
							isMoving = false;
						});
					opts.callBack != null ? changeCallback(curIndex) : "";

				} else { //  垂直方向
					var pos = -itemSize //(curIndex > oldIndex) ? itemSize : -itemSize;
						conList.eq(curIndex).css('top', pos).animate({
							"top" : 0
						}, opts.tweenTime)
						.end().eq(oldIndex).animate({
							"top" : -pos
						}, opts.tweenTime, function () {
							isMoving = false;
						});
					opts.callBack != null ? changeCallback(curIndex) : "";

				};

			};
			//不间断序列切换一直朝后面一张
			function changeTwinNext() {
				if (!opts.isVertical) { //  水平方向
					isMoving = true;
					var pos = itemSize ;
						conList.eq(curIndex).css('left', pos).animate({
							"left" : 0
						}, opts.tweenTime)
						.end().eq(oldIndex).animate({
							"left" : -pos
						}, opts.tweenTime, function () {
							isMoving = false;
						});
					opts.callBack != null ? changeCallback(curIndex) : "";
				} else { //  垂直方向
					isMoving = true;
					var pos = itemSize ;
						conList.eq(curIndex).css('top', pos).animate({
							"top" : 0
						}, opts.tweenTime)
						.end().eq(oldIndex).animate({
							"top" : -pos
						}, opts.tweenTime, function () {
							isMoving = false;
						});
					opts.callBack != null ? changeCallback(curIndex) : "";

				};
			};

			//序列切换垂直方向
			function changeOrderV() {
				isMoving = true;
				conBox.stop(true, true).animate({
					'top' : -curIndex * itemSize
				}, opts.tweenTime, opts.ease, function () {
					isMoving = false;
				});
				opts.callBack != null ? changeCallback(curIndex) : "";
			}
			//序列切换水平方向
			function changeOrderH() {
				isMoving = true;
				conBox.stop(true, true).animate({
					'left' : -curIndex * itemSize
				}, opts.tweenTime, opts.ease, function () {
					isMoving = false;
				});
				opts.callBack != null ? changeCallback(curIndex) : "";
			}

			//直接调用回调函数返回  传入当前索引
			function changeCallback() {
				if (opts.callBack != null) {
					opts.callBack(curIndex);
				}
			}
			// 显示箭头
			function showHandle() {
				flag = true;
				$that.find(opts.handleContain).animate({
					opacity : 1
				}, opts.tweenTime, function () {
					flag = false;
				});
			}
			// 隐藏箭头
			function hideHandle() {
				$that.find(opts.handleContain).animate({
					opacity : 0
				}, opts.tweenTime);
			}
			//运行定时器
			autoTimer();

			// 绑定容器事件
			$(this).hover(function () {
				stopTimer();
				if (opts.handleContain != null) {
					if (flag) {
						return;
					} else {
						showHandle()
					}
				}
			}, function () {
				autoTimer();
				if (opts.handleContain != null) {
					hideHandle()
				}
			}).trigger("mouseout");
		});
	}

	/*
	 *	默认参数
	 *	effect				设置那种效果(fade  twin  order)(默认渐隐fade)
	 *	index				默认索引
	 *	selectedClass	    导航节点选中样式
	 *	classType			样式类型单个(only)多个(muilt)	(默认单个only)
	 *	mouseType			事件类型
	 *	tweenTime			缓动时间
	 *	handleContain 		按钮容器
	 *	handlePrev			前一张
	 *	handleNext			后一张
	 *	delay				自动播放等待时间(默认6000---6秒)
	 *	autoPlay			是否自动播放
	 *	contentBox			滚动容器的父元素     为带点的class类名或者带井号的id名字(字符串类型)   .con  || #con 
	 *	navigationBox		导航容器			 为带点的class类名或者带井号的id名字(字符串类型)   .con  || #con 
	 *  isVertical 			是否是垂直方向
	 * 	ease				缓动函数(计算函数)		swing		linear
	 *	distance 			微小移动效果有用，distance为number
	 *	isFullScreen 		是否是全屏滚动
	 *	callBack 		回调函数
	 */
	$.fn.addBanner.defaultOpts = {
		effect : "order",
		index : 0,
		selectedClass : "on",
		classType : "only",
		mouseType : "click",
		tweenTime : 600,
		delay : 6000,
		autoPlay : false,
		contentBox:null,
		navigationBox:null,
		handleContain : null,
		handlePrev : null,
		handleNext : null,
		ease : "swing",
		distance : -50,
		isVertical : false,
		isFullScreen : false,
		callBack : null
	};
})(jQuery, window);