/**
 * Created by wuwg on 2017/3/6 0006.
 */


$(function(){

   var  operateList={
                //元素
                ele:null,
                listContent:null,
                // 抵押次数
                indexArray:['一','二','三','四','五','六','七','八','九','十'],
                //  抵押种类，键值对
                category:[{
                      key:1,
                      value:'种类1'
                   },
                    {
                        key:2,
                        value:'种类2'
                    },
                    {
                        key:3,
                        value:'种类3'
                    },
                    {
                        key:4,
                        value:'种类4'
                    }
                ],

                loopList: function (dataList) {
                    // 添加到对象中去
                    operateList.ele.data('data-list',dataList);
                    // 生成新的html
                    var  html=[];
                    var  _dataList=dataList;
                    $.each(_dataList, function (index,value) {
                        var  _index=String(index).split(''),
                          _value=value,
                          _count=[];
                        //  获取次数
                        $.each(_index, function (index,value) {
                            var _value=parseInt(value);
                            _count.push(operateList.indexArray[_value]);
                        });
                        _count= index>9?index+1:_count.join('');
                        //  options
                        var  _options=[];
                        //  循环分类，得出选中的
                        $.each(operateList.category, function (index,value) {
                            var _option= value.key==_value.category?
                                        '<option value="'+ value.key+'"  selected="selected" >'+value.value+'</option>':
                                          '<option value="'+ value.key+'"  >'+value.value+'</option>';
                                _options.push(_option);
                        });
                        // 最后得出数据条目
                        var  item='<div class="fd-item ">'+
                                    ' <label class="fd-label">第'+_count+'抵押人：</label>'+
                                    '<input type="text" name=""  value="'+_value.name +'" />'+
                                    ' <label class="fd-label" ><em>*</em>抵押种类：</label>'+
                                    ' <select name="" >'+ _options+ '</select>'+
                                    ' <label class="fd-label">抵押金额：</label>'+
                                    ' <input type="text" name=""  value="'+_value.money+'"/>'+
                                    '<span class="fd-unit">(万元)</span>'+
                                    ' <span class="fd-operate-btn   delete js-fd-delete">删除</span>'+
                                 ' </div>';
                        // 追加到html
                        html.push(item);
                    });
                    // 填充页面
                    operateList.listContent[0].innerHTML=html.join('');
                },
                // 添加的方法
                addItem: function () {
                    operateList.ele.off('click.add').on('click.add','.js-fd-add',function(){
                        var _this=$(this);
                        var  _operateList= operateList.ele.data('data-list'),
                          _name= _this.siblings('.js-name'),
                          _category= _this.siblings('.js-select'),
                          _money= _this.siblings('.js-money');
                            // 追加到数据列表中
                           _operateList.push({
                                name:_name.val(),
                                category:_category.val(),
                                money:_money.val()
                            });
                        // 清空值
                        _name.val('');
                        _money.val('');
                        // 循环生成html
                        operateList.loopList(_operateList);
                    });
                },
                deleteItem: function () {
                    // 删除的方法
                    operateList.ele.off('click.delete').on('click.delete','.js-fd-delete',function(){
                            var _this=$(this);
                            var _index=_this.parent().index();
                            var  _operateList=  operateList.ele.data('data-list');
                            // 删除一个数据
                            _operateList.splice(_index,1);
                            // 循环生成html
                            operateList.loopList(_operateList);
                      });
                },
                 //  销毁的方法
                 destory: function () {
                     operateList.ele.off('click.delete').off('click.add').html('');
                 } ,
                // 绑定事件
                bindEvent: function () {
                    // 添加的方法
                    operateList.addItem();
                    // 删除的方法
                    operateList.deleteItem();
                },
               /**
                * @param url
                */
                request: function (url) {
                    $.ajax({
                        methed:'get',
                        url:url,
                        data:'',
                        dataType:'json',
                        success:function(data){
                            // 循环生成html
                            operateList.loopList(data.data);
                        },
                        error:function(){
                           // 请求数据出错
                        }
                    });
                },
               /**
                *
                * @param ele  最外层容器
                * @param listContent 数据列表容器
                * @param url   请求数据的url
                */
                init: function (ele,listContent,url) {
                    // 获取列表容器
                    operateList.ele=$(ele);
                    // 列表内容容器
                    operateList.listContent=$(listContent);
                   if(operateList.ele.size()>0&& operateList.listContent.size()>0){
                       //  第一次请求数据
                       operateList.request(url);
                       // 绑定事件
                       operateList.bindEvent();
                   }
                }
         };
          //  执行初始化的方法
          operateList.init('#jsOperateList','#jsOperateListContent','json/data.json');

});