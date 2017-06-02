/**
 * @author wuwg
 * @version 2016.0.1
 * @description file
 * @createTime 2016/7/13
 * @updateTime 2016/7/13
 * @descrition  兼容ie8+
 */
(function (window, $) {
    $.fn.autocompleter = function (options) {
        var _this = $(this);
        // 创建一个私有作用域对象
        var _scope = {};
        // 讲this对象放到scope中
        _scope._this = _this;
        // 默认参数
        var defaultOptions = {
            showLog: false, // 是否显示日志
            hasSearchButton: false, // 是否有搜索按钮
            searchButton: '.fd-btn-search', // 搜索按钮的类名
            autocompleterContain: 'fd-menu-contain', // 自动完成容器
            searchName: ['fyjc', 'xqmc', 'fyjb', 'isXq', 'fbdm', 'mapId'], //  搜索的key值,类型为数组，就是可以搜索一个对象的多个值
            limitCount: 5, // 提示条目数
            deferTime: 200, // 延迟显示
            autocompleter: true, //是否自动完成
            menuSelectedClass: 'selected', // 选中条目的类名
            hideAutocompleterClass: 'hide', // 隐藏的类名
            data: [], //  自动完成的数据源
            autocompleterIsAjax: false, //  是否是ajax加载数据
            autocompleterAjax: { // ajax的参数
                url: '../json/data.json',
                method: 'get',
                data: 'query',
                dataType: 'json',
                asych: true,
                success: function (data, stauts, xhr, _scope) {
                    console.log('ajax成功')
                    // 赋值给自动完成的对象
                    _scope.autocompleter.response = data.data.dataList;
                },
                error: function (data, stauts, xhr) {
                    console.log('ajax失败')
                }
            },
            // 搜索的回调函数
            callback: {
                search: function (query, _scope) {
                    //  console.log(target)
                    //   console.log(query)
                    var content = [];
                    var target = null;
                    // console.log(_scope.autocompleter.response)
                    $.each(_scope._this.data(), function (key, value) {
                        content.push('<p>' + key + ':' + value + '</p>');
                    });
                    $('#jsContent').html(content.join(''));
                }
            }
        };
        //  合并参数
        _scope.opts = $.fn.extend(true, {}, defaultOptions, options || {});
        // 追加一个自动完成的容器对象
        _scope._this.parent().append('<div class="' + _scope.opts.autocompleterContain + ' ' + _scope.opts.hideAutocompleterClass + '"></div>');
        // 自动完成的容器对象
        _scope.autocompleterContain = _scope._this.siblings('.' + _scope.opts.autocompleterContain);
        // 判断是否有搜索按钮
        if (_scope.opts.hasSearchButton) {
            //搜索按钮
            _scope.searchButton = _scope._this.siblings(_scope.opts.searchButton);
        }
        // 自动完成对象
        _scope.autocompleter = {
            timer: null,
            // 查询出来的数据对象，默认为空
            response: [],
            // 复制值到 input
            copyValueToSearch: function (_this) {
                if (!!_this) {
                    var _menuSelected = _this;
                } else {
                    var _menuSelected = _scope.autocompleterContain.find('.' + _scope.opts.menuSelectedClass);
                }
                if (_menuSelected.size() > 0) {
                    //  获取data
                    var data = _menuSelected.data();
                    _scope._this.removeData();
                    //  赋值给data
                    _scope._this.data(data);
                    //  获取值
                    var _val = _menuSelected.text();
                    //赋值给input
                    _scope._this.val(_val);
                    //  隐藏提示
                    _scope.autocompleter.hideAutocompleter();
                };
            },
            // 隐藏自动完成提示框
            hideAutocompleter: function () {
                $(_scope.autocompleterContain).addClass(_scope.opts.hideAutocompleterClass);
            },
            //  显示自动完成的框
            showAutocompleter: function () {
                $(_scope.autocompleterContain).removeClass(_scope.opts.hideAutocompleterClass);
            },
            queryValue: '',
            // 查询
            query: function (query, nodes, limit, isAjax, makeList, callback, huiche) {
                if (!isAjax) {
                    var nodes = nodes;
                    var limit = limit;
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        var node = nodes[i];
                        //  检索多次
                        var searchName = '';
                        for (var j = 0, k = _scope.opts.searchName.length; j < k; j++) {
                            if (!!node[_scope.opts.searchName[j]]) {
                                searchName = _scope.opts.searchName[j];
                                if (node[searchName].search(query) !== -1) {
                                    _scope.autocompleter.response.push(node);
                                    break;
                                };
                            }
                        };
                        // 打断循环
                        if (_scope.autocompleter.response.length >= limit) {
                            // break 后不会执行下面的代码
                            break;
                            //  return _scope.autocompleter.response;
                        };
                    };
                    if (makeList) {
                        //  生成自动完成列表
                        _scope.autocompleter.makeList(query);
                    };
                    if ($.type(callback) === 'function') {
                        callback(query, _scope);
                    }
                } else {
                    if (_scope.opts.showLog) {
                        console.log('发送到后台的数据是：');
                        console.log({
                            param: JSON.parse('{"' + _scope.opts.autocompleterAjax.data + '":"' + query + '"}')
                        });
                        console.log('\n');
                    };
                    $.ajax({
                        url: _scope.opts.autocompleterAjax.url,
                        method: _scope.opts.autocompleterAjax.method,
                        dataType: _scope.opts.autocompleterAjax.dataType,
                        data: {
                            param: '{"' + _scope.opts.autocompleterAjax.data + '":"' + query + '"}'
                        },
                        success: function (data, stauts, xhr) {
                            if (_scope.opts.showLog) {
                                console.log('后台返回的数据是：');
                                console.log(data);
                                console.log('\n');
                            }
                            if ($.type(_scope.opts.autocompleterAjax.success) === 'function') {
                                _scope.opts.autocompleterAjax.success(data, stauts, xhr, _scope);
                            };
                            if (_scope.autocompleter.response.length > 0) {
                                if (_scope.autocompleter.response.length > limit) {
                                    //  slice 不会删除原来的数组
                                    //  splice 会删除原来的数组
                                    _scope.autocompleter.response = _scope.autocompleter.response.slice(0, limit);
                                }
                            } else {
                                _scope.autocompleter.response = [];
                            }
                            if (makeList) {
                                // 生成自动提示框
                                _scope.autocompleter.makeList(query);
                            };
                            if ($.type(callback) === 'function') {
                                callback(query, _scope);
                            }
                        },
                        error: function (data, stauts, xhr) {
                            if ($.type(_scope.opts.autocompleterAjax.error) === 'function') {
                                _scope.opts.autocompleterAjax.error(data, stauts, xhr, _scope);
                            }
                        }
                    })
                }
            },
            //  生成列表
            makeList: function (query) {
                var l = _scope.autocompleter.response.length;
                if (l > 0) {
                    var list = ['<ul class="fd-search-menu">'];
                    for (var i = 0; i < l; i++) {
                        var node = _scope.autocompleter.response[i];
                        var dataString = []
                        for (name in node) {
                            if (name !== _scope.opts.childKey) {
                                if (node[name] === '') {
                                    node[name] = 'false';
                                }
                                dataString.push('data-' + name + '=' + node[name]);
                            };
                        };
                        dataString = dataString.join(' ');
                        //  检索多次
                        var searchName = '';
                        for (var j = 0, k = _scope.opts.searchName.length; j < k; j++) {
                            if (!!node[_scope.opts.searchName[j]]) {
                                searchName = _scope.opts.searchName[j];
                                if (node[searchName].search(query) !== -1) {
                                    _scope.autocompleter.response.push(node);
                                    break;
                                };
                            }
                        }
                        var name = node[searchName].split(query).join('<em>' + query + '</em>')
                        list.push('<li  class="fd-item" ' + dataString + '>' + name + '</li>');
                    };
                    list.push('</ul>')
                    _scope.autocompleterContain[0].innerHTML = list.join('');
                    _scope.autocompleterContain.removeClass(_scope.opts.hideAutocompleterClass);
                    if (!_scope.opts.autocompleter) {
                        _scope.autocompleterContain.addClass(_scope.opts.hideAutocompleterClass)
                    };
                } else {
                    _scope.autocompleterContain.html('<div class="fd-empty-contain">未找到符合条件的数据</div>').removeClass(_scope.opts.hideAutocompleterClass);
                    _scope._this.removeData();
                    if (!_scope.opts.autocompleter) {
                        _scope.autocompleterContain.addClass(_scope.opts.hideAutocompleterClass)
                    };
                }
            },
            //  忽略的键值
            ignoredKeyCod: [9, 13, 17, 19, 20, 27, 33, 34, 35, 36,
                37, 39, 44, 92, 113, 114, 115, 118, 119, 120, 122,
                123, 144, 145
            ],
            // 44  prtsc
            //  17  ctrl
            //  18  alt
            //  绑定事件
            bindEvent: function () {
                _scope._this.off('keydown.autocompleter').on('keydown.autocompleter', _scope.autocompleter.keydown);
                _scope._this.off('keyup.autocompleter').on('keyup.autocompleter', _scope.autocompleter.keyup);
                _scope._this.off('focus.autocompleter').on('focus.autocompleter', _scope.autocompleter.focus);
                _scope._this.off('blur.autocompleter').on('blur.autocompleter', _scope.autocompleter.blur);
                _scope.autocompleterContain.off('mousedown.autocompleter').on('mousedown.autocompleter', 'li', _scope.autocompleter.mousedown);
            },
            // 键盘按下
            keydown: function (event) {
                var code = event.keyCode ? event.keyCode : event.which;
                var data = event.data;
                // down  arrow   || up  arrow
                if (code === 40 || code === 38) {
                    //  不阻止的话光标会偏移
                    event.preventDefault();
                    event.stopPropagation();
                } else if (code === 39) {
                    // right  arrow
                } else if (code === 13) {
                    //  不阻止的话光标会偏移
                    event.preventDefault();
                    event.stopPropagation();
                    // Enter
                };
            },
            // 获得焦点自动搜索
            search: function () {
                // 说明是文字键需要进行搜索
                _scope.autocompleter.queryValue = $.trim(_scope._this.val());
                if (_scope.autocompleter.queryValue !== '') {
                    // 清空_scope.autocompleter.response
                    _scope.autocompleter.response = [];
                    // 重新搜索，这个是ajax进行的搜索
                    _scope.autocompleter.query(_scope.autocompleter.queryValue, _scope.opts.data, _scope.opts.limitCount, _scope.opts.autocompleterIsAjax, true);
                } else {
                    if (!$(_scope.autocompleterContain).hasClass(_scope.opts.hideAutocompleterClass)) {
                        _scope.autocompleter.hideAutocompleter();
                    }
                }
            },
            //  获得焦点，执行搜索函数
            focus: function () {
                _scope.autocompleter.search();
                //  获得焦点removeData，所有的数据都保留在 data对象中，所以需要移除data，然后重新搜索，重新赋值给data
                _scope._this.removeData();
            },
            // 失去焦点
            blur: function () {
                //  失去焦点隐藏自动完成框
                _scope.autocompleter.hideAutocompleter();
            },
            // 键盘松开
            keyup: function (event) {
                var data = event.data;
                var code = event.keyCode ? event.keyCode : event.which;
                // down  arrow   || up  arrow
                if (code === 40 || code === 38) {
                    // 如果自动完成容器是隐藏的，或者下面的ul小于1，那么直接返回
                    if ($(_scope.autocompleterContain).hasClass(_scope.opts.hideAutocompleterClass) || $(_scope.autocompleterContain).find('ul').size() < 1) {
                        return;
                    } else {
                        //  初始化的值为 -1
                        var selectedIndex = -1;
                        var _menuSelected = _scope.autocompleterContain.find('.' + _scope.opts.menuSelectedClass);
                        if (_menuSelected.size() > 0) {
                            selectedIndex = _menuSelected.index();
                        };
                        // 下箭头
                        if (code == 40) {
                            selectedIndex++;
                            // 如果大于总条数，那么应该重置为0或者直接返回
                            if (selectedIndex >= _scope.autocompleter.response.length) {
                                selectedIndex = 0;
                                //return;
                            }
                            //  上箭头
                        } else if (code == 38) {
                            selectedIndex--;
                            // 如果小于0，那么应该等于最大数，或者直接返回
                            if (selectedIndex < 0) {
                                selectedIndex = _scope.autocompleter.response.length - 1;
                                // return;
                            }
                        };
                        // 选中菜单
                        _scope.autocompleterContain.find('ul').children().removeClass(_scope.opts.menuSelectedClass).eq(selectedIndex).addClass(_scope.opts.menuSelectedClass);
                    }
                } else if ($.inArray(code, _scope.autocompleter.ignoredKeyCod) === -1) {
                    // 说明需要进行搜索，查出需要提示的数据项, 及时搜索
                    if (_scope.autocompleter.timer) {
                        // 清除定时器
                        clearTimeout(_scope.autocompleter.timer);
                        _scope.autocompleter.timer = null;
                    };
                    // 延时查询，减小服务器的压力
                    _scope.autocompleter.timer = setTimeout(function () {
                        _scope.autocompleter.search();
                    }, _scope.opts.deferTime);
                } else {
                    // [9, 13, 17, 19, 20, 27, 33, 34, 35, 36, 37, 39, 44, 92, 113, 114, 115, 118, 119, 120, 122, 123, 144, 145]
                    // 20 是大小写转换键
                    // 27 esc
                    // 13回车键，一赋值，2搜索的功能
                    if (code === 13) {
                        // 如果是显示的并且选中的条目大于1
                        if (!_scope.autocompleterContain.hasClass(_scope.opts.hideAutocompleterClass) && _scope.autocompleterContain.find('.' + _scope.opts.menuSelectedClass).size() > 0) {
                            //  1.有选中的条目,进行赋值
                            _scope.autocompleter.copyValueToSearch();
                            //  2.搜索的回调函数
                            _scope.opts.callback.search(_scope.autocompleter.queryValue, _scope);
                            // 失去焦点
                            _scope._this.blur();
                        } else {
                            if (_scope.opts.hasSearchButton) {
                                //  如果有搜索按钮那么直接出发搜索按钮即可
                                _scope.searchButton.trigger('click.search');
                            } else {
                                // 1.失去焦点
                                _scope._this.blur();
                                // 2.搜索的回调函数
                                _scope.opts.callback.search(_scope.autocompleter.queryValue, _scope);
                            }
                        }
                    };
                    if (_scope.opts.showLog) {
                        console.log('禁用键' + code)
                    }
                }
            },
            // 鼠标按下
            mousedown: function (event) {
                //  1.选中的条目,先进行赋值
                _scope.autocompleter.copyValueToSearch($(this));
                //  2.搜索的回调函数
                _scope.opts.callback.search(_scope.autocompleter.queryValue, _scope);
            },
            callback: function (event) {
                //  失去焦点
                _scope._this.blur();
                var query = $.trim(_scope._this.val());
                //  搜索值为空点击搜索直接获得焦点
                if (query === '') {
                    _scope._this.focus();
                } else {
                    // 重新搜索，这个是ajax进行的搜索
                    _scope.autocompleter.query(query, _scope.opts.data, _scope.opts.limitCount, _scope.opts.autocompleterIsAjax, false, _scope.opts.callback.search);
                }
            }
        };
        if (_scope.opts.autocompleter) {
            _scope.autocompleter.bindEvent();
            if (_scope.opts.hasSearchButton) {
                //点击搜索的函数
                _scope.searchButton.off('click.search').on('click.search', function (event) {
                    _scope.autocompleter.callback();
                });
            }
        }
        return _scope;
    };
})(window, jQuery);