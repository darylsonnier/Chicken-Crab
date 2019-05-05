// sprite width 94.25
// sprite height 89

var viewportHeight;
var viewportWidth;
var elem = document.createElement('canvas');
var msgEl = {};
//constants
var GAME_BORDER = 10;
// global variables
var gameWidth = elem.width;
var gameHeight = elem.height;
var gameLive = true;
var level = 1;
//var lostGame = sessionStorage.getItem('lostGame');
var lostGame = false;
//grab the canvas and context
var canvas = {};
var ctx = {};
var pat = {};
// Chicken animation
var chickenPos = [ 0, 94, 188, 282 ];
var chickenIndex = 0;
//enemies
var enemies = [
  {
    x: .2 * gameWidth, //x coordinate
    xFactor: .2,
    y: 100, //y coordinate
    speedY: 1, //speed in Y
    speedDefault: 1, // default speed for game reset
    w: 40, //width
    h: 40 //height
  },
  {
    x: .3 * gameWidth,
    xFactor: .3,
    y: 100,
    speedY: 2,
    speedDefault: 2,
    w: 40,
    h: 40
  },
  {
    x: .6 * gameWidth,
    xFactor: .6,
    y: 100,
    speedY: 3,
    speedDefault: 3,
    w: 40,
    h: 40
  },
  {
    x: .8 * gameWidth,
    xFactor: .8,
    y: 100,
    speedY: 4,
    speedDefault: 4,
    w: 40,
    h: 40
  }
];
var arrows = [
  {
    // Up arrow
    x: gameWidth - GAME_BORDER - 79,
    xOffset: GAME_BORDER + 79,
    y: gameHeight - 160,
    yOffset: 160,
    w: 30,
    h: 40,
    fill: 'red'
  },
  {
    // Down arrow
    x: gameWidth - GAME_BORDER - 79,
    xOffset: GAME_BORDER + 79,
    y: gameHeight - 72,
    yOffset: 72,
    w: 30,
    h: 40,
    fill: 'green'
  },
  {
    // Left arrow
    x: gameWidth - GAME_BORDER - 128,
    xOffset: GAME_BORDER + 128,
    y: gameHeight - 110,
    yOffset: 110,
    w: 40,
    h: 30,
    fill: 'blue'
  },
  {
    // Right arrow
    x: gameWidth - GAME_BORDER - 40,
    xOffset: GAME_BORDER + 40,
    y: gameHeight - 110,
    yOffset: 110,
    w: 40,
    h: 30,
    fill: 'yellow'
  }
]
// player Object
var player = {
  x: 10,
  y: gameHeight / 2,
  speedX: 0,
  speedY: 0,
  w: 45,
  h: 50,
  isMoving: false
}
// goal
var goal = {
  x: gameWidth - 120,
  y: gameHeight / 2,
  w: 100,
  h: 100
}
//level
var levelMarker = {
x: gameWidth - 130,
y: 0,
w: 40,
h: 52
}
// Sprites
var sprites = {};
//cursor position
var xPos = 0;
var yPos = 0;


// Get Viewport dimensions
if (document.compatMode === 'BackCompat') {
    viewportHeight = document.body.clientHeight;
    viewportWidth = document.body.clientWidth;
} else {
    viewportHeight = document.documentElement.clientHeight;
    viewportWidth = document.documentElement.clientWidth;
}

// Setup Canvas
elem.id = 'myCanvas';
elem.width = viewportWidth;
elem.height = viewportHeight;
document.body.appendChild(elem);
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");


window.addEventListener('load', function(){
  // Directional functions used for mouse clicks, touch screen touches, and arrow keys
  var up = function(){
    player.speedY = -1 * Math.round(0.001 * gameHeight);
    if (player.speedY == 0){
      player.speedY = -1;
    }
    player.isMoving = true;
  }

  var down = function(){
    player.speedY = Math.abs(Math.round(0.001 * gameHeight));
    if (player.speedY == 0){
      player.speedY = 1;
    }
    player.isMoving = true;
  }

  var left = function(){
    player.speedX = -1 * Math.round(0.001 * gameWidth);
    if (player.speedX == 0){
      player.speedX = -1;
    }
    player.isMoving = true;
  }

  var right = function(){
    player.speedX = Math.abs(Math.round(0.001 * gameWidth));
    if (player.speedX == 0){
      player.speedX = 1;
    }
    player.isMoving = true;
  }

  // make the player move
  var movePlayer = function(ev){
    try { xPos = ev.touches[0].clientX; }
    catch (err) { xPos = ev.clientX - canvas.offsetLeft; }
    try { yPos = ev.touches[0].clientY; }
    catch (err) { yPos = ev.clientY - canvas.offsetTop; }
    // Check if arrows are pressed
    switch (checkArrows()){
      case 0:
        up();
        break;
      case 1:
        down();
        break;
      case 2:
        left();
        break;
      case 3:
        right();
        break;
    }
    // Check if arrow keys are pressed
    switch (ev.key) {
      case "+":
        player.x = goal.x;
        break;
      case "ArrowUp":
        up();
        break;
      case "ArrowDown":
        down();
        break;
      case "ArrowLeft":
        left();
        break;
      case "ArrowRight":
        right();
        break;
    }
  }

  var stopPlayer = function(){
    player.isMoving = false;
    player.speedX = 0;
    player.speedY = 0;
    xPos = 0;
    yPos = 0;
  }

  // event listeners to move player
  canvas.addEventListener("mousedown", movePlayer);
  canvas.addEventListener("mouseup", stopPlayer);
  canvas.addEventListener("touchstart", movePlayer);
  canvas.addEventListener("touchend", stopPlayer);
  window.addEventListener("keydown", movePlayer);
  window.addEventListener("keyup", stopPlayer);

  var load = function(){
    sprites.player = new Image();
    sprites.player.src = 'images/chicken.png';
    sprites.background = new Image();
    sprites.background.src = 'images/pavedFloor.png';
    sprites.enemy = new Image();
    sprites.enemy.src = 'images/enemy.png';
    sprites.goal = new Image();
    sprites.goal.src = 'images/henHouse.png';
    sprites.arrows = new Image();
    sprites.arrows.src = 'images/compass rose.png';
    sprites.bonus = new Image();
    sprites.bonus.src = 'images/chest.png';
  }

  function sprite(options){
    var that = {};
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    return that;
  }

  //update logic
  var update = function(){
    // Adjust position according to browser size
    player.RelativeY = player.y / gameHeight;
    gameWidth = elem.width;
    gameHeight = elem.height;
    player.y = Math.round(player.RelativeY * gameHeight);
    goal.y = (gameHeight / 2);// - (goal.h / 2);
    goal.x = gameWidth - GAME_BORDER - goal.w - 30;
    arrows.forEach(function(element,index){
      element.y = gameHeight - element.yOffset;
      element.x = gameWidth - element.xOffset;
    });

    //update the position of the Player
    if (player.isMoving && player.x < gameWidth - player.w - GAME_BORDER && player.x >= GAME_BORDER){
        footStep.play();
        chickenIndex++;
        if (chickenIndex > 3){
          chickenIndex = 0;
      }
      //check if you've won the game
      if(checkCollision(player, goal)) {
        backgroundAudio.pause();
        gameWon.play();
        level++;
        tempAlert('You\'ve reached level ' + level + '!',8000);
        switch (Math.floor(Math.random() * 4)){
          case 0:
            sprites.background.src = 'images/pavedFloor.png';
            break;
          case 1:
            sprites.background.src = 'images/grassFloor.png';
            break;
          case 2:
            sprites.background.src = 'images/grass2Floor.png';
            break;
          case 3:
            sprites.background.src = 'images/stoneFloor.png';
            break;
        }
        switch (Math.floor(Math.random() * 4)){
          case 0:
            backgroundAudio.setAttribute('src', 'sounds/background.mp3');
            break;
          case 1:
            backgroundAudio.setAttribute('src', 'sounds/background2.mp3');
            break;
          case 2:
            backgroundAudio.setAttribute('src', 'sounds/background3.mp3');
            break;
          case 3:
            backgroundAudio.setAttribute('src', 'sounds/background4.mp3');
            break;
        }

        backgroundAudio.play();
        player.x = 10;
        player.isMoving = false;
        enemies.forEach(function(element, index){
        element.speedY += element.speedY/Math.abs(element.speedY);
        })
      }
      player.x += player.speedX;
      player.y += player.speedY;
      if (player.x < GAME_BORDER){
        player.x = GAME_BORDER;
      }
      else if (player.x > gameWidth - GAME_BORDER - player.w)
      {
        player.x = gameWidth - GAME_BORDER - player.w;
      }
      else if (player.y < GAME_BORDER ){
        player.y = GAME_BORDER;
      }
      else if (player.y > gameHeight - GAME_BORDER - player.h){
        player.y = gameHeight - GAME_BORDER - player.h;
      }
    }

    //update the position of each enemy
    enemies.forEach(function(element, index){
      // check for collision with Player
      if (checkCollision(player, element)){
        //stop the game
        gameLive = false;
        backgroundAudio.pause();
        gameOver.play();
        level = 1;
        tempAlert('Game Over',4000);
        player.x = 10;
        player.y = (gameHeight / 2) - (player.h / 2);
        enemies.forEach(function(element,index){
          element.y = 100;
          element.speedY = element.speedDefault;
        });
        gameLive = true;
        backgroundAudio.play();
      }
      // move enemy
      element.x = Math.round(element.xFactor * gameWidth);
      element.y += element.speedY;
      // check enemy position against border
      if (element.y >= gameHeight - element.h - GAME_BORDER){
        element.speedY *= -1;
        element.y = gameHeight - element.h - GAME_BORDER;
      }
      else if (element.y <= GAME_BORDER){
        element.speedY *= -1;
      }
    });

    if (lostGame){
      lostGame = false;
    }
  };

  var chicken = sprite({
    context: ctx,
    width: 94,
    height: 89,
    image: sprites.chicken
  });

  //show the game on the screen
  var draw = function(){
  //reset the canvas to screen size
  if (document.compatMode === 'BackCompat') {
      viewportHeight = document.body.clientHeight;
      viewportWidth = document.body.clientWidth;
  } else {
      viewportHeight = document.documentElement.clientHeight;
      viewportWidth = document.documentElement.clientWidth;
  }
  ctx.canvas.width = viewportWidth;
  ctx.canvas.height = viewportHeight;
  //clear the canvas
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);
  //draw background
  pat = ctx.createPattern(sprites.background, 'repeat');
  ctx.rect(0, 0, viewportWidth, viewportHeight);
  ctx.fillStyle = pat;
  ctx.fill();

  //draw Player
  ctx.drawImage(sprites.player, chickenPos[chickenIndex], 0, 94, 89, player.x, player.y, player.w, player.h);

  //draw the goal
  ctx.drawImage(sprites.goal, goal.x, goal.y, goal.w, goal.h);

  //draw the arrows
  arrows.forEach(function(element,index){
    ctx.fillStyle = element.fill;
    ctx.fillRect(element.x, element.y, element.w, element.h);
  });
  ctx.drawImage(sprites.arrows, gameWidth - GAME_BORDER - 128, arrows[0].y);

  //draw the enemies
  enemies.forEach(function(element, index){
    ctx.drawImage(sprites.enemy, element.x, element.y);
    });
  };

  //gets executed multiple times per second
  var step = function() {
    update();
    draw();
    if(gameLive){
      window.requestAnimationFrame(step);
    };
  };

  // check for Collision
  var checkCollision = function(rect1, rect2){
    var closeOnWidth = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.w, rect2.w);
    var closeOnHeight = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.h, rect2.h);
    return closeOnWidth && closeOnHeight;
  };

  // check arrow click
  var checkArrows = function(){
    var retValue = -1;
    arrows.forEach(function(element,index){
      if (xPos > (element.x) && xPos < (element.x + element.w) && yPos > element.y && yPos < (element.y + element.h)){
        retValue = index;
      };
    });
    return retValue;
  }


//var backgroundAudio = new Audio('sounds/SuperMarioBros.ogg');
var backgroundAudio = document.createElement('audio');
var gameOver = document.createElement('audio');
var gameWon = document.createElement('audio');
var footStep = document.createElement('audio');

backgroundAudio.setAttribute('src', 'sounds/background.mp3');
backgroundAudio.setAttribute('autoplay', 'autoplay');
backgroundAudio.play();

gameOver.setAttribute('src', 'sounds/game_over.mp3');
gameWon.setAttribute('src', 'sounds/goal.mp3');
footStep.setAttribute('src', 'sounds/footstep.mp3');

if (typeof backgroundAudio.loop == 'boolean')
{
  backgroundAudio.loop = true;
}
else
{
  backgroundAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
}

//Init
load();

//initial kick
step();
});

// Create temporary message duration in milliseconds
function tempAlert(msg,duration){
  try{
    msgEl.parentNode.removeChild(msgEl);
  }
  catch(err){
    //console.log(err);
  }
  msgEl = document.createElement("div");
  msgEl.setAttribute("id", "temp");
  //el.setAttribute("style","position:absolute;top:50%;left:40%;background-color:transparent;color:white;font-size:45px;font-style:bolder;");
  msgEl.innerHTML = msg;
  setTimeout(function(){
    try{
      msgEl.parentNode.removeChild(msgEl);
    }
    catch (err){}
  },duration);
  document.body.appendChild(msgEl);
}