/*js  load  css*/
$(function () {
	(function () {
		var Fd = function () {};
		Fd.prototype.load = {
			css : function (src) {
				var link = $("<link href=" + src + "  type='text/css'   rel='stylesheet'  media='all' /> ");
				link.appendTo("head");
			},
			js : function (src) {
				var script = $("<script src=" + src + " type='text/javascript'></script>");
				$("body").append(script);
			}
		};
		window.fd = new Fd();
	})();
	// 加载css
	fd.load.css("css/css1.css");
	fd.load.css("css/css2.css");
	fd.load.css("css/css3.css");
	// 加载js
	fd.load.js("scripts/global.js");
	fd.load.js("scripts/global2.js");
});