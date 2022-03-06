var live2d
/**
 * 读取配置文件
 */
loadJSONData('live2d.json').then((res) => {
    window.live2data = res;
    live2d = new Live2DModel(0);
    live2d.setMessageWindow(document.getElementById("message"))
})



function Live2DModel(id) {
    this.init.call(this, id);
}

Live2DModel.prototype.init = function (id) {
    this.assets("model");
    this.setId(id);
}

/**
 * 根据id索引号获取配置文件的数据
 */
Live2DModel.prototype.getData = function () {
    this._data = window.live2data[this._id];
    this._name = this._data.name;
    this._skin = 0;
    this.getSkinName();
}
/**
 * 设置模型文件夹对应的url前缀
 */
Live2DModel.prototype.assets = function (url) {
    this._assets = url;
}
/**
 * 读取材质的方式
 */
Live2DModel.prototype.getSkinName = function(){
    //子文件形式读取
    if(this._data.children && this._data.filename){
        this._skinName = this._data.children[this._skin] +"/"+ this._data.filename;
        this._skinCount = this._data.children.length;
    }
    //材质文件夹分类读取
    else{
        this._skinName = this._data.textures[this._skin];
        this._skinCount = this._data.textures.length;
    }
}

/**
 * 切换角色
 */
Live2DModel.prototype.setId = function (id) {
    this._id = id;
    this.getData();
    this.loadmodel();
}
/**
 * 获取角色的json配置文件路径
 */
Live2DModel.prototype.getFileUrl = function () {
    return `${this._assets}/${this._name}/${this._skinName}`;
}
/**
 * 加载live2d
 */
Live2DModel.prototype.loadmodel = function () {
    loadlive2d('live2d', this.getFileUrl());
}
/**
 * 切换到下一个皮肤
 */
Live2DModel.prototype.changeNextSkin = function () {
    this._skin++;
    this._skin = (this._skin % this._skinCount);
    this.getSkinName();
    this.loadmodel();
}
/**
 * 随机皮肤
 */
Live2DModel.prototype.randomSkin = function () {
    this._skin += Math.ceil(Math.random() * (this._skinCount - 1));
    this._skin = this._skin % this._skinCount;
    this.getSkinName();
    this.loadmodel();
}
/**
 * 切换到下一个角色
 */
Live2DModel.prototype.nextId = function () {
    this._id++;
    this._id = (this._id % window.live2data.length);
    this.setId(this._id);
}
/**
 * 切换随机角色
 */
Live2DModel.prototype.randomId = function () {
    this._id += Math.ceil(Math.random() * (window.live2data.length - 1));
    this.setId(this._id % window.live2data.length);
}
/**
 * 设置文本显示窗口
 */
Live2DModel.prototype.setMessageWindow = function (dom) {
    if (dom instanceof HTMLDivElement) {
        this._messageWindow = dom;
    }
    else {
        this._messageWindow = null
    }
}
/**
 * 展示文本窗口
 */
Live2DModel.prototype.showMessage = function (html, timeout) {
    if (this._messageWindow) {
        this._messageWindow.innerHTML = html;
        this._messageWindow.style.visibility = "visible";
        this.closeWindow(timeout);
    }
}
/**
 * 关闭窗口
 */
Live2DModel.prototype.closeWindow = function (timeout) {
    if (this._messageWindow && !this._displaying) {
        this._displaying = setTimeout(() => {
            this._messageWindow.style.visibility = "hidden";
            this._displaying = null;
        }, timeout || 3000);
    }
}


/**
 * 加载json文件
 * @param {*} url json文件路径
 */
function loadJSONData(url) {
    return new Promise((res, rej) => {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest();
        }
        else {
            // IE6, IE5 浏览器执行代码
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = JSON.parse(this.responseText);
                res(data);
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
