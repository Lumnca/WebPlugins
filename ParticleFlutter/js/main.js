//==========================================================================================
//WeatherSprite精灵类
//==========================================================================================
function WeatherSprite() {
    this.init.apply(this, arguments);
}
WeatherSprite.prototype = Object.create(PIXI.Sprite.prototype);
WeatherSprite.prototype.constructor = WeatherSprite;
//初试化
WeatherSprite.prototype.init = function (url, width) {
    const texture = PIXI.Texture.from(url);
    PIXI.Sprite.call(this, texture);
    this.anchor.set(0.5);
    //粒子所在容器的宽度
    this._boxWidth = width || 1000;
    this.reflsh();
}
//重置粒子对象
WeatherSprite.prototype.reflsh = function () {
    this._count = 0;
    this.x = Math.random() * this._boxWidth - 500;
    this.y = Math.random() * -500;
    this.alpha = Math.random() * 100 + 155;
}

WeatherSprite.prototype.update = function () {
    this._count++
    //x,y移动方式
    this.x += Math.log(this._count + 5);
    this.y += Math.log(this._count);
    //旋转速度
    this.rotation += 0.04;
    //透明度衰减
    this.alpha -= 1;
    if (this.alpha <= 0) {
        this.reflsh();
    }
}
//======================================================================================
//自定义透明背景高宽
const app = new PIXI.Application({ transparent: true, width: 1920, height: 960 });
document.getElementById('screen').appendChild(app.view);

const urls = ["img/Leaf_03A.png", "img/Leaf_03B.png", "img/Leaf_03C.png", "img/Star_02A.png"]
const u = urls[Math.floor(Math.random() * 4)];
//创建容器
const container = new PIXI.Container();
app.stage.addChild(container);

const spriets = [];

//显示100个
for (let i = 0; i < 100; i++) {
    //u为粒子图片路径，app.view.width为容器宽度即上面的1920
    let s = new WeatherSprite(u, app.view.width);
    spriets.push(s)
    container.addChild(s);
}


app.ticker.add(() => {
    //更新每一个精灵
    spriets.forEach((spriet) => {
        spriet.update();
    });
});






