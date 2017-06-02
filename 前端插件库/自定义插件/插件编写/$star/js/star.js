/*javascript document*/
/************************************
 *	Version 		14.00.01
 *	Author			wuwg
 *  CreateTime      14.12.03
 *	UpdateTime		14.12.03
 ************************************/
+function($, window) {
	/*********************************************************************************************************************************************
	 *	方法名：						addStar()		
	 *	使用范例 ： 				    $("#accordion").addStar({});		
	 *	mouseType						事件类型
	 *	starWidth						星宽度
	 *	starHeight						星高度
	 *	starSize						星的个数
	 *	getScore						满分
	 *	url								星的路径
	 *	starFont						获取值容器的字体样式
	 *	backgroundColor					选中后星的背景色
	 *	decimal							评分后面保留的小数位数
	 *	isSetValue						是否可以手动输入值	//  默认false
	 *	isHideDefaultGetValue			是否隐藏默认获取值的容器
	 *	type:1,  						数值为1,2,3,1代表点一下一个星星，2代表可以取一半的星星，3任意数值
	 *	connectInput					关联设置值的容器类名	//  最好隐藏默认输入值的容器 isSetValue：false  即可
	 *	callback						回调函数，function(num){};  num会获得评分值
	***************************************************************************************************************************************************/
	$.fn.addStar = function (options) {
		var defaultOptions = {
			mouseType : "click",
			starWidth : 30,
			starHeight : 30,
			starSize : 9,
			getScore : 10,
			url : "images/star.png",
			starFont : "14px/30px 'Microsoft YaHei'",
			defaultDackgroundColor:"#c9ccd0",
			backgroundColor : "red",
			type:1,  
			decimal : 2, //  保留小数位数
			isSetValue : false,
			isHideDefaultGetValue : false,
			connectInput : "",
			callback : null
		}
		var opts = $.fn.extend({}, defaultOptions, options || {});
		return this.each(function () {
			var _that = $(this);
			var cssClass = {
				starConatin : "fd_star_contain",
				starProgress : "fd_star_progress",
				stardeFaultProgress : "fd_star_default_progress",
				starShow : "fd_star_show",
				starGetValueContain : "fd_star_get",
				starSet : "fd_star_set"
			}
			//  创建dom
			var starDom = $("<div class=" + cssClass.starConatin + ">"
					 + "<div class=" + cssClass.starProgress + "></div>"
					 + "<div class=" + cssClass.stardeFaultProgress + "></div>"
					 + "<div class=" + cssClass.starShow + "></div>"
					 + "</div>"
					 + "<span class=" + cssClass.starGetValueContain + ">0.00</span>");
			//  追加到当前div中
			_that.prepend(starDom);

			//  星容器
			_that.find(".fd_star_contain").css({
				"position" : "relative",
				"z-index" : "99",
				"display" : "inline-block",
				"margin" : "0 10px 0 5px",
				"width" : opts.starWidth * opts.starSize + "px",
				"height" : opts.starHeight + "px",
				"overflow" : "hidden",
				"vertical-align" : "middle"
			});
			//  星
			_that.find(".fd_star_show").css({
				"position" : "absolute",
				"top" : "0",
				"left" : "0",
				"z-index" : "999",
				"width" : "100%",
				"height" : "100%",
				"background" : "url(" + opts.url + ")  0 0 repeat-x"
			});
			//  默认进度
			_that.find(".fd_star_default_progress").css({
				"position" : "absolute",
				"top" : "0",
				"left" : "0",
				"z-index":"9",
				"width":"100%",
				"height" : "100%",
				"background-color" : opts.defaultDackgroundColor
			});
			//  进度
			_that.find(".fd_star_progress").css({
				"position":"relative",
				"z-index":"99",
				"float" : "left",
				"width" : "0",
				"height" : "100%",
				"background-color" : opts.backgroundColor
			});
			//  字体
			_that.find(".fd_star_get").css({
				"display" : "inline-block",
				"vertical-align" : "middle",
				"height" : opts.starHeight + "px",
				"font" : opts.starFont
			});

			var _starWrap = _that.find("." + cssClass.starConatin);
			var _starProgress = _that.find("." + cssClass.starProgress);
			var _triggerElement = _that.find("." + cssClass.starShow);
			var _getValueConatin = _that.find("." + cssClass.starGetValueContain);
			var _offsetLeft = _starWrap.offset().left;
			var _getValue = null;
			var _currentWidth;
			var _connect = _that.find(opts.connectInput);
			var _flag = true;
			//  是否隐藏默认获得值的容器
			if (opts.isHideDefaultGetValue) {
				_getValueConatin.remove();
				_flag = false;
			};
			_triggerElement.bind(opts.mouseType, function (event) {
				var _event = event || window.event;
				var _currentLeft = _event.pageX;
				_currentWidth = _currentLeft - _offsetLeft;
				var   _num,_residue;  //  声明变量余数和星的个数
				
				
				
				
				if(opts.type==1){
					   _num= Math.ceil(_currentWidth/opts.starWidth); // 向上取整	
					    //  进度条
					   _starProgress.width(_num*opts.starWidth);
				}else if(opts.type==2){
						_num= Math.floor(_currentWidth/opts.starWidth);	// 向下取整
						_residue= _currentWidth%opts.starWidth;  //  余数
					if(_residue>opts.starWidth/2){
						 _num++	;
						_starProgress.width(_num*opts.starWidth);
					}else {
						_starProgress.width(_num*opts.starWidth+opts.starWidth/2);	
					}					
				}else {
					
					//  进度条
					_starProgress.width(_currentWidth);
				}
				
				
			
				
				console.log(_index)
				console.log(residue)
				
				//  当前分数
				_getValue = _currentWidth / _starWrap.width() * opts.getScore;
				//  转化为保留的小数
				_getValue = _getValue.toFixed(opts.decimal);
				//  赋值给容器
				if (_flag) {
					_getValueConatin.text(_getValue)
				};
				if (opts.callback != null) {
					opts.callback(_getValue)
				}
			});
			function connectFuncion(ele) {
				$(ele).bind(" propertychange  input", function () {
					var _value = $(this).val();
					//  判断是否是一个数字
					if (String(Number(_value)).toUpperCase() == "NAN") {
						$(this).val("");
					} else {
						//  如果是数字的话,转型为number比较大小，，判断是否大于最大值 , 如果输出的数字大于，最大得分，那么取后面一位数
						if (Number(_value) > opts.getScore) {
							// 如果取后面一位数后,转型为number与最大值比较大小，如果还是大于那么直接等于最大值
							_value = Math.min(Number(_value.substring(1)), opts.getScore);
							$(this).val(_value);
						}
					};
					//  当前分数
					_getValue = Number($(this).val()).toFixed(opts.decimal);
					//  进度条的宽度
					_currentWidth = _getValue / opts.getScore * _starWrap.width(); //  分数/ 最大的分数的*宽度=进度条的宽度
					//  进度条
					_starProgress.width(_currentWidth);
					//获取值
					if (_flag) {
						_getValueConatin.text(_getValue)
					};
					if (opts.callback != null) {
						opts.callback(_getValue)
					};
				});
			}
			if (opts.isSetValue) {
				_starWrap.after($("<input   type='text'  class='" + cssClass.starSet + "'/>"));
				_that.find(".fd_star_set").css({
					"margin" : "0 10px",
					"width" : "30px",
					"height" : opts.starHeight - 2 + "px",
					"border" : "1px solid #ddd",
					"font" : opts.starFont,
					"vertical-align" : "middle"
				});
				var _setStar = _that.find("." + cssClass.starSet);
				connectFuncion(_setStar);
			}
			if (_connect.length > 0) {
				connectFuncion(_connect);
			};
		});
	}
}
(jQuery, window)