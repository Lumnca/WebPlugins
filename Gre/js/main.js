function Gravity(){
	this.init.apply(this,arguments);
}

Gravity.prototype = Object.create(PIXI.Graphics.prototype);

Gravity.prototype.constructor = Gravity;

Gravity.prototype.init = function(node){
	PIXI.Graphics.call(this);
	this.initGravityData();
	this.setContainer(node);
	
}

Gravity.prototype.initGravityData = function(){
	this._g = 0.1;//重力因子
	this._v = 1;//速度
	this._f = false;
	this._keyDown = false;
}

Gravity.prototype.setContainer = function(node){
	if(node){
		this._height = node.height;
		this._width = node.width;
	}
	else{
		this._height = 0;
		this._width = 0;
	}
}

Gravity.prototype.update = function(){
	this.gravity();
	if(this._keyDown)this.move();
}

Gravity.prototype.move = function(){
	this.x+=this._dir;
}

Gravity.prototype.gravity = function(){
	
	if(!this._f){
		this._v +=  this._g;
		this.y += this._v;
		if(this.y>this._height-this.height){
			this.y = this._height-this.height;
			this._v = 0;
			this._f = true;	
		}
	}

}

Gravity.prototype.jump = function(v){
	if(this._f){
		this._v = v;
		this._f = false;
	}
}

const Loader = PIXI.Loader.shared;

const app = new PIXI.Application({ backgroundColor:  0x4c4c4c, width: 960, height: 640 });
//添加到需要显示的dom中
document.body.appendChild(app.view);

Loader.add('tile','images/tile.png');
Loader.add('map1','images/map1.png');
Loader.load((res)=>{
	app.stage.addChild(new PIXI.Sprite(Loader.resources['map1'].texture) );
})

/**
 * 	for (let i = 0; i < map1.length; i++) {
		let line = map1[i];
		for (let j = 0; j < line.length; j++) {
			if(map1[i][j]>-1){
				let tile = new TileSprite(map1[i][j]);
				tile.x = j*16;
				tile.y = i*16;
				app.stage.addChild(tile);
			}
		}
	}
 * const obj = new Gravity(app.view);
	obj.beginFill(0xffffff);
	obj.drawRect(0,0,50,50);
	obj.endFill();
	app.stage.addChild(obj)
 */

window.addEventListener('keydown',(e)=>{
	if(e.code==='ArrowRight'){
		obj._dir = 1;
		obj._keyDown = true;	
	}
	else if(e.code==='ArrowLeft'){
		obj._dir = -1;
		obj._keyDown = true;
	}
	else if(e.code==='ArrowUp'){
		obj.jump(-5);
	}
	
});

window.addEventListener('keyup',(e)=>{
	if(e.code==='ArrowRight'){
		obj._keyDown = false;	
	}
	else if(e.code==='ArrowLeft'){
		obj._keyDown = false;
	}
	
});


































app.ticker.add(()=>{
	update(app.stage);
})

function update(node){
	if(node.update)node.update();
	if(node.children){
		node.children.forEach((n)=>{
			update(n);
		})
	}
}




























