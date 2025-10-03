const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Defina o tamanho do canvas (pode ser no CSS também)
canvas.width = 800;
canvas.height = 500;

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const gravity = 0.5;

class Player {
  constructor(x, y, color, controls, type) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.color = color;
    this.vx = 0;
    this.vy = 0;
    this.speed = 3;
    this.jumpPower = 10;
    this.onGround = false;
    this.controls = controls;
    this.type = type; // "cat" or "dog"
  }

  update() {
    // Movimento horizontal
    if (keys[this.controls.left]) {
      this.vx = -this.speed;
    } else if (keys[this.controls.right]) {
      this.vx = this.speed;
    } else {
      this.vx = 0;
    }

    // Pulo
    if (keys[this.controls.jump] && this.onGround) {
      this.vy = -this.jumpPower;
      this.onGround = false;
    }

    // Aplicar gravidade
    this.vy += gravity;

    // Atualizar posição
    this.x += this.vx;
    this.y += this.vy;

    // Checar colisão com plataformas
    this.onGround = false;
    for (let p of platforms) {
      if (
        this.x < p.x + p.width &&
        this.x + this.width > p.x &&
        this.y + this.height <= p.y && // Antes da plataforma
        this.y + this.height + this.vy >= p.y // Caindo sobre a plataforma
      ) {
        this.vy = 0;
        this.y = p.y - this.height;
        this.onGround = true;
      }
    }

    // Limitar para dentro do canvas (pode adaptar se quiser)
    if (this.y > canvas.height) {
      this.resetPosition();
    }

    // Limitar movimento horizontal dentro do canvas
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
  }

  resetPosition() {
    this.x = this.type === "cat" ? 100 : 150;
    this.y = 100;
    this.vx = 0;
    this.vy = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // "water" or "fire"
  }

  draw() {
    ctx.fillStyle = this.type === "fire" ? "orange" : "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(player) {
    if (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    ) {
      // Reseta posição se colidir com obstáculo perigoso
      if (
        (this.type === "fire" && player.type === "dog") ||
        (this.type === "water" && player.type === "cat")
      ) {
        player.resetPosition();
      }
    }
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "#888";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const cat = new Player(100, 100, "pink", { left: "a", right: "d", jump: "w" }, "cat");
const dog = new Player(150, 100, "brown", { left: "ArrowLeft", right: "ArrowRight", jump: "ArrowUp" }, "dog");

const platforms = [
  new Platform(0, 460, 800, 40),
  new Platform(200, 350, 100, 20),
  new Platform(400, 300, 100, 20),
  new Platform(600, 250, 100, 20),
];

const obstacles = [
  new Obstacle(300, 460, 100, 20, "fire"),
  new Obstacle(500, 460, 100, 20, "water"),
];

function drawGoal() {
  ctx.fillStyle = "green";
  ctx.fillRect(720, 210, 30, 40);
}

function checkWin() {
  if (
    cat.x > 700 &&
    cat.y < 300 &&
    dog.x > 700 &&
    dog.y < 300
  ) {
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("Vocês venceram!", 300, 200);
    gameRunning = false;
  }
}

let gameRunning = true;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar plataformas
  for (let p of platforms) p.draw();

  // Desenhar obstáculos e checar colisão
  for (let o of obstacles) {
    o.draw();
    o.checkCollision(cat);
    o.checkCollision(dog);
  }

  // Desenhar objetivo
  drawGoal();

  // Checar vitória
  checkWin();

  // Atualizar e desenhar jogadores
  cat.update();
  cat.draw();

  dog.update();
  dog.draw();

  if (gameRunning) requestAnimationFrame(gameLoop);
}

gameLoop();
