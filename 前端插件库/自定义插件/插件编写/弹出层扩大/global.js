/*global*/

$(function () {
	$.fn.popupPage = function (options) {
		var defaultOptions = {
			type : 'click',
			popupElement : ".fd_popup",
			popupElementContent : ".fd_popup_page",
			duration : 1000,
			space : 18,
			closeBtn : ".close",
			callback : null,
			closeCallback : null
		}
		var opts = $.fn.extend({}, defaultOptions, options || {});
		return this.each(function () {
			var _this = $(this);
			$(opts.popupElement).css({
				position : "absolute",
				top : "50%",
				left : "50%",
				margin : 0,
				width : 0,
				height : 0,
				overflow : "hidden",
				"z-index" : 9999,
				"background" : "rgba(0,0,0,0.5)"
			}).data("ishide", true);
			$(opts.popupElementContent).css({
				position : "absolute",
				top : "50%",
				left : "50%",
				"z-index" : "999",
				width : $(window).width() - opts.space,
				height : $(window).height() - opts.space,
				margin : ( - ($(window).height() - opts.space) / 2) + "px 0px 0px " + ( - ($(window).width() - opts.space) / 2) + "px",
			});
			_this.bind(opts.type, function () {
				$(opts.popupElement).animate({
					width : $(window).width(),
					height : $(window).height(),
					margin : (-$(window).height() / 2) + "px 0px 0px " + (-$(window).width() / 2) + "px"
				}, opts.duration, function () {
					if (opts.callback != null && typeof opts.callback == "function") {
						opts.callback();
					}
				});
				$(opts.popupElement).data("ishide", false);
			});
			function adjustContent() {
				var winW = $(window).width();
				var winH = $(window).height();
				$(opts.popupElement).animate({
					width : winW,
					height : winH,
					margin : (-winH / 2) + "px 0px 0px " + (-winW / 2) + "px"
				}, opts.duration / 4, function () {});
				$(opts.popupElementContent).animate({
					width : winW - opts.space,
					height : winH - opts.space,
					margin : ( - (winH - opts.space) / 2) + "px 0px 0px " + ( - (winW - opts.space) / 2) + "px",
				}, opts.duration / 4, function () {})
			};

			$(window).bind("resize", function () {
				if (!$(opts.popupElement).data("ishide")) {
					adjustContent();
				}
			});

			$(opts.popupElement).find(opts.closeBtn).bind(opts.type, function () {
				$(opts.popupElement).animate({
					width : 0,
					height : 0,
					margin : 0
				}, opts.duration / 3, function () {});
				$(opts.popupElement).data("ishide", true);
			});
		});
	};
	$("button").popupPage({
		type : 'click',
		popupElement : ".fd_popup",
		popupElementContent : ".fd_popup_page",
		duration : 1000,
		space : 18,
		closeBtn : ".close",
		callback : function () {},
		closeCallback : function () {},
	});
});