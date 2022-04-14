/**
 * @param {Object} x 图像x坐标点
 * @param {Object} y 图像y坐标点
 * @param {Object} w 图像宽度
 * @param {Object} h 图像高度
 */
PIXI.Texture.prototype.clip = function(x,y,w,h){
	let newTexture = this.clone();
	newTexture.frame = new PIXI.Rectangle(x,y,w,h);
	return newTexture;
}

PIXI.Texture.prototype.change = function(x,y,w,h){
	this.frame = new PIXI.Rectangle(x,y,w,h);
}


function Tiled(){
	this.init.apply(this,arguments);
}

Tiled.prototype = Object.create(PIXI.Container.prototype);

Tiled.prototype.constructor = Tiled;

Tiled.prototype.init = function(data){
    PIXI.Container.call(this);
    this.loadTileJSON(data);
}
/**
 * 加载json文件数据
 */
Tiled.prototype.loadTileJSON = function(data){
    Object.assign(this,data);
    this.loadTilesets();
}
/**
 * 加载图集块
 */
Tiled.prototype.loadTilesets = function(){
    this.tilesets.forEach((tileset) => {
        PIXI.Loader.shared.add(tileset.image);
        console.log(tileset.image+"正在加载！")
    });
    PIXI.Loader.shared.load(()=>{
        console.log("加载完毕!")
        this.createTiled();
    });
}

/**
 *  生成图集块副本
 */
Tiled.prototype.getTexture = function(image){
    return PIXI.Loader.shared.resources[image].texture.clone();
}



/**
 * 创建Tiled图层图像
 */
Tiled.prototype.createTiled = function(){
    console.log("开始创建图层！")
    this.layers.forEach((layer)=>{
        this.cretaeNewLayer(layer);
    })
}


/**
 * 通过图块id得到图集对象
 */
Tiled.prototype.getTextureByTileId = function(id){
    let result = -1;
    for (let i = 0; i < this.tilesets.length; i++) {
        const firstgid = this.tilesets[i].firstgid;
        if(id >= firstgid)result = i;
    }
    return result>=0? this.tilesets[result]:null;
}
/**
 * 通过图块id得到该图块处于图集的第几行和第几列
 */
Tiled.prototype.getPosByTileId= function(id){
    let tileset = this.getTextureByTileId(id);
    id = id - tileset.firstgid + 1;
    if(!tileset) return null;
    let colCount = Math.floor(tileset.imagewidth / tileset.tilewidth);
    let rowCount = Math.floor(tileset.imageheight / tileset.tileheight);
    return {
        row : Math.floor((id-1) / colCount),
        col : (id-1) % colCount
    }
}

/**
 * 根据图块id生成图像精灵
 */
Tiled.prototype.createTiledSprite = function(id){
    let tileset = this.getTextureByTileId(id);
    if(!tileset)return null;
    let sprite = new PIXI.Sprite();
    let pos = this.getPosByTileId(id);
    sprite.texture = this.getTexture(tileset.image);
    sprite.texture.change(pos.col*tileset.tilewidth,pos.row*tileset.tileheight,tileset.tilewidth,tileset.tileheight);
    return sprite;
    
}
/**
 * 创建每一层图层
 */
Tiled.prototype.cretaeNewLayer = function(layer){
    const layerContainer = new PIXI.Container();
    Object.assign(layerContainer,layer);
    const data = layer.data;
    for(let i=0; i<data.length; i++){
        if(data[i]){
            let sprite = this.createTiledSprite(data[i]);
            if(sprite){
                sprite.x = (i%this._width) * this.tilewidth;
                sprite.y = (Math.floor(i / this._width)) * this.tileheight;
                layerContainer.addChild(sprite);
            }
        }
    }
    this.addChild(layerContainer);
}


