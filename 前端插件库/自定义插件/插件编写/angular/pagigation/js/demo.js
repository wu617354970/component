var  app=angular.module('myApp',['pagigation'])  
	app.controller('appControllerPagigation',function($scope){
		$scope.scope={
			        data:{},
					from:0, // 从第几条开始
					limit:10,// 每次返回多少数据
			        paginationCallback: function () {
						$.ajax({
							type :'get',
							url :'../json/data.json',
							dataType : "json",
							data :{
								from:$scope.scope.from,  //  从第几条开始
								limit:$scope.scope.pagination.itemCount, // 限制的条目数
							},
							success : function(data) {
								if(data.success) {
									// 数据更新
									$scope.scope.data = data.data;
									//当前的页的条数
									$scope.scope.pagination.itemCount=$scope.scope.data.dataList.length;
									//总共的页数更新  ($scope.scope.data.total 总数据条数)
									$scope.scope.pagination.pageCount= Math.ceil($scope.scope.data.total/$scope.scope.limit);
									// 当总数等于0的时候，那么应该隐藏分页
									if($scope.scope.pagination.pageCount===0){
										$scope.scope.pagination.showPagination=false;
									};
									// 激活angular程序更新数据
									$scope.$apply();
								}
							},
							//  第一次请求失败
							error : function(data, textStatus, errorThrown) {
								console.log('错误'+data)
								$scope.scope.secondSearchData();
							}
						});
					},
					pagination:{
						itemCount:10,   //  当前页的条目数
						pageCount:30,    //  总页数
						currentPage:1, // 当前页
						showPagination:true, // 是否显示分页
						showPaginationInfo:true, // 是否显示分页信息
						showFirstLast:true, // 是否显示按钮 “第一页” ，“最后一页”
						visiblePageCount:5, //  一页可以显示多少个
						pageChangeCallback: function () {
								 console.log('这里是翻页的回调函数');
								 console.log('原来的$scope.scope.from是：'+$scope.scope.from);
								  $scope.scope.from = ($scope.scope.pagination.currentPage-1)*$scope.scope.limit;
								 console.log('现在的$scope.scope.from是：'+$scope.scope.from);
							   // 搜索函数
							   $scope.scope.paginationCallback();
						}
					}
			};
		// 第一次启动程序
	   	$scope.scope.paginationCallback();
	});
	angular.bootstrap(document,['myApp'])