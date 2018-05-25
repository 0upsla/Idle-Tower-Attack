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
			console.log(seg.direction,seg.posX,seg.posY,seg.endPosX,seg.endPosY);
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
