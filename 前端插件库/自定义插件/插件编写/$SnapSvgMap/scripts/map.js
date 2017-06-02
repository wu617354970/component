/*map*/
(function () {
	/**************************************************************
	 *  时间参数说明
	 *  动画效果：  当水滴升起来的时候，小水滴聚集，小水滴生起
	 *  小水滴升起时间 =小水滴聚集的时间
	 *  刷新数据的时间> （小水滴聚集的时间+小水滴聚集的时间/4）
	 ****************************************************************/
	var minCircle = [];
	var maxCircle = [];
	function getMincircle() {
		$("#map circle:not([r=5])").each(function () {
			var _this = $(this);
			_this.data({
				"dataCount" : _this.data("dataCount") ? _this.data("dataCount") : 0,
				"title" : _this.data("title") ? _this.data("title") : "beijing"
			});
			var obj = {
				x : _this.attr("cx"),
				y : _this.attr("cy"),
				dataCount : _this.data("dataCount"),
				"title" : _this.data("title")
			};
			minCircle.push(obj);
		});
	};
	
	$("#map circle").filter("[r=5]").each(function () {
		var _this = $(this);
		_this.data({
			"dataCount" : _this.data("dataCount") ? _this.data("dataCount") : 300
		});
		var obj = {
			x : _this.attr("cx"),
			y : _this.attr("cy"),
		};
		maxCircle.push(obj);
	});

	// 创建流动水对象 共31个
	var FluidWater1 = {
		shanxi : new DrawFluidWater("#map", {
			id : "shanxi",
			x : $("#map circle[data-title='山西']").attr("cx"),
			y : $("#map circle[data-title='山西']").attr("cy"),
			clipId1 : "clipId1",
			clipId2 : "clipId1-1",
		}),
		liaoning : new DrawFluidWater("#map", {
			id : "liaoning",
			x : $("#map circle[data-title='辽宁']").attr("cx"),
			y : $("#map circle[data-title='辽宁']").attr("cy"),
			clipId1 : "clipId2",
			clipId2 : "clipId2-1",
		}),
		jilin : new DrawFluidWater("#map", {
			id : "jilin",
			x : $("#map circle[data-title='吉林']").attr("cx"),
			y : $("#map circle[data-title='吉林']").attr("cy"),
			clipId1 : "clipId3",
			clipId2 : "clipId3-1",
		}),
		heilongjiang : new DrawFluidWater("#map", {
			id : "heilongjiang",
			x : $("#map circle[data-title='黑龙江']").attr("cx"),
			y : $("#map circle[data-title='黑龙江']").attr("cy"),
			clipId1 : "clipId4",
			clipId2 : "clipId4-1",
		}),
		shandong : new DrawFluidWater("#map", {
			id : "shandong",
			x : $("#map circle[data-title='山东']").attr("cx"),
			y : $("#map circle[data-title='山东']").attr("cy"),
			clipId1 : "clipId5",
			clipId2 : "clipId5-1",
		}),
		henan : new DrawFluidWater("#map", {
			id : "henan",
			x : $("#map circle[data-title='河南']").attr("cx"),
			y : $("#map circle[data-title='河南']").attr("cy"),
			clipId1 : "clipId6",
			clipId2 : "clipId6-1",
		}),
		anhui : new DrawFluidWater("#map", {
			id : "anhui",
			x : $("#map circle[data-title='安徽']").attr("cx"),
			y : $("#map circle[data-title='安徽']").attr("cy"),
			clipId1 : "clipId7",
			clipId2 : "clipId7-1",
		}),
		jiangsu : new DrawFluidWater("#map", {
			id : "jiangsu",
			x : $("#map circle[data-title='江苏']").attr("cx"),
			y : $("#map circle[data-title='江苏']").attr("cy"),
			clipId1 : "clipId8",
			clipId2 : "clipId8-1",
		}),
		shanghai : new DrawFluidWater("#map", {
			id : "shanghai",
			x : $("#map circle[data-title='上海']").attr("cx"),
			y : $("#map circle[data-title='上海']").attr("cy"),
			clipId1 : "clipId8",
			clipId2 : "clipId9-1",
		}),
		zhejiang : new DrawFluidWater("#map", {
			id : "zhejiang",
			x : $("#map circle[data-title='浙江']").attr("cx"),
			y : $("#map circle[data-title='浙江']").attr("cy"),
			clipId1 : "clipId10",
			clipId2 : "clipId10-1",
		}),
		jiangxi : new DrawFluidWater("#map", {
			id : "jiangxi",
			x : $("#map circle[data-title='江西']").attr("cx"),
			y : $("#map circle[data-title='江西']").attr("cy"),
			clipId1 : "clipId11",
			clipId2 : "clipId11-1",
		}),
		fujian : new DrawFluidWater("#map", {
			id : "fujian",
			x : $("#map circle[data-title='福建']").attr("cx"),
			y : $("#map circle[data-title='福建']").attr("cy"),
			clipId1 : "clipId12",
			clipId2 : "clipId12-1",
		}),
		guangdong : new DrawFluidWater("#map", {
			id : "guangdong",
			x : $("#map circle[data-title='广东']").attr("cx"),
			y : $("#map circle[data-title='广东']").attr("cy"),
			clipId1 : "clipId13",
			clipId2 : "clipId13-1",
		}),
		hainan : new DrawFluidWater("#map", {
			id : "hainan",
			x : $("#map circle[data-title='海南']").attr("cx"),
			y : $("#map circle[data-title='海南']").attr("cy"),
			clipId1 : "clipId14",
			clipId2 : "clipId14-1",
		}),
		guangxi : new DrawFluidWater("#map", {
			id : "guangxi",
			x : $("#map circle[data-title='广西']").attr("cx"),
			y : $("#map circle[data-title='广西']").attr("cy"),
			clipId1 : "clipId15",
			clipId2 : "clipId15-1",
		}),
		yunnan : new DrawFluidWater("#map", {
			id : "yunnan",
			x : $("#map circle[data-title='云南']").attr("cx"),
			y : $("#map circle[data-title='云南']").attr("cy"),
			clipId1 : "clipId16",
			clipId2 : "clipId16-1",
		}),
		xizang : new DrawFluidWater("#map", {
			id : "xizang",
			x : $("#map circle[data-title='西藏']").attr("cx"),
			y : $("#map circle[data-title='西藏']").attr("cy"),
			clipId1 : "clipId17",
			clipId2 : "clipId17-1",
		}),
		xinjiang : new DrawFluidWater("#map", {
			id : "xinjiang",
			x : $("#map circle[data-title='新疆']").attr("cx"),
			y : $("#map circle[data-title='新疆']").attr("cy"),
			clipId1 : "clipId18",
			clipId2 : "clipId18-1",
		}),
		gansu : new DrawFluidWater("#map", {
			id : "gansu",
			x : $("#map circle[data-title='甘肃']").attr("cx"),
			y : $("#map circle[data-title='甘肃']").attr("cy"),
			clipId1 : "clipId19",
			clipId2 : "clipId19-1"
		}),
		qinghai : new DrawFluidWater("#map", {
			id : "qinghai",
			x : $("#map circle[data-title='青海']").attr("cx"),
			y : $("#map circle[data-title='青海']").attr("cy"),
			clipId1 : "clipId20",
			clipId2 : "clipId20-1"
		}),
		sichuan : new DrawFluidWater("#map", {
			id : "sichuan",
			x : $("#map circle[data-title='四川']").attr("cx"),
			y : $("#map circle[data-title='四川']").attr("cy"),
			clipId1 : "clipId21",
			clipId2 : "clipId21-1"
		}),
		
		chongqing : new DrawFluidWater("#map", {
			id : "jilin",
			x : $("#map circle[data-title='重庆']").attr("cx"),
			y : $("#map circle[data-title='重庆']").attr("cy"),
			clipId1 : "clipId22",
			clipId2 : "clipId22-1"
		}),
		 guizhou : new DrawFluidWater("#map", {
			id : "guizhou",
			x : $("#map circle[data-title='贵州']").attr("cx"),
			y : $("#map circle[data-title='贵州']").attr("cy"),
			clipId1 : "clipId23",
			clipId2 : "clipId23-1"
		}), 
		hunan : new DrawFluidWater("#map", {
			id : "hunan",
			x : $("#map circle[data-title='湖南']").attr("cx"),
			y : $("#map circle[data-title='湖南']").attr("cy"),
			clipId1 : "clipId24",
			clipId2 : "clipId24-1"
		}),
		hubei : new DrawFluidWater("#map", {
			id : "hubei",
			x : $("#map circle[data-title='湖北']").attr("cx"),
			y : $("#map circle[data-title='湖北']").attr("cy"),
			clipId1 : "clipId25",
			clipId2 : "clipId25-1"
		}),
		sshanxi : new DrawFluidWater("#map", {
			id : "sshanxi",
			x : $("#map circle[data-title='陕西']").attr("cx"),
			y : $("#map circle[data-title='陕西']").attr("cy"),
			clipId1 : "clipId26",
			clipId2 : "clipId26-1"
		}),
		ningxia : new DrawFluidWater("#map", {
			id : "ningxia",
			x : $("#map circle[data-title='宁夏']").attr("cx"),
			y : $("#map circle[data-title='宁夏']").attr("cy"),
			clipId1 : "clipId27",
			clipId2 : "clipId27-1"
		}),
		neimenggu : new DrawFluidWater("#map", {
			id : "neimenggu",
			x : $("#map circle[data-title='内蒙古']").attr("cx"),
			y : $("#map circle[data-title='内蒙古']").attr("cy"),
			clipId1 : "clipId28",
			clipId2 : "clipId28-1"
		}),
		hebei : new DrawFluidWater("#map", {
			id : "hebei",
			x : $("#map circle[data-title='河北']").attr("cx"),
			y : $("#map circle[data-title='河北']").attr("cy"),
			clipId1 : "clipId29",
			clipId2 : "clipId29-1"
		}),
		beijing : new DrawFluidWater("#map", {
			id : "beijing",
			x : $("#map circle[data-title='北京']").attr("cx"),
			y : $("#map circle[data-title='北京']").attr("cy"),
			clipId1 : "clipId30",
			clipId2 : "clipId30-1"
		}),
		tianjin : new DrawFluidWater("#map", {
			id : "tianjin",
			x : $("#map circle[data-title='天津']").attr("cx"),
			y : $("#map circle[data-title='天津']").attr("cy"),
			clipId1 : "clipId31",
			clipId2 : "clipId31-1"
		}),
		hebei : new DrawFluidWater("#map", {
			id : "hebei",
			x : $("#map circle[data-title='河北']").attr("cx"),
			y : $("#map circle[data-title='河北']").attr("cy"),
			clipId1 : "clipId29",
			clipId2 : "clipId29-1" 
		})
	};
	//  对应31个省市
	var province = {
		heilongjiang : "黑龙江", //1
		jilin : "吉林", //2
		liaoning : "辽宁", //3
		beijing : "北京", //4
		tianjin : "天津", //5
		neimenggu : "内蒙古", //6
		hebei : "河北", //7
		shandong : "山东", //8
		shanxi : "山西", //9
		henan : "河南", //10
		hubei : "湖北", //11
		anhui : "安徽", //12
		jiangsu : "江苏", //13
		sshanxi : "陕西", //14
		hunan : "湖南", //15
		zhejiang : "浙江", //16
		shanghai : "上海", //17
		fujian : "福建", //18
		jiangxi : "江西", //19
		guangdong : "广东", //20
		guangxi : "广西", //21
		hainan : "海南", //22
		yunnan : "云南", //23
		guizhou : "贵州", //24
		chongqing : "重庆", //25
		sichuan : "四川", //26
		xizang : "西藏", //27
		qinghai : "青海", //28
		ningxia : "宁夏", //29
		gansu : "甘肃", //30
		xinjiang : "新疆" //31
	}
	// 自我执行得到所有水滴点坐标
	getMincircle();
	//生成水滴
	var water = new CreateWater("#map", {
			fillStyle : "#04e0fa", 	//  填充颜色
			tweeTime : 3000, 		//  小水滴升起时间
			series : minCircle,
			callback : function (title) {
				var updateCount = $("#map circle[data-title='" + province[title] + "']").data("dataCount");
				FluidWater1[title].update(updateCount);
			}
		});
	var time = null;
	//循环调用函数
	function loop() {
		if (time) {
			clearTimeout(time); // 清除定时器
		}
		time = setTimeout(loop, 5000); //刷新数据的时间
		minCircle = []; // 初始化数组
		getMincircle(); // 重新生成数组
		water.update(minCircle); // 重新生成数组，更新水滴
	}
	loop();
})();