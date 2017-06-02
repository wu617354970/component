/**
 * version:	 		    2015.01.01
 * creatTime: 	 		2015.11.11
 * updateTime: 			2015.11.11
 * author:				wuwg
 * name:  				jrdt-area-map-function
 **/
define([], function () {
	var jrdtAreaMapFunction = {
		//颜色处理函数
		GradientColor : function (startColor, endColor, step) {
			function GradientColor(startColor, endColor, step) {
				startRGB = this.colorRgb(startColor); //转换为rgb数组模式
				startR = startRGB[0];
				startG = startRGB[1];
				startB = startRGB[2];

				endRGB = this.colorRgb(endColor);
				endR = endRGB[0];
				endG = endRGB[1];
				endB = endRGB[2];

				sR = (endR - startR) / step; //总差值
				sG = (endG - startG) / step;
				sB = (endB - startB) / step;

				var colorArr = [];
				for (var i = 0; i < step; i++) {
					//计算每一步的hex值
					var hex = this.colorHex('rgb(' + parseInt((sR * i + startR)) + ',' + parseInt((sG * i + startG)) + ',' + parseInt((sB * i + startB)) + ')');
					colorArr.push(hex);
				}
				return colorArr;

			};

			GradientColor.prototype.colorRgb = function (sColor) {
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				var sColor = sColor.toLowerCase();
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = '#';
						for (var i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
						}
						sColor = sColorNew;
					}
					//处理六位的颜色值
					var sColorChange = [];
					for (var i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
					}
					return sColorChange;
				} else {
					return sColor;
				}
			};

			GradientColor.prototype.colorHex = function (rgb) {
				var _this = rgb;
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
				if (/^(rgb|RGB)/.test(_this)) {
					var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, '').split(',');
					var strHex = '#';
					for (var i = 0; i < aColor.length; i++) {
						var hex = Number(aColor[i]).toString(16);
						hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
						if (hex === '0') {
							hex += hex;
						}
						strHex += hex;
					}
					if (strHex.length !== 7) {
						strHex = _this;
					}
					return strHex;
				} else if (reg.test(_this)) {
					var aNum = _this.replace(/#/, '').split('');
					if (aNum.length === 6) {
						return _this;
					} else if (aNum.length === 3) {
						var numHex = '#';
						for (var i = 0; i < aNum.length; i += 1) {
							numHex += (aNum[i] + aNum[i]);
						}
						return numHex;
					}
				} else {
					return _this;
				}
			};

			var gradient = new GradientColor(startColor, endColor, step);

			return gradient;
		},
        
        //颜色控制
		colorControl : function (options) {
			var opts = $.fn.extend(true, {}, {
				colorControlContain : '#js-color-control',
				trackUp : '.fd-control-up ',
				trackDown : '.fd-control-down ',
				maxValue : 10000,
				minValue : 0,
				gradient: [],
				getValueElement : '.fd-count',
				mousedown:function(maxValue,minValue,event){
					//console.log(maxValue)
					//console.log(minValue)
				},
				mousemove:function(maxValue,minValue,event){
				   //console.log(maxValue)
				   //console.log(minValue)
				},
				mouseup:function(maxValue,minValue){
				   // console.log(maxValue)
				   // console.log(minValue)
				}

			}, options || {});

			//  构造函数
			function ColorControl() {}

			ColorControl.prototype = {
				getVariable : function () {
					var _this = this;
					_this.colorControlContain = $(opts.colorControlContain);
					_this.trackUp = _this.colorControlContain .find(opts.trackUp);
					_this.trackDown = _this.colorControlContain .find(opts.trackDown);
					_this.trackFlag = false;
					_this.startPageY = 0;
					_this.endPageY = 0;
					_this.resultTop = 0;
					_this.maxValue = opts.maxValue;
					_this.maxTop = 0;
					_this.trackHeight = _this.trackUp.innerHeight();
					_this.whichTrack= 'up';
					_this.currentMaxValue= opts.maxValue;
					_this.currentMinValue= 0;
				},
				//  获取最大高度
				getMaxTop : function () {
					var _this = this;
					return _this.colorControlContain.height();
				},
				//  获取当前的高度
				getCurrentTop : function (that) {
					return parseInt(that.css('top')) > 0 ? parseInt(that.css('top')) : 0;
				},
				//  获取当前的值
				getCurrentValue : function (ratio) {
                    var _this=this;
					return parseInt((1 - ratio) *_this.maxValue);
				},
				//获取当前的颜色
				getCurrentColor: function(ratio) {
					return opts.gradient[parseInt(opts.gradient.length * (1 - ratio))];
				},
                getTrackHeight:function(){
                     var _this=this;
					return parseInt(_this.trackUp.innerHeight());
                    
                },
                getCurrentMaxValue:function(){
                   var _this=this;
					return parseInt(_this.trackUp.find(opts.getValueElement).text());  
                },
                getCurrentMinValue:function(){
                   var _this=this;
					return parseInt(_this.trackDown.find(opts.getValueElement).text());  
                },
                
				// 绑定鼠标移动事件函数
				bindMousemoveTrack : function (that) {
                    var  _this=this;
                    var  _that=that;        //  当前的手柄
                    //  当前的top值
                    var  currentTop = _this.getCurrentTop(_that);
                    var  otherTop=0;
                    var  connectTrack=null;  //  关联的手柄
                    if(that==_this.trackUp){
                        otherTop=_this.getCurrentTop(_this.trackDown); 
                        connectTrack=_this.trackDown;
                         _this.whichTrack='up';
                    }else {
                        otherTop=_this.getCurrentTop(_this.trackUp); 
                        connectTrack=_this.trackUp;
                        _this.whichTrack='down';
                    } 
                    
                    //  绑定mousemove方法
					$('body').on('mousemove.track', function (event) {
                            
						var event = event || window.event;
                            _this.endPageY = event.pageY;
                             event.preventDefault();  //  阻止默认行为
                        
						//  判断是否可以拖动
						if (!_this.trackFlag) {
							return false;
						}

						_this.maxTop = _this.getMaxTop();

						//箭头的高
						_this.trackHeight = _this.getTrackHeight();

						_this.resultTop = (_this.endPageY - _this.startPageY) + currentTop;

						// 判断上下箭头
						if(_this.whichTrack=='up'){   //  上箭头

							if (_this.resultTop < 0) {
								_this.resultTop = 0;
							} else if (_this.resultTop > (_this.maxTop-_this.trackHeight-(_this.maxTop-otherTop))) {
								_this.resultTop = (_this.maxTop-_this.trackHeight-(_this.maxTop-otherTop));
							}
						}else {
							if (_this.resultTop < _this.trackHeight+otherTop) {  //  下箭头
								_this.resultTop = _this.trackHeight+otherTop;
							} else if(_this.resultTop > _this.maxTop) {
								_this.resultTop = _this.maxTop
							}
						}
                        
						//  获取当前的数值
						var ratio = _this.resultTop / _this.maxTop;
						var currentValue = _this.getCurrentValue(ratio);
						_that.css({
							top : _this.resultTop, //  赋值给当前元素
							'border-left-color':  _this.getCurrentColor(ratio)
						});
                        
						_that.find(opts.getValueElement).text(currentValue) ;

						//  获取当前的最大数值
						_this.currentMaxValue=_this.getCurrentMaxValue();

						//  获取当前的最小数值
						_this.currentMinValue= _this.getCurrentMinValue();

						 // 鼠标移动的回调函数
						if($.type(opts.mousemove)=='function'){
							opts.mousemove(_this.currentMaxValue, _this.currentMinValue,event);
						};

						// 解除body上的鼠标移动事件
						$('body').off('mouseup.track').on('mouseup.track', function (event) {
							var event = event || window.event;
								_this.unbindMousemoveTrack();
							//  解除事件绑定
							  $('body').off('mouseup.track');
							// 鼠标松开的回调函数
							if($.type(opts.mouseup)=='function'){
								opts.mouseup( _this.currentMaxValue, _this.currentMinValue,event);
							}
						});
    
					});
				},
                
                bindMouseDown:function(event,that){
                    var _this=this;
                    var event = event || window.event;
						_this.startPageY = event.pageY;
						_this.trackFlag = true;
						// 绑定鼠标移动事件
						_this.bindMousemoveTrack(that);   
                        
                         // 鼠标按下的回调函数
                        if($.type(opts.mousedown)=='function'){
                            opts.mousedown(_this.currentMaxValue, _this.currentMinValue,event);
                         }
                    
                },
				// 解除鼠标移动事件函数
				unbindMousemoveTrack : function () {
                     var _this=this;
					_this.trackFlag = false;
					$('body').off('mousemove.track');
				},
				// 初始化函数
				init : function () {
                     var  _this=this;   
                    
                     // 获取所有的变量
                    _this.getVariable();
                    
                    _this.trackUp.css({
                            top:0
                        }).find(opts.getValueElement).text(opts.maxValue);
                        
                    _this.trackDown.css({
                            top:"100%"  
                    }).find(opts.getValueElement).text(0);

					//  上移动
					_this.trackUp.on('mousedown', function (event) {
                        _this.bindMouseDown(event,_this.trackUp);
					});

					//  下移动
					_this.trackDown.on('mousedown', function (event) {
                   
                        _this.bindMouseDown(event,_this.trackDown);
					});
                    
                    
				},
                
                //  更新最大值
                updateMax:function(maxValue){
                    var  _this=this;
                    var  maxRatio=   _this.currentMaxValue/  _this.maxValue;    // 当前最大值的比值  
                    var  minRatio=   _this.currentMinValue/  _this.maxValue;     // 当前最小值的比值
                                         
                    //改变最大值
                    _this.maxValue = $.type(maxValue)=='number'?maxValue:_this.maxValue;
                    
                    //  重新获得最大值
                    _this.currentMaxValue=parseInt(maxRatio* _this.maxValue);
                    _this.currentMinValue=parseInt(minRatio* _this.maxValue);
                     
                    // 改变当前最大值和最小值    
                    _this.trackUp.find(opts.getValueElement).text(_this.currentMaxValue);
                    _this.trackDown.find(opts.getValueElement).text(_this.currentMinValue);
                    
                    return  {
                       currentMaxValue: _this.currentMaxValue,
                       currentMinValue: _this.currentMinValue,
                    }
                }
			};

         //  var  colorControl=new  ColorControl();
                
                // 初始化函数
               // colorControl.init();
           
           return  new  ColorControl();;
		}

	};
	return jrdtAreaMapFunction;
});