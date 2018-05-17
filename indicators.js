
//indicators
//TODO make a prototype for indicators
let gold = 0;
let goldIndicator = document.getElementById('gold');
let planeSpeed = 5;
let planeSpeedIndicator = document.getElementById('planeSpeed');
let planeLimit = 10000;
let planeLimitIndicator = document.getElementById('planeLimit');
let planeLimitPrice = 0;
let autoLauncherTimer = 1000;
let autoLauncherTimerIndicator = document.getElementById('autoLauncherTimer');
let autoLauncherMultiply = 1;
let planesIndicator = document.getElementById('planes');
function autoLauncher(){
    autoLaunchBTN.onclick = function(){
			autoLauncherTimer *= 0.9;
			if(autoLauncherTimer < 20){
				autoLauncherTimer = 100;
				autoLauncherMultiply *= 5;
			}
	};
    let loop = function(){
		let target = Math.min(autoLauncherMultiply, planeLimit - planes.length);
		for (let i=0; i< target;i++){
        	launchPlane();
		}
        setTimeout(function(){loop();},autoLauncherTimer); 
    }
    loop();
}        

function launchPlane(){
    if(planes.length<planeLimit){
        let newPlane = new Plane(paths[0]); 
        planes.push(newPlane);
    } else {
        console.log("no more space for more plane");
    }
}

//button evenements
//get the buttons
let planeLaunchBTN = document.getElementById("planeLaunchBTN");
let fasterPlanesBTN = document.getElementById("fasterPlanesBTN");
let morePlanesBTN = document.getElementById("morePlanesBTN");
let autoLaunchBTN = document.getElementById("autoLaunchBTN");

//assign events
planeLaunchBTN.onclick = launchPlane;
fasterPlanesBTN.onclick = function(){planeSpeed++};
morePlanesBTN.onclick = function(){
    if(gold >= planeLimitPrice){
        gold -=planeLimitPrice;
        updateIndicator();
        planeLimit++;
        //planeLimitPrice *=1.2;
    } else {
        console.log("not enough gold");
    }
};
autoLaunchBTN.onclick = autoLauncher;

function updateIndicator(){
    goldIndicator.innerHTML="Gold : " + gold;
    planesIndicator.innerHTML = "Planes : " + planes.length + "/" + planeLimit;
    planeSpeedIndicator.innerHTML = "Speed : " + planeSpeed;
    autoLauncherTimerIndicator.innerHTML = "Timer for launch : " + autoLauncherTimer;
};
