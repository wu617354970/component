;
(function ($, window) {
	$.fn.addSelect = function (options) {

		//合并传入与默认的参数
		var opts = $.extend({}, $.fn.addSelect.defaultOpts, options || {});
		//实现方法
		$(this).each(function () {
			// 获得内容导航容器
			var _that = $(this);
			var searchContentContain = _that.find(opts.searchContentContain);

			//赋值容器
			var changeValue = _that.find(opts.getValueClass);

			// 绑定事件
			$(document).bind("click", function (event) {
				var e = event || window.event;

				if (opts.extendTrigger) {
					// 扩展区域的id
					var extendTriggerId = null;
					// 循环所有的getValueClass
					$(opts.getValueClass).each(function (i) {

						if ($(opts.getValueClass).eq(i).get(0) == changeValue.get(0)) {
							// 重新赋值id
							extendTriggerId = "getValueId" + i;
							$(opts.getValueClass).eq(i).attr("id", extendTriggerId);
						}
					})
					//  如果扩大区域，那么点击赋值容器也会触发事件
					if (e.target.id == opts.triggerEleId || e.target.id == extendTriggerId) {
						if (searchContentContain.is(":hidden")) {
							searchContentContain.show();
								$("#"+opts.triggerEleId).addClass("sp_mousedown_plus");
						} else {
							searchContentContain.hide();
								$("#"+opts.triggerEleId).removeClass("sp_mousedown_plus");
						};
					} else {
							searchContentContain.hide();
							$("#"+opts.triggerEleId).removeClass("sp_mousedown_plus");
					};

				} else {
					//判断点击对象的id是否是触发事件的对象
					if (e.target.id == opts.triggerEleId) {
						if (searchContentContain.is(":hidden")) {
							searchContentContain.show();
							$("#"+opts.triggerEleId).addClass("sp_mousedown_plus");
						} else {
							searchContentContain.hide();
							$("#"+opts.triggerEleId).removeClass("sp_mousedown_plus");
						};
					} else {
						searchContentContain.hide();
						$("#"+opts.triggerEleId).removeClass("sp_mousedown_plus");
					};

				}
			});
			//  为内容导航容器的子元素绑定事件
			searchContentContain.children("dd").each(function () {
				$(this).hover(function () {
					$(this).addClass(opts.addHoverClass).siblings().removeClass(opts.addHoverClass);
				}, function () {
					$(this).removeClass(opts.addHoverClass);
				});
				$(this).click(function () {
					var value = $(this).text();
					changeValue.text(value);
					searchContentContain.hide();
				});
			});
			opts.extendTrigger ? changeValue.css({
				cursor : "pointer"
			}) : "";
		});
	}
	/*
	 *	默认参数
	 *   mouseType					触发事件的类型
	 *	triggerClass				触发事件的对象   参数为id
	 *	searchContentContain		下拉框容器对象  参数为id 或者class
	 *	addHoverClass				下拉框容器鼠标滑过时添加的类名  参数为不带"." 的class
	 *	getValueClass				获得新值得容器对象 参数为id或者class
	 */
	$.fn.addSelect.defaultOpts = {
		triggerEleId : "sp_mousedown", //  注意此参数不带"#"
		extendTrigger : false, //  布尔值，默认为false,备选参数，true
		searchContentContain : ".search_con_nav", //  注意此参数带 "."或者"#"
		addHoverClass : "dd_hover", //  注意此参数不带 "."且必须是class名
		getValueClass : ".sp_gain_value" //  注意此参数带 "."或者"#"
	};
})(jQuery, window);