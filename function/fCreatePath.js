
function createPath(i){
	let path;
	let lastPath;
	if(paths.length == 0){
		lastPath = new Path(0,CELLSIZE,EAST);
	} else {
		lastPath = paths[paths.length-1];
	}
	path = new Path(lastPath.pos[0], lastPath.pos[1], lastPath.direction);
		let	model = pathModels.left[0];
	for(let j=0;j< model.length;j++){
		switch (model[j]) {
			case "l" : 
				path.addLeftTurn();
				break;
			case "r" :
				path.addRightTurn();
				break;
			default : 
				path.addStraight(model[j]*CELLSIZE);
		}
	}
	return path;
}

function generatePathModels(){
	pathModels.right.push([6,"r",2,"r","r","l",2,"l",2,"l",4,"r"]);
	pathModels.left.push([4,"r",2,"r","r","l","l",2,"l",4,"l",6]);
	pathModels.left.push(["l",4,"r","r",4,"l",2,"l","l",1,"r",1,"r",1,"l",1]);
	pathModels.straight.push(["l",2,"r","r",2,"l","l",4,"r","r",4,"l"]);
}

