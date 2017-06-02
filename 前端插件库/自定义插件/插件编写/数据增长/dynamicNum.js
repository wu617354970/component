$.fn.countTo = function (options) {
		options = options || {};
		
		return $(this).each(function () {
			// 为当前元素设置参数
			var settings = $.extend({}, $.fn.countTo.defaults, {
				from:            $(this).data('from'),  //  开始
				to:              $(this).data('to'),  // 结束
				speed:           $(this).data('speed'),	// 总共需要多少时间
				refreshInterval: $(this).data('refresh-interval'),		// 刷新数据的时间
				decimals:        $(this).data('decimals')	// 保留小数的位数  //['desɪmlz] 
			}, options);
			
			// how many times to update the value, and how much to increment the value on each update
			var loops = Math.ceil(settings.speed / settings.refreshInterval), //  向上取整
				increment = (settings.to - settings.from) / loops;	//  增量，每次增加的数
			
			// references & variables that will change with each update
			var self = this,				//  原生对象 this
				$self = $(this), 		//  jQ对象  
				loopCount = 0,  		//  
				value = settings.from,	//  初始化数字
				data = $self.data('countTo') || {};  // data设置为一个对象 countTo 或者一个空对象
			
				$self.data('countTo', data);  //  设置一个对象    countTo    ,值为 data
			
			// if an existing interval can be found, clear it first 
			if (data.interval) {
				clearInterval(data.interval);
			}
			//  定义对象  定时器   data.interval  
			data.interval = setInterval(function(){
				updateTimer(); //  间隔调用函数
			}, settings.refreshInterval);
			
			// 初始化每个元素的值的开始值
			
			render(value);
			
			function updateTimer() {
				value += increment;  //  初始值+增量
				loopCount++;
				// 负值函数
				render(value);
				
				if (typeof(settings.onUpdate) == 'function') {
					settings.onUpdate.call(self, value);// 对象冒充
				}
				
				if (loopCount >= loops) {
					console.log("asdas"+value)
					// remove the interval
					$self.removeData('countTo');
					clearInterval(data.interval); //  达到上线  清除定时器
					value = settings.to;
					
					if (typeof(settings.onComplete) == 'function') {
						settings.onComplete.call(self, value);
					}
				}
			}
			
			function render(value) {
				var formattedValue = settings.formatter.call(self, value, settings);
				$self.html(formattedValue);
			}
		});
		
	
	};
	
	$.fn.countTo.defaults = {
		from: 0,               // the number the element should start at
		to: 0,                 // the number the element should end at
		speed: 1000,           // how long it should take to count between the target numbers
		refreshInterval: 100,  // how often the element should be updated
		decimals: 2,           // the number of decimal places to show
		formatter: function formatter(value, settings) {
					return value.toFixed(settings.decimals);
			}
		,  // handler for formatting the value before rendering
		onUpdate: null,        // callback method for every time the element is updated
		onComplete: null       // callback method for when the element finishes updating
	};
	
	
		




  
  
