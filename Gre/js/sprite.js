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

/**
 * 瓦片精灵类
 */
function TileSprite(){
	this.init.apply(this,arguments);
}

TileSprite.prototype = Object.create(PIXI.Sprite.prototype);

TileSprite.prototype.constructor = TileSprite;

TileSprite.prototype.init = function(type){
	PIXI.Sprite.call(this);
	this._pd = 16;
	this._isAnimTile = false;
	this._count = 20;
	this._animCount = 2;
	this._curIndex = 0;
	this._posX = 0;
	this._posY = 0;
	this.createTexture(type);
}

TileSprite.prototype.createTexture = function(type){
	switch (type){
		case 1:
			this._posX = 0;
			break;
		case 2:
			this._posX = 1*32;
			break;
		case 3:
			this._posX =12*16;
			this._posY = 21*16;
			this._isAnimTile = true;
			break;
		case 4:
		default:
			this._posX =3*16;
			this._posY = 21*16;
			break;
	}
	this.texture = Loader.resources['tile'].texture.clip(this._posX ,this._posY ,this._pd,this._pd);
}

TileSprite.prototype.update = function(){
	this._count--;
	if(this._isAnimTile&&this._count<0){
		
		this.texture.change(this._posX+this._curIndex*this._pd ,this._posY,this._pd,this._pd);
		this._count = 20;
		this._curIndex++;
		if(this._curIndex>this._animCount)this._curIndex=0;
	}
}
