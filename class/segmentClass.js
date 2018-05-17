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

