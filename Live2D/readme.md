### live2D 插件

本插件只需要Web环境即可，不需要其他环境支持！而且全部采用js语法，不需要再引入其他js框架语言。

### 使用

首先下载live2d的css样式与js文件，并在对应界面加载他们

在你需要显示页面上添加一个canvas元素如`index.html`中的。为其指定长宽

id唯一标识为`live2d`

```html
   <canvas id="live2d" width="400" height="900"></canvas>
```

然后使用`  loadlive2d('live2d', 'xxx\xxx\xxx.json';`指定对应live2d的模型配置json文件即可（这里需要有web环境，建议你使用VS Code的Live Server来测试，当然已经部署了web环境的可忽略）

这样就完成了一个最简单的live2d输出显示的功能。下面我们对其包装和如何修改介绍:

在本示例文件中model文件夹存放了所有模型的配置以及模型文件，接下来我们一一对其介绍。


在`init.js`文件中我使用了一个构造类Live2DModel其只需要传入一个id作为构造值。这个id是live2d.json的数组对应索引号.`live2d.json`是对model文件夹各种人物皮肤材质的显示配置文件。如在`live2d.json`第一个元素是

```js
    {
        "name": "bilibili-live/22",
        "textures": [
            "index.json",
            "c1.json",
            "c2.json",
            "c3.json",
            "c4.json",
            "c5.json"
        ]
    },
```

`name`代表了角色名称的路径索引即该角色材质模型的父路径为`bilibili-live/22`配合构造函数类中的`assets，getFileUrl `方法 :

```js
Live2DModel.prototype.init = function (id) {
    this.assets("model");
    this.setId(id);
}

Live2DModel.prototype.assets = function (url) {
    this._assets = url;
}

Live2DModel.prototype.getFileUrl = function () {
    return `${this._assets}/${this._name}/${this._skinName}`;
}
```

指定了父路径为 `model/bilibili-live/22` 这样我们就可以改变最后一个参数`this._skinName`来让其指到对应的json文件。之所以这里有多个配置文件，是由于该角色模型材质有多种。打开任意一个json文件可看见其`textures`
属性就是指向对应路径下的材质图片:

```js
"textures":[
        "texture_00/closet-default-v2.png",
        "texture_01/default-upper.png",
        "texture_02/default-lower.png",
        "texture_03/default-hat.png"
    ],
```

所以我们只需要修改`textures`里的内容就可以让其使用不同的材质（注意不是每个材质可以排列组合任意搭配使用，一定要是一套的，否则会出现图像混杂）

指定了多套材质后就可以调用`changeNextSkin,randomSkin`切换皮肤材质

```js
Live2DModel.prototype.changeNextSkin = function () {
    this._skin++;
    this._skin = (this._skin % this._skinCount);
    this.getSkinName();
    this.loadmodel();
}

Live2DModel.prototype.randomSkin = function () {
    this._skin += Math.ceil(Math.random() * (this._skinCount - 1));
    this._skin = this._skin % this._skinCount;
    this.getSkinName();
    this.loadmodel();
}
```

除了这种有多个textures文件夹的角色材质来切换皮肤之外，还可以采用子文件夹套用模式来达到切换材质如`live2d.json`的第三个元素

```js
 {
        "name": "HyperdimensionNeptunia",
        "children": [
            "blanc_classic",
            "blanc_normal",
            "blanc_swimwear",
            "histoirenohover",
            "histoire"
        ],
        "filename": "index.json"
    },
```

在 `model\HyperdimensionNeptunia` 文件夹下每一个文件夹对应该角色的一个皮肤材质。所以 `children` 数组属性代表了每个文件夹的名称，`filename` 是每个文件夹使用的统一名称的json配置文件。

`init.js` 中提供的方法仅支持这两种模型文件读取方法，当然可以自行添加其他类型读取方式。

### API

参考`init.js`注释，可自行添加修改方法。


