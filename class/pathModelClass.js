class pathModel {
	/*
	 * At the construction, all models point North and start at the bottom left corner
	 * When applied to a path, we make the change needed
	 */
	constructor(instructions,direction, endLeftCorner){
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
		if(invert){
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
		}else {
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
