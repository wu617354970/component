/*javascript*/
/************************
version  		20150625
author  		wuwg
createTime      20150625
updateTime      20150625
************************/

(function () {
	window.DrawWater = function (svgId,options) {
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
		_this.currentCount=_this.opts.currentCount;
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
					fill : "none"
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
			_this.clipPath.append(use)
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
					clipPath : "url(#" + _this.opts.clipId2 + ")"
				});
			use2 = _this.svg.paper.el("use", {
					"xlink:href" : "#" + _this.opts.clipId1,
					overflow : "visible",
					fill : "none",
					stroke : _this.opts.strokeStyle
				});
			//_this.svg.paper.g(_this.clipPath,_this.animateElement,_this.use2);
			return _this.animateElement;
		},
		drawWater : function () {
			var _this = this;
			// 剪切对象
			_this.definitions();
			// 剪切路径
			_this.clipPathFunc();
			// 画波浪
			_this.animateElement();
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
			var  _this=this;
			_this.stopAimate();
			_this.animateElement.animate({
					path : _this.getDynamicPoint().reset
			},_this.opts.tweeTime, mina.linear)			
		},
		update : function (updateCount) {
			var  _this=this;
			if( _this.currentCount!==updateCount){
				 _this.currentCount=updateCount;	 
			}
			_this.currentProgress = _this.currentCount / _this.opts.maxCount;	
		}
	};

})();

var snap = new DrawWater("#snap",{
	maxCount : 1000,
	currentCount : 600,
	strokeStyle : "gray",
	fillStyle : "gray",
});
snap.initial();
var snap2 = new DrawWater("#snap2",{
	maxCount : 1000,
	currentCount : 400,
	strokeStyle : "#00fcbe",
	fillStyle : "#00fcbe",
});
snap2.initial();
snap2.startAnimate();
/**动态传数**/
var current =400;
setInterval(function(){
	current+=50;
	if(current>=1000){
		current=1000;	
	}
	//snap.update(current); /*test  update  data */
},1000)
