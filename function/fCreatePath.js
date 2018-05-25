
function createPath(i){
	let path;
	let lastPath;
	if(paths.length == 0){
		lastPath = new Path(0,1,STRAIGHT,EAST,true,true);
	} else {
		lastPath = paths[paths.length-1];
	}
	path = pathModels.right[0].createPath(lastPath);
	return path;
}

function generatePathModels(){
	let pathModel;
	pathModel = new PathModel([6,"r",2,"r","r","l",2,"l",2,"l",4,"r"],RIGHT,true);
	pathModels.right.push(pathModel);
	pathModel = new PathModel([4,"r",2,"r","r","l","l",2,"l",4,"l",6],LEFT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel(["l",4,"r","r",4,"l",2,"l","l",1,"r",1,"r",1,"l",1],LEFT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel(["l",2,"r","r",2,"l","l",4,"r","r",4,"l"],STRAIGHT,false);
	pathModels.straight.push(pathModel);
}

