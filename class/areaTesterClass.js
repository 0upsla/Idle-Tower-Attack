class AreaTester {
    
    constructor(path){
        this.path = path;
        this.currentSegment = path.segments[0];
        this.segmentNB = 0;
        this.advance = 0;
        this.listOfAreas = path.listOfAreas;
        this.towerOutOfRange = [];
        this.towerInRange = [];
        this.pos = [this.currentSegment.posX,this.currentSegment.posY];
    }

    testArea(){
        let dist = 0;
		let towers = this.path.towers;
		this.advance = 0;
		this.currentSegment = this.path.segments[0];
		this.segmentNB = 0;
		let speed = CELLSIZE/2500;
        let currentTower = null;
        this.towerOutOfRange = [];
		this.towerInRange = [];
		this.calculatePos();
		for(let i=0;i<towers.length;i++){
			currentTower =towers[i];
			if(this.inRangeOfTower(currentTower)){
				this.towerInRange.push(currentTower);
				this.listOfAreas.push(new Area(this.path, 0), currentTower);
			} else {
				this.towerOutOfRange.push(currentTower);
			}
		}
		console.log("position of tester ", this.pos );
        while(this.segmentNB < this.path.segments.length){
            if(this.advance > this.currentSegment.length){
                this.advance -= this.currentSegment.length;
                this.segmentNB++;
                this.currentSegment = this.path.segments[this.segmentNB];
            } else {
                this.advance+=5;
                this.calculatePos();
                for(let i=0; i< this.towerOutOfRange.length;i++){
                    currentTower = this.towerOutOfRange[i];
                    if(this.inRangeOfTower(currentTower)){
                        this.listOfAreas.push(new Area(this.path,this.currentSegment.startingPosition + this.advance),
                                currentTower);
                        this.towerInRange.push(currentTower);
                        this.towerOutOfRange.splice(i,1);
                        i--;
                    }
                }
                for(let i=0;i< this.towerInRange.length;i++){
                    currentTower = this.towerInRange[i];
                    if(!this.inRangeOfTower(currentTower)){
                        this.listOfAreas.push(new Area(this.path, this.currentSegment.startingPosition + this.advance),
                                currentTower);
                        this.towerOutOfRange.push(currentTower);
                        this.towerInRange.splice(i,1);
                    }
                }
            }
        }
		for(let i=0;i< this.towerInRange.length;i++){
			currentTower = this.towerInRange[i];
			this.listOfAreas.push(new Area(this.path, this.path.length), currentTower);
		}
		this.listOfAreas.lastArea.endPos=this.path.length + 50;
		console.log("Tested Area : ",this.listOfAreas);
    }
    
	inRangeOfTower(tower){
		let dist =Math.sqrt( Math.pow(tower.posX - this.pos[0],2) 
                        + Math.pow(tower.posY - this.pos[1],2));
		if(tower.range >= dist){
			return true;
		} else {
			return false;
		}
	}

    calculatePos(){
		let calculatePosition = this.currentSegment.getPositionXY(this.advance);
		this.pos = [calculatePosition[0],calculatePosition[1]];
    }
}

class ListOfArea {
    constructor(path){
        this.path = path;
        this.lastArea = new Area(this.path, -100);
        this.areas = [this.lastArea];
    }

    push(area,tower) {
        if(this.lastArea.isSame(area)){
            this.lastArea.changeTower(tower);
        } else {
            this.lastArea.endPos = area.startingPos;
            this.areas.push(area);
            this.lastArea = area;
            area.changeTower(tower);
        }
    }
}

class Area {
    constructor(path, startingPos){
        this.path = path;
        this.endPos = 0;
		this.startingPos = startingPos
        this.changingTower = [];
    }

    changeTower(tower){
		let index = this.changingTower.indexOf(tower);
        if(index < 0){
            this.changingTower.push(tower);
        } else {
			this.changingTower.splice(index,1);
		}
    }

    isSame(area){
        if(area instanceof Area){
            if(this.path == area.path &&
                Math.abs(this.startingPos -area.startingPos) < 10){
					console.log("Same Area");
                    return true;
            }
        }
        return false;
    }

}

