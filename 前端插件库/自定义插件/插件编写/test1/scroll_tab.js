/*javascript document*/
+function($, window) {

	$.fn.addScroll = function (options) {
		var defaultOption = {
			previousButton : ".preBtnIndex",
			previousGray : ".previousGray",
			nextButton : ".nextBtnIndex",
			nextGray : ".nextGray",
			scrollContain : ".sp_gd_con",
			delay : 2000,
			tweentime : 300,
			mouseType : "click",
			callBack : null
		}

		var opts = $.fn.extend({}, defaultOption, options || {});

		return this.each(function () {
			var _that = $(this);
			var _timer = null;
			var _scrollContain = _that.find(opts.scrollContain);
			var _len = _scrollContain.children().length;
			var _prev = _that.find(opts.previousButton); //  前按钮
			var _next = _that.find(opts.nextButton); //  后按钮
			var _previousGray = opts.previousGray.indexOf(".") == 0 ? opts.previousGray.substring(1) : opts.previousGray; //  置灰前按钮
			var _nextGray = opts.nextGray.indexOf(".") == 0 ? opts.nextGray.substring(1) : opts.nextGray; // 置灰后按钮
			var _distance=_scrollContain.children(":first").outerWidth();
					
			_scrollContain.css({
				position : "absolute",
				top : "0",
				left : "0",
				"z-index" : 9999
			}).parent().css({
				position : "relative",
				"z-index" : 99
			});

			//上一张
			_prev.bind(opts.mouseType, function () {

				if (_scrollContain.is(":animated")) {
					return;
				} else {
					if ( parseInt($(_scrollContain).css("left")) == 0 ) {
						_prev.addClass(_previousGray);
						return;
					} else {

						gotoAnimatePrevious(_scrollContain, _distance, opts.tweentime);

						_next.hasClass(_nextGray) ? _next.removeClass(_nextGray) : ""; //  移除置灰

						parseInt($(_scrollContain).css("left")) == -_distance ? _prev.addClass(_previousGray) : ""; //  增加置灰	
						

					}
				}
			});

			//下一张
			_next.bind(opts.mouseType, function () {
				if ($(_scrollContain).is(":animated")) {
					return;
				} else {
					if ( -_distance * (_len - 1) == parseInt(_scrollContain.css("left"))) {
						_next.addClass(_nextGray);
						return;
					} else {
						gotoAnimateNext(_scrollContain, _distance, opts.tweentime);
						_prev.hasClass(_previousGray) ? _prev.removeClass(_previousGray) : ""; //  移除置灰
						-_distance * (_len - 2) == parseInt(_scrollContain.css("left")) ? _next.addClass(_nextGray) : ""; //  增加置灰
					}
				};
			});

			//   上一张
			function gotoAnimatePrevious(ele, num, tweentime) {		
				$(ele).animate({
					"left" : parseInt($(ele).css("left")) + num
				}, tweentime, function () {
					if (opts.callback != null) {
						opts.callback();
					}
				});
			};

			//   下一张
			function gotoAnimateNext(ele, num, tweentime) {

				$(ele).animate({
					"left" : parseInt($(ele).css("left")) - num
				}, tweentime, function () {
					if (opts.callback != null) {

						opts.callback();
					}
				});
			};

		});

	}
}
(jQuery, window);