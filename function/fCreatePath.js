
function createPath(i){
	let path;
	let lastPath;
	if(paths.length == 0){
		lastPath = new Path(0,1,STRAIGHT,EAST,true,true);
	} else {
		lastPath = paths[paths.length-1];
	}
	path = pathModels.left[i].createPath(lastPath);
	return path;
}
let currentModel;
function generatePathModels(){
	let pathModel;
	// RIGHT TRUE
	pathModel = new PathModel([2,"r",1,"r","l",1,"l",1,"l",3,"r",1,"r",5],RIGHT,true);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([6,"r",2,"r","r","l",2,"l",2,"l",4,"r"],RIGHT,true);
	pathModels.left.push(pathModel);
	//RIGHT FALSE
	pathModel = new PathModel(["r",2,"l",2,"l","l","r","r",2,"r",4,"r",4,"l"],RIGHT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([6,"r",4,"r","r",2,"l","l",1,"r","l",1],RIGHT,false);
	pathModels.left.push(pathModel);
	// LEFT TRUE IS IMPOSSIBLE
	// LEFT FALSE
	pathModel = new PathModel([4,"r",2,"r","r","l","l",2,"l",4,"l",6],LEFT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel(["r",4,"l",1,"l","r",1,"l","l",2,"r","r",2,"l"],LEFT,false);
	pathModels.left.push(pathModel);
	// STRAIGHT TRUE
	pathModel = new PathModel(["r",2,"l","l",2,"r","r",4,"l","l",4,"r"],STRAIGHT,true);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([5,"r","r",3,"l",2,"l",1,"l","r",1,"l",2,"r"],STRAIGHT,true);
	pathModels.left.push(pathModel);
	// STRAIGHT FALSE
	pathModel = new PathModel([6,"r","r",4,"l",2,"l","l","r",1,"r","l",1],STRAIGHT,false);
	pathModels.left.push(pathModel);
	pathModel = new PathModel([2,"r","r","l",2,"l","l",1,"r","l",1,"r","r",4,"l"],STRAIGHT,false);
	pathModels.left.push(pathModel);
}

