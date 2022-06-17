$(function() {
    //监听文本框的keyup事件
    $('#ipt1').on('keyup', function() {
            //获取文本框的输入内容,.trim去掉空格内容
            var keywords = $(this).val().trim()
                //判断输入内容是否为空
            if (keywords.length <= 0) {
                return $('.suggest-list').empty().hide()
            }
            //先判断缓存中是否有数据
            if (cacheObj[keywords]) {
 
                return renderSuggestList(cacheObj[keywords])
            }
            //或如搜索建议列表
            else {
                // getSuggestList(keywords)
                clearTimeout(timer) //再触发keyup事件时，立即清空timer
                debounceSearch(keywords) //防抖+请求+渲染
            }
 
        })
        //封装函数
    function getSuggestList(kw) {
        //发起请求
        $.ajax({
            //指定请求的URL地址，q是用户输入的搜索关键词
            url: 'https://suggest.taobao.com/sug?q=' + kw,
            dataType: 'JSONP',
            //指定回调函数，获取建议列表的数据
            success: function(res) {
                console.log(res);
                renderSuggestList(res)
            }
        })
 
    }
    // 定义渲染建议列表
    function renderSuggestList(res) {
        if (res.result.length <= 0) {
            return $('.suggest-list').empty().hide()
        }
        //渲染模板结构
        var htmstr = template('tpl', res)
        $('.suggest-list').html(htmstr).show()
            //将搜索的结果，添加到缓存对象中
        var k = $('#ipt1').val().trim() //获取用户输入的数据，当作键
        cacheObj[k] = res //需要将数据作为值进行缓存
        console.log(cacheObj);
    }
    var timer = null //防抖动的timer
        //1、定义全局缓存对象
    var cacheObj = {}
 
    function debounceSearch(keywords) { //定义防抖的函数
        timer = setTimeout(function() {
            //发起JSONP请求，通过一个延迟器之后再发起JSONP请求
            getSuggestList(keywords)
        }, 2000)
    }
})