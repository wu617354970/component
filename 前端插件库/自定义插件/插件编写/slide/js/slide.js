/**
 * @author wuwg
 * @version 2017.01.01
 * @description file
 * @createTime 2017/05/04
 * @updateTime 2017/05/04
 * @descrition  兼容ie7，目前只支持文本的从右向左移动，为解决信访首页公告问题，临时演变
 */
(function($){
    $.fn.slide= function (options) {
        /**
         * @params
         *   version:'17.05.04',
         *   author: 'wuwg',
         *   creatTime: '2017-05-04',
         *   updateTime: '2017-05-04'
         *   interval: number, // 毫秒数，间隔调用时间，不建议修改
         *   autoplay :  boolean ，//  boolean值，是否自动开始动画
         *   data: Array, // 数据对象
         *   valueName: Array, // 数据对象中，需要显示在页面的值所对应的属性名
         *   className:{
                    scrollAreaContain:'fd-scorllArea-contain', //滚动区域的容器类名
                    scrollArea:'fd-scorllArea', // 滚动区域的类名
                    scrollItem:'fd-scroll-item' // 里面的数据列表类名
                },
         *   callback:function  // 点击数据列表执行的回调函数
         * @return  {{object}}  _scope
         *
         * @functions
         *   _scope.update(data) // 更新数据的方法
         *   _scope.updateOptions(options) // 更新参数的方法
         *   _scope.destory() // 销毁的方法
         */
        var _defaultOptions={
                version:'17.05.04',
                author: 'wuwg',
                creatTime: '2017-05-04',
                updateTime: '2017-05-04',
                interval:30,
                autoplay:true,
                valueName:'value',
                data:[{value:"张三",key:'1',href:'http://www.baidu.com'},{value:"李四",key:'1',href:'http://www.baidu.com'}],
                className:{
                    scrollAreaContain:'fd-scorllArea-contain',
                    scrollArea:'fd-scorllArea',
                    scrollItem:'fd-scroll-item'
                },
                callback: function (_this) {
                    console.log(_this)
                }
            };
        var  _this=$(this);
        //  作用域对象
        var _scope={
                    // 元素对象
                    element:{
                        _this:null,  // this  对象
                        scrollAreaContain:null, // 滚动区域的容器
                        scrollArea:null  // 滚动区域
                    },
                    //  更新参数
                    updateOptions: function (options) {
                        _scope.opts= $.fn.extend({},_scope.opts,options||{});
                    },
                    // 初始化参数
                    initOptions: function () {
                        _scope.opts= $.fn.extend({},_defaultOptions,options||{});
                    },
                    // 初始化需要的元素
                    initElememt: function () {
                        // this 对象
                        _scope.element._this=_this;
                        // 生成滚动的结构
                        _scope.element._this.html('<div class="'+_scope.opts.className.scrollAreaContain+'"><ul class="'+_scope.opts.className.scrollArea+'"></ul></div>');
                        // 滚动区域父元素
                        _scope.element.scrollAreaContain=_scope.element._this.find('.'+_scope.opts.className.scrollAreaContain);
                        //滚动区域元素
                        _scope.element.scrollArea=_scope.element._this.find('.'+_scope.opts.className.scrollArea);
                    },
                    // 初始化css
                    initCss: function () {
                        // 滚动区域父元素
                        _scope.element.scrollAreaContain.css({
                            'position':'relative',
                            'z-index':'1',
                            'width':'100%',
                            'height':'100%',
                            'overflow':'hidden'
                        });
                        //滚动区域元素
                        _scope.element.scrollArea.css({
                            'position':'absolute',
                            'z-index':'2',
                            'height':'100%',
                            'min-width':'100%',
                            'overflow':'hidden'
                        });
                    },
                    //  更新css
                    updateCss: function () {      
                        var _children=_scope.element.scrollArea.children();
                        var _width=0;
                        //循环所有的子集，将宽度相加
                        _children.each(function(){
                            _width+=$(this).outerWidth(true);
                        });
                        // 更新滚动区域的宽
                        _scope.element.scrollArea.css({
                            width:_width
                        });
                    },
                    //  绑定事件
                    bindEvent: function () {
                        // 鼠标划入划出事件和点击事件
                        _scope.element._this.on('mouseenter', function (event) {
                            _scope.stop();
                        }).on('mouseleave', function (event) {
                            _scope.start();
                        }).on('click','.'+_scope.opts.className.scrollItem, function () {
                            var  _that=$(this);
                            _scope.opts.callback(_that);
                        });
                    },
                    // 解绑事件
                    unbind: function () {
                        // 鼠标划入划出事件
                        _scope.element._this
                            .off('mouseenter')
                            .off('leave')
                            .off('click','.'+_scope.opts.className.scrollItem);
                    },
                    //销毁对象
                    destory:function(){
                        // 解绑事件
                        _scope.unbind();
                        // 清空内容
                        _scope.element._this.get(0).innerHTML='';
                        // 销毁动画
                        _scope.stop();
                        // 销毁对象
                        _scope=null;
                    },
                    // 制作dom
                    makeDom: function (data) {
                      var  _data=_scope.opts.data;
                      // list 变量
                      var   _list=[];
                        if(_data.length>0){
                            // 循环数据生成dom
                            $.each(_data, function (index,value) {
                                var  _scopeData=[];
                                for(name in value){
                                    if(name!==_scope.opts.valueName){
                                        _scopeData.push('data-'+name+'='+value[name]);
                                    }
                                }
                                _list.push( '<li  style="float:left;" '+_scopeData.join(' ')+'   class="'+ _scope.opts.className.scrollItem+'">'+value[_scope.opts.valueName]+'</li>')
                            })
                        }
                        // 判断是否是第一次追加
                        if(_scope.element.scrollArea.is(':empty')){
                            // 生成内容
                            _scope.element.scrollArea.get(0).innerHTML=_list.join('');
                        }else {
                            // 增加销毁类名
                            _scope.element.scrollArea.children().addClass('destory');
                            // 获取hhtml
                            var  _html=_scope.element.scrollArea.get(0).innerHTML;
                                 // 重新组装html
                                 _html+=_list.join('');
                            // 填充到页面
                            _scope.element.scrollArea.get(0).innerHTML=_html;
                        }
                        // 更新css
                        _scope.updateCss();
                        // 开始动画
                        _scope.start();
                    },
                    // 更新数据的方法
                    update: function (data) {
      
                        if($.type(data)=='array'){
                            _scope.opts.data=data;
                        }
                        // 制作dom
                        _scope.makeDom();
                    },
                    // 执行动画的方法
                    animate:function(){
                    //	debugger
                        var  _left=parseInt(_scope.element.scrollArea.css('left'));
                             _left=_left?_left:0;
                             _left=Math.abs(_left);
                             
                        var _firstChild=_scope.element.scrollArea.children(':first');
                        var _firstWidth=_firstChild.outerWidth(true);
                        if(_left==_firstWidth){
                            _left=0;
                            if(_firstChild.hasClass('destory')){
                                _firstChild.remove();
                                // 移除就得更新css
                                _scope.updateCss();
                                //如果目标小于可视区域，那么直接返回
                                if(_scope.element.scrollArea.width()<_scope.element.scrollAreaContain.width()){
                                    _scope.element.scrollArea.css({
                                        left: _left
                                    });
                                    return;
                                }
                            }else {
                                _firstChild.appendTo(_scope.element.scrollArea);
                            }
                        }
                        // 执行动画
                        _scope.element.scrollArea.css({
                            left: -(_left+1)
                        });
                        // 调用开始动画
                        _scope.start();
                    },
                    // 定时器
                    timer:null,
                    //开始动画
                    start: function () {         
                        if(_scope.opts.autoplay){
                        	if(_scope.element.scrollArea.width()>_scope.element.scrollAreaContain.width()){
                                // 先停止动画
                                _scope.stop();
                                // 定时器
                                _scope.timer= setTimeout(function(){
                                    // 执行动画
                                    _scope.animate();
                                },_scope.opts.interval);
                            }
                        }
                    },
                    // 停止动画
                    stop: function () {
                        if(_scope.timer){
                            clearTimeout(_scope.timer);
                        }
                    },
                    // 初始化函数
                    init: function () {
                        // 初始化参数
                        _scope.initOptions();
                        // 初始化元素
                        _scope.initElememt();
                        //  初始化css
                        _scope.initCss();
                        // 生成dom
                        _scope.makeDom();
                        // 绑定事件
                        _scope.bindEvent();
                    }
                };
        // 执行初始化函数
        _scope.init();
        // 返回
        return  _scope;
    }
})(jQuery);


