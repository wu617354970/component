/*operateMap*/

define(
	['Snap','global'],
	function (Snap,global) {

	// 构造函数
	function OperateMap() {}
	//构造函数原型链设置属性、添加函数
	OperateMap.prototype = {
		setOptions : function (options) {
			var _this = this;
			_this.options = {
				isShowErrorLog : false, // 是否显示错误日志
				snap : '',
				tooltip : {
					show : true,
					showHead : true,
					id : 'tips',
					formatter : function () {},
					style : {}
				},

				isMaxMap : true,
				// 地图参数
				mapStyle : {
					map : {
						fill : 'rgba(20,167,209,0.3)',
						stroke : 'rgba(0,70,156,1)'
					},
					mapBj : {
						fill : '#e27934',
						shadow :{
							x : 15,
							y : 20,
							radius : 15,
							color : 'rgba(0,0,0,0.5)' //Snap.filter.shadow(30, 30, 15,'#2badfd')
						} ,
						stroke : 'rgb(25,77,136)',
						strokeWidth : 1
					},
					areaMap : {
						fill : 'rgba(20,167,209,0.3)',
						stroke : 'rgba(0,70,156,1)',
						strokeWidth : 5,
						outlineStroke : 'rgba(0,70,156,1)',
						outlineFill : 'rgba(0,0,0,0.0001)',
						textFill : '#fff',
						hoverFill : 'rgba(25,167,253,0.8)',
						xsHoverFill : 'rgba(25,167,253,0.8)',
						yjHoverFill : 'rgba(25,167,253,0.8)'

					},
					circle : {
						stroke : 'rgba(0,70,156,1)',
						r : 24,
						shouliFill:'#ffffff',//2016.5.16修改热力图水滴颜色
						banjieFill: '#ffffff'
					},
					
					textStyle : {
						fontSize : 92,
						fill:'#fff',
						hoverFill : '#fff'
					},
					dataTextStyle:{
						fontSize : 92,
						fill:'#000',
						hoverFill : '#fff',
						shadow:{
							x : 30,
							y : 40,
							radius : 25,
							color : '#000' //Snap.filter.shadow(30, 30, 15,'#2badfd')
						}
					},
					relativeWidth : 6028
				},
				isSortMinToMax : true,
				isshouli : true,
				areaMapColor : ['#ff7f50', '#87cefa', '#da70d6',
					'#32cd32', '#6495ed', '#ff69b4', '#ba55d3',
					'#cd5c5c', '#ffa500', '#40e0d0', '#1e90ff',
					'#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
					'#6b8e23', '#ff00ff', '#3cb371', '#b8860b',
					'#30e0e0'],
				series : {
					data : [{
							mapId : '110000', // mapId
							name : '北京', // 区域名字
							shouli : 1048, // 受理的数
							banjie : 2084, // 已结的数
					
							banjieList : [], // 办结的列表
							shouliList : [// 受理的列表  
								{
								}
							]
						}

					],
					dataRange : [10000, 15000, 2000, 25000, 30000,
						40000, 50000],
					dataRangeAuto : true, // dataRange 会自动更新
					// ，以每个区域的总数为临界点
					dataRangeSize : 7
					// 区域的大小
				},
				dataMaxValue : 50000,
				dataMinValue : 0,
				setGray : 'rgba(128,128,128,1)',
				setGrayStroke : '#333',
				isShowDataText : false, // 是否显示数据文本
				isShowNameText : true, // 是否显示区域名字
				mapidPrefix : 'mapid-', // mapid 的前缀
				clickCallback : function (event, _this, dataList) {}

			};

			// 合并参数
			_this.opts = $.fn.extend(true, {}, _this.options, options || {});

			// 初始化方法
			_this.snap = _this.opts.snap;
			if (_this.snap == 'undefined') {
				alert('你没指定snap对象,请先指定该对象');
			} else {
				_this.initial();
			}
		},
		initial : function (options) {
			var _this = this;

            // 设置地图的外观
            _this.setMapStyle();
            if(localStorage.getItem('fyjb')!=='1'){

                // 初始化地图
                _this.initialAreaMap();

					// 增加交互效果
				_this.addAreaMapInteraction();

				//  数据显示（第一次显示或者）
				_this.showDataText();

				// 取消七大区域的线
				if (!!_this.snap.select('#mapid-db0000-outline')) {
/*
					// 取消线
					_this.snap.select('#svgMapAct').selectAll('path').attr({
						stroke : 'none',
						strokeWidth : 0
					});

					// 重新画线
					_this.snap.selectAll('.fd-have-stroke').attr({
						stroke : _this.mapStyle.map.stroke,
						strokeWidth : '10px'
					});*/

				}
			}else {

				$('#perspective path').attr({
					stroke:'#00469c',
					fill:'rgba(101,221,236,1)',
					style:'display:block;'
				});
				if($('#xinjiang-group').length>0){
					$('#mapid-480000-outline,#mapid-520000-outline').attr({
						stroke:'none',
						fill:'rgba(101,221,236,0.8)'
					});
				}
			}
			_this.snap.attr({
				'visibility' : 'visible'
			});			
		},

		setMapStyle : function () {
			var _this = this;
			var snap = _this.snap;

			// 是否显示错误日志
			_this.isShowErrorLog = _this.opts.isShowErrorLog;
			// 区域文本
			_this.areaText = [];

			// 判断是否是七大区域
			_this.isSeventArea = ($('#seventArea').size() > 0);

			// 数字域区间
			_this.areaMapDataRange = _this.opts.series.dataRange;

			// mapid 前缀
			_this.mapidPrefix = _this.opts.mapidPrefix;

			// 是否是大地图
			_this.isMaxMap = _this.opts.isMaxMap;

			// 视窗对象
			_this.viewBox = _this.snap.attr('viewBox');

			// map style
			_this.mapStyle = _this.opts.mapStyle;

			// 地图的比值
			_this.mapRatio = Math.max(_this.viewBox.width / _this.mapStyle.relativeWidth,
									  _this.viewBox.height / _this.mapStyle.relativeWidth);

			function changeMapStyle() {

				// 设置地图描边的大小
				_this.mapStyle.map.strokeWidth = _this.mapStyle.map.strokeWidth * _this.mapRatio;

				// 设置阴影大小
				_this.mapStyle.mapBj.shadow = Snap.filter.shadow(
						_this.mapStyle.mapBj.shadow.x * _this.mapRatio,
						_this.mapStyle.mapBj.shadow.y * _this.mapRatio,
						_this.mapStyle.mapBj.shadow.radius * _this.mapRatio,
						_this.mapStyle.mapBj.shadow.color);

				// 设置地图字体大小
				var fontSize=_this.mapStyle.textStyle.fontSize * _this.mapRatio;
			
				_this.mapStyle.textStyle.fontSize = fontSize;

				// 圆半径
				_this.mapStyle.circle.r= _this.mapStyle.circle.r* _this.mapRatio ;

				//areaMap边框
				_this.mapStyle.areaMap.strokeWidth= _this.mapStyle.areaMap.strokeWidth* _this.mapRatio ;

				//dataText style
				_this.mapStyle.dataTextStyle.fontSize=fontSize;
				//dataText shadow
				_this.mapStyle.dataTextStyle.shadow=Snap.filter.shadow(
						_this.mapStyle.dataTextStyle.shadow.x * _this.mapRatio,
						_this.mapStyle.dataTextStyle.shadow.y * _this.mapRatio,
						_this.mapStyle.dataTextStyle.shadow.radius * _this.mapRatio,
						_this.mapStyle.dataTextStyle.shadow.color);
			}

			// 根据不同的尺寸设置不同的样式
			changeMapStyle();


			// 数字域自否自动计算
			_this.dataRangeAuto = _this.opts.series.dataRangeAuto;

			// 设置区域颜色
			_this.areaMapColor = _this.opts.areaMapColor;

			// 设置区域最大值
			_this.areaMapMaxValue = _this.opts.dataMaxValue;

			// 设置区域最小值
			_this.areaMapMinValue = _this.opts.dataMinValue;

			// 是否显示dataText
			_this.isShowDataText = _this.opts.isShowDataText;

			// 是否显示NameText
			_this.isShowNameText = _this.opts.isShowNameText;

			// 是否显示tooltip
			_this.isShowTooltip = _this.opts.tooltip.show;

			// 数据源对象
			_this.areaMapDataSource = _this.opts.series.data;

			// 数字域长度
			_this.dataRangeSize = _this.opts.series.data.length;

			// 按什么排序
			_this.isSortMinToMax = _this.opts.isSortMinToMax;

			// 按哪组数排序（默认受理）
			_this.isshouli = _this.opts.isshouli;

			// click callback
			_this.clickCallback = _this.opts.clickCallback;

			// 地图背景样式
			+function setMapBjStyle() {
				_this.mapPathBjG = snap.select('#svgMapBj');
				
				_this.snap.selectAll('path').attr({
					stroke : _this.mapStyle.mapBj.stroke,
					fill:_this.opts.setGray  // 默认设置灰色
				});
				// 隐藏所有的 -outline
				$('[id$="-outline"]').css({
					display:'none'
				});

				if($('#xinjiang-group').length){
					$('#xinjiang-outline').css({
						display:'block'
					});
				}

				_this.mapPathBjGPath = _this.mapPathBjG
					.selectAll('path');
				_this.mapPathBjGPath.attr({
					display:'block',
					fill : _this.opts.setGray, //_this.mapStyle.mapBj.fill,
					filter : snap.paper.filter(_this.mapStyle.mapBj.shadow),
					stroke : _this.mapStyle.mapBj.stroke,
					strokeWidth : _this.mapStyle.mapBj.strokeWidth
				});


			}();

			if (_this.snap.select('	#mapid-nansha')) {
				_this.snap.select('#mapid-nansha').attr({
					fill :'rgba(255,255,255,1)',// 'rgba(168,208,248,0.8)',
					stroke :'#6699cc',// _this.mapStyle.mapBj.stroke,
					strokeWidth:'6px'
				});
			}

			// 设置默认元素
			+function setOriginalElement() {
				_this.snap.selectAll('text').remove(); // 移除默认文本
				_this.snap.selectAll('circle').attr({ // 隐藏所有的圆
					display : 'none'
				});
				_this.snap.selectAll('polily').attr({ // 隐藏所有的圆
					display : 'none'
				});
				// 移除默认文本
				_this.snap.selectAll('ellipse').attr({ // 隐藏所有的圆
					visibility : 'hidden',
					fill : '#fff'
				});
			}();

			// 创建提示框
			_this.creatTipBox();
		},

		// 初始化地图
		initialAreaMap : function () {
			var _this = this;

			// 创建一个包含所有区域的地图对象
			_this.areaMap = {};
			_this.areaMapData = {};
			_this.areaMapCircle = {};
            _this.areaMapWater = {};
			// 数组展示对象
			_this.areaDataText={};

			$.each(_this.areaMapDataSource,function (index, value) {

				// 区域数据对象
				_this.areaMapData[_this.mapidPrefix + value.mapId] = {
					mapId : '110000', // mapId
					name : '北京', // 区域名字
					shouli : 1048, // 受理的数
					banjie : 2084, // 已结的数
					banjieList : [], // 办结的列表
					shouliList : [],// 受理的列表  			
					fillColor : _this.areaMapColor[index]
					// 默认填充颜色
				};
				// 判斷区域对象是否存在
				if ($('#' + _this.mapidPrefix + value.mapId + '-outline').length > 0) {
					// 区域对象
					_this.areaMap[_this.mapidPrefix
						 + value.mapId] = _this.snap
						.select('#'+ _this.mapidPrefix+ value.mapId + '-outline');

					var cursor = 'default';
					if(/[0-9]+(0000)$/.test(value.mapId) || /^[A-Za-z]/.test(value.mapId)) {
						cursor = 'pointer';
					}

					_this.areaMap[_this.mapidPrefix+ value.mapId]
					// 设置path的style
					.attr({
						stroke : _this.mapStyle.areaMap.outlineStroke,
                        strokeWidth : _this.mapStyle.areaMap.strokeWidth,
                        fill : _this.mapStyle.areaMap.outlineFill,
                        cursor : cursor,
                        display:'block'
					})
					// 将数据加到对象中去
					.data(
						'data',
						_this.areaMapData[_this.mapidPrefix
							 + value.mapId]);

				} else {
					// 因一个上海点没写出错，o(︶︿︶)o 唉 ，赶紧自己报错吧
					if (_this.isShowErrorLog) {
						console.error(value.mapId + '-outline不存在')
					}

				}
				// 判斷区域圓对象是否存在
				if ($('#' + _this.mapidPrefix + value.mapId + '-circle').length > 0) {  
					// 区域圆心对象
					_this.areaMapCircle[_this.mapidPrefix + value.mapId] = _this.snap.select('#' + _this.mapidPrefix	 + value.mapId + '-circle');
					_this.areaMapCircle[_this.mapidPrefix + value.mapId]
					// 设置circle的style
					.attr({
						fill : _this.mapStyle.circle.shouliFill,
						r : _this.mapStyle.circle.r,
						pointerEvents : 'none',
						display:'none'
					})
					// 将数据加到对象中去
					.data('data',_this.areaMapData[_this.mapidPrefix + value.mapId]).appendTo(_this.snap);

                    var waterPoints = {
                        x: _this.areaMapCircle[_this.mapidPrefix + value.mapId].attr('cx'),
                        y: _this.areaMapCircle[_this.mapidPrefix + value.mapId].attr('cy')
                    };
                    var waterSnap = _this.creatOperateSvg(value.mapId, waterPoints);
                    
                
                    var color = _this.mapStyle.circle.shouliFill;
                    var waterOptions = {
                        x : 0, // 水滴的位置x
                        y : 0, // 水滴的位置y
                        fill : color, // 水滴的填充颜色
                        stroke : color, // 水滴的边框颜色
                        'pointer-events' : 'none'
                    };
                    _this.areaMapWater[_this.mapidPrefix + value.mapId] = _this.drawWater(waterSnap, waterOptions); // 会生成一个对象 例如：
                    _this.areaMapWater[_this.mapidPrefix + value.mapId].attr({
                        display:'none'
                    });
                    var textFill=_this.mapStyle.dataTextStyle.fill;
                   /* if(value.mapId=='120000'||value.mapId=='320000'||value.mapId=='190000'){
                    	textFill='#fff';
                    }*/
					// 创建数据本对象
					_this.areaDataText [_this.mapidPrefix + value.mapId] = _this.snap.el('text',{
						class:'num-shouli-'+value.mapId,
						text:_this.areaMapData[_this.mapidPrefix + value.mapId].shouli,
						x:_this.areaMapCircle[_this.mapidPrefix + value.mapId].attr('cx'),
						y:parseInt(_this.areaMapCircle[_this.mapidPrefix + value.mapId].attr('cy')-_this.mapStyle.dataTextStyle.fontSize*1.3)*1,
						fontSize:_this.mapStyle.dataTextStyle.fontSize+'px',
						fill:textFill,
						filter:_this.snap.filter(_this.mapStyle.dataTextStyle.shadow),
						fontFamily : 'Microsoft YaHei',
						textAnchor : 'middle',
						'pointer-events' : 'none',
						dominantBaseline : 'middle',
						display:'none'
					});

				} else {
					if (_this.isShowErrorLog) {
						console.error(value.mapId + '-circle不存在')
					}
				}

			});

			// 南沙群岛
			if (_this.snap.selectAll('#nansha-outline').length > 0) {
				_this.snap.select('#nansha-outline').attr({
					stroke : _this.mapStyle.areaMap.outlineStroke,
					strokeWidth : _this.mapStyle.areaMap.strokeWidth,
					fill : '#68bdfb'//_this.mapStyle.areaMap.outlineFill
				});
			}

			// 第一次更新数据
			_this.updateData();

			// 创建区域名字(更新完数据才能知道每个区域的信息)
			_this.creatNamText();

			// 是否显示区域名字
			_this.showOrHideNameText();
		},

        // 创建操作地图的新的svg对象
        creatOperateSvg : function (id, points) {
            var _this = this;
            var  id = 'svgMapOperate' + id;
            // 这里需要计算地图的比值，也就是放大或者缩小的比率
            //  当 _this.mapRatio*2 大于1的时候那么，水滴放大后明显在 33*54的容器中显示不全，
            // 所以需要给svg 容器也相应的放大
            
           // console.log('ratio'+_this.mapRatio)
            if(_this.mapRatio*2>1){
            	 var  width=33*_this.mapRatio*2;
                 var  height=35*_this.mapRatio*2;
            }else {
            	//  当 _this.mapRatio*2 小于1的时候那么，水滴是缩小的，比33*54还小，所以 svg 容器就不需要管 
                // 所以需要给svg 容器也相应的放大
            	 var  width=33;
                 var  height=54;	
            }
          
            // 创建操作svg的另外一个svg对象
            var svg = Snap(width, height).attr({
                id : id,
                viewBox: '0  0 '+width +' '+height,
                x: points.x-width/2-1,
                y: points.y-height
            });
            
            // 追加到现在的svg后面
            _this.snap.append(svg);

            return svg;
        },

        // 画水滴
        drawWater : function (snap, options) { // snap 为svg对象。options 为参数设置
            var _this = this;
            var snap = snap; 
            var opts = $.fn.extend(true, {}, {
                id : '180000', // 水滴的id号 id="water180000"
                x : 20, // 水滴的位置x
                y : 30, // 水滴的位置x
                scale : _this.mapRatio*6,   //  因为水滴还是太小了，所以在比率的基数上乘以2	
                data : {
                    mapId : '18000'
                }, // 水滴保存的数据
                fill : '#ffffff', // 水滴的填充颜色
                strokeWidth : 1,
                stroke : '#ffffff'
            }, options || {});
            
           //  水滴形状
            var water = snap.paper.el('path', {
                d : 'M18.957,9.813C18.933,4.389,14.714,0,9.484,0C4.242,0,0,4.389,0,9.813c0,5.542,5.929,13.691,8.396,16.847' +
                'c0.544,0.699,1.586,0.699,2.131,0C13.014,23.507,18.975,15.359,18.957,9.813z',
                strokeWidth : opts.strokeWidth,
                stroke : opts.stroke,
                fill : opts.fill,
                id : 'water' + opts.id,
                transform : 'scale(' + _this.mapRatio*6 + ',' + _this.mapRatio*6 + ',16,54)',
                cursor : 'auto',
                'pointer-events' : 'auto'
            });
           // 放到g标签中，整体移动
            _this['waterGroup' + opts.id] = snap.g(water);
            _this['waterGroup' + opts.id].attr({
            	 transform : 'translate(' + (16*opts.scale) + ',' + (27* opts.scale) + ')'
            }).data('dataObj', opts.data);
            return water;
        },

		creatNamText : function () {
			var _this = this;
			_this.areaMapText = {};
			//20160323 热力图图调整字体大小
			var mapId=localStorage.getItem('mapId');
			var fontSize=_this.mapStyle.textStyle.fontSize;
			//20160323 热力图调整字体大小 end
			var fontSize =_this.mapStyle.textStyle.fontSize;
			$.each(_this.areaMapCircle, function (name, value) {
				_this.areaMapText[name] = _this.snap.paper.el('text', {
						id:'areaMapName-'+name,
						x : parseFloat(value.attr('cx')),
						y : parseFloat(value.attr('cy'))+0.5*fontSize, // +(_this.mapStyle.circle.r*4.5),
						// 处于点的下方
						text : value.data('data').name,
						'font-size' : fontSize +'px',
						fill : _this.mapStyle.textStyle.fill,
						fontFamily : 'Microsoft YaHei',
						textAnchor : 'middle',
						'pointer-events' : 'none',
						dominantBaseline : 'middle',
						visibility : 'hidden'
					});

				if (name == 'mapid-hn0000' || // 华南
					name == 'mapid-hz0000'   // 华中

					)
					{
						_this.areaMapText[name].attr({
							x : parseFloat(value.attr('cx'))+fontSize/2,
							y : parseFloat(value.attr('cy'))+fontSize/2,
							dominantBaseline : 'auto',
							textAnchor : 'middle'
						});

					}
			});

		},

		showOrHideNameText : function () {
			var _this = this;
			$.each(_this.areaMapText, function (name, value) {
				if (_this.isShowNameText) {
					value.attr({
						visibility : 'visible'
					});
				} else {
					value.attr({
						visibility : 'hidden'
					});
				}
			});
		},

		// 增加交互效果
		addAreaMapInteraction : function () {
			var _this = this;

			if (_this.isShowTooltip) {
				var tooltip = $('#' + _this.opts.tooltip.id),
				tooltipTitle = tooltip.find('h3'),
				tooltipContent1Count = tooltip.find('.fd-name-count-01');
				tooltipContent2Count = tooltip.find('.fd-name-count-02');
                var delt = 5;
                var winW = $(window).width();
                var winH = $(window).height();
			}

			$.each(_this.areaMap, function (name, value) {
				
				//热力图 鼠标滑过事件
				value.hover(function (event) {
					if (_this.isShowTooltip) {
						var event = event || window.event;
						tooltipTitle.text(this.data('data').name);
						tooltipContent1Count.text(this.data('data').shouli);
						tooltipContent2Count.text(this.data('data').banjie);
                        //判断是否超出了屏幕的宽度和高度
                        var left = event.pageX;
                        var top = event.pageY;
                        var tipW = tooltip.width();
                        var tipH = tooltip.height();
                        if((left + tipW + delt) > winW) {
                            left = winW - tipW - delt;
                        }
                        if((top + tipH + delt) > winH) {
                            top = winH - tipH - delt;
                        }

						tooltip.css({
							left : left,
							
							top : top
						}).show();
					}
					if (this.selectAll('path').length > 0) {
						if(_this.isshouli) {
							this.selectAll('path').attr({
								fill : _this.mapStyle.areaMap.xsHoverFill
							});
						} else {
							this.selectAll('path').attr({
								fill : _this.mapStyle.areaMap.yjHoverFill
							});
						}
					} else {
						if(_this.isshouli) {
							this.attr({
								fill : _this.mapStyle.areaMap.xsHoverFill
							});
						} else {
							this.attr({
								fill : _this.mapStyle.areaMap.yjHoverFill
							});
						}
					}

					//案件数颜色变为hoverFill的颜色
					if(name=='mapid-190000'||name=='mapid-120000'||name=='mapid-320000'){
						_this.areaDataText [name].attr({
							//fill: '#fff'
						});
					}else{
						_this.areaDataText [name].attr({
							fill: _this.mapStyle.dataTextStyle.hoverFill
						});
					}
					
					

					//地名颜色变为hoverFill的颜色
					if(name=='mapid-190000'//山东
						||name=='mapid-120000'//天津
						||name=='mapid-522900'//兵团4师
						||name=='mapid-523400'){//兵团9师
						_this.areaMapText[name].attr({
							//fill: '#fff'
						});
					}else{
						_this.areaMapText[name].attr({
							fill: _this.mapStyle.textStyle.hoverFill
						});
					}
					

					// 判断是不是新疆这块区域
					if (value.data('data').mapId == '520000'
						 || value.data('data').mapId == '480000') {
						value.attr({
							opacity : 0.001
						});
					}

				},
				//鼠标移出事件
				function () {
					var areaCount = 0;

					if (_this.isshouli) {
						areaCount = value.data('data').shouli;

					} else {
						areaCount = value.data('data').banjie;

					}
					// 判断数据量的大小，决定是否置灰
					if (areaCount < _this.areaMapMinValue || areaCount > _this.areaMapMaxValue) {
						if (this.selectAll('path').length > 0) {
							this.selectAll('path').attr({
								fill : _this.opts.setGray
							});
						} else {
							this.attr({
								fill : _this.opts.setGray
							});
						}
					} else {
						if (this.selectAll('path').length > 0) {
							this.selectAll('path').attr({
								fill : value.data('data').fillColor
							});
						} else {
							this.attr({
								fill : value.data('data').fillColor
							});
						}
					}
					if (tooltip.is(':visible')) {
						// 隐藏提示框
						tooltip.hide();
					};

					// 判断是不是新疆这块区域
					if (value.data('data').mapId == '520000'
						 || value.data('data').mapId == '480000') {
						value.attr({
							fill : 'rgba(0,0,0,0.1)'
						});
					};
							
					if(_this.areaDataText [name]){
						if(name=='mapid-190000'||name=='mapid-120000'||name=='mapid-320000'||name=='mapid-523400'){
							_this.areaDataText [name].attr({
								//fill: 'rgba(255,255,255,1)'
							});
						}else{
							//案件数颜色变为fill的颜色
							_this.areaDataText [name].attr({
								fill: _this.mapStyle.dataTextStyle.fill
							});
						}
					
					};
					
					if(_this.areaMapText[name]){
						//地名颜色变为fill的颜色
						if(name=='mapid-190000'||name=='mapid-120000'||name=='mapid-522900'){
							_this.areaMapText [name].attr({
								//fill: 'rgba(255,255,255,1)'
							});
						}else{
							_this.areaMapText[name].attr({
								fill: _this.mapStyle.textStyle.fill
							});
						}
						
					};
					

					

				}).mousemove(function (event) {
					if (_this.isShowTooltip) {
						var event = event || window.event;
						if (tooltip.is(':visible')) {
                            //判断是否超出了屏幕的宽度和高度
                            var left = event.pageX;
                            var top = event.pageY;
                            var tipW = tooltip.width();
                            var tipH = tooltip.height();
                            left += 20;
                            if((left + tipW + delt) > winW) {
                                left = winW - tipW - delt;
                            }
                            if((top + tipH + delt) > winH) {
                                top = winH - tipH - delt;
                            }
							tooltip.css({
								left : left,
								top : top
							});
						}
					}
				}).click(
					function (event) {
					var event = event || window.event;
					var _that = this;

					// 点击之后的回调函数
					_this.clickCallback(
						event,
						_that,
						_that
						.data('data'));
				});

			});
			// 判断是不是新疆这块区域
			if (_this.snap.select('#xinjiang-group')) {
				_this.snap.select('#xinjiang-group').hover(function () {
					if(_this.isshouli) {
						_this.snap.select('#xinjiang-outline').attr({
							fill : _this.mapStyle.areaMap.xsHoverFill
						});
					} else {
						_this.snap.select('#xinjiang-outline').attr({
							fill : _this.mapStyle.areaMap.yjHoverFill
						});
					}
				},function () {
					var areaCount = 0;
					if (_this.isshouli) {
						areaCount = _this.snap.select('#mapid-520000-outline').data('data').shouli;
					} else {
						areaCount = _this.snap.select('#mapid-520000-outline').data('data').banjie;

					}

					if (areaCount < _this.areaMapMinValue|| areaCount > _this.areaMapMaxValue) {
						_this.snap.select('#xinjiang-outline').attr({
							fill : _this.opts.setGray
						});

					} else {
						_this.snap.select('#xinjiang-outline').attr({
							fill : _this.snap.select('#mapid-520000-outline').data('data').fillColor
						});
					}
				});
			}

		},

		updateData : function (dataSource, dataRange) {
			var _this = this;
			var dataSource = dataSource;
			// 更新对象, 判断对象是不是等于
			if (dataSource && $.type(dataSource) == 'Array'
				 && dataSource.length == _this.dataRangeSize) {
				_this.areaMapDataSource = dataSource;
			} else {
				_this.areaMapDataSource = _this.areaMapDataSource;
			}

			$.each(_this.areaMapDataSource, function (index, value) {
				// 更新所有数据对象
				_this.areaMapData[_this.mapidPrefix + value.mapId].mapId = $.trim(value.mapId);
				_this.areaMapData[_this.mapidPrefix + value.mapId].name = $.trim(value.name);
				_this.areaMapData[_this.mapidPrefix + value.mapId].shouli = Number(value.shouli);
				_this.areaMapData[_this.mapidPrefix + value.mapId].banjie = Number(value.banjie);
		    	//_this.areaMapData[_this.mapidPrefix + value.mapId].shouliadd = Number(value.shouliadd);
				//_this.areaMapData[_this.mapidPrefix + value.mapId].banjieadd = Number(value.banjieadd);
				_this.areaMapData[_this.mapidPrefix + value.mapId].banjieList = value.banjieList; // 是否全区域未连接
				_this.areaMapData[_this.mapidPrefix + value.mapId].shouliList = value.shouliList; // 单个法院未链接列表
				//_this.areaMapData[_this.mapidPrefix + value.mapId].ahList = value.ahList; // 新增和已结的信息表

			});

			// 改变值区域 （在对每个区域填充颜色之前）
			+function() {
				var dataRange = dataRange;
				if ($.type(dataRange) == 'array' && dataRange.length == _this.dataRangeSize) {
					var flag = true;
					$.each(dataRange, function (index, value) {
						if ($.type(value) !== 'number') {
							flag = false;
						}
					});
					if (flag) {
						_this.areaMapDataRange = dataRange;
					}
				} else {
					if (_this.dataRangeAuto) {
						// 设置值区域
						_this.setAreaMapDataRange();
					}
				}
			}();

			// 修改填充颜色
			_this.mendAreaMapFillColor();

			// 设置每个区域的颜色
			_this.setAreaMapFillColor();

			// 如果显示数据文本
			if(_this.isShowDataText){
				_this.updateDataText()
			}

		},
		// 设置最小值
		setMinValue : function (value) {
			var _this = this;
			if ($.type(value) == 'number' && (!isNaN(value))) {
				_this.areaMapMinValue = value;

				_this.setAreaMapFillColor(_this.areaMap);
			}
		},

		// 设置最大值
		setMaxValue : function (value) {
			var _this = this;
			if ($.type(value) == 'number' && (!isNaN(value))) {
				_this.areaMapMaxValue = value;

				_this.setAreaMapFillColor(_this.areaMap);

			}
		},

		// 设置值区域
		setAreaMapDataRange : function () {
			var _this = this;

			// 追加到数组
			_this.rangeArray = [];

			$.each(_this.areaMapData, function (name, value) {
				_this.isshouli ? _this.rangeArray.push(value.shouli)
				 : _this.rangeArray.push(value.banjie);

			});

			// 从小到大排序
			if (_this.isSortMinToMax) {
				// 数组排序
				_this.rangeArray = _this.rangeArray
					.sort(function (a, b) {
						return a - b;
					});

			} else {
				// 数组排序
				_this.rangeArray = _this.rangeArray
					.sort(function (a, b) {
						return b - a;
					});
			};
			// 赋值
			_this.areaMapDataRange = _this.rangeArray;

		},

		// 修改每个区域的填充颜色方法
		mendAreaMapFillColor : function () {
			var _this = this;
			// 修改每个区域的填充颜色
			$.each(_this.areaMapData,function (name, value) {
				var _value = value;
				var areaCount = 0;

				if (_this.isshouli) {
					areaCount = _value.shouli;
				} else {
					areaCount = _value.banjie;
				};

				// 循环区间,传进来的值与每个区间的值进行比较
				$.each(
					_this.areaMapDataRange,
					function (index, value) {

					// 如果当前值大于区间值或者等于当前值
					if (areaCount < value || areaCount == value) {

						// 如果当前区间值不为区间第一个值，那么该值应该大于该区间的前面一个值，否则颜色值直接为第一个
						if (typeof _this.areaMapDataRange[index - 1] !== 'undefined'
							 && areaCount > _this.areaMapDataRange[index - 1]) {
							_value.fillColor = _this.areaMapColor[index];

						} else {
							_value.fillColor = _this.areaMapColor[0];
						}
						return false; // 不再循环
					}
				});
			});

		},

		// 设置每个区域的颜色
		setAreaMapFillColor : function () {
			var _this = this;

			$.each(_this.areaMap, function (name, value) {
				var value = value;
				var areaCount = 0;
				
				if (_this.isshouli) {
					areaCount = value.data('data').shouli;
					if(_this.areaMapWater[name]){
						//设置水滴的颜色
						_this.areaMapWater[name].attr({
							stroke: _this.mapStyle.circle.shouliFill,
							fill: _this.mapStyle.circle.shouliFill
						});
					}
					
				} else {
					areaCount = value.data('data').banjie;
					if(_this.areaMapWater[name]){
						//设置水滴的颜色
						_this.areaMapWater[name].attr({
							stroke: _this.mapStyle.circle.banjieFill,
							fill: _this.mapStyle.circle.banjieFill
						});
					}
				}

				// 判断数据量的大小，决定是否置灰 (小于最小值或者大于最大值)
				if (areaCount < _this.areaMapMinValue || areaCount > _this.areaMapMaxValue) {

					if (value.selectAll('path').length > 0) {
						value.selectAll('path').attr({
							fill : _this.opts.setGray,
							stroke : _this.opts.setGrayStroke
						});
					} else {
						value.attr({
							fill : _this.opts.setGray,
							stroke : _this.opts.setGrayStroke
						});
					}

					// 判断是不是新疆这块区域
					if (value.data('data').mapId == '520000' || value.data('data').mapId == '480000') {
						value.attr({
							fill : 'rgba(0,0,0,0.01)',
							stroke : 'none'
						});
					}
					// 设置置灰
					if (name == 'mapid-480000') {

						if (_this.snap.select('#xinjiang-outline')) {
							_this.snap.select('#xinjiang-outline').attr({
								fill : _this.opts.setGray,
								stroke : _this.opts.setGrayStroke
							})
						}

					}

				} else {

					// 不置灰就用data里保留的颜色
					if (value.selectAll('path').length > 0) {
						value.selectAll('path').attr({
							fill : value.data('data').fillColor,
							stroke : _this.mapStyle.areaMap.outlineStroke
						});
					} else {
						value
						.attr({
							fill : value.data('data').fillColor,
							stroke : _this.mapStyle.areaMap.outlineStroke
						});
					}

					// 设置颜色
					if (value.data('data').mapId == '520000' || value.data('data').mapId == '480000') {
						if (_this.snap.select('#xinjiang-outline')) {
							_this.snap.select('#xinjiang-outline').attr({
								fill : value.data('data').fillColor,
								stroke : value.outlineStroke
							});
						}
					}

					// 判断是不是新疆这块区域
					if (value.data('data').mapId == '520000' || value.data('data').mapId == '480000') {
						value.attr({
							fill : 'rgba(0,0,0,0.01)',
							stroke : 'none'
						});
					}

				}

			});

		},

		showDataText : function () {
			var _this = this;

			// 先更新数据
			_this.updateDataText();

			//  七大区域的
			if (_this.isShowDataText) {

				//  七大区域
				if (_this.isSeventArea) {

					// 先隐藏文本，因为七大区域显示和其他的不一样，需要移除dom
					_this.hideDataText();

					$.each(_this.areaMapCircle,function (name, value) {
						var value = value;
						var lineY2Num = 700;
						switch(name){
							case  _this.mapidPrefix + 'xb0000':
								lineY2Num = 800;
								break;
							case  _this.mapidPrefix + 'hd0000':
								lineY2Num = 1000;
								break;
							case  _this.mapidPrefix + 'xn0000':
								lineY2Num = 600;
								break;
							case  _this.mapidPrefix + 'hn0000':
								lineY2Num = 500;
								break;

							default  :
								// 默认值
								break;
						}

						var x1 = parseInt(value.attr('cx')) + 80;
						var y1 = parseInt(value.attr('cy')) - 150;
						var x2 = parseInt(value.attr('cx')) + 80;
						var y2 = parseInt(value.attr('cy')) - 150;

						// 画圆
						_this.snap.paper.el('circle', {
							cx : x1,
							cy : y1,
							r : 50,
							fill : '#fff',
							id : name + 'CircleAj'
						});
						var fontSize=82;
						if(!global.checkIE()){
							fontSize =82*1.5;
						}
						_this.snap.paper.el('line', {
							x1 : x1,
							y1 : y1,
							x2 : x2,
							y2 : y2,
							id : name
							 + 'Line',
							strokeDasharray : '5,5',
							strokeWidth : '5',
							stroke : '#fff'
						}).animate({
							x1 : x1,
							y1 : y1,
							x2 : x2,
							y2 : y2
							 - lineY2Num
						},500,mina.linear,function () {

							var lineX1 = x1;
							var lineY1 = y1;
							var textOffsetX = 30;
							var rectWidth = 800;

							_this.snap.paper.el('rect', {
								x : lineX1,
								y : lineY1 - lineY2Num,
								width : rectWidth,
								height : 150,
								id : name + 'Rect',
								fill : '#fff45c'
							});

							_this.snap.paper.el(
								'text', {text : '受理：' + value.data('data').shouli,
								x : lineX1 + textOffsetX,
								y : lineY1 - (lineY2Num - 90),
								'font-size' : fontSize+'px',
								fill : '#000',
								id : name + 'shouli',
								fontFamily : 'Microsoft YaHei',
								'dominant-baseline' : 'middle',
								fontStyle : 'italic'
							});

							_this.snap.paper.el('text', {
								text : '已结：' + value
								.data('data').banjie,
								x : lineX1 + textOffsetX,
								y : lineY1 - (lineY2Num - 260),
								'font-size' : fontSize+'px',
								fill : '#62f562',
								id : name + 'banjie',
								fontFamily : 'Microsoft YaHei',
								'dominant-baseline' : 'middle',
								fontStyle : 'italic',
								filter : _this.snap.paper
								.filter(Snap.filter.shadow(0,0,50,'rgba(0,0,0,1)'))
							});

						});

					});

				} else {

					$.each(_this.areaMapCircle,function (name, value) {
						var _name=name;
						// 圆圈
						value.attr({
							display :'none'
						});
                       //水滴进行展现
                        _this.areaMapWater[_name].attr({
                            display :'block'
                        });
						// 数据
						_this.areaDataText[_name].attr({
							display :'block'
						});
					});

				}

			}
		},


		updateDataText : function () {
			var _this = this;

			//  七大区域
			if (_this.isSeventArea) {
				$.each(_this.areaMap,function (name, value) {
					var value = value;
					//  更新数据
					if ($(_this.snap.select('#' + name + 'shouli')).length) {
						_this.snap.select('#' + name + 'shouli').attr({
							text : '受理：' + value.data('data').shouli
						});
					}
					if ($(_this.snap.select('#' + name + 'banjie')).length) {
						_this.snap	.select('#' + name + 'banjie')
						.attr({
							text : '已结：' + value.data('data').banjie
						});
					}
				});

			//  其他区域
			}else{

				// 数据显示
				$.each(_this.areaMapCircle,function (name, value) {
					var _name = name;

					//  如果是受理，显示受理的数据和受理的颜色
					if(_this.isshouli){
						value.attr({
							fill : _this.mapStyle.circle.shouliFill
						});

						if(parseInt(_this.areaMapData[_name].shouli) == parseInt(_this.areaDataText[_name].attr('text'))) {
							return;
						}
						var text = _this.areaDataText[_name].clone().attr({
							text: _this.areaMapData[_name].shouli
						});
						_this.areaDataText[_name].remove();
						_this.areaDataText[_name] = text;

				   //  如果是已结，显示已结的数据和已结的颜色
					}else{
						value.attr({
							fill : _this.mapStyle.circle.banjieFill
						});

						if(parseInt(_this.areaMapData[_name].banjie) == parseInt(_this.areaDataText[_name].attr('text'))) {
							return;
						}
						var text = _this.areaDataText[_name].clone().attr({
							text:_this.areaMapData[_name].banjie
						});
						_this.areaDataText[_name].remove();
						_this.areaDataText[_name] = text;
					}

				});

			}
		},
		hideDataText : function () {
			var _this = this;

			if (_this.isSeventArea) {
				$.each(_this.areaMapCircle,function (name, value) {
					var value = value;
					//  删除圆
					if (_this.snap.select('#' + name + 'CircleAj')) {
						_this.snap.select('#' + name + 'CircleAj').remove();
					};
					//  删除线
					if (_this.snap.select('#' + name + 'Line')) {
						_this.snap.select('#' + name + 'Line').remove();
					};
					// 删除矩形
					if (_this.snap.select('#' + name + 'Rect')) {
						_this.snap.select('#' + name + 'Rect').remove();
					};
					// 删除受理文字
					if (_this.snap.select('#' + name + 'shouli')) {
						_this.snap.select('#' + name + 'shouli').remove();
					}
					// 删除已结文字
					if (_this.snap.select('#' + name + 'banjie')) {
						_this.snap.select('#' + name + 'banjie').remove();
					}
				});
			}else {

				// 数据隐藏
				$.each(_this.areaMapCircle,function (name, value) {
					var _name=name;
					// 圆圈隐藏
					value.attr({
						display :'none'
					});
					 //水滴进行隐藏
                    _this.areaMapWater[_name].attr({
                        display :'block'
                    });
					// 数据隐藏
					_this.areaDataText[_name].attr({
						display :'none'
					});

				});
			}

		},
		creatTipBox : function () {
			var _this = this;
			// 合并参数
			var style = $.fn.extend(true, {
					position : 'absolute',
					left : 0,
					top : 0,
					zIndex : '999',
					color : '#fff',
					'font-size' : '13px',
					fontFamily : 'Microsoft YaHei',
					lineHeight : '1.5em',
					backgroundColor : 'rgba(0,0,0,0.8)',
					borderColor : '#408fc3',
					borderRadius : '5px',
					padding : '5px 8px',
					whiteSpace : 'nowrap',
					display : 'none'

				}, _this.opts.tooltip.style || {});
			$(
				'<div id='
				 + _this.opts.tooltip.id
				 + '>'
				 + '<h3 style="white-space:nowrap;font-size:14px;display:none;">西北</h3>'
				 + '<p  style="white-space:nowrap;"><span class="fd-name-01">受理</span>：<span  class="fd-name-count-01">0</span></p>'
				 + '<p  style="white-space:nowrap;"><span class="fd-name-02">办结</span>：<span  class="fd-name-count-02">0</span></p>'
				 + '</div>').css(style).appendTo('body');
			if (_this.opts.tooltip.showHead) {
				$('#' + _this.opts.tooltip.id).find('h3').show();
			}

		},
		removeTipBox : function () {
			var _this = this;
			if ($('#' + _this.opts.tooltip.id).length > 0) {
				$('#' + _this.opts.tooltip.id).remove();
			}
		},
		destory : function () {
			var _this = this;
			//  销毁new 出来的对象
			_this = null;
			// console.log('mymap对象被销毁了');
		}
	};

	return new OperateMap();

});
