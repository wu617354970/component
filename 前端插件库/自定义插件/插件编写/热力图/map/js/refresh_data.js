require(["map","jquery"],function(map,$){
	console.log(map)
	$("#fd-btn").click(function(){
		
		map.refreshPage('json/mapid-110000.json','svg/mapid-110000.svg',true,{"ywlb":"1","tjqType":'2',"corp":"4"});
	})
})
