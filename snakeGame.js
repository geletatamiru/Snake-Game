const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let animationId;
let isGameOver = false;
class Snake {
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

  checkCollision(){
    const head = this.body[this.body.length - 1];
    if (
      head.x < 0 || head.x + 10 > canvas.width ||
      head.y < 0 || head.y + 10 > canvas.height
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
    
    for (let segment of this.body) {
      ctx.beginPath();
      ctx.arc(segment.x, segment.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();  
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
const snake = new Snake();
const food = new Food(30, 30, 20, "blue");

document.addEventListener('keydown', (e) => {
  switch(e.key){
    case "ArrowUp": 
      snake.changeDirection(0,-1);
      food.generatePosition(snake.body);
      snake.grow();
      break;
    case "ArrowDown": 
      snake.changeDirection(0,1);
      snake.grow();
      break;
    case "ArrowLeft": 
      snake.changeDirection(-1,0);
      break;
    case "ArrowRight": 
      snake.changeDirection(1,0);
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