
    function Button() {
        this.init.apply(this, arguments);
    }

    Button.prototype = Object.create(PIXI.Sprite.prototype);
    Button.prototype.constructor = Button;

    Button.prototype.init = function (texture) {
        PIXI.Sprite.call(this, texture);
        this.interactive = true;
        this.buttonMode = true;
        this.anchor.set(0.5);
        //点击时候的图片
        this._clickFrame = null;
        this._orginFrame = texture || new PIXI.Texture();
        this.texture = texture || new PIXI.Texture();
        this._isClick = false;
        //启用点击按钮按钮会变大
        this._clickDisabled = true;
    }

    Button.prototype.setClickFrame = function (url) {
        if (url instanceof String) {
            this._clickFrame = PIXI.Texture.from(url);
        }
        else {
            this._clickFrame = url;
        }
    }

    Button.prototype.mousedown = function () {
        this.texture = this._clickFrame;
        this._isClick = true;
        this.buttonSizeChange();
    }

    Button.prototype.mouseup = function () {
        this.texture = this._orginFrame;
        this._isClick = false;
        this.buttonSizeChange();
    }

    Button.prototype.buttonSizeChange = function () {
        if (this._isClick && this._clickDisabled) {
            this.scale.set(1.2);
        }
        else {
            this.scale.set(1);
        }
    }

    function keywordInit(dom) {
        //构建显示区域
        const app = new PIXI.Application({ transparent: true, width: 1920, height: 960 });
        //添加到需要显示的dom中
        dom.appendChild(app.view);
        const loader = PIXI.Loader.shared; //资源加载器

        const buttons = {};
        let mouse = null;
        //鼠标容器盒子
        const mouseTable = new PIXI.Container();
        mouseTable._boxWidth = 300;
        mouseTable._boxHeight = 160;
        mouseTable.x = 200;
        app.stage.addChild(mouseTable);
        // 加载资源
        loader.add('keyword', 'img/键盘.png');
        loader.add('m', 'img/mouse.png');
        loader.add('m1', 'img/mouse1.png');
        loader.add('m2', 'img/mouse2.png');
        loader.add('keys', 'keyword.json');
        loader.load((loader, resources) => {
            //键盘配置JSON文件数据
            let data = resources.keys.data;

            for (let i = 0; i < data.length; i++) {
                let t = resources.keyword.texture.setFrame(data[i].x * 32, data[i].y * 32, data[i].width, data[i].height)
                let b = new Button(t);
                //设置点击时候的图片
                b.setClickFrame(resources.keyword.texture.setFrame(data[i].x * 32, (data[i].y + 1) * 32, data[i].width, data[i].height))
                b.x = data[i].px;
                b.y = data[i].py;
                app.stage.addChild(b);
                buttons[data[i].name] = b;
            }


            mouse = new PIXI.Sprite(resources.m.texture);
            buttons["m"] = resources.m.texture;
            buttons["m1"] = resources.m1.texture;
            buttons["m2"] = resources.m2.texture;
            //鼠标移动事件
            window.addEventListener('mousemove', function (e) {
                let x = e.clientX / document.body.clientWidth;
                let y = e.clientY / document.body.clientHeight;
                mouse.x = mouseTable.x + x * mouseTable._boxWidth;
                mouse.y = mouseTable.y + y * mouseTable._boxHeight;
            })
            //鼠标垫
            var t = new PIXI.Graphics();
            t.beginFill(0xeeeeee);
            t.drawRect(0, 0, mouseTable._boxWidth, mouseTable._boxHeight)
            t.endFill();
            t.x = mouseTable.x;
            mouseTable.addChild(t);
            mouseTable.addChild(mouse);
        });


        PIXI.Texture.prototype.setFrame = function (x, y, w, h) {
            let newFrame = this.clone();
            newFrame.frame = new PIXI.Rectangle(x, y, w, h);
            return newFrame;
        }

        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            console.log(e);
            let name = e.key.toLocaleLowerCase();
            if (buttons[name]) {
                buttons[name].mousedown();
            }
        })
        window.addEventListener('keyup', function (e) {
            let name = e.key.toLocaleLowerCase();
            if (buttons[name]) {
                buttons[name].mouseup();
            }
        })

        window.addEventListener('mousedown', function (e) {
            if (e.button === 0) {
                mouse.texture = buttons["m2"];
            }
            else if (e.button === 2) {
                mouse.texture = buttons["m1"];
            }
        })
        window.addEventListener('mouseup', function (e) {
            mouse.texture = buttons["m"];
        })

    }

