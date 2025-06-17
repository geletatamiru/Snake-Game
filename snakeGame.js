const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let animationId;
let isGameOver = false;
class Snake {
  constructor(){
    this.body = [{x: 0, y: 0}];
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

  checkCollision(){
    const head = this.body[this.body.length - 1];
    if (
      head.x < 0 || head.x + 20 > canvas.width ||
      head.y < 0 || head.y + 20 > canvas.height
    ){
      if(!isGameOver){
        isGameOver = true;
        this.reset();
        cancelAnimationFrame(animationId);
        console.log('Game Over');
      }
    }

    for(let i=0; i<this.body.length-1;i++){
    const segment = this.body[i];

      if (head.x === segment.x && head.y === segment.y) {
        isGameOver = true;
        cancelAnimationFrame(animationId);
        console.log('Game Over (Self Collision)');
        return;
      }
    }
      
  }
  reset(){
    this.body = [{x:20, y:20}];
  }
  draw(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    for (let segment of this.body) {
      ctx.fillRect(segment.x, segment.y, 20, 20);
    }
  }
}

class Food {
  constructor(x, y, size, color){
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }
  generatePosition(snakeBody){
    const gridSize = 20;
    const maxIndex = 380 / gridSize;
   
    let isInideSnake;
    let posX;
    let posY;
    do {
      posX = Math.floor(Math.random()*(maxIndex+1))*gridSize;
      posY = Math.floor(Math.random()*(maxIndex+1))* gridSize;

      isInideSnake = snakeBody.some(segment => segment.x === posX && segment.y === posY);

    } while (isInideSnake);
    this.x = posX;
    this.y = posY;
  }

  draw(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
const snake = new Snake();
const food = new Food(20, 40, 20, "blue");

document.addEventListener('keydown', (e) => {
  switch(e.key){
    case "ArrowUp": 
      snake.changeDirection(0,-1);
      snake.grow();
      food.generatePosition(snake.body);
      break;
    case "ArrowDown": 
      snake.changeDirection(0,1);
      snake.grow();
      break;
    case "ArrowLeft": 
      snake.changeDirection(-1,0);
      snake.grow();
      break;
    case "ArrowRight": 
      snake.changeDirection(1,0);
      snake.grow();
      break;
  }
})

let lastTime = 0;
const speed = 100; // milliseconds per frame (e.g. 100ms = 10fps)

function gameLoop(timestamp) {
  if (timestamp - lastTime >= speed) {
    snake.draw(ctx);
    snake.move();
    food.draw(ctx);
    snake.checkCollision();
    lastTime = timestamp;
  }

  if (!isGameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}
requestAnimationFrame(gameLoop);