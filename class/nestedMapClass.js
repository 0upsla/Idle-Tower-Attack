class NestedMap{
	constructor(level, size ){
		this.level = level;
		this.size = size;
		this.MAXCHILD = Math.pow(size,2);
		this.childMaps = [];
	}
	defineParentMap(parentMap) {
		this.parentMap = parentMap;	
	}
	addChildMap(newChildMap){
		if(this.childMaps.length < this.MAXCHILD ){
			newChildMap.defineParentMap(this);
			this.childMaps[this.childMaps.length-1].setNextMap(newChildMap);
			this.childMaps.push(newChildMap);
			return true;
		} else {
			return false;
		}
	}

	setNextMap(nextMap){
		this.nextMap = nextMap;
	}
	
}
//TODO know the type of your next child
//TODO learn your new orientation when you add a child

