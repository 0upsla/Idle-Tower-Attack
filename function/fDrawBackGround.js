function drawBackGround(){
	//Check if textures are loaded
	//TODO
	//Draw grass
    ctxBackground.fillStyle=grassPattern;
    ctxBackground.fillRect(0,0,SIZE,SIZE);
	//Draw Road
	paths.forEach(function(path){
		path.drawPath();
		//Draw the path towers
		path.towers.forEach(function(tower){
			tower.draw();
		});
	});
	
}
