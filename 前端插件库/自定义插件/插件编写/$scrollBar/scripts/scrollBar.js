/* javascript document  */
/************************************
 *	Version 		1.0.2
 *	Author			wuwg
 *  CreateTime      14.08.18
 *	UpdateTime		15.05.27
 **************************************/
+function(window, $) {
	/*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
	 * Licensed under the MIT License (LICENSE.txt).
	 *
	 * Version: 3.1.12
	 *
	 * Requires: jQuery 1.2.2+
	 */
	(function (factory) {
		if (typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define(['jquery'], factory);
		} else if (typeof exports === 'object') {
			// Node/CommonJS style for Browserify
			module.exports = factory;
		} else {
			// Browser globals
			factory(jQuery);
		}
	}
		(function ($) {
			var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
			toBind = ('onwheel' in document || document.documentMode >= 9) ?
			['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
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
		}));
}
(window, jQuery);
(function ($, window) {

	$.fn.addScrollBar = function (options) {
		/**************************************************************************************************************************************************************
		 *	方法名：						addScrollBar()
		 *	使用范例 ： 				    $("#scrollContentHorizontal").addScrollBar({});
		 *	dir								滚动条出现的方向 默认为垂直  "v" 可选参数 "h"；
		 *	tweenTime						缓动时间，毫秒数
		 *	step							鼠标滚轮滑动的距离 参数为 number 类型
		 *	AutoTrackHeight					Boolearn值,设置滚动条是否自动适应高度，false为固定滚动条高度
		 *	bindArrowEvent					Boolearn值,默认为false,判断是否为箭头绑定事件
		 *	hideScrollBar					Boolearn值,默认为false,是否绑定鼠标移入和移除事件
		 *	scrollBarMargin					number 类型,为正数,决定滚动条和箭头之间的距离
		 *	scrollBarContainWidth			滚动条容器的宽度,number 类型,为正数
		 *	scrollBarContainHeight			滚动条容器的高度,number 类型,为正数
		 *	scrollArrowWidth				箭头的宽度,number 类型,为正数
		 *	scrollBarHeight					箭头的高度,number 类型,为正数
		 *	scrollBarWidth					滚动条的宽度,number 类型,为正数
		 *  scrollBarHeight					滚动条的高度,number 类型,为正数
		 *	scrollBarContain				滚动条容器的类名
		 *	arrowUp							上箭头（左箭头）的类名
		 *	arrow_down						下箭头（下箭头）的类名
		 *  scrollBar 						滚动条的类名
		 *	isBindBrowserEvent				是否绑定浏览器事件
		 *	callback						回调函数 function(){} 类型
		 **************************************************************************************************************************************************************/
		// 默认参数
		var defaultOptions = {
			dir : "v",
			step : 2,
			tweenTime : 300,
			AutoTrackHeight : false,
			bindArrowEvent : true,
			hideScrollBar : false,
			scrollBarMargin : 3,
			scrollBarContainWidth : 15,
			scrollBarContainHeight : 15,
			scrollArrowWidth : 15,
			bindEvent : true,
			scrollArrowHeight : 15,
			scrollBarWidth : 15,
			scrollBarHeight : 30,
			scrollBarContain : "scrollBarContain",
			arrowUp : "arrow_up",
			arrowDown : "arrow_down",
			scrollBar : "scroll_bar",
			isBindBrowserEvent : true,
			callback : null,
			isBindWindowEvent : true
		}
		// 合并传入参数
		var opts = $.extend({}, defaultOptions, options || {});

		return this.each(function () {

			// 创建滚动条
			var _scrollBarContain = $('<div class="' + opts.scrollBarContain + '"></div>').css({
					"position" : "absolute",
					'z-index' : '2',
					"background-color" : "#b3b6b6",
					"overflow" : "hidden"
				});
			var _arrowUp = $('<div class="' + opts.arrowUp + '"></div>').css({
					"position" : "absolute",
					'z-index' : '1000',
					"width" : opts.scrollArrowWidth,
					"height" : opts.scrollArrowHeight,
					"background-color" : "#888"
				});
			var _arrowDown = $('<div class="' + opts.arrowDown + '"></div>').css({
					"position" : "absolute",

					'z-index' : '1000',
					"width" : opts.scrollArrowWidth,
					"height" : opts.scrollArrowHeight,
					"background-color" : "#888"
				});
			var _scrollBar = $('<div class="' + opts.scrollBar + '"></div>').css({
					"position" : "absolute",
					"z-index" : '999',
					"background-color" : "#4da1d9"
				});
			_scrollBarContain.append(_arrowUp);
			_scrollBarContain.append(_arrowDown);
			_scrollBarContain.append(_scrollBar);

			// 初始化滚动条函数
			function initialFunction(dir) {
				if (dir == "v") { // 垂直方向滚动条初始化

					//滚动条容器
					_scrollBarContain.css({
						"width" : opts.scrollBarContainWidth
					});
					//上箭头
					_arrowUp.css({
						"left" : "0",
						"top" : "0"
					});
					//下箭头
					_arrowDown.css({
						"left" : "0",
						"bottom" : "0"
					});
					//滚动条
					_scrollBar.css({
						"top" : opts.scrollArrowHeight + opts.scrollBarMargin,
						"left" : "0",
						"width" : opts.scrollBarWidth,
						"height" : opts.scrollBarHeight
					});

				} else { // 水平方向滚动条初始化
					//滚动条容器
					_scrollBarContain.css({
						"height" : opts.scrollBarContainHeight
					});
					//上箭头
					_arrowUp.css({
						"left" : 0,
						"bottom" : "0"
					});
					//下箭头
					_arrowDown.css({
						"right" : 0,
						"bottom" : "0"
					});
					//滚动条
					_scrollBar.css({
						"left" : opts.scrollArrowWidth + opts.scrollBarMargin,
						"bottom" : "0",
						"width" : opts.scrollBarWidth,
						"height" : opts.scrollBarHeight
					});

				}

			}
			// 执行初始化函数
			initialFunction(opts.dir);

			var _that = this,
			_this = $(this),
			_oheight,
			_owidth; // this 对象   容器的宽高
			_this.wrapInner('<div class="scrollContent" />');
			if (opts.dir == "v") {
				_this.find(".scrollContent").css({
					width : "100%",
					"height" : "auto",
					"overflow" : "hidden"
				});
			} else {
				_this.find(".scrollContent").css({
					width : _this.find(".scrollContent").children().width(),
					"height" : "100%",
					"overflow" : "hidden"
				});
			}
			// 获取高
			_oheight = _this.height();
			// 获取宽
			_owidth = _this.width();
			// 获取元素的所有内容
			var _ocontent = _this.children();
			// 生存滚动条函数
			function MakeScroll() {
				if (opts.dir == "v") {
					if (_this.get(0).scrollHeight <= _oheight) {
						// 判断内容高度是否小于容器高度,如果小于直接返回,不出现滚动条
						return;
					} else {

						// 获取内容，分配到一个新的容器
						
						_that._scroll_zone = $('<div class="scroll_zone"></div>').append(_ocontent).css({
								width : _owidth - opts.scrollBarContainWidth + 'px',
								height : _oheight + 'px',
								overflow : 'hidden',
								"z-index" : "1"
							});
						// 清空原有容器的内容,用心的内容容器进行填充
						_this.empty().append(_that._scroll_zone).css({
							position : 'relative',
							'overflow' : 'hidden'
						}).append(_scrollBarContain);

						//设置滚动条容器样式
						_scrollBarContain.css({
							left : _owidth - opts.scrollBarContainWidth + 'px',
							top : '0',
							height : _oheight + 'px'
						});
					}
				} else {
					if (_this.get(0).scrollWidth <= _owidth) {
						// 判断内容宽度是否小于容器宽度,如果小于直接返回,不出现滚动条
						return;
					} else {
						// 获取内容，分配到一个新的容器
						_that._scroll_zone = $('<div class="scroll_zone"></div>').html(_ocontent).css({
								width : _owidth + 'px',
								height : _oheight + 'px', //  高度去了会影响内容，所以滚动条直接覆盖在上面
								overflow : 'hidden',
								"z-index" : 1
							});

						// 清空原有的容器,用的容器进行填充
						_this.empty().append(_that._scroll_zone).css({
							position : 'relative',
							'overflow' : 'hidden'
						}).append(_scrollBarContain);

						//设置滚动条容器样式
						_scrollBarContain.css({
							left : '0',
							bottom : '0',
							width : _owidth + 'px'
						});

					}

				}
			};
			// 生成整个滚动条
			MakeScroll();

			//  重置整个滚动容器
			function reloadScroll() {
				// 获取高
				_oheight = _this.height();
				// 获取宽
				_owidth = _this.width();

				if (opts.dir == "v") {
					// 重置滚动容器大小
					_that._scroll_zone.css({
						width : _owidth - opts.scrollBarContainWidth + 'px',
						height : _oheight + 'px',
					});
					//重置滚动条容器位置
					_scrollBarContain.css({
						left : _owidth - opts.scrollBarContainWidth + 'px',
						height : _oheight + 'px'
					});

				} else {
					// 重置滚动容器大小
					_that._scroll_zone.css({
						width : _owidth + 'px',
						height : _oheight + 'px'
					});
					//重置滚动条容器位置
					_scrollBarContain.css({
						width : _owidth + 'px'
					});

				}

			};

			/*** 限制函数,三个参数,如果获得的num值比max大,那么取max值,如果小就取 min值,其他返回num值。 ****/

			function range(num, max, min) {
				return Math.ceil(Math.min(max, Math.max(num, min)));
			}

			/********************************************************************************************************************************
			声明变量:
			滚动容器对象  ,方向判断 , 步长 , 缓动时间, 是否在滑动,
			滑块最大值,滑块最小值, 拖动开始记录鼠标点击的位置, 拖动结束记录鼠标的位置, 开始和结束的差值 ,
			滑块当前位置,滑块移动距离占总长度的百分之比
			滚轮向上还是向下
			是否执行动画,间距,

			 *************************************************************************************************************************************/

			var _content,
			_isVertical,
			_step,
			_tweenTime,
			_isDraging,
			_ScrollCurrentTopNum,
			_ScrollMax,
			_ScrollMin,
			_firstPageY,
			_lastPageY,
			_moveDistance,
			_nowProgress,
			_preProgress,
			_mousewheelDir,
			_isAnimate,
			_spacing;
			//  滚动容器对象

			
			_content = (_that._scroll_zone)?_that._scroll_zone.get(0):_this;

			// 方向判断
			_isVertical = Boolean(opts.dir == "v");

			// 步长  最小拖动值  最大拖动值
			_step = Math.max(Math.min(opts.step || 10, 50), 20);

			//缓动时间
			_tweenTime = opts.tweenTime || 200;

			//是否在滑动
			_isDraging = false;

			// 是否执行动画，在滑倒点击事件有用
			_isAnimate = false;

			// 移动后滑块的位置 ,滑块最大值, 滑块最小值,拖动开始记录鼠标点击的位置, 拖动结束记录鼠标的位置, 开始和结束的差值 ,滑块当前位置,滑块移动距离占总长度的百分之比
			_ScrollCurrentTopNum = _ScrollMax = _ScrollMin = _firstPageY = _lastPageY = _moveDistance = _nowProgress = _preProgress = 0;

			function setScrollBarHeight() {
				// 智能设置滚动条的高 || 宽
				if (opts.AutoTrackHeight) {
					_isVertical ? _scrollBar.height(Math.max(15, (_content.offsetHeight / _content.scrollHeight) * _scrollBarContain.height()) + 'px') :
					_scrollBar.width(Math.max(15, (_content.offsetWidth / _content.scrollWidth) * _scrollBarContain.width()) + 'px')
				} else {
					// 跳过;
				}
			}
			// 设置滚动条的高
			setScrollBarHeight();
			// 间距
			_spacing = _isVertical ?
				(typeof opts.scrollBarMargin === "number" && opts.scrollBarMargin > 0 && opts.scrollBarMargin < _oheight / 2 - _arrowDown.height() - _scrollBar.height() / 2 ? opts.scrollBarMargin : 0) :
				(typeof opts.scrollBarMargin === "number" && opts.scrollBarMargin > 0 && opts.scrollBarMargin < _owidth / 2 - _arrowDown.width() - _scrollBar.width() / 2 ?
					opts.scrollBarMargin : 0);
			// 调整 _scrollBar 的位置
			_isVertical ? _scrollBar.css({
				"top" : opts.scrollArrowHeight + _spacing
			}) : _scrollBar.css({
				"left" : opts.scrollArrowWidth + _spacing
			});

			// 设置滚动条最大最小值
			function setScrollBarMaxHeightMinHeight() {

				//  重新设置最大值
				_ScrollMax = _isVertical ?
					(_oheight - (_arrowDown.height() + _scrollBar.height() + _spacing)) :
					(_owidth - (_arrowDown.width() + _scrollBar.width() + _spacing));

				//  重新设置最小值
				_ScrollMin = _isVertical ? _arrowUp.height() + _spacing : _arrowUp.width() + _spacing;
			}
			setScrollBarMaxHeightMinHeight();
			//  重置内容和滚动条的位置
			function resetContentScrollBarPosition() {
				_content.scrollTop = (0);
				_isVertical ? _scrollBar.css("top", opts.scrollArrowHeight + opts.scrollBarMargin + 'px') :
				_scrollBar.css("left", opts.scrollArrowWidth + opts.scrollBarMargin + 'px');
			}
			// 滚动函数
			function moveFunction(moveDistance) {
				if (_isVertical) { //  垂直出现滚动条
					// 滑块当前位置
					_nowProgress = parseInt(_scrollBar.css("top")) == "" ? 0 : parseInt(_scrollBar.css("top"));

					_nowProgress += Number(moveDistance);

					// 移动后滑块的位置
					_ScrollCurrentTopNum = range(_nowProgress, _ScrollMax, _ScrollMin); //num, max, min

					// 滑块移动距离占总长度的百分之比
					_preProgress = (_ScrollCurrentTopNum - _ScrollMin) / (_oheight - _arrowUp.height() - _arrowDown.height() - _scrollBar.height() - (2 * _spacing));

					if (_isAnimate) {
						$(_content).stop(true, true).animate({
							scrollTop : ((_content.scrollHeight - _content.offsetHeight) * _preProgress)
						}, _tweenTime, function () {
							_isAnimate = false;
						});
						_scrollBar.stop(true, true).animate({
							'top' : _ScrollCurrentTopNum

						}, _tweenTime, function () {

							_isAnimate = false;
						});
					} else {

						_content.scrollTop = ((_content.scrollHeight - _content.offsetHeight) * _preProgress);

						_scrollBar.css('top', _ScrollCurrentTopNum + 'px');
					}
				} else { //  水平出现滚动条
					// 滑块当前位置
					_nowProgress = parseInt(_scrollBar.css("left")) == "" ? 0 : parseInt(_scrollBar.css("left"));

					_nowProgress += Number(moveDistance);

					// 移动后滑块的位置
					_ScrollCurrentTopNum = range(_nowProgress, _ScrollMax, _ScrollMin);

					// 滑块移动距离占总宽度的百分之比
					_preProgress = (_ScrollCurrentTopNum - _ScrollMin) / (_owidth - _arrowUp.width() - _arrowDown.width() - _scrollBar.width() - (2 * _spacing));

					// 点击滑道执行动画
					if (_isAnimate) {
						$(_content).stop(true, true).animate({
							scrollLeft : ((_content.scrollWidth - _content.offsetWidth) * _preProgress)
						}, _tweenTime, function () {
							_isAnimate = false;
						});
						_scrollBar.stop(true, true).animate({
							'left' : _ScrollCurrentTopNum

						}, _tweenTime, function () {

							_isAnimate = false;
						});
					} else {
						_content.scrollLeft = ((_content.scrollWidth - _content.offsetWidth) * _preProgress);
						_scrollBar.css('left', _ScrollCurrentTopNum + 'px');
					}

				}
				// 执行回调函数
				opts.callback !== null ? callback() : "";
			}

			// 阻止事件冒泡函数
			function stopBubble(e) {
				e.preventDefault();
				e.stopPropagation();
			}
			// 注册隐藏显示滚动条事件
			opts.hideScrollBar ? _this.hover(function () {
				_this.find(_scrollBarContain).animate({
					opacity : 1
				}, opts.tweenTime);
			}, function () {
				_this.find(_scrollBarContain).animate({
					opacity : 0
				}, opts.tweenTime);

			}).trigger("mouseout") : "";

			// 注册拖动事件
			_this.find(_scrollBar).mousedown(function (e) {

				_isDraging = true;

				//拖动开始记录鼠标点击的位置
				_firstPageY = _isVertical ? e.pageY : e.pageX;

				if (_isDraging) {

					$(document).mousemove(function (e) {

						// 阻止事件冒泡
						stopBubble(e);

						//拖动结束记录鼠标的位置
						_lastPageY = _isVertical ? e.pageY : e.pageX;

						//开始和结束的差值
						_moveDistance = _lastPageY - _firstPageY;

						//重新记录拖动开始鼠标的位置
						_firstPageY = _isVertical ? e.pageY : e.pageX;

						moveFunction(_moveDistance);

					});
					return false;

				} else {
					return;
				}

				// 阻止事件冒泡
				stopBubble(e);

			}).bind("mouseout mouseup", function () {

				_isDraging = false;

				$(document).mouseup(
					function () {
					$(document).unbind('mousemove');
				});
			});

			// 注册滚轮事件事件
			_this.bind("mousewheel", function (e) {

				// 阻止事件冒泡
				stopBubble(e);

				// 判断鼠标向下还是向上滚动
				_mousewheelDir = e.deltaY;

				_count = e.delta

					switch (_mousewheelDir) {
						//  向上滚动
					case 1:

						//开始和结束的差值
						_moveDistance = opts.step * (-1);

						//执行函数
						moveFunction(_moveDistance);

						break;
						//  向下滚动
					case  - 1:
						//开始和结束的差值

						_moveDistance = opts.step;

						//执行函数
						moveFunction(_moveDistance);

						break;

					}

			});

			// 注册滑道点击事件
			_this.find(_scrollBarContain).bind("click", function (e) {

				if (e.target == _this.find(_scrollBar).get(0)) { //  如果是滚动条那么直接返回
					return;

				} else {

					_isAnimate = true;

					//记录鼠标点击的位置
					_firstPageY = _isVertical ? e.pageY : e.pageX;

					var _scrollBarOffset = _isVertical ? _this.find(_scrollBar).offset().top : _this.find(_scrollBar).offset().left;

					//开始和结束的差值
					_moveDistance = (_firstPageY - _scrollBarOffset) - (_isVertical ? _this.find(_scrollBar).innerHeight() / 2 : _this.find(_scrollBar).innerWidth() / 2)

					//执行函数
					moveFunction(_moveDistance);

					// 阻止事件冒泡
					stopBubble(e);
				}
			});

			// 注册箭头点击事件
			if (opts.bindArrowEvent) {

				_this.find(_arrowUp).bind("click", function (e) {

					_isAnimate = true;

					//开始和结束的差值
					_moveDistance = _isVertical ? (_content.offsetHeight / 10 * (-1)) : (_content.offsetWidth / 10 * (-1));

					//执行函数
					moveFunction(_moveDistance);

					// 阻止事件冒泡
					stopBubble(e);

				});

				_this.find(_arrowDown).bind("click", function (e) {

					_isAnimate = true;

					//开始和结束的差值
					_moveDistance = _isVertical ? (_content.offsetHeight / 10) : (_content.offsetWidth / 10);

					//执行函数
					moveFunction(_moveDistance);

					// 阻止事件冒泡
					stopBubble(e);

				});

			}
			//  重置整个事件
			function executeEvent() {
				//  设置滚动条的高
				setScrollBarHeight();
				// 设置滚动条最大最小值
				setScrollBarMaxHeightMinHeight();
				// 重新设置内容的位置和滚动条的位置
				resetContentScrollBarPosition();

			}
			//  如果绑定浏览器事件那么每次浏览器变动都重置滚动条
			if (opts.isBindWindowEvent) {
				$(window).bind("resize", function () {
					reloadScroll(); // 重置整个外围结构
					executeEvent(); // 重置整个事件
				});
			}
		});
	};
})(jQuery, window);