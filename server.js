var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  // console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

  // if(path === '/'){
  //   response.statusCode = 200
  //   response.setHeader('Content-Type', 'text/html;charset=utf-8')
  //   response.write('哈哈哈')
  //   response.end()
  // }else{
  //   response.statusCode = 404
  //   response.setHeader('Content-Type', 'text/html;charset=utf-8')
  //   response.write('呜呜呜')
  //   response.end()
  // }

  console.log('含查询字符串的路径\n' + pathWithQuery)
  /*pathWithQuery是含查询字符串的路径*/
  console.log('HTTP路径为\n'+path)
  /*path只包含HTTP路径*/
  /*下面两句带上会报错*/
  /*console.log('查询字符串为\n'+query)
  console.log('不含查询字符串的路径为\n'+pathNoQuery)*/

  if(path==='/'){
    var string=fs.readFileSync('./index.html','utf8')
    var amount=fs.readFileSync('./db','utf8')    //amount中存的是余额的数据，类型是string
    string=string.replace('&&&amount&&&',amount)
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/style.css'){
    var string=fs.readFileSync('./style.css','utf8')
    response.setHeader('Content-Type', 'text/css')
    response.write(string)
    response.end()
  }else if(path == '/main.js'){
    var string=fs.readFileSync('./main.js','utf8')
    response.setHeader('Content-Type','application/javascript')
    response.write(string)
    response.end()
  }else if(path==='/pay'){
    // && method.toUpperCase()==='POST'
    var amount=fs.readFileSync('./db','utf8')
    var newAmount=amount-1
    if(Math.random()>0.5){
      fs.writeFileSync('./db',newAmount)
      response.setHeader('Content-Type','application/javascript')    //image/jpg
      response.statusCode = 200
      response.write(`
      ${query.callbackName}.call(undefined,'success')
      //alert("我是pay")
      //amount.innerText=amount.innerText-1
      `)
      //response.write(fs.readFileSync('./photo.jpg'))
      
      //${query.callbackName}.call(undefined,{
      //  'success':true,
      //  'left':${newAmount}
      //})
      //JSON+padding=JSONP
    }else{
      response.statusCode = 400
      response.write('fail')
    }
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type','text/html;charset=utf-8')
    response.write('找不到对应路径，你需要修改server.js')
    response.end()
  }


  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)