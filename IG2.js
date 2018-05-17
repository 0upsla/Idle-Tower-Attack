
//TODO joinpath together
//TODO create a pool for planes
//global const
let SIZE = 600;
let NBCELLPATH = 8;
let NBPATH = 1;
let CELLSIZE=SIZE/(NBCELLPATH*NBPATH);
let FRAMERATE = 30;
let BASESPEED = CELLSIZE/2500;
let mainLoopStart = Date.now();
let mainLoopDiff = FRAMERATE; 
//direction const
let NORTH = 0;
let EAST = 1;
let SOUTH = 2;
let WEST = 3;
//global arrays
let pathModels = {
	straight : [],
	right : [],
	left : []
};
let planes = [];
let paths = [];
let bullets = [];
//indicators
//TODO make a prototype for indicators
let gold = 0;
let goldIndicator = document.getElementById('gold');
let planeSpeed = 5;
let planeSpeedIndicator = document.getElementById('planeSpeed');
let planeLimit = 10000;
let planeLimitIndicator = document.getElementById('planeLimit');
let autoLauncherTimer = 1000;
let autoLauncherTimerIndicator = document.getElementById('autoLauncherTimer');
let autoLauncherMultiply = 1;
let planesIndicator = document.getElementById('planes');
updateIndicator();
//gameplay variables
//TODO make a prototype for gameplay variables
let planeLimitPrice = 0;
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

//global functions
function init(){
    //TODO make init
}

function loadImage(){
    //TODO loadImage
}

function mainLoop(){
    //TODO Main loop of the game
}
//Class
class gamePlayVariables{
    //TODO
}

class indicators{
    //TODO
}

class PathSegment{
    constructor(type,length,comingFrom,goingTo,orientation,position) {
        this.type = type;//type of segment
        this.length = length;
        this.orientation = orientation;
        this.comingFrom = [comingFrom[0],comingFrom[1]];
        this.goingTo = [goingTo[0],goingTo[1]];
		this.startingPosition = position //The position of the start of the segment on the path
    }

	drawSegment(){
		console.log("Need to overwrite the function");
	}

	getPositionXY(advance){
		console.log("Need to overwrite the function");
	}

}

class LineSegment extends PathSegment {

	constructor(length, comingFrom, goingTo, orientation, position) {
		super("line", length, comingFrom, goingTo, orientation, position);
	}


	drawSegment(){
        ctxBackground.moveTo(this.comingFrom[0],this.comingFrom[1]);
        ctxBackground.lineTo(this.goingTo[0],this.goingTo[1]);
	}

	getPositionXY(advance){
		let pos = [0,0]
        pos[0] = this.comingFrom[0]+ (this.goingTo[0]-this.comingFrom[0])*
                    advance/this.length;
        pos[1] = this.comingFrom[1]+ (this.goingTo[1]-this.comingFrom[1])*
                    advance/this.length;
		return pos;
	}
}
class LeftTurnSegment extends PathSegment {

	constructor(length, comingFrom, goingTo, orientation, position) {
		super("leftTurn", length, comingFrom, goingTo, orientation, position);
        //starting angle calculated with the orientation
        this.startAngle = Math.PI*this.orientation/2;
        this.center = [];
        //calculate the center of the arc to be drawn
        if(this.orientation == 2) {
           	this.center[0] = this.goingTo[0];
            this.center[1] = this.comingFrom[1];
        } else if(this.orientation == 1) {
            this.center[0] = this.comingFrom[0];
            this.center[1] = this.goingTo[1];
        } else if(this.orientation == 3) {
            this.center[0] = this.comingFrom[0];
            this.center[1]= this.goingTo[1];
        } else {
            this.center[0] = this.goingTo[0];
            this.center[1] = this.comingFrom[1];
        }
	}


    drawSegment(){
        ctxBackground.arc(this.center[0],this.center[1],
                CELLSIZE,this.startAngle,this.startAngle-Math.PI/2, true);
    }

	getPositionXY(advance){
		let half = CELLSIZE/2;
		//If the orientation is north or south
		let pos = [this.comingFrom[0],this.comingFrom[1]];
		let directions = [Math.sign(this.goingTo[0]-this.comingFrom[0]),
			Math.sign(this.goingTo[1]-this.comingFrom[1])];
		if(this.orientation%2 ==0){
		
		if(advance < half){
			pos[1] += advance*directions[1];
		} else {
			pos[1] += half*directions[1];
		 	advance -= half;
			if(advance < half){
				pos[0] +=advance*directions[0];
				pos[1] +=advance*directions[1];
			} else {
				pos[0] +=half*directions[0];
				pos[1] +=half*directions[1];
				advance -= half;
				pos[0] +=advance*directions[0];
			}
		}
		} else {
		
		if(advance < half){
			pos[0] += advance*directions[0];
		} else {
			pos[0] += half*directions[0];
		 	advance -= half;
			if(advance < half){
				pos[0] +=advance*directions[0];
				pos[1] +=advance*directions[1];
			} else {
				pos[0] +=half*directions[0];
				pos[1] +=half*directions[1];
				advance -= half;
				pos[1] +=advance*directions[1];
			}
		}
		}
		return pos;
	}
}
class RightTurnSegment extends PathSegment {

	constructor(length, comingFrom, goingTo, orientation, position) {
		super("righTurn", length, comingFrom, goingTo, orientation, position);
        //starting angle calculated with the orientation
        this.startAngle = Math.PI*(this.orientation-2)/2;
        this.center=[];
        //calculate the center ofthe arc to be drawn
		 
        if(this.orientation == 3){
            this.center[0] = this.comingFrom[0];
            this.center[1] = this.goingTo[1];
        } else if(this.orientation == 2){
            this.center[0] = this.goingTo[0];
            this.center[1] = this.comingFrom[1];
        } else if(this.orientation == 0){
            this.center[0] = this.goingTo[0];
            this.center[1] = this.comingFrom[1];
        } else {
            this.center[0] = this.comingFrom[0];
            this.center[1] = this.goingTo[1];
        }
	}


    drawSegment(){
        ctxBackground.arc(this.center[0],this.center[1],
                CELLSIZE,this.startAngle,this.startAngle+Math.PI/2);
    }
	
	getPositionXY(advance){
		let half = CELLSIZE/2;
		//If the orientation is north or south
		let pos = [this.comingFrom[0], this.comingFrom[1]];
		let directions = [Math.sign(this.goingTo[0]-this.comingFrom[0]),
			Math.sign(this.goingTo[1]-this.comingFrom[1])];
		if(this.orientation%2 ==0){
		
		if(advance < half){
			pos[1] += advance*directions[1];
		} else {
			pos[1] += half*directions[1];
		 	advance -= half;
			if(advance < half){
				pos[0] +=advance*directions[0];
				pos[1] +=advance*directions[1];
			} else {
				pos[0] +=half*directions[0];
				pos[1] +=half*directions[1];
				advance -= half;
				pos[0] +=advance*directions[0];
			}
		}
		} else {
		
		if(advance < half){
			pos[0] += advance*directions[0];
		} else {
			pos[0] += half*directions[0];
		 	advance -= half;
			if(advance < half){
				pos[0] +=advance*directions[0];
				pos[1] +=advance*directions[1];
			} else {
				pos[0] +=half*directions[0];
				pos[1] +=half*directions[1];
				advance -= half;
				pos[1] +=advance*directions[1];
			}
		}
		}
		return pos;
	}
}

class Path {
    constructor(x,y,direction) {
        this.segments = [];//the segments making the path
        this.length = 0;
        this.direction = direction;//the current direction of last part the path 
		this.pos=[x,y];
		this.nextPos=[x,y];
        this.listOfAreas = new ListOfArea(this);
		this.towers = [];
    }

    addSegment(segmentToAdd) {
        this.length += parseInt(segmentToAdd.length);
        this.segments.push(segmentToAdd);
    }
	
    addLeftTurn(){//add a left turn, 90°

        if(this.direction == NORTH){
			this.nextPos=[this.pos[0]-CELLSIZE,this.pos[1]-CELLSIZE];
        } else if (this.direction == SOUTH){
			this.nextPos=[this.pos[0]+CELLSIZE,this.pos[1]+CELLSIZE];
        } else if (this.direction == WEST){
			this.nextPos=[this.pos[0]-CELLSIZE,this.pos[1]+CELLSIZE];
        } else { 
			this.nextPos=[this.pos[0]+CELLSIZE,this.pos[1]-CELLSIZE];
        }
        //create the new segment, fixed length of 75
        let segment = new LeftTurnSegment( CELLSIZE*3/2, this.pos,
                    this.nextPos,this.direction, this.length);
        this.addSegment(segment);
        //update the new positions of the path
        this.pos[0] = this.nextPos[0];
		this.pos[1] = this.nextPos[1];
        this.direction = (this.direction+3)%4;
        

    }
    
    addRightTurn(){//add a right turn, 90°

        if(this.direction == NORTH){
			this.nextPos=[this.pos[0]+CELLSIZE,this.pos[1]-CELLSIZE];
        } else if (this.direction == SOUTH){
			this.nextPos=[this.pos[0]-CELLSIZE,this.pos[1]+CELLSIZE];
        } else if (this.direction == WEST){
			this.nextPos=[this.pos[0]-CELLSIZE,this.pos[1]-CELLSIZE];
        } else { 
			this.nextPos=[this.pos[0]+CELLSIZE,this.pos[1]+CELLSIZE];
        }
        //create the new segment, fixed length of 75
        let segment = new RightTurnSegment( CELLSIZE*3/2, this.pos,
                    this.nextPos, this.direction, this.length);
        this.addSegment(segment);
        //update the new positions of the path
        this.pos[0] = this.nextPos[0];
		this.pos[1] = this.nextPos[1];
        this.direction = (this.direction+1)%4;
    }
    
    addStraight(length){//add a straight segment of given length
        //calculate new position after new segment
        if(this.direction == NORTH){
            this.nextPos[1] = this.pos[1]-length;
        } else if (this.direction == SOUTH){
            this.nextPos[1] = this.pos[1]+length;
        } else if (this.direction == WEST){
            this.nextPos[0] = this.pos[0]-length;
        } else { 
            this.nextPos[0] = this.pos[0]+length;
        }
        //create the new segment
        let segment = new LineSegment( length, this.pos, 
					this.nextPos, this.direction, this.length);
        this.addSegment(segment);
        //updating the position after the new segment
        this.pos[0] = this.nextPos[0];
		this.pos[1] = this.nextPos[1];
		console.log(this.pos==this.nextPos);

    }
    /**
     *This method draw the path, by creating a path on the canvas, and stroking it
     **/
    draw() {
        //First create the path a bit larger in color, to create a line around the final path
        ctxBackground.beginPath();
        let lineWidth = CELLSIZE*0.8;
        ctxBackground.lineWidth=lineWidth;
        ctxBackground.strokeStyle='rgba(0,0,0,0.5)';
        this.segments.forEach(function(item){
            item.drawSegment();        
        });
        ctxBackground.stroke();
        //Then recreate the path, but stroke it using texture, slightly smaller
        
        ctxBackground.beginPath();
        this.segments.forEach(function(item){
            item.drawSegment();        
        });
        lineWidth = CELLSIZE*0.6;
        ctxBackground.lineWidth=lineWidth;
        ctxBackground.strokeStyle=roadPattern;
        ctxBackground.stroke();
    }
}

class Plane{
    constructor(path){
        this.speed = planeSpeed;//speed of the plane, not updated
        this.image = planeImage;//the image of the plane
        // 0 = north, 1 = west, 2 = south, 3 = east
		this.pathNb = 0;
        this.currentPath = path;//the current path the plane is flying
        this.orientation = path.segments[0].orientation;
        this.currentSegment = this.currentPath.segments[0];//the current segment of the path
        this.NbSegment = 0;//the number of the segment, according to the path list of segment
		this.NbArea = 0; //The number of the current area
        this.advance = 0;//the advance of the plane on the current segment
		this.position = 0; //The position of the plane on the current path
        this.stillFly = true;//is it still flying ? (dead, end of path)
        this.posX = 0;
        this.posY = 0;
        this.HP = 50;
    }

    draw(){//draw itself by chaging the contex, and then restoring it
        this.prepareCTX();//change the context to match the needs of this draw
        ctxAnimation.setTransform(1,0,0,1,0,0);//reset the transfrome matrix
    }

    prepareCTX(){//calculate the needed matrix
        if(this.currentSegment.type == "line"){//for a line
            //first translate the matrix to the beginning of the segment
            ctxAnimation.translate(this.currentSegment.comingFrom[0] ,
                this.currentSegment.comingFrom[1]);
            //depending on the orientation of the plane, translate to 
            //the current advance of the plane
            if(this.orientation == 0){
                ctxAnimation.translate(0,-this.advance);
            } else if(this.orientation == 1){
                ctxAnimation.translate(this.advance,0);
            } else if (this.orientation == 2){
                ctxAnimation.translate(0,this.advance);
            } else {
                ctxAnimation.translate(-this.advance,0);
            }
            //rotate the matrix to draw the plane in the right orientation
            ctxAnimation.rotate(Math.PI*this.orientation/2);
            //draw the plane at the center of the matrix
            ctxAnimation.drawImage(this.image,-(CELLSIZE/2),-(CELLSIZE/2),CELLSIZE,CELLSIZE);
        }//for a left turn
        else if (this.currentSegment.type == "leftTurn"){
            //move the canva to the center of rotation
            ctxAnimation.translate(this.currentSegment.center[0],
                    this.currentSegment.center[1]);
            //Rotate the canva depends on the orientation of the plane
            //and on the advance of the plane
            //as turn-segment have a length of 75, we need to divide by 2*75 = 150
            ctxAnimation.rotate(Math.PI*(this.orientation/2 -this.advance/(CELLSIZE*3)));
            //We draw the plane 50px more to the rigth, so he's on track
            //and on the right orientation
            ctxAnimation.drawImage(this.image, (CELLSIZE/2),-(CELLSIZE/2), CELLSIZE,CELLSIZE);
        }//for a right turn
        else {
            //move the canva to the center of rotation
            ctxAnimation.translate(this.currentSegment.center[0],
                    this.currentSegment.center[1]);
            //Rotate the canva depends on the orientation of the plane
            //and on the advance of the plane
            //as turn-segment have a length of 75, we need to divide by 2*75 = 150
            ctxAnimation.rotate(Math.PI*(this.orientation/2+this.advance/(CELLSIZE*3)));
            //We draw the plane 50px more to the left, so he's on track
            //and on the right orientation
            ctxAnimation.drawImage(this.image, -(3*CELLSIZE/2),-(CELLSIZE/2), CELLSIZE,CELLSIZE);

        }
        
    }

    fly(timeDiff){//make the plane fly
        //TODO make the plane fly at constant speed, not depending on the framerate
        // or on the size of the path
		this.advance += this.speed*timeDiff*BASESPEED;
		this.position += this.speed*timeDiff*BASESPEED;
        //If we go further than the current segment
        //Keep substracing segment length to find the new segment
        //as the speed might be really higher than the segments length
        while(this.advance >= this.currentSegment.length){
            this.advance -= this.currentSegment.length;
            this.NbSegment ++;
            //Are we still on the path ?
            if(this.currentPath.segments.length > this.NbSegment){
                //we update the current segment 
                this.currentSegment = this.currentPath.segments[this.NbSegment];
            }
            //If not on the path anymore
            else {
				this.pathNb++;
				if(paths.length > this.pathNb){
					this.position -= this.currentPath.length;
					this.currentPath = paths[this.pathNb];
					this.currentSegment = this.currentPath.segments[0];
					this.NbSegment = 0;
					this.NbArea = 0;
					this.currentArea = this.currentPath.listOfAreas[0];
				} else {
                	this.stillFly = false;
                	gold++;
                	goldIndicator.innerHTML = "Gold : " + gold;
                	return;
				} 
            }
        }
        //update the orientation of the plane
        this.orientation = this.currentSegment.orientation;
		let posXY = this.currentSegment.getPositionXY(this.advance);
		this.posX = posXY[0];
		this.posY = posXY[1];
		this.detectCurrentArea();

    }
	//Detect if the plane changed area
	detectCurrentArea(){
		let currentArea = this.currentPath.listOfAreas.areas[this.NbArea];
		while(this.position > currentArea.endPos){
			this.NbArea++;
			currentArea = this.currentPath.listOfAreas.areas[this.NbArea];
			for (let i=0; i< currentArea.changingTower.length;i++){
				currentArea.changingTower[i].changePlane(this);
			}
		}
	}


    hit(DMG){
        this.HP -= DMG;
        if(this.HP <= 0){
            this.stillFly = false;
        }
    }
}

class Tower {
    constructor(posX, posY, range, attackSpeed, attackDMG, bulletType){
        this.posX = posX;
        this.posY = posY;
        this.range = range;
        this.attackSpeed = attackSpeed;
        this.attackDMG = attackDMG;
        this.planesInRange = [];
        this.bulletType = bulletType;
        this.attackTimer = attackSpeed*FRAMERATE;
    }

    draw(){
        ctxBackground.drawImage(towerImage,this.posX-CELLSIZE/2,this.posY-CELLSIZE/2,
                CELLSIZE,CELLSIZE);
        ctxBackground.strokeStyle ="rgba(200,200,200,0.8)";
        ctxBackground.lineWidth = CELLSIZE*0.03;
        ctxBackground.beginPath();
        ctxBackground.arc(this.posX,this.posY,this.range,0,Math.PI*2);
        ctxBackground.stroke();
    }

    attack(timeDiff){
        if(this.attackTimer > 0){
            this.attackTimer -= timeDiff;
        } else {
			while(this.planesInRange.length > 0 && !this.planesInRange[0].stillFly){
				this.planesInRange.splice(0,1);
			}
			if(this.planesInRange.length > 0){
				this.sendBullet(this.planesInRange[0]);
				this.attackTimer = this.attackSpeed*FRAMERATE;
			}
		}
    }

    sendBullet(plane){
        bullets.push(new Bullet(plane, this.attackDMG,this.bulletType, this));
    }

	changePlane(plane){
		let index = this.planesInRange.indexOf(plane);
		if(index < 0){
			this.planesInRange.push(plane);
		} else {
			this.planesInRange.splice(index,1);
		}
	}
}

class Bullet {
    constructor(plane, DMG, bulletType, tower){
        this.target = plane;
        this.DMG = DMG;
        this.type = bulletType;
        this.posX = tower.posX;
        this.posY = tower.posY;
        this.hit = false;
        this.tower = tower;
        if(this.type == "normal"){
            this.image = normalBulletImage;
            this.speed = 10;
            
        }
    }
        
    fly(timeDiff){
        if(!this.target.stillFly){
            if(this.tower.planesInRange.length > 0){
                this.target = this.tower.planesInRange[0];
            } else if(planes.length > 0){
				this.target = planes[0];
			}else {this.hit = true;}
        }
		let flyDistance = this.speed*timeDiff*BASESPEED;
        let distX = this.target.posX - this.posX ;
        let distY = this.target.posY - this.posY ;
        let distDiag = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
        if(distDiag <= flyDistance){
            this.posX = this.target.posX;
            this.posY = this.target.posY;
			this.target.hit(this.DMG);
			this.hit = true;
        } else {
            let depX = distX*flyDistance/distDiag;
            let depY = distY*flyDistance/distDiag;
            this.posX += depX;
            this.posY += depY;
        }
        this.speed *= 1.05;
    }

    draw(){
        ctxAnimation.strokeStyle = "red";
        ctxAnimation.lineWidth = CELLSIZE*0.1;
        ctxAnimation.beginPath();
        ctxAnimation.arc(this.posX,this.posY,CELLSIZE*0.05,0,Math.PI*2);
        ctxAnimation.stroke();

    }
}

class AreaTester {
    
    constructor(path){
        this.path = path;
        this.currentSegment = path.segments[0];
        this.segmentNB = 0;
        this.advance = 0;
        this.listOfAreas = path.listOfAreas;
        this.towerOutOfRange = [];
        this.towerInRange = [];
        this.pos = [this.currentSegment.comingFrom[0],this.currentSegment.comingFrom[1]];
    }

    testArea(){
        let dist = 0;
		let towers = this.path.towers;
		this.advance = 0;
		this.currentSegment = this.path.segments[0];
		this.segmentNB = 0;
		let speed = CELLSIZE/2500;
        let currentTower = null;
        this.towerOutOfRange = [];
		this.towerInRange = [];
		this.calculatePos();
		for(let i=0;i<towers.length;i++){
			currentTower =towers[i];
			if(this.inRangeOfTower(currentTower)){
				this.towerInRange.push(currentTower);
				this.listOfAreas.push(new Area(this.path, 0), currentTower);
			} else {
				this.towerOutOfRange.push(currentTower);
			}
		}
		console.log("position of tester ", this.pos );
        while(this.segmentNB < this.path.segments.length){
            if(this.advance > this.currentSegment.length){
                this.advance -= this.currentSegment.length;
                this.segmentNB++;
                this.currentSegment = this.path.segments[this.segmentNB];
            } else {
                this.advance+=5;
                this.calculatePos();
                for(let i=0; i< this.towerOutOfRange.length;i++){
                    currentTower = this.towerOutOfRange[i];
                    if(this.inRangeOfTower(currentTower)){
                        this.listOfAreas.push(new Area(this.path,this.currentSegment.startingPosition + this.advance),
                                currentTower);
                        this.towerInRange.push(currentTower);
                        this.towerOutOfRange.splice(i,1);
                        i--;
                    }
                }
                for(let i=0;i< this.towerInRange.length;i++){
                    currentTower = this.towerInRange[i];
                    if(!this.inRangeOfTower(currentTower)){
                        this.listOfAreas.push(new Area(this.path, this.currentSegment.startingPosition + this.advance),
                                currentTower);
                        this.towerOutOfRange.push(currentTower);
                        this.towerInRange.splice(i,1);
                    }
                }
            }
        }
		for(let i=0;i< this.towerInRange.length;i++){
			currentTower = this.towerInRange[i];
			this.listOfAreas.push(new Area(this.path, this.path.length), currentTower);
		}
		this.listOfAreas.lastArea.endPos=this.path.length + 50;
		console.log("Tested Area : ",this.listOfAreas);
    }
    
	inRangeOfTower(tower){
		let dist =Math.sqrt( Math.pow(tower.posX - this.pos[0],2) 
                        + Math.pow(tower.posY - this.pos[1],2));
		if(tower.range >= dist){
			return true;
		} else {
			return false;
		}
	}

    calculatePos(){
		let calculatePosition = this.currentSegment.getPositionXY(this.advance);
		this.pos = [calculatePosition[0],calculatePosition[1]];
    }
}

class ListOfArea {
    constructor(path){
        this.path = path;
        this.lastArea = new Area(this.path, -100);
        this.areas = [this.lastArea];
    }

    push(area,tower) {
        if(this.lastArea.isSame(area)){
            this.lastArea.changeTower(tower);
        } else {
            this.lastArea.endPos = area.startingPos;
            this.areas.push(area);
            this.lastArea = area;
            area.changeTower(tower);
        }
    }
}

class Area {
    constructor(path, startingPos){
        this.path = path;
        this.endPos = 0;
		this.startingPos = startingPos
        this.changingTower = [];
    }

    changeTower(tower){
		let index = this.changingTower.indexOf(tower);
        if(index < 0){
            this.changingTower.push(tower);
        } else {
			this.changingTower.splice(index,1);
		}
    }

    isSame(area){
        if(area instanceof Area){
            if(this.path == area.path &&
                Math.abs(this.startingPos -area.startingPos) < 10){
					console.log("Same Area");
                    return true;
            }
        }
        return false;
    }

}
//Background Construction
//create background grass
let normalBulletImage = 0;
let grassTexture = new Image();
let grassPattern;
function getGrassTexture(){
    grassTexture.onload = function() {//when the texture is loaded
        grassPattern =ctxBackground.createPattern(grassTexture, "repeat");
        ctxBackground.fillStyle=grassPattern;
        ctxBackground.fillRect(0,0,SIZE,SIZE);
        getRoadTexture();//call the road texture when hte grass one is ready
    }
    grassTexture.src = "img/grass.jpg";
}

let roadTexture = new Image();
let roadPattern;
function getRoadTexture(){
    roadTexture.onload = function() {//when texture is loaded
        roadPattern =ctxBackground.createPattern(roadTexture, "repeat");
		//Draw the paths
		for(let i=0; i< paths.length;i++){
			paths[i].draw();
		}
        getTowerImage();
    }
    roadTexture.src = "img/road.jpg";
}

let towerImage = new Image();
function getTowerImage(){
    towerImage.onload = function(){
        for(let i = 0; i< paths.length; i++){
			for( let j = 0; j<paths[i].towers.length;j++ ){
				paths[i].towers[j].draw();
			}
        }
        console.log("towers drawn");
    }
    towerImage.src = "img/antTower.png";
	let tester;
	for(let j = 0; j< paths.length;j++){
		tester = new AreaTester(paths[j]);
		tester.testArea();
	}
}
//define path
function createPath(i){
	let path;
	let lastPath;
	if(paths.length == 0){
		lastPath = new Path(0,CELLSIZE,EAST);
	} else {
		lastPath = paths[paths.length-1];
	}
	/*
	switch(i) {
		case 1 :
		//PATH 1
    	path = new Path(lastPath.pos[0],lastPath.pos[1],lastPath.direction);
		console.log(lastPath.orientation);
    	path.addStraight(6*CELLSIZE);
    	path.addRightTurn();
    	path.addStraight(2*CELLSIZE);
    	path.addRightTurn();
    	path.addRightTurn();
    	path.addLeftTurn();
    	path.addStraight(2*CELLSIZE);
    	path.addLeftTurn();
    	path.addStraight(2*CELLSIZE);
    	path.addLeftTurn();
    	path.addStraight(4*CELLSIZE);
    	path.addRightTurn();
		path.towers.push(new Tower(CELLSIZE*184/32,CELLSIZE*72/32,CELLSIZE*3,25,10,"normal"));
		path.towers.push(new Tower(CELLSIZE*80/32,CELLSIZE*144/32,CELLSIZE*3,25,10,"normal"));
			break;
		case 2 :
		//PATH 2
		path = new Path(lastPath.pos[0],lastPath.pos[1],lastPath.direction);
		path.addStraight(4*CELLSIZE);
		path.addRightTurn();
		path.addStraight(2*CELLSIZE);
		path.addRightTurn();
		path.addRightTurn();
		path.addLeftTurn();
		path.addLeftTurn();
		path.addStraight(2*CELLSIZE);
		path.addLeftTurn();
		path.addStraight(4*CELLSIZE);
		path.addLeftTurn();
		path.addStraight(6*CELLSIZE);
		path.towers.push(new Tower(CELLSIZE*(-45)/32+lastPath.pos[0],CELLSIZE*110/32+lastPath.pos[1],CELLSIZE*10,10,2,"normal"));
		path.towers.push(new Tower(CELLSIZE*(-150)/32+lastPath.pos[0],CELLSIZE*75/32+lastPath.pos[1],CELLSIZE*2.5,30,15,"normal"));
			break;
		case 3 :
		//PATH 3
		path = new Path(lastPath.pos[0],lastPath.pos[1],lastPath.direction);
		path.addLeftTurn();
		path.addStraight(4*CELLSIZE);
		path.addRightTurn();
		path.addRightTurn();
		path.addStraight(4*CELLSIZE);
		path.addLeftTurn();
		path.addStraight(2*CELLSIZE);
		path.addLeftTurn();
		path.addLeftTurn();
		path.addStraight(1*CELLSIZE);
		path.addRightTurn();
		path.addStraight(1*CELLSIZE);
		path.addRightTurn();
		path.addStraight(1*CELLSIZE);
		path.addLeftTurn();
		path.addStraight(1*CELLSIZE);
		path.towers.push(new Tower(CELLSIZE*184/32+lastPath.pos[0],CELLSIZE*(-110)/32+lastPath.pos[1],CELLSIZE*2,50,30,"normal"));
		path.towers.push(new Tower(CELLSIZE*130/32+lastPath.pos[0],CELLSIZE*(-190)/32+lastPath.pos[1],CELLSIZE*2.8,20,10,"normal"));
		path.towers.push(new Tower(CELLSIZE*140/32+lastPath.pos[0],CELLSIZE*(-35)/32+lastPath.pos[1],CELLSIZE*3.5,12,3,"normal"));
			break;
		case 4 :
		//PATH 4
		path = new Path(lastPath.pos[0],lastPath.pos[1],lastPath.direction);
		path.addLeftTurn();
		path.addStraight(2*CELLSIZE);
		path.addRightTurn();
		path.addRightTurn();
		path.addStraight(2*CELLSIZE);
		path.addLeftTurn();
		path.addLeftTurn();
		path.addStraight(4*CELLSIZE);
		path.addRightTurn();
		path.addRightTurn();
		path.addStraight(4*CELLSIZE);
		path.addLeftTurn();
			break;
		
	}
	*/
	path = new Path(lastPath.pos[0], lastPath.pos[1], lastPath.direction);
		let	model = pathModels.left[0];
	for(let j=0;j< model.length;j++){
		switch (model[j]) {
			case "l" : 
				path.addLeftTurn();
				break;
			case "r" :
				path.addRightTurn();
				break;
			default : 
				path.addStraight(model[j]*CELLSIZE);
		}
	}
	return path;
}
generatePathModels();
paths.push(createPath(1));
//paths.push(createPath(2));
//paths.push(createPath(3));
//paths.push(createPath(4));
getGrassTexture();
//Prepare plane
let planeImage = new Image();
planeImage.onload = function() {//when image is loaded
	createPool();
    startFly();
}
planeImage.src = "img/paperplane.png";

function startFly(){
    let loop = setInterval(function(){
		mainLoopDiff = Date.now() - mainLoopStart;
		mainLoopStart = Date.now();
        ctxAnimation.clearRect(0,0,SIZE,SIZE);
        for( let i=0; i<planes.length;i++){
            planes[i].fly(mainLoopDiff);
            if(!planes[i].stillFly){
                planes.splice(i,1);
                i--;
				continue;
            }
            planes[i].draw();
        }
        for(let i=0; i< paths.length; i++){
            for(let j=0; j< paths[i].towers.length;j++){
				paths[i].towers[j].attack(mainLoopDiff);
			}
        }
        for(let i=0;i<bullets.length;i++){
            bullets[i].fly(mainLoopDiff);
            bullets[i].draw();
            if(bullets[i].hit){
                bullets.splice(i,1);
                i--;
            }
        }
        updateIndicator();
    },FRAMERATE);
}

function autoLauncher(){
    autoLaunchBTN.onclick = function(){
			autoLauncherTimer *= 0.9;
			if(autoLauncherTimer < 20){
				autoLauncherTimer = 100;
				autoLauncherMultiply *= 5;
			}
	};
    let loop = function(){
		let target = Math.min(autoLauncherMultiply, planeLimit - planes.length);
		for (let i=0; i< target;i++){
        	launchPlane();
		}
        setTimeout(function(){loop();},autoLauncherTimer); 
    }
    loop();
}        


function launchPlane(){
    if(planes.length<planeLimit){
        let newPlane = new Plane(paths[0]); 
        planes.push(newPlane);
    } else {
        console.log("no more space for more plane");
    }
}

//button evenements
//get the buttons
let planeLaunchBTN = document.getElementById("planeLaunchBTN");
let fasterPlanesBTN = document.getElementById("fasterPlanesBTN");
let morePlanesBTN = document.getElementById("morePlanesBTN");
let autoLaunchBTN = document.getElementById("autoLaunchBTN");

//assign events
planeLaunchBTN.onclick = launchPlane;
fasterPlanesBTN.onclick = function(){planeSpeed++};
morePlanesBTN.onclick = function(){
    if(gold >= planeLimitPrice){
        gold -=planeLimitPrice;
        updateIndicator();
        planeLimit++;
        //planeLimitPrice *=1.2;
    } else {
        console.log("not enough gold");
    }
};
autoLaunchBTN.onclick = autoLauncher;

function updateIndicator(){
    goldIndicator.innerHTML="Gold : " + gold;
    planesIndicator.innerHTML = "Planes : " + planes.length + "/" + planeLimit;
    planeSpeedIndicator.innerHTML = "Speed : " + planeSpeed;
    autoLauncherTimerIndicator.innerHTML = "Timer for launch : " + autoLauncherTimer;
};
console.log("end");

function createPool(){
		launchPlane();
}
console.log(BASESPEED);

function generatePathModels(){
	pathModels.right.push([6,"r",2,"r","r","l",2,"l",2,"l",4,"r"]);
	pathModels.left.push([4,"r",2,"r","r","l","l",2,"l",4,"l",6]);
	pathModels.left.push(["l",4,"r","r",4,"l",2,"l","l",1,"r",1,"r",1,"l",1]);
	pathModels.straight.push(["l",2,"r","r",2,"l","l",4,"r","r",4,"l"]);
}

