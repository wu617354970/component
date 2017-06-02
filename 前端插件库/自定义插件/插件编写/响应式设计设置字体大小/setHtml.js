/**
 * version:	 		    2016.01.01
 * creatTime: 	 		2016.10.27
 * updateTime: 			2016.10.27
 * author:				wuwg
 * name:  				setHtmlSize
 */
// set  html
//  注意这里只是计算的宽的比值
function setHtmlSize() {
	var htmlSize = 0,
		clientWidth = Math.max($(window).width(), 1280); //  client  width
		htmlSize = clientWidth * 18 / 1920;
		$("html").css({
			"font-size" : htmlSize
		});
}
setHtmlSize();
// 给window 绑定resize事件
$(function () {
    $(window).on("resize.htmlSize", function () {
		setHtmlSize()
    });
});