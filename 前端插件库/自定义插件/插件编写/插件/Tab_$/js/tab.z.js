(function($,window){
		
		//��jQuery��ӷ���
		$.fn.addTab = function(options){
				
				//�ϲ�������Ĭ�ϵĲ���
				var opts = $.extend({},$.fn.addTab.defaultOpts,options || {});
				
				//ʵ�ַ���
				return this.each(function() {
								
								//��ǰ����   �����ڵ��б�  ���ݽ���б�
								var that = $(this);
								var navList = that.find("ul:first").children('li');
								var conList = that.find("div:first").children("div");
								
								//��ǰ����  �ɵ�����								
								var curIndex = oldIndex = opts.index;
								
								
								//��ʼ�����ݽڵ�  �����ڵ�
								conList.hide().eq(curIndex).show();
								navList.eq(curIndex).addClass((opts.classType == 'only') ? opts.selectedClass :  opts.selectedClass + String(curIndex + 1));
								
								//���������ڵ� 
								navList.each(function(i){
										//����
										var index = i;		
										//���¼�
										$(this).bind(opts.mouseType,function(){
													//�Ƿ񴥷����ǵ�ǰ�ڵ� �����ֱ�ӷ���
													if(index == curIndex){ return; }
													//��ֵ�ɵĽڵ�ֵ  ��ǰ�ڵ�ֵ
													oldIndex = curIndex;
													curIndex = index;
													//�����ʽ �Ƴ���ʽ
													if (opts.classType == 'only') {
															$(this).addClass(opts.selectedClass).siblings().removeClass(opts.selectedClass);
													} else {
															$(this).addClass(opts.selectedClass + String(curIndex + 1)).siblings().removeClass((opts.selectedClass + String(oldIndex + 1)));
													}
													//�Ƿ�ʹ�ý���Ч��
													if(opts.isFade){
														conList.eq(curIndex).fadeIn(opts.tweenTime).siblings().fadeOut(opts.tweenTime);
													}else{
														conList.hide().eq(curIndex).show();
													}
										});
													
								});
								 
								 //�Ƿ��Զ��л�
								if(opts.autoPlay){
									//��ʱ��  �����ڵ��ܸ���
									var timer = null;
									var size = navList.size();
									//�������ֹͣ��ʱ�� �Ƴ���ʼ��ʱ��
										that.hover(function(){
												clearInterval(timer);
										},function(){
												timer = setInterval(function(){
														//�л���һ���ڵ�
														var newIndex = ((curIndex + 1) >= size) ? 0 : curIndex + 1;
														navList.eq(newIndex).trigger(opts.mouseType);
												},opts.delay);
										}).trigger("mouseleave");	
								}
								
								//�Ƿ����ý���Ч��(���ڵ������Զ�λ)
								if(opts.isFade){
									conList.css({"position":"absolute", "left":0, "top":0});		//��ֹ��λ���Ǿ��Զ�������DIV�ܵ�����ȥ��
								}
								
								//���ٲ��õ�����
								that = null;
								
        });
				
		}
		
		
		/*
		*	Ĭ�ϲ���			
		*	index						Ĭ������(Ĭ�ϵ�һ��0)
		*	selectedClass		ѡ����ʽ
		*	classType				��ʽΪ����(only)���Ƕ��(muilt) (Ĭ��Ϊ����)
		*	mouseType				�������(Ĭ�ϵ��click)
		*	isFade					�Ƿ�ʹ�ý���Ч��
		*	tweenTime				��������ʱ��
		*	autoPlay				�Ƿ�ʹ���Զ��л�
		*	delay						�Զ��л��ȴ�ʱ��(Ĭ��6000----6��)
		*/
		$.fn.addTab.defaultOpts = {
				index : 0,
				selectedClass : "on",
				classType : "only",			
				mouseType : "click",
				isFade : false,
				tweenTime : 500,
				autoPlay : false,
				delay : 6000
		};
	
})(jQuery,window);