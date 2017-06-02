/**
 * @author wuwg
 * @version 2016.0.1
 * @description file
 * @createTime 2016/6/30
 * @updateTime 2017/1/03
 * @descrition  兼容ie7
 */


+ function (window, $) {


    /*! Copyright (c) 2013 Brandon Aaron (http://brandon.aaron.sh)
     * Licensed under the MIT License (LICENSE.txt).
     *
     * Version: 3.1.12
     *
     * Requires: jQuery 1.2.2+
     */
    (function (factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], factory);
        } else if (typeof exports === 'object') {
            // Node/CommonJS style for Browserify
            module.exports = factory;
        } else {
            // Browser globals
            factory(jQuery);
        }
    }
    (function ($) {
        var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
            toBind = ('onwheel' in document || document.documentMode >= 9) ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
            slice = Array.prototype.slice,
            nullLowestDeltaTimeout,
            lowestDelta;
        if ($.event.fixHooks) {
            for (var i = toFix.length; i;) {
                $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
            }
        }
        var special = $.event.special.mousewheel = {
            version: '3.1.12',
            setup: function () {
                if (this.addEventListener) {
                    for (var i = toBind.length; i;) {
                        this.addEventListener(toBind[--i], handler, false);
                    }
                } else {
                    this.onmousewheel = handler;
                }
                // Store the line height and page height for this particular element
                $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
                $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
            },
            teardown: function () {
                if (this.removeEventListener) {
                    for (var i = toBind.length; i;) {
                        this.removeEventListener(toBind[--i], handler, false);
                    }
                } else {
                    this.onmousewheel = null;
                }
                // Clean up the data we added to the element
                $.removeData(this, 'mousewheel-line-height');
                $.removeData(this, 'mousewheel-page-height');
            },
            getLineHeight: function (elem) {
                var $elem = $(elem),
                    $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
                if (!$parent.length) {
                    $parent = $('body');
                }
                return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
            },
            getPageHeight: function (elem) {
                return $(elem).height();
            },
            settings: {
                adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
                normalizeOffset: true // calls getBoundingClientRect for each event
            }
        };
        $.fn.extend({
            mousewheel: function (fn) {
                return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
            },
            unmousewheel: function (fn) {
                return this.unbind('mousewheel', fn);
            }
        });

        function handler(event) {
            var orgEvent = event || window.event,
                args = slice.call(arguments, 1),
                delta = 0,
                deltaX = 0,
                deltaY = 0,
                absDelta = 0,
                offsetX = 0,
                offsetY = 0;
            event = $.event.fix(orgEvent);
            event.type = 'mousewheel';
            // Old school scrollwheel delta
            if ('detail' in orgEvent) {
                deltaY = orgEvent.detail * -1;
            }
            if ('wheelDelta' in orgEvent) {
                deltaY = orgEvent.wheelDelta;
            }
            if ('wheelDeltaY' in orgEvent) {
                deltaY = orgEvent.wheelDeltaY;
            }
            if ('wheelDeltaX' in orgEvent) {
                deltaX = orgEvent.wheelDeltaX * -1;
            }
            // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
            if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
                deltaX = deltaY * -1;
                deltaY = 0;
            }
            // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
            delta = deltaY === 0 ? deltaX : deltaY;
            // New school wheel delta (wheel event)
            if ('deltaY' in orgEvent) {
                deltaY = orgEvent.deltaY * -1;
                delta = deltaY;
            }
            if ('deltaX' in orgEvent) {
                deltaX = orgEvent.deltaX;
                if (deltaY === 0) {
                    delta = deltaX * -1;
                }
            }
            // No change actually happened, no reason to go any further
            if (deltaY === 0 && deltaX === 0) {
                return;
            }
            // Need to convert lines and pages to pixels if we aren't already in pixels
            // There are three delta modes:
            // * deltaMode 0 is by pixels, nothing to do
            // * deltaMode 1 is by lines
            // * deltaMode 2 is by pages
            if (orgEvent.deltaMode === 1) {
                var lineHeight = $.data(this, 'mousewheel-line-height');
                delta *= lineHeight;
                deltaY *= lineHeight;
                deltaX *= lineHeight;
            } else if (orgEvent.deltaMode === 2) {
                var pageHeight = $.data(this, 'mousewheel-page-height');
                delta *= pageHeight;
                deltaY *= pageHeight;
                deltaX *= pageHeight;
            }
            // Store lowest absolute delta to normalize the delta values
            absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));
            if (!lowestDelta || absDelta < lowestDelta) {
                lowestDelta = absDelta;
                // Adjust older deltas if necessary
                if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                    lowestDelta /= 40;
                }
            }
            // Adjust older deltas if necessary
            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
                // Divide all the things by 40!
                delta /= 40;
                deltaX /= 40;
                deltaY /= 40;
            }
            // Get a whole, normalized value for the deltas
            delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
            deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
            deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);
            // Normalise offsetX and offsetY properties
            if (special.settings.normalizeOffset && this.getBoundingClientRect) {
                var boundingRect = this.getBoundingClientRect();
                offsetX = event.clientX - boundingRect.left;
                offsetY = event.clientY - boundingRect.top;
            }
            // Add information to the event object
            event.deltaX = deltaX;
            event.deltaY = deltaY;
            event.deltaFactor = lowestDelta;
            event.offsetX = offsetX;
            event.offsetY = offsetY;
            // Go ahead and set deltaMode to 0 since we converted to pixels
            // Although this is a little odd since we overwrite the deltaX/Y
            // properties with normalized deltas.
            event.deltaMode = 0;
            // Add event and delta to the front of the arguments
            args.unshift(event, delta, deltaX, deltaY);
            // Clearout lowestDelta after sometime to better
            // handle multiple device types that give different
            // a different lowestDelta
            // Ex: trackpad = 3 and mouse wheel = 120
            if (nullLowestDeltaTimeout) {
                clearTimeout(nullLowestDeltaTimeout);
            }
            nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);
            return ($.event.dispatch || $.event.handle).apply(this, args);
        }

        function nullLowestDelta() {
            lowestDelta = null;
        }

        function shouldAdjustOldDeltas(orgEvent, absDelta) {
            // If this is an older event and the delta is divisable by 120,
            // then we are assuming that the browser is treating this as an
            // older mouse wheel event and that we should divide the deltas
            // by 40 to try and get a more usable deltaFactor.
            // Side note, this actually impacts the reported scroll distance
            // in older browsers and can cause scrolling to be slower than native.
            // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
            return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
        }
    }));
}
(window, jQuery);

+function (window, $) {
    $.fn.addTree = function (options) {
        //  声明作用域
        var _scope = {};
        var defaultOptions = {
            showLog: false, // 是否显示日志
            key: 'mapId', //   数据id    注意千万不要用驼峰命名，就算是驼峰命名最后取值也是小写的
            parentKey: 'pId', // 父元素id
            name: 'xqmc', // 数组的中文展示
            childKey: 'children', // 子元素
            data: [], //  数据对象为数组
            cache: false, //  是否缓存数据
            cacheId: 'wTreeLocalStorage', //  如果需要缓存，那么请设置换粗id默认
            itemIdPrefix: "fd-tree-",
            operateItemClass: '.tree-name',
            selectedIndex: 0, //  默认选中哪个
            selectedIsTriggerCallback: false, // 选中书否触发回调函数
            goToTargetClass: 'tree-hd-warning', //  搜索定位增加的类名
            selectedClass: "tree-hd-selected", // 选中增加的类名
            disabledClass: 'disabled', // 禁用的类名
            hoverClass: "tree-hd-hover", // 滑过增加的类名
            hideTrigerClass: "hide", // 隐藏最后一个展开收起按钮
            collapseClass: "tree-hd-collapse", // 闭合时增加的类名
            nodeNameClass: 'tree-name',
            checkboxClass: 'fd-checkbox', //  checkbox的类名
            checkedClass: 'fd-checked', //  checkbox选中的类名
            treeContentClass: 'ul-tree-ct', //
            itemClass: 'tree-item', //  条目名
            itemHeadClass: 'tree-hd', //  条目的标题名 ，
            triggerClass: 'fd-trigger', //  触发元素的
            extendArea: false, // 是否扩大点击区域 默认为false
            tweenTime: 300, // 动画事件
            collapseChildren: true, //  是否闭合
            defaultCollapse: true, // 默认全部闭合
            defaultExpandIndex: 0, //  只有第一个的一级展开
            hasAnimate: true, // 是否有动画 默认为有动画
            hasCheckbox: false, //  有checkbox 选项
            hasIcon: true, //  有图标
            type: 2, // 可选参数2 ， 1 表示箭头的树，2表示加减号的数数
            lastItemClass: 'tree-item-last', // 最后的条目增加的class,仅仅在type=2的情况下有效
            allowAppendNewNode: true, // 允许增加新的节点
            canSelected: true, // 可以选中
            hasHoverEffect: true,
            onlyExpandOneLevel: true, // 同级树仅仅展开一级
            hasTips: false, //  是否有提示框
            tipsTriggerElement: '.tree-name', // tips 的触发元素
            //  是否可以搜索
            canSearch: false,
            searchKey: ['id', 'mapId'], //   搜索的key值，搜索的值全部是小写
            searchName: ['mc', 'xqmc', 'tsmc', 'rymc'], //  搜索的key值为数组
            searchScrollTweenTime: 400, // 搜索滚动时间
            searchInput: '#jsSearch', //  搜索框id
            searchButton: '#jsBtnSearch', //  搜索按钮id
            limitCount: 5, // 提示条目数
            deferTime: 200, // 延迟显示
            isAutocompleter: true, //  自否自动完成
            hideAutocompleterClass: 'hide', //  自否自动完成
            menuSelectedClass: 'selected', // 数据条目选中的class
            autocompleterContain: '#jsAutocompleter',
            treeContain: '#jsTreeContain',
            autocompleterIsAjax: false, //  是否是ajax加载数据
            autocompleterAjax: {
                url: 'json/search.json',
                method: 'get',
                data: 'nr',
                dataType: 'json',
                asych: true,
                success: function (data, stauts, xhr) {
                    console.log('成功')
                },
                error: function (data, stauts, xhr) {
                    console.log('失败')
                }
            },
            // 滚动条参数
            hasScrollBar: true, // 是否有滚动条
            scrollBarContain: '.fd-scroll-track',
            scrollBarClass: 'fd-scroll-bar',
            pressClass: 'pressed',
            scrollBarMinHeight: 50,
            scrollStep: 10,
            scrollTweenTime: 10,
            // 回调函数
            callback: {
                appendNewNode: function (_this, event, target, _scope) {
                    var fyid = _this.data('mapid');
                    $.ajax({
                        url: 'json/ry.json',
                        dataType: 'json',
                        data: fyid,
                        method: 'get',
                        cache: false,
                        crossDomain: false,
                        timeout: 2000,
                        async: false,
                        success: function (data) {
                            var nodes = data.result.dataList;
                            var level = parseInt(_this.attr('level')) + 1;
                            var html = _scope.view.appendNodes(nodes, level, 0, [{
                                key: 'tsid',
                                name: 'tsmc',
                                childKey: 'ryList',
                                collapseChildren: true,
                                className: 'tree-ts',
                                allowAppendNewNode: false,
                                canSelected: false,
                                hasHoverEffect: false,
                                hasTips: false
                            }, {
                                key: 'ryid',
                                name: 'rymc',
                                childKey: '',
                                collapseChildren: true,
                                className: 'tree-ts',
                                allowAppendNewNode: false,
                                canSelected: false,
                                hasHoverEffect: false,
                                hasTips: false
                            }]);
                            _this.siblings('.' + _scope.opts.treeContentClass)[0].innerHTML = html;
                        }
                    });
                },
                // 提示框的回调函数
                tips: function (_this, event, target, _scope) {},
                onMouseenter: function (_this, event, target, _scope) {
                    /*  console.log('鼠标移入的事件')
                     console.log(_this)
                     console.log(event)
                     console.log(target)
                     console.log(_scope)*/
                },
                onMouseleave: function (_this, event, target, _scope) {
                    /* console.log('鼠标移出的事件')
                     console.log(_this)
                     console.log(event)
                     console.log(target)
                     console.log(_scope)*/
                },
                onMmousemove: function (_this, event, target, _scope) {
                    /* console.log('鼠标移动的事件')*/
                },
                onNodeCreated: function () {
                    console.log('节点被创建的事件')
                },
                onClick: function (_this, event, target, _scope) {
                    console.log('点击事件')
                    /*  console.log(_this)
                     console.log(event)
                     console.log(target)
                     console.log(_scope)*/
                },
                onDblClick: function (_this, event, target, _scope) {
                    console.log('双击事件')
                    /*   console.log(_this)
                     console.log(event)
                     console.log(target)
                     console.log(_scope)*/
                },
                onMouseDown: function (_this, event, target, _scope) {
                    console.log('鼠标按下事件')
                },
                onMouseUp: function () {
                    console.log('鼠标按松开事件')
                },
                onExpand: function (_this, event, target, _scope) {
                    console.log('展开的回调函数')
                    _scope.scrollBar.update(20);
                },
                onCollapse: function (_this, event, target, _scope) {
                    console.log('收起的回调函数')
                    _scope.scrollBar.update(20);
                },
                onDestory: function () {
                    console.log('销毁的回调函数')
                },
                checked: function (_this, event, target, _scope) {
                    console.log('阻止冒泡')
                    console.log(target)
                    console.log(_scope)
                },
                unchecked: function (_this, event, target, _scope) {
                    console.log('阻止冒泡uncheck')
                    console.log(target)
                },
                // 搜索的回调函数
                search: function (key, event, target, _scope, _searchData) {
                    //  寻找目标位置
                    var _target = $('#' + _scope.opts.itemIdPrefix + key);
                    if (_target.size() < 1) {
                        var _this = $('#' + _scope.opts.itemIdPrefix + _searchData.fyid);
                        if (_this.size() > 0) {
                            if (_scope.opts.allowAppendNewNode) {
                                if (_scope.opts.showLog) {
                                    console.log('不存在了，需要添加节点')
                                };
                                _scope.opts.callback.appendNewNode(_this, event, target, _scope)
                            }
                        }
                    } else {
                        if (_scope.opts.showLog) {
                            console.log('自己玩去吧，已经存在了')
                        }
                    }
                },
                //  默认选中函数的
                selected: function (index, selectedIsTriggerCallback) {
                    var _currentSelected = _scope._this.find(_scope.opts.operateItemClass).eq(index);
                    if (_currentSelected.size() > 0) {
                        var _originSelected = _scope._this.find('.' + _scope.opts.selectedClass);
                        if (_originSelected.size() > 0) {
                            //  移除其他的选中
                            _originSelected.removeClass(_scope.opts.selectedClass);
                        }
                        // 选中当前的
                        _currentSelected.addClass(_scope.opts.selectedClass);
                        if (!!selectedIsTriggerCallback) {
                            _currentSelected.trigger('click.tree');
                        }
                    }
                }
            }
        };
        // 深度 合并参数
        _scope.opts = $.extend(true, {}, defaultOptions, options || {});
        // this  对象
        _scope._this = $(this);
        //  缓存id
        _scope.cacheId = _scope.opts.cacheId + _scope._this.attr('id');
        // ie7 以下的时间设置为 10毫秒
        var version = window.navigator.appVersion.toUpperCase();
        if (version.indexOf('MSIE')) {
            var start = version.indexOf('MSIE');
            var end = version.indexOf(';', start + 4);
            var versionNum = parseInt(version.substring(start + 4, end));
            if (versionNum < 8) {
                _scope.opts.tweenTime = 10;
            }
        };
        // init  方法
        _scope.init = function () {
            _scope.view.createTree();
            //绑定所有的事件
            _scope.bindEvent.normal();
            // 默认展开的方法
            _scope.defaultExpand();
            if (_scope.opts.hasTips) {
                _scope.createTipsBox();
            }
            // 默认选中
            // _scope.defaultSelected(_scope.opts.selectedIndex,_scope.opts.selectedIsTriggerCallback);
            return _scope;
        };
        /**
         * @param data  {object}  数据对象
         * @description 更新的方法
         */
        _scope.update = function (data) {
            //  重新赋值  _scope.opts.data
            _scope.opts.data = data;
            // 重新生成dom
            _scope.view.createTree();

            // 默认展开的方法
            _scope.defaultExpand();
            // 默认选中
            // _scope.defaultSelected(_scope.opts.selectedIndex,_scope.opts.selectedIsTriggerCallback);
            if (_scope.opts.hasScrollBar) {
                setTimeout(function () {
                    _scope.scrollBar.update(20);
                }, 100);
            }
        };
        // 默认选中
        _scope.defaultSelected = function (selectedIndex, selectedIsTriggerCallback) {
            if ($.type(selectedIndex) === 'number') {
                if ($.type(selectedIsTriggerCallback) === 'boolean') {
                    _scope.opts.callback.selected(selectedIndex, selectedIsTriggerCallback);
                } else {
                    _scope.opts.callback.selected(selectedIndex);
                }
            }
        };
        // 设置哪些条目可以被选中
        _scope.setWhatItemCanSelected = function (selectedIndex, isReset) {
            if ($.type(selectedIndex) === 'number') {
                var _isReset = false;
                if ($.type(isReset) === 'boolean') {
                    _isReset = isReset;
                }
                if (_isReset) {
                    _scope._this.find('.' + _scope.opts.itemHeadClass).each(function () {
                        var _this = $(this);
                        var _level = parseInt(_this.attr('level'));
                        var canselected = _this.attr('canselected');
                        if (_level > selectedIndex) {
                            $(this).attr('canselected', 'false')
                        } else {
                            if (canselected !== 'false') {
                                $(this).attr('canselected', 'true')
                            }
                        }
                    });
                } else {
                    _scope._this.find('.' + _scope.opts.itemHeadClass).each(function () {
                        var _this = $(this);
                        var _level = _this.attr('level');
                        if (_level > selectedIndex) {
                            _this.attr('canselected', 'false')
                        }
                    });
                }
            }
        };
        _scope.createTipsBox = function () {
            _scope.tipsBox = $('<div></div>').css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'white-space': 'nowrap',
                'font': '14px/1.4em "Microsoft YaHei"',
                'box-shadow': '0 0 4px 1px rgba(46, 139, 147, 0.5)',
                'background': 'rgba(9, 51, 101, 0.8)',
                'z-index': '99',
                'padding': '5px 10px',
                'display': 'none',
                'color': '#fff',
                "border-radius": '3px'
            });
            _scope.tipsBox.appendTo('body');
        }
            // 数据处理的方法
            _scope.data = {
                transformTozTreeFormat: function (data) {
                    var i, l,
                        key = _scope.opts.key,
                        parentKey = _scope.opts.parentKey,
                        childKey = _scope.opts.childKey;
                    if (!key || key == "" || !data) {
                        return [];
                    }
                    if ($.isArray(data)) {
                        var newArray = [];
                        var templateObj = {};
                        (function () {
                            for (var i = 0, l = data.length; i < l; i++) {
                                // 数据中的所有数据放到一个对象中
                                // 并且把 数组中的数据id作为对象的的key
                                // 本身的数据作为value
                                templateObj[data[i][key]] = data[i];
                            }
                            i = null;
                            l = null;
                        })();
                        (function () {
                            for (i = 0, l = data.length; i < l; i++) {
                                /*
                                 * 1.数组进行循环
                                 * 2. 取对象中的parentKey 查看是否存在，存在说明存在子类
                                 *    比较该条数据的 key 和parentKey
                                 *    2.1 key！= 和parentKey && templateObj.parentKey  同时成立的情况下，那么 说明该条数据是，此对象的子类
                                 *    2.2. 如果该对象存在 childKey那么  该直接 push() 这条数据到这个数组
                                 *    2.3. 如果不存在那么新建一个空数组 [],然后 push() 这条数据到数组
                                 *    2.4 如果2.1 不成立，那么说明是第一级，直接push到 新数组  newArray
                                 * 3. 需要注意的是，这里的数据是联动的，当父级增加一个子元素数组，然后把数据加进去，此时数组中就一个对象
                                 *     当数组中的内容发生变化的时候，这时候父级会跟着发生变化。
                                 *     原因是引用对象的地址是一样的。
                                 *     引用地址发生了变化，所有引用该对象的变量都会发生变化
                                 */
                                if (templateObj[data[i][parentKey]] && data[i][key] != data[i][
                                        parentKey
                                        ]) {
                                    if (!templateObj[data[i][
                                            parentKey
                                            ]][childKey]) {
                                        templateObj[data[i][
                                            parentKey
                                            ]][childKey] = [];
                                    }
                                    templateObj[data[i][parentKey]]
                                        [childKey].push(data[i]);
                                } else {
                                    newArray.push(data[i]);
                                }
                            }
                        })();
                        return newArray;
                    } else {
                        return [data];
                    }
                }
            };
        // 创建视图的方法
        _scope.view = {
            /**
             * @description   创建数的方法
             * @returns {{_scope}}
             */
            createTree: function () {
                var html = '';
                if (_scope.opts.cache) {
                    if (window.localStorage.getItem(_scope.cacheId)) {
                        html = window.localStorage.getItem(_scope.cacheId);
                        // 储存数据对象
                        _scope.opts.data = JSON.parse(window.localStorage.getItem(_scope.cacheId + 'data'));
                    } else {
                        _scope.opts.data = _scope.data.transformTozTreeFormat(_scope.opts.data);
                        html = _scope.view.appendNodes(_scope.opts.data, 1);
                        window.localStorage.setItem(_scope.cacheId, html);
                        //将数据对象储存到localStorage中
                        window.localStorage.setItem(_scope.cacheId + 'data', JSON.stringify(_scope.opts.data));
                    }
                } else {
                    _scope.opts.data = _scope.data.transformTozTreeFormat(_scope.opts.data)
                    html = _scope.view.appendNodes(_scope.opts.data, 1);
                }
                //生成html
                _scope._this[0].innerHTML = html;
                return _scope;
            },
            /**
             *
             * @param nodes  [object]  数据对象
             * @param level [number]  节点的级别
             * @param nodeIndex [number]  节点名字的索引值
             * @param nodeParamArray [array=>object]  节点名字的key值
             *          { key：
                 *           name:
                 *           childKey:
                 *           allowAppendNewNode：   是否允许添加新的节点
                 *           collapseChildren: [boolean]  是否闭合子节点
                 *          }
             * @returns {htmlSting}
             */
            appendNodes: function (nodes, level, nodeIndex, nodeParamArray) {
                if (!nodes) return [];
                var html = [];
                var key = _scope.opts.key;
                // 子元素对应的字段
                var childKey = _scope.opts.childKey;
                // 是否允许添加节点
                var allowAppendNewNode = _scope.opts.allowAppendNewNode;
                // 是否闭合节点
                var collapseChildren = _scope.opts.collapseChildren;
                //  中文名对应的字段
                var name = _scope.opts.name;
                //  是否可以选中
                var canSelected = _scope.opts.canSelected;
                //  是否有划过效果
                var hasHoverEffect = _scope.opts.hasHoverEffect;
                //  新增的class
                var newClass = '';
                //  是否有提示框
                var hasTips = _scope.opts.hasTips
                if ($.type(nodeIndex) === 'number' && $.type(nodeParamArray) === 'array') {
                    var nodeIndex = nodeIndex;
                    key = nodeParamArray[nodeIndex].key ? nodeParamArray[nodeIndex].key : key;
                    childKey = nodeParamArray[nodeIndex].childKey ? nodeParamArray[nodeIndex].childKey : childKey;
                    // console.log(nodeParamArray[nodeIndex].allowAppendNewNode)
                    if (nodeParamArray[nodeIndex].allowAppendNewNode !== 'undefined') {
                        allowAppendNewNode = nodeParamArray[nodeIndex].allowAppendNewNode;
                    }
                    name = nodeParamArray[nodeIndex].name ? nodeParamArray[nodeIndex].name : name;
                    if (nodeParamArray[nodeIndex].collapseChildren !== 'undefined') {
                        collapseChildren = nodeParamArray[nodeIndex].collapseChildren;
                    }
                    if (nodeParamArray[nodeIndex].canSelected !== 'undefined') {
                        canSelected = nodeParamArray[nodeIndex].canSelected;
                    }
                    if (nodeParamArray[nodeIndex].hasHoverEffect !== 'undefined') {
                        hasHoverEffect = nodeParamArray[nodeIndex].hasHoverEffect;
                    }
                    newClass = nodeParamArray[nodeIndex].className ? nodeParamArray[nodeIndex].className + '-' + nodeIndex : newClass;
                    if (nodeParamArray[nodeIndex].hasTips !== 'undefined') {
                        hasTips = nodeParamArray[nodeIndex].hasTips;
                    }
                }
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var node = nodes[i];
                    var childHtml = [];
                    var hasChild = false;
                    if (node[childKey] && node[childKey].length > 0) {
                        hasChild = true;
                        childHtml = _scope.view.appendNodes(node[childKey], level + 1, nodeIndex + 1, nodeParamArray);
                    }
                    // 每条数据的开始
                    _scope.view.makeDOMNodeMainBefore(html, level, i, l);
                    // 标题开始标签
                    _scope.view.makeDOMNodeNameBefore(html, node, level, key, childKey, collapseChildren, allowAppendNewNode, newClass, canSelected, hasHoverEffect, hasTips);
                    // 展开收起元素
                    _scope.view.makeDOMNodeTrigger(html, hasChild, allowAppendNewNode);
                    //  制作a标签开始
                    _scope.view.makeDOMNodeABefore(html, node);
                    //制作图标
                    _scope.view.makeDOMNodeIcon(html);
                    //制作checkbox
                    _scope.view.makeDOMNodeCheckbox(html);
                    // 制作a标签结束
                    _scope.view.makeDOMNodeAAfter(html, node, name);
                    // 标题结束标签
                    _scope.view.makeDOMNodeNameAfter(html);
                    // 制作ul
                    _scope.view.makeUlHtml(html, childHtml, level, hasChild, collapseChildren, newClass);
                    // 每条数据的结束
                    _scope.view.makeDOMNodeMainAfter(html);
                }
                return html.join('');
            },
            /**
             *
             * @param html [array]  html 对象
             * @param level [number]  节点的级别
             * @description  <li> 开始标签
             */
            makeDOMNodeMainBefore: function (html, level, i, l) {
                var _flag = false;
                if (_scope.opts.type === 2) {
                    if ((i + 1) === l) {
                        _flag = true;
                    }
                    html.push('<li   class="' + _scope.opts.itemClass + ' ' + (_flag ? _scope.opts.lastItemClass : '') + '  tree-item-0' + level + '"   >');
                } else {
                    html.push('<li   class="' + _scope.opts.itemClass + '  tree-item-0' + level + '"   >');
                }
            },
            /**
             * @param html [array]  html 对象
             * @param node  [object]  节点对象
             * @param level [number]  节点的级别
             *  @description  <h3> 开始标签
             */
            makeDOMNodeNameBefore: function (html, node, level, key, childKey, collapseChildren, allowAppendNewNode, newClass, canSelected, hasHoverEffect, hasTips) {
                var dataString = []
                var allowAppendNewNode = allowAppendNewNode;
                var collapseChildren = collapseChildren;
                var canSelected = canSelected;
                if(typeof node['canSelected']!='undefined'){
                    canSelected=node['canSelected'];
                }
                var hasTips = hasTips;
                for (name in node) {
                    if (node[name] === '') {
                        node[name] = 'false';
                    }
                    if (name !== childKey) {
                        dataString.push('data-' + name + '=' + node[name]);
                    }
                };
                var className = _scope.opts.itemHeadClass + ' ' + (!!node.disabled ? _scope.opts.disabledClass : '') + ' tree-hd-0' + level;
                if (collapseChildren) {
                    className = className + ' ' + _scope.opts.collapseClass;
                }
                if (!!newClass) {
                    className = className + ' ' + newClass;
                }
                html.push(' <h3 hastips="' + hasTips + '" canselected="' + canSelected + '"  hover="' + hasHoverEffect + '"   allowAppendNewNode="' + allowAppendNewNode + '"  level="' + level + '"    ' + dataString.join(' ') + '  id="' + _scope.opts.itemIdPrefix + node[key] + '"  class="' + className + '"> ');
            },
            /**
             * @param html       html 对象
             * @param hasChild   boolean
             * @description     展开收起<span> 开始标签,trigger 元素
             */
            makeDOMNodeTrigger: function (html, hasChild, allowAppendNewNode) {
                var className = _scope.opts.triggerClass;
                if (!hasChild && !allowAppendNewNode) {
                    className = _scope.opts.triggerClass + ' ' + _scope.opts.hideTrigerClass;
                }
                html.push(' <span class="' + className + '"></span>');
            },
            /**
             *
             * @param html [array]  html 对象
             * @param node  [object]  节点对象
             * @description  <a> 开始标签
             */
            makeDOMNodeABefore: function (html, node) {
                if (!!node.url) {
                    html.push(' <a href="' + node.url + '" hidefocus="true"  class="' + _scope.opts.nodeNameClass + '"  >');
                } else {
                    html.push(' <a href="javascript:void(0);" hidefocus="true"  class="' + _scope.opts.nodeNameClass + '"  >');
                }
            },
            /**
             *
             * @param html [array]  html 对象
             * @description  图标标签<span>
             */
            makeDOMNodeIcon: function (html) {
                if (_scope.opts.hasIcon) {
                    html.push('<span class="fd-icon"  title="图标容器"></span>');
                }
            },
            /**
             * @param html [array]  html 对象
             * @description  <input type="checkbox"> 标签
             */
            makeDOMNodeCheckbox: function (html) {
                if (_scope.opts.hasCheckbox) {
                    // 注意这里如果用label标签包裹的话，点击事件会走两次
                    html.push('<span class="' + _scope.opts.checkboxClass + '"><input type="checkbox" name=""     /><span  class="fd-input-checkbox"></span></span>');
                }
            },
            /**
             *
             * @param html [array]  html 对象
             * @param node  [object]  节点对象
             * @description  <a> 结束标签
             */
            makeDOMNodeAAfter: function (html, node, name) {
                html.push(node[name] + '</a>');
            },
            /**
             *
             * @param html [array]  html 对象
             *  @description  <h3> 结束标签
             */
            makeDOMNodeNameAfter: function (html) {
                html.push('</h3>');
            },
            /**
             *
             * @param html [array]  html 对象
             * @param childHtml  [object]  节点对象
             * @param level [number]  节点的级别
             *  @description  <ul> 标签
             */
            makeUlHtml: function (html, childHtml, level, hasChild, collapseChildren, newClass) {
                var style = "";
                if (collapseChildren) {
                    style = "style=display:none;"
                };
                var className = _scope.opts.treeContentClass + ' ul-tree-ct-0' + level;
                if (newClass) {
                    className = className + ' ' + newClass;
                }
                if (hasChild) {
                    html.push(' <ul ' + style + '  class="' + className + ' ">' + childHtml + '</ul>');
                } else {
                    html.push(' <ul ' + style + '   class="' + className + '"></ul>');
                }
            },
            /**
             *
             * @param html [array]  html 对象
             * @description  </li> 结束标签
             */
            makeDOMNodeMainAfter: function (html) {
                html.push('</li>');
            }
        };
        /**
         *@description  销毁的方法
         * 1.解除事件
         * 2.清空对象
         */
        _scope.destory = function () {
            // 解除事件绑定，释放内存
            _scope.unbindEvent.allEvent();
            //清空元素
            _scope.html('');
        };
        /**
         * @param collapseFlag  {boolean}   是否闭合
         * @param parent  {element}      父元素
         * @param treeContent  {element}      树容器，需要执行动画的元素
         * @description 动画函数
         */
        _scope.animate = function (collapseFlag, parent, treeContent, _this, event, target, _scope) {
            if (treeContent.is(':animated')) {
                return false;
            }
            //  关闭动画，默认为有动画
            if (!_scope.opts.hasAnimate) {
                _scope.opts.tweenTime = 0;
            }
            if (collapseFlag) {
                parent.removeClass(_scope.opts.collapseClass);
                //  如果仅仅展开一级
                if (_scope.opts.onlyExpandOneLevel) {
                    // 其他元素缩起
                    treeContent.parent().siblings().each(function () {
                        var _this = $(this);
                        var _itemHead = _this.children('.' + _scope.opts.itemHeadClass);
                        var _flag = _itemHead.hasClass(_scope.opts.collapseClass);
                        if (!_flag) {
                            _itemHead.addClass(_scope.opts.collapseClass).next('.' + _scope.opts.treeContentClass).slideUp(_scope.opts.tweenTime);
                        }
                    });
                }
                treeContent.stop(true, true).slideDown(_scope.opts.tweenTime, function () {
                    if ($.type(_scope.opts.callback.onExpand) === 'function') {
                        _scope.opts.callback.onExpand(_this, event, target, _scope);
                    }
                });
            } else {
                parent.addClass(_scope.opts.collapseClass);
                treeContent.stop(true, true).slideUp(_scope.opts.tweenTime / _scope.opts.tweenTime, function () {
                    if ($.type(_scope.opts.callback.onCollapse) === 'function') {
                        _scope.opts.callback.onCollapse(_this, event, target, _scope);
                    }
                });
            }
        };
        /**
         *
         * @type {{
             *  allEvent: Function,
             * mouseenter: Function,
             * mouseleave: Function,
             * defineEvent: Functio
             * }}
         */
            _scope.bindEvent = {
                getTarget: function (event) {
                    var event = event || window.event;
                    var target = $(event.target);
                    return target;
                },
                stopBubble: function (event) {
                    event.stopPropagation();
                },
                normal: function () {
                    _scope.bindEvent.mouseenter();
                    _scope.bindEvent.mouseleave();
                    _scope.bindEvent.click();
                    _scope.bindEvent.toggleChecked();
                    _scope.bindEvent.toggleSlide();
                    if (_scope.opts.hasTips) {
                        _scope.bindEvent.mouseenter();
                        _scope.bindEvent.mouseleave();
                        _scope.bindEvent.mousemove();
                    }
                },
                // 绑定所有的事件
                all: function () {
                    _scope.bindEvent.mouseenter();
                    _scope.bindEvent.mouseleave();
                    _scope.bindEvent.mousemove();
                    _scope.bindEvent.click();
                    _scope.bindEvent.dblclick();
                    _scope.bindEvent.mouseDown();
                    _scope.bindEvent.mouseUp();;
                    _scope.bindEvent.toggleChecked()
                    _scope.bindEvent.toggleSlide();
                },
                mouseenter: function () {
                    // 鼠标滑过事件
                    _scope._this.off('mouseenter.tree').on('mouseenter.tree', '.' + _scope.opts.itemHeadClass, function (event) {
                        var _this = $(this);
                        var event = event || window.event;
                        var target = _scope.bindEvent.getTarget(event);
                        if (_this.attr('hover') === 'true') {
                            _this.addClass(_scope.opts.hoverClass);
                            if ($.type(_scope.opts.callback.onMouseenter) === 'function') {
                                _scope.opts.callback.onMouseenter(_this, event, target, _scope);
                            }
                        }
                        if (_this.attr('hastips') === 'true') {
                            if (target.is(_scope.opts.tipsTriggerElement)) {
                                var _top = event.pageY;
                                var _left = event.pageX;
                                _scope.tipsBox.text(_this.find('a').text()).css({
                                    top: _top,
                                    left: _left + 20,
                                    display: 'block'
                                });
                                //  执行tips的回调函数
                                if ($.type(_scope.opts.callback.tips) === 'function') {
                                    _scope.opts.callback.tips(_this, event, target, _scope)
                                }
                            }
                        }
                    });
                },
                // 移开事件
                mouseleave: function () {
                    _scope._this.off('mouseleave.tree').on('mouseleave.tree', '.' + _scope.opts.itemHeadClass, function (event) {
                        var _this = $(this);
                        if (_this.hasClass(_scope.opts.hoverClass)) {
                            _this.removeClass(_scope.opts.hoverClass);
                        }
                        if (_this.attr('hastips') === 'true') {
                            if (_scope.tipsBox.is(':visible')) {
                                _scope.tipsBox.css({
                                    display: 'none'
                                });
                            }
                        }
                        var target = _scope.bindEvent.getTarget(event);
                        if ($.type(_scope.opts.callback.onMouseleave) === 'function') {
                            _scope.opts.callback.onMouseleave(_this, event, target, _scope);
                        }
                    });
                },
                // 移动事件
                mousemove: function () {
                    _scope._this.off('mousemove.tree').on('mousemove.tree', '.' + _scope.opts.itemHeadClass, function (event) {
                        var _this = $(this);
                        var target = _scope.bindEvent.getTarget(event);
                        var event = event || window.event;
                        if (_this.attr('hastips') === 'true') {
                            var _top = event.pageY;
                            var _left = event.pageX;
                            if (target.is(_scope.opts.tipsTriggerElement)) {
                                if (_scope.tipsBox.is(':hidden')) {
                                    _scope.tipsBox.css({
                                        display: 'block'
                                    });
                                }
                                _scope.tipsBox.css({
                                    top: _top,
                                    left: _left + 20
                                });
                            } else {
                                if (_scope.tipsBox.is(':visible')) {
                                    _scope.tipsBox.css({
                                        display: 'none'
                                    });
                                }
                            };
                        };
                        if ($.type(_scope.opts.callback.onMouseleave) === 'function') {
                            _scope.opts.callback.onMmousemove(_this, event, target, _scope);
                        };
                    });
                },
                // 点击事件
                click: function () {
                    // 点击事件的回调函数
                    _scope._this.off('click.tree').on('click.tree', _scope.opts.operateItemClass, function (event) {
                        var _this = $(this);
                        var _parent = _this.closest('.' + _scope.opts.itemHeadClass);
                        var target = _scope.bindEvent.getTarget(event);
                        var _flag = target.is('.' + _scope.opts.triggerClass);
                        // 如果是点击的图标区域并且不是扩大区域那么直接返回
                        if (_flag && !_scope.opts.extendArea) {
                            if (_scope.opts.showLog) {
                                console.log('_scope.opts.extendArea为false,点击fd-trigger元素阻止默认事件')
                            }
                            return;
                        } else {
                            var _warning = _scope._this.find('.' + _scope.opts.goToTargetClass);
                            if (_warning.size() > 0) {
                                // 移除其他的提醒类名
                                _warning.removeClass(_scope.opts.goToTargetClass);
                            }
                            if (_parent.attr('canselected') === 'true') {
                                // 选中的类名
                                if (!_parent.hasClass(_scope.opts.selectedClass)) {
                                    _scope._this.find('.' + _scope.opts.selectedClass).removeClass(_scope.opts.selectedClass);
                                    _parent.addClass(_scope.opts.selectedClass);
                                    if ($.type(_scope.opts.callback.onClick) === 'function') {
                                        _scope.opts.callback.onClick(_this, event, target, _scope);
                                    };
                                    if (_scope.opts.showLog) {
                                        console.log('点击' + _scope.opts.operateItemClass + ',该条数据增加选中状态，执行click函数；')
                                    }
                                } else {
                                    if (_scope.opts.showLog) {
                                        console.log('点击' + _scope.opts.operateItemClass + ',该条数据已经是选中状态，无需执行click函数；')
                                    }
                                }
                            }
                        }
                    });
                },
                // 双击事件
                dblclick: function () {
                    // 双击事件的回调函数
                    _scope._this.off('dblclick.tree').on('dblclick.tree', _scope.opts.operateItemClass, function (event) {
                        var _this = $(this);
                        var target = _scope.bindEvent.getTarget(event);
                        if ($.type(_scope.opts.callback.onDblClick) === 'function') {
                            _scope.opts.callback.onDblClick(_this, event, target, _scope);
                        };
                    });
                },
                // 鼠标按下
                mouseDown: function () {
                    // 鼠标按下的回调函数
                    _scope._this.off('mousedown.tree').on('mousedown.tree', _scope.opts.operateItemClass, function (event) {
                        var _this = $(this);
                        var target = _scope.bindEvent.getTarget(event);
                        if ($.type(_scope.opts.callback.onMouseDown) === 'function') {
                            _scope.opts.callback.onMouseDown(_this, event, target, _scope);
                        }
                    });
                },
                // 鼠标松开
                mouseUp: function () {
                    // 鼠标按下的回调函数
                    _scope._this.off('mouseup.tree').on('mouseup.tree', _scope.opts.operateItemClass, function (event) {
                        var _this = $(this);
                        var target = _scope.bindEvent.getTarget(event);
                        if ($.type(_scope.opts.callback.onMouseUp) === 'function') {
                            _scope.opts.callback.onMouseUp(_this, event, target, _scope);
                        }
                    });
                },
                toggleChecked: function () {
                    if (_scope.opts.hasCheckbox) {
                        _scope._this.off('click.toggleChecked').on('click.toggleChecked', '.' + _scope.opts.checkboxClass , function (event) {
                            var _this = $(this);
                            var target = _scope.bindEvent.getTarget(event);
                            var _input=_this.find(':checkbox');
                            var _parent = target.closest('.' + _scope.opts.checkboxClass);
                            // 阻止冒泡
                            _scope.bindEvent.stopBubble(event);
                            if (_parent.closest('.' + _scope.opts.itemHeadClass).hasClass(_scope.opts.disabledClass)) {
                                event.preventDefault();
                                return;
                            }
                            if(!target.is('input:checkbox')){
                                _input.prop('checked',!_input.prop('checked') );
                            }
                            if (!_input.prop('checked')) {
                                _parent.removeClass(_scope.opts.checkedClass);
                                if ($.type(_scope.opts.callback.unchecked) === 'function') {
                                    _scope.opts.callback.unchecked(_this, event, target, _scope);
                                    if (_scope.opts.showLog) {
                                        console.log('点击' + _scope.opts.checkboxClass + ',有选中类名' + _scope.opts.checkedClass + '取消选中，那么执行unchecked函数；')
                                    }
                                }
                            } else {
                                _parent.addClass(_scope.opts.checkedClass);
                                if ($.type(_scope.opts.callback.checked) === 'function') {
                                    _scope.opts.callback.checked(_this, event, target, _scope);
                                    if (_scope.opts.showLog) {
                                        console.log('点击' + _scope.opts.checkboxClass + ',没有选中类名' + _scope.opts.checkedClass + '选中checkbox，那么执行checked函数；')
                                    }
                                }
                            }
                        });
                    }
                },
                toggleSlide: function () {
                    _scope._this.off('click.toggleSlide').on('click.toggleSlide', '.' + _scope.opts.itemHeadClass, function (event) {
                        var _this = $(this);
                        var target = _scope.bindEvent.getTarget(event);
                        var _parent = target.closest('.' + _scope.opts.itemHeadClass);
                        // 是否是闭合状态
                        var _collapseFlag = _parent.hasClass(_scope.opts.collapseClass);
                        //  tree 内容容器
                        var _treeContent = _parent.next('.' + _scope.opts.treeContentClass);
                        // 判断是否是empty内容,注意这里需要把空格给取消
                        var _emptyFlag = $.trim(_treeContent.text()) === '' ? true : false;
                        if (_parent.hasClass(_scope.opts.disabledClass)) {
                            return;
                        };
                        // 阻止冒泡的元素
                        if (_emptyFlag) {
                            if (_scope.opts.allowAppendNewNode) {
                                if (_scope.opts.extendArea) {
                                    if ($.type(_scope.opts.callback.appendNewNode) === 'function') {
                                        console.log('extend')
                                        _scope.opts.callback.appendNewNode(_this, event, target, _scope);
                                    }
                                } else {
                                    if (target.is('.' + _scope.opts.triggerClass)) {
                                        if ($.type(_scope.opts.callback.appendNewNode) === 'function') {
                                            _scope.opts.callback.appendNewNode(_this, event, target, _scope);
                                        }
                                    }
                                }
                            } else {
                                if (_scope.opts.showLog) {
                                    console.log('click.toggleSlide事件，没有子元素直接返回！')
                                }
                                return;
                            }
                        }
                        //  扩展展开收起图标触发事件的区域
                        if (_scope.opts.extendArea) {
                            _scope.animate(_collapseFlag, _parent, _treeContent, _this, event, target, _scope);
                            if (_scope.opts.showLog) {
                                console.log('click.toggleSlide事件，有子元素，是扩大区域，点击整条都能执行动画有效')
                            }
                        } else {
                            if (target.is('.' + _scope.opts.triggerClass)) {
                                _scope.animate(_collapseFlag, _parent, _treeContent, _this, event, target, _scope);
                                if (_scope.opts.showLog) {
                                    console.log('click.toggleSlide事件，有子元素，不是扩大区域，点击trigger元素才能执行动画')
                                }
                            }
                        }
                    });
                }
            };
        //  取消事件
        _scope.unbindEvent = {
            mouseenter: function () {
                _scope._this.off('mouseenter.tree');
            },
            mouseleave: function () {
                _scope._this.off('mouseleave.tree');
            },
            click: function () {
                _scope._this.off('click.tree');
            },
            dblclick: function () {
                _scope._this.off('dblclick.tree');
            },
            mouseDown: function () {
                _scope._this.off('mouseDown.tree');
            },
            mouseUp: function () {
                _scope._this.off('mouseUp.tree');
            },
            toggleChecked: function () {
                _scope._this.off('click.toggleChecked');
            },
            toggleSlide: function () {
                _scope._this.off('click.toggleSlide');
            },
            // 绑定所有的事件
            all: function () {
                _scope.unbindEvent.mouseenter();
                _scope.unbindEvent.mouseleave();
                _scope.unbindEvent.click();
                _scope.unbindEvent.dblclick();
                _scope.unbindEvent.mouseDown();
                _scope.unbindEvent.mouseUp();
                _scope.unbindEvent.toggleChecked();
                _scope.unbindEvent.toggleSlide();
            },
            normal: function () {
                _scope.unbindEvent.mouseenter();
                _scope.unbindEvent.mouseleave();
                _scope.unbindEvent.click();
                _scope.unbindEvent.toggleChecked();
                _scope.unbindEvent.toggleSlide();
            }
        };
        /**
         *@description   默认展开
         */
        _scope.defaultExpand = function () {
            if (typeof _scope.opts.defaultExpandIndex === 'number') {
                _scope._this.children().eq(_scope.opts.defaultExpandIndex).children('.' + _scope.opts.itemHeadClass).removeClass(_scope.opts.collapseClass).next('.' + _scope.opts.treeContentClass).css('display', 'block');
            }
        };
        /**
         *@description   搜索按钮
         */
        _scope.search = {
            searchButton: $(_scope.opts.searchButton),
            searchInput: $(_scope.opts.searchInput),
            treeContain: $(_scope.opts.treeContain),
            autocompleterContain: $(_scope.opts.autocompleterContain),
            goToTarget: function (key) {
                var _target = $('#' + _scope.opts.itemIdPrefix + key);
                // 移除其他的提醒类名
                _scope._this.find('.' + _scope.opts.goToTargetClass).removeClass(_scope.opts.goToTargetClass);
                // 当前的元素增加提醒类名
                _target.addClass(_scope.opts.goToTargetClass);
                // 父级元素全部展开
                _target.parents('.' + _scope.opts.treeContentClass).each(function () {
                    var _that = $(this);
                    var _siblings = _that.siblings('.' + _scope.opts.itemHeadClass);
                    if (_siblings.hasClass(_scope.opts.collapseClass)) {
                        _siblings.removeClass(_scope.opts.collapseClass)
                    }
                    if (_that.is(':hidden')) {
                        _that.show();
                    }
                });
                var _top = _target.position().top;
                if (!_scope.opts.hasScrollBar) {
                    // 定位到当前的元素
                    _scope.search.treeContain.stop(true, true).animate({
                        scrollTop: _top
                    }, _scope.opts.searchScrollTweenTime);
                } else {
                    // 父级元素全部展开
                    _scope.scrollBar.update(_scope.opts.searchScrollTweenTime, _top);
                }
            },
            callback: {
                search: function (event, target) {
                    /**
                     * 1.获取 input上data的所有数据
                     * 2.遍历id,查看树中是否存在该id的dom
                     * 3.执行search 回调函数，注意这里必须是同步的ajax
                     * 4. 执行动画定位
                     */
                    var _searchData = _scope.search.searchInput.data();
                    //  检索多次
                    var _key = '';
                    for (var j = 0, k = _scope.opts.searchKey.length; j < k; j++) {
                        if (!!_searchData[_scope.opts.searchKey[j]]) {
                          //  console.log('走了这里1' + _key)
                            _key = _searchData[_scope.opts.searchKey[j]];
                            break;
                        }
                    }
                    // 执行回调函数
                    if ($.type(_scope.opts.callback.search) === 'function' && _key !== '') {
                        // 调用函数
                        _scope.opts.callback.search(_key, event, target, _scope, _searchData);
                    }
                    // 定位到目标位置
                    if (!!_key) {
                        _scope.search.goToTarget(_key);
                        // 失去焦点
                        _scope.search.searchInput.trigger('blur.autocompleter');
                    } else {
                        var query = $.trim(_scope.search.searchInput.val());
                        if (query !== '') {
                            var _getFocus = true;
                            $.each(_scope.autocompleter.response, function (index, value) {
                                //  检索多次
                                var searchName = '';
                                (function(){
                                    for (var j = 0, k = _scope.opts.searchName.length; j < k; j++) {
                                        if (!!value[_scope.opts.searchName[j]]) {
                                            searchName = _scope.opts.searchName[j];
                                            break;
                                        }
                                    }
                                })();

                                (function(){
                                    if (value[searchName] === query) {
                                        _scope.search.searchInput.data(value);
                                        _getFocus = false;
                                        _searchData = value;
                                        // 重新执行回调函数，给key重新赋值
                                        for (var j = 0, k = _scope.opts.searchKey.length; j < k; j++) {
                                            if (!!_searchData[_scope.opts.searchKey[j]]) {
                                                _key = _searchData[_scope.opts.searchKey[j]];
                                                break;
                                            }
                                        }
                                        // 执行回调函数
                                        if ($.type(_scope.opts.callback.search) === 'function') {
                                            // 调用函数
                                            _scope.opts.callback.search(_key, event, target, _scope, _searchData);
                                        }
                                        // 定位到目标位置
                                        _scope.search.goToTarget(_key);
                                        // 失去焦点
                                        _scope.search.searchInput.trigger('blur.autocompleter');
                                        //  退出当前的循环
                                        return false;
                                    }
                                })();
                            });
                            if (_getFocus) {
                                _scope.search.searchInput.focus();
                            }
                        } else {
                            _scope.search.searchInput.focus();
                        }
                    }
                }
            }
        };
        // 自动完成对象
        _scope.autocompleter = {
            timer: null,
            // 查询出来的数据对象，默认为空
            response: [],
            // 复制值到 searchInput
            copyValueToSearch: function (_this) {
               var   _menuSelected=!!_this?_this:_scope.search.autocompleterContain.find('.' + _scope.opts.menuSelectedClass);
                if (_menuSelected.size() > 0) {
                    //  获取data
                    var data = _menuSelected.data();
                    _scope.search.searchInput.removeData();
                    //  赋值给data
                    _scope.search.searchInput.data(data);
                    //  input的值
                    var _val = '';
                    //  检索多次，
                    for (var j = 0, k = _scope.opts.searchName.length; j < k; j++) {
                        if (!!data[_scope.opts.searchName[j]]) {
                            _val = data[_scope.opts.searchName[j]];
                            break;
                        }
                    }
                    _scope.search.searchInput.val(_val);
                    //  隐藏提示
                    _scope.autocompleter.hideAutocompleter();
                }
            },
            // 隐藏自动完成提示框
            hideAutocompleter: function () {
                $(_scope.search.autocompleterContain).addClass(_scope.opts.hideAutocompleterClass);
            },
            //  显示自动完成的框
            showAutocompleter: function () {
                $(_scope.search.autocompleterContain).removeClass(_scope.opts.hideAutocompleterClass);
            },
            // 查询
            query: function (query, nodes, limit, isAjax) {
                if (!isAjax) {
                    var nodes = nodes, limit = limit;
                    if (_scope.autocompleter.response.length >= limit) {
                        return false;
                    }
                    for (var i = 0, l = nodes.length; i < l; i++) {
                        var node = nodes[i];
                        if (node[_scope.opts.name].search(query) !== -1) {
                            _scope.autocompleter.response.push(node);
                        }
                        if (node[_scope.opts.childKey] && node[_scope.opts.childKey].length > 0) {
                            _scope.autocompleter.query(query, node[_scope.opts.childKey], limit);
                        }
                        // 打断循环
                        if (_scope.autocompleter.response.length >= limit) {
                            break;
                            return _scope.autocompleter.response;
                        }
                    }
                } else {
                    if (_scope.opts.showLog) {
                        console.log('发送到后台的数据是：');
                        console.log({
                            param: JSON.parse('{"' + _scope.opts.autocompleterAjax.data + '":"' + query + '"}')
                        });
                        console.log('\n');
                    }
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
                            if ($.type(data.result) === 'array') {
                                if (data.result.length > 0) {
                                    _scope.autocompleter.response = data.result;
                                    if (data.result.length > limit) {
                                        //  slice 不会删除原来的数组
                                        //  splice 会删除原来的数组
                                        _scope.autocompleter.response = _scope.autocompleter.response.slice(0, limit);
                                    }
                                }
                            } else {
                                _scope.autocompleter.response = [];
                            }
                            // 生成自动提示框
                            _scope.autocompleter.makeList(query);
                            if ($.type(_scope.opts.autocompleterAjax.success) === 'function') {
                                _scope.opts.autocompleterAjax.success(data, stauts, xhr, _scope);
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
                        var dataString = [];
                        for (name in node) {
                            if (name !== _scope.opts.childKey) {
                                if (node[name] === '') {
                                    node[name] = 'false';
                                }
                                dataString.push('data-' + name + '=' + node[name]);
                            }
                        }
                        dataString = dataString.join(' ');
                        //  检索多次
                        var searchName = '';
                        for (var j = 0, k = _scope.opts.searchName.length; j < k; j++) {
                            if (!!node[_scope.opts.searchName[j]]) {
                                searchName = _scope.opts.searchName[j];
                                break;
                            }
                        }
                        var name = node[searchName].split(query).join('<em>' + query + '</em>')
                        list.push('<li  class="fd-item" ' + dataString + '>' + name + '</li>');
                    }
                    list.push('</ul>');
                    _scope.search.autocompleterContain[0].innerHTML = list.join('');
                    _scope.search.autocompleterContain.removeClass(_scope.opts.hideAutocompleterClass);
                    if (!_scope.opts.isAutocompleter) {
                        _scope.search.autocompleterContain.addClass(_scope.opts.hideAutocompleterClass)
                    }
                } else {
                    _scope.search.autocompleterContain.html('<div class="fd-empty-contain">未找到符合条件的数据</div>').removeClass(_scope.opts.hideAutocompleterClass);
                    _scope.search.searchInput.removeData();
                    if (!_scope.opts.isAutocompleter) {
                        _scope.search.autocompleterContain.addClass(_scope.opts.hideAutocompleterClass)
                    }
                }
            },
            //  忽略的键值
            ignoredKeyCod: [9, 13, 17, 19, 20, 27, 33, 34, 35, 36,
                37, 39, 44, 92, 113, 114, 115, 118, 119, 120, 122,
                123, 144, 145
            ],
            //  绑定事件
            bindEvent: function () {
                _scope.search.searchInput.off('keydown.autocompleter').on('keydown.autocompleter', _scope.autocompleter.keydown);
                _scope.search.searchInput.off('keyup.autocompleter').on('keyup.autocompleter', _scope.autocompleter.keyup);
                _scope.search.searchInput.off('focus.autocompleter').on('focus.autocompleter', _scope.autocompleter.focus);
                _scope.search.searchInput.off('blur.autocompleter').on('blur.autocompleter', _scope.autocompleter.blur);
                _scope.search.autocompleterContain.off('mousedown.autocompleter').on('mousedown.autocompleter', 'li', _scope.autocompleter.mousedown);
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
                }
            },
            // 获得焦点自动搜索
            search: function () {
                // 说明是文字键需要进行搜索
                var query = $.trim(_scope.search.searchInput.val());
                if (query !== '') {
                    // 清空_scope.autocompleter.response
                    _scope.autocompleter.response = [];
                    //  如果是ajax搜索
                    if (_scope.opts.autocompleterIsAjax) {
                        // 重新搜索
                        _scope.autocompleter.query(query, _scope.opts.data, _scope.opts.limitCount, true);
                    } else {
                        // 重新搜索
                        _scope.autocompleter.query(query, _scope.opts.data, _scope.opts.limitCount);
                        //生成新的列表
                        _scope.autocompleter.makeList(query);
                    }
                } else {
                    if (!$(_scope.search.autocompleterContain).hasClass(_scope.opts.hideAutocompleterClass)) {
                        _scope.autocompleter.hideAutocompleter();
                    }
                }
            },
            //  获得焦点
            focus: function () {
                _scope.autocompleter.search();
            },
            // 失去焦点
            blur: function () {
                //  隐藏框
                _scope.autocompleter.hideAutocompleter();
                //  失去焦点removeData
                _scope.search.searchInput.removeData();
            },
            // 键盘松开
            keyup: function (event) {
                var data = event.data;
                var code = event.keyCode ? event.keyCode : event.which;
                // down  arrow   || up  arrow
                if (code === 40 || code === 38) {
                    // 如果自动完成容器是隐藏的，或者下面的ul小于1，那么直接返回
                    if ($(_scope.search.autocompleterContain).hasClass(_scope.opts.hideAutocompleterClass) || $(_scope.search.autocompleterContain).find('ul').size() < 1) {
                        return;
                    } else {
                        //  初始化的值为 -1
                        var selectedIndex = -1;
                        var _menuSelected = _scope.search.autocompleterContain.find('.' + _scope.opts.menuSelectedClass);
                        if (_menuSelected.size() > 0) {
                            selectedIndex = _menuSelected.index();
                        }
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
                        }
                        // 选中菜单
                        _scope.search.autocompleterContain.find('ul').children().removeClass(_scope.opts.menuSelectedClass).eq(selectedIndex).addClass(_scope.opts.menuSelectedClass);
                    }
                } else if ($.inArray(code, _scope.autocompleter.ignoredKeyCod) === -1) {
                    // 说明需要进行搜索，查出需要提示的数据项
                    if (_scope.autocompleter.timer) {
                        clearTimeout(_scope.autocompleter.timer);
                        _scope.autocompleter.timer = null;
                    }
                    // 超时查询
                    _scope.autocompleter.timer = setTimeout(function () {
                        _scope.autocompleter.search();
                    }, _scope.opts.deferTime);
                } else {
                    // [9, 13, 17, 19, 20, 27, 33, 34, 35, 36, 37, 39, 44, 92, 113, 114, 115, 118, 119, 120, 122, 123, 144, 145]
                    // 20 是大小写转换键
                    // 27 esc
                    // 13回车键，一赋值，2搜索的功能
                    if (code === 13) {
                        // 如果是显示的那么
                        if (!_scope.search.autocompleterContain.hasClass(_scope.opts.hideAutocompleterClass)) {
                            //  1.有选中的条目,进行赋值
                            _scope.autocompleter.copyValueToSearch();
                            // 2.赋值后进行搜索
                            _scope.search.searchButton.trigger('click.search');
                        } else {
                            // 1.进行搜索
                            _scope.search.searchButton.trigger('click.search');
                        }
                    }
                    if (_scope.opts.showLog) {
                        console.log('禁用键' + code)
                    }
                }
            },
            // 鼠标按下
            mousedown: function () {
                //  1.选中的条目,先进行赋值
                _scope.autocompleter.copyValueToSearch($(this));
                // 2.赋值后进行搜索
                _scope.search.searchButton.trigger('click.search');
            }
        };
        /**
         * @author  wuwg
         * @createTime   2016-07-03
         * @updateTime   2016-07-03
         * @description  自制滚动条函数
         *  运用到了tree中的两个对象   _scope.search.treeContain  和  _scope._this
         *  //父元素
         _scope.scrollBar.parentContain===_scope.search.treeContain
         // 内容容器
         _scope.scrollBar.contentContain =_scope._this;
         *
         */
        _scope.scrollBar = {
            // 比较值函数
            range: function (num, max, min) {
                return Math.ceil(Math.min(max, Math.max(num, min)));
            },
            // 阻止冒泡函数
            stopBubble: function (event) {
                event.stopPropagation();
                event.preventDefault();
            },
            // 创建滚动条容器
            createScrollBar: function () {
                _scope.scrollBar.trackContain.html('<span class="' + _scope.opts.scrollBarClass + '"></span>');
                _scope.scrollBar.bar = _scope.scrollBar.trackContain.find('.' + _scope.opts.scrollBarClass);
            },
            //  是否有滚动条
            hasScroll:false,
            /**
             * @description  获取所有的参数
             */
            getParamHeight: function () {
                //  容器的高(可视区域的高)
                _scope.scrollBar.offsetHeight = _scope.scrollBar.parentContain.height();
                // 文档的高
                _scope.scrollBar.scrollHeight = _scope.scrollBar.contentContain.innerHeight();
                // 滑道的高
                _scope.scrollBar.trackContainHeight = _scope.scrollBar.trackContain.innerHeight();
                // 滚动条的高（ 计算公式：可视区域的高/文档的高= 等于scrollBar.height/_scope.scrollBar.contain.height）
                var scrollBar = _scope.scrollBar.offsetHeight / _scope.scrollBar.scrollHeight * _scope.scrollBar.trackContainHeight;
                //  重新定义滚动条的高（需要设置一个最小值）
                _scope.scrollBar.barHeight = Math.max(_scope.opts.scrollBarMinHeight, scrollBar);
                // 滚动条最小的top值
                _scope.scrollBar.scrollMinDistance = 0;
                // 滚动条最大的top值
                _scope.scrollBar.scrollMaxDistance = _scope.scrollBar.trackContainHeight - _scope.scrollBar.barHeight;

                // 当 _scope.scrollBar.scrollMaxDistance>0 那么说明有滚动条，否则就没有滚动条
                _scope.scrollBar.hasScroll=_scope.scrollBar.scrollMaxDistance>0?true:false;

                // 滑道的有效区域高  （计算公式：等于滑道高减去滚动条的高）
                _scope.scrollBar.scrollAreaHeight = _scope.scrollBar.trackContainHeight - _scope.scrollBar.barHeight;
                // 设置滚动条的高
                _scope.scrollBar.bar.height(_scope.scrollBar.barHeight);
                // 如果可是区域的高大于文档内容的高那么隐藏滚动条
                if (_scope.scrollBar.offsetHeight > _scope.scrollBar.scrollHeight) {
                    _scope.scrollBar.trackContain.hide();
                } else {
                    _scope.scrollBar.trackContain.show();
                }
            },
            /**
             *
             * @param scrollTweenTime     number 毫秒
             * @description  更新滚动条所有参数和内容以及滚动条的位置
             */
            update: function (scrollTweenTime, number) {
                // 重新获取参数
                _scope.scrollBar.getParamHeight();
                // 指定位置 设置top值
                var   _top = ($.type(number) == 'number' )?number:(!parseInt(_scope.scrollBar.contentContain.css("top")) ? 0
                        : parseInt(_scope.scrollBar.contentContain.css("top")));
                    // 变成正整数
                 _top = Math.abs(_top);
                //  如果内容高度-top值小于可视高度，那么top应该等于 内容高度-可视高度
                if ((_scope.scrollBar.scrollHeight - _top) < _scope.scrollBar.offsetHeight) {
                    _top = _scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight;
                }
                // 当前的百分比比等于 _top/（内容高度- 可视高度）
                var _percentProgress = _top / (_scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight);

                //  有滚动条才走下面动画
                if(_scope.scrollBar.hasScroll) {
                    //  滚动动画
                    var _scrollTweenTime = $.type(scrollTweenTime) == 'number' ? scrollTweenTime : _scope.opts.scrollTweenTime;
                    // 滚动条移动
                    _scope.scrollBar.bar.stop(true, true).animate({
                        'top': _scope.scrollBar.scrollAreaHeight * _percentProgress
                    }, _scrollTweenTime);
                    //  内容移动
                    _scope.scrollBar.contentContain.stop(true, true).animate({
                        'top': -Math.round((_scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight) * _percentProgress)
                    }, _scrollTweenTime);
                }else {
                    _scope.scrollBar.contentContain.css({
                        'top':0
                    });
                }
            },
            /**
             *
             * @param moveDistance    number
             * @description  滚动条动画和内容动画
             */
            moveFunction: function (moveDistance) {
                //  有滚动条才走下面
                if(_scope.scrollBar.hasScroll){
                    // 滚动条滑块的当前位置
                    var _nowProgress = parseInt(_scope.scrollBar.bar.css("top")) == "" ? 0 : parseInt(_scope.scrollBar.bar.css("top"));
                    // 下次滚动的位置
                    _nowProgress += Number(moveDistance);
                    // 滚动条滑块的最终top位置  //num, max, min
                    var _ScrollCurrentTopNum = _scope.scrollBar.range(_nowProgress, _scope.scrollBar.scrollMaxDistance, _scope.scrollBar.scrollMinDistance);
                    // 滑块移动距离占总长度的百分之比
                    var _percentProgress = _ScrollCurrentTopNum / _scope.scrollBar.scrollAreaHeight;
                    // 滚动条移动
                    _scope.scrollBar.bar.stop(true, true).animate({
                        'top': _ScrollCurrentTopNum
                    }, _scope.opts.scrollTweenTime);
                    //  内容移动
                    _scope.scrollBar.contentContain.stop(true, true).animate({
                        'top': -(_scope.scrollBar.scrollHeight - _scope.scrollBar.offsetHeight) * _percentProgress
                    }, _scope.opts.scrollTweenTime);
                }else {
                    _scope.scrollBar.contentContain.css({
                        'top':0
                    });
                }
            },
            /**
             *
             * @param event  鼠标滚轮事件
             */
            mousewheel: function (event) {
                _scope.scrollBar.stopBubble(event);
                //debugger;
                // 判断鼠标向下还是向上滚动
                var _mousewheelDir = event.deltaY  ;// ||   event.originalEvent?(event.originalEvent.deltaY>0?-1:1):0,
                    _moveDistance = 0;
                 // debugger;
                switch (_mousewheelDir) {
                    //  向上滚动
                    case 1:
                        //开始和结束的差值
                        _moveDistance = _scope.opts.scrollStep * (-1);
                        //执行函数
                        _scope.scrollBar.moveFunction(_moveDistance);
                        break;
                    //  向下滚动
                    case -1:
                        //开始和结束的差值
                        _moveDistance = _scope.opts.scrollStep;
                        //执行函数
                        _scope.scrollBar.moveFunction(_moveDistance);
                        break;
                    default:
                        break;
                }
            },
            /**
             * @param event
             * @description  滚动条区域鼠标按下的的回调函数，先给window绑定事件，鼠标松开释放事件
             */
            mousedown: function (event) {
                var _that = $(this);
                var start = event.pageY,
                    _moveDistance = 0,
                    end = 0;
                _that.addClass(_scope.opts.pressClass);
                $(window).on('mousemove.scrollBar', function (event) {
                 //   debugger;

                    // 阻止事件冒泡
                    _scope.scrollBar.stopBubble(event);
                    end = event.pageY;
                    //开始和结束的差值
                    _moveDistance = end - start;
                    start = end;
                    _scope.scrollBar.moveFunction(_moveDistance);
                }).on('mouseup.scrollBar', function () {
                    $(window).off('mousemove.scrollBar');
                    $(window).off('mouseup.scrollBar');
                    _that.removeClass(_scope.opts.pressClass);
                });
            },
            /**
             * @description  window.rezize 方法, 更新滚动条
             */
            resize: function () {
                _scope.scrollBar.update(20);
            },
            bindEvent: function () {
                _scope.scrollBar.parentContain.on('mousewheel.scrollBar', _scope.scrollBar.mousewheel);
                _scope.scrollBar.parentContain.on('mousedown.scrollBar', '.' + _scope.opts.scrollBarClass, _scope.scrollBar.mousedown);
                $(window).on('resize.scrollBar', _scope.scrollBar.resize);
            },
            unbindEvent: function () {
                _scope.scrollBar.parentContain.off('mousewheel.scrollBar', _scope.scrollBar.mousewheel);
                _scope.scrollBar.parentContain.off('mousedown.scrollBar', '.' + _scope.opts.scrollBarClass, _scope.scrollBar.mousedown);
                $(window).off('resize.scrollBar');
            },
            init: function () {
                //父元素
                _scope.scrollBar.parentContain = $(_scope.opts.treeContain);
                _scope.scrollBar.parentContain.css({
                    overflow: 'hidden'
                });
                // 滑道容器
                _scope.scrollBar.trackContain = _scope.scrollBar.parentContain.children(_scope.opts.scrollBarContain),
                    // 内容容器
                    _scope.scrollBar.contentContain = _scope._this;
                // 创建滚动条
                _scope.scrollBar.createScrollBar();
                // 获取响应参数，并且设置滚动条的高
                _scope.scrollBar.getParamHeight();
                // 绑定事件
                _scope.scrollBar.bindEvent();
            },
            //  销毁对象
            destory: function () {
                //  销毁事件
                _scope.scrollBar.unbindEvent();
                // 销毁内容
                _scope.scrollBar.trackContain.html('');
            }
        };
        _scope.init();
        // 搜索
        if (_scope.opts.canSearch) {
            _scope.autocompleter.bindEvent();
            //点击搜索的函数
            _scope.search.searchButton.off('click.search').on('click.search', function (event) {
                var event = event || window.event;
                var target = $(event.target);
                _scope.search.callback.search(event, target);
            });
        }
        // 创建滚动条
        if (_scope.opts.hasScrollBar) {
            _scope.scrollBar.init();
        }
        return _scope;
    };
}(window, jQuery);



/*
 var treeMin=$('#jsTreeMin').addTree({
 showLog:false, // 是否显示日志
 key :'mapId',  //   数据id    注意千万不要用驼峰命名，就算是驼峰命名最后取值也是小写的
 parentKey :'pId', // 父元素id
 name :'fyjc', // 数组的中文展示    (法院简介)
 childKey : 'children', // 子元素
 data:[],  //  数据对象为数组
 cache :false, //  是否缓存数据
 cacheId:'wTreeMinLocalStorage',  //  如果需要缓存，那么请设置换粗id默认
 itemIdPrefix:"fd-treeMIn-",  // 注意修改防止冲突
 operateItemClass:'.tree-hd',
 extendArea: true, // 是否扩大点击区域 默认为false
 hasIcon:true,    //  有图标
 allowAppendNewNode:false, // 允许增加新的节点
 canSelected:true, // 可以选中
 hasHoverEffect:true,
 canSearch:false, //  是否可以搜索
 // 滚动条参数
 hasScrollBar:true, // 是否有滚动条
 scrollBarContain:'.fd-scroll-track-min',
 scrollBarMinHeight:50,
 treeContain:"#jsTreeContainMin",
 // 回调函数
 callback:{
 onClick: function (_this,event,target,_scope) {
 var mapid = _this.data('mapid');
 window.localStorage.setItem('mapId', mapid);
 var message = {
 message: 'refresh',
 data: {
 mapId: mapid,
 fymc: _this.data('xqmc'),
 fydm: _this.data('fydm'),
 fbdm: _this.data('fbdm'),
 fyjb:  _this.data('fyjb')
 }
 };

 $('#iframe-main')[0].contentWindow.postMessage(JSON.stringify(message), '*');//发送给目标window
 },
 onExpand: function (_this,event,target,_scope) {
 console.log('展开的回调函数')
 _scope.scrollBar.update(20);
 },
 onCollapse: function (_this,event,target,_scope) {
 console.log('收起的回调函数')
 _scope.scrollBar.update(20);
 }
 }
 });*/




