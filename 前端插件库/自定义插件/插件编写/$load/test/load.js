/*****************************************************************
 *version     	15.06.01
 *author     	wuwg
 *creatTime	 	20150603
 *updateTime	20150603
 *****************************************************************/


fdLoadCssOrScript = function (type, sourceString,id) {

	if (typeof type == "string" && typeof sourceString == "string") {
		if (type == "css") {
			var link = document.createElement('link');
			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			if(id){
				link.setAttribute('id', id);	
			}
			link.setAttribute('href', sourceString);
			var parent = document.getElementsByTagName('head')[0] || document.body;
			parent.appendChild(link);
			parent = null;
			link = null;
		} else if (type == "js") {
			var script = document.createElement('script');
			script.src = sourceString;
			script.type = "text/javascript";
			var parent = document.getElementsByTagName('body')[0] || document.body;
			parent.appendChild(script)
			parent = null;
		} else {
			alert("type 类型错误,css或者js的 字符串对象")
		}
	} else {
		if (typeof type == "string") {
			alert("sourceString类型错误,是类型为字符串的资源的路径")

		} else {
			alert("type 类型错误,css或者js的 字符串对象")
		}
	}
}

checkIE();

function checkIE() {
	if ((navigator.userAgent.indexOf('MSIE') >= 0) 
		    && (navigator.userAgent.indexOf('Opera') < 0)){
		if (navigator.appName == "Microsoft Internet Explorer"
			|| navigator.appName == "Netscape") {
			if(getCPU() != "x64") {
				alert("您的浏览器版本过低，为了体验更好的页面效果，请升级至IE9或以上版本。\n  (Windows7 32位操作系统可以使用谷歌浏览器访问；\n  Windows7 64位操作系统需要先安装Service Pack1，再升级） \n  下载地址：ftp://192.2.0.41/explan/")
			} else {
				var b_version = navigator.appVersion;
				var version = b_version.split(";");
				var trim_Version = version[1].replace(/[ ]/g, "");
				var ievsn = trim_Version.replace("MSIE", "").replace("0", "").replace(
						".", "");
				if (ievsn < 9) {
					alert("您的浏览器版本过低，为了体验更好的页面效果，请升级至IE9或以上版本。\n  (Windows7 32位操作系统可以使用谷歌浏览器访问；\n  Windows7 64位操作系统需要先安装Service Pack1，再升级） \n  下载地址：ftp://192.2.0.41/explan/")

//					var curWwwPath = window.document.location.href;
//					var pathName = window.document.location.pathname;
//					var pos = curWwwPath.indexOf(pathName);
//					var localhostPath = curWwwPath.substring(0, pos);
//					var projectName = pathName.substring(0, pathName.substr(1)
//									.indexOf('/')
//									+ 1);
//					var ua = navigator.userAgent;
//					if (confirm("您的IE版本低于9，此版本下网站的显示效果较差，建议您升级到IE9")) {
//						location.href = getLocalPath() + "sjjzglptsy/ie/IE9-Windows7-x64-chs.exe";
//					}
				}
			}
		}
	}
}

function getCPU() {
    var agent=navigator.userAgent.toLowerCase();
    if(agent.indexOf("win64")>=0||agent.indexOf("wow64")>=0) return "x64";
    return navigator.cpuClass;
}
