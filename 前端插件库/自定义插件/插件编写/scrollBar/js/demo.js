/**
 *  version: '16.7.3',
 *  author: 'wuwg',
 *  creatTime: '2016-07-06',
 *  updateTime: '2016-10-11',
 *   // 滚动条参数
 *   hasScrollBar: true, // 是否有滚动条
 *   scrollContentContainClass : 'fd-scroll-content', // 内容容器的class
 *   scrollBarContainClass: 'fd-scroll-track', // 滚动条容器
 *   scrollBarClass: 'fd-scroll-bar', // 滚动条
 *   pressClass: 'pressed', // 滚动条按下类名
 *   scrollBarMinHeight: 50, //  滚动条最小高度
 *   scrollBarMinWidth : 50, //  滚动条最小宽度
 *   scrollStep: 10, // 一次滚动的距离
 *   scrollTweenTime: 10, // 滚动耗时
 *	 hideScrollBar:true,  //Boolearn值,默认为false,是否绑定鼠标移入和移除事件
 *   callback:function  // 滚动结束后的回调函数	，默认为null
 * @return  {{object}}  _scope
 * @更新方法 _scope.scrollBar.update(tweenTime,number) ; tweenTime 缓动时间 number 设置 top或者left值,这个值为滚动内容的值
 */
 
 
/****************************************************************************

				垂直滚动条的用法

****************************************************************************/
 // demo1
var scrollBar1 = $('#demo1').addScrollBar({
		// 滚动条参数
		hasScrollBar : true, // 是否有滚动条
		direction : 'vertical', //  垂直滚动还是水平滚动条，可选参数 horizontal（水平滚动条）
		scrollContentContainClass : 'fd-scroll-content', // 内容容器的class
		scrollBarContainClass : 'fd-scroll-track', // 滚动条容器
		scrollBarClass : 'fd-scroll-bar', // 滚动条
		pressClass : 'pressed', // 滚动条按下类名
		scrollBarMinHeight : 5, //  滚动条最小高度
		scrollBarMinWidth : 50, //  滚动条最小宽度
		scrollStep : 10, // 一次滚动的距离
		scrollTweenTime : 10, // 滚动耗时
		hideScrollBar : true, //Boolearn值,默认为false,是否绑定鼠标移入和移除事件
		callback : function () {
			console.log('滚动后的回调函数')
		}
	});
	//  更新的方法
	setTimeout(function () {
		$('#demo1').height(500);
		scrollBar1.scrollBar.update(20, 0);
		setTimeout(function () {
			$('#demo1').height(100);
			scrollBar1.scrollBar.update(20, 200);
		}, 5000);
	}, 5000);

	
// 简写使用默认参数
var scrollBar2 = $('#demo2').addScrollBar();

var scrollBar3 = $('#demo3').addScrollBar();
// 展开缩起回调函数
$('#demo3').on('click', 'h1', function () {
	var _this = $(this);
	if (_this.next().hasClass('active')) {
		$('#demo3').find('.fd-con').stop(true, true).slideUp(400, function () {
			_this.next().removeClass('active');
			scrollBar3.scrollBar.update(20);
		});
	} else {
		$('#demo3').find('.fd-con').removeClass('active').stop(true, true).slideUp(400)
		_this.next().addClass('active').stop(true, true).slideDown(400, function () {
			scrollBar3.scrollBar.update(20);
		});
	};
});


// 内容减少，无滚动条,内容增加出现滚动条
var scrollBar4 = $('#demo4').addScrollBar();
//  更新的方法
setTimeout(function () {
	$('#demo4>ul>li:gt(3)').hide();
	scrollBar4.scrollBar.update(20);
	setTimeout(function () {
		$('#demo4>ul>li:gt(3)').show();
		scrollBar4.scrollBar.update(20);
	}, 3000);

}, 3000);



/****************************************************************************

				水平滚动条的用法

****************************************************************************/

// 水平滚动条
var scrollBar5 = $('#demo5').addScrollBar({
		// 滚动条参数
		hideScrollBar : false, // 是否有滚动条
		direction : 'horizontal'
	});
// 水平滚动条
var scrollBar6 = $('#demo6').addScrollBar({
		direction : 'horizontal'
	});
// 更新的方法
setTimeout(function () {
	scrollBar5.scrollBar.update(500, 500);
}, 3000);