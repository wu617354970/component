(function (window, undefined) {
	
	//����
	var Z = {
		$ : function (id) {
			return (typeof id == 'string') ? document.getElementById(id) : id
		},
		offset : function (elem) {
			var l = 0,t = 0;
			while (elem) {
				l += elem.offsetLeft;
				t += elem.offsetTop;
				elem = elem.offsetParent;
			}
			return {'left' : l,	'top' : t};
		},
		pageX : function (e) {
			e = Z.getEvent(e);
			return (e.pageX) ? e.pageX : e.clientX + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		},
		pageY : function (e) {
			e = Z.getEvent(e);
			return (e.pageY) ? e.pageY : e.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		},
		getEvent : function (e) {
			return e || window.event;
		},
		addEvent : function (elem, type, handler) {
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			} else if (elem.attachEvent) {
				elem.attachEvent('on' + type, handler);
			} else {
				elem['on' + type] = handler;
			}
		},
		removeEvent : function (elem, type, handler) {
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handler, false);
			} else if (elem.detachEvent) {
				elem.detachEvent('on' + type, handler);
			} else {
				elem['on' + type] = null;
			}
		},
		delegateEvent : function (elem, fun) {
			return function (event) {
				return fun.call(elem, event || window.event);
			};
		},
		stopBubble : function (e) {
			e = Z.getEvent(e);
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.returnValue = false;
			}
		},
		extend : function (original, source) {
			for (var p in source) {
				if (original.hasOwnProperty(p)) {
					original[p] = source[p];
				}
			}
			return original;
		},
		linear : function (t, b, c, d) {
			return c * t / d + b;
		},
		swing : function (t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		}
	}
	
	//��������
	Z.Tween = function (target, duration, prop, start, end) {
		if (target.timer) {	
			clearInterval(target.timer)
		}
		target.timer = setInterval(doMove, 10);
		
		var startTime = new Date().getTime() / 1000;
		function doMove() {
			var time = (new Date().getTime()) / 1000 - startTime;
			if (time >= duration) {
				clearInterval(target.timer);
				target.timer = null;
				
				time = duration;
			}
			var val = Z.swing(time, start, end - start, duration);
			target.style[prop] = parseInt(val) + 'px';
		}
	}
	
	//Drag
	var Slider = function (options) {
		this.initialize.call(this, options);
	}
	
	Slider.prototype = {
		constructor : Slider,
		initialize : function (options) {
			
			//�ϲ�Ĭ���봫��Ķ���  thumbĿ����קԪ��  track��קԪ�ظ���Ԫ��  dir��ק����(v��ֱ  hˮƽ)
			this.opts = Z.extend({
					track : '',
					thumb : '',
					dir : 'v',
					onDrag : function () {}
				}, options || {});
			
			//��ȡ  ��קĿ��Ԫ��	��ק����Ԫ��
			this.thumb = Z.$(this.opts.thumb);
			this.track = Z.$(this.opts.track);
			
			//���ø�������Ϊ��Զ�λ
			if (this.track.position != 'relative') {
				this.track.position = 'relative';
			}
			
			//��ӻ����϶��¼�  �������¼�
			Z.addEvent(this.thumb, 'mousedown', Z.delegateEvent(this, this.dragStart));
			Z.addEvent(this.track, 'mousedown', Z.delegateEvent(this, this.doTrack));
			
			//�󶨺��� ʹ��ǰthisָ��Drag
			this._fMove = Z.delegateEvent(this, this.dragMoving);
			this._fStop = Z.delegateEvent(this, this.dragStop);
			
			//������Լ�¼��קλ��
			this.isDraging = false;
			this.offPos = this.offMarginPos = this.position = this.minPosition = this.maxPosition = this.offMidThumb = 0;
			
			if (this.opts.dir == 'h') {
				this.minPosition = this.thumb.offsetLeft || 0;
				this.maxPosition = this.minPosition + this.track.offsetWidth - this.thumb.offsetWidth;
				this.thumb.style.left = this.minPosition + 'px';
				this.offMidThumb = (this.thumb.offsetWidth / 2);
			} else {
				this.minPosition = this.thumb.offsetTop || 0;
				this.maxPosition = this.minPosition + this.track.offsetHeight - this.thumb.offsetHeight;
				this.thumb.style.top = this.minPosition + 'px';
				this.offMidThumb = (this.thumb.offsetHeight / 2);
			}
		},
		//���û���λ��
		setPosition : function (pos) {
			this.position = Math.max(this.minPosition, Math.min(pos, this.maxPosition));
			if (this.opts.dir == 'h') {
				this.thumb.style.left = this.position + 'px';
			} else {
				this.thumb.style.top = this.position + 'px';
			}
		},
		//��ȡ����λ��
		getPosition : function () {
			return this.position;
		},
		getPercent : function () {
			var val = ((this.position / this.maxPosition) + this.minPosition) * 100;
			return parseInt(val);
		},
		//�������¼�
		doTrack : function (e) {
			var pos = (this.opts.dir == "h") ? (Z.pageX(e) - Z.offset(this.track).left) : (Z.pageY(e) - Z.offset(this.track).top);
			pos -= this.offMidThumb;
			this.position = Math.max(this.minPosition, Math.min(pos, this.maxPosition));
			
			if (this.opts.dir == 'h') {
				Z.Tween(this.thumb, 0.3, 'left', parseInt(this.thumb.style.left), this.position);
			} else {
				Z.Tween(this.thumb, 0.3, 'top', parseInt(this.thumb.style.top), this.position);
			}
			
			this.opts.onDrag();
		},
		//��ʼ��ק
		dragStart : function (e) {
			this.isDraging = true;
			
			if (this.opts.dir == 'h') {
				this.offPos = Z.pageX(e) - this.thumb.offsetLeft;
				this.offMarginPos = parseInt(this.thumb.marginLeft) || 0;
			} else {
				this.offPos = Z.pageY(e) - this.thumb.offsetTop;
				this.offMarginPos = parseInt(this.thumb.marginTop) || 0;
			}
			
			Z.addEvent(document, 'mousemove', this._fMove);
			Z.addEvent(document, 'mouseup', this._fStop);
			
			Z.stopBubble(e);
		},
		//��ק��
		dragMoving : function (e) {
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			
			var pos = (this.opts.dir == 'h') ? Z.pageX(e) - this.offPos : Z.pageY(e) - this.offPos;
			this.setPosition(pos);
			
			this.opts.onDrag();
		},
		//��ק����
		dragStop : function (e) {
			this.isDraging = false;
			Z.removeEvent(document, 'mousemove', this._fMove);
			Z.removeEvent(document, 'mouseup', this._fStop);
		}
	}
	
	//��ӵ�YM�����ռ�
	if (typeof YM == 'undefined') { window.YM = {}; }
	
	YM.addSlider = function (options) {
		return new Slider(options)
	};
})(window, undefined);
