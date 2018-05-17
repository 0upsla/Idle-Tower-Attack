class Tower {
    constructor(posX, posY, range, attackSpeed, attackDMG, bulletType){
        this.posX = posX;
        this.posY = posY;
        this.range = range;
        this.attackSpeed = attackSpeed;
        this.attackDMG = attackDMG;
        this.planesInRange = [];
        this.bulletType = bulletType;
        this.attackTimer = attackSpeed*FRAMERATE;
    }

    draw(){
        ctxBackground.drawImage(towerImage,this.posX-CELLSIZE/2,this.posY-CELLSIZE/2,
                CELLSIZE,CELLSIZE);
        ctxBackground.strokeStyle ="rgba(200,200,200,0.8)";
        ctxBackground.lineWidth = CELLSIZE*0.03;
        ctxBackground.beginPath();
        ctxBackground.arc(this.posX,this.posY,this.range,0,Math.PI*2);
        ctxBackground.stroke();
    }

    attack(timeDiff){
        if(this.attackTimer > 0){
            this.attackTimer -= timeDiff;
        } else {
			while(this.planesInRange.length > 0 && !this.planesInRange[0].stillFly){
				this.planesInRange.splice(0,1);
			}
			if(this.planesInRange.length > 0){
				this.sendBullet(this.planesInRange[0]);
				this.attackTimer = this.attackSpeed*FRAMERATE;
			}
		}
    }

    sendBullet(plane){
        bullets.push(new Bullet(plane, this.attackDMG,this.bulletType, this));
    }

	changePlane(plane){
		let index = this.planesInRange.indexOf(plane);
		if(index < 0){
			this.planesInRange.push(plane);
		} else {
			this.planesInRange.splice(index,1);
		}
	}
}

