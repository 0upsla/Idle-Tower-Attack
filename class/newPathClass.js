/*
 *Path is the class for the path of the planes.
 *It is the most basic map object
 *It contains the towers
 */
class Path {
	
	constructor(posX, posY, direction, orientation){
		this.segments = [];
		this.length = [];
		//Position of the path on the canvas
		this.posX = posX;
		this.posY = posY;
		//direction is the general direction of the whole path
		//direction is Left, Straight or Right (-1,0 or 1);
		this.direction = direction;
		//Orientation is rapport the cardinals 
		//Nort = 0, East = 1, South = 2, West = 3;
		this.orientation = orientation;
		//list of the different Areas, AKA where towers in/out of range
		this.listOfAreas = [];
		this.towers = [];
	}

	addSegment(segmentToAdd){
		this.length += segmentToAdd.length;
		this.segments.push(segmentToAdd);
		this.orientation = (this.orientation + segmentToAdd.direction) % 4;
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
