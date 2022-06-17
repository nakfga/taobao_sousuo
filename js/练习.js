$(function () {
  //1.定义延时器的Id
  var timer = null
  //一：定义全局缓存对象 
  var cachObj = {}
  //2.定义防抖的函数
  function debonceSearch(kw) {
    timer = setTimeout(function(){
      getSuggestList(kw)
    },300)
  }
  //监听文本框的keyup事件
  $('#ipt1').on('keyup', function () {
    //3.清空 timer
    clearTimeout(timer)
    //获取文本框的输入内容,.trim去掉空格内容
    var keywords = $(this).val().trim()
    //判断输入内容是否为空
    if (keywords.length <= 0) {
      //如果搜索列表为空  列表就清空隐藏  empty清空搜索框，然后在隐藏
      return $('.suggest-list').empty().hide()
    }

    //先判断缓存中是否有数据
    if(cachObj[keywords]) {
      return renderSuggestList(cachObj[keywords])
    }
    // getSuggestList(keywords)
    debonceSearch(keywords)
  })

})
//封装函数
function getSuggestList(kw) {
  //发起请求
  $.ajax({
    //指定请求的URL地址，q是用户输入的搜索关键词
    url: 'https://suggest.taobao.com/sug?q=' + kw,
    dataType: 'JSONP',
    //指定回调函数，获取建议列表的数据
    success: function (res) {
      console.log(res);
      renderSuggestList(res)
    }
  })
}
//渲染建议列表
function renderSuggestList(res) {
  //如果没有需要渲染的数据，则直接 return
  if (res.result.length <= 0) {
    //如果列表里面的长度为0 那么删除并且隐藏
    return $('.suggest-list').empty().hide()
  }
  //渲染模板结构 用 template引擎里面的来渲染
  var htmstr = template('tpl', res)
  $('.suggest-list').html(htmstr).show()

  //二： 获取到用户输入的内容，当作键
  var k =$('#ipt').val().trim()
  //三：需要将数据作为值，进行缓存
  cachObj[k] =res


}