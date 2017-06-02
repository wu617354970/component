/*javascript document*/
$(document).ready(function(){	
	//  居中
	$(".js_banner_vertical  .index").css({
			bottom:($(".js_banner_vertical").innerHeight()-$(".js_banner_vertical  .index").innerHeight())/2
		});
	//设置控制banner滚动的按钮区域
	function  adjustBannerHandle(){
		$(".js_fullscreen_banner .d_btn").css({
			"left":($(window).width()-1172)/2
		});
	};
	//自我执行
	adjustBannerHandle();
	// 绑定浏览器事件
	$(window).bind("scroll resize",function(){
		// banner滚动的按钮区域的位置
		adjustBannerHandle();
	});
});
	