class pathModel {
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
		if(lastPath.startLeftCorner){
			newPath = (lastPath.posX, lastPath.posY, this.direction,
				lastPath.orientation, true, this.endLeftCorner);
			//add the segments to the path
			instruction.forEach(addInstruction(newPath,instruction, false));
		} else {
			newPath = (lastPath.posX, lastPath.posY, -this.direction,
				lastPath.orientation, false, !this.endLeftCorner);
			//add the segments to the path
			instruction.forEach(addInstruction(newPath,instruction, true));
		}
	}
	//Add a new segment corresping to the instruction
	addInstruction(path,instruction,invert){
		if(invert){ // We have to invert the segment
			switch(instruction){
				case "l" :
					let seg = new rightTurnSegment(path);
					break;
				case "r" :
					let seg = new leftTurnSegment(path);
					break;
				default :
					let seg = new straightSegment(instruction, path);
			}
		}else { // Do no invert the segment
			switch(instruction){
				case "r" :
					let seg = new rightTurnSegment(path);
					break;
				case "l" :
					let seg = new leftTurnSegment(path);
					break;
				default :
					let seg = new straightSegment(instruction, path);
			}
		}
	}
}
