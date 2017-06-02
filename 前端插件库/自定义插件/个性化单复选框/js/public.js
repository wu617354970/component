// JavaScript Document
/***************************************
*	Version 		16.00.01
*	Author			liuj
*  	CreateTime      16.04.08
 *	UpdateTime		16.04.08
* *************************************************/
$(document).ready(function(){
	$('.fd-radio-mn a').click(function(){
		$('.fd-radio-mn a').removeClass('current');
		$(this).addClass('current');
	});
	$('.fd-checkbox-mn a').click(function(){
		if($(this).hasClass("current")){
			$(this).removeClass('current');
		}else {
			$(this).addClass('current');
			}
	});
})