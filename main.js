let canvas = document.getElementById('canvas');

class Enemy {
    constructor(pos, speed) {
        this.pos = pos;
        this.size = [50, 50];
        this.speed = speed;
        this.hasWon = false;
        this.pt = window.performance.now();
    }

    draw() {
        let currentSprite = (this.hasWon) ? enemySprite : enemySpriteAngry;
        ctx.drawImage(currentSprite, this.pos[0] - this.size[0] / 2, this.pos[1] - this.size[1] / 2, this.size[0], this.size[1]);
    }

    update() {
        //win if touch mouse
        if (this.touchingMouse()) {
            this.hasWon = true;
        }

        //spawn particle after 100ms
        if (window.performance.now() - this.pt >= 100) {
            this.pt = window.performance.now();
            particles.push(new Particle([this.pos[0], this.pos[1]]));
        }

        //get velocity vector and add it to position
        let velVector = [mousePos[0] - this.pos[0], mousePos[1] - this.pos[1]];
        let angle = Math.atan(velVector[1] / velVector[0]);
        let normalizedVector = [Math.cos(angle), Math.sin(angle)];
        if (velVector[0] < 0) {
            normalizedVector[0] *= -1;
            normalizedVector[1] *= -1;
        }
        this.pos[0] += normalizedVector[0] * this.speed;
        this.pos[1] += normalizedVector[1] * this.speed;
    }

    touchingMouse() {
        let dist = Math.sqrt(Math.pow((mousePos[0] - this.pos[0]), 2) + Math.pow((mousePos[1] - this.pos[1]), 2));
        return dist < this.size[0] / 2; 
    }
}

class Particle {
    constructor(pos) {
        this.pos = pos;
        this.size = 10;
        this.pt = window.performance.now();
    }

    update() {
        //update particle size
        let timeLimit = 5;
        this.size = this.size - ((this.size / timeLimit) * (window.performance.now() - this.pt) / 1000);
        this.size = Math.max(0, this.size);
    }

    draw() {
        ctx.fillStyle = 'rgba(50, 50, 50, 0.2)';
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

//enemy
let enemySprite = new Image();
enemySprite.src = 'enemy.png';
let enemySpriteAngry = new Image();
enemySpriteAngry.src = 'enemy_angry.png';
let enemy = new Enemy([200, 200], 6);

//list of particles
let particles = [];

let mousePos = [0,0];
let points = 0;

let pt = window.performance.now();

//when mouse moves, update mouse position
addEventListener('mousemove', (event) => {
    mousePos[0] = event.clientX;
    mousePos[1] = event.clientY;
});

let ctx = canvas.getContext('2d');

run();
function run() {
    //bg & shadows
    ctx.fillStyle = 'rgb(245,245,245)';
    ctx.fillRect(0, 0, 1000, 1000);
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    
    //particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size < 0.1) {
            //remove particles if they get too small
            particles.splice(i, 1);
        }
    }

    //enemy
    if (!enemy.hasWon){
        enemy.update();
    }
    enemy.draw();
        
    //update points
    if (!enemy.hasWon) {
        addPoints();
    }
    
    //points ui
    ctx.fillStyle = 'rgb(10, 10, 10)';
    ctx.font = '36px sans-serif';
    ctx.fillText('Points: ' + points, 45, 65);

    setTimeout(run, 20);
}

function addPoints() {
    let nowTime = window.performance.now();
    if (nowTime - pt > 1000) {
        points++;
        pt = nowTime;
    }
}