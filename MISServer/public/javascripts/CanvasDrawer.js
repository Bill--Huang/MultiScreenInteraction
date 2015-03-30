/**
 * Created by huangzebiao on 15-3-25.
 */


//TODO: Reconstruction
var car = {
    x: 0,
    y: 0,
    y1: 0,
    y2: 0,
    width: 0,
    height: 0,
    img: null,
    ramdomNum: 0,

    init: function(x, y, w, h, ctx) {
        car.x = x;
        car.y = y;
        car.y1 = y;
        car.y2 = y;
        car.width = w;
        car.height = h;

        car.img = new Image();
        car.img.src = '../images/car.png';

        car.draw(ctx);

        car.ramdomNum = Math.round(Math.random() * 30);
        car.ramdomNum = car.ramdomNum < 4 ? 4: car.ramdomNum;

    },

    draw: function(ctx) {
        car.img.onload = function(){
            ctx.drawImage(car.img, car.x, car.y, car.width, car.height);
            ctx.drawImage(car.img, car.x + 465, car.y, car.width, car.height);
            //ctx.drawImage(car.img, car.x + car.containerW / 2, car.y, car.width, car.height);
        }
    },

    animate: function(ctx, power1, power2) {



        //ctx.drawImage(car.img, car.x + car.containerW / 2, car.y, car.width, car.height);
        var interval = 7;

        if(power1 == 0 || power2 == 0) {
            // animate
            if(power1 == 0) {
                car.y2 = car.y2 >= (interval * car.ramdomNum) ? (car.y2 - interval) : interval * (car.ramdomNum - 1);
            } else if(power2 == 0) {
                car.y1 = car.y1 >= (interval * car.ramdomNum) ? (car.y1 - interval) : interval * (car.ramdomNum - 1);
            }
        } else {
            // stop road animation, keep static
        }

        ctx.drawImage(car.img, car.x, car.y1, car.width, car.height);
        ctx.drawImage(car.img, car.x + 465, car.y2, car.width, car.height);

        // car is at the random position, stop the car, end animation
        if(car.y1 == interval * (car.ramdomNum - 1)) {
            CanvasDrawer.player1Power = 0;
        } else if(car.y2 == interval * (car.ramdomNum - 1)){
            CanvasDrawer.player2Power = 0;
        }

    },
};

var background = {
    x: 0,
    y: 0,
    width: 0,
    height: 5000,
    img: null,

    init: function(x, y, w, h, ctx) {
        background.x = x;
        background.y = y;
        background.width = w;
        background.height = h;

        background.img = new Image();
        background.img.src = '../images/road2.jpg';

        background.draw(ctx);
    },

    draw: function(ctx) {

        background.img.onload = function(){
            ctx.drawImage(background.img, 0, background.y, background.width, background.height);
        }
    },

    animate: function(ctx, power1, power2) {

        //if (p1c > 0) {
        //    background.p1y = background.p1y + 4;
        //    background.p1y = background.p1y > 0 ? 0 : background.p1y;
        //}
        //
        //ctx.drawImage(background.img, 0, background.p1y, background.width, background.height);
        //
        //if (p2c > 0) {
        //    background.p2y = background.p2y + 4;
        //    background.p2y = background.p2y > 0 ? 0 : background.p2y;
        //}

        if(power1 == 0 || power2 == 0) {
            // stop road animation, keep static

        } else {
            // animate
            background.y += 7;
        }
        ctx.drawImage(background.img, 0, background.y, background.width, background.height);

    },
};

var CanvasDrawer = {

    container: null,
    player1Power: 0,
    player2Power: 0,
    OnAnimationEnd: null,
    raf: 0,
    width: 0,
    height: 0,

    init: function() {
        var self = CanvasDrawer;
        self.container = document.getElementById('game-canvas-container');
        console.log('Init Canvas Drawer');

        self.width = $(window).width() > 1031 ? 1031 : $(window).width();
        self.height = $(window).height();
        self.container.width = self.width;
        self.container.height = self.height;

        var ctx = self.container.getContext('2d');
        ctx.clearRect(0,0, self.container.width, self.container.height);

        background.init(0, self.height - 5000, self.width, 5000, ctx);
        car.init(self.width / 2 - 280, self.height - 189, 91 ,189, ctx);

    },

    config: function(p1Click, p2Click, OnAnimationEnd) {
        CanvasDrawer.player1Power = p1Click * 10;
        CanvasDrawer.player2Power = p2Click * 10;
        //if (CanvasDrawer.container.getContext) {
        //    var ctx = CanvasDrawer.container.getContext('2d');
        //    background.initDraw(ctx);
        //    car.initDraw(ctx);
        //}

        CanvasDrawer.OnAnimationEnd = OnAnimationEnd;
    },

    draw: function() {
        var self = CanvasDrawer;

        if (self.container.getContext) {
            if(self.player1Power == 0 && self.player2Power == 0) {

            } else {
                var ctx = self.container.getContext('2d');
                ctx.clearRect(0, 0, self.container.width, self.container.height);

                self.drawElement(ctx);
                self.raf = window.requestAnimationFrame(CanvasDrawer.draw);
            }
        }
    },

    drawElement: function(ctx) {
        var self = CanvasDrawer;
        var interval = 1;
        self.player1Power = self.player1Power >= interval ? (self.player1Power - interval) : 0;
        self.player2Power = self.player2Power >= interval ? (self.player2Power - interval) : 0;

        background.animate(ctx, self.player1Power, self.player1Power);
        car.animate(ctx, self.player1Power, self.player1Power);

        if(self.player1Power == 0 && self.player2Power == 0) {
            console.log('Animation End');
            if (self.OnAnimationEnd != null) {
                self.OnAnimationEnd();
                self.stopDraw();
            }
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