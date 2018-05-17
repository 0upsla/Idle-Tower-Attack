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

