/*javascript document*/
/************************************
 *	Version 		14.00.03
 *	Author			wuwg
 *  CreateTime      14.11.13
 *	UpdateTime		14.11.13
 ************************************/
(function ($, window) {

	// 弹窗方法
	$.fn.addTips = function (options) {
		var defalutOpts = {
			popupTipsContain : ".fd_popup_tips", // 获取弹出层对象
			scrollContainId : null, //  滚动容器
			callback : null,
			space : 8,
			showMousetype : "click",
			isHide : false,
			ueserSelfHide : null, // 用户自己隐藏
			addUpClass : null // 弹出层出现在上方，为弹出层容器增加一个className，为了控制样式
			/*********************************************************************************
			ueserSelfHide : function () {
				$(document).bind("click", function (event) {
					var _event = event || window.event;
					var _target = $(_event.target);
					if($(".popup_time_contain").is(":visible")){
						if (_target.hasClass("popup_time_contain") || _target.parents().hasClass("popup_time_contain") || _target.hasClass("btn_wrap_time") || _target.parents().hasClass("btn_wrap_time")) {
							return;
						} else {
							$(".popup_time_contain").hide(); //  隐藏弹出层
						}
					}
				});
			}
		   **********************************************************************************/
		};
		var opts = $.fn.extend({}, defalutOpts, options || {});
		return this.each(function () {
			var _that = $(this);
			// 获取弹出层对象
			var _tipsContain = $(opts.popupTipsContain); //  获取弹出层对象
			_tipsContain.css({
				"position" : "absolute",
				"zIndex" : 99999
			});
			function getCoordinate() {
				var _winH = $(window).height(); //  window 高
				var _winW = $(window).width(); //  window  宽
				var _tipsContainContentHeight = _tipsContain.innerHeight() //  获取弹出层对象内容的高
					var _tipsContainContentWidth = _tipsContain.innerWidth() / 2 //  获取弹出层对象内容的宽的一半
					var _topPos = _that.offset().top + _that.innerHeight(); // 获取当前对象距离页面top距离+自身高度
				var _leftPos = _that.offset().left + _that.innerWidth() / 2; // 获取当前对象距离页面left距离+自身宽度的一半
				//  判断弹出层出现的位置
				//  1.出现在下方方居中
				//  2. 出现的上方居中
				//  当  内容高+对象高大于	window 高那么就应该出现在上方	否则就是在下方显示
				var _flag = _topPos + _tipsContainContentHeight < _winH ? true : false; //  true  代表第一种情况
				//  是否根据弹出层出现的位置增加className
				var _isAddUpClass = opts.addUpClass != null ? true : false;
				if (_isAddUpClass) {
					//  判断用户数是否在class 前面加了 ".",如果加了就跳过".",去后面的值，如果没有"."，那么直接等于opts.addUpClass
					var _addUpClass = opts.addUpClass.substring(0, 1) == "." ? opts.addUpClass.substring(1) : opts.addUpClass;
				}
				if (_flag) {
					_tipsContain.css({ //  设置弹出层对象的距离
						"top" : _topPos + opts.space,
						"left" : _leftPos - _tipsContainContentWidth
					});
					if (_isAddUpClass) {
						if (_tipsContain.hasClass(_addUpClass)) {
							_tipsContain.removeClass(_addUpClass);
						}
					}
				} else {
					_tipsContain.css({ //  设置弹出层对象的距离
						"top" : _topPos - _that.innerHeight() - _tipsContainContentHeight - opts.space,
						"left" : _leftPos - _tipsContainContentWidth
					});
					if (_isAddUpClass) {
						if (!_tipsContain.hasClass(_addUpClass)) {
							_tipsContain.addClass(_addUpClass);
						}
					}
				}
				//alert(_tipsContainContentWidth);
			}
			//  绑定滚动事件和改变窗口大小时间
			$(window).bind("resize scroll", function () {
				if (_tipsContain.is(":visible")) { //  显示才执行下面的函数
					getCoordinate();
				}
			});
			//  绑定滚动容器事件 
			if(opts.scrollContainId!=null){
				$(opts.scrollContainId).bind("scroll", function () {
				if (_tipsContain.is(":visible")) { //  显示才执行下面的函数
						getCoordinate();
					}
				});
			}
			
			// 显示
			_that.bind(opts.showMousetype, function () {
				if (opts.callback != null) { //  为空就不调用
					opts.callback();
				}
				getCoordinate();
				_tipsContain.appendTo($("body")).show();
			});
			//  隐藏
			if (opts.isHide) {
				_that.bind("mouseout", function () {
					_tipsContain.hide();
				});
			};
			// 用户隐藏
			if (opts.ueserSelfHide!= null) {
				opts.ueserSelfHide();
			}
		});
	}
})(jQuery, window);