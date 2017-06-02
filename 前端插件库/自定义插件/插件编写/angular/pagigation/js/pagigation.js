

var getComponentPath= (function () {
        var curWwwPath = window.location.href;
        var pathName = window.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPath = curWwwPath.substring(0, pos);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPath + projectName + '/');
    })();
getComponentPath=getComponentPath+'html/component/'
     /**
     *
     * @appTurnPage  pagination  directive
     * @description
     * @example
     *  1.<pagination  ></pagination>
     *  2.  <div  pagination  ></div>
     * */
	 angular.module('pagigation',[])
     .constant('paginationConfig', {
            visiblePageCount: 10,
            firstText: 'First',
            lastText: 'Last',
            prevText: 'Previous',
            nextText: 'Next'
        })
        .directive("pagination", ['paginationConfig', function(pagexConfig) {
            return {
                link: function(scope, element, attrs) {
                    // 页面的可见数
                    var visiblePageCount = angular.isDefined(attrs.visiblePageCount) ? scope.visiblePageCount : pagexConfig.visiblePageCount;
                    // 按钮文本
                    scope.firstText = angular.isDefined(attrs.firstText) ? attrs.firstText : pagexConfig.firstText;
                    scope.lastText = angular.isDefined(attrs.lastText) ? attrs.lastText : pagexConfig.lastText;
                    scope.prevText = angular.isDefined(attrs.prevText) ? attrs.prevText : pagexConfig.prevText;
                    scope.nextText = angular.isDefined(attrs.nextText) ? attrs.nextText : pagexConfig.nextText;

                     //  翻页转变函数
                    scope.pageChange = function(page,flag) {
                        if (page >= 1 && page <= scope.pageCount) {
                            scope.currentPage = page;
                        } else {
                            scope.currentPage = 1;
                        };
                    };
                    // 建立分页函数
                    function build(newValue,oldValue) {
                        // 最大值，最小值，中间值
                        var low, high, middle;
                        // 翻页数组
                        scope.pagenums = [];
                        /*
                         * 1.当总是为0时，直接返回不建立分页，同时隐藏分页
                         * 2.当当前值大于总数时，那么直接默认当前为1
                         * 3. 当当前页小于等于可见数时，最低值等于1， 最高值等于页的总数
                         * 4. 当页数大于可见数时，
                          *     middle=visiblePageCount/2  ,向上取整，
                          *     low= Math.max(当前页-middle ,1)
                          *     high=Math.min(low + visiblePageCount - 1, scope.pageCount);
                          *     当 scope.pageCount-high小于middle，   low重新取值 low=high-visiblePageCount+1
                          * 5. 进
                         */
                        if (scope.pageCount == 0) {
                            return;
                        }
                        if (scope.currentPage > scope.pageCount) {
                            scope.currentPage = 1;
                        }

                        if (scope.pageCount <= visiblePageCount) {
                            low = 1;
                            high = scope.pageCount;
                        } else {
                            middle = Math.ceil(visiblePageCount / 2);
                            low = Math.max(scope.currentPage - middle, 1);
                            high = Math.min(low + visiblePageCount - 1, scope.pageCount);
                            if (scope.pageCount - high < middle) {
                                low = high - visiblePageCount + 1;
                            }
                        };

                        //  进行一次循环
                        do {
                            scope.pagenums.push(low);
                            low++;
                        } while(low <= high);

                        // 只有两次值不一样的时候才会去调用回调函数
                        if(newValue!==oldValue){
                            scope.pageChangeCallback();
                        }
                    };

                    // 及时监听当前页数和总数的变换然后重新创建分页
                    scope.$watch('currentPage+pageCount', function(newValue,oldValue) {
                            build(newValue,oldValue);
                    });
                },
                replace: false,
                restrict: "EA",
                // 注意这里作用域和 attr的区别
                scope: {
                    pageCount: '=',       // 总页数
                    currentPage: '=',    //  当前页
                    pageChangeCallback: '&',// 页数变动的回调函数
                    showFirstLast: '=', // 是否显示按钮 “第一页” ，“最后一页”
                    showPagination:'=', //  是否显示分页
                    showPaginationInfo:'=', // 是否显示分页信息
                    visiblePageCount:'=', // 可见页数
                    itemCount:'=' // 当前页的数据条目数
                },
                templateUrl: getComponentPath + 'pagination.html'
            }
        }]);