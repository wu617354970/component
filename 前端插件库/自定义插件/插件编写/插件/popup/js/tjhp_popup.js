//  弹出层	 
$(document).ready(function() {
	 var documentHeight = $(document).height();
	 /*masker layer**/
        var masker = $("<div id='mask_layer'></div>");
			masker.css({
				'position': "absolute",
				'left': "0",
				'top': "0",
				'opacity': 0.6,
				'display': "none",
				'width': "100%",
				'height': documentHeight,
				'zIndex': "999",
				'background-color': "#000"
			});
		$('body').append(masker);
	 
		function alginPopup(id) {
		  var isIE6 = ($.browser.msie && $.browser.version === "6.0");
			if (isIE6) {
				$(id).css({
					'position': 'absolute',
					'zIindex': '9999'
				});
			}else{
				$(id).css({
					'position': 'fixed',
					'z-index': '9999'
				});
			};
            var win = $(window),
            l = (win.width() - $(id).width()) * 0.5,
            t = (win.height() - $(id).height()) * 0.5;
            if (isIE6) {
                l += win.scrollLeft();
                t += win.scrollTop();
            }
            $(id).css({
                'left': l,
                'top': t,
                'z-index': 9999
            });
			masker.css({
			display:"block"
			});
        };
	//  首页公告弹出层	
	alginPopup("#tjhp_popup");
    $(".close").click(function() {
        $("#tjhp_popup").fadeOut(200);
      	 masker.fadeOut(300);
    });
	$(".inp_load").hover(function(){
		$(this).addClass("inp_load_over");
	
	},function(){
		$(this).removeClass("inp_load_over");
	}).click(function(){
		$(this).addClass("inp_load_click");
	});
	$(".inp_reset").hover(function(){
			$(this).addClass("inp_reset_over");
		},function(){
			$(this).removeClass("inp_reset_over");
	}).click(function(){
		$(this).addClass("inp_reset_click");
	});
	//首页登陆框弹出层
	alginPopup("#tjhp_popup2");
	 $(".close2").click(function() {
        $("#tjhp_popup2").fadeOut(200);
      	 masker.fadeOut(300);
    });

});