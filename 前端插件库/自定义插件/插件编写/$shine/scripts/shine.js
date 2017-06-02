/*************************
*vertion 		 2015.0.1
*author    		 wuwg
*createTime      20150618
*updataTime		 20150618
****************************/
$(function () {
	//  判断浏览器是否支持   requestAnimationFrame
	(function () {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}
		// 不支持window.requestAnimationFrame()动画,采用 setTimeout()模拟
		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function (callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function () {
						callback(currTime + timeToCall);
					}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		// 不支持取消动画采用 clearTimeout();
		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function (id) {
				clearTimeout(id);
			};
	})();
	$.fn.addShine = function (options) {
		var defaultOptions = {
			totalCount : 1000, 		// 总数 ,必须
			tweetime:1000, 			//  缓动时间
			progresssBar : ".fd_progresss_bar",  // 进度条容器
			shine : ".fd_shine",				// 光容器
			getCount : ".fd_get_count",			// 获得数的容器
			getAddCount : ".fd_add_count",		// 获得增加数的容器
			callBack : null						//  回调函数
		}
		return this.each(function () {
			var opts = $.fn.extend({}, defaultOptions, {
				totalCount :  $(this).find(".fd_progresss_bar").data('totalCount'), // 总数
				currentCount : $(this).find(".fd_progresss_bar").data('currentCount'), //  当前数
				updateCount : $(this).find(".fd_progresss_bar").data('updateCount'), //  更新后的数
			}, options || {});
			
			var _this = this, //  原生对象 this
			_that = $(this), //  jQ对象
			_dataElement = _that.find(opts.progresssBar), 		 //数据储存对象
			_shine = _that.find(opts.shine),				     //光效
			_getCount = _that.find(opts.getCount), 			 	 //获得数的对象
			_getAddCount = _that.find(opts.getAddCount), 		 //新增数对象
			_totalCount = opts.totalCount,						 // 总数
			_currentCount = opts.currentCount, 					 // 当前数
			_updateCount = opts.updateCount,					 // 更新后的数
			_addCount = 0,										 //  增加的数	
			_percentCurrent=0  									 // 当前的进度条位置
			_percent=0;											 // 更新数后的进度条位置
			_getAddCount.css({
				position:"relative",
				"z-index":2,
				top:0
			});
			
			
			// 循环函数
			function animloop() {
				_this.animId = window.requestAnimationFrame(animloop); //无限执行动画''
				//  点击后 flag=true;
				render()
			}
			//  停止动画
			function stopAnimate() {
				window.cancelAnimationFrame(_this.animId);
			}
			// 初始化函数
			function initial(){
				_percentCurrent = _currentCount / _totalCount * 100; // 当前的进度条位置
				_dataElement.animate({
					width : _percentCurrent + "%"
				},opts.tweetime,"easeInCirc",function(){
					_getCount.text(_currentCount);	  // 赋值 当前数
					_getAddCount.text("").css({top:"50px"});						
					//  执行循环函数
					animloop();
				}); // 注意，这里如果引入jQuery.Easing.v1.3.js插件的话,这个效果参数必须写
	
			};
			
			// 渲染函数
			function render() {
				updateCount = _dataElement.data('updateCount'); 		 //  检测更新数
				if (updateCount == _currentCount) {  					 //  没更新数据直接返回
					return;
				} else {
					_addCount = updateCount - _currentCount; 			 // 增加的数	
					_percentCurrent = _currentCount / _totalCount * 100; // 当前的进度条位置
					_currentCount = updateCount; 						 //  当前数重新赋值（等于更新后的数）
					_percent = Math.min(100, _currentCount / _totalCount * 100) + "%";	 // 更新数后的进度条位置
					_shine.show().animate(								//  光效动画	
						{
							left : _percent
						},
						{
							step : function (now, fx) { 
								if (now > _percentCurrent) {
									_dataElement.css({
										width : now + "%"
									});
								}
							},
							duration : opts.tweetime,
							specialEasing : {
								left : "easeInCirc"  //  注意，这里如果引入jQuery.Easing.v1.3.js插件的话，只能用对象，不能直接写字符串，如：specialEasing："easeInCirc"
							},
							complete : function () {
								_shine.hide().css({
									left : 0
								});
								_getCount.text(_currentCount);	  // 赋值 当前数
								_getAddCount.text("+" + _addCount).animate({
									top:"0px"
								},opts.tweetime/2,"easeInQuad").delay(opts.tweetime/2).animate({
									top:"-50px"
								},opts.tweetime/2,"easeInQuad",function(){
									_getAddCount.text("").css({top:"50px"});	
								});// 赋值 增量
								//每次完成后的回调函数
								if(opts.callBack!==null&& typeof opts.callBack=="function"){
									opts.callBack();
								}
							},
							fail : function () {},
							always : function () {}
					});
				}
			};
			// 执行初始化函数
			initial();
		});
	}
});