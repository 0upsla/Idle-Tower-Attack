
function init(){
    //TODO make init
	loadImage();
	generatePathModels();
	paths.push(createPath(0));
	paths.push(createPath(5));
	paths.push(createPath(3));
	paths.push(createPath(2));
	console.log("end of init");
}
init();
