// document javascript 
$(document).ready(function() {
  //  alert($("img").eq(0).width())
});;
(function($, window) {
    $.fn.addImageZoom = function(options) {
        var defaultOptions = {			
            parentWidth: 0,		 	 // 图片所在的父容器宽度
            parentHeight: 0, 		 //图片所在的父容器的高度
            zoomWidth: 0,   		 // 缩放的宽度  **********(必写)	
            zoomHeight: 0, 			//缩放的高度 			**********(必写)
            isCenter: true,				 // 是否居中
            mode: 0 				//0  正常缩放，1满屏缩放  
        };
        var opts = $.extend({}, defaultOptions, options || {}); //合并传入的对象
        $(this).each(function() {
            var box =$(this) // 获取父容器 
            var imgList = box.find("img"); //  获取目标元素下所有的img对象
            var img = null,
            //  声明变量
            imgW = 0,
            imgH = 0;
            //判断容器下的图片个数是否为0  为0则直接反回不进行计算
            if (imgList.length == 0) {
                return;
            }
            //判断容器下的图片缩放,如果缩放值为0那就直接返回		
            if (opts.zoomWidth == 0 || opts.zoomHeight == 0) {
                return;
            }
            //循环遍历所有图片 缩放图片
            for (var i = 0, len = imgList.length; i < len; i++) { //  遍历所有的图片
                img = imgList.eq(i);
				
                imgW = img.width();
                imgH = img.height();
                if (opts.mode == 0) {
                    if (imgW / opts.zoomWidth < imgH / opts.zoomHeight) {
                        imgW = imgW / imgH * opts.zoomHeight;
                        imgH = opts.zoomHeight;
                    } else {
                        imgW = opts.zoomWidth;
                        imgH = imgH / imgW * opts.zoomWidth;
                    }
                } else if (opts.mode == 1) {
                    if (imgW / opts.parentWidth < imgH / opts.parentWidth) {
                        imgW = opts.parentWidth;
                        imgH = opts.parentWidth / imgW * imgH;
                    } else {
                        imgW = opts.parentWidth / imgH * imgW;
                        imgH = opts.parentWidth;
                    }
                }
                //设置图片缩放后的宽度和高度
                img.css({
                    width: imgW,
                    height: imgH
                });
                //设置是否居中于父容器
                if (opts.isCenter == true) {
                    img.css({
						position:"relative",
                        left: (opts.parentWidth - imgW) / 2 + "px",
                        top: (opts.parentHeight - imgH) / 2 + "px"
                    });
                }

            };

        });

    };

})(jQuery, window);