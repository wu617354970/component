/**
 * Created by wuwg on 2016/10/24 0024.
 * @author wuwg
 * @version 2016.0.1
 * @createTime 2016/10/24
 * @updateTime 2016/10/24
 * @descrition  兼容ie8
 * @description file
 * 向外暴露两个方法  goToSlide(index) 
	index 索引值，取值范围  [0,总节点数-1]	
	直接定位到需要显示的slide
 * 向外暴露两个方法  update(index,updateCallback)
 	index 索引值，取值范围  [0,总节点数-1]	
	updateCallback(_scrollList.eq(_scope.activeIndex))  function 类型，调用 update方法后的回调函数,会传递当前激活的元素作为参数
	
	使用用例
 *	
 *
 * 水平方法
 *
 *
var horizontal = $('.js-scrollArea-contain').addScrollarea({
    direction: "horizontal", //  vertical
    scrollArea: '.js-scrollarea', //  滚动区域的父元素   必须字段
    btnPrev: '.js-btn-pre', //  前按钮  必须字段
    btnNext: '.js-btn-next', //  后按钮 必须字段
    slideItem: '.js-slide-item', //  需要点击的条目  必须字段
    mosueType: "click", //  事件触发的事件名
    selectedClass: "active", // 选中的类名
    disabledClass: 'disabled', //  置灰的类名
    lastItemClass: 'last', //  最后条目的class
    beforeCallback: function (element, activeIndex) {
        console.log('动画开始之前')
    },
    clickCallback: function (element, activeIndex) {
        console.log('当前点击条目的回调函数')
    },
    callback: function (element, activeIndex) {
        console.log('动画结束之后')
    }
});
//1.1：输出对象
console.log(horizontal);
//1.2：获取版本号
horizontal.scope0.getVersion();
//  1.3：滚动到指定位置
setTimeout(function () {
    // 条到特定位置
    horizontal.scope0.goToSlide(5);
}, 2000);

// 1.4：调用更新的方法
$('#jsBtnAdd').click(function () {
    // 追加新元素
    $('#jsAddItem').append('<li class="js-slide-item"><a href="javascript:void(0)">这里是新增的数据</a></li>');
    console.log('添加数据成功');
    // 调用更新的方法
    horizontal.scope0.update();
});
// 1.5：调用更新的方法
$('#jsBtnDelete').click(function () {
    // 追加新元素
    $('#jsAddItem').children().last().remove();
    console.log('删除数据成功');
    // 调用更新的方法
    horizontal.scope0.update();
});




 *	
 *
 * 垂直方法
 *
 *
var verticalTest = $('.js-scrollArea-contain-vertical').addScrollarea({
    direction: "vertical"
});

// 调用更新的方法
$('#jsBtnAdd2').click(function () {
    // 追加新元素
    $('#jsAddItem2').append('<li class="js-slide-item"><a href="javascript:void(0)">这里是新增的垂直数据</a></li>');
    console.log('添加数据成功');
    // 调用更新的方法
    verticalTest.scope2.update();
});
// 调用更新的方法
$('#jsBtnDelete2').click(function () {
    // 追加新元素
    $('#jsAddItem2').children().last().remove();
    console.log('删除数据成功');
    // 调用更新的方法
    verticalTest.scope2.update();
});

 */
+ function ($, window) {
    //给Jquery添加方法
    $.fn.addScrollarea = function (options) {
        // 默认参数
        var _defaultOptions = {
            direction: "horizontal", //  vertical
            scrollArea: '.js-scrollarea', //  滚动区域的父元素   必须字段
            btnPrev: '.js-btn-pre', //  前按钮  必须字段
            btnNext: '.js-btn-next', //  后按钮 必须字段
            slideItem: '.js-slide-item', //  需要点击的条目  必须字段
            mosueType: "click", //  事件触发的事件名
            selectedClass: "active", // 选中的类名
            disabledClass: 'disabled', //  置灰的类名
            lastItemClass: 'last', //  最后条目的class
            beforeCallback: function (element, activeIndex) {
                console.log('动画开始之前')
            },
            clickCallback: function (element, activeIndex) {
                console.log('当前点击条目的回调函数')
            },
            afterCallback: function (element, activeIndex) {
                console.log('动画结束之后')
            }
        };
        // 合并默认设置的和传入的参数
        var _opts = $.extend(true, {}, _defaultOptions, options || {});
        // 公共接口
        var _publicScope = {
            version: '2016-10-24',
            author: 'wuwg'
        };
        //  方法实现
        this.each(function (index, value) {
            // 私有空间
            var _this = $(this), //当前对象
                _scrollArea = _this.find(_opts.scrollArea), // 滚动目标
                _btnPrev = _this.find(_opts.btnPrev), //  节点列表
                _btnNext = _this.find(_opts.btnNext), //  节点列表
                _scrollAreaContent = null, // 滚动目标的内容
                _scrollList = null; //  节点列表
            function getObj() {
                _scrollAreaContent = _scrollArea.children();
                _scrollList = _scrollAreaContent.children();
            }
            // 获取对象
            getObj();
            //动画函数
            function gotoAnimate(activeIndex) {
                //  如果正在运动，那么就不能再进行点击
                if (_scrollArea.is(':animated')) {
                    return false;
                } else {
                  

                    // 动画执行之前的回调函数
                    if ($.type(_opts.beforeCallback) == 'function') {
                        _opts.beforeCallback(_scrollList.eq(_scope.activeIndex), _scope.activeIndex);
                    }
					
					// 设置当前激活的index 值
                    if (activeIndex == '++') {
                        _scope.activeIndex += 1;
                    } else if (activeIndex == '--') {
                        _scope.activeIndex -= 1;
                    } else {
                        _scope.activeIndex = activeIndex;
                    }
                    // 设置按钮的状态
                    _scope.setBtnStatus();
					
                    //  声明需要滚动的距离
                    var _totalSizeArray = [],
                        _scrollDistance = 0,
                        _falg = false;;

                    // 判断是水平方向还是垂直方向
                    if (_opts.direction == 'horizontal') {
                        //  过滤选择器选择需要的元素
                        _scrollList.filter(function (index) {
                            return index < _scope.activeIndex;
                        }).each(function (index, value) {
                            _totalSizeArray.push($(this).outerWidth(true));
                            var _width = $(this).outerWidth(true);
                            _scrollDistance += _width;
                            if (_scrollDistance > _scope.totalSize - _scope.clientSize) {
                                // 滚动的索引值
                                _scope.scrollDistancePrev = _scrollDistance - _width;
                                // 当前滚动的index
                                _scope.currentScrollIndex = index;
                                // 滚动的距离
                                _scrollDistance = _scope.totalSize - _scope.clientSize;
                                //  说明已经超了
                                _falg = true;
                                return false;
                            }
                        });

                        if (_falg && activeIndex == '--') {
                            // 重新赋值激活的索引值
                            _scope.activeIndex = _scope.currentScrollIndex;
                            // 重新赋值需要滚动的居里
                            _scrollDistance = _scope.scrollDistancePrev;
                        }
                        // 增加选中的状态
                        _scope.selectItem();
                        //  如果当前滚动登录现在的滚动位置那么就不往下执行了
                        if (_scrollDistance != _scrollArea.scrollLeft()) {
                            // 执行动画
                            _scrollArea.animate({
                                "scrollLeft": _scrollDistance
                            }, _opts.tweenTime, function () {
                                // 动画之后的回调函数
                                if ($.type(_opts.afterCallback) == 'function') {
                                    _opts.afterCallback(_scrollList.eq(_scope.activeIndex), _scope.activeIndex);
                                }
                            });
                        }
                    } else {

                        //  过滤选择器选择需要的元素
                        _scrollList.filter(function (index) {
                            return index < _scope.activeIndex;
                        }).each(function (index, value) {
                            _totalSizeArray.push($(this).outerWidth(true));
                            var _height = $(this).outerHeight(true);
                            _scrollDistance += _height;
                            if (_scrollDistance > _scope.totalSize - _scope.clientSize) {
                                // 滚动的索引值
                                _scope.scrollDistancePrev = _scrollDistance - _height;
                                // 当前滚动的index
                                _scope.currentScrollIndex = index;
                                // 滚动的距离
                                _scrollDistance = _scope.totalSize - _scope.clientSize;
                                //  说明已经超了
                                _falg = true;
                                return false;
                            }
                        });
                        if (_falg && activeIndex == '--') {
                            // 重新赋值激活的索引值
                            _scope.activeIndex = _scope.currentScrollIndex;
                            // 重新赋值需要滚动的居里
                            _scrollDistance = _scope.scrollDistancePrev;
                        }
                        // 增加选中的状态
                        _scope.selectItem();	
                        //  如果当前滚动登录现在的滚动位置那么就不往下执行了
                        if (_scrollDistance != _scrollArea.scrollTop()) { 
                            // 执行动画
                            _scrollArea.animate({
                                "scrollTop": _scrollDistance
                            }, _opts.tweenTime, function () {
                                // 动画之前的回调函数
                                if ($.type(_opts.afterCallback) == 'function') {
                                    _opts.afterCallback(_scrollList.eq(_scope.activeIndex), _scope.activeIndex);
                                }
                            });
                        }
                    }
                }
            };
            // 对外接口
            var _scope = {
                _this: $(this),
                currentScrollIndex: 0, // 当前滚动的index 值
                scrollDistancePrev: 0, // 前一次滚动的距离
                scopeIndex: index, //  作用域的index值
                clientSize: (_opts.direction == 'horizontal') ? _scrollArea.innerWidth() : _scrollArea.innerHeight(), //  可视窗口的大小
                totalSize: 0, //  容器的尺寸大小
                totalSlideSize: _scrollList.size(), // 总节点数
                activeIndex: 0, // 当前页索引
                // 设置按钮的状态
                setBtnStatus: function () {		
                    //   对activeIndex进行判断
                    if (_scope.activeIndex <=0 ) {
                        _scope.activeIndex = 0;
                        _btnPrev.addClass(_opts.disabledClass);
					
						if(_scope.totalSlideSize==1){
							  _btnNext.addClass(_opts.disabledClass)
						}else {
							if(_btnNext.hasClass(_opts.disabledClass)){
								 _btnNext.removeClass(_opts.disabledClass)
							}	 
						}
                    } else if (_scope.activeIndex >=(_scope.totalSlideSize - 1)) {
                        _scope.activeIndex = _scope.totalSlideSize - 1;
                        _btnNext.addClass(_opts.disabledClass);
					
                    } else {
                        if (_btnPrev.hasClass(_opts.disabledClass)) {
                            _btnPrev.removeClass(_opts.disabledClass);
                        }
                        if (_btnNext.hasClass(_opts.disabledClass)) {
                            _btnNext.removeClass(_opts.disabledClass);
                        }
                    }
                },
                scrollStep: (_opts.step != 0) ? _opts.step : 1, //滚动歩长
                init: function () {
                    _scope.setContainSize();
					 // 设置按钮的状态
                    _scope.setBtnStatus();
                    _scope.bindEvent();
                },
                // 选中条目的方法
                selectItem: function () {
                    _scrollList.eq(_scope.activeIndex).addClass(_opts.selectedClass)
                        .siblings().removeClass(_opts.selectedClass);
                    // 执行选择条目的回调函数
                    _opts.clickCallback(_scrollList.eq(_scope.activeIndex), _scope.activeIndex);
                },
                //  求和公式
                add: function () {
                    var _sum = 0;
                    for (var i = 0, _len = arguments.length; i < _len; i++) {
                        _sum += arguments[i];
                    }
                    return _sum;
                },
                //  滚动到指定的条目
                goToSlide: function (index) {
                    if ($.type(index) == 'number') {
                        var _index = index;
                        if (_index < 0) {
                            _index = 0;
                        } else if (_index > _scope.totalSlideSize) {
                            _index = _scope.totalSlideSize
                        }
                        // 执行动画
                        gotoAnimate(_index);
                    }
                },
                // 设置容器大小
                setContainSize: function () {   
                    //初始化滚动区域		水平--垂直
                    if (_opts.direction == "horizontal") {
                        _scrollList.removeClass(_opts.lastItemClass)
                            .last().addClass(_opts.lastItemClass);
                        var _totalSizeArray = [];
                        _scrollList.each(function (key, value) {
                            _totalSizeArray.push($(this).outerWidth(true));
                        });
                        // 获取容器大小
                        _scope.totalSize = _scope.add.apply(null, _totalSizeArray);
                        // 设置容器大小
                        _scrollAreaContent.css({
                            width: _scope.totalSize
                        });

                    } else {
                        _scrollList.removeClass(_opts.lastItemClass)
                            .last().addClass(_opts.lastItemClass);
                        var _totalSizeArray = [];
                        _scrollList.each(function (key, value) {
                            _totalSizeArray.push($(this).outerHeight(true));
                        });
                        // 获取容器大小
                        _scope.totalSize = _scope.add.apply(null, _totalSizeArray);
                        // 设置容器大小
                        _scrollAreaContent.css({
                            height: _scope.totalSize
                        });
                    }
                },
                // 绑定事件
                bindEvent: function () {
                    //前一页
                    _this.off(_opts.mosueType + '.scrollAreaPrev').on(_opts.mosueType + '.scrollAreaPrev', _opts.btnPrev, function () {
                        if (!$(this).hasClass(_opts.disabledClass)) {
                            gotoAnimate("--");
                        }
                    });

                    //后一页
                    _this.off(_opts.mosueType + '.scrollAreaNext').on(_opts.mosueType + '.scrollAreaNext', _opts.btnNext, function () {
                        if (!$(this).hasClass(_opts.disabledClass)) {
                            gotoAnimate("++");
                        }
                    });

                    //后一页
                    _this.off(_opts.mosueType + '.scrollAreaItem').on(_opts.mosueType + '.scrollAreaItem', _opts.slideItem, function () {
                        var _index = $(this).index();
                        if (_index == _scope.activeIndex) {
                            return false;
                        } else {
                            gotoAnimate(_index);
                        }

                    });
                },
                // 获取版本号
                getVersion: function () {
                    try {
                        console.log('版本号：' + _publicScope.version)
                        console.log('作者：' + _publicScope.author)
                    } catch (e) {

                    }
                },
                //  更新的方法
                update: function (index,updateCallback) {
                     getObj();    // 重新获取对象
                    _scope.currentScrollIndex = 0; // 当前滚动的index 值
                    _scope.scrollDistancePrev = 0; // 前一次滚动的距离 值   
                    _scope.clientSize = (_opts.direction == 'horizontal') ? _scrollArea.innerWidth() : _scrollArea.innerHeight(); //  可视窗口的大小
                    _scope.totalSlideSize = _scrollList.size(); // 总节点数
                    _scope.setContainSize();  // 设置容器大小
					_scope.activeIndex = ($.type(index)=='number'&&index>=0 &&  index < _scope.totalSlideSize )? index : _scope.activeIndex>_scope.totalSlideSize ? 0 :_scope.activeIndex ;   	// 获取激活的索引值     
					 gotoAnimate(_scope.activeIndex);	  // 执行一次动画函数
					if($.type(updateCallback)=='function'){ // 执行更新的回调函数 
						updateCallback(_scrollList.eq(_scope.activeIndex));
					}    
                }
            };
            // 执行初始化的方法
            _scope.init();
            //公用的方法接口
            _publicScope['scope' + index] = _scope;
        });
        return _publicScope;
    }
}(jQuery, window);