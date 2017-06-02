//自执行函数
(function (window, undefined) {
	
	//合并对象
	function defaultExtend(original, source) {
		for (var p in source) {
			if (original.hasOwnProperty(p)) {
				original[p] = source[p];
			}
		}
		return original;
	}
	
	//缩放图片
	function ImageZoom(options) {
		
		var opts = defaultExtend({
				box : '', //容器目标对象
				parentWidth : 0, //图片所在的父容器宽度
				parentHeight : 0, //图片所在的父容器高度
				zoomWidth : 0, //缩放宽度
				zoomHeight : 0, //缩放高度
				isCenter : true, //是否居中于父容器
				mode : 0 //缩放模式0 正常缩放  1铺满父容器缩放,最小宽度和高度为父容器的宽度和高度
			}, options);
		
		//获取图片数据
		var box = document.getElementById(options.box) || document;
		var imgList = box.getElementsByTagName('img');
		
		//判断容器下的图片个数是否为0  为0则直接反回不进行计算
		if (box.length == 0)
			return;
		if (opts.zoomWidth == 0 || opts.zoomHeight == 0)
			return;
		
		//循环遍历所有图片 缩放图片
		var img = null,
		imgW = 0,
		imgH = 0;
		
		for (var i = 0, len = imgList.length; i < len; i++) {
			img = imgList[i],
			imgW = img.width,
			imgH = img.height;
			
			if (opts.mode == 0) {
				if (imgW / opts.zoomWidth < imgH / opts.zoomHeight) {
					imgW = imgW / imgH * opts.zoomHeight;
					imgH = opts.zoomHeight;
				} else {
					imgH = imgH / imgW * opts.zoomWidth;
					imgW = opts.zoomWidth;
				}
			} else if (opts.mode == 1) {
				if (imgW / opts.parentWidth < imgH / opts.parentWidth) {
					imgW = opts.parentWidth;
					imgH = opts.parentWidth / imgW * imgH;
				} else {
					imgH = opts.parentWidth;
					imgW = opts.parentWidth / imgH * imgW;
				}
			}
			
			//设置图片缩放后的宽度和高度
			img.width = imgW;
			img.height = imgH;
			
			//设置是否居中于父容器
			if (opts.isCenter == true) {
				img.style.left = (opts.parentWidth - imgW) / 2 + 'px';
				img.style.top = (opts.parentHeight - imgH) / 2 + 'px';
			}
		}
		
	}
	
	//添加到YM命名空间下
	if (typeof YM == 'undefined') {
		window.YM = {}
		
	}
	YM.ImageZoom = ImageZoom;
	
})(window, undefined);
