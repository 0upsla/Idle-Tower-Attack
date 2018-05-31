class PathModel {
	/*
	 * At the construction, all models point North and start at the bottom left corner
	 * When applied to a path, we make the change needed
	 */
	constructor(instructions,direction, endLeftCorner){
		//Instruction is an array composed of :
		//"r", "l" for right and left turn, and numbers for straight segment
		//(number = lenght of the straight segment)
		//PathModels always start left corner, coming from west.
		this.instructions = instructions;
		this.direction = direction;
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
