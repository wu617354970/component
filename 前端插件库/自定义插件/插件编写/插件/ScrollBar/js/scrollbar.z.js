//滑块最大 待决

(function (window, undefined) {
	//工具
	var Z = {
		//获取元素
		$ : function (id) {
			return (typeof id == 'string') ? document.getElementById(id) : id;
		},
		//获取元素相对页面左上角距离
		offset : function (elem) {
			var l = 0,
			t = 0;
			do {
				l += elem.offsetLeft || 0;
				t += elem.offsetTop || 0;
			} while ((elem = elem.offsetParent) != null);
			return {
				left : l,
				top : t
			};
		},
		//获取鼠标点击位置相对页面左上角距离 x
		pageX : function (e) {
			e = e || window.event;
			return (e.pageX) ? e.pageX : (e.clientX + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft, 0));
		},
		//获取鼠标点击位置相对页面左上角距离 y
		pageY : function (e) {
			e = e || window.event;
			return (e.pageY) ? e.pageY : (e.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop, 0));
		},
		//注册事件监听
		addEvent : function (elem, type, handler) {
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			} else if (elem.attachEvent) {
				elem.attachEvent('on' + type, handler);
			} else {
				elem['on' + type] = handler;
			}
		},
		//移除事件监听
		removeEvent : function (elem, type, handler) {
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handler, false);
			} else if (elem.detachEvent) {
				elem.detachEvent('on' + type, handler);
			} else {
				elem['on' + type] = null;
			}
		},
		//阻止事件默认行为
		stopDefault : function (e) {
			e = e || window.event;
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return false;
		},
		//阻止事件冒泡
		stopBubble : function (e) {
			e = e || window.event;
			if (e && e.stopPropagation) {
				　 　 e.stopPropagation();
			} else {
				　 e.cancelBubble = true;
			}
		},
		//获取事件目标元素
		getTarget : function (e) {
			e = e || window.event;
			return e.target || e.srcElement;
		},
		//代理绑定事件 将事件目标this转交给事件绑定函数
		bindAsEventListener : function (target, fun, event) {
			return function (event) {
				return fun.call(target, event);
			}
		},
		linear : function (t, b, c, d) {
			return c * t / d + b;
		},
		swing : function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		}
	};
	//检测浏览器 类型 版本
	Z.Browser = (function () {
		var ua = navigator.userAgent.toLowerCase();
		var s = {};
		s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
		s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
		s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
		s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
		s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
		s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
		return s;
	})();
	
	//动画函数
	Z.Tween = function (target, duration, prop, start, end, callback) {
		if (target.timer) {
			clearInterval(target.timer)
		};
		target.timer = setInterval(doMove, 10);
		
		var startTime = new Date().getTime() / 1000;
		function doMove() {
			var time = (new Date().getTime()) / 1000 - startTime;
			if (time >= duration) {
				clearInterval(target.timer);
				target.timer = null;
				if (callback != null) {
					callback();
				}
				
				time = duration;
			}
			var val = Z.linear(time, start, end - start, duration);
			switch (prop) {
			case 'scrollTop':
			case 'scrollLeft':
				target[prop] = parseInt(val);
				break;
			default:
				target.style[prop] = parseInt(val) + 'px';
				break;
			}
		}
	}
	
	//滚动条
	var ScrollBar = function (options) {
		this.initialize.call(this, options);
	}
	//原型添加属性和方法
	ScrollBar.prototype = {
		constructor : ScrollBar,
		initialize : function (options) {
			//整个容器
			this.container = Z.$(options.container);
			
			//内容容器
			this.content = Z.$(options.content);
			//滚动条容器 轨道 滑块
			this.scrollContainer = Z.$(options.scrollContainer);
			this.track = Z.$(options.track);
			this.thumb = Z.$(options.thumb);
			//是否有上下按钮  如果左右按钮不为空  则注册左右按钮事件监听
			if (options.arrowUp != undefined) {
				this.arrowUp = Z.$(options.arrowUp);
				this.arrowDown = Z.$(options.arrowDown);
			}
			
			//初始化变量
			/**方向  步长  最小拖动值  最大拖动值  滑块当前位置  拖动开始记录鼠标点击的位置与滑块左上角的距离差值  滑块外边距值  滑块中间点*/
			this.dir = options.dir || "v";
			this.step = Math.max(Math.min(options.step || 20, 50), 10);
			this.tweenTime = options.tweenTime || 0.2;
			this.minPosition = this.maxPosition = this.position = this.thumbOffset = this.marginOffset = this.thumbMidPos = 0;
			this.isDraging = false;
			
			//如果上下按钮不为空  则注册点击事件
			if (this.arrowUp != null) {
				Z.addEvent(this.arrowUp, 'click', Z.bindAsEventListener(this, this.doLeft));
				Z.addEvent(this.arrowDown, 'click', Z.bindAsEventListener(this, this.doRight));
			}
			
			//注册轨道点击事件  滑块鼠标按下事件
			Z.addEvent(this.track, 'mousedown', Z.bindAsEventListener(this, this.doTrackClick));
			Z.addEvent(this.thumb, 'mousedown', Z.bindAsEventListener(this, this.doThumbStart));
			
			//修正父容器定位模式
			if (this.scrollContainer.style.position != 'relative') {
				this.scrollContainer.style.position = 'relative';
			}
			
			//注册整个容器鼠标滑轮事件
			Z.addEvent(this.container, (Z.Browser.Firefox ? 'DOMMouseScroll' : 'mousewheel'), Z.bindAsEventListener(this, this.doMouseWheel));
			
			//注册鼠标移除容器隐藏滚动条  移入容器显示滚动条
			Z.addEvent(this.container, 'mouseover', Z.bindAsEventListener(this, function () {
			this.scrollContainer.style.display = 'block';
			}));
			Z.addEvent(this.container, 'mouseout', Z.bindAsEventListener(this, function () {
			this.scrollContainer.style.display = 'none';
			}));
			
			//绑定函数 使当前this指向Drag
			this._fMove = Z.bindAsEventListener(this, this.doThumbMove);
			this._fStop = Z.bindAsEventListener(this, this.doThumbStop);
			
			//初始化 限制范围拖动
			this.update();
		},
		//动态添加内容重新调正滚动条
		update : function () {
			//初始化 限制范围拖动
			var offLeft = 0;
			if (this.dir == "h") {
				this.thumb.style.width = Math.max(15, (this.content.offsetWidth / this.content.scrollWidth) * this.track.offsetWidth) + 'px';
				offLeft = (this.arrowUp != null) ? this.arrowUp.offsetWidth : 0;
				this.minPosition = offLeft;
				this.maxPosition = offLeft + this.track.offsetWidth - this.thumb.offsetWidth;
				this.thumb.style.left = offLeft + 'px';
				this.thumbMidPos = (this.thumb.offsetWidth / 2);
			} else {
				this.thumb.style.height = Math.max(15, (this.content.offsetHeight / this.content.scrollHeight) * this.track.offsetHeight) + 'px';
				offLeft = (this.arrowUp != null) ? this.arrowUp.offsetHeight : 0;
				this.minPosition = offLeft;
				this.maxPosition = offLeft + this.track.offsetHeight - this.thumb.offsetHeight;
				this.thumb.style.top = offLeft + 'px';
				this.thumbMidPos = (this.thumb.offsetHeight / 2);
			}
			this.position = this.minPosition;
			this.updateState();
		},
		updateState : function () {
			this.thumb.style.display = (this.minPosition < this.maxPosition) ? 'block' : 'none';
		},
		//向左移动
		doLeft : function () {
			this.setThumbPos(this.position -= this.step);
		},
		//向右移动
		doRight : function () {
			this.setThumbPos(this.position += this.step);
		},
		//滚动条轨道点击监听函数
		doTrackClick : function (e) {
			var pos = (this.dir == "h") ? (Z.pageX(e) - Z.offset(this.scrollContainer).left - this.thumbMidPos) : (Z.pageY(e) - Z.offset(this.scrollContainer).top - this.thumbMidPos);
			this.setThumbPos(pos);
		},
		//鼠标滑轮事件
		doMouseWheel : function (e) {
			if (!this.isDraging) {
				e = e || window.event;
				var t = (e.wheelDelta ? e.wheelDelta : -e.detail) > 0 ? 1 : -1;
				(t > 0) ? this.doLeft() : this.doRight();
				Z.stopDefault(e);
			}
		},
		//设置滑块位置
		setThumbPos : function (pos) {
			this.position = this.getLimitPos(pos);
			
			if (this.dir == "h") {
				Z.Tween(this.thumb, this.tweenTime, 'left', parseInt(this.thumb.style.left), this.position);
			} else {
				Z.Tween(this.thumb, this.tweenTime, 'top', parseInt(this.thumb.style.top), this.position);
			}
			this.setContentPos();
		},
		//设置内容滚动位置
		setContentPos : function () {
			var pos = 0;
			if (this.dir == "h") {
				pos = Math.max(0, (this.content.scrollWidth - this.content.offsetWidth) * ((this.position - this.minPosition) / (this.maxPosition - this.minPosition)));
				Z.Tween(this.content, this.tweenTime, 'scrollLeft', parseInt(this.content['scrollLeft']), pos);
			} else {
				pos = Math.max(0, (this.content.scrollHeight - this.content.offsetHeight) * ((this.position - this.minPosition) / (this.maxPosition - this.minPosition)));
				Z.Tween(this.content, this.tweenTime, 'scrollTop', parseInt(this.content['scrollTop']), pos);
			}
		},
		//获取拖动限制范围
		getLimitPos : function (pos) {
			return Math.max(this.minPosition, Math.min(pos, this.maxPosition));
		},
		//开始拖动滑块
		doThumbStart : function (e) {
			//设置鼠标点击相对于目标元素左上角偏移距离
			this.isDraging = true;
			if (this.dir == "h") {
				this.thumbOffset = Z.pageX(e) - this.thumb.offsetLeft;
				this.marginOffset = parseInt(this.thumb.marginLeft) || 0;
			} else {
				this.thumbOffset = Z.pageY(e) - this.thumb.offsetTop;
				this.marginOffset = parseInt(this.thumb.marginTop) || 0;
			}
			//注册拖动事件监听
			Z.addEvent(document, 'mousemove', this._fMove);
			Z.addEvent(document, 'mouseup', this._fStop);
			if (Z.Browser.IE) {
				Z.addEvent(this.thumb, 'losecapture', this._fStop);
				this.thumb.setCapture();
			} else {
				Z.addEvent(window, 'blur', this._fStop);
				e.preventDefault();
			}
			Z.stopBubble(e);
		},
		//拖动滑块中
		doThumbMove : function (e) {
			//取消拖动中会选择其他内容
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			
			var pos = (this.dir == "h") ? (Z.pageX(e) - this.thumbOffset) : Z.pageY(e) - this.thumbOffset;
			this.position = this.getLimitPos(pos);
			if (this.dir == "h") {
				this.thumb.style.left = this.position - this.marginOffset + 'px';
				this.content.scrollLeft = Math.max(0, (this.content.scrollWidth - this.content.offsetWidth) * ((this.position - this.minPosition) / (this.maxPosition - this.minPosition)));
			} else {
				this.thumb.style.top = this.position - this.marginOffset + 'px';
				this.content.scrollTop = Math.max(0, (this.content.scrollHeight - this.content.offsetHeight) * ((this.position - this.minPosition) / (this.maxPosition - this.minPosition)));
			}
		},
		//停止滑块拖动 移除事件监听
		doThumbStop : function (e) {
			this.isDraging = false;
			Z.removeEvent(document, 'mousemove', this._fMove);
			Z.removeEvent(document, 'mouseup', this._fStop);
			if (Z.Browser.IE) {
				Z.removeEvent(this.thumb, 'losecapture', this._fStop);
				this.thumb.releaseCapture();
			} else {
				Z.removeEvent(window, 'blur', this._fStop);
			}
		}
	};
	
	//添加到YM命名空间下
	if(typeof YM=='undefined'){window.YM={}}YM.addScrollbar=function(options){return new ScrollBar(options)};
		
})(window, undefined);
