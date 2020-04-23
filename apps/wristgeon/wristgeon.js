Bangle.setLCDMode("doublebuffered");

const fps = 24;
const W = g.getWidth();
const H = g.getHeight();
const topBarOffset = 10;
const heart = require("heatshrink").decompress(atob("hkLyAHEmEAoEAlAJEAoIJBBoIAFkEA2Mk5MD1MkCIIBB2NFBIVDEYYVB1NF9Gi/FB9Fi7Gj8GD9Fh8GC5Hj1NmDINYgHQ4f4gP4kIBCkH4oHwsHI4X+zW48gVBC4WC/EiDIVC/EADIPgwO5sn+7fBw4VBMoOw8f4sQvD+Fh+FA9GB/04K4OZw57DnAxB0XwFYNBC4IDBGIJhB3NFOYIAFpEA5Hi+GBL4QBBgHY0QNBABI3B4HhCoVBQYI9BABq7B4MC4HkCp4ADjABCABIA="));

const player = require("heatshrink").decompress(atob("iEQyBC/AH4AstNFAIOBAYQdVDINRDYQDDBIIXL2uWAIYTBD4YhHAYIVFDo4fDDoYhHBoIXHH5IXDEI4fHPpYBDP44FBT6olFT5oA/AHo"));

const doorOffsets = [
  [W/2-10, 0+topBarOffset, W/2+10, 5+topBarOffset],
  [W, H/2-10, W-5, H/2+10],
  [W/2-10, H, W/2+10, H-5],
  [0, H/2-10, 5, H/2+10]
];

let playerX = g.getWidth() / 2;
let playerVX = 0;
let playerY = g.getHeight() / 2;
let playerVY = 0;
let movingSpeed = 10;

//  0 - Welcome screen 
//  1 - Playing
//  2 - Paused
//  3 - Dead
let status = 0;

function drawWelcome() {
  // Background
  g.setColor('#000000');
  g.fillRect(0, 0, W, H);

  g.setColor('#26b6c7');
  g.setFontAlign(0, 0);
  g.setFont('4x6', 5);
  g.drawString('Wristgeon', W/2, H/2-30);
  g.setFont('6x8', 1);
  g.drawString('Dungeon crawler game', W/2, H/2);
  g.drawString('in your wrist!', W/2, H/2+10);
  g.setFont('6x8', 1);
  g.drawString('Middle button to start', W/2, H/2+30);
  g.flip();
}

/*
  Doors: [TOP, RIGHT, BOTTOM, LEFT]
  Codes: 0 - None; 1 - Closed; 2 - Opened
*/

function drawRoom(doors) {
  g.setColor('#000000');
  g.fillRect(0, 0, W, H);

  for(var i = 0; i < 4; i++) {
    if(doors[i] == 1) {
      // Closed
      g.setColor('#ff0000');
      g.fillRect(doorOffsets[i][0], doorOffsets[i][1], doorOffsets[i][2], doorOffsets[i][3]);
    } else if(doors[i] == 2) {
      // Opened
      g.setColor('#0000ff');
      g.fillRect(doorOffsets[i][0], doorOffsets[i][1], doorOffsets[i][2], doorOffsets[i][3]);
    }
  }
  g.setColor('#535353');
  g.fillRect(5, 5+topBarOffset, W-5, H-5);
}

function drawPlayer() {
  //g.setColor('#ff0000');
  //g.fillCircle(playerX, playerY, 4);

  g.drawImage(player, playerX, playerY, { rotate: Math.atan2(playerVY, playerVX)});
}

function drawStats() {
  g.setColor('#ffffff');
  g.setFont('6x8', 1);
  g.drawString('Level 1', 30, 6);

  g.drawImage(heart, W - 14, 0);
  g.drawImage(heart, W - 28, 0);
  g.drawImage(heart, W - 42, 0);
}

function draw() {
  drawRoom([1, 2, 1, 0]);
  drawPlayer();
  drawStats();
  g.flip();
}

function calculate() {
  var acc = Bangle.getAccel();
  playerVX = Math.round(acc.x * 100) / 100;
  playerVY = Math.round(acc.y * 100) / 100;
  playerX -= playerVX * movingSpeed;
  playerY -= playerVY * movingSpeed;
}

function run() {
  if (status == 0) {
    drawWelcome();
  } if (status == 1) {
    calculate();
    draw();
  } if (status == 1) {
    //drawPauseMenu();
  }
}

// Up
setWatch(() => {
  console.log('up');
}, BTN1, { repeat: true });

// Down
setWatch(() => {
  console.log('Down');
}, BTN3, { repeat: true });

// Left
setWatch(() => {
  console.log('Left');
}, BTN4, { repeat: true });

// Right
setWatch(() => {
  console.log('Right');
}, BTN5, { repeat: true });

// Middle button: Start Game / Pause
setWatch(() => {
  // Welcome -> Start
  if(status == 0)
    status = 1;
  // Playing -> Pause
  else if (status == 1)
    status = 2;
  // Pause -> Playing
  else if (status == 2)
    status = 1;
}, BTN2, { repeat: true });

setTimeout(()=>{
  g.setBgColor("#000000");
  g.clear();
  score = 0;
  setInterval(run, 1000 / fps);
},10);