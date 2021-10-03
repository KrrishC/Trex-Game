var trex ,trex_running,trex_collided;
var ground,groundImg;
var invisibleground
var cloud,cloudImg;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var cloudsGroup, obstaclesGroup;
var gamestate = 'play';
var gameOver, gameOverImg
var restart, restartImg
var jumpSound,dieSound,checkpointSound;
var highscore;
function preload(){
  trex_running = loadAnimation('trex1.png','trex3.png','trex4.png');
  trex_collided = loadAnimation('trex_collided.png');
  groundImg = loadImage('ground2.png');
cloudImg =loadImage('cloud.png');
obstacle1 = loadImage('obstacle1.png');
obstacle2 = loadImage ('obstacle2.png');
obstacle3 = loadImage ('obstacle3.png');
obstacle4 = loadImage ('obstacle4.png');
obstacle5 = loadImage ('obstacle5.png');
obstacle6 = loadImage ('obstacle6.png');
gameOverImg = loadImage ('gameOver.png');
restartImg = loadImage ('restart.png');
jumpSound = loadSound ('jump.mp3');
dieSound = loadSound ('die.mp3');
checkpointSound = loadSound ('checkpoint.mp3');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  
  //create a trex sprite
 trex = createSprite (50,height-25,10,10);
 trex.addAnimation('running',trex_running);
 trex.addAnimation('collided', trex_collided);
 trex.scale=0.7;
 
// create a ground sprite
 ground = createSprite(width/2,height-70,width,2);
 ground.addImage(groundImg);
 ground.x = width/2
 ground.velocityX = -(6 + 3*score/100)
// so trex fully touch ground with the help of invisible ground
 invisibleground = createSprite (width/2,height-10,width,125);
 invisibleground.visible = false;

 obstaclesGroup = new Group();
 cloudsGroup = new Group();
 var num = Math.round(random(1,10));

gameOver = createSprite(width/2,height/2- 50);
gameOver.addImage(gameOverImg);
gameOver.scale= 0.9
gameOver.visible = false;


restart = createSprite(width/2, height/2);
restart.addImage(restartImg);
restart.scale = 0.9;
restart.visible = false;

000000000
highscore = 0;

}
// trex touching ground and background
function draw(){
  background("white")
  drawSprites();
  trex.collide(invisibleground);
  
  //create score and make so every 5 frames = 1 point
  textSize(20);
  fill('black');
  text('score: '+score,500,25);
// create high score
textSize(20);
fill('black');
text('Highscore:' +highscore,300,25);

  //Gamestate
  if (gamestate=='play') {
     ground.velocityX = -(6+3*score/100)

     if ((touches.length > 0 || keyDown('SPACE')) && trex.y >= height-120) {
       jumpSound.play();
       trex.velocityY = -10;
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.8
     // highscore

     if (score > highscore){
       highscore  = score;
     }
     //infinite scrolling ground
if(ground.x<0){
  ground.x = ground.width/2;
}
//trex jump
  
if (keyDown('space')&& trex.y>=158){
  trex.velocityY= -15;
  jumpSound.play();
}

//trex gravity 
trex.velocityY = trex.velocityY +1;
//score
score = score+ Math.round(getFrameRate()/60);

if (score % 100 == 0 && score > 0){
  checkpointSound.play();
}
spawnClouds();
  spawnObstacles();

  if (obstaclesGroup.isTouching(trex)){
    gamestate = 'end' 
    dieSound.play();
  }
  
  }
  else if (gamestate=='end') {
ground.velocityX = 0;
cloudsGroup.setVelocityXEach(0);
obstaclesGroup.setVelocityXEach(0);
trex.velocityY = 0;
cloudsGroup.setLifetimeEach (-1);
obstaclesGroup.setLifetimeEach (-1);
gameOver.visible = true;
restart.visible = true;
trex.changeAnimation('collided', trex_collided);
if (touches.length>0 || keyDown ('SPACE')) {
  reset();
  touches = [];
}
if (mousePressedOver(restart)) {
  reset();
 
}

  }


}

function spawnClouds(){
  //frameCount is number of frame per second
  //modulas is used to find remainder
  //making of the cloud on every 60th frame
  if (frameCount % 60 == 0) {

    cloud = createSprite(width, height-300,40,10);
    cloud.addImage(cloudImg);
    cloud.velocityX=-3;
    cloud.scale= 0.9  
    // random cloud height
    cloud.y = random (200,500); 
    //trex on top of the clouds
    cloud.depth = trex.depth
    trex.depth = cloud.depth +1
    // cloud lifetime
    cloud.lifetime = width/3;
    cloudsGroup.add(cloud);
  }
}
//create obstacles 
function spawnObstacles(){
  if (frameCount % 80 == 0){
    obstacle = createSprite(width,height-95,20,30);
    obstacle.velocityX = -(6+3*score/100)
    //random generator
    var num = Math.round(random(1,6));
    switch(num){
      case 1: obstacle.addImage(obstacle1);
      break
      case 2: obstacle.addImage(obstacle2);
      break
      case 3: obstacle.addImage(obstacle3);
      break
      case 4: obstacle.addImage(obstacle4);
      break
      case 5: obstacle.addImage(obstacle5);
      break
      case 6: obstacle.addImage(obstacle6);
      break 
      default: break
    }
    // obstacle size
    obstacle.scale = 0.7;
    //obstacle lifetime
    obstacle.lifetime = width/6;
    obstaclesGroup.add(obstacle);

  }
}
// functioning reset button
function reset() {

  gamestate = 'play';
  gameOver.visible= false;
  restart.visible= false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation('running',trex_running);
  score = 0;

}