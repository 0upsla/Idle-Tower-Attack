
function loadImage(){
    //TODO loadImage
	getGrassTexture();
}

function getGrassTexture(){
    grassTexture.onload = function() {//when the texture is loaded
        grassPattern =ctxBackground.createPattern(grassTexture, "repeat");
        ctxBackground.fillStyle=grassPattern;
        ctxBackground.fillRect(0,0,SIZE,SIZE);
        getRoadTexture();//call the road texture when hte grass one is ready
    }
    grassTexture.src = "img/grass.jpg";
}

function getRoadTexture(){
    roadTexture.onload = function() {//when texture is loaded
        roadPattern =ctxBackground.createPattern(roadTexture, "repeat");
		//Draw the paths
		for(let i=0; i< paths.length;i++){
			paths[i].draw();
		}
        getTowerImage();
    }
    roadTexture.src = "img/road.jpg";
}

function getTowerImage(){
    towerImage.onload = function(){
        for(let i = 0; i< paths.length; i++){
			for( let j = 0; j<paths[i].towers.length;j++ ){
				paths[i].towers[j].draw();
			}
        }
        console.log("towers drawn");
		getPlaneImage();
    }
    towerImage.src = "img/antTower.png";
	let tester;
	for(let j = 0; j< paths.length;j++){
		tester = new AreaTester(paths[j]);
		tester.testArea();
	}
}

function getPlaneImage(){
	planeImage.onload = function() {//when image is loaded
		//createPool();
    	startFly();
	}
	planeImage.src = "img/paperplane.png";
}

