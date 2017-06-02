/**
 * Created by wuwg on 2016/10/24 0024.
 */

/*************************************************
 *
 * 水平方法
 *
 *************************************************/
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
        console.log(activeIndex)
    },
    clickCallback: function (element, activeIndex) {
        console.log('当前点击条目的回调函数')
		console.log(activeIndex)
    },
    afterCallback: function (element, activeIndex) {
        console.log('动画结束之后')
		console.log(activeIndex)
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



/*************************************************
 *
 * 垂直方法
 *
*************************************************/
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