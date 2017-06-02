$('#search').autocompleter({
    showLog: false, // 是否显示日志
    hasSearchButton: false, // 是否有搜索按钮
    searchButton: '.fd-btn-search', // 搜索按钮的类名
    autocompleterContain: 'fd-menu-contain', // 自动完成容器
    searchName: ['fyjc', 'xqmc', 'fyjb', 'isXq', 'fbdm', 'mapId'], //  搜索的key值,类型为数组，就是可以搜索一个对象的多个值
    limitCount: 5, // 提示条目数
    deferTime: 200, // 延迟显示
    autocompleter: true, //是否自动完成
    menuSelectedClass: 'selected', // 选中条目的类名
    hideAutocompleterClass: 'hide', // 隐藏的类名
    data: [], //  自动完成的数据源
    autocompleterIsAjax: true, //  是否是ajax加载数据
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
        search: function (query, _scope) {
            //  console.log(_scope)
            //   console.log(query)
            var content = [];
            var target = null;
            var data = _scope._this.data();
            if ($.isEmptyObject(data)) {
                $.each(_scope.autocompleter.response[0], function (key, value) {
                    content.push('<p>' + key + ':' + value + '</p>');
                });
            } else {
                $.each(_scope._this.data(), function (key, value) {
                    content.push('<p>' + key + ':' + value + '</p>');
                });
            }
            $('#jsContent').html(content.join(''));
        }
    }
});