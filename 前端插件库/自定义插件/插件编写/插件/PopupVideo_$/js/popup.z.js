
;(function($,window){
		
	//给jquery添加方法
	$.fn.addPopup = function(options){
			
					/*
					*	合并参数
					*	box						弹出层ID
					*	closeBtn			关闭按钮ID或者样式名称
					*	mouseType			打开弹出层按钮绑定事件  默认click
					*	tweenTime			遮罩渐隐时间
					*/
					var opts = $.extend({} ,{
							box : '',
							closeBtn : '.closeBtn',
							mouseType : "click",
							tweenTime : 300,
							openHandler : function(){},
							closeHandler : function(){}
					},options || {});
					
					
					//初始化 遮罩层 并添加到页面body中
					var maskLay = $("<div id='mask_lay'></div>");
					maskLay.css({'position':'absolute', 'left':0, 'top':0, 'opacity':0.5, 'z-index':999, 'display':'none', 'width':'100%', 'height':'100%', 'background-color':'#000000'});
					$(document.body).append(maskLay);
					//实现函数
					return this.each(function() {
						
								//弹出层  IE6固定在首次打开的可视区域中间  		非IE6固定在可视区域中间
								var box = $("#" + opts.box);
								var isIE6 = false;
								if($.browser.msie && $.browser.version == 6){
										isIE6 = true;
										box.css('position','absolute');
								}else{
										box.css('position','fixed');
								}
							
								//打开按钮  显示弹出层  绑定浏览器尺寸改变事件
								$(this).bind(opts.mouseType,function(){
										showBox();
										$(window).bind('resize',showBox);
								}).trigger(opts.mousetype)
								
								//关闭按钮  隐藏弹出层 取消绑定的浏览器尺寸改变事件
								box.find(opts.closeBtn).click(function(){										
										hideBox();
										$(window).unbind('resize',showBox);
								});
								
								//居中显示窗口
								function showBox(){
										var winSize = getWindowSize();
										var t = 0, l = 0, scrollH = 0;
										 
										if(!isIE6){
												l = (winSize.w - box.width()) / 2;
												t = (winSize.h - box.height()) / 2;
										}else{
												l = (winSize.w - box.width()) / 2 + winSize.l;
												t = (winSize.h - box.height()) / 2 + winSize.t;
										}										
										scrollH = Math.max(winSize.h,winSize.scrollH,0);
																				
										maskLay.css('height',scrollH).css('z-index',1002).fadeIn(opts.tweenTime,function(){
												box.css({left:l, top:t, 'z-index':1003, 'display':'block'}).show();		
										});
										
										opts.openHandler();
								}
								
								//隐藏窗口
								function hideBox(){
										box.hide();
										maskLay.fadeOut(opts.tweenTime);
										
										opts.closeHandler();
								}
						
					});
					
					
				//获取窗口尺寸
				function getWindowSize(){
						var de=document.documentElement;
						return{
								w:(window.innerWidth)||(de&&de.clientWidth)||(document.body.clientWidth),
								h:(window.innerHeight)||(de&&de.clientHeight)||(document.body.clientHeight),
								l:(de&&de.scrollLeft)||(document.body.scrollLeft),
								t:(de&&de.scrollTop)||(document.body.scrollTop),
								scrollH:(de&&de.scrollHeight)||(document.body.scrollHeight)
						}
				}
				
	}		
	
})(jQuery,window);