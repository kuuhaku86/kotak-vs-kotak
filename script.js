var myGamePiece;
var myObstacles = [];
var myScore;
var countScore = 0;

function startGame() {
    myGamePiece = new component(75, 75, "blue", 720/2, 480-75);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.canvas.classList.add('md-12');
        this.canvas.classList.add('xs-12');
        this.canvas.classList.add('sm-12');
        this.canvas.classList.add('mr-auto');
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.counted;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function() {
        if((this.x > 0 && this.speedX < 0) || (this.x < 720 - 75 && this.speedX > 0))this.x += this.speedX;
        if(this.speedX > 0)this.speedX -=1;
        if(this.speedX < 0)this.speedX +=1;
        this.y += this.speedY;
        this.hitBottom();
    }

    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))crash = false;
        return crash;
    }
}

function updateGameArea() {
    let x;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = Math.random()*720;
        myObstacles.push(new component(75, 200*Math.random()+75, "yellow", x, -275));
        myObstacles[i].counted = false;
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 2;
        myObstacles[i].update();
        if(myObstacles[i].y >= (480+myObstacles[i].height/2) && (!myObstacles[i].counted)){
            countScore++;
            myObstacles[i].counted = true;
        }
    }   
    myScore.text="YOUR SCORE : " + countScore;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0)return true;
    return false;
}

document.body.addEventListener("keyup", function(e) {
    myGamePiece.speedX = 0;
});

function clicked(button) {
    if(button == 'right') myGamePiece.speedX += 5;
    else myGamePiece.speedX += -5;
}