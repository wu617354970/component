var   data=[
    {
        "fbdm" : "011Z",
        "fydm" : "2",
        "fyjb" : "3",
        "fyjc" : "北京一中院",
        "isXq" : "false",
        "mapId" : "110199",
        "xqmc" : "北京市第一中级人民法院"
    },
    {
        "fbdm" : "0113",
        "fydm" : "5",
        "fyjb" : "4",
        "fyjc" : "石景山法院",
        "isXq" : "false",
        "mapId" : "110103",
        "xqmc" : "北京市石景山区人民法院"
    }, {
        "fbdm" : "0114",
        "fydm" : "6",
        "fyjb" : "4",
        "fyjc" : "海淀法院",
        "isXq" : "false",
        "mapId" : "110104",
        "xqmc" : "北京市海淀区人民法院"
    }, {
        "fbdm" : "0115",
        "fydm" : "7",
        "fyjb" : "4",
        "fyjc" : "门头沟法院",
        "isXq" : "false",
        "mapId" : "110105",
        "xqmc" : "北京市门头沟区人民法院"
    }, {
        "fbdm" : "0117",
        "fydm" : "9",
        "fyjb" : "4",
        "fyjc" : "昌平法院",
        "isXq" : "false",
        "mapId" : "110107",
        "xqmc" : "北京市昌平区人民法院"
    }, {
        "fbdm" : "0119",
        "fydm" : "11",
        "fyjb" : "4",
        "fyjc" : "延庆法院",
        "isXq" : "false",
        "mapId" : "110109",
        "xqmc" : "延庆县人民法院"
    }
];
$('#search').autocompleter({
    showLog: false, // 是否显示日志
    hasSearchButton: false, // 是否有搜索按钮
    searchName: ['fyjc', 'xqmc', 'fyjb', 'isXq', 'fbdm', 'mapId'], //  搜索的key值,类型为数组，就是可以搜索一个对象的多个值
    limitCount: 5, // 提示条目数
    deferTime: 200, // 延迟显示
    autocompleter: true, //是否自动完成
    menuSelectedClass: 'selected', // 选中条目的类名
    hideAutocompleterClass: 'hide', // 隐藏的类名
    data: data, //  自动完成的数据源
    autocompleterIsAjax: false, //  是否是ajax加载数据
    autocompleterAjax: { // ajax的参数
        url: '../json/data.json',
        method: 'get',
        data: 'query',
        dataType: 'json',
        asych: true,
        success: function (data, stauts, xhr, _scope) {
            console.log('ajax成功')
            // 赋值给自动完成的对象
            _scope.autocompleter.response = data.data.dataList;
        },
        error: function (data, stauts, xhr) {
            console.log('ajax失败')
        }
    },
    // 搜索的回调函数
    callback: {
        search: function (event, target, query, _scope) {
            //  console.log(target)
            //   console.log(query)
            var content = [];
            var target = null;
            // console.log(_scope.autocompleter.response)
            $.each(_scope._this.data(), function (key, value) {
                content.push('<p>' + key + ':' + value + '</p>');
            });
            $('#jsContent').html(content.join(''));
        }
    }
});