## Html中渲染makedown 文件


* 首先需要md解析插件，这里使用marked。引入插件后直接使用`marked.parse`即可解析md，但是需要获得
md文件。这里使用原生ajax获取md文件。但是代码块没有高亮还需要使用`highlight.js `样式文件。并调用`hljs.initHighlightingOnLoad()`显示。

整合封装如下

```js
 function MakeDown(){
            this.init.apply(this,arguments);
        }
        MakeDown.prototype.init = function(dom,width){
            this._parent = document.querySelector(dom);
            this._parent.style.width = (width? width:800)+"px";
            this.createDom();
        }
        //创建显示md内容的dom
        MakeDown.prototype.createDom = function(){
            var article = document.createElement('article');
            article.classList.add('markdown-body');
            this._parent.appendChild(article)
            this._content = article;
        }
        //加载md文件
        MakeDown.prototype.loadMdData = function(url){
            let content =  this._content;
            return new Promise((res, rej) => {
                var xmlhttp;
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();
                }
                else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        res(this.responseText);
                        //内容输出
                        content.innerHTML = marked.parse(this.responseText);
                        //高亮显示
                        hljs.initHighlightingOnLoad()
                    }
                    else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
                        rej(null);
                    }
                }
                xmlhttp.open("GET", url, true);
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xmlhttp.send();
            });
        }
```


实例调用:

```js
    var md = new MakeDown('#content',600); //'#content':dom选择器字符串，第二参数600为宽度
    md.loadMdData('cas.md');//参数为md文件地址。
```


