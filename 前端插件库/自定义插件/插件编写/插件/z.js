//==========================����===============================
(function (window, undefined) {
	
	var _doc = document,
	_win = window;
	
	var Z = {
		//��ȡԪ��
		$ : function (id) {
			return (typeof id == 'string') ? document.getElementById(id) : id;
		},
		//��ȡԪ��ʵ�ʿ�� �߶�
		width : function (elem) {
			return elem.offsetWidth || (elem.style.width ? parseInt(elem.style.width.replace("px", "")) : 0);
		},
		height : function (elem) {
			return elem.offsetHeight || (elem.style.height ? parseInt(elem.style.height.replace("px", "")) : 0);
		},
		//��ȡԪ�����ҳ�����Ͻǵľ��� left top
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
		//��ʾԪ��
		show : function (elem) {
			elem.style.display = 'block';
		},
		//����Ԫ��
		hide : function (elem) {
			elem.style.display = 'none';
		},
		append : function (p, elem) {
			p = p || document.body;
			p.appendChild(elem);
		},
		//���û�ȡһ��ֵ ��ֵ��ʾԪ��html����
		html : function (elem, val) {
			if (val == 'undefined') {
				return elem.innerHTML;
			} else {
				elem.innerHTML = val;
			}
		},
		//��ȡ���鳤��
		size : function (elem) {
			if (elem.length) {
				return elem.length;
			}
		},
		//��ȡ�ӿڿ�Ⱥ͸߶�
		windowWidth : function () {
			return Math.max(0, document.documentElement.clientWidth, document.body.clientWidth);
		},
		windowHeight : function () {
			return Math.max(0, document.documentElement.clientHeight, document.body.clientHeight);
		},
		//��ȡҳ���ܵĿ�Ⱥ͸߶�
		pageWidth : function () {
			return Math.max(0, document.documentElement.scrollWidth, document.body.scrollWidth);
		},
		pageHeight : function () {
			return Math.max(0, document.documentElement.scrollHeight, document.body.scrollHeight);
		},
		//��ȡ���λ�þ�������ҳ�����Ͻǵ�λ��X Y
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
		//��ȡ���λ�þ���ҳ�����Ͻǵ�λ��  ������������ľ��� X Y
		clientX : function (e) {
			e = e || window.event;
			return e.clientX;
		},
		clientY : function (e) {
			e = e || window.event;
			return e.clientY;
		},
		//event
		//����¼�����
		addEvent : function (elem, type, handler) {
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			} else if (elem.attachEvent) {
				elem.attachEvent('on' + type, handler);
			} else {
				elem['on' + type] = handler;
			}
		},
		//�Ƴ��¼�����
		removeEvent : function (elem, type, handler) {
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handler, false);
			} else if (elem.detachEvent) {
				elem.detachEvent('on' + type, handler);
			} else {
				elem['on' + type] = null;
			}
		},
		//�����¼�����
		delegateEvent : function (target, fun, event) {
			return function () {
				return fun.call(target, event || window.event);
			}
		},
		//��ֹ�¼�Ĭ����Ϊ
		stopDefault : function (e) {
			e = e || window.event;
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return false;
		},
		//��ֹ�¼�ð��
		stopBubble : function (e) {
			e = e || window.event;
			if (e && e.stopPropagation) {
				�� �� e.stopPropagation();
			} else {
				�� e.cancelBubble = true;
			}
			return false;
		},
		//��ȡ�¼�Ŀ��Ԫ��
		target : function (e) {
			e = e || window.event;
			return e.target || e.srcElement;
		},
		//extend
		//�ϲ����������е�����
		extend : function (destination, source) {
			for (var property in source) {
				if (destination.hasOwnProperty(property)) {
					destination[property] = source[property];
				}
			}
			return destination;
		},
		//�����������Object����
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
		//����ֱ���Ӽ�
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
		//��տհ׽ڵ�
		cleanWhitespace : function (element) {
			for (var i = 0; i < element.childNodes.length; i++) {
				var node = element.childNodes[i];
				if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
					node.parentNode.removeChild(node);
				}
			}
		},
		//��ӡ��Ϣ
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
	
	//���ַ�������
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
	
	//������  ����css js __ ������
	Z.loadFile = function (url, type, callback, charset) {
		if (!url) {
			return;
		}
		
		var _doc = document,
		p = _doc.getElementsByTagName('head')[0],
		c,
		t;
		
		//��ȡ�ļ�����
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
		
		//���ñ����ʽ
		if (charset) {
			c.charset = charset;
		}
		
		//css���������������¼�
		if (t === 'css') {
			p.appendChild(c);
			if (callback) {
				callback(url);
			}
			return;
		}
		
		//����js����״̬
		c.onload = c.onreadystatechange = function () {
			if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
				
				c.onload = c.onreadystatechange = null;
				
				if (callback) {
					callback(this.getAttribute('src'));
				}
			}
		}
		
		//׷�ӵ�ҳ����
		p.appendChild(c);
	};
	
	//Ԥ����ͼƬ__ ������
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
	
	//========================�������� ���� �汾==========================
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
	
	//===========================�̳�======================================
	
	/**
	 *	Child		����
	 * Parent 	����
	 */
	Z.extends = function (Child, Parent) {
		var F = function () {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.uber = Parent.prototype;
	}
	
	/**Child.uber = Parent.prototype; ��˼��Ϊ�Ӷ�����һ��uber���ԣ��������ֱ��ָ�򸸶����prototype���ԡ���uber��һ������ʣ���˼��"����"��"��һ��"������������Ӷ����ϴ�һ��ͨ��������ֱ�ӵ��ø�����ķ�������һ�з������ֻ��Ϊ��ʵ�ּ̳е��걸�ԣ������������ʡ�*/
	
	//-----���ݸ��Ƹ�������Ժͷ�����Ŀ����ʵ�ּ̳�
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
	
	//------ǳ����
	/*
	function extendCopy(p){
	var c = {};
	for(var i in p){
	c[i] = p[i];
	}
	return c;
	}
	 */
	
	//-------��ȿ���
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
	
	//===========================����======================================
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
	
	//��ӵ�window������
	if (typeof(YM) == 'undefined') {
		window.YM = {};
	}
	window.YM.Z = Z;
	
})(window, undefined)
