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

class straightSegment {
	constructor ( orientation, length, path){
		super(STRAIGHT, orientation, length, path);
	}

	calculateEndPos(){
		this.endPosX = this.posX + ((2-this.orientation)%2)*this.length;
		this.endPosY = this.posY + ((this.orientation -1 )%2)*this.length;
	}
	
	drawSegment(){
		ctxBackground.beginPath();
		ctxBackground.moveTo(this.posX*CELLSIZE, this.posY*CELLSIZE);
		ctxBackground.lineTo(this.endPosX*CELLSIZE, this.endPosY*CELLSIZE);
		ctx.Background.stroke();
	}

	getPositionXY(advance){
		//Return the position of the plane in an array [X,Y]
		let pos = [0,0];
		pos[0] = this.posX + ((2-this.orientation)%2)*advance;
		pos[1] = this.posY + ((this.orientation -1)%2)*advance;
		return pos;
	}
}

class leftTurnSegment {
	constructor (orientation, path){
		super(LEFT, orientation, 3/2, path);
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
		ctxBackground.arc(this.centerX, this.centerY, CELLSIZE,
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

class rightTurnSegment {
	constructor(orientation, path){
		super(RIGHT,orientation, 1*3/2, path);
		//Starting angle
		this.startAngle = Math.PI*this.orientation/2;
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
		ctxBackground.arc(this.centerX,this.centerY,CELLSIZE,
							this.startAngle,this.startAngle+Math.PI/2,true);
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

