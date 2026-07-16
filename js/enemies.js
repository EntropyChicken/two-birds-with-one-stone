var enemyLookUp = [
    {name:"Reaper",speed:0.35,hp:82804590,diameter:40,cs:"black"},
    {name:"Basic",speed:0.35,hp:30,diameter:24,cs:"red"},
    {name:"Little Rat Boy",speed:0.7,hp:10,diameter:12,cs:"grey"},
    {name:"Dancer",speed:0.9,hp:20,diameter:24,cs:"white"},
    {name:"Brute",speed:0.25,hp:100,diameter:40,cs:"red"},
    {name:"Dasher",speed:0.7,hp:20,diameter:24,cs:"yellow"},
    {name:"Summoner",speed:2.7,hp:320,diameter:64,cs:"black"},
];

var spawnEnemy = function(type,optionalx,optionaly){
    var x,y;
    if(arguments.length===1){
        if(random(0,2)<1){
            x=floor(random(0,2))*700-350;
            y=random(-250,250);
        }
        else{
            x=random(-350,350);
            y=floor(random(0,2))*500-250;
        }
    }
    else{
        x=optionalx;
        y=optionaly;
    }
    enemies.push({
        type:type,
        x:x,
        y:y,
        speed:enemyLookUp[type].speed,
        ang:atan2(-y,-x),
        aesang:0,
        hp:enemyLookUp[type].hp,
        diameter:enemyLookUp[type].diameter,
        cs:enemyLookUp[type].cs,
    });
};

var drawEnemy = function(obj){
    push();
    translate(obj.x,obj.y);
    push();
    rotate(obj.ang+obj.aesang);
    strokeWeight(3);
    switch(obj.cs){
        case "red": stroke(212, 71, 40); fill(230, 137, 97); break;
        case "grey": stroke(143, 109, 104); fill(194, 152, 135); break;
        case "white": stroke(176, 176, 176); fill(227, 227, 227); break;
        case "yellow": stroke(163, 147, 74); fill(204, 175, 106); break;
        case "black": stroke(41, 41, 41); fill(84, 84, 84); break;
    }
    rect(-obj.diameter/2,-obj.diameter/2,obj.diameter,obj.diameter,obj.diameter/3.3);
    pop();
    if(obj.hp>70000000){
        fill(255); textSize(32); noStroke(); text("∞",-0.5,0);
    }
    else if(obj.hp>0){
        fill(0); textSize(obj.diameter/4+7);
        noStroke(); text(obj.hp,0,0);
        noStroke(); text(obj.hp,-0.5,0);
    }
    pop();
};

var operateEnemy = function(obj){
    if(obj.type===3){
        obj.ang=angTo(obj.ang,atan2(-obj.y,-obj.x)+90*sin(2*ganime),4);
    }
    else if(obj.type===6){
        if(dist(obj.x,obj.y,0,0)>250){
            obj.ang=angTo(obj.ang,atan2(-obj.y,-obj.x)+75,3);
        }
        else{
            obj.ang=angTo(obj.ang,atan2(-obj.y,-obj.x)+90,2);
        }
        if(ganime%360<32&&ganime%8===0){
            spawnEnemy(1,obj.x+random(-50,50),obj.y+random(-50,50));
            enemies[enemies.length-1].hp=10;
        }
    }
    else{
        obj.ang=angTo(obj.ang,atan2(-obj.y,-obj.x),1);
        obj.ang=angTo(obj.ang,atan2(-obj.y,-obj.x),1);
    }
    if(dist(obj.x,obj.y,0,0)<obj.diameter*0.55+33){
        goToLoseScreen();
    }
};

var driftEnemy = function(obj){
    obj.x+=obj.speed*cos(obj.ang);
    obj.y+=obj.speed*sin(obj.ang);
};

var natureEnemy = function(obj,id){
    if(obj.hp<=0){
        if(obj.x<-340||obj.x>340||obj.y<-240||obj.y>240){
            enemies.splice(id,1);
        }
        else{obj.aesang+=1+1.5*obj.speed;}
    }
};

var enemyCheckCollideEnemies = function(obj,id){
    for(var i = 0; i<id; i++){
        if(dist(obj.x,obj.y,enemies[i].x,enemies[i].y)<obj.diameter*0.55+enemies[i].diameter*0.55){
            if(obj.hp<=0&&enemies[i].hp>0){
                enemies[i].hp=0;
                enemies[i].ang=obj.ang;
                enemies[i].speed=obj.speed;
                spawnParticleGroup(3+7*(enemies[i].type!==2),obj.x/2+enemies[i].x/2,obj.y/2+enemies[i].y/2,obj.ang,25,obj.speed,8,[130,130,130,255]);
            }
            else if(enemies[i].hp<=0&&obj.hp>0){
                obj.hp=0;
                obj.ang=enemies[i].ang;
                obj.speed=enemies[i].speed;
                spawnParticleGroup(3+5*(enemies[i].type!==2),obj.x/2+enemies[i].x/2,obj.y/2+enemies[i].y/2,enemies[i].ang,45,enemies[i].speed,8,[130,130,130,255]);
            }
            else{
                var ang = atan2(enemies[i].y-obj.y,enemies[i].x-obj.x);
                var dst = 0.5*(dist(obj.x,obj.y,enemies[i].x,enemies[i].y)-obj.diameter*0.55-enemies[i].diameter*0.55);
                if(obj.type!==6){
                    obj.x+=dst*cos(ang);
                    obj.y+=dst*sin(ang);
                }
                if(enemies[i].type!==6){
                    enemies[i].x-=dst*cos(ang);
                    enemies[i].y-=dst*sin(ang);
                }
            }
        }
    }
};