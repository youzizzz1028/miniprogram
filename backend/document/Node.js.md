Node.js

> Node.js是一种基于Chrome V8的Java Script运行时环境。
>
> 浏览器的js引擎可以执行js，有内置js对象，有BOM和DOM
>
> Node.js也可以执行js，有内置对象，无BOM和DOM，有fs，path，http等模块，还有诸如mysql的API
>
> 这使得它很适合编写后台接口。

## 一、安装和运行

### 1.安装

Node.js安装很简单，到官网https://nodejs.org/en/download/，然后点左侧的绿按钮下载，傻瓜式安装

装好了之后打开cmd，输入node -v

出来版本号就成功了

### 2.运行

新建一个project1文件夹，新建project1.js文件

```js
console.log('hello world')
```

保存后，在当前根目录打开cmd，输入`node project1.js`即可

## 二、fs和path

### 1.fs

fs是文件操作模块，和python的fs是不是很像QAQ

```js
const fs = require('fs');


/*
函数原型

readFile(文件名，[参数],回调函数)
writeFile(文件名，内容，[参数]，回调函数)

*/

fs.readFile('./aaa.txt', 'utf-8', function(err, dataStr) {
    if (err) {
        return console.log(err.message);
    }
    console.log(dataStr);
})


fs.writeFile('./bbb.txt', 'hello world', function(err) {
    if (err) {
        console.log(err.message);
    }
})
```

文件结构：

![image-20230119133752381](E:\note\Node.js.assets\image-20230119133752381.png)

在这个文件夹运行`node project1.js`，运行起来没什么问题，但是`./`这种东西本身是有缺陷的：它只认cmd执行的目录

如果回到上一级目录，即`E:\\nodejscode`，运行`node project1/project1.js`，看上去路径是没问题的，但是会报找不到文件的错。

![image-20230119134243618](E:\note\Node.js.assets\image-20230119134243618.png)

> 看哪！它就认cmd的路径喂！

解决这东西要么用绝对路径（不推荐），要么用path

`__dirname`表示当前文件的路径

比如`D://nodejscode/project1`文件夹里有project1.js，那么这个js里面的`__dirname`就是`D://nodejscode/project1`，即**js所在的文件夹**

修改代码：

```js
const fs = require('fs');

fs.readFile(__dirname + '/aaa.txt', 'utf-8', function(err, dataStr) {
    if (err) {
        return console.log(err.message);
    }
    console.log(dataStr);
})


fs.writeFile(__dirname + '/bbb.txt', 'hello world', function(err) {
    if (err) {
        console.log(err.message);
    }
})
```

这次的cmd不用开在项目文件夹里都能正确运行了

但是，+是不是有点点丑？

### 2.path

我们可以导入path模块，来方便地处理路径

join用于把几个路径或字符串拼接起来，basename可以获取文件名

```js
const path=require('path');

/*
函数原型

String join(str1,str2,...)
String basename(path)  获取带扩展名的文件名
String basename(path,ext) 获取不带此扩展名的文件名
String extname(path)  获取文件扩展名

注意../可以抵消前面的一层路径，如join('/a','/b','../','/c')会返回/a/c

*/

console.log(path.join(__dirname, '/aaa.txt'))

console.log(path.basename('C:\\Users\\HP\\Downloads\\.minecraft\\versions\\1.16.5\\1.16.5.jar'))
console.log(path.basename('C:\\Users\\HP\\Downloads\\.minecraft\\versions\\1.16.5\\1.16.5.jar', '.jar'))
console.log(path.extname('C:\\Users\\HP\\Downloads\\.minecraft\\versions\\1.16.5\\1.16.5.jar'))


/*
E:\nodejscode\project1\aaa.txt
1.16.5.jar
1.16.5
.jar
*/
```

### 3.实战：拆解html

> 需求：有一个html文件，里面有style和script标签
>
> 现在希望把所有的css拿出来放进一个文件，所有的js放进另一个文件，纯html放进第三个文件

```js
const fs = require('fs')

const path = require('path')

const styleReg = /<style>[\s\S]*<\/style>/g
const jsReg = /<script>[\s\S]*<\/script>/g

const htmlFile = path.join(__dirname, 'work4.html');


fs.readFile(htmlFile, 'utf-8', function(err, dataStr) {
    if (err) return console.log(err);

    //匹配并获取值
    var styleArr = styleReg.exec(dataStr);
    for (var i = 0; i < styleArr.length; i++) {
        fs.writeFile(path.join(__dirname, 'work4.css'), styleArr[i].replace('<style>', '').replace('</style>', ''), function(err) {
            if (err) return console.log(err);
        })
    }

    var jsArr = jsReg.exec(dataStr);
    for (var i = 0; i < jsArr.length; i++) {
        fs.writeFile(path.join(__dirname, 'work4.js'), jsArr[i].replace('<script>', '').replace('</script>', ''), function() {
            if (err) return console.log(err);
        })
    }


    //剥离
    var newHtml = dataStr.replace(styleReg, '<link rel="stylesheet" href="./work4.css"/>').replace(jsReg, '<script src="./work4.js"></script>')
    fs.writeFile(path.join(__dirname, 'work4-new.html'), newHtml, function() {
        if (err) return console.log(err);
    })


})
```

注意点：

- 生成的css一般不会有什么问题，但js的依赖可能会有问题
- 正则表达式最后加g表示全局搜索，这样exec才会返回一个真正的数组，否则搜一个就停下了
- 剥离下来的东西不能直接进文件，得把两头的style标签去掉
- 新的html用外联形式替换
- writeFile会从头开始写文件，旧文件会清空
- writeFile不能创建目录，它最多能创建文件

## 三、http

http模块的存在使得nodejs可以作为服务器使用，而无需安装tomcat等第三方服务器软件。

| 函数              | 返回值     | 参数                  | 作用           |
| ----------------- | ---------- | --------------------- | -------------- |
| http.createServer | server实例 | 空                    | 新建一个服务器 |
| server.on         | void       | 事件名，(req,res)=>{} | 绑定服务器事件 |
| server.listen     | void       | 端口号，()=>{}        | 正式开始监听   |

搭建后台服务的一般步骤：

- 导入http模块
- 新建服务器实例
- 绑定事件
  - req获取参数
  - res返回给客户端
- 开始监听

客户端请求的路径一般是html网页及图片等资源，需要映射到服务端实际的资源目录中

html里外联的路径会cascade地被请求，比如index.html里引用了index.css和index.js，这些也会自动请求

### 网页请求实例

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

//创建实例
const server = http.createServer();

//绑定事件
server.on('request', function(req, res) {


    //res.setHeader('Content-type', 'text/html; charset=utf-8')

    const url = req.url;

    var content = '<h1>404 Not Found</h1>'

    var htmlPath = path.join(__dirname, url);

    fs.readFile(htmlPath, 'utf8', function(err, dataStr) {
        if (err) return res.end('404 not found')

        res.end(dataStr)
    })
    
    /*
    坑：这里不能在回调函数里给content赋值，再在外面返回
    readFile是异步的，读完了之后，callback才会执行
    这时候外层的回调函数已经跑完了，而content仍未被赋新值，自然会返回404
    */

})


//开始监听
server.listen(8080, function() {
    console.log('server start');
})
```

## 四、module机制

### 1.分类

Node.js的模块分三类：

- 内置的，比如path，fs，http
- 用户自定义的，我们写的每一个js都是一个模块
- 第三方的，比如mysql，使用前要先用npm下载

### 2.使用

```js
//加载内置模块、第三方模块
require('fs')
require('moment')

//加载自定义模块
require('./aaa.js')
```

注意，require加载模块时会执行模块中的代码！

```js
//aaa.js
console.log('aaa被加载了');

//project4.js
const aaa=require('./aaa.js');
console.log(aaa);


/*
aaa被加载了
{}
*/
```

如果用require，可以省略.js扩展名

如`require('./aaa')`也能正常运行

### 3.模块作用域

模块内定义的成员通常不能被require它的js所访问，这样可以防止全局变量污染的问题。这叫做模块作用域，与前端只有函数作用域不同

node.js内置了module对象，可以直接调出来

```js
const a = 12;

const stu = {
    'uname': '小王',
    'uage': 20
}

console.log('aaa被加载了');
console.log(module);

/*
aaa被加载了
Module {
  id: 'E:\\nodejscode\\project4\\aaa.js',      
  path: 'E:\\nodejscode\\project4',
  exports: {},
  filename: 'E:\\nodejscode\\project4\\aaa.js',
  loaded: false,
  children: [],
  paths: [
    'E:\\nodejscode\\project4\\node_modules',
    'E:\\nodejscode\\node_modules',
    'E:\\node_modules'
  ]
}
*/
```

编写module.exports对象可以向外共享本模块的成员

外界拿到require返回值实际上就是被引用模块的module.exports对象，所以默认情况下拿到的是空对象`{}`

```js
//aaa.js

const a = 12;
const b = 18;
const stu = {
    'uname': '小王',
    'uage': 20
}

//module.exports.b = b;  这不会生效，因为下一行指向了新对象

module.exports = {
    'a': a,
    'stu': stu
}

module.exports.sayHello = function() { console.log('hello'); }

console.log('aaa被加载了');

//project4.js
const aaa = require('./aaa')

console.log(aaa);

/*
aaa被加载了
{
  a: 12,
  stu: { uname: '小王', uage: 20 },
  sayHello: [Function (anonymous)]
}
hello
*/
```

注意：require永远以module.exports指向的新对象为准

Node.js提供了一种偷懒的写法，exports与module.exports对象默认情况下指向同一个对象，但最终结果以后者为准

```js
const a = 12;

// exports = {
//     'a': a,
//     'stu': stu
// }
//注意：不要给exports赋新对象，否则它就不指向module.exports了，事实上这种写法不会有任何效果
//只能给exports用改值的方式，如以下两种写法是正确的

exports.a = a;
exports.sayHello = function() {
    console.log('hello');
}

console.log('aaa被加载了');
```

建议：

- 在同一个模块中不要混用module.exports和exports
- 如果真要用exports，别给它直接赋对象值

#### CommonJS规范

1. module对象表示当前模块
2. module.exports对象表示模块对外的接口
3. 使用require引入模块

### 4.npm与包

包（package）就是第三方模块，需要通过npm包管理工具进行安装

但是，一般情况下，装包的过程特别慢，这时需要改镜像源

```
npm i nrm
//静静等待5分钟

nrm ls
```

这时肯定会报错，解决方法是：https://blog.csdn.net/weixin_46473109/article/details/104890538

```
nrm use taobao
//改为淘宝的镜像源
```

然后运行这一行命令，以后装包就快了！

```
npm install 包名
//或者使用简写
npm i 包名


//安装到devDependencies，即开发会用，上线不用
npm i 包名 --save-dev
```

目前的npm在首次装包之后，会在cmd运行的文件夹中自动创建`node_modules`目录，`package-lock.json`和`package.json`

- node_modules目录：存放包本体文件
- package-lock.json：记录包的下载信息
- package.json：简要地记录包列表

由于包的体积太大，有时候一个项目的包比源码都多不少，这对多人协作不利，所以node_modules一般都在.gitignore文件里

当团队成员拿到了剔除node_modules的项目后，他是不能直接跑项目的，会报找不到依赖。但是，我们共享了package.json，可以通过`npm install`一次性安装其中所有的包。

包的使用和内置模块一致，直接写包名字符串就行

```js
const moment=require('moment')
```

运行`npm uninstall 包名`可以卸载包。

编写包、加载包的细节就不写啦~~（其实是偷懒）~~

## 五、express

世界上大概有两种服务器：网站服务器和接口服务器。网站服务器返回具体的网页，接口服务器提供API用来处理请求

（就像controller和restcontroller一样）

express是http模块的进一步封装，使用它可以快速地开发以上两种服务器。

express是一种开发框架，和springboot的作用差不多

```
npm install express
```

### 1.启动，get，post

```js
const express = require('express')

//创建服务器实例
const app = express()

//正式开始监听
app.listen(8080, () => { console.log('server start'); })

//get映射，相当于getMapping
app.get('/index.html/:id/:name', (req, res) => {

    console.log(req.url);
    ///index.html/18/jiajia

    console.log(req.params);
    //{ id: '18', name: 'jiajia' }

    res.send('this is index')
})

//post映射，相当于postMapping
app.post('/index.html', (req, res) => {

    console.log('post:' + req.url);
    //post:/index.html?id=12&name=xiaowang

    console.log(req.query);
    //{ id: '12', name: 'xiaowang' }

})
```

query对象存储了诸如`id=2&name=xiaowang`这种键值对参数，这个对象默认是一个空对象。

params对象存储了诸如`/18/jiajia`这种动态解析参数，键名根据映射的代码决定，值的顺序根据url决定

### 2.托管静态资源

```js
express.use(express.static('public'))

//localhost:8080/index.html
```

这时，public下所有的html、css、js、图片都可以直接通过url根目录（即/）进行访问了。这相当于把/重定向到了public文件夹中

这就成为了一个静态资源服务器。存放静态资源的文件夹并不会出现在url中，也就说明了这个重定向的功能。

（相当于springboot的resources）

可以指定几个静态资源目录，靠上的优先级高

```js
express.use(express.static('public'))
express.use(express.static('static'))
```

浏览器请求时，要是在public里找不到资源，就去static找。

（相当于springboot的resources，public，static，META_INF/resources之间的优先级关系）

如果希望在映射时加上路径前缀，那么使用use()的第一个参数

```js
express.use('public',express.static('public'))

//localhost:8080/public/index.html
```

### 3.路由

其实app.get和app.post就已经是一种简单的路由

路由有三个重要属性：url，method，参数

我们不推荐把所有的路由都挂到app上，而是要模块化管理

```
npm i nodemon
```

先安装一个nodemon包，它能够替代node命令，在代码文件发送改变时自动重启服务器。

模块化路由的思路：

1. 新建router实例
2. 向router实例下挂载get，post等
3. export这个实例
4. 主程序拿到实例，使用use挂到app下

```js
//studentController.js
const express = require('express');


const router = express.Router();

router.get('/list', function(req, res) {
    res.send('student list')
})

router.post('/add', function(req, res) {
    res.send('student add')
})

module.exports = router;

//project5.js
const express = require('express')

const stuController = require('./studentController.js')

const app = express()

app.listen(8080, () => { console.log('server start'); })

app.use('/stu', stuController) //把新路由挂到app下，并添加/stu前缀
//localhost:8080/stu/list
```

### 4.中间件

中间件是用来处理请求的，一个中间件处理完成以后将处理结果和控制转交给下一个中间件或路由

中间件的本质也是一个函数，与路由的区别在于形参。有res,req,next形参的函数就是中间件，而且必须调用next()

```js
const m1=function(req,res,next){
    console.log('m1')
    
    next()
}
```

#### (1).全局中间件

使用`app.use(函数名)`可以使这个中间件**全局生效**，即任何从服务器发来的请求，都会经过这个中间件。

```js
const m1 = function(req, res, next) {
    console.log('m1')

    next()
}

app.use(m1)
```

中间件可以修改、添加req的属性，从而后面的路由可以拿到这个属性

```js
const m1 = function(req, res, next) {
    console.log('m1被调用了')

    req.reqTime = Date.now()
    next()
}


//stuController
router.get('/list', function(req, res) {

    console.log(req.reqTime);
    res.send('student list')
})


/*
m1被调用了
1674212811725
*/
```

可以给app挂载多个中间件，发来的请求会按挂载的顺序经过这些中间件。

```js
const m1 = function(req, res, next) {
    console.log('m1被调用了')

    req.reqTime = Date.now()
    next()
}

const m2 = function(req, res, next) {
    console.log('m2被调用了')

    req.dataStr = 'dataStr'
    next()
}

app.use(m1)
app.use(m2)  //要记得写
```

#### (2).局部中间件

不在app下直接挂载的就是局部中间件，局部中间件在get、post请求的回调函数之前以形参的方式引入

```js
const m3 = function(req, res, next) {
    console.log('m3被调用了')

    next()
}

app.get('/index', m3, function(req, res) {
    res.send('this is index')
})

//m3被调用了
```

可以传入几个函数，或一个函数数组，表示这次请求被几个中间件按先后顺序处理

```js
app.get('/', [m3, m2], function(req, res) {
    res.send('this is root')
})

//等价写法

app.get('/', m3,m2, function(req, res) {
    res.send('this is root')
})
```

#### (3).注意事项

- 一定要在路由之前定义中间件（对于全局的，还一定要在所有路由之前挂载上app，不然就不生效）
- 记得写next()，而且之后不要再写其他代码了
- 多个中间件之间共享的是上一级处理过的req和res对象

#### (4).分类

- **应用**级别的中间件：挂载到app底下的中间件，包括全局的（app.use）和局部的（app.get和app.post）

- **路由**级别的中间件：挂载到router实例的中间件

- **错误**级别的中间件：专门用来捕获异常，定义也与其他中间件不同，有4个参数

  ```js
  function(err,req,res,next){
      //...
      next()
  }
  ```

  特殊：错误级别的中间件要放到所有路由之后，否则抓不到错误

  ```js
  
  app.use('/', function(req, res) {
  
      throw new Error('服务器错误')
  
      console.log('control should not reach here');
  })
  
  app.use(function(err, req, res, next) {
  
      console.log(err)
      res.send('服务器发生了错误')
  
      next()
  })
  ```

  

- express的**内置**中间件

  - express.static：快速把服务器静态资源目录映射到url上

  - express.json：解析json

  - express.urlencoded：解析URL-encoded格式的表单数据

  使用这些中间件要用app.use挂载

- **第三方**的中间件

  使用步骤：

  1. npm install 中间件名
  2. require导入模块
  3. app.use挂载中间件

##### 实战：解析请求体的json数据

![image-20230120202907948](E:\note\Node.js.assets\image-20230120202907948.png)

```js
app.use('/', function(req, res) {

    console.log(req.body);
    //undefined
    
    res.send('ok')

})


app.use(function(err, req, res, next) {

    console.log(err)
    res.send('服务器发生了错误')

    next()
})
```

为什么拿到的req.body是undefined呢？因为没有配置中间件的情况下，req.body默认为空

```js
app.use(express.json())
```

这样就能拿到req.body里面的数据了。

如果发URL-encoded格式的数据，那么需要新的中间件

```js
app.use(express.urlencoded({ extended: false }))
```

## 六、编写API服务器

### 1.get和post处理

```js
const express = require('express')

const router = express.Router()

//router.use(express.urlencoded({ extended: false }))
//这里不用写，因为app已经配过全局的了

router.get('/get', function(req, res) {

    const query = req.query

    res.send({
        status: 0,
        msg: 'get成功',
        data: query
    })

})

router.post('/post', function(req, res) {

    const reqBody = req.body
    //需要中间件解析

    res.send({
        status: 0,
        msg: 'post成功',
        data: reqBody
    })

})


//记得要导出router
module.exports = router
```

```js
//project6.js

const apiRouter = require('./apiRouter.js')
//...
app.use('/api', apiRouter)
```

### 2.CORS解决跨域问题

我们在项目根目录编写一个html，请求localhost上的api接口。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js">
    </script>
</head>

<body>
    <button id="get-btn">GET</button>
    <button id="post-btn">POST</button>

    <script>
        $('#get-btn').on('click', function() {
            $.ajax({
                url: 'http://localhost:8080/api/get',
                method: 'GET',
                success: function(res) {
                    console.log(res);
                }
            })
        })

        $('#post-btn').on('click', function() {
            $.ajax({
                url: 'http://localhost:8080/api/post',
                method: 'POST',
                success: function(res) {
                    console.log(res);
                }
            })
        })
    </script>
</body>

</html>
```

![image-20230120212721115](E:\note\Node.js.assets\image-20230120212721115.png)

出现了跨域问题！这是因为file和http两种协议不互通的原因

可以通过cors中间件解决这个问题，使用`npm install cors`安装，在主程序用require引入，在所有的路由之前挂载中间件

```js
const cors = require('cors')
//...
app.use(cors())  //老天哪，记得这括号
```

这样就可以跨域了。配置都在服务器进行，客户端的浏览器无需任何配置。

注意：CORS在IE10之前都是不支持的

### 3.mysql数据库

使用`npm i mysql`安装mysql包

使用上是很容易的，先用createPool建连接池，然后就只有query()指令

对于select语句，它返回对象数组；对于insert，update，delete，它返回一个结果对象

和JDBCTemplate一样，sql支持问号占位法。更神奇的是，它还支持类似于bean的写法！

如果一个对象的键正好和数据表里的列名一模一样，那么这个对象可以被动态解析成表的各列。sql语句中，直接在set后面写问号，就能动态解析

这并不要求对象的键囊括表的所有字段，比如auto-increment的id，也不必写在对象里（说人话就是：对象不能包括除了表字段外的东西）

示例：

```js
const mysql = require('mysql')

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'aaa123',
    database: 'j2ee'
})

//---------------查询
db.query('select * from users', (err, results) => {
    if (err) { return console.log(err.message); }


    console.log(results);
})

//---------------插入数据（简易）
const maomao = {
    'email': 'ccc@qq.com',
    'user_id': '10214507407',
    'user_name': '毛毛',
    'user_password': '123456',
    'major': '教育技术学',
    'authority': 1
}
const sql = 'insert into users SET ?';//此处与一般sql写法不同
db.query(sql, maomao, (err, results) => {
    if (err) { return console.log(err.message); }


    if (results.affectedRows === 1) { console.log('插入数据成功！'); }
})

//----------------更新数据
const maomao = {
    'user_id': '10214507407',
    'authority': 0
}
const sql = 'update users set ? where user_id = ?';
db.query(sql, [maomao, maomao.user_id], (err, results) => {
    //这里maomao是set后面的问号，maomao.user_id是第二个问号
    
    if (err) { return console.log(err.message); }


    if (results.affectedRows === 1) { console.log('更新数据成功！'); }
})


//---------------插入数据
const sql = 'insert into users values(?,?,?,?,?,?)'
db.query(sql, ['ccc@qq.com', '10214507407', '毛毛', '123456', '教信双学位', 0], (err, results) => {
    if (err) { return console.log(err.message); }


    if (results.affectedRows === 1) { console.log('插入数据成功！'); }
})


//---------------删除数据
const sql = 'delete from users where user_id = ?;'
db.query(sql, '10214507407', (err, results) => {
    if (err) { return console.log(err.message); }

    if (results.affectedRows === 1) { console.log('删除数据成功！'); }

})
```

### 4.Authentication（身份认证）

> 对于pc端网页，一般采用session机制
>
> 对于移动端网页，一般采用JWT

#### (1).cookie

- 浏览器上一个不超过**4kb**的键值对字符串
- 进行网络请求时，会把当前域名下所有未过期的cookie**自动发送**给服务器
- 是**域名独立**的，每个域名一份cookie
- cookie有**过期时限**

客户端第一次请求服务器：服务器把身份认证的cookie通过响应头发回客户端

客户端保存这个cookie

客户端第n次请求服务器：通过请求头，将身份认证cookie自动发给服务器

![image-20230122094535570](E:\note\Node.js.assets\image-20230122094535570.png)

但是，cookie很容易被伪造，而且浏览器有读写cookie的API，所以不能把用户的隐私信息存储在cookie中。

#### (2).session

session的核心就是：会员卡加刷卡认证

服务器将用户的账号、密码等缓存在内存中，同时发回cookie

客户端之后的请求既要验证cookie，也要验证账号密码

```
npm i express-session
```

```js
var session = require('express-session')
const express = require('express')

const app = express()

app.listen(8080, function() {
    console.log('server start');
})

app.use(express.json())//记得这括号！它再次坑我一次
app.use(session({
    secret: 'weffegxr',
    resave: false,
    saveUninitialized: true
}))//固定写法

//req.session访问session
//类似于springboot的HttpSession对象
app.post('/api/login', function(req, res) {
    if (req.body.userName !== 'admin' || req.body.password !== '123456') {
        return res.send({ status: 1, msg: '登录失败' })
    }

    req.session.user = req.body
    req.session.isLogin = true

    res.send({ status: 0, msg: '登录成功' })
})

app.get('/api/username', function(req, res) {
    if (req.session.isLogin === true) {
        return res.send({ status: 0, msg: 'success', username: req.session.user.userName })
    }
    return res.send({ status: 1, msg: 'fail' })
})
//只有在登录过之后才能成功调用此接口


app.use(function(err, req, res, next) {

    console.log(err)
    res.send('服务器发生了错误')

    next()
})
```

#### (3).JWT

由于session机制是依赖cookie的，而cookie默认情况下不能跨域，要做很多额外配置。

如果项目没有跨域需求，那么还是用session

JWT（json web token），是目前最流行的跨域认证方案。

与session的区别：JWT生成的token存储在客户端，而session存储在服务器

服务器将用户信息加密成一个token字符串发给客户端，客户端一般把收到的token存放在localStorage或sessionStorage中

token结构：

- header：安全性
- payload：加密后的实际数据
- signature：安全性

```js
const jwt = require('jsonwebtoken')
const { expressjwt: expressjwt } = require('express-jwt')
const express = require('express')
const cors = require('cors')

const app = express()
app.listen(8080, function() {
    console.log('server start');
})

app.use(express.json())
app.use(cors())
//加密密钥，随意
const secertKey = 'octenexin :)'


app.post('/api/login', function(req, res) {
    if (req.body.userName !== 'admin' || req.body.password !== '123456') {
        return res.send({ status: 1, msg: '登录失败' })
    }


    res.send({
        status: 0,
        msg: '登录成功',
        token: jwt.sign({ username: req.body.userName },
            secertKey, { expiresIn: '30s' }
        )
    })
})

//jwt.sign()方法用于生成token字符串
//参数1：对象型，实际数据
//参数2：密钥
//参数3：对象型，配置信息


/*
{
    "status": 0,
    "msg": "登录成功",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc0MzU2MzAyLCJleHAiOjE2NzQzNTYzMzJ9.NXvLWCpFMguxq6ntWQJLmD4J6NDsnaMCiZ54QcnEckI"
}
*/
```

客户端每次访问**有权限接口**的时候，都要通过请求头的Authorization字段将token发给服务器

服务器通过express-jwt将token字符串还原成json对象

```js
const jwt = require('jsonwebtoken')
const { expressjwt: expressjwt } = require('express-jwt')
const express = require('express')
const cors = require('cors')

const app = express()
app.listen(8080, function() {
    console.log('server start');
})

app.use(express.json())
app.use(cors())
const secertKey = 'octenexin :)'
app.use(expressjwt({ secret: secertKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))


app.post('/api/login', function(req, res) {
    if (req.body.userName !== 'admin' || req.body.password !== '123456') {
        return res.send({ status: 1, msg: '登录失败' })
    }


    res.send({
        status: 0,
        msg: '登录成功',
        token: 'Bearer ' + jwt.sign({ username: req.body.userName },
            secertKey, { expiresIn: 3600 * 24 * 3 }
        )
    })
})

app.get('/user/list', function(req, res) {

        console.log(req.auth);

        res.send({ status: 0, msg: 'success', data: req.auth })

    })
//req.auth，内置对象，实际就是 JWT 的 payload 部分
//{ username: 'admin', iat: 1674359806, exp: 1674619006 }

app.use(function(err, req, res, next) {

    if (err.name === 'UnauthorizedError') {
        return res.send({
            status: 401,
            message: '无效的token'
        })
    }

    console.log(err)
    res.send('服务器发生了错误')

})
```

注意：

- 新版本的expressJWT引用的时候要重命名，即`{ expressjwt: expressjwt }`

- 新版本的要指定算法algorithms

- 无权限的接口用unless过滤

- 访问有权限的接口，要在请求头添加Authorization字段，值为bearer空格+token（如果发回的token本来就有bearer前缀，不加也行）

  ![image-20230122120434508](E:\note\Node.js.assets\image-20230122120434508.png)

  > 在这里添加Authorization字段

- 使用req.auth拿到token的payload
