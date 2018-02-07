//canvas variables
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
var width = context.canvas.width = 300;
var height = context.canvas.height = 300;

//lists of visual elements
var listVisuals = [];

//utilities
var sides = ['north', 'west', 'south', 'east'];
var currentPath = [];
var sizeOfMap = 5;
var map = [];
//squares
function Square(X,Y){
        this.positionX=X;
        this.positionY=Y;
        this.listOfElements;
}

//paths


//initialization
context.fillStyle = 'rgba(0,0,0,1)';
context.fillRect(0,0,300,300);
newPath();
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

// Create a new random path
function newPath(){
    let randSide = Math.floor(Math.random()*4);
    let newPathOrientation = sides[randSide];
    let startingPoint = Math.floor(Math.random()*sizeOfMap);
    console.log(startingPoint, newPathSide);
    let notComplete = true;
    while( notComplete){
        
    }
}






