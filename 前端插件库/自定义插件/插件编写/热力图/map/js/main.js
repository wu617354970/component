/**
 * version:	 		    2015.01.01
 * creatTime: 	 		2015.11.11
 * updateTime: 			2016.04.13
 * author:				wuwg
 * name:  				main
 **/

 function getLocalPath   () {
		var curWwwPath = window.location.href;
		var pathName = window.location.pathname;
		var pos = curWwwPath.indexOf(pathName);
		var localhostPaht = curWwwPath.substring(0, pos);
		var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
		return (localhostPaht + projectName + '/');
}
 
// require([module], callback);
var urlArgs = 'ver=1.0.16' ;//版本号
require.config({
	baseUrl : 'js/',
	urlArgs: urlArgs,
	paths : {
		'jquery' : 'jQuery.v1.11.1.min',
		'operateAreaMap' : 'operateAreaMap',
		'jrdt-area-map-function' : 'jrdt-area-map-function', // 区域地图所有的方法
		'Snap' : 'snap.svg-min'
	},
	shim : {

	}
});

require([ 'global'], function (global) {
	var  jsUrl=getLocalPath()+'js/'+$('body').data('js');
	//启动map函数 依赖于global函数
	require([jsUrl],function(){
		
		
	});
});