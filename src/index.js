const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function randomInteger(max) {
    return Math.floor(Math.random() * (max + 1));
}

function randomRgbColor() {
    let r = randomInteger(255);
    let g = randomInteger(255);
    let b = randomInteger(255);
    return [r, g, b];
}

function randomHexColor() {
    let [r, g, b] = randomRgbColor();
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

class Square {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isHovered = false;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.isHovered) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    isClicked(mx, my) {
        return mx >= this.x && mx <= this.x + this.width && my >= this.y && my <= this.y + this.height;
    }

    changeColor() {
        this.color = randomHexColor();
        this.draw();
    }

    isHoveredOver(mx, my) {
        return this.isClicked(mx, my);
    }
}

const squares = [];

function generateSquares() {
    for (let i = 0; i < 100; i++) {
        let x = randomInteger(canvas.width - 50);
        let y = randomInteger(canvas.height - 50);
        let color = randomHexColor();
        let square = new Square(x, y, 50, 50, color);
        squares.push(square);
        square.draw();
    }
}

generateSquares();

canvas.addEventListener("click", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let square of squares) {
        if (square.isClicked(mouseX, mouseY)) {
            square.changeColor();
        }
    }
});

canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let redraw = false;
    for (let square of squares) {
        let wasHovered = square.isHovered;
        square.isHovered = square.isHoveredOver(mouseX, mouseY);
        if (wasHovered !== square.isHovered) {
            redraw = true;
        }
    }

    if (redraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let square of squares) {
            square.draw();
        }
    }
});

class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velX = 0;
        this.velY = 0;
        this.speed = 1;
        this.friction = 0.98;
        this.keys = {};
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.keys["ArrowUp"]) {
            this.velY -= this.speed;
        }
        if (this.keys["ArrowDown"]) {
            this.velY += this.speed;
        }
        if (this.keys["ArrowLeft"]) {
            this.velX -= this.speed;
        }
        if (this.keys["ArrowRight"]) {
            this.velX += this.speed;
        }

        this.velX *= this.friction;
        this.velY *= this.friction;

        this.x += this.velX;
        this.y += this.velY;

        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
    }
}

const player = new Player(50, 50, 30, 30, "blue");

document.addEventListener("keydown", (event) => {
    player.keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    player.keys[event.key] = false;
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let square of squares) {
        square.draw();
    }
    player.update();
    player.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();