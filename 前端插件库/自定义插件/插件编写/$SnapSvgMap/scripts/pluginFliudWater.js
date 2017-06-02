/*javascript*/
/************************
version  		15.1.2
author  		wuwg
createTime      20150703
updateTime      20150716
 ************************/
// 判断浏览器是否支持   requestAnimationFrame
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
(function () {
	// 要追加到的父元素id ，生成对象的id， 传入的新参数
	window.DrawFluidWater = function (parentElemntId, options) {
		if (typeof parentElemntId != "string") {
			alert("必须指定父元素(svg对象)id!");
			return;
		}
		var _this = this;
		var _parent = Snap(parentElemntId);

		//  默认参数
		var defaults = {
			id : "",
			maxCount : 1000, //  容器最大的数
			currentCount : 600, //  当前的数
			strokeStyle : "#00b6f9", // 水边框颜色
			fillStyle : "#f0ff00", //  水的填充颜色
			//  遮盖物
			overlayPath : "M61.828,8.947c8.837,4.295,14.929,13.359,14.929,23.847c0,14.632-11.862,26.499-26.497,26.499" +
			"S23.762,47.426,23.762,32.794c0-11.099,6.824-20.604,16.504-24.551l0.5-0.201c0.153-0.054,0.373-0.134,0.373-0.134" +
			"c2.236-0.968,2.512-3.121,2.058-4.255c-0.461-1.155-1.732-2.057-3.919-1.649l-0.573,0.173c-12.331,4.665-21.1,16.583-21.1,30.552" +
			"c0,18.031,14.619,32.654,32.654,32.654c18.03,0,32.653-14.623,32.653-32.654c0-12.707-7.254-23.715-17.851-29.115l-0.735-0.341" +
			"c0,0-2.616-1.224-4.042,1.06c-1.086,1.742-0.113,3.677,1.076,4.397C61.362,8.73,61.733,8.903,61.828,8.947z",
			// 剪切路径的id
			clipId1 : "SVGID_1_",
			clipId2 : "SVGID_2_",
			tweeTime : 1500, //  水晃动缓动时间
			dropWaterTime : 3000, //  水滴下落时间
			OverLayFill : "#00b6f9", //  遮盖物的颜色
			shadowColor : "#00b6f9", //  鼠标划过的阴影色
			x : 10, //  对象出现在svg上的x轴位置
			y : 10, //  对象出现在svg上的y轴位置
			cursor : "pointer", //  对象划过时候的手型
			scale : 0.2, //  scale  不能大于1 ,否则视窗不可见
			width : 125, //  对象的宽
			height : 90, //  对象的高
			viewBox : 1, //  视窗
			backgroundColor : "gray", //  背景色，此背景色和svg地图背景色一样，这样可以放在svg空心时选不中
			emptyDataCircleStroke : "#ecd735", // 未链接圆的边框线
			emptyDataCircleFill : "#ed5d1a", //  未链接圆的背景色
			isAnimate : true, //  是否执行动画  液体晃动
			isShowShadow : true, //  划过是否显示阴影
			isDropWater : true, //  是否往下滴水
			isShowConsole : false, //  是否放出更新的日志
			callback : null //  点击执行的回调函数
		};
		//  参数合并
		params = options || {};
		for (var def in defaults) {
			if (typeof params[def] === 'undefined') {
				params[def] = defaults[def];
			} else if (typeof params[def] === 'object') {
				for (var deepDef in defaults[def]) {
					if (typeof params[def][deepDef] === 'undefined') {
						params[def][deepDef] = defaults[def][deepDef];
					}
				}
			}
		}
		// Params
		_this.opts = params;

		_this.svg = Snap(90, 125).attr({
				//viewBox : "0 0 " + _this.opts.width * _this.opts.viewBox + " " + _this.opts.height * _this.opts.viewBox,
				//style : "background:red"
			})
			// 赋值id
			_this.svg.attr({
				id : _this.opts.id
			});
		// 追加到svg后面
		_parent.append(_this.svg);

		//  传进来的数字
		_this.currentCount = _this.opts.currentCount;
		//  当前进度条
		_this.currentProgress = _this.opts.currentCount / _this.opts.maxCount;

		// 定义水滴动画指针
		_this.isFlag = false;
		// 定义是否显示阴影
		_this.isShowShadow = _this.opts.isShowShadow;

		// 是否是空数据
		_this.isEmptyData = false;
		// 初始化对象
		_this.initial();

	};

	DrawFluidWater.prototype = {
		initial : function () {
			var _this = this;
			// 定位svg的位置
			_this.svg.attr({
				x : _this.opts.x - 50,
				y : _this.opts.y - 45
			});
			// 绑定点击事件
			_this.bindClick();
			//  画水
			_this.drawWater();
		},
		bindClick : function () {
			var _this = this;
			_this.svg.attr({
				cursor : "pointer"
			}).click(function () {
				if (_this.opts.callback != null && typeof _this.opts.callback == "function") {
					_this.opts.callback();
				}
			});
		},
		unbindClick : function () {
			var _this = this;
			_this.svg.attr({
				cursor : "default"
			}).unclick();
		},
		//定义剪切对象函数
		definitions : function () {
			var _this = this;
			_this.defsElement = _this.svg.paper.el("circle", {
					cx : 49.588,
					cy : 33.056,
					r : 29.402,
					strokeWidth : 6,
					stroke : "none",
					fill : "none",
					id : _this.opts.clipId1
				}); //.toDefs();
			_this.defs = _this.svg.select("defs");
			_this.defs.append(_this.defsElement);
			//追加到父元素后面
			_this.svg.append(_this.defs);
			return _this.defs;
		},
		//定义剪切路径函数
		clipPathFunc : function () {
			var _this = this;
			_this.clipPath = _this.svg.paper.el("clipPath", {
					id : _this.opts.clipId2
				});
			var use = _this.svg.paper.el("use", {
					"xlink:href" : "#" + _this.opts.clipId1,
					overflow : "visible"
				});
			_this.clipPath.append(use);
			// 追加到父元素后面
			_this.svg.append(_this.clipPath)
			return _this.clipPath;
		},
		drawSlideWater : function () {
			var _this = this;
			//  水的路径
			if (!_this.isFlag) {
				_this.isFlag = true;
				_this.slideWaterPath = {
					pathMin : "M51.847 -2.521," +
					"c-0.003 0.548 ,-0.43 0.992 ,-0.958 0.992," +
					"c-0.529 0 ,-0.958 -0.444 ,-0.958 -0.992 ," +
					"c0 -0.561 ,0.917  -1.756 ,0.957 -1.756," +
					"S51.849 -3.083,51.847 -2.521z",
					pathMax : "M56.103 5.243," +
					"c-0.016 2.977 ,-2.335 5.389 ,-5.206 5.389 ," +
					"c-2.876 0 ,-5.208 -2.412 ,-5.208 -5.389," +
					"c0  -3.046 ,4.981 -9.544 ,5.198 -9.544," +
					"C51.104 -4.301,56.114 2.194,56.103 5.243z",
					pathSlide : "M56.18,53.732c-0.016,2.977-2.335,5.389-5.206,5.389c-2.876,0-5.208-2.412-5.208-5.389" +
					"c0-3.046,4.981-9.544,5.198-9.544C51.181,44.188,56.191,50.684,56.18,53.732"
				};

				_this.slideWater = _this.svg.el("path", {
						d : _this.slideWaterPath.pathMin,
						fill : _this.opts.fillStyle
					});
				//追加到父元素后面
				_this.g.append(_this.slideWater);
				// 执行动画

				_this.slideWater.animate({
					path : _this.slideWaterPath.pathMax
				}, _this.opts.dropWaterTime, mina.easeinout, function () {
					_this.slideWater.animate({
						path : _this.slideWaterPath.pathSlide
					}, _this.opts.dropWaterTime / 4, mina.easeout, function () {
						_this.slideWater.remove();
						_this.isFlag = false;
					});
				});
				return _this.slideWater;
			}
		},
		drawOverLay : function () {
			var _this = this;
			_this.drawOverLay = _this.svg.el("path", {
					d : _this.opts.overlayPath,
					stroke : "#000",
					fill : _this.opts.OverLayFill,
					strokeWidth : 0
				});
			_this.svg.append(_this.drawOverLay);
			return _this.drawOverLay
		},
		getDynamicPoint : function (num) {
			var wave = {
				wave1 : "M7.748," + (72.531 + 44 * (1 - num)) + ",l92.404 -0.624," + //  最大值
				"c0 0 ,-4.326 -54.628,-6.076 -68.824," +
				"C69.242," + (16.922 + 44 * (1 - num)) + ",61.576," + (23.42 + 44 * (1 - num)) + ",49.82," + (19.04 + 44 * (1 - num)) + "," +
				"c-9.743 -3.956 ,-18.743 -17.292 ,-41.42 3.279," +
				"C0.878," + (37.78 + 44 * (1 - num)) + ",7.748," + (72.531 + 44 * (1 - num)) + ",7.748," + (72.531 + 44 * (1 - num)) + "z",
				wave2 : "M7.748," + (70.531 + 44 * (1 - num)) + ",l92.404 -0.624" +
				"c0 0,-5.993 -26.63,-7.743 -40.825," +
				"C74.441," + (9.171 + 44 * (1 - num)) + ",61.243," + (8.083 + 44 * (1 - num)) + ",51.826 ," + (12.333 + 44 * (1 - num)) + "," +
				"c-6.958 2.583,-18.25 21.583,-45.917 -14.75," +
				"C-1.612," + (13.044 + 44 * (1 - num)) + ",7.748," + (70.531 + 44 * (1 - num)) + ",7.748 ," + (70.531 + 44 * (1 - num)) + "z",
				normal : "M7.748," + (72.531 + 44 * (1 - num)) + ",l92.404 -0.624," + //  初始化的值
				"c0 0 ,-4.326 -54.628,-6.076 -68.824," +
				"C69.242," + (16.922 + 44 * (1 - num)) + ",61.576," + (23.42 + 44 * (1 - num)) + ",49.82," + (19.04 + 44 * (1 - num)) + "," +
				"c-9.743 -3.956 ,-18.743 -17.292 ,-41.42 3.279," +
				"C0.878," + (37.78 + 44 * (1 - num)) + ",7.748," + (72.531 + 44 * (1 - num)) + ",7.748," + (72.531 + 44 * (1 - num)) + "z",
				reset : "M7.748 116.531 ,l92.404 -0.624," + //  最小值
				"c0 0 ,-4.326 -54.628, -6.076 -68.824," +
				"C69.242 60.922,61.576 67.42,49.82 63.04," +
				"c-9.743 -3.956,-18.743 -17.292,-41.42 3.279," +
				"C0.878 81.78,7.748 116.531,7.748 116.531z",
			}
			return wave;
		},
		// 动画执行者
		animateElement : function () {
			var _this = this;
			_this.animateElement = _this.svg.paper.el("path", {
					d : _this.getDynamicPoint(_this.currentProgress).normal,
					id : _this.opts.clipId1,
					fill : _this.opts.fillStyle,
					stroke : _this.opts.strokeStyle,
					strokeWidth : 0,
					clipPath : "url(#" + _this.opts.clipId2 + ")"
				});
			_this.svg.append(_this.animateElement);
			return _this.animateElement;
		},
		drawShadow : function () {
			var _this = this;
			_this.overlayPath = _this.svg.paper.el("path", {
					d : _this.opts.overlayPath,
					stroke : "#000",
					fill : _this.opts.OverLayFill,
					strokeWidth : 0
				});
			var filterDefaults = _this.svg.paper.filter(Snap.filter.shadow(0, 0, 5, _this.opts.shadowColor));
			_this.overlayPath.attr({
				cursor : "pointer",
				filter : filterDefaults
			});
			// 追加到当前元素的后面
			_this.svg.append(_this.overlayPath);
			_this.g.append(_this.overlayPath);
		},
		removeShadow : function () {
			var _this = this;
			_this.overlayPath.remove();
		},
		bindHover : function () {
			var _this = this;
			//画阴影
			_this.svg.hover(function () {
				_this.drawShadow();
			}, function () {
				_this.removeShadow();
			});
		},
		unbindHover : function () {
			var _this = this;
			_this.svg.unhover();
		},
		drawBackground : function () {
			var _this = this;
			_this.background = _this.svg.paper.el("circle", {
					cx : 49.588,
					cy : 33.056,
					r : 29.402,
					strokeWidth : 6,
					stroke : _this.opts.backgroundColor,
					fill : _this.opts.backgroundColor,
					id : _this.opts.clipId1
				});
		},
		drawWater : function () {
			var _this = this;
			// 画背景
			_this.drawBackground()
			// 剪切对象
			_this.definitions();
			// 剪切路径
			_this.clipPathFunc();
			// 画波浪
			_this.animateElement();
			//  画遮盖物
			_this.drawOverLay();
			//  组合对象
			_this.groupElement(); // 完成所有对象
			//是否显示阴影
			if (_this.isShowShadow) {
				//绑定划过事件，显示隐藏阴影
				_this.bindHover();
			}
			//  是否执行液体晃动动画
			if (_this.opts.isAnimate) {
				_this.startAnimate();
			}

			// 如果是未链接状态，那么执行下面的方法
			if (_this.currentProgress == 0) {
				//  画没有数据的圆
				_this.drawEmptyDataCircle();
				// 当前是未连接状态
				_this.isEmptyData = true;
			} else {
				//是否执行水往下滴动画
				if (_this.opts.isDropWater) {
					_this.drawSlideWater();
				}
			}
		},
		groupElement : function () {
			var _this = this;
			_this.g = _this.svg.paper
				.g(_this.background, _this.defs, _this.clipPath, _this.animateElement, _this.drawOverLay)
				.attr({
					transform : "translate(0,10) sacle(" + _this.opts.scale + ")"
				});
			//  追加到父元素后面
			_this.svg.append(_this.g);
			return _this.g;
		},
		//  开始动画
		startAnimate : function () {
			var _this = this;
			//动画
			_this.anim1 = function () {
				_this.animateElement.animate({
					path : _this.getDynamicPoint(_this.currentProgress).wave1
				},
					_this.opts.tweeTime, mina.linear, function () {
					_this.anim2();
				});
			};
			_this.anim2 = function () {
				_this.animateElement.animate({
					path : _this.getDynamicPoint(_this.currentProgress).wave2
				},
					_this.opts.tweeTime, mina.linear, function () {
					_this.anim1();
				});
			}
			_this.anim1();
		},
		stopAimate : function () {
			var _this = this;
			_this.animateElement.stop();
		},
		reset : function () {
			var _this = this;
			_this.stopAimate();
			_this.animateElement.animate({
				path : _this.getDynamicPoint().reset
			}, _this.opts.tweeTime, mina.linear)
		},
		update : function (updateCount) { //updateCount      0----1之间的小数
			var _this = this;
			if (_this.opts.isShowConsole) {
				if (updateCount == 0) {
					console.log("未连接状态：" + updateCount);
				} else if (updateCount <= 1) {
					console.log("现在进度是" + updateCount * 100 + "%");
				} else {
					throw new Error("updateCount的值必须取值在0到1之间的小数,当前的值是" + updateCount);
				}
			};
			if (!!updateCount && typeof updateCount == "number" && _this.currentProgress !== updateCount) {
				//  先判断是否是未链接状态
				if (_this.isEmptyData) {
					// 变成链接状态
					_this.isEmptyData = false;
					// 移除未连接状态
					_this.removeEmptyDataCircle();
				}
				if (updateCount > 1) {
					// 百分之百的时候容器就满了，不再执行下滑函数
					_this.currentProgress = 1;
				} else {
					// 更新当前进度
					_this.currentProgress = updateCount;
					// 画下落的的水滴
					_this.drawSlideWater();
				}
			} else if (updateCount == 0) {
				// updateCount===0  表示未连接状态
				if (_this.isEmptyData) {
					// 已经存在未连接状态那么直接返回
					return;
				} else {
					// 不存在未连接状态那么画空心圆，未连接状态指针变成 true
					_this.drawEmptyDataCircle();
					_this.isEmptyData = true;
				}
			}
		},
		//空数据
		drawEmptyDataCircle : function () {
			var _this = this;
			_this.emptyDataCircle = _this.svg.paper.el("circle", {
					cx : 49.588,
					cy : 33.056,
					r : 32,
					strokeWidth : 6,
					stroke : _this.opts.emptyDataCircleStroke,
					fill : _this.opts.emptyDataCircleFill
				});
			//  追加到g元素里
			_this.g.append(_this.emptyDataCircle);
			// 移除svg-hover事件
			_this.unbindHover();
			//  移除晃动动画
			_this.stopAimate();
			//  移除点击事件
			_this.unbindClick();
			return _this.emptyDataCircle;
		},
		removeEmptyDataCircle : function () {
			var _this = this;
			// 移除未链接数据
			_this.emptyDataCircle.remove();
			// 增加svg-hover事件
			_this.bindHover();
			// 增加晃动动画
			_this.startAnimate();
			// 增加点击事件
			_this.bindClick();
		},
		destroy : function () {
			var _this = this;
			_this.svg.remove();
		}
	};
})();