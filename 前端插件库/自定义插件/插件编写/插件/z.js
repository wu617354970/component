//==========================工具===============================
(function (window, undefined) {
	
	var _doc = document,
	_win = window;
	
	var Z = {
		//获取元素
		$ : function (id) {
			return (typeof id == 'string') ? document.getElementById(id) : id;
		},
		//获取元素实际宽度 高度
		width : function (elem) {
			return elem.offsetWidth || (elem.style.width ? parseInt(elem.style.width.replace("px", "")) : 0);
		},
		height : function (elem) {
			return elem.offsetHeight || (elem.style.height ? parseInt(elem.style.height.replace("px", "")) : 0);
		},
		//获取元素相对页面左上角的距离 left top
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
		//显示元素
		show : function (elem) {
			elem.style.display = 'block';
		},
		//隐藏元素
		hide : function (elem) {
			elem.style.display = 'none';
		},
		append : function (p, elem) {
			p = p || document.body;
			p.appendChild(elem);
		},
		//设置获取一个值 改值表示元素html内容
		html : function (elem, val) {
			if (val == 'undefined') {
				return elem.innerHTML;
			} else {
				elem.innerHTML = val;
			}
		},
		//获取数组长度
		size : function (elem) {
			if (elem.length) {
				return elem.length;
			}
		},
		//获取视口宽度和高度
		windowWidth : function () {
			return Math.max(0, document.documentElement.clientWidth, document.body.clientWidth);
		},
		windowHeight : function () {
			return Math.max(0, document.documentElement.clientHeight, document.body.clientHeight);
		},
		//获取页面总的宽度和高度
		pageWidth : function () {
			return Math.max(0, document.documentElement.scrollWidth, document.body.scrollWidth);
		},
		pageHeight : function () {
			return Math.max(0, document.documentElement.scrollHeight, document.body.scrollHeight);
		},
		//获取鼠标位置距离整个页面左上角的位置X Y
		pageX : function (e) {
			e = e || window.event;
			return (e.pageX) ? e.pageX : (e.clientX + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft, 0));
		},
		pageY : function (e) {
			e = e || window.event;
			return (e.pageY) ? e.pageY : (e.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop, 0));
		},
		scrollLeft : function(elem){
			return Math.max(elem.scrollLeft,0);
		},
		scrollTop : function(elem){
			return Math.max(elem.scrollTop,0);
		}
		//获取鼠标位置距离页面左上角的位置  不计算滚动条的距离 X Y
		clientX : function (e) {
			e = e || window.event;
			return e.clientX;
		},
		clientY : function (e) {
			e = e || window.event;
			return e.clientY;
		},
		//event
		//添加事件监听
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
		//代理事件监听
		delegateEvent : function (target, fun, event) {
			return function () {
				return fun.call(target, event || window.event);
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
			return false;
		},
		//获取事件目标元素
		target : function (e) {
			e = e || window.event;
			return e.target || e.srcElement;
		},
		//extend
		//合并两个对象中的属性
		extend : function (destination, source) {
			for (var property in source) {
				if (destination.hasOwnProperty(property)) {
					destination[property] = source[property];
				}
			}
			return destination;
		},
		//遍历数组或者Object对象
		each : function (obj, callback) {
			if (obj.length) {
				for (var i = 0, l = obj.length; i < l; i++) {
					callback(obj[i], i);
				}
			} else {
				var j = 0;
				for (var p in obj) {
					callback(obj[p], j);
					j++;
				}
			}
		},
		//查找直接子集
		children : function (elem,tagName) {
			elem = elem || document;
			var nodes = elem.childNodes;
			var i = 0,
			elem = null,
			arr = [],
			len = nodes.length;
			for (i; i < len; i++) {
				elem = nodes[i];
				if (elem.nodeType && elem.nodeType == 1) {
					if(tagName == 'undefined'){
						arr.push(elem);
					}else{
						if(elem.tagName == tagName){
							arr.push(elem);
						}
					}					
				}
			}
			return arr;
		},
		//清空空白节点
		cleanWhitespace : function (element) {
			for (var i = 0; i < element.childNodes.length; i++) {
				var node = element.childNodes[i];
				if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
					node.parentNode.removeChild(node);
				}
			}
		},
		//打印信息
		log : function () {
			if (arguments.length == 0) {
				return
			}
			if (window.console && console.log) {
				if (arguments.length == 1) {
					console.log(arguments[i]);
					return;
				}
				
				var str = "";
				for (var i = 0, len = arguments.length; i < len; i++) {
					str += arguments[i] + '____';
				}
				console.log(str);
			}
		}
	};
	
	//简单字符串处理
	Z.Str = {
		trim : function (str) {
			if (typeof str == 'string')
				return str.replace(/(^\s*)|(\s*$)/g, '');
		},
		ltrim : function (str) {
			if (typeof str == 'string')
				return str.replace(/(^\s*)/g, '');
		},
		rtrim : function (str) {
			if (typeof str == 'string')
				return str.replace(/(\s*$)/g, '');
		}
	};
	
	//加载器  加载css js __ 待测试
	Z.loadFile = function (url, type, callback, charset) {
		if (!url) {
			return;
		}
		
		var _doc = document,
		p = _doc.getElementsByTagName('head')[0],
		c,
		t;
		
		//获取文件类型
		t = type || url.toLowerCase().substring(url.lastIndexOf('.') + 1);
		
		//js  or css
		if (t === 'js') {
			c = _doc.createElement('script');
			c.setAttribute('type', 'text/javascript');
			c.setAttribute('src', url);
			c.setAttribute('async', true);
		} else if (t === 'css') {
			c = _doc.createElement('style');
			c.setAttribute('type', 'text/css');
			c.setAttribute('rel', 'stylesheet');
			c.setAttribute('href', url);
		}
		
		//设置编码格式
		if (charset) {
			c.charset = charset;
		}
		
		//css无需监听加载完成事件
		if (t === 'css') {
			p.appendChild(c);
			if (callback) {
				callback(url);
			}
			return;
		}
		
		//监听js加载状态
		c.onload = c.onreadystatechange = function () {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				
				c.onload = c.onreadystatechange = null;
				
				if (callback) {
					callback(this.getAttribute('src'));
				}
			}
		}
		
		//追加到页面中
		p.appendChild(c);
	};
	
	//预加载图片__ 待测试
	Z.preloadImg = function (url, callback) {
		var img = new Image();
		
		img.onload = img.onreadystatechange = img.onerror = function () {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				img = img.onload = img.onreadystatechange = img.onerror = null;
				
				if (callback) {
					callback(url);
				}
			}
		}
		
		img.url = url;
	};
	
	//========================检测浏览器 类型 版本==========================
	Z.Browser = (function () {
		var _ua = navigator.userAgent.toLowerCase();
		var _s = {};
		_s.IE = _ua.match(/msie ([\d.]+)/) ? true : false;
		_s.Firefox = _ua.match(/firefox\/([\d.]+)/) ? true : false;
		_s.Chrome = _ua.match(/chrome\/([\d.]+)/) ? true : false;
		_s.IE6 = (_s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
		_s.IE7 = (_s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
		_s.IE8 = (_s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
		return _s;
	})();
	
	//===========================继承======================================
	
	/**
	 *	Child		子类
	 * Parent 	父类
	 */
	Z.extends = function (Child, Parent) {
		var F = function () {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.uber = Parent.prototype;
	}
	
	/**Child.uber = Parent.prototype; 意思是为子对象设一个uber属性，这个属性直接指向父对象的prototype属性。（uber是一个德语词，意思是"向上"、"上一层"。）这等于在子对象上打开一条通道，可以直接调用父对象的方法。这一行放在这里，只是为了实现继承的完备性，纯属备用性质。*/
	
	//-----根据复制父类的属性和方法到目标类实现继承
	/*
	extendsByCopy = function(Child,Parent){
	var p = Parent.prototype;
	var c = Child.prototype;
	for(var i in p){
	c[i] = p[i];
	}
	c.uber = p;
	}
	 */
	
	//------浅拷贝
	/*
	function extendCopy(p){
	var c = {};
	for(var i in p){
	c[i] = p[i];
	}
	return c;
	}
	 */
	
	//-------深度拷贝
	/*
	function deepCopy(p,c){
	var c =  c || {};
	for(var i in p){
	if(typeof p[i] === 'object'){
	c[i] = (p[i].constructor === Array) ? [] : {};
	deepCopy(p[i],c[i]);
	}else{
	c[i] = p[i];
	}
	}
	return c;
	}
	 */
	
	//===========================动画======================================
	Z.Tween = {
		linear : function (t, b, c, d) {
			return c * t / d + b;
		},
		swing : function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		to : function (target, duration, prop, start, end, callback) {
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
					
					if (callback) {
						callback();
					}
					
					time = duration;
				}
				var val = linear(time, start, end - start, duration);
				switch (prop) {
				case 'scrollTop':
				case 'scrollLeft':
					target[prop] = parseInt(val);
					break;
				case 'zIndex':
					target.style[prop] = parseInt(val);
					break;
				case 'opacity':
					target.style.filter = "alpha(opacity:" + val + ")";
					target.style.opacity = val / 100;
				default:
					target.style[prop] = parseInt(val) + 'px';
					break;
				}
			}
		}
	};
	
	//添加到window对象上
	if (typeof(YM) == 'undefined') {
		window.YM = {};
	}
	window.YM.Z = Z;
	
})(window, undefined)
