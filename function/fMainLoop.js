
function mainLoop(){
    //TODO Main loop of the game
}

function startFly(){
    let loop = setInterval(function(){
		mainLoopDiff = Date.now() - mainLoopStart;
		mainLoopStart = Date.now();
        ctxAnimation.clearRect(0,0,SIZE,SIZE);
        for( let i=0; i<planes.length;i++){
            planes[i].fly(mainLoopDiff);
            if(!planes[i].stillFly){
                planes.splice(i,1);
                i--;
				continue;
            }
            planes[i].draw();
        }
        for(let i=0; i< paths.length; i++){
            for(let j=0; j< paths[i].towers.length;j++){
				paths[i].towers[j].attack(mainLoopDiff);
			}
        }
        for(let i=0;i<bullets.length;i++){
            bullets[i].fly(mainLoopDiff);
            bullets[i].draw();
            if(bullets[i].hit){
                bullets.splice(i,1);
                i--;
            }
        }
        updateIndicator();
    },FRAMERATE);
}

