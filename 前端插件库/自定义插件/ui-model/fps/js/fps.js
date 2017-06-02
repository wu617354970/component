/**
 * @author  wuwg
 * @updateTime 2017-05-24
 * @createTime  2017-05-24
 * @description 这个是显示fps的方法，用于检测js性能
 */
function FPS(){	
	var  autoFix=['webkit','moz','o','ms'];
		// 当不支持 requestAnimationFrame 需要给其加前缀，看是否支持
		if(!window.requestAnimationFrame){
			for(var i=0;i<4; i++){
			if(window[autoFix[i]+'RequestAnimationFrame']){
				window.requestAnimationFrame=window[autoFix[i]+'RequestAnimationFrame'];
				window.cancelAnimationFrame=window[autoFix[i]+'CancelAnimationFrame'];
					break;
				}	
			}		
		}
		// 如果加前缀都不支持，那么就需要用 setTimeout 去代替了
		if(!window.requestAnimationFrame){
			window.requestAnimationFrame=function(callback) { //Fallback function
				window.setTimeout(callback, 1000/60);
			}
			window.cancelAnimationFrame=function(timer){
				window.clearTimeout(timer);
			}
		}
		this.fpsContainid=null;
		this.fps=0;
		this.last=Date.now();
		this.timer=null;
		this.showFps=true; //  是否显示 fps
}
FPS.prototype={
    step: function () {
		 var  _this=this;
		if(_this.timer){
			//取消动画
			cancelAnimationFrame(_this.timer);
		}   
        _this.callback(_this);
        _this.fps = Date.now() - _this.last;
        _this.last += _this.fps;
        _this.appendFps();
		_this.timer= requestAnimationFrame(function () {
            _this.step()
        });
		
		return _this.timer;
    },
    appendFps: function () {
        var  _this=this;
		if(_this.showFps){
			  if(!_this.fpsContainid){	
           var   element=document.createElement('span');
            element.setAttribute('id','js-fd-fps');
            element.className='fd-fps';
            element.setAttribute('style',"position: fixed;top: 0;right: 0;z-index: 999;text-align:center;line-height:100px;border: 1px solid #dddddd;min-width: 100px;min-height: 100px;color:#fff;background-color: #ff6600;");
            document.getElementsByTagName('body')[0].appendChild(element);
            _this.fpsContainid='js-fd-fps';
        }
        _this.fpsContain=document.getElementById(_this.fpsContainid);
        _this.fpsContain.innerHTML = "fps: " + _this.fps;
			
		}
      
    },
    go  :  function(callback){
        var  _this=this;
        if(typeof  callback =='function'){
            //回调函数
            this.callback= callback
        }else {
            var   element=document.createElement('div');
                  element.setAttribute('id','js-text-contain');
                  element.className='fd-text-contain';
                  element.setAttribute('style',' border: 1px solid #dddddd;max-width: 600px;min-height: 100px;background-color: #fff;');
            if( document.getElementsByClassName('fd-contain')[0]){
                document.getElementsByClassName('fd-contain')[0].appendChild(element);
            }else {
                document.getElementsByTagName('body')[0].appendChild(element);
            }
            _this.textContain=document.getElementById('js-text-contain');
            //回调函数
            this.callback= function (_this) {
                for(var  i=0; i<25000;i++){
                 //   document.getElementById('js-text-contain').innerHTML='现在的文本是：'+Math.random()*100;
                   _this.textContain.innerHTML='现在的文本是：'+Math.random()*100;
                }
            }
        }
        _this.timer= requestAnimationFrame(function () {
            _this.step()
        });

		return _this.timer
    }
};
