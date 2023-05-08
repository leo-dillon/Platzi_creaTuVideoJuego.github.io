const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#vidas');
const spanTime = document.querySelector('#tiempo');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#resultado');

const content_start = document.querySelector('.content_menu')
const text_start = document.querySelector('.content_menu__menu')
const text_reStart = document.querySelector(".content_menu_reset")
const win = document.querySelector(".Win")
const Lose = document.querySelector(".Lose")
const start = document.querySelector('#start')
const reStart = document.querySelector('#reStart')

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemyPositions = [];

start.addEventListener('click',()=>{
      content_start.classList.add("block")
      text_start.classList.add("block")
      setCanvasSize()
})
reStart.addEventListener('click', ()=>{
      content_start.classList.toggle("block")
      text_reStart.classList.toggle("block")
      win.classList.remove("block")
      Lose.classList.remove("block")
      level = 0
      lives = 3;
      timeStart = 0
      timeInterval = setInterval(showTime, 100);
      setCanvasSize()
})
window.addEventListener('resize', setCanvasSize);

function fixNumber(n) {
  return Number(n.toFixed(2));
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }
  
  canvasSize = Number(canvasSize.toFixed(0));
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }
  
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));

  showLives();
  
  enemyPositions = [];
  game.clearRect(0,0,canvasSize, canvasSize);

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      
      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  
  if (giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });
  
  if (enemyCollision) {
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
  level++;
  startGame();
}

function levelFail() {
  lives--;
  
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
      content_start.classList.toggle("block")
      text_reStart.classList.toggle("block")

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      win.classList.toggle('block')
      pResult.innerHTML = 'SUPERASTE EL RECORD :)';
    } else {
      win.classList.toggle('block')
      pResult.innerHTML = 'lo siento, no superaste el records :(';
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    Lose.classList.toggle('block')
    pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo :)';
  }

}

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART']); // [1,2,3]
  
  spanLives.innerHTML = "";
  heartsArray.forEach(heart => spanLives.append(heart));
}

function showTime() {

  spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);


function moveByKeys(e){
      switch(e.key){
            case ('w'):
            case (  'ArrowUp'):
                  if( (parseInt(playerPosition.y))>= elementsSize){
                        moveUp()
                  }
                  break;
            case ('d'):
            case ('ArrowRight'):
                  if((playerPosition.x + elementsSize)<canvasSize ){
                        moveRight()
                  }
                  break;
            case ('s'):
            case ('ArrowDown'):
                  if((playerPosition.y + elementsSize)<canvasSize ){
                        moveDown()
                  }
                  break;
            case ('a'):
            case ('ArrowLeft'):
                  if(playerPosition.x>elementsSize){
                        moveLeft()
                  }
                  break;
      }
}
function moveUp() {

  if ((playerPosition.y - elementsSize) < elementsSize) {
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {

  if ((playerPosition.x - elementsSize) < elementsSize) {
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {

  if ((playerPosition.x + elementsSize) > canvasSize) {
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  
  if ((playerPosition.y + elementsSize) > canvasSize) {
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}