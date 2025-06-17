const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = document.querySelector('.score');
class Snake {
  score = 0;
  constructor(){
    this.body = [{x: 10, y: 10}];
    this.direction = {x: 1, y: 0};
    this.speed = 20;
  }

  move(){
    const head = this.body[this.body.length - 1];
    const newX = head.x + this.direction.x * this.speed;
    const newY = head.y + this.direction.y * this.speed;

    this.body.shift(); // remove tail
    this.body.push({x: newX, y: newY}); // add new head
  }

  grow(){
    const tail = this.body[0];
    this.body.unshift({x: tail.x, y: tail.y});
  }

  changeDirection(x, y){
    this.direction.x = x;
    this.direction.y = y;
  }

  checkCollision(food, isGameOver, animationId){
    const head = this.body[this.body.length - 1];
    if (
      head.x < 0 || head.x + 10 > canvas.width ||
      head.y < 0 || head.y + 10 > canvas.height
    ){
      if(!isGameOver){
        cancelAnimationFrame(animationId);
        return true;
      }
    }

    for(let i=0; i<this.body.length-1;i++){
      const segment = this.body[i];

      if (head.x === segment.x && head.y === segment.y) {
        cancelAnimationFrame(animationId);
        return true;
      }
    }
    // collision with food object
    if(head.x === food.x && head.y === food.y){
      this.grow();
      food.generatePosition(this.body);
      this.score++;
      score.textContent = "Score: " + this.score;
    }
    return false;  
  }

  draw(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let segment of this.body) {
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();  
    }
                 
    
  }
}

class Food {
  x;
  y;
  constructor(size, color){
    this.size = size;
    this.color = color;
  }
  generatePosition(snakeBody){
    const offset = 10;
    const maxIndex = (390 - offset) / this.size;

    let isInsideSnake;
    let posX, posY;

    do {
      const randX = Math.floor(Math.random() * (maxIndex + 1));
      const randY = Math.floor(Math.random() * (maxIndex + 1));
      
      posX = randX * this.size + offset;
      posY = randY * this.size + offset;

      isInsideSnake = snakeBody.some(segment => segment.x === posX && segment.y === posY);

    } while (isInsideSnake);

    this.x = posX;
    this.y = posY;
  }


  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = this.color;   
    ctx.fill();                 

  }
}
class Game{
  lastTime = 0;
  speed = 100;
  snake;
  food;
  isGameOver = false;
  animationId;
  constructor(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx
    this.gameLoop = this.gameLoop.bind(this);
    document.addEventListener("keydown", (e) => this.changeDirection(e));
    document.querySelector('.restart-btn').addEventListener('click',() => this.reset());
  }
  start(){
    this.snake = new Snake();
    this.food = new Food(20, "blue");
    this.food.generatePosition(this.snake.body);
    this.snake.score = 0;
    document.querySelector(".score").textContent = "Score: 0";
    this.isGameOver = false;
    this.animationId = requestAnimationFrame(this.gameLoop.bind(this));
  }
  draw(){
    this.snake.draw(this.ctx);
    this.food.draw(this.ctx);
  }
  update(){
    this.draw(this.ctx);
    this.snake.move();
    let isCollided = this.snake.checkCollision(this.food, this.isGameOver, this.animationId);
    if(isCollided){
      this.gameOver();
    }
  }
  gameOver(){
    this.isGameOver = true;
    document.querySelector('.restart-btn').style.display = "block";
    console.log("Game Over");
  }
  reset(){
    document.querySelector('.restart-btn').style.display = "none";
    this.start();
  }
  changeDirection(e){
    switch(e.key){
      case "ArrowUp": 
        this.snake.changeDirection(0,-1);
        break;
      case "ArrowDown": 
        this.snake.changeDirection(0,1);
        break;
      case "ArrowLeft": 
        this.snake.changeDirection(-1,0);
        break;
      case "ArrowRight": 
        this.snake.changeDirection(1,0);
        break;
    }
  }
  gameLoop(timestamp){
    if (timestamp - this.lastTime >= this.speed) {
      this.update();
      this.lastTime = timestamp;
    }

    if (!this.isGameOver) {
      this.animationId = requestAnimationFrame(this.gameLoop);
    }
    
  }
}
document.addEventListener('keydown', function startOnce(e) {
  const game = new Game(canvas, ctx);
  game.start();
  document.removeEventListener('keydown', startOnce); 
  document.querySelector('.press').style.display = "none";
});
