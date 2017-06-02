/**
 * js
 * Time  			 	 2015-10-10
 * plugin Name  		 scrollPage
 * author                wuwg
 **/

$(function () {

	$.fn.addScrollPage = function (options) {
		var defaultOptions = {
			naviGationId : "#js_fd_dl_fix_nav",
			mainContentWidth : 1340,
			NavigationPosition : "right",
			clickItem : ".fd_dd_item", //  必须是 naviGationId 的后代元素
			clickItemActiveClass : "fd_dd_item_active", // 激活的类名
			connectContain : ".fd_content_article_contain", // 关联容器
			connectContainItem : ".fd_section", // 关联容器与导航相对应的条目
			positionElement : ".dt_02", //  必须是 connectContain 子类的后代元素
			tweenTime : 400,
			mouseType : "click"
		}
		//  合并参数
		var opts = $.fn.extend({}, defaultOptions, options || {});

		/*fix navigation*/
		function fixNav() {
			$(opts.naviGationId).css({
				position : "fixed",
			});
			if (opts.NavigationPosition == "right") {
				$(opts.naviGationId).css({
					right : ($(window).width() - 1340) / 2,
					left : "auto"
				});
			} else {
				$(opts.naviGationId).css({
					right : "auto",
					left : ($(window).width() - 1340) / 2
				});
			}
		};
		fixNav();

		$(window).resize(function () {
			fixNav();
		});
		/*
		 * _flag     		判断是否正在运动的旗帜
		 *_timer				动画定时器
		 * _clickItem 		导航触发元素
		 * _top              滚动条的位置
		 */

		var _flag = false,
		_timer = null,
		_clickItem = $(opts.naviGationId).find(opts.clickItem),
		_top = 0;

		_clickItem.click(function () {});
		_clickItem.on(opts.mouseType, function () {

			if (_flag) {
				return;
			}
			_flag = true;
			var index = $(this).index() - 1;
			//移除选中状态
			$(this).addClass(opts.clickItemActiveClass).siblings().removeClass(opts.clickItemActiveClass);

			_top = $(opts.connectContain).children().eq(index).find(opts.positionElement).position().top;

			$("html,body").stop(true, true).animate({
				scrollTop : _top
			}, opts.tweenTime, function () {
				_timer = setTimeout(function () {
						_flag = false;
					}, 10);
			});

		});
		(function () {
			var topArray = [];
			$(opts.connectContain).children(opts.connectContainItem).each(function () {
				topArray.push($(this).find(opts.positionElement).position().top);
			});
			$(window).bind("scroll", function () {
				if (!_flag) {
					_top = $(window).scrollTop();
					for (var i = 0; i < topArray.length; i++) {
						if (_top < topArray[i]) {
							_clickItem.eq(i).addClass(opts.clickItemActiveClass).siblings().removeClass(opts.clickItemActiveClass);
							break;
						}
					}
				}
			});
		})();

	};

	//  执行方法
	$(window).addScrollPage()

});