//background canvas variables
var background = document.getElementById('background');
var ctxBackground = background.getContext('2d');
var width = ctxBackground.canvas.width = 360;
var height = ctxBackground.canvas.height = 360;


//lists of visual elements
var animation = document.getElementById('animation');
var ctxAnimation = animation.getContext('2d');
var width = ctxAnimation.canvas.width = 360;
var height = ctxAnimation.canvas.height = 360;


//utilities
var sides = ['north', 'west', 'south', 'east'];
var currentPath = null;
var sizeOfMap = 8;
var map = [];
//Class


//squares
class Square{
    constructor(X,Y) {
        this.X=X;
        this.Y=Y;
        this.listOfElements = [];
        this.isPartOfPath = false;
    }

    makePath(){
        this.isPartOfPath = true;
    }
    notPath(){
            this.isPartOfPath = false;
    }
    draw(){
        if(this.isPartOfPath){
            //draw in brown for the path
            ctxBackground.fillStyle = 'rgba(139,69,19,1)';
        } else {
            ctxBackground.fillStyle = 'rgba(0,250,0,1)';
        }
        let posX = width/sizeOfMap;
        let posY = height/sizeOfMap;
        ctxBackground.fillRect((this.X)*posX,this.Y*posY,posX,posY);
    }
}

//paths
class Path{
        constructor() {
            this.nodes = [];
            this.isComplete = false;
            this.startingPoint = null;
        }

        getDifficulty(){
                return -1;
        }

        draw(){
            if(this.isComplete){
                for(let i = 0; i< this.nodes.length;i++){
                    this.nodes[i].draw();
                }
            } else {
                console.log("Path not complete");
                for(let i = 0; i< this.nodes.length;i++){
                    this.nodes[i].draw();
                }
            }
        }
        addNode(node){
            this.nodes.push(node);
            node.makePath();
        }
}

//initialization
ctxBackground.fillStyle = 'rgba(0,250,0,1)';
ctxBackground.fillRect(0,0,width,height);
(function(){
    for(let i =0;i<sizeOfMap;i++){
        let column = [];
        for(let j=0;j<sizeOfMap;j++){
                let square = new Square(j,i);
                column.push(square);
        }
        map.push(column);
    }
})();
console.log(map);
currentPath = new Path();
currentPath.draw();
for(let i=0; i<7; i++){
        currentPath.addNode(map[1][i]);
}
for(let i=0; i<4; i++){
        currentPath.addNode(map[1+i][6]);
}
for(let i=0; i<3; i++){
        currentPath.addNode(map[5][6-i]);
}
for(let i=0; i<3; i++){
        currentPath.addNode(map[5-i][4]);
}
for(let i=0; i<3; i++){
        currentPath.addNode(map[3][4-i]);
}
for(let i=0; i<5; i++){
        currentPath.addNode(map[3+i][2]);
}
for(let i=0; i<1; i++){
        currentPath.addNode(map[7][2+1]);
}
currentPath.isComplete = true;
currentPath.draw();
console.log(map);

//planes
class Plane{
    constructor(path){
        this.node = path.nodes[0];
        this.image = document.getElementById("paperplane");
        this.speed = 1;
    }

    draw(){
        ctxAnimation.drawImage(this.image,0,35);
    }        
}
var plane = new Plane(currentPath);
let stillFly = true;
while(stillFly){
    ctxAnimation.clearRect(0,0,width,height);
    plane.draw();
    plane.fly();
    if(currentPath.nodes.indexOf(plane.node)==-1){
           stillFly =false;
    }
}

