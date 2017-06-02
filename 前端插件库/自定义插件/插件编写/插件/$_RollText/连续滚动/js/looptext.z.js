
/**连续滚动文本*/
(function(window){	
	function loopText(options){
		var box = document.getElementById(options.box),
			divOne = box.getElementsByTagName('div')[0],
			divTwo = box.getElementsByTagName('div')[1],
			dir = options.direction;
		divTwo.innerHTML = divOne.innerHTML;		
		var Marquee = {
				timer : null,
				onMarquee : function(){
		
						if(dir == "top"){
							
							if(divTwo.offsetTop - box.scrollTop <= 0){
								
								box.scrollTop -= divOne.offsetHeight;
							}else{
								box.scrollTop++;
							}													
						}
						else if(dir == "bottom"){												
							if(divOne.offsetTop - box.scrollTop >= 0){
								box.scrollTop += divTwo.offsetHeight;
							}else{
								box.scrollTop--;
							}																
						}
						else if(dir == "right"){							
							if(divTwo.offsetLeft - box.scrollLeft <= 0){
								box.scrollLeft -= divOne.offsetWidth;
							}else{
								box.scrollLeft++;
							}							
						}
						else if(dir == "left"){							
							if(divOne.offsetLeft - box.scrollLeft >= 0){
								box.scrollLeft += divTwo.offsetWidth;
							}else{
								box.scrollLeft--;
							}							
						}
												
				},
				start: function(){
					if(Marquee.timer){	Marquee.stop();	}
					Marquee.timer = window.setInterval(Marquee.onMarquee,40);
				},
				stop: function(){		
					window.clearInterval(Marquee.timer);
				}	
		};
		box.onmouseover = function(e){ Marquee.stop();};
		box.onmouseout = function(){ Marquee.start(); };
		Marquee.start();
	}
	if(typeof YM == 'undefined'){	window.YM = {};	}	
	window.YM.addLoopText = loopText;	
})(window);






;(function($,window){
	
	//给jQuery添加方法
	$.fn.addRollText = function(options){
		
			//合并传入与默认的参数
			var opts = $.extend({},{
					step : 1,
					dir : 'v',
					minSize : 0,
					tweenTime : 10,
					delay : 6000
				},options || {});
			
			//实现方法
			return $(this).each(function() {
					
					//UL对象
					var scrollUL = $(this).children('ul:first-child');
					
					//判断可视窗口大于内容窗口不需要滚动
					if(scrollUL.children('li').size() < opts.minSize){ return; }
					
					//定时器		效果引用函数
					scrollUL.timer = null;
					//var effectFn = (opts.dir == "v") ? scrollTextV : scrollTextH;
					
					scrollUL.start=function(){
						scrollUL.timer = setTimeout(function(){
							scrollTextV();	
						},opts.delay);
					
					};
					scrollUL.end=function(){
							clearTimeout(scrollUL.timer);	
					
					};
					//鼠标移入停止定时器	鼠标移出开始定时器
					scrollUL.hover(function(){
							scrollUL.end();
						},function(){
							scrollUL.start();
					}).trigger("mouseleave");

					//垂直滚动函数
					function scrollTextV(){
							var lineHeight = Math.ceil(parseInt(scrollUL.find("li:first").height())); //获取行高
							//lineHeight *= opts.step;
							
							scrollUL.animate({ "marginTop" : "-=1" }, opts.tweenTime , function(){
							//alert(lineHeight);
								if(scrollUL.css("marginTop")==(-lineHeight+"px")){
									scrollUL.css({"marginTop":0});
									scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
								
								};
         							
  					 	});
						scrollUL.start();
					}
					
					//水平滚动函数
					function scrollTextH(){
						var lineWidth = Math.ceil(parseInt(scrollUL.find("li:first").width())); //获取行高
						lineWidth *= opts.step;
						
							scrollUL.stop(true,true).animate({ "marginLeft" : -lineWidth +"px" }, opts.tweenTime , function(){
										scrollUL.css({marginLeft:0});
										for(var i=0,len=opts.step; i<len; i++){
											scrollUL.find("li:first").appendTo(scrollUL); //appendTo能直接移动元素
										}
  					 	});
					}
			
			});
	}
	
})(jQuery,window);





























