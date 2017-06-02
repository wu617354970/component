
/********************************************************

type  自由发挥 => 自定义提示

 ********************************************************/
$.addTipsMethod({
	unifyTips : false,
	category : 'error',
	mouseType : 'tips4',
	className : '.js-tips-trigger-special',
	callback : {
		error : function (tipsContain, _this, _event) {
			var htmlArray = [];
			htmlArray.push('<h4>姓名:' + _this.data('name') + '</h4>');
			htmlArray.push('<h5>年龄:' + _this.data('age') + '岁</h5>');
			htmlArray.push('<h5>学校:' + _this.data('school') + '</h5>');
			htmlArray.push('<p>简介:' + _this.text() + '</p>');
			tipsContain[0].innerHTML = htmlArray.join('');
		}
	}
});


/********************************************************

type  统一提示 => 默认取infomation里面对应的信息，可以自行修改

 ********************************************************/
var unifyTips = {
	// 默认
	defaultC : $.addTipsMethod({
		unifyTips : true,
		category : 'defaultC',
		className : '.js-tips-trigger-defaultC'
	}),
	// 提示
	info : $.addTipsMethod({
		unifyTips : true,
		category : 'info',
		className : '.js-tips-trigger-info'
	}),
	// 警告
	warning : $.addTipsMethod({
		unifyTips : true,
		category : 'warning',
		className : '.js-tips-trigger-warning'
	}),
	// 成功
	success : $.addTipsMethod({
		unifyTips : true,
		category : 'success',
		className : '.js-tips-trigger-success'

	}),
	// 错误
	error : $.addTipsMethod({
		unifyTips : true,
		category : 'error',
		className : '.js-tips-trigger-error'

	})

};
/********************************************************

type  非统一提示 => 默认直接取文本框的值

 ********************************************************/

var notUnifyTips = {
	// 默认
	defaultC : $.addTipsMethod({
		unifyTips : false,
		category : 'defaultC',
		mouseType : 'tips2',
		className : '.js-tips-trigger-defaultC-2'
	}),
	// 提示
	info : $.addTipsMethod({
		unifyTips : false,
		category : 'info',
		mouseType : 'tips2',
		className : '.js-tips-trigger-info-2'
	}),
	// 警告
	warning : $.addTipsMethod({
		unifyTips : false,
		category : 'warning',
		mouseType : 'tips2',
		className : '.js-tips-trigger-warning-2'
	}),
	// 成功
	success : $.addTipsMethod({
		unifyTips : false,
		category : 'success',
		mouseType : 'tips2',
		className : '.js-tips-trigger-success-2'

	}),
	// 错误
	error : $.addTipsMethod({
		unifyTips : false,
		category : 'error',
		mouseType : 'tips2',
		className : '.js-tips-trigger-error-2'

	})

}
/********************************************************

type  回调函数 => 自定义提示

 ********************************************************/

var callbackTips = {
	// 默认
	defaultC : $.addTipsMethod({
		unifyTips : false,
		category : 'defaultC',
		mouseType : 'tips3', //  !importtant
		className : '.js-tips-trigger-defaultC-3',
		callback : {
			defaultC : function (tipsContain, _this, _event) {
				tipsContain[0].innerHTML = _this.text() + '<em class="default">我是default</em>'
			}
		}
	}),
	// 提示
	info : $.addTipsMethod({
		unifyTips : false,
		category : 'info',
		mouseType : 'tips3',
		className : '.js-tips-trigger-info-3',
		callback : {
			info : function (tipsContain, _this, _event) {
				tipsContain[0].innerHTML = _this.text() + '<em class="info">我是info</em>'
			}
		}
	}),
	// 警告
	warning : $.addTipsMethod({
		unifyTips : false,
		category : 'warning',
		mouseType : 'tips3',
		className : '.js-tips-trigger-warning-3',
		callback : {
			warning : function (tipsContain, _this, _event) {
				tipsContain[0].innerHTML = _this.text() + '<em class="warning">我是warning</em>'
			}
		}
	}),
	// 成功
	success : $.addTipsMethod({
		unifyTips : false,
		category : 'success',
		mouseType : 'tips3',
		className : '.js-tips-trigger-success-3',
		callback : {
			success : function (tipsContain, _this, _event) {
				tipsContain[0].innerHTML = _this.text() + '<em class="success">我是success</em>'
			}
		}

	}),
	// 错误
	error : $.addTipsMethod({
		unifyTips : false,
		category : 'error',
		mouseType : 'tips3',
		className : '.js-tips-trigger-error-3',
		callback : {
			error : function (tipsContain, _this, _event) {
				tipsContain[0].innerHTML = _this.text() + '<em class="error">我是error</em>'
			}
		}

	})

}

