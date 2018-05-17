//background canvas variables
let background = document.getElementById('background');
let ctxBackground = background.getContext('2d');
ctxBackground.canvas.width = SIZE;
ctxBackground.canvas.height = SIZE;


//animation canvas
let animation = document.getElementById('animation');
let ctxAnimation = animation.getContext('2d');
ctxAnimation.canvas.width = SIZE;
ctxAnimation.canvas.height = SIZE;

//Texture and image variables
let normalBulletImage = new Image();
let grassTexture = new Image();
let grassPattern;

let roadTexture = new Image();
let roadPattern;
let towerImage = new Image();
let planeImage = new Image();

