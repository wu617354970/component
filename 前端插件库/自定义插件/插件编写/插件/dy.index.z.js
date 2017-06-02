
//$("#banner1").addBanner({mouseType:"mouseover",autoPlay:true});//幻灯片
//$("#banner2").addBanner({"effect":"twin",tweenTime:400});

//addSwf('flash/ADPlayer.swf','adplayer_s',640,360,{id:"adPlayer",videoUrl:'http://hd.gyyx.cn/gameDownload/Default.aspx?typeid=366^netType=1^file=wdwz_huodong2.flv',cove//rUrl:'images/wd_v_cover.jpg'});//视频
//$("#videoBtn").addPopup({box:"v_box","tweenTime":200});	//弹出层

//幻灯片
$("#banner1").addBanner({mouseType:"mouseover",autoPlay:true});
$("#banner2").addBanner({"effect":"twin",tweenTime:400,autoPlay:true});

//视频
addSwf('flash/ADPlayer.swf','adplayer_s',640,360,{id:"adPlayer",videoUrl:'http://hd.gyyx.cn/gameDownload/Default.aspx?typeid=366^netType=1^file=wdwz_huodong2.flv',coverUrl:'images/wd_v_cover.jpg'});

//弹出层
$("#videoBtn").addPopup({box:"v_box","tweenTime":200,closeHandler:function(){
		try{	swfobject.getObjectById('adPlayer').stoped();	}catch(e){}
}});	

addSwf('flash/dy_effect.swf','effect_s',1000,372,{wmode:'transparent'});//效果
addSwf('flash/dy_jrgw.swf','jrgw_s',248,169,{wmode:'transparent'});	//进入官网
addSwf('flash/dy_yxts.swf','yxts_s',119,152,{wmode:'transparent'});//游戏特色