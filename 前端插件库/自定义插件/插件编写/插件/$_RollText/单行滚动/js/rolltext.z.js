
;(function($,window){
	
	//给jQuery添加方法
	$.fn.addRollText = function(options){
		
			//合并传入与默认的参数
			var opts = $.extend({},{
					step : 1,
					dir : 'v',
					minSize : 0,
					tweenTime : 500,
					delay : 6000
				},options || {});
			
			//实现方法
			return this.each(function() {
					
					//UL对象
					var scrollUL = $(this).children('ul:first-child');
					
					//判断可视窗口大于内容窗口不需要滚动
					if(scrollUL.children('li').size() < opts.minSize){ return; }
					
					//定时器		效果引用函数
					var timer = null, scrollSize = 0;
					var effectFn = (opts.dir == "v") ? scrollTextV : scrollTextH;
					
					//鼠标移入停止定时器	鼠标移出开始定时器
					scrollUL.hover(function(){
						clearInterval(timer);	
					},function(){
						timer = setInterval(function(){	effectFn();	},opts.delay);
					}).trigger("mouseleave");
					
					
					//垂直滚动函数
					function scrollTextV(){
							var lineHeight = scrollUL.find("li:first").height(); //获取行高
							lineHeight *= opts.step;
							
							scrollUL.animate({ "marginTop" : -lineHeight +"px" }, opts.tweenTime , function(){
         							scrollUL.css({"marginTop":0});
									for(var i=0,len=opts.step; i<len; i++){
										scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
									}
  					 	});
					}
					
					//水平滚动函数
					function scrollTextH(){
						var lineWidth = scrollUL.find("li:first").width(); //获取行高
						lineWidth *= opts.step;
						
							scrollUL.animate({ "marginLeft" : -lineWidth +"px" }, opts.tweenTime , function(){
										scrollUL.css({marginLeft:0});
										for(var i=0,len=opts.step; i<len; i++){
											scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
										}
  					 	});
					}
			
			});
	}
	
})(jQuery,window);