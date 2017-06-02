(function($){
	$.fn.tooltip = function(options){
		if(typeof options.tipId != 'string' || options.tipId == undefined)	return;
		
		var tipTar = $("#" + options.tipId);
		var xpos = 10;
		var ypos = 20;
			
		tipTar.hover(function(e){
			this.myTip = $(this).attr("tip");
			var tooltip = "<div id='tooltip_z'>" + this.myTip + "</div>";
			$('body').append(tooltip);
			if(options.tipClass != undefined){
				$("#tooltip_z").addClass(options.tipClass);
			}
			$("#tooltip_z").css({
				"border" : "1px solid #555",
				"position" : "absolute",
				left : (e.pageX + xpos) + "px",
				top : (e.pageY + ypos) + "px"
			}).show("slow");
		},function(){
			this.tip = this.myTip;
			$('#tooltip_z').remove();
		}).mousemove(function(e){
			$("#tooltip_z").css({
				left : (e.pageX + xpos) + "px",
				top : (e.pageY + ypos) + "px"
			});
		});
	}
})(jQuery);