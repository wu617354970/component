/**
 * @author wuwg
 * @version 2016.0.1
 * @description file
 * @createTime 2016/6/30
 * @updateTime 2016/9/20
 * @descrition  兼容ie7
 * @update  更新top设置为0时，内容出现负数的bug
 * @updateTime 2016/10/11
 * @update
 *问题修复：
 * 	1.解决因为内容变少之前，有滚动条，并且滚动条已经滚动到了其他位置（非0的位置），
 *   当更新的内容小于可视高度时，滚动条会隐藏，但是在此之前，内容已经被滚动过，这时top值无法还原的问题
 *功能增加：
 *  1.滚动后执行了回调函数功能，用户可以在执行完滚动后为其执行一个回调函数
 *  2.增加隐藏滚动条设置
 *  3.增加水平滚动条功能
  * @updateTime 2016/11/30
 *  1.ie8下滚动条无法用鼠标拖动，window修改为document对象
 */
 + function (window, $) {
		!function () {
			var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
			toBind = ('onwheel' in document || document.documentMode >= 9) ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
			slice = Array.prototype.slice,
			nullLowestDeltaTimeout,
			lowestDelta;
			if ($.event.fixHooks) {
				for (var i = toFix.length; i; ) {
					$.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
				}
			}
			var special = $.event.special.mousewheel = {
				version : '3.1.12',
				setup : function () {
					if (this.addEventListener) {
						for (var i = toBind.length; i; ) {
							this.addEventListener(toBind[--i], handler, false);
						}
					} else {
						this.onmousewheel = handler;
					}
					// Store the line height and page height for this particular element
					$.data(this, 'mousewheel-line-height', special.getLineHeight(this));
					$.data(this, 'mousewheel-page-height', special.getPageHeight(this));
				},
				teardown : function () {
					if (this.removeEventListener) {
						for (var i = toBind.length; i; ) {
							this.removeEventListener(toBind[--i], handler, false);
						}
					} else {
						this.onmousewheel = null;
					}
					// Clean up the data we added to the element
					$.removeData(this, 'mousewheel-line-height');
					$.removeData(this, 'mousewheel-page-height');
				},
				getLineHeight : function (elem) {
					var $elem = $(elem),
					$parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
					if (!$parent.length) {
						$parent = $('body');
					}
					return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
				},
				getPageHeight : function (elem) {
					return $(elem).height();
				},
				settings : {
					adjustOldDeltas : true, // see shouldAdjustOldDeltas() below
					normalizeOffset : true // calls getBoundingClientRect for each event
				}
			};
			$.fn.extend({
				mousewheel : function (fn) {
					return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
				},
				unmousewheel : function (fn) {
					return this.unbind('mousewheel', fn);
				}
			});

			function handler(event) {
				var orgEvent = event || window.event,
				args = slice.call(arguments, 1),
				delta = 0,
				deltaX = 0,
				deltaY = 0,
				absDelta = 0,
				offsetX = 0,
				offsetY = 0;
				event = $.event.fix(orgEvent);
				event.type = 'mousewheel';
				// Old school scrollwheel delta
				if ('detail' in orgEvent) {
					deltaY = orgEvent.detail * -1;
				}
				if ('wheelDelta' in orgEvent) {
					deltaY = orgEvent.wheelDelta;
				}
				if ('wheelDeltaY' in orgEvent) {
					deltaY = orgEvent.wheelDeltaY;
				}
				if ('wheelDeltaX' in orgEvent) {
					deltaX = orgEvent.wheelDeltaX * -1;
				}
				// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
				if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
					deltaX = deltaY * -1;
					deltaY = 0;
				}
				// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
				delta = deltaY === 0 ? deltaX : deltaY;
				// New school wheel delta (wheel event)
				if ('deltaY' in orgEvent) {
					deltaY = orgEvent.deltaY * -1;
					delta = deltaY;
				}
				if ('deltaX' in orgEvent) {
					deltaX = orgEvent.deltaX;
					if (deltaY === 0) {
						delta = deltaX * -1;
					}
				}
				// No change actually happened, no reason to go any further
				if (deltaY === 0 && deltaX === 0) {
					return;
				}
				// Need to convert lines and pages to pixels if we aren't already in pixels
				// There are three delta modes:
				// * deltaMode 0 is by pixels, nothing to do
				// * deltaMode 1 is by lines
				// * deltaMode 2 is by pages
				if (orgEvent.deltaMode === 1) {
					var lineHeight = $.data(this, 'mousewheel-line-height');
					delta *= lineHeight;
					deltaY *= lineHeight;
					deltaX *= lineHeight;
				} else if (orgEvent.deltaMode === 2) {
					var pageHeight = $.data(this, 'mousewheel-page-height');
					delta *= pageHeight;
					deltaY *= pageHeight;
					deltaX *= pageHeight;
				}
				// Store lowest absolute delta to normalize the delta values
				absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
				if (!lowestDelta || absDelta < lowestDelta) {
					lowestDelta = absDelta;
					// Adjust older deltas if necessary
					if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
						lowestDelta /= 40;
					}
				}
				// Adjust older deltas if necessary
				if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
					// Divide all the things by 40!
					delta /= 40;
					deltaX /= 40;
					deltaY /= 40;
				}
				// Get a whole, normalized value for the deltas
				delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
				deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
				deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
				// Normalise offsetX and offsetY properties
				if (special.settings.normalizeOffset && this.getBoundingClientRect) {
					var boundingRect = this.getBoundingClientRect();
					offsetX = event.clientX - boundingRect.left;
					offsetY = event.clientY - boundingRect.top;
				}
				// Add information to the event object
				event.deltaX = deltaX;
				event.deltaY = deltaY;
				event.deltaFactor = lowestDelta;
				event.offsetX = offsetX;
				event.offsetY = offsetY;
				// Go ahead and set deltaMode to 0 since we converted to pixels
				// Although this is a little odd since we overwrite the deltaX/Y
				// properties with normalized deltas.
				event.deltaMode = 0;
				// Add event and delta to the front of the arguments
				args.unshift(event, delta, deltaX, deltaY);
				// Clearout lowestDelta after sometime to better
				// handle multiple device types that give different
				// a different lowestDelta
				// Ex: trackpad = 3 and mouse wheel = 120
				if (nullLowestDeltaTimeout) {
					clearTimeout(nullLowestDeltaTimeout);
				}
				nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
				return ($.event.dispatch || $.event.handle).apply(this, args);
			}

			function nullLowestDelta() {
				lowestDelta = null;
			}

			function shouldAdjustOldDeltas(orgEvent, absDelta) {
				// If this is an older event and the delta is divisable by 120,
				// then we are assuming that the browser is treating this as an
				// older mouse wheel event and that we should divide the deltas
				// by 40 to try and get a more usable deltaFactor.
				// Side note, this actually impacts the reported scroll distance
				// in older browsers and can cause scrolling to be slower than native.
				// Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
				return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
			}
		}();
}
(window, jQuery);
 + function (window, $) {
	$.fn.addScrollBar = function (options) {
		/**
		 *  version: '16.7.3',
		 *  author: 'wuwg',
		 *  creatTime: '2016-07-06',
		 *  updateTime: '2016-11-30',
		 *   // 滚动条参数
		 *   hasScrollBar: true, // 是否有滚动条
		 *   scrollContentContainClass : 'fd-scroll-content', // 内容容器的class
		 *   scrollBarContainClass: 'fd-scroll-track', // 滚动条容器
		 *   scrollBarClass: 'fd-scroll-bar', // 滚动条
		 *   pressClass: 'pressed', // 滚动条按下类名
		 *   scrollBarMinHeight: 50, //  滚动条最小高度
		 *   scrollBarMinWidth : 50, //  滚动条最小宽度
		 *   scrollStep: 10, // 一次滚动的距离
		 *   scrollTweenTime: 10, // 滚动耗时
		 *	 hideScrollBar:true,  //Boolearn值,默认为false,是否绑定鼠标移入和移除事件
		 *   callback:function  // 滚动结束后的回调函数	，默认为null
		 * @return  {{object}}  _scope
		 * @更新方法 _scope.scrollBar.update(tweenTime,number) ; tweenTime 缓动时间 number 设置 top或者left值,这个值为滚动内容的值
		 */
		var _scope = {};
		_scope._this = $(this);
		var defaultOptions = {
			version : '16.7.3',
			author : 'wuwg',
			creatTime : '2016-07-06',
			updateTime : '2016-10-11',
			// 滚动条参数
			hasScrollBar : true, // 是否有滚动条
			direction:'vertical',//  垂直滚动还是水平滚动条，可选参数 horizontal（水平滚动条）
			scrollContentContainClass : 'fd-scroll-content', // 内容容器的class 
			scrollBarContainClass : 'fd-scroll-track', // 滚动条容器
			scrollBarClass : 'fd-scroll-bar', // 滚动条
			pressClass : 'pressed', // 滚动条按下类名
			scrollBarMinHeight : 5, //  滚动条最小高度
			scrollBarMinWidth : 50, //  滚动条最小宽度
			scrollStep : 10, // 一次滚动的距离
			scrollTweenTime : 10, // 滚动耗时
			hideScrollBar:true,  //Boolearn值,默认为false,是否绑定鼠标移入和移除事件
			callback : null
		}
		// 合并参数
		_scope.opts = $.fn.extend(true, defaultOptions, options || {});
		/**
		 * @author  wuwg
		 * @createTime   2016-07-03
		 * @updateTime   2016-10-11
		 * @description  自制滚动条函数
		 *  //父元素
		_scope.scrollBar.parentContain===_scope.opts.parentContain
		// 内容容器
		_scope.scrollBar.contentContain =_scope._this;
		 *
		 */
		_scope.scrollBar = {
			// 比较值函数
			range : function (num, max, min) {
				return Math.ceil(Math.min(max, Math.max(num, min)));
			},
			// 阻止冒泡函数
			stopBubble : function (event) {
				event.stopPropagation();
				event.preventDefault();
			},
			// 创建滚动条容器
			createScrollBar : function () {
				var _scrollBarHtml = $('<div  class="' + _scope.opts.scrollBarContainClass + '">' +
						'<span class="' + _scope.opts.scrollBarClass + '"></span>' +
						'</div>');
					// 默认是否隐藏滚动条
					if(_scope.opts.hideScrollBar){
						_scrollBarHtml.css({
							opacity:0
						})
					};
				_scrollBarHtml.appendTo(_scope.scrollBar.parentContain);
				// 滑道容器
				_scope.scrollBar.trackContain = _scope.scrollBar.parentContain.children('.' + _scope.opts.scrollBarContainClass);
				// 滚动条对象
				_scope.scrollBar.bar = _scope.scrollBar.trackContain.find('.' + _scope.opts.scrollBarClass);

			},
			/**
			 * @description  获取所有的参数
			 */
			getParams : function () {
				
				if(_scope.opts.direction=='vertical'){
					//  容器的高(可视区域的高)
					_scope.scrollBar.offsetHeight = _scope.scrollBar.parentContain.height();
					// 文档的高
					_scope.scrollBar.scrollHeight = _scope.scrollBar.contentContain.innerHeight();
					// 滑道的高
					_scope.scrollBar.trackContainHeight = _scope.scrollBar.trackContain.innerHeight();
					// 滚动条的高（ 计算公式：可视区域的高/文档的高= 等于scrollBar.height/_scope.scrollBar.contain.height）
					var scrollBarHeight = _scope.scrollBar.offsetHeight / _scope.scrollBar.scrollHeight * _scope.scrollBar.trackContainHeight;
					//  重新定义滚动条的高（需要设置一个最小值）
					_scope.scrollBar.barHeight = Math.max(_scope.opts.scrollBarMinHeight, scrollBarHeight);
					// 滚动条最小的top值
					_scope.scrollBar.scrollMinDistance = 0;
					// 滚动条最大的top值
					_scope.scrollBar.scrollMaxDistance = _scope.scrollBar.trackContainHeight - _scope.scrollBar.barHeight;
					// 滑道的有效区域高  （计算公式：等于滑道高减去滚动条的高）
					_scope.scrollBar.scrollAreaHeight = _scope.scrollBar.trackContainHeight - _scope.scrollBar.barHeight;
					// 设置滚动条的高
					_scope.scrollBar.bar.height(_scope.scrollBar.barHeight);
					// 如果可是区域的高大于文档内容的高那么隐藏滚动条,内容区域的top回归到0
					//debugger;
					if (_scope.scrollBar.offsetHeight > _scope.scrollBar.scrollHeight) {
						_scope.scrollBar.trackContain.css({
							display : 'none'
						});
						/***
						 *@updateTime  2016-10-11
						 *@author  wuwg
						 *@description  解决因为内容变少之前，有滚动条，并且滚动条已经滚动了一部分位置，
						 *   			当更新的内容少于可是高度时，滚动条会隐藏，但是在此之前，内容已经被滚动过，这时我们就需要把内容得
						 * 				top值设置为0
						 */
						//内容的初始位置为0
						_scope.scrollBar.contentContain.css({
							top : 0
						});
						// 滚动条的初始位置也为0
						_scope.scrollBar.bar.css({
							top : 0
						});
						// 不再往下执行代码
						return false;
					} else {
						_scope.scrollBar.trackContain.css({
							display : 'block'
						});
						return true;
					};	
				}else {
					//  容器的宽(可视区域的宽)
					_scope.scrollBar.offsetWidth = _scope.scrollBar.parentContain.width();
					// 文档的内容宽
					_scope.scrollBar.scrollWidth = _scope.scrollBar.contentContain.innerWidth();
					// 滑道的宽
					_scope.scrollBar.trackContainWidth = _scope.scrollBar.trackContain.innerWidth();
					// 滚动条的宽（ 计算公式：可视区域的宽/文档的宽= 等于滚动条的宽/滚动条容器的宽
					var scrollBarWidth = _scope.scrollBar.offsetWidth / _scope.scrollBar.scrollWidth * _scope.scrollBar.trackContainWidth;
					//  重新定义滚动条的宽（需要设置一个最小值）
					_scope.scrollBar.barWidth = Math.max(_scope.opts.scrollBarMinWidth, scrollBarWidth);
					// 滚动条最小的left值
					_scope.scrollBar.scrollMinDistance = 0;
					// 滚动条最大的top值
					_scope.scrollBar.scrollMaxDistance = _scope.scrollBar.trackContainWidth - _scope.scrollBar.barWidth;
					// 滑道的有效区域宽  （计算公式：等于滑道宽减去滚动条的宽）
					_scope.scrollBar.scrollAreaWidth = _scope.scrollBar.trackContainWidth - _scope.scrollBar.barWidth;
					// 设置滚动条的宽
					_scope.scrollBar.bar.width(_scope.scrollBar.barWidth);
					// 如果可是区域的宽大于文档内容的高宽那么隐藏滚动条,内容区域的left回归到0
					//debugger;
					if (_scope.scrollBar.offsetWidth > _scope.scrollBar.scrollWidth) {
						_scope.scrollBar.trackContain.css({
							display : 'none'
						});
						//内容的初始位置为0
						_scope.scrollBar.contentContain.css({
							left : 0
						});
						// 滚动条的初始位置也为0
						_scope.scrollBar.bar.css({
							left : 0
						});
						// 不再往下执行代码
						return false;
					} else {
						_scope.scrollBar.trackContain.css({
							display : 'block'
						});
						return true;
					};	
					
				}		
				
			},
			/**
			 *
			 * @param scrollTweenTime     number 毫秒
			 * @description  更新滚动条所有参数和内容以及滚动条的位置
			 */
			update : function (scrollTweenTime, number,updateCallback) {

				// 重新获取参数
				var _flag = _scope.scrollBar.getParams();
				//  只有存在滚动条的情况下才会执行下面的代码，否则就直接返回了
				if (_flag) {
					//  垂直滚动条
					if(_scope.opts.direction=='vertical'){
						// 指定位置
						if ($.type(number) == 'number') {
							//  设置top值
							var _top = number;

						} else {
							// 滑块当前位置
							var _top = !parseInt(_scope.scrollBar.contentContain.css("top")) ? 0
								 : parseInt(_scope.scrollBar.contentContain.css("top"));
						};
						// 变成正整数
						_top = Math.abs(_top);
						//  如果内容高度-top值小于可视高度，那么top应该等于 内容高度-可视高度
						if ((_scope.scrollBar.scrollHeight - _top) < _scope.scrollBar.offsetHeight) {
							_top = _scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight;
						}
						// 当前的百分比比等于 _top/（内容高度- 可视高度）
						var _percentProgress = _top / (_scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight);

						// 动画的时间
						var _scrollTweenTime = $.type(scrollTweenTime) == 'number' ? scrollTweenTime : _scope.opts.scrollTweenTime;

						// 滚动条移动
						_scope.scrollBar.bar.stop(true, true).animate({
							'top' : _scope.scrollBar.scrollAreaHeight * _percentProgress
						}, _scrollTweenTime, function () {
							if ($.type(_scope.opts.callback) == 'function') {
								_scope.opts.callback(_top);
							}
							// 执行更新后的回调函数
							if ($.type(updateCallback) == 'function') {
								updateCallback(_top);
							}
						});
						//  内容移动
						_scope.scrollBar.contentContain.stop(true, true).animate({
							'top' : -_top
						}, _scrollTweenTime);
					}else {
						// 指定位置
						if ($.type(number) == 'number') {
							//  设置top值
							var _left = number;

						} else {
							// 滑块当前位置
							var _left = !parseInt(_scope.scrollBar.contentContain.css("left")) ? 0
								 : parseInt(_scope.scrollBar.contentContain.css("left"));
						};
						// 变成正整数
						_left = Math.abs(_left);
						//  如果内容宽-left值小于可视宽度，那么left应该等于 内容宽度-可视宽度
						if ((_scope.scrollBar.scrollWidth - _left) < _scope.scrollBar.offsetWidth) {
							_top = _scope.scrollBar.scrollWidth - _scope.scrollBar.offsetWidth;
						}
						// 当前的百分比比等于 _left/（内容宽度- 可视宽度）
						var _percentProgress = _left / (_scope.scrollBar.scrollWidth - _scope.scrollBar.offsetWidth);

						// 动画的时间
						var _scrollTweenTime = $.type(scrollTweenTime) == 'number' ? scrollTweenTime : _scope.opts.scrollTweenTime;
						// 滚动条移动
						_scope.scrollBar.bar.stop(true, true).animate({
							'left' : _scope.scrollBar.scrollAreaWidth * _percentProgress
						}, _scrollTweenTime, function () {
							if ($.type(_scope.opts.callback) == 'function') {
								_scope.opts.callback(_top);
							}
					
							// 执行更新后的回调函数
							if ($.type(updateCallback) == 'function') {
								updateCallback(_top);
							}
						});
						//  内容移动
						_scope.scrollBar.contentContain.stop(true, true).animate({
							'left' :-_left //-Math.round((_scope.scrollBar.scrollWidth - _scope.scrollBar.offsetHeight) * _percentProgress)
						}, _scrollTweenTime);
					}
				}
			},
			/**
			 *
			 * @param moveDistance    number
			 * @description  滚动条动画和内容动画
			 */
			moveFunction : function (moveDistance) {
				// 动画的时间
				var _scrollTweenTime = _scope.scrollBar.draging ? 0 : _scope.opts.scrollTweenTime;
				//  垂直滚动条
				if(_scope.opts.direction=='vertical'){
					// 滚动条滑块的当前位置
					var _scrollBarTop = parseInt(_scope.scrollBar.bar.css("top")) == "" ? 0 : parseInt(_scope.scrollBar.bar.css("top"));
					// 下次滚动的位置
					_scrollBarTop += Number(moveDistance);
					// 滚动条滑块的最终top位置  //num, max, min
					var _scrollBarCurrentTopNum = _scope.scrollBar.range(_scrollBarTop, _scope.scrollBar.scrollMaxDistance, _scope.scrollBar.scrollMinDistance);
					// 滑块移动距离占总长度的百分之比
					var _percentProgress = _scrollBarCurrentTopNum / _scope.scrollBar.scrollAreaHeight;
					if (_scope.scrollBar.bar.is(':animated') || _scope.scrollBar.contentContain.is(':animated')) {
						return;
					} else {
						// 滚动条移动
						_scope.scrollBar.bar.stop(true, true).animate({
							'top' : _scrollBarCurrentTopNum
						}, _scrollTweenTime, function () {
							if ($.type(_scope.opts.callback) == 'function') {
								_scope.opts.callback(-Math.round((_scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight) * _percentProgress));
							}
						});
						//  内容移动
						_scope.scrollBar.contentContain.stop(true, true).animate({
							'top' : -Math.round((_scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight) * _percentProgress)
						}, _scrollTweenTime);
					}
				}else {
					// 滚动条滑块的当前位置
					var _scrollBarLeft = parseInt(_scope.scrollBar.bar.css("left")) == "" ? 0 : parseInt(_scope.scrollBar.bar.css("left"));
					// 下次滚动的位置
					_scrollBarLeft += Number(moveDistance);
					// 滚动条滑块的最终left位置  //num, max, min
					var _scrollBarCurrentLeftNum = _scope.scrollBar.range(_scrollBarLeft, _scope.scrollBar.scrollMaxDistance, _scope.scrollBar.scrollMinDistance);
					// 滑块移动距离占总宽度的百分之比
					var _percentProgress = _scrollBarCurrentLeftNum / _scope.scrollBar.scrollAreaWidth;
					if (_scope.scrollBar.bar.is(':animated') || _scope.scrollBar.contentContain.is(':animated')) {
						return;
					} else {
						// 滚动条移动
						_scope.scrollBar.bar.stop(true, true).animate({
							'left' : _scrollBarCurrentLeftNum
						}, _scrollTweenTime, function () {
							if ($.type(_scope.opts.callback) == 'function') {
								_scope.opts.callback(_scrollBarCurrentTopNum);
							}
						});
						//  内容移动
						_scope.scrollBar.contentContain.stop(true, true).animate({
							'left' : -Math.round((_scope.scrollBar.scrollWidth - _scope.scrollBar.offsetWidth) * _percentProgress)
						}, _scrollTweenTime);
					}
				}
			},
			/**
			 *
			 * @param event  鼠标滚轮事件
			 */
			mousewheel : function (event) {
				var event=_scope.scrollBar.getEvent(event);
				_scope.scrollBar.stopBubble(event);
				//  垂直滚动条
				if(_scope.opts.direction=='vertical'){
					//  如果内容的高小于可视区域的高那么不能滚动
					if (_scope.scrollBar.scrollHeight < _scope.scrollBar.offsetHeight) {
						return;
					}	
				}else {
					//  水平滚动
					//  如果内容的宽小于可视区域的宽那么不能滚动
					if (_scope.scrollBar.scrollWidth < _scope.scrollBar.offsetWidth) {
						return;
					}	
				}
				// 判断鼠标向下还是向上滚动
				var _mousewheelDir = event.deltaY,_moveDistance = 0;


				switch (_mousewheelDir) {
					//  向上滚动 || 向左滚动
				case 1:
					//开始和结束的差值
					_moveDistance = _scope.opts.scrollStep * (-1);
					//执行函数
					_scope.scrollBar.moveFunction(_moveDistance);
					break;
					//  向下滚动 ||  向右滚动
				case -1:
					//开始和结束的差值
					_moveDistance = _scope.opts.scrollStep;
					//执行函数
					_scope.scrollBar.moveFunction(_moveDistance);
					break;
				default:
					break;
				}
			},
			getEvent:function(event){
				var  event=event||window.event;
				return event;
			},
			draging : false,
			/**
			 * @param event
			 * @description  滚动条区域鼠标按下的的回调函数，先给window绑定事件，鼠标松开释放事件
			 */
			mousedown : function (event) {
				var event=_scope.scrollBar.getEvent(event);
				var _that = $(this);
				_scope.scrollBar.draging = true;
				//  垂直滚动条
					var _start = _scope.opts.direction=='vertical' ? event.pageY:event.pageX,
						_moveDistance = 0,
						_end = 0;
						_that.addClass(_scope.opts.pressClass);
				$(document).on('mousemove.scrollBar', function (event) {
					var event=_scope.scrollBar.getEvent(event);
					// 阻止事件冒泡
					_scope.scrollBar.stopBubble(event);
					_end =_scope.opts.direction=='vertical' ? event.pageY:event.pageX;
					// 禁止文本选中
					window.getSelection? window.getSelection().removeAllRanges() : document.selection.empty();
					//开始和结束的差值
					_moveDistance = _end - _start;
					_start = _end;
					_scope.scrollBar.moveFunction(_moveDistance);
				}).on('mouseup.scrollBar', function () {
					$(document).off('mousemove.scrollBar');
					$(document).off('mouseup.scrollBar');
					_scope.scrollBar.draging = false;
					_that.removeClass(_scope.opts.pressClass);
				});
			},
			/**
			 * @description  window.rezize 方法, 更新滚动条
			 */
			resize : function () {
				_scope.scrollBar.update(20);
			},
			// 绑定滚轮事件和mousedown事件，以及resize事件
			bindEvent : function () {
				//  所有事件都应该先解除绑定，再绑定事件
				_scope.scrollBar.parentContain.off('mousewheel.scrollBar').on('mousewheel.scrollBar', _scope.scrollBar.mousewheel);
				_scope.scrollBar.parentContain.off('mousedown.scrollBar').on('mousedown.scrollBar', '.' + _scope.opts.scrollBarClass, _scope.scrollBar.mousedown);
				_scope.scrollBar.resizeEvent=_scope._this.attr('id')?'resize.scrollBar'+_scope._this.attr('id'):'resize.scrollBar';
				// 绑定resize事件
				$(window).off(_scope.scrollBar.resizeEvent).on(_scope.scrollBar.resizeEvent, _scope.scrollBar.resize);
				if(_scope.opts.hideScrollBar){
					// 划入事件
					_scope.scrollBar.parentContain.off('mouseenter.scrollBar').on('mouseenter.scrollBar', function(){
						_scope.scrollBar.trackContain.stop(true,true).animate({
							'opacity':1
						},400);
					});
					// 划出事件
					_scope.scrollBar.parentContain.off('mouseleave.scrollBar').on('mouseleave.scrollBar', function(){
						_scope.scrollBar.trackContain.stop(true,true).animate({
							'opacity':0
						},400);
					});
				}
			},
			// 解除事件绑定
			unbindEvent : function () {
				_scope.scrollBar.parentContain.off('mousewheel.scrollBar', _scope.scrollBar.mousewheel);
				_scope.scrollBar.parentContain.off('mousedown.scrollBar', '.' + _scope.opts.scrollBarClass, _scope.scrollBar.mousedown);
				if(_scope.scrollBar.resizeEvent!='resize.scrollBar'){
					$(window).off(_scope.scrollBar.resizeEvent);
				}
				_scope.scrollBar.parentContain.off('mouseenter.scrollBar').off('mouseleave.scrollBar');
			},
			// 初始化的方法
			init : function () {
				//父元素
				_scope.scrollBar.parentContain = _scope._this;
				_scope.scrollBar.parentContain.css({
					overflow : 'hidden'
				});
				// 内容容器
				_scope.scrollBar.contentContain = _scope.scrollBar.parentContain.children('.'+_scope.opts.scrollContentContainClass);
				// 创建滚动条
				_scope.scrollBar.createScrollBar();
				// 获取响应参数，并且设置滚动条的高
				_scope.scrollBar.getParams();
				// 绑定事件
				_scope.scrollBar.bindEvent();
			},
			//  销毁对象
			destory : function () {
				//  销毁事件
				_scope.scrollBar.unbindEvent();
				// 销毁内容
				_scope.scrollBar.trackContain.remove();
			}
		};
		// 创建滚动条
		if (_scope.opts.hasScrollBar) {
			_scope.scrollBar.init();
		};
		return _scope;
	};
}
(window, jQuery);