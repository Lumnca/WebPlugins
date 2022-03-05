function TextSlide(){
    this.initialize.apply(this,arguments);
}

TextSlide.prototype.initialize = function(dom,width,height,bg){
    this._speedX = 1;
    this._speedY = 1;
    this._delta = 300;
    this._time = this._delta;
    this._messages = [];
    this._index = 0;
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

TextSlide.prototype.createText = function(){
    this._text = new PIXI.Text();
    this._content.stage.addChild(this._text)
}

TextSlide.prototype.createPixi = function(dom,w,h,bg){
    this._content = new PIXI.Application({ width: w || 100, height: h || 100, backgroundColor: bg || 0xFFFFFF, resolution: window.devicePixelRatio || 1 });
    dom.appendChild(this._content.view);
   
}

TextSlide.prototype.createTicker = function(){
    this._content.ticker.add((delta) => {
        if(this.update){
            this.update();
        }
    });
}

TextSlide.prototype.addText = function(txt){
    this._messages.push(txt);
    this.setText(txt);
}

TextSlide.prototype.setMssages = function(args){
    if(Array.isArray(args)){
        this._messages = args;
        this.setText(args[0]);
    }
}

TextSlide.prototype.setText = function(txt){
    this._text.text = txt;
    this._textWidth = this.measureTextWidth();
}

TextSlide.prototype.setFontSize = function(size){
    this._text.style.fontSize = size || 18;
}

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
 */
TextSlide.prototype.stroke = function(color,border){
    this._text.style.stroke = color;
    this._text.style.strokeThickness = border || 1;
}
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
 * 计算字符串宽度
 */
TextSlide.prototype.measureTextWidth = function(){
    let c = document.createElement('canvas');
    let cx = c.getContext('2d');
    cx.font = this._text.style.fontSize + "px " + this._text.style.fontFamily
    return cx.measureText(this._text.text).width;
}

TextSlide.prototype.showNextMessage = function(){
    this._index ++;
    this._index = this._index >= this._messages.length?  0 : this._index;
    this.setText(this._messages[this._index]);
    this._next = true;
    this._text.y = this._content.view.height + 2;
}


TextSlide.prototype.update = function(){
    
    if(this._messages.length>0){
        this._time--;
        if(this._time <0){
            this._time = this._delta;
            this._moveing = true;
        }
        if(this._moveing){
            this._text.x = 0;
            this._text.y-=this._speedY;
            if(this._text.y < 0-this._content.view.height ){
                this.showNextMessage();
            }
            if( this._next && this._text.y <(this._content.view.height - this._text.style.fontSize)/2){
                this._next = false;
                this._moveing = false;
            }
        }
        else{
            if( this._textWidth > this._content.view.width || this._text.x >   this._textWidth){
                this._text.x -= this._speedX;
            }
            if(this._text.x < 0 -  this._textWidth){
                this._text.x =  this._content.view.width + 2;
            }
        }
        
    }
   
}
