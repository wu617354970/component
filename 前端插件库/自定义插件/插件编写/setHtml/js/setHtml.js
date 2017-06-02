/**
 * version:	 		    2015.01.01
 * creatTime: 	 		2015.11.11
 * updateTime: 			2016.12.27
 * author:				wuwg
 * name:  				setHtmlSize
 */
// set  html  size
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define('setHtml', ['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS style for Browserify
		module.exports = factory;
	} else {
		// Browser globals
		factory(jQuery)();
	}
})(function ($) {
	return function (options) {
		/**
		 *
		 * @param options
		 * @returns {
		 * 		{
		 * 		  this: (*|jQuery|HTMLElement),
		 * 		  setHtmlSize: Function,
		 * 		  bindEvent: Function,
		 * 	      unbindEvent: Function,
		 *        init: Function
		 *      }
		 * 	}
		 */
		$.fn.setHtmlSize = function (options) {
			var _this = $(this);
			var defaultOptions = {
				minWidth : 1440, //  最小宽
				minHeight : 800, //  最小高
				fontSize : 18, //  参照单位（按照视觉图来写）
				visualWidth : 1920, // 视觉图的宽
				visualHeight : 980 // 视觉图的高
			};
			var _opts = $.extend(true, {}, defaultOptions, options || {});
			var _scope = {
				this : _this,
				// 设置字体大小
				setHtmlSize : function () {
					var clientWidth = Math.max($(window.top).width(), _opts.minWidth), //  client  width
					clientHeight = Math.max($(window.top).height(), _opts.minHeight), //  client  height
					htmlSize = Math.min(clientWidth * _opts.fontSize / _opts.visualWidth, clientHeight * _opts.fontSize / _opts.visualHeight);
					//  html 对象
					_scope.this.css({
						"font-size" : htmlSize
					});
					//  判断是否是顶级框架页面
					//if (window.top.location.href != window.self.location.href) {
					// 给window 绑定resize事件
					//}
					return htmlSize;
				},
				//  绑定事件
				bindEvent : function () {
					$(window).off('resize.htmlSize').on('resize.htmlSize', function () {
						_scope.setHtmlSize();
					});
				},
				//  解除绑定
				unbindEvent : function () {
					$(window).off('resize.htmlSize');
				},
				// 初始化函数
				init : function () {
					_scope.setHtmlSize();
					_scope.bindEvent();
				}
			};
			//  执行函数
			$(function () {
				//  执行初始化函数
				_scope.init();
			});
			return _scope
		};
		//  执行方法
		$('html').setHtmlSize(options);
}});