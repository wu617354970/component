/*javascript*/
/************************
version  		15.1.1
author  		wuwg
createTime      20150701
updateTime      20150703
 ************************/
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
(function () {
	window.DrawWater = function (svgId, options) {
		var _this = this;
		_this.svg = Snap(svgId);
		var defaults = {
			maxCount : 1000,
			currentCount : 600,
			strokeStyle : "#E61773",
			fillStyle : "#E61773",
			defsPath : "M56.855,24.161" +
			"C56.799,11.092,46.623,0.5,33.996,0.5" +
			"c-12.626,0-22.86,10.592-22.86,23.661" +
			"c0,13.383,14.294,33.035,20.257,40.65" +
			"c1.309,1.67,3.828,1.674,5.142,0.008" +
			"C42.53,57.208,56.916,37.547,56.855,24.161",
			clipId1 : "SVGID_1_",
			clipId2 : "SVGID_2_",
			tweeTime : 1500,
		}
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
		//  传进来的数字
		_this.currentCount = _this.opts.currentCount;
		//  当前进度条
		_this.currentProgress = _this.opts.currentCount / _this.opts.maxCount;

	};

	DrawWater.prototype = {
		initial : function () {
			var _this = this;
			//  画水
			_this.drawWater();
		},
		getWave : function () {
			var wave = {
				wave1 : "M30 24" +
				"c-16 4,-31 0,-31 0,l0 66,63 0" +
				"L63,24" +
				"C63 24,48 19.864,31 24z",
				wave2 : "M30,24" +
				"c-16 -4,-31 0,-31 0,l0 66,63 0" +
				"L63,24" +
				"C63 24,48 27.91,30,24z",
				wave4 : "M30," + 70 * num +
				"c-17 -4 ,-31 0, -31 0 ,l0 66 ,63 0" +
				"L63 ," + 70 * num +
				"C63," + 70 * num + ",48 ," + 70 * num + ",30," + 70 * num + "z"
			}
			return wave;
		},
		//定义剪切对象函数
		definitions : function () {
			var _this = this;
			_this.defs = _this.svg.paper.el("path", {
					id : _this.opts.clipId1,
					d : _this.opts.defsPath,
					fill : "none",
					cursor : "pointer"
				}).toDefs();
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

			return _this.clipPath;
		},

		getDynamicPoint : function (num) {
			var wave = {
				wave1 : "M30 ," + 70 * (1 - num) +
				"c-16 4,-31 0,-31 0,l0 66,63 0" +
				"L63," + 70 * (1 - num) +
				"C63 ," + 70 * (1 - num) + ",48 ," + (70 * (1 - num) - 4) + ",31," + 70 * (1 - num) + "z",
				wave2 : "M30," + 70 * (1 - num) +
				"c-17 -4 ,-31 0, -31 0 ,l0 66 ,63 0" +
				"L63 ," + 70 * (1 - num) +
				"C63," + 70 * (1 - num) + ",48 ," + (70 * (1 - num) + 4) + ",30," + 70 * (1 - num) + "z",
				normal : "M30," + 70 * (1 - num) +
				"c-17 -4 ,-31 0, -31 0 ,l0 66 ,63 0" +
				"L63 ," + 70 * (1 - num) +
				"C63," + 70 * (1 - num) + ",48 ," + (70 * (1 - num) + 4) + ",30," + 70 * (1 - num) + "z",
				reset : "M30," + 70 +
				"c-17 -4 ,-31 0, -31 0 ,l0 66 ,63 0" +
				"L63 ," + 70 +
				"C63," + 70 + ",48 ," + 70 + ",30," + 70 + "z"
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
					cursor : "pointer",
					clipPath : "url(#" + _this.opts.clipId2 + ")"
				});
			_this.use2 = _this.svg.paper.el("use", {
					"xlink:href" : "#" + _this.opts.clipId1,
					overflow : "visible",
					fill : "none",
					cursor : "pointer",
					stroke : _this.opts.strokeStyle
				});
			//_this.svg.paper.g(_this.clipPath,_this.animateElement,_this.use2);
			return _this.animateElement;
		},
		drawWrap : function () {
			var _this = this;
			_this.x = _this.svg.paper.el("path", {
					d : _this.opts.defsPath,
					fill : "none",
					stroke : "red"
				});
			var filterDefaults = _this.svg.paper.filter(Snap.filter.shadow(0, 0, 5, "yellow"));
			_this.x.attr({
				filter : filterDefaults,
				cursor : "pointer"
			});
		},
		removeWarp : function () {
			var _this = this;
			_this.x.remove();
		},
		drawWater : function () {
			var _this = this;
			// 剪切对象
			_this.definitions();
			// 剪切路径
			_this.clipPathFunc();
			// 画波浪
			_this.animateElement();
			/* var z=	_this.svg.paper.g(_this.defs,_this.clipPath,_this.animateElement,_this.use2)
			z.use().attr({
			transform:"translate(100,0)"
			}); */
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
			}
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
		update : function (updateCount) {
			var _this = this;
			if (_this.currentCount !== updateCount) {
				_this.currentCount = updateCount;
			}
			_this.currentProgress = _this.currentCount / _this.opts.maxCount;
		}
	};

})();

(function () {
	window.CreateWater = function (svgId, options) {
		var _this = this;
		_this.svg = Snap(svgId);
		var defaults = {
			fillStyle : "#04e0fa", //  填充颜色
			stoke : "#04e0fa", //  边框
			shadowColor : "#04e0fa", //   阴影
			tweeTime : 3000, //  动画缓冲时间
			// 水滴形态
			d : "M45.72,23.661C45.663,10.593,35.487,0,22.86,0C10.234,0,0,10.593,0,23.661" +
			"c0,13.383,14.294,33.036,20.257,40.65c1.308,1.67,3.829,1.675,5.141,0.009C31.394,56.709,45.78,37.05,45.72,23.661z",
			// 数据
			series : [{
					x : 20, //  x坐标
					y : 30, //  y坐标
					dataCount : 50, // 数据量
					title : "湖南" //  归属省份
				}, {
					x : 200, //  x坐标
					y : 300, //  y坐标
					dataCount : 50, // 数据量
					title : "北京" //  归属省份
				}
			],
			callback : null,
			width : 46,
			height : 70,
			viewBox : 1,
			isAnimateAfterRemove : true
		}
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
		};
		// Params
		_this.opts = params;
		// 总共的个数
		_this.series = _this.opts.series;
		_this.initial();
	}
	CreateWater.prototype = {
		initial : function () {
			var _this = this;
			//  画水
			_this.drawWater();
		},
		drawWater : function () {
			var _this = this;

			_this.cloneFunc();
		},
		//  创建动画对象
		createAnimateElement : function (obj, title) {
			var _this = this;
			var svg = Snap(_this.opts.width, _this.opts.height).attr({
					x : Number(obj.x) - 21,
					y : Number(obj.y) - 58,
					viewBox : "0 0 " + _this.opts.width * _this.opts.viewBox + " " + _this.opts.height * _this.opts.viewBox,
					cursor : "pointer"
				});
			// 添加到主svg
			_this.svg.append(svg);
			var water = svg.paper.el("path", {
					d : _this.opts.d, // 路径
					fill : _this.opts.fillStyle,
					stokeWidth : 1,
					stroke : _this.opts.stroke
				});
			var _group = svg.paper.g(water);
			svg.append(_group);
			var m = new Snap.Matrix();
			m.scale(0.1);
			m.translate(195, 560);
			_group.transform(m);
			m.scale(2);
			m.translate(-13, -40);
			_group.animate({
				transform : m
			}, _this.opts.tweeTime, mina.linear, function () {
				if (_this.opts.isAnimateAfterRemove) {
					svg.remove();
				}

			});
			_this.opts.callback(title);
			_group.hover(function () {
				drawShadow();
			}, function () {
				shadow.remove();
			});
			var shadow = null;
			function drawShadow() {
				var filterDefaults = svg.paper.filter(Snap.filter.shadow(0, 0, 5, "#04e0fa"));
				shadow = _this.svg.paper.el("path", {
						d : _this.opts.d,
						stroke : "#000",
						fill : _this.opts.fillStyle,
						strokeWidth : 0,
						cursor : "pointer",
						filter : filterDefaults
					});
				// 追加水滴元素的前面作为它的背景
				water.before(shadow);
			}
		},
		cloneFunc : function () {
			var _this = this;
			//  循环所有的坐标点
			for (var i = 0; i < _this.series.length; i++) {
				var title = _this.series[i].title;
				var dataCount = _this.series[i].dataCount;
				if (dataCount == 0) {
					continue;
				}
				_this.createAnimateElement(_this.series[i], title)
			};
		},
		update : function (series) {
			var _this = this;
			_this.series = series;
			_this.cloneFunc();
		}

	};

})();