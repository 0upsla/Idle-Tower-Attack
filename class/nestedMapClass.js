class nestedMaps{
	constructor(models){
		this.maxLevel = 1;
		this.models = models;
		this.pointers = [];
		this.pointers.push(models.getNext());
	}

	addLevel(){
		this.maxLevel++;
		newPointer = new MapNode(maxLevel);
		newPointer.setChild(this.pointers[maxLevel-1]);
		this.pointers.push(newPointer);
	}

	nextMap(){
		let currentLevel = 1;
		newItinerary = this.models.getNext();
		while(!this.pointers[currentLevel].addChild(newItinerary)){
			currentLevel++;
			if (currentLevel == this.maxLevel){
				this.addLevel
			}
		}
	}
}


class MapNode{
	constructor(level){
		this.level = level;
		this.MAXCHILD = Math.pow(level,2);
		this.childNodes = [];
		this.itinerary = null;
	}


	addChild(childNode){
		if(childNode.level-1 == this.level){
			this.childNodes.push(childNode);
			return true;
		} else {
			return false;
		}
	}
	 setPath(newItinerary){
	 	this.itinerary = newItinerary;
	 }

	drawMap(){
		if(this.level === 0){
			this.itinerary.drawPath();
		} else {
			this.childNodes.forEach(function(node) {
				node.drawMap();
			});
		}
	}
}
//TODO know the type of your next child
//TODO learn your new orientation when you add a child

