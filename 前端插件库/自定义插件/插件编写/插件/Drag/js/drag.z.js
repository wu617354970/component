(function (window, undefined) {
	
	//Tool
	var Tool = {
		$ : function (id) {
			return  (typeof id == 'string') ? document.getElementById(id) : id;
		},
		offset : function (elem) {
			var l = 0, t = 0;
			while (elem) {
				l += elem.offsetLeft;
				t += elem.offsetTop;
				elem = elem.offsetParent;
			}
			return {'left' : l, 'top' : t	};
		},
		pageX : function (e) {
			e = Tool.getEvent(e);
			return (e.pageX) ? e.pageX : e.clientX + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		},
		pageY : function (e) {
			e = Tool.getEvent(e);
			return (e.pageY) ? e.pageY : e.clientY + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		},
		clientX : function (e) {
			e = Tool.getEvent(e);
			return e.clientX;
		},
		clientY : function (e) {
			e = Tool.getEvent(e);
			return e.clientY;
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
		extend : function (original, source) {
			for (var p in source) {
				if (original.hasOwnProperty(p)) {
					original[p] = source[p];
				}
			}
			return original;
		}
	}
	
	//Drag
	var Drag = function (options) {
		this.initialize.call(this, options);
	}
	
	Drag.prototype = {
		constructor : Drag,
		initialize : function (options) {
			//limitType  v��ֱ  hˮƽ  in�����ڸ���  v_in��ֱ�����ڸ���������  h_inˮƽ�����ڸ���������  n������ (Ĭ�ϴ�ֱ)
			//�ϲ�Ĭ���봫��Ķ���
			this.opts = Tool.extend({
					target : '',
					container : '',
					limit : false,
					limitType : 'v',
					limitRect : {top : 0, left : 0, right : 0, bottom : 0},
					onDrag : function(){}
				}, options || {});
			
			//������Լ�¼��קλ��
			this.isDraging = false;
			this.offX = this.offY = this.offMarginX = this.offMarginY;
			//this.position = {};
			
			//��ȡ��קĿ��Ԫ��
			this.target = Tool.$(this.opts.target);
			//��ȡ��ק����Ԫ��
			this.container = Tool.$(this.opts.container);
			
			//����϶��¼�
			Tool.addEvent(this.target, 'mousedown', Tool.delegateEvent(this, this.dragStart));
			
			//�󶨺��� ʹ��ǰthisָ��Drag
			this._fMove = Tool.delegateEvent(this, this.dragMoving);
			this._fStop = Tool.delegateEvent(this, this.dragStop);
			
			//�������������Ϊ�������Ϸ�ʱ  ����limitΪtrue�����
			this.opts.limit = (this.opts.limitType == 'n') ? false : true;
			
			//��ȡ���Ʒ�Χ
			if (this.opts.limit) {
				var rect = this.opts.limitRect;
				
				//���������Ƿ�Ϊ��Զ�λ
				if (this.container.position != 'relative') {
					this.container.position = 'relative';
				}
				
				rect.left = Math.max(0, this.target.offsetLeft);
				rect.top = Math.max(0, this.target.offsetTop);
				rect.right = Math.max(rect.left, rect.left + this.container.clientWidth - this.target.offsetWidth);
				rect.bottom = Math.max(rect.top, rect.top + this.container.clientHeight - this.target.offsetHeight);
			}
		},
		dragStart : function (e) {
			if (this.limitType == 'no') return;
			
			this.isDraging = true;
			
			this.offX = Tool.pageX(e) - this.target.offsetLeft;
			this.offY = Tool.pageY(e) - this.target.offsetTop;
			
			this.offMarginX = parseInt(this.target.marginLeft) || 0;
			this.offMarginY = parseInt(this.target.marginTop) || 0;
			
			Tool.addEvent(document, 'mousemove', this._fMove);
			Tool.addEvent(document, 'mouseup', this._fStop);
		},
		dragMoving : function (e) {
			//��ֹ�϶��л�ѡ����������
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
			
			var xpos = Tool.pageX(e) - this.offX;
			var ypos = Tool.pageY(e) - this.offY;
			//������קĿ�귶Χ
			if (this.opts.limit) {
				var rect = this.opts.limitRect;
				
				if (xpos < rect.left) {
					xpos = rect.left;
				} else if (xpos > rect.right) {
					xpos = rect.right;
				}
				
				if (ypos < rect.top) {
					ypos = rect.top;
				} else if (ypos > rect.bottom) {
					ypos = rect.bottom;
				}
				
				if (this.opts.limitType == 'h' || this.opts.limitType == 'in') {
					this.target.style.left = xpos - this.offMarginX + 'px';
				}
				
				if (this.opts.limitType == 'v' || this.opts.limitType == 'in') {
					this.target.style.top = ypos - this.offMarginY + 'px';
				}
			} else {
				this.target.style.left = xpos - this.offMarginX + 'px';
				this.target.style.top = ypos - this.offMarginY + 'px';
			}
			
			this.opts.onDrag();
		},
		dragStop : function (e) {
			this.isDraging = false;
			Tool.removeEvent(document, 'mousemove', this._fMove);
			Tool.removeEvent(document, 'mouseup', this._fStop);
		}
	}
	
	//��ӵ�YM�����ռ�
	if (typeof YM == 'undefined') {	window.YM = {};	}	YM.addDrag = function (options) {	return new Drag(options);	}
})(window, undefined);
