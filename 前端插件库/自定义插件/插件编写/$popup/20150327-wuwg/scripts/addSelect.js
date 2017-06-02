;
(function ($, window) {
	$.fn.addSelect = function (options) {

		//合并传入与默认的参数
		var opts = $.extend({}, $.fn.addSelect.defaultOpts, options || {});
		//实现方法
		$(this).each(function () {

			var _that = $(this);
			// 获取下拉内容容器
			var searchContentContain = _that.find(opts.searchContentContain).length > 0 ?
				_that.find(opts.searchContentContain) : _that.children(":last");
				searchContentContain.addClass("jsSpecialControlSlideNavigationContain");
			//赋值容器
			var changeValue = _that.find(opts.getValueClass);
			//触发箭头
			var _triggerArrow = _that.find(opts.triggerElement);
			var _triggerElement = null;
			// 扩展点击区域，那么触发对象就是下拉三角的父元素，否则就只有下拉三角是触发下拉元素
			if (opts.extendTrigger) {
				_triggerElement = _triggerArrow.parent();
				// 增加className  extendTriggerClass
				_triggerElement.addClass("extendTriggerClass").css({
					cursor : "pointer"
				});
			} else {
				_triggerElement = _triggerArrow;
			}
			// 绑定下拉事件
			_triggerElement.bind(opts.mouseType, function (event) {
				//阻止事件冒泡
				event.stopPropagation();
				//阻止默认事件
				event.preventDefault();
				// 显示或者隐藏下拉内容狂
				showOrHideSearchContentContain();
			});

			function showOrHideSearchContentContain() {
				if (searchContentContain.is(":hidden")) {
					// 其他下拉框隐藏
					$(".jsSpecialControlSlideNavigationContain").hide();
					// 显示当前点击的那个下拉内容容器
					searchContentContain.show();
					_triggerArrow.addClass("sp_mousedown_plus");
				} else {
					// 隐藏下拉内容容器
					searchContentContain.hide();
					_triggerArrow.removeClass("sp_mousedown_plus");
				};
			}
			//  绑定文档事件
			$(document).bind("click", function (event) {
				// 获取当前的点击元素
				var _target = $(event.target);
				//  隐藏元素
				searchContentContain.hide();
			});

			//  为内容导航容器的子元素绑定事件
			searchContentContain.children().each(function () {
				$(this).hover(function () {
					$(this).addClass(opts.addHoverClass).siblings().removeClass(opts.addHoverClass);
				}, function () {
					$(this).removeClass(opts.addHoverClass);
				});
				$(this).click(function () {
					var value = $(this).text();
					changeValue.text(value);
					searchContentContain.hide();
					opts.callBack != null ? opts.callBack(value) : "";
				});
			});

		});
	}
	/*
	 *	默认参数
	 *	triggerElement				触发事件的元素
	 *  mouseType					触发的事件类型
	 *	extendTrigger				是否扩展， 	 布尔值，默认为false,备选参数，true
	 *	searchContentContain		下拉框容器对象  参数为id 或者class
	 *	addHoverClass				下拉框容器鼠标滑过时添加的类名  参数为不带"." 的class
	 *	getValueClass				获得新值得容器对象 参数为id或者class
	 *	callBack					回调函数,会返回当前获取的值
	 */
	$.fn.addSelect.defaultOpts = {
		triggerElement : ".sp_mousedown", // className 或者id  或者元素选择器
		mouseType : "click", // 鼠标事件
		extendTrigger : false, //  布尔值，默认为false,备选参数，true
		searchContentContain : ".search_con_nav", //  className 或者id  或者元素选择器
		getValueClass : ".sp_gain_value", //  注意此参数带 "."或者"#"
		addHoverClass : "dd_hover", //  注意此参数不带 "."且必须是class名	,
		callBack : null
	};
})(jQuery, window);