    + function () {
   	/***
   	 *  默认参数
   		var defaultCOptions = {
   			category : 'defaultC', //  //  提示的种类  //  默认 defaultC  提示 info 警告 warning 成功 success 错误  error
   			tipsContainId : 'jsTipsContainId', // 提示框的id 无  #， 如果需要创建不同的提示框，那么就自己定义新的id
   			className : '.js-tips-trigger-defaultC', //  （必须字段）   触发元素的class 带 .
   			mouseType : 'tips1', // （必须字段）  如果页面上需要出现几个不同的提示，那么无边把这个修改，可以用数字递增的方式增加，  否则一个页面只会有最后一个生效
   			unifyTips : true, //  是否统一提示
   			infomation : { //  统一提示的提示文字
   				defaultC : '这是默认的提示信息',
   				info : '这是提示的提示信息',
   				warning : '这是警告的提示信息',
   				error : '这是错误的提示信息',
   				success : '这是成功的提示信息'
   			},
   			callback : {
   				defaultC : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				info : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				warning : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				success : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				error : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				}
   			},

   			// 提示框的css 样式
   			css : {
   				defaultC : {
   					'position' : 'absolute',
   					'top' : '0',
   					'left' : '0',
   					'z-index' : 92,
   					'background-color' : 'rgba(0,0,0,0.5)',
   					'font' : '12px/20px "Microsoft YaHei"',
   					'color' : '#fff',
   					'max-width' : '400px',
   					'padding' : '5px 10px',
   					'border-radius' : '5px',
   					'border' : '1px  solid rgba(0,0,0,0.1)',
   					'display' : 'none'
   				},
   				info : {
   					'background-color' : '#fff', // #5bc0de
   					//'border-color' : '#46b8da',
   					'border' : '1px  solid #46b8da',
   					'color' : '#333' // #fff
   				},
   				warning : {
   					'background-color' : '#fff', // #f0ad4e
   					//'border-color' : '#eea236',
   					'border' : '1px  solid #eea236',
   					'color' : '#333' // #fff
   				},
   				success : {
   					'background-color' : '#fff', // #5cb85c
   					//'border-color' : '#4cae4c',
   					'border' : '1px  solid #4cae4c',
   					'color' : '#333' // #fff
   				},
   				error : {
   					'background-color' : '#fff', // #d9534f
   					//'border-color' : '#d43f3a',
   					'border' : '1px  solid #d43f3a',
   					'color' : '#333'
   				} // #fff
   			},
   			//  偏移的距离
   			offsetDistance : {
   				top : 5, // 提示框top偏移
   				left : 5 // 提示框left偏移
   			}
   		};
   	 */
   	$.addTipsMethod = function (options) {
		// *  默认参数
   		var defaultCOptions = {
   			category : 'defaultC', //  //  提示的种类  //  默认 defaultC  提示 info 警告 warning 成功 success 错误  error
   			tipsContainId : 'jsTipsContainId', // 提示框的id 无  #， 如果需要创建不同的提示框，那么就自己定义新的id
   			className : '.js-tips-trigger-defaultC', //  （必须字段）   触发元素的class 带 .
   			mouseType : 'tips1', // （必须字段）  如果页面上需要出现几个不同的提示，那么无边把这个修改，可以用数字递增的方式增加，  否则一个页面只会有最后一个生效
   			unifyTips : true, //  是否统一提示
   			infomation : { //  统一提示的提示文字
   				defaultC : '这是默认的提示信息',
   				info : '这是提示的提示信息',
   				warning : '这是警告的提示信息',
   				error : '这是错误的提示信息',
   				success : '这是成功的提示信息'
   			},
   			callback : {
   				defaultC : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				info : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				warning : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				success : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				},
   				error : function (tipsContain, _this, _event) { //  提示框容器 this  对象   和 event 对象

   				}
   			},

   			// 提示框的css 样式
   			css : {
   				defaultC : {
   					'position' : 'absolute',
   					'top' : '0',
   					'left' : '0',
   					'z-index' : 92,
   					'background-color' : 'rgba(0,0,0,0.5)',
   					'font' : '12px/20px "Microsoft YaHei"',
   					'color' : '#fff',
   					'max-width' : '400px',
   					'padding' : '5px 10px',
   					'border-radius' : '5px',
   					'border' : '1px  solid rgba(0,0,0,0.1)',
   					'display' : 'none'
   				},
   				info : {
   					'background-color' : '#fff', // #5bc0de
   					//'border-color' : '#46b8da',
   					'border' : '1px  solid #46b8da',
   					'color' : '#333' // #fff
   				},
   				warning : {
   					'background-color' : '#fff', // #f0ad4e
   					//'border-color' : '#eea236',
   					'border' : '1px  solid #eea236',
   					'color' : '#333' // #fff
   				},
   				success : {
   					'background-color' : '#fff', // #5cb85c
   					//'border-color' : '#4cae4c',
   					'border' : '1px  solid #4cae4c',
   					'color' : '#333' // #fff
   				},
   				error : {
   					'background-color' : '#fff', // #d9534f
   					//'border-color' : '#d43f3a',
   					'border' : '1px  solid #d43f3a',
   					'color' : '#333'
   				} // #fff
   			},
   			//  偏移的距离
   			offsetDistance : {
   				top : 5, // 提示框top偏移
   				left : 5 // 提示框left偏移
   			}
   		};

   		var _opts = $.fn.extend(true, {}, defaultCOptions, options || {});

   		/**
   		 * @createTime  2016-11-02
   		 * @updateTime  2016-11-03
   		 * @author wuwg
   		 * @description  增加一提示方法
   		 */
   		var _scope = {
   			author : 'wuwg',
   			version : '2016.0.1',
   			mouseType : {
   				mousemove : 'mousemove.' + _opts.mouseType + _opts.category,
   				mouseenter : 'mouseenter.' + _opts.mouseType + _opts.category,
   				mouseleave : 'mouseleave.' + _opts.mouseType + _opts.category
   			},
   			createTips : function () {
   				$('<div class="fd-tips-contain"  id="' + _opts.tipsContainId + '"></div>')
   				.appendTo('body');
   				return $('#' + _opts.tipsContainId);
   			},
   			/**
   			 * 操作tips
   			 */
   			operateDropMenuTips : function (event, _tipsContain) {
   				var _event = event || window.event,
   				_top = _event.pageY,
   				_left = _event.pageX;
   				_tipsContain.css({
   					top : _top + _opts.offsetDistance.top,
   					left : _left + _opts.offsetDistance.left
   				});
   				// 如果统一提示
   				if (_opts.unifyTips) {
   					_tipsContain[0].innerHTML = _opts.infomation[_opts.category];
   				} else {
   					var _text = $(_event.target).closest(_opts.className).text();
   					_tipsContain[0].innerHTML = _text;

   				};
   				// 执行回调函数
   				if ($.type(_opts.callback[_opts.category]) == 'function') {
   					_opts.callback[_opts.category](_tipsContain, $(_event.target).closest(_opts.className), _event);
   				}

   			},
   			//  进行提示框绑定
   			bindMouseTipsEvent : function (_tipsContain) {
   				// 这里的绑定事件都是先解除再绑定的
   				// 鼠标移动=>移动提示框
   				$(document).off(_scope.mouseType.mousemove).on(_scope.mouseType.mousemove, _opts.className, function (event) {
   					if (_tipsContain.is(':visible')) {
   						// 操作tips
   						_scope.operateDropMenuTips(event, _tipsContain);
   					}
   				});
   				// 鼠标划入=> 显示提示框
   				$(document).off(_scope.mouseType.mouseenter).on(_scope.mouseType.mouseenter, _opts.className, function (event) {
   					//  增加css样式
   					_scope.tipsContain.css(_scope.css[_opts.category]);
   					if (!_tipsContain.is(':visible')) {
   						_tipsContain.css('display', 'block');
   						// 操作tips
   						_scope.operateDropMenuTips(event, _tipsContain);
   					}
   				});
   				//  鼠标划出=>隐藏提示框
   				$(document).off(_scope.mouseType.mouseleave).on(_scope.mouseType.mouseleave, _opts.className, function () {
   					if (_tipsContain.is(':visible')) {
   						_tipsContain.css('display', 'none');
   					}
   				});
   			},

   			//  解除绑定
   			unbindMouseTipsEvent : function () {
   				$(document).off(_scope.mouseType.mousemove);
   				$(document).off(_scope.mouseType.mouseenter);
   				$(document).off(_scope.mouseType.mouseleave);
   				// 如果还有显示的一定要隐藏
   				if (_scope.tipsContain.is(':visible')) {
   					_scope.tipsContain.css('display', 'none');
   				}
   			},
   			// 元素
   			tipsContain : $('#' + _opts.tipsContainId),
   			// 合并css
   			extendCss : function () {
   				//  css
   				_scope.css = {
   					defaultC : _opts.css.defaultC, //  默认
   					info : $.fn.extend(true, {}, _opts.css.defaultC, _opts.css.info), // 提示
   					warning : $.fn.extend(true, {}, _opts.css.defaultC, _opts.css.warning), //  警告
   					success : $.fn.extend(true, {}, _opts.css.defaultC, _opts.css.success), //  成功
   					error : $.fn.extend(true, {}, _opts.css.defaultC, _opts.css.error) // 错误
   				}

   			},
   			// 初始化
   			init : function () {
   				_scope.extendCss();
   				// 创建下拉的提示框
   				if (!_scope.tipsContain.size() > 0) {
   					_scope.tipsContain = _scope.createTips();
   				};

   				//  增加css样式
   				_scope.tipsContain.css(_scope.css[_opts.category]);

   				//  绑定事件
   				_scope.bindMouseTipsEvent(_scope.tipsContain);
   			},
   			// 销毁的方法
   			destory : function () {
   				//先解除事件绑定
   				_scope.unbindMouseTipsEvent();
   				//移除元素
   				_scope.tipsContain.remove();
   				//清空对象
   				_scope = null;
   			}
   		};
   		//  执行init方法
   		_scope.init();
   		return _scope;
   	};
   }
   ();