/**
 * version:	 		    2015.01.01
 * creatTime: 	 		2015.11.10
 * updateTime: 			2015.12.07
 * author:				wuwg
 * name:  				global
 **/

define(['jquery'], function ($) {
	'user strict';
	var global = {
			
			//获取本地路径
			getLocalPath : function () {
				var curWwwPath = window.location.href;
	
				var pathName = window.location.pathname;
	
				var pos = curWwwPath.indexOf(pathName);
	
				var localhostPaht = curWwwPath.substring(0, pos);
	
				var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
				return (localhostPaht + projectName + '/');
			},
			// localStorage
			// 储存storage
			saveLocalStorage : function (name, value) {
				localStorage.setItem(name, value);
			},
	
			// 查找storage
			findLocalStorage : function (str) {
				"user strict";
				var requestStr = localStorage.getItem(str);
				return requestStr;
			},
	
			// 删除storage
			deleteLocalStorage : function (str) {
				"user strict";
				var requestStr = localStorage.removeItem(str);
				return requestStr;
			},
	
			//sessionStorage
			// 储存storage
			saveSessionStorage : function (name, value) {
				sessionStorage.setItem(name, value);
			},
	
			// 查找storage
			findSessionStorage : function (str) {
				"user strict";
				var requestStr = sessionStorage.getItem(str);
				return requestStr;
			},
	
			// 删除storage
			deleteSessionStorage : function (str) {
				"user strict";
				var requestStr = sessionStorage.removeItem(str);
				return requestStr;
			},
		
	        loading:function(){
			      	$(window).find('body').append('<div  class="fd-loading"><div  class="fd-text">正在加载......</div></div>');
	  
	        },
	        removeLoading:function(){
	        if(	$(window).find('.fd-loading').length>0){
	        		$(window).find('.fd-loading').remove();
	        	}
	        	
	        },
	
	        /**
	         * @function getMapid()
	         * @ description  获取mapid，此方法仅供地图使用，地图的mapid有 sevent
	         * @returns  mapId
	         */
	       
	        intervalTime:8000
			//单点登录的url
		
			
	      
	};

	return global;
});