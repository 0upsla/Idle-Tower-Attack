//To compile the file, yank and CTRl + R + " :so %:h\jsBuilder.vim

//TODO joinpath together
//TODO create a pool for planes
//global const
let SIZE = 600;
let NBCELLPATH = 8;
let NBlvl = 1;
let CELLSIZE=SIZE/(NBCELLPATH*NBlvl);
let FRAMERATE = 30;
let BASESPEED = CELLSIZE/2500;
let mainLoopStart = Date.now();
let mainLoopDiff = FRAMERATE; 
//orientation const
let NORTH = 0;
let EAST = 1;
let SOUTH = 2;
let WEST = 3;
//direction const
let LEFT = -1;
let STRAIGHT = 0;
let RIGHT = 1;
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
let indicatorDiv = document.getElementById('indicators');
let gold = 0;
let goldIndicator = document.createElement('div');
let planeSpeed = 5;
let planeSpeedIndicator = document.createElement('div'); 
let planeLimit = 10000;
let planeLimitIndicator =  document.createElement('div'); 
let planeLimitPrice = 0;
let autoLauncherTimer = 1000;
let autoLauncherTimerIndicator =  document.createElement('div'); 
let autoLauncherMultiply = 1;
let planesIndicator =  document.createElement('div'); 
/*
indicatorDiv.appendChild(goldIndicator);
indicatorDiv.appendChild(planeSpeedIndicator);
indicatorDiv.appendChild(planeLimitIndicator);
indicatorDiv.appendChild(autoLauncherTimerIndicator);
indicatorDiv.appendChild(planesIndicator);
*/
let lvlInception = 0;
let lvlInceptionIndicator = document.createElement('div');
indicatorDiv.appendChild(lvlInceptionIndicator);
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
let lvlInceptionBTN = document.getElementById("lvlInceptionBTN");
let planeLaunchBTN = document.getElementById("planeLaunchBTN");
let fasterPlanesBTN = document.getElementById("fasterPlanesBTN");
let morePlanesBTN = document.getElementById("morePlanesBTN");
let autoLaunchBTN = document.getElementById("autoLaunchBTN");

//assign events
lvlInceptionBTN.onclick = function(){
	NBlvl*= (lvlInception%3)+2;
	CELLSIZE = SIZE/(NBCELLPATH*NBlvl);
	drawBackGround();
	lvlInception++;
	updateIndicator();
};
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
	lvlInceptionIndicator.innerHTML = "lvl of Inception : " + lvlInception;
};
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

/*
 *Path is the class for the path of the planes.
 *It is the most basic map object
 *It contains the towers
 */
class Path {
	
	constructor(posX, posY, direction, orientation, startLeftCorner, endLeftCorner){
		this.segments = [];
		this.length = 0;
		//Position of the path on the canvas
		this.posX = posX;
		this.posY = posY;
		//Side of the corner on which we start
		this.startLeftCorner = startLeftCorner;
		//Side of the corner on which we end
		this.endLeftCorner = endLeftCorner;
		//direction is the general direction of the whole path
		//direction is Left, Straight or Right (-1,0 or 1);
		this.direction = direction;
		//Orientation is rapport to the cardinals 
		//Nort = 0, East = 1, South = 2, West = 3;
		//When the path is over, this will be the direction at the end.
		this.orientation = orientation;
		//list of the different Areas, AKA where towers in/out of range
		this.listOfAreas = new ListOfArea(this);
		this.towers = [];
	}

	addSegment(segmentToAdd){
		this.length += segmentToAdd.length;
		this.segments.push(segmentToAdd);
		this.orientation = (this.orientation + segmentToAdd.direction+4)% 4;
		this.posX = segmentToAdd.endPosX;
		this.posY = segmentToAdd.endPosY;
	}
	
	drawPath(){
		ctxBackground.lineWidth = 0.8*CELLSIZE;
		ctxBackground.strokeStyle  ='rgba(0,0,0,0.5)';
		this.segments.forEach(function(seg){
			seg.drawSegment();	
		});
		ctxBackground.lineWidth = 0.6*CELLSIZE;
		ctxBackground.strokeStyle  = roadPattern;
		this.segments.forEach(function(seg){
			seg.drawSegment();	
		});
	}

	calculateAreas(){
		globalTester.testArea(this);	
	}
}
class Plane {
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

class PathSegment {
	constructor (direction, orientation, length, path){
		this.direction = direction;
		this.orientation = orientation;
		this.length = length;
		this.addToPath(path);
	}
	
	drawSegment(){
		//draw the segment
	}

	getPositionXY(advance){
		//Return the position of the plane depending of advance on segment
	}

	addToPath(path){
		//add this segment to the specified path
		this.path = path;
		this.posX = path.posX;
		this.posY = path.posY;
		this.calculateEndPos();
		path.addSegment(this);
	}

	calculateEndPos(){
		//calculate the end position of the segment,
		//regard to the canvas
	}
}

class StraightSegment extends PathSegment{
	constructor (length, path){
		super(STRAIGHT, path.orientation, length, path);
	}

	calculateEndPos(){
		this.endPosX = this.posX + ((2-this.orientation)%2)*this.length;
		this.endPosY = this.posY + ((this.orientation -1 )%2)*this.length;
	}
	
	drawSegment(){
		ctxBackground.beginPath();
		ctxBackground.moveTo(this.posX*CELLSIZE, this.posY*CELLSIZE);
		ctxBackground.lineTo(this.endPosX*CELLSIZE, this.endPosY*CELLSIZE);
		ctxBackground.stroke();
	}

	getPositionXY(advance){
		//Return the position of the plane in an array [X,Y]
		let pos = [0,0];
		pos[0] = this.posX + ((2-this.orientation)%2)*advance;
		pos[1] = this.posY + ((this.orientation -1)%2)*advance;
		return pos;
	}
}

class LeftTurnSegment extends PathSegment{
	constructor (path){
		super(LEFT, path.orientation, 3/2, path);
		//Starting angle
		this.startAngle = Math.PI*this.orientation/2;
		
	}
	
	calculateEndPos(){
		if(this.orientation % 2 == 0){
			if(this.orientation < 2 ){ // North
				this.endPosX = this.posX - 1;
				this.endPosY = this.posY - 1;
			} else { // South
				this.endPosX = this.posX + 1;
				this.endPosY = this.posY + 1;
			}
			//calculate the center of rotation
			this.centerX = this.endPosX;
			this.centerY = this.posY;
		}else{
			if(this.orientation < 2){// East
				this.endPosX = this.posX + 1;
				this.endPosY = this.posY - 1;
			} else {// West
				this.endPosX = this.posX - 1;
				this.endPosY = this.posY + 1;
			}
			//calculate the center or rotation
			this.centerX = this.posX;
			this.centerY = this.endPosY;
		} 
	}
	
	drawSegment(){
		ctxBackground.beginPath();
		ctxBackground.arc(this.centerX*CELLSIZE, this.centerY*CELLSIZE, CELLSIZE,
							this.startAngle,this.startAngle-Math.PI/2, true);	
		ctxBackground.stroke();
	}

	getPositionXY(advance){
		let third = 1/2;
		let pos = [this.posX,this.posY];
		let signs = [Math.sign(this.posX-this.endPosX),Math.sign(this.posY-this.endPosY)];

		if(this.orientation%2 ==0){//North/South -> vertical then horizontal
		
			if(advance < third){//Less than a third of the segment done
				pos[1] += advance*signs[1];
			} else {
				pos[1] += third*signs[1];
		 		advance -= third;
				if(advance < third){//between one and two third done
					pos[0] +=advance*signs[0];
					pos[1] +=advance*signs[1];
				} else {//more than two third done
					pos[0] +=third*signs[0];
					pos[1] +=third*signs[1];
					advance -= third;
					pos[0] +=advance*signs[0];
				}
			}
		} else { // East/West -> horizontal then vertical
		
			if(advance < third){//Less than a third done
				pos[0] += advance*signs[0];
			} else {
				pos[0] += third*signs[0];
		 		advance -= third;
				if(advance < third){//between one and two third done
					pos[0] +=advance*signs[0];
					pos[1] +=advance*signs[1];
				} else {//more than two third done
					pos[0] +=third*signs[0];
					pos[1] +=third*signs[1];
					advance -= third;
					pos[1] +=advance*signs[1];
				}
			}
		}
		return pos;

	}

}

class RightTurnSegment extends PathSegment{
	constructor(path){
		super(RIGHT,path.orientation, 3/2, path);
		//Starting angle
		this.startAngle = Math.PI*(this.orientation-2)/2;
	}

	calculateEndPos(){
		if(this.orientation%2 == 0){
			if(this.orientation < 2){// North
				this.endPosX = this.posX + 1;
				this.endPosY = this.posY - 1;
			} else { // South
				this.endPosX = this.posX - 1;
				this.endPosY = this.posY + 1;
			}
			this.centerX = this.endPosX;
			this.centerY = this.posY;
		} else {
			if(this.orientation < 2){// East
				this.endPosX = this.posX + 1;
				this.endPosY = this.posY + 1;
			} else {// West
				this.endPosX = this.posX - 1;
				this.endPosY = this.posY - 1;
			}
			this.centerX = this.posX;
			this.centerY = this.endPosY;
		}
	}
	
	drawSegment(){
		ctxBackground.beginPath();
		ctxBackground.arc(this.centerX*CELLSIZE,this.centerY*CELLSIZE,CELLSIZE,
							this.startAngle,this.startAngle+Math.PI/2,false);
		ctxBackground.stroke();
	}

	getPositionXY(advance){
		let third = 1/2;
		let pos = [this.posX,this.posY];
		let signs = [Math.sign(this.posX-this.endPosX),Math.sign(this.posY-this.endPosY)];

		if(this.orientation%2 ==0){//North/South -> vertical then horizontal
		
			if(advance < third){//Less than a third of the segment done
				pos[1] += advance*signs[1];
			} else {
				pos[1] += third*signs[1];
		 		advance -= third;
				if(advance < third){//between one and two third done
					pos[0] +=advance*signs[0];
					pos[1] +=advance*signs[1];
				} else {//more than two third done
					pos[0] +=third*signs[0];
					pos[1] +=third*signs[1];
					advance -= third;
					pos[0] +=advance*signs[0];
				}
			}
		} else { // East/West -> horizontal then vertical
		
			if(advance < third){//Less than a third done
				pos[0] += advance*signs[0];
			} else {
				pos[0] += third*signs[0];
		 		advance -= third;
				if(advance < third){//between one and two third done
					pos[0] +=advance*signs[0];
					pos[1] +=advance*signs[1];
				} else {//more than two third done
					pos[0] +=third*signs[0];
					pos[1] +=third*signs[1];
					advance -= third;
					pos[1] +=advance*signs[1];
				}
			}
		}
		return pos;
	}
}

class PathModel {
	/*
	 * At the construction, all models point North and start at the bottom left corner
	 * When applied to a path, we make the change needed
	 */
	constructor(instructions,direction, endLeftCorner){
		//Instruction is an array composed of :
		//"r", "l" for right and left turn, and numbers for straight segment
		//(number = lenght of the straight segment)
		this.instructions = instructions;
		this.direction = direction;
		this.startLeftCorner = true;
		this.endLeftCorner = endLeftCorner;
	}

	createPath(lastPath){
		let newPath;
		if(lastPath.endLeftCorner){
			newPath = new Path(lastPath.posX, lastPath.posY, this.direction,
				lastPath.orientation, true, this.endLeftCorner);
			console.log(newPath);
			//add the segments to the path
			this.instructions.forEach(function(element){
				this.addInstruction(newPath,element, false);
			},this);
		} else {
			newPath = new Path(lastPath.posX, lastPath.posY, -this.direction,
				lastPath.orientation, false, !this.endLeftCorner);
			console.log(newPath);
			//add the segments to the path
			this.instructions.forEach(function(element){
				this.addInstruction(newPath,element, true);
			},this);
		}
		return newPath;
	}
	//Add a new segment corresping to the instruction
	addInstruction(path,instruction,invert){
		let seg;
		if(invert){ // We have to invert the segment
			switch(instruction){
				case "l" :
					seg = new RightTurnSegment(path);
					break;
				case "r" :
					seg = new LeftTurnSegment(path);
					break;
				default :
					seg = new StraightSegment(instruction, path);
			}
		}else { // Do no invert the segment
			switch(instruction){
				case "r" :
					seg = new RightTurnSegment(path);
					break;
				case "l" :
					seg = new LeftTurnSegment(path);
					break;
				default :
				 	seg = new StraightSegment(instruction, path);
			}
		}
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
        this.pos = [this.currentSegment.posX,this.currentSegment.posY];
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


function loadImage(){
    //TODO loadImage
	getGrassTexture();
}

function getGrassTexture(){
    grassTexture.onload = function() {//when the texture is loaded
        grassPattern =ctxBackground.createPattern(grassTexture, "repeat");
        getRoadTexture();//call the road texture when hte grass one is ready
    }
    grassTexture.src = "img/grass.jpg";
}

function getRoadTexture(){
    roadTexture.onload = function() {//when texture is loaded
        roadPattern =ctxBackground.createPattern(roadTexture, "repeat");
        getTowerImage();
    }
    roadTexture.src = "img/road.jpg";
}

function getTowerImage(){
    towerImage.onload = function(){
		drawBackGround();
        console.log("towers drawn");
		getPlaneImage();
    }
    towerImage.src = "img/antTower.png";
	let tester;
	for(let j = 0; j< paths.length;j++){
		tester = new AreaTester(paths[j]);
		tester.testArea();
	}
}

function getPlaneImage(){
	planeImage.onload = function() {//when image is loaded
		//createPool();
    	startFly();
	}
	planeImage.src = "img/paperplane.png";
}

function drawBackGround(){
	//Check if textures are loaded
	//TODO
	//Draw grass
    ctxBackground.fillStyle=grassPattern;
    ctxBackground.fillRect(0,0,SIZE,SIZE);
	//Draw Road
	paths.forEach(function(path){
		path.drawPath();
		//Draw the path towers
		path.towers.forEach(function(tower){
			tower.draw();
		});
	});
	
}

function mainLoop(){
    //TODO Main loop of the game
}

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


function createPath(i){
	let path;
	let lastPath;
	if(paths.length == 0){
		lastPath = new Path(0,1,STRAIGHT,EAST,true,true);
	} else {
		lastPath = paths[paths.length-1];
	}
	path = pathModels.left[i].createPath(lastPath);
	return path;
}
let currentModel;
function generatePathModels(){
	let pathModel;
	// RIGHT TRUE
	pathModel = new PathModel([2,"r",1,"r","l",1,"l",1,"l",3,"r",1,"r",5],RIGHT,true);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([6,"r",2,"r","r","l",2,"l",2,"l",4,"r"],RIGHT,true);
	pathModels.left.push(pathModel);
	//RIGHT FALSE
	pathModel = new PathModel(["r",2,"l",2,"l","l","r","r",2,"r",4,"r",4,"l"],RIGHT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([6,"r",4,"r","r",2,"l","l",1,"r","l",1],RIGHT,false);
	pathModels.left.push(pathModel);
	// LEFT TRUE IS IMPOSSIBLE
	// LEFT FALSE
	pathModel = new PathModel([4,"r",2,"r","r","l","l",2,"l",4,"l",6],LEFT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel(["r",4,"l",1,"l","r",1,"l","l",2,"r","r",2,"l"],LEFT,false);
	pathModels.left.push(pathModel);
	// STRAIGHT TRUE
	pathModel = new PathModel(["r",2,"l","l",2,"r","r",4,"l","l",4,"r"],STRAIGHT,true);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([5,"r","r",3,"l",2,"l",1,"l","r",1,"l",2,"r"],STRAIGHT,true);
	pathModels.left.push(pathModel);
	// STRAIGHT FALSE
	pathModel = new PathModel([6,"r","r",4,"l",2,"l","l","r",1,"r","l",1],STRAIGHT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([2,"r","r","l",2,"l","l",1,"r","l",1,"r","r",4,"l"],STRAIGHT,false);
	pathModels.left.push(pathModel);
}


function init(){
    //TODO make init
	loadImage();
	generatePathModels();
	paths.push(createPath(0));
	paths.push(createPath(5));
	paths.push(createPath(3));
	paths.push(createPath(2));
	console.log("end of init");
}
init();
