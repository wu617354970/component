/**
version：	 2015.01.01
creatTime 	 2015.11.12
updateTime 	 2015.11.12
author		 wuwg
type		 jrdt-map-operate-china.js
 */
require([ 'operateAreaMap', 'global','jrdt-area-map-function'], function ( 
		operateAreaMap, global, jrdtAreaMap) {
	/***********
	  params：   声明请求的变量
	 * success   :  后台返回的 true 或者false , false 的话不进行页面刷新
	 * message   ： 后台返回异常信息，如果成功可以为空
	 * result    ： 返回对象
	 * mapDataList    :      地图数据列表
	 * areaMapColor ：    地图颜色
	 * myMap    ： 地图对象
	 * timer    ： 间隔调用时间轴
	 **********/
	var success,
		message,
		result,
		mapDataList=[],
		myMap = null;
    var gradient1 = new jrdtAreaMap.GradientColor('#6310ee','#1407bc', 40); // 渐变颜色 2016.05.16修改热力图颜色深色和浅色相反 
	var gradient2 = new jrdtAreaMap.GradientColor('#1407bc','#0abcdd', 40); // 渐变颜色 2016.05.16修改热力图颜色深色和浅色相反 
	var gradient3 = new jrdtAreaMap.GradientColor('#0abcdd','#01b439', 40); // 渐变颜色 2016.05.16修改热力图颜色深色和浅色相反 
	var gradient4 = new jrdtAreaMap.GradientColor('#01b439','#fffc00', 40); // 渐变颜色 2016.05.16修改热力图颜色深色和浅色相反 
	var gradient5 = new jrdtAreaMap.GradientColor('#fffc00','#e70000', 40); // 渐变颜色 2016.05.16修改热力图颜色深色和浅色相反 
	var gradientArray=[gradient1,gradient2,gradient3,gradient4,gradient5];
	var gradient=[];
	for(var  i=0; i<5;i++){
		 Array.prototype.push.apply(gradient,gradientArray[i]);
	};
	
	var areaMapColor = []; //存放颜色数组
	function getAreaMapColor(colorStep) {
		areaMapColor = []; //存放颜色数组
		for (var i = 0; i < colorStep; i++) {
			(function (i) {
				var index = Math.floor(200 / (colorStep - 1)) * i;
				if (index > 200 || index === 200) {
					areaMapColor.push(gradient[199]);
				} else {
					areaMapColor.push(gradient[index]);
				}
			})(i);
		}
		//把颜色rgba化
		areaMapColor = $.map(areaMapColor, function (element, index) {
				element = element.substring(0, 3) + 'a' + element.substring(3, element.indexOf(')')) + ',1)';
				return element;
			});
	};
	// 获取总共的颜色值，默认七个
	getAreaMapColor(7);
	
	// 初始化地图
	function initMap(url, mapDataList,  initialPage) {
		"user strict";
		//  是否是初始化页面
		var initialPage = initialPage ? initialPage : false;
	
		
		if (initialPage) {
			//  地图对象
			var myMap = operateAreaMap;	
			// 设置地图，无论是ajax加载还是从localstorage中加载都走这个方法
			function setSvgMap(response){
					//  如果存在地图对象那么得销毁
				if (myMap) {
					//  销毁对象
					myMap.destory();
					myMap = null;
				}
				
				// 地图加载完毕
				$("#map").html(response);

				var snap = Snap('#svgMap');

				snap.attr({
					width : '100%',
					height : '100%',
					'visibility' : 'hidden'
				});

				// 重新new出一个新的map对象
				myMap = operateAreaMap;

				// 更新颜色区间  
				getAreaMapColor(mapDataList.length);

				//  创建map数据
				myMap.setOptions({
					snap : snap,
					areaMapColor : areaMapColor,
					series : {
						data : mapDataList
					},
					clickCallback : function (event, _this, dataList) {
						var   mapid=dataList.mapId;
						
						console.log(mapid)
					//	console.log($('#svgMapOperate'+mapid).size())
					console.log($('#svgMapOperate'+mapid).find('path').size())
						$('#svgMapOperate'+mapid).find('path').css({
							display:'block'
						});
					}
				});
				// 更新数据
				myMap.updateData(mapDataList);

			};
			var  startMapIdIndex=url.lastIndexOf('mapid-');
			
		    var  mapId=url.substr(startMapIdIndex+6,6);
		    
			if(!!global.findLocalStorage('svgMap'+mapId)){	
				// 加载动画
				global.loading();
				 //  获取svg地图	
				var  response=global.findLocalStorage('svgMap'+mapId);
				//地图加载成功后进行的操作
				setSvgMap(response);
				// 完成动画
				global.removeLoading();	
				
			}else {
				$.ajax({
					type : "GET",
					url : url,
					data : null,
					dataType : 'text',
					beforeSend:function(){
						global.loading();
					},
					complete:function(){
						global.removeLoading();	
					},
					success : function (response) {
						var  startMapIdIndex=url.lastIndexOf('mapid-');
						var  mapIdName=url.substring(startMapIdIndex+6,6);
						//  储存svg地图	
						global.saveLocalStorage(('svgMap'+mapIdName),response);
						//地图加载成功后进行的操作
						setSvgMap(response);				
					},
					error : function (info) {
						throw new Error('加载地图失败' + info);
					}
				});
				
			}
			
		} else {
			myMap.updateData(mapDataList);
		}

	}


	//  刷新页面函数
	function refreshPage(url,mapUrl,initialPage,parameter) {
		$.ajax({
			type : 'get',
			url :url ,
			dataType : 'json',
			data :parameter,  //  传入到后台的数据
			success : function (response, status, xrh) {
            var response = response,
				success = response.success,
				message = response.message;
				// 后台查询数据成功
				if (success) {
					result = response.result;
					mapDataList = result.mapDataList; //地图数据列表
		
					// 初始化地图的数据
					initMap(mapUrl, mapDataList,initialPage);

				} else {
					throw new Error('后台请求数据为空：' + message)
				}
			},
			error : function (response, status, xrh) {	
					throw new Error('后台请求数据不成功，错误信息：' + status)
			}
		});
		console.log(parameter)
	};
	
	  refreshPage('json/mapid-110000.json','svg/mapid-110000.svg',true,{"ywlb":"1","tjqType":'2',"corp":"3"});	
	//  间隔调用刷新页面
	setInterval(function(){
		// refreshPage('json/mapid-110000.json','svg/mapid-110000.svg',true);
		 
	 },global.intervalTime);
	 //点击刷新
	 $("#fd-btn").click(function(){
	 	refreshPage('json/mapid-110000.json','svg/mapid-110000.svg',true,{"ywlb":"1","tjqType":'2',"corp":"66"});	
	 })

});