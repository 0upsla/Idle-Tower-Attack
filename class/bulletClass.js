class Bullet {
    constructor(plane, DMG, bulletType, tower){
        this.target = plane;
        this.DMG = DMG;
        this.type = bulletType;
        this.posX = tower.posX;
        this.posY = tower.posY;
        this.hit = false;
        this.tower = tower;
        if(this.type == "normal"){
            this.image = normalBulletImage;
            this.speed = 10;
            
        }
    }
        
    fly(timeDiff){
        if(!this.target.stillFly){
            if(this.tower.planesInRange.length > 0){
                this.target = this.tower.planesInRange[0];
            } else if(planes.length > 0){
				this.target = planes[0];
			}else {this.hit = true;}
        }
		let flyDistance = this.speed*timeDiff*BASESPEED;
        let distX = this.target.posX - this.posX ;
        let distY = this.target.posY - this.posY ;
        let distDiag = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2));
        if(distDiag <= flyDistance){
            this.posX = this.target.posX;
            this.posY = this.target.posY;
			this.target.hit(this.DMG);
			this.hit = true;
        } else {
            let depX = distX*flyDistance/distDiag;
            let depY = distY*flyDistance/distDiag;
            this.posX += depX;
            this.posY += depY;
        }
        this.speed *= 1.05;
    }

    draw(){
        ctxAnimation.strokeStyle = "red";
        ctxAnimation.lineWidth = CELLSIZE*0.1;
        ctxAnimation.beginPath();
        ctxAnimation.arc(this.posX,this.posY,CELLSIZE*0.05,0,Math.PI*2);
        ctxAnimation.stroke();

    }
}

