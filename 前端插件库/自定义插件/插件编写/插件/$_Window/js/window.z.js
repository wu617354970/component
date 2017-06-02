(function($,window,undefined){
	
	$.fn.addWindow = function(options){
		
		var opts = $.extend({},$.fn.addWindow.defaultOptions,options);
		
		return this.each(function(){
			
					var box = $(this), winobj = $(window), isIE6 = false, l = 0, t = 0;			
					
					//判断是否是IE6
					if($.browser.msie && $.browser.version == 6){
						isIE6 = true;
						box.css('position','absolute');
					}else{
						box.css('position','fixed');
					}
					
					if(opts.useClose){
						box.find(opts.closeBtn).click(function(){
							hideBox();	
						});	
					}
			
					//显示窗口
					function showBox(){
						var winSize = getWindowSize();				
						switch(opts.position){
							case "TopLeft" :
								l = opts.marginLeft;
								t = opts.marginTop;
								break;
							case "TopRight" : 
								l = winSize.w - box.width() - opts.marginRight;
								t = opts.marginTop;
								break;
							case "Center" : 
								l = (winSize.w - box.width()) / 2 - opts.marginLeft;
								t = (winSize.h - box.height()) / 2 - opts.marginTop;
								break;
							case "CenterLeft" : 
								l = opts.marginLeft;
								t = (winSize.h - box.height()) / 2 - opts.marginTop;
								break;
							case "CenterRight" :
								l = winSize.w - box.width() - opts.marginRight;
								t = (winSize.h - box.height()) / 2 - opts.marginTop;
								break;
							case "BottomLeft" :
								l = opts.marginLeft;
								t = winSize.h - box.height() - opts.marginBottom;
								break;
							case "BottomRight" : 
								l = winSize.w - box.width() - opts.marginRight;
								t = winSize.h - box.height() - opts.marginBottom;
								break;	
						}				
						if(isIE6){
							l = l + winSize.l;
							t = t + winSize.t;	
						}				
						box.css({left : l, top : t});
					}
					
			
					//隐藏窗口
					function hideBox(){
						box.slideUp(300);
					}
					
					
					//窗口尺寸 滚动 事件监听
					winobj.bind('resize',function(){
						if(!box.is(':visible')){ return; }				
						showBox();
					});
					
					
			
					if(isIE6){
						winobj.bind('scroll',function(){
							if(!box.is(':visible')){ return; }				
							showBox();
						});
					}
					
					
			
					//获取窗口尺寸
					function getWindowSize(){
						return{
							w : winobj.width(),
							h : winobj.height(),
							l : winobj.scrollLeft(),
							t : winobj.scrollTop()
						}	
					}
			
			
			
					//立即显示窗口
					showBox();
		});
	}
	
	/**
	* 默认配置参数
	*/
	$.fn.addWindow.defaultOptions = {
		box : "",
		closeBtn : ".closeBtn",
		position : "center",
		useClose : true,
		marginLeft : 0,
		marginRight : 0,
		marginTop : 0,
		marginBottom : 0
	}
	
})(jQuery,window);