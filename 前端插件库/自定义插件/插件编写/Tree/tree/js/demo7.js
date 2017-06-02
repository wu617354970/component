// 创建树
var treeMax = $('#jsTreeMax').addTree({
		showLog : false, // 是否显示日志
		key : 'mapId', //   数据id    注意千万不要用驼峰命名，就算是驼峰命名最后取值也是小写的
		parentKey : 'pId', // 父元素id
		name : 'xqmc', // 数组的中文展示    (辖区名称)
		childKey : 'children', // 子元素
		data : [], //  数据对象为数组
		cache : false, //  是否缓存数据
		cacheId : 'wTreeMinLocalStorage', //  如果需要缓存，那么请设置换粗id默认
		itemIdPrefix : "fd-treeMax-", // 注意修改防止冲突
		operateItemClass : '.tree-hd',
		extendArea : false, // 是否扩大点击区域 默认为false
		hasIcon : true, //  有图标
		canSelected : true, // 可以选中
		hasHoverEffect : true,
		//  是否可以搜索
		canSearch : false,
		searchKey : ['id'], //  搜索的key值
		searchScrollTweenTime : 400, // 搜索滚动时间
		searchInput : '#jsSearch', //  搜索框id
		searchButton : '#jsBtnSearch', //  搜索按钮id
		limitCount : 5, // 提示条目数
		deferTime : 200, // 延迟显示
		isAutocompleter : true, //  自否自动完成
		hideAutocompleterClass : 'hide', //  自否自动完成
		menuSelectedClass : 'selected', // 数据条目选中的class
		autocompleterContain : '#jsAutocompleter',
		treeContain : '#jsTreeContain',
		autocompleterIsAjax : false, //  是否是ajax加载数据
		autocompleterAjax : {
			url : 'json/search.json',
			method : 'post',
			data : 'nr',
			dataType : 'json',
			asych : true,
			success : function (data, stauts, xhr, _scope) {
				if (_scope.showLog) {
					console.log('成功添加节点的回调函数')
				}
			},
			error : function (data, stauts, xhr, _scope) {
				if (_scope.showLog) {
					console.log('失败添加节点的回调函数')
				}

			}
		},
		// 滚动条参数
		hasScrollBar : true, // 是否有滚动条
		scrollBarContain : '.fd-scroll-track-max',
		scrollBarMinHeight : 50,
		treeContain : "#jsTreeContainMax",
		allowAppendNewNode : false, // 允许增加新的节点
		canSearch : true,
		hasTips : false, //  是否有提示框
		// 回调函数
		callback : {
			appendNewNode : function (_this, event, target, _scope) {
		
			},
			onClick : function (_this, event, target, _scope) {
				var mapid = _this.data('mapid');
			},
			onExpand : function (_this, event, target, _scope) {
				// console.log('展开的回调函数')
				_scope.scrollBar.update(20);
			},
			onCollapse : function (_this, event, target, _scope) {
				//   console.log('收起的回调函数')
				_scope.scrollBar.update(20);
			}
		}
	});
//  更新树的数据，异步ajax
$.ajax({
	url : 'json/tree.json',
	dataType : 'json',
	data : '',
	method : 'get',
	cache : true,
	crossDomain : false,
	timeout : 2000,
	async : true,
	success : function (data) {
		var getNodes = data.result;
		//克隆对象函数
		function coloneNodes() {
			var coloneNodes = JSON.stringify(getNodes);
			return JSON.parse(coloneNodes);
		};
		//  大树
		var treeMaxCacheId = treeMax.opts.cacheId + treeMax._this.attr('id');

		if (!window.localStorage.getItem(treeMaxCacheId)) {
			var treeMaxNodes = coloneNodes();
			// 默认第一个不能缩起
			treeMaxNodes.disabled = true;
			// 更新数据
			treeMax.update(treeMaxNodes);
			// 设置能被选中的节点  2级以下的不能被选中
		//	treeMax.setWhatItemCanSelected(2);
			// 最高人民法院不能选择
			$('#fd-treeMax-990000').attr('canselected', 'false');
		};
		// 最高人民法院不能选择
		$('#fd-treeMax-990000').attr('canselected', 'false');

		//  默认哪个节点点击
		$('#fd-treeMax-000000').trigger('click.tree');
	}
});