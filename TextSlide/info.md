自制Web网页上可以显示上下左右滑动的文本插件

### 安装

首先需要提供`PIXI.js`作为基础。 可以在官网下载 <a href="https://github.com/pixijs/pixijs/releases">PIXI.js</a>

当然也可以直接使用这里提供的pixi.js

然后引入TextSlide脚本文件即可使用

### 开始使用

可以参考demo.html描写内容


使用TextSlide构造类即可实现一个滑动文本。如下:


```js
let f = new TextSlide(document.getElementById("txt_info"),240,24)
f.addText("你好吗?"); //添加文本
f.addText("Good!");
f.addText("123456789123456789123456789");
f.setFill('#e5cdc3','#6047e0') //为文字添加渐变色
```

构造类含有4个参数:

`TextSlide.prototype.initialize = function(dom,width,height,bg)`

[dom:HTMLDivElement] : 必须含有且为div元素dom对象。在该dom中显示滑动文本框

[width:Number] : 滑动文本框宽度，默认为100

[height:Number] : 滑动文本框高度，默认为100

[bg:String] : 滑动文本框背景色。默认为空为白色

指定dom后接下来需要指定滑动文本框数据。否则你将看不到任何数据。

使用`addText(txt)`添加一行显示数据。也可以使用`setMssages(args)`指定文本数组。

文本数组只要含有元素就会自动上下循环切换。若每行字符串超出文本框宽度。会自动向左滑动。可以通过修改以下参数指定滑动快慢和停留显示时间:

```
this._speedX = 1; //上下滑动速度,每帧1px
this._speedY = 1; //左右滑动速度,,每帧1px
this._delta = 300;//切换到下一个文本行的时间,300帧（大概5s）
```

### API

```js
TextSlide.prototype.initialize = function(dom,width,height,bg){
    this._speedX = 1;
    this._speedY = 1;
    this._delta = 300;
    this._time = this._delta;
    this._messages = []; //文本数组
    this._index = 0;  //当前显示文本的索引
    if(dom instanceof HTMLDivElement){
        this.createPixi(dom,width,height,bg);
        this.createText();
        this.setFontSize(18);
        this.createTicker();
    }
    else{
        throw new Error("初始化失败! 请指定div对象");
    }
}


//添加一行文本
TextSlide.prototype.addText = function(txt){
    this._messages.push(txt);
    this.setText(txt);
}
//指定元素数据
TextSlide.prototype.setMssages = function(args){
    if(Array.isArray(args)){
        this._messages = args;
        this.setText(args[0]);
    }
}
//设置当前显示文本
TextSlide.prototype.setText = function(txt){
    this._text.text = txt;
    this._textWidth = this.measureTextWidth();
}
//修改字体大小
TextSlide.prototype.setFontSize = function(size){
    this._text.style.fontSize = size || 18;
}
//字体大小改变 f有值为粗体
TextSlide.prototype.setBold = function(f){
    this._text.style.fontWeight = f? 'bold' : 'normal';
}

/**
 * 设置渐变色
 */
TextSlide.prototype.setFill = function(color1,color2){
    this._text.style.fill = [color1,color2];
}
/**
 * 描边
 * color:String 描边颜色 如 '#222222'
 * borde 描边宽度
 */
TextSlide.prototype.stroke = function(color,border){
    this._text.style.stroke = color;
    this._text.style.strokeThickness = border || 1;
}
/**
* 所有可改变属性参考
*/
TextSlide.prototype.setOther = function(){
    this._text.style.fill= ['#ffffff', '#00ff99']
    this._text.style.stroke = '#4a1850'
    this._text.style.strokeThickness = 5
    this._text.style.dropShadow = true
    this._text.style.dropShadowColor = '#000000'
    this._text.style.dropShadowBlur  = 2
    this._text.style.dropShadowAngle = Math.PI / 6
    this._text.style.dropShadowDistance  = 6
    this._text.style.wordWrap =  true
    this._text.style.wordWrapWidth = 440
    this._text.style.lineJoin = 'round'
}
/**
 * 计算当前字符串宽度
 */
TextSlide.prototype.measureTextWidth = function(){
    let c = document.createElement('canvas');
    let cx = c.getContext('2d');
    cx.font = this._text.style.fontSize + "px " + this._text.style.fontFamily
    return cx.measureText(this._text.text).width;
}
/**
*显示下一个信息行
*/
TextSlide.prototype.showNextMessage = function(){
    this._index ++;
    this._index = this._index >= this._messages.length?  0 : this._index;
    this.setText(this._messages[this._index]);
    this._next = true;
    this._text.y = this._content.view.height + 2;
}
```

本插件使用PIXI包装，更多方法设置可参考PIXI.Text的相关方法和属性 [PIXI.Text](https://pixijs.download/release/docs/PIXI.Text.html)

