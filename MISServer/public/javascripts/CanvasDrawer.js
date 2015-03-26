/**
 * Created by huangzebiao on 15-3-25.
 */

//TODO: Reconstruction
var car = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    img: null,
    containerW: 0,

    init: function(x, y, w, h, ctx, containerW, containerH) {
        car.x = x;
        car.y = y;
        car.width = w;
        car.height = h;

        car.img = new Image();
        car.img.src = '../images/car.png';
        car.containerW = containerW;
        car.containerH = containerH;

        car.initDraw(ctx);

    },

    initDraw: function(ctx) {
        car.img.onload = function(){
            ctx.drawImage(car.img, car.x, car.y, car.width, car.height);
            ctx.drawImage(car.img, car.x + car.containerW / 2, car.y, car.width, car.height);
        }
    },

    aniDraw: function(ctx) {
        ctx.drawImage(car.img, car.x, car.y, car.width, car.height);
        ctx.drawImage(car.img, car.x + car.containerW / 2, car.y, car.width, car.height);
    },
};

var background = {
    x: 0,
    y: 0,
    width: 0,
    height: 5000,
    img: null,
    p1y:0,
    p2y:0,

    init: function(x, y, w, h, ctx, containerW, containerH) {
        background.x = x;
        background.y = y;
        background.width = w;
        background.height = h;

        background.p1y = background.y;
        background.p2y = background.y;

        background.img = new Image();
        background.img.src = '../images/road.jpg';

        background.containerW = containerW;
        background.containerH = containerH;

        background.initDraw(ctx);
    },

    initDraw: function(ctx) {

        background.p1y = background.y;
        background.p2y = background.y;

        background.img.onload = function(){
            ctx.drawImage(background.img, 0, background.y, background.width, background.height);
            ctx.drawImage(background.img, background.width, background.y, background.width, background.height);
        }
    },

    aniDraw: function(ctx, p1c, p2c) {

        if (p1c > 0) {
            background.p1y = background.p1y + 4;
            background.p1y = background.p1y > 0 ? 0 : background.p1y;
        }

        ctx.drawImage(background.img, 0, background.p1y, background.width, background.height);

        if (p2c > 0) {
            background.p2y = background.p2y + 4;
            background.p2y = background.p2y > 0 ? 0 : background.p2y;
        }

        ctx.drawImage(background.img, background.width, background.p2y, background.width, background.height);
    },
};

var CanvasDrawer = {

    container: null,
    player1Click: 0,
    player2Click: 0,
    OnAnimationEnd: null,
    raf: 0,

    init: function() {
        var self = CanvasDrawer;
        self.container = document.getElementById('game-canvas-container');
        console.log('Init Canvas Drawer');

        var windowWidth = $(window).width();
        var widowHeight = $(window).height();
        self.container.width = windowWidth;
        self.container.height = widowHeight;


        background.init(0, widowHeight - 5000, windowWidth/2, 5000, self.container.getContext('2d'), self.container.width, self.container.height);
        car.init(windowWidth / 4 - 45, widowHeight - 189, 91 ,189, self.container.getContext('2d'), self.container.width, self.container.height);
    },

    config: function(p1Click, p2Click, OnAnimationEnd) {
        CanvasDrawer.player1Click = p1Click * 20;
        CanvasDrawer.player2Click = p2Click * 20;
        if (CanvasDrawer.container.getContext) {
            var ctx = CanvasDrawer.container.getContext('2d');
            background.initDraw(ctx);
            car.initDraw(ctx);
        }

        CanvasDrawer.OnAnimationEnd = OnAnimationEnd;
    },

    draw: function() {
        var self = CanvasDrawer;

        if (self.container.getContext) {
            // draw

            //console.log('Canvas Drawer Drew');
            var ctx = self.container.getContext('2d');

            ctx.clearRect(0,0, self.container.width, self.container.height);

            var widowHeight = self.container.height;
            var imgWidth = self.container.width / 2;

            background.aniDraw(ctx, self.player1Click, self.player2Click);
            car.aniDraw(ctx);

            self.player1Click--;
            self.player1Click = self.player1Click <= 0 ? 0 : self.player1Click;
            self.player2Click--;
            self.player2Click = self.player2Click <= 0 ? 0 : self.player2Click;

            self.raf = window.requestAnimationFrame(CanvasDrawer.draw);

            if(self.player1Click == 0 && self.player2Click == 0) {
                self.OnAnimationEnd();
            }


            //var imgHeight = self.container.height;
            //var roadBG = new Image();
            //roadBG.src = '../images/road.jpg';
            //roadBG.onload = function(){
            //    ctx.drawImage(roadBG, 0, widowHeight - 5000, imgWidth, 5000);
            //    ctx.drawImage(roadBG, imgWidth, widowHeight - 5000, imgWidth, 5000);
            //}
        }
    },

    stopDraw: function() {
        //console.log('Test 5');
        var self = CanvasDrawer;

        if(self.raf) {
            window.cancelAnimationFrame(self.raf);
        }

    },
};