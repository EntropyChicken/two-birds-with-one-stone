var createBullet = function(x,y,speed,ang){
    bullets.push({
        x:x,
        y:y,
        speed:speed,
        ang:ang,
    });
};

var drawBullet = function(obj){
    stroke(32, 118, 158);
    fill(46, 121, 156);
    ellipse(obj.x,obj.y,9,9);
};

var driftBullet = function(obj,frac){
    obj.x+=frac*obj.speed*cos(obj.ang);
    obj.y+=frac*obj.speed*sin(obj.ang);
};

var natureBullet = function(obj,id){
    if(obj.x<-330||obj.x>330||obj.y<-230||obj.y>230){
        bullets.splice(id,1);
    }
};

var bulletCheckCollideEnemies = function(obj){
    for(var i = 0; i<enemies.length; i++){
        if(dist(obj.x,obj.y,enemies[i].x,enemies[i].y)<enemies[i].diameter*0.7+6){
            spawnParticleGroup(5,obj.x,obj.y,obj.ang,25,obj.speed/2,7,[46, 121, 156,200]);
            enemies[i].hp-=10;
            if(enemies[i].hp<=0){
                enemies[i].speed=obj.speed/2;
                enemies[i].ang=obj.ang;
                enemies[i].hp=0;
                spawnParticleGroup(12,obj.x,obj.y,0,180,obj.speed/7,9,[46, 121, 156,222]);
            }
            return(true);
        }
    }
    return(false);
};

var bulletCheckCollideGem = function(obj){
    if(dist(obj.x,obj.y,0,0)<42){
        goToLoseScreen();
        return(true);
    }
    return(false);
};