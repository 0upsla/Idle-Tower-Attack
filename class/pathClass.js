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

