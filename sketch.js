var ganime = ~~(

    4/9/2022 - 4/10/2022
    
);

var mx, my, clickStatus=-2, inp=[];
// clickStatus 1=just clicked 2=holding -2=nothing -1=just released
var screen = 0;
var danime = 0, dimg;
var wave = 0;
var youWonTimer = 0;
var waveHighScore = 1;

var angTo = function(base,aim,strength){
    var b = (base+720)%360, a = (aim+720)%360;
    if(a>180){
        if(b<a&&b>a-180){return(b+strength);}
        else{return(b-strength);}
    }
    else{
        if(b<a||b>a+180){return(b+strength);}
        else{return(b-strength);}
    }
};
var spawnParticleGroup;

var shootAnchor = {x:0,y:0,placed:false};

var enemies = []; // type,x,y,speed,ang,hp,diameter
var bullets = []; // x,y,speed,ang
var imgParticles = []; // img,x,y,xv,yv,xs,ys
var particles = []; // x,y,xv,yv,col

var goToLoseScreen = function(){
    screen=2;
    danime=60;
};
var playAgain = function(){
    screen=1;
    enemies=[];
    bullets=[];
    imgParticles=[];
    particles=[];
    clickStatus=-2;
    danime=0;
    ganime=0;
    wave=0;
};

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
        case "red":
            stroke(212, 71, 40);
            fill(230, 137, 97);
            break;
        case "grey":
            stroke(143, 109, 104);
            fill(194, 152, 135);
            break;
        case "white":
            stroke(176, 176, 176);
            fill(227, 227, 227);
            break;
        case "yellow":
            stroke(163, 147, 74);
            fill(204, 175, 106);
            break;
        case "black":
            stroke(41, 41, 41);
            fill(84, 84, 84);
            break;
    }
    rect(-obj.diameter/2,-obj.diameter/2,obj.diameter,obj.diameter,obj.diameter/3.3);
    pop();
    if(obj.hp>70000000){
        fill(255);
        textSize(32);
        noStroke();text("∞",-0.5,0);
    }
    else if(obj.hp>0){
        fill(0);
        textSize(obj.diameter/4+7);
        noStroke();text(obj.hp,0,0);
        noStroke();text(obj.hp,-0.5,0);
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
                // enemies first killed code here
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

var generateImgParticles = function(){
    var shards = 14;
    // this decides what shapes the img particles are in
    var clusterData = [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
    ];
    var askClusterData = function(x,y){
        if(x<0||x>11||y<0||y>7){
            return(-1);
        }
        return(clusterData[y][x]);
    };
    var spreads = [
        {x:1,y:0},
        {x:0,y:1},
        {x:-1,y:0},
        {x:0,y:-1},
        {x:1,y:1},
        {x:-1,y:1},
        {x:1,y:-1},
        {x:-1,y:-1},
    ];
    for(var i = 5; i<shards; i++){
        clusterData[floor(random(0,8))][floor(random(0,12))]=i;
    }
    clusterData[0][0]=1;
    clusterData[7][0]=2;
    clusterData[7][11]=3;
    clusterData[0][11]=4;
    while(true){
        var ready = true;
        for(var y = 0; y<8; y++){
            for(var x = 0; x<12; x++){
                if(clusterData[y][x]===0){ready=false;}
                else{
                    for(var i = 0; i<spreads.length; i++){
                        if(random(0,4)<1&&askClusterData(x+spreads[i].x,y+spreads[i].y)===0){
                            clusterData[y+spreads[i].y][x+spreads[i].x]=clusterData[y][x]+1-1; // +1-1
                        }
                    }
                }
            }
        }
        if(ready){break;}
    }
    
    var lookUps = [];
    for(var i = 0; i<shards; i++){
        lookUps.push({
            xv:random(-0.15,0.15),
            yv:random(-5,-10),
        });
    }
    
    var ipxs=height/8;
    for(var y = 0; y<height-1; y+=ipxs){
        for(var x = 0; x<width-1; x+=ipxs){
            imgParticles.push({
                img:get(x,y,ipxs,ipxs),
                x:map(x,0,width,0,600)+12.5-300,
                y:map(y,0,height,0,400)+12.5-200,
                xv:lookUps[clusterData[floor(y/ipxs)][floor(x/ipxs)]].xv,
                yv:lookUps[clusterData[floor(y/ipxs)][floor(x/ipxs)]].yv,
                xs:50,
                ys:50,
            });
        }
    }
};
var imgParticleExist = function(obj,id){
    obj.yv+=0.25;
    if(abs(obj.xv)<0.9){obj.xv*=1.2;}
    push();
    translate(obj.x,obj.y);
    image(obj.img,-obj.xs/2,-obj.ys/2,obj.xs,obj.ys);
    pop();
    if(obj.y>310+obj.ys*0.71){imgParticles.splice(id,1);}
    obj.x+=obj.xv;
    obj.y+=obj.yv;
};

spawnParticleGroup = function(num,x,y,ang,angvari,speed,startrad,col){
    particles.push({
        x:x,
        y:y,
        xv:speed*cos(ang),
        yv:speed*sin(ang),
        col:col,
        startrad:startrad
    });
    for(var i = 1; i<num; i++){
        var spd = random(0.3,1.3)*speed;
        var aang = ang+random(-angvari,angvari);
        particles.push({
            x:x,
            y:y,
            xv:spd*cos(aang),
            yv:spd*sin(aang),
            col:[
                min(col[0]*random(0.7,1.3),255),
                min(col[1]*random(0.7,1.3),255),
                min(col[2]*random(0.7,1.3),255),
                min(col[3]*random(0.8,1.2),255),
            ],
            startrad:startrad
        });
    }
};
var particleExist = function(obj,id){
    noStroke();
    fill(obj.col[0],obj.col[1],obj.col[2],obj.col[3]);
    ellipse(obj.x,obj.y,obj.startrad*obj.col[3]/200,obj.startrad*obj.col[3]/200);
    obj.x+=obj.xv;
    obj.y+=obj.yv;
    obj.xv*=0.95;
    obj.yv*=0.95;
    obj.col[3]-=4;
    if(obj.col[3]<5){particles.splice(id,1);}
};

var spawnCampaignWave = function(wnum){
    var side = floor(random(0,2))*2-1;
    switch((wnum-1)%15+1){
        case 1:
            for(var i = 0; i<3; i++){
                spawnEnemy(1);
            }
            break;
        case 2:
            for(var i = 0; i<20; i++){
                spawnEnemy(2,side*random(310,420),random(-90,90));
            }
            break;
        case 3:
            spawnEnemy(4);
            spawnEnemy(4);
            break;
        case 4:
            spawnEnemy(4,side*330,-30);
            spawnEnemy(4,side*330,30);
            spawnEnemy(1,side*310,0);
            break;
        case 5:
            spawnEnemy(0,side*330,0);
            spawnEnemy(2,side*310,-150);
            spawnEnemy(2,side*310,150);
            break;
        case 6:
            for(var i = 0; i<5; i++){
                spawnEnemy(3);
            }
            break;
        case 7:
            for(var i = 0; i<10; i++){
                spawnEnemy(4,side*random(350,550),random(-100,100));
                enemies[enemies.length-1].speed=0.3;
            }
            break;
        case 8:
            for(var i = 0; i<10; i++){
                spawnEnemy(5);
            }
            for(var i = enemies.length-5; i<enemies.length; i++){
                enemies[i].x=enemies[i].x*1.8;
                enemies[i].y=enemies[i].y*1.8;
            }
            break;
        case 9:
            for(var i = 0; i<4; i++){
                spawnEnemy(0,side*random(330,350),i*100-150);
                spawnEnemy(2,side*random(310,320),i*100-145);
                spawnEnemy(2,side*random(310,320),i*100-155);
            }
            break;
        case 10:
            for(var i = 0; i<20; i++){
                spawnEnemy(3);
            }
            for(var i = enemies.length-20; i<enemies.length; i++){
                enemies[i].hp=10;
                enemies[i].speed*=0.75;
            }
            break;
        case 11:
            for(var i = 0; i<4; i++){
                spawnEnemy(1);
            }
            var end = enemies.length-5;
            for(var i = enemies.length-1; i>end; i--){
                for(var e = 0; e<10; e++){
                    spawnEnemy(2,enemies[i].x*1.05+random(-25,25),enemies[i].y*1.05+random(-25,25));
                    enemies[enemies.length-1].speed*=0.7;
                }
            }
            break;
        case 12:
            ganime=0;
            spawnEnemy(3,0,220);
            enemies[enemies.length-1].speed=10;
            break;
        case 13:
            for(var i = 0; i<13; i++){
                spawnEnemy(2);
            }
            for(var i = 0; i<10; i++){
                spawnEnemy(5);
            }
            for(var i = enemies.length-20; i<enemies.length; i++){
                enemies[i].x=enemies[i].x*1.2;
                enemies[i].y=enemies[i].y*1.5;
                enemies[i].speed=enemies[i].speed*0.8;
            }
            for(var i = enemies.length-8; i<enemies.length; i++){
                enemies[i].x=enemies[i].x*1.5;
                enemies[i].y=enemies[i].y*1.5;
            }
            break;
        case 14:
            for(var i = 0; i<90; i++){
                spawnEnemy(1);
            }
            for(var i = enemies.length-90; i<enemies.length; i++){
                enemies[i].speed=0.1;
                enemies[i].x*=0.95;
                enemies[i].hp=40;
            }
            break;
        case 15:
            spawnEnemy(6);
            break;
    }
    for(var i = 0; i<enemies.length; i++){
        if(enemies[i].speed<10){
            enemies[i].speed*=0.8;
            // enemies[i].speed*=pow(1+floor((wnum-0.9)/15)*0.1,0.5);
            enemies[i].speed+=floor((wnum-0.9)/15)*0.15;
            enemies[i].hp-=max(0,floor((wnum-0.9)/15)-floor(random(0,1.7)))*10;
            if(enemies[i].hp<1){enemies[i].hp=1;}
            if(enemies.length>10){
              if(enemies[i].speed>1.7){enemies[i].speed=1.7;}
            }
            else{
              if(enemies[i].speed>2){enemies[i].speed=2;}
            }
        }
    }
};



mousePressed = function(){if(clickStatus<0){clickStatus=1;}};
mouseReleased = function(){clickStatus=-1;};

touchStarted = function() {
    // Set mouse coordinates to the first touch immediately so the drag calculations work
    if (touches.length > 0) {
        mouseX = touches[0].x;
        mouseY = touches[0].y;
    }
    if (clickStatus < 0) { clickStatus = 1; }
    return false; // Prevent default iOS zoom and scroll gestures
};

touchEnded = function() {
    clickStatus = -1;
    return false; // Prevent default behavior
};

keyPressed = function(){inp[keyCode]=true;};
keyReleased = function(){inp[keyCode]=false;};

function getCanvasDims() {
  let w = min(windowWidth, windowHeight * 1.5);
  let h = w * 2 / 3;
  return { w, h };
}

function setup() {
  let dims = getCanvasDims();
  createCanvas(dims.w, dims.h);
  
  angleMode(DEGREES);
  smooth();
  frameRate(60);
  strokeJoin(ROUND);
  textAlign(CENTER, CENTER);
  background(247, 173, 94);
  spawnEnemy(1, 150, 0);
  spawnEnemy(1, 250, 0);
  enemies[0].diameter = 36;
  enemies[1].diameter = 64;
  enemies[0].hp = 10;
  enemies[1].hp = 10;
}

function windowResized() {
  let dims = getCanvasDims();
  resizeCanvas(dims.w, dims.h);
  background(247, 173, 94);
}


function draw(){
    if(ganime<360){ganime++;}
    else{ganime=1;}
    
    // mouse input
    mx=map(mouseX,0,width,-300,300);
    my=map(mouseY,0,height,-200,200);
    
    push(); // program resizing
    scale(width/600,height/400);
    translate(300,200);
    
    if(screen===0){
        cursor("none");
        background(0);
        
        fill(255);
        textSize(40);
        noStroke();text("Destroy the blocks to begin",0,-150);
        textSize(30);
        noStroke();text("Hold click from the circle,\ndrag to aim, and release to shoot",0,150);
        
        push();
        translate(-200,0);
        
        noFill();
        strokeWeight(6);
        stroke(50);
        ellipse(15,0,222,222);
        
        /*stroke(16, 114, 163);
        strokeWeight(3);
        var angChange = 45; // center 
        for(var i = 0; i<360; i+=angChange){
            fill(0, 150+25*sin(3*ganime+i), 175);
            quad(40*cos(i),40*sin(i),40*cos(i+angChange),40*sin(i+angChange),18*cos(i+angChange),18*sin(i+angChange),18*cos(i),18*sin(i));
        }
        beginShape();
        fill(0, 155, 175);
        for(var i = 0; i<360; i+=45){
            vertex(27*cos(i),27*sin(i));
        }
        endShape(CLOSE);*/
        pop();
        
        
        
        // handle shooting interface
        if(clickStatus===1&&dist(mx,my,-185,0)<=114){
            // set anchor
            shootAnchor.placed=true;
            shootAnchor.x=mx;
            shootAnchor.y=my;
        }
        if(clickStatus===-1&&shootAnchor.placed===true){
            // actually shoot
            shootAnchor.placed=false;
            if(dist(mx,my,shootAnchor.x,shootAnchor.y)>1){
                createBullet(shootAnchor.x,shootAnchor.y,1.5+dist(shootAnchor.x,shootAnchor.y,mx,my)/15,atan2(my-shootAnchor.y,mx-shootAnchor.x)+random(-15,15)*(dist(mx,my,shootAnchor.x,shootAnchor.y)<10));
            }
        }
        
        for(var i = particles.length-1; i>-1; i--){
            particleExist(particles[i]);
        }
        
        for(var i = enemies.length-1; i>-1; i--){
            if(enemies[i].hp<=0){driftEnemy(enemies[i]);}
            enemyCheckCollideEnemies(enemies[i],i);
            drawEnemy(enemies[i]);
            natureEnemy(enemies[i],i);
        }
        
        for(var i = bullets.length-1; i>-1; i--){
            driftBullet(bullets[i],1/3);if(bulletCheckCollideEnemies(bullets[i])){drawBullet(bullets[i]);bullets.splice(i,1);continue;}drawBullet(bullets[i]);
            driftBullet(bullets[i],1/3);if(bulletCheckCollideEnemies(bullets[i])){drawBullet(bullets[i]);bullets.splice(i,1);continue;}drawBullet(bullets[i]);
            driftBullet(bullets[i],1/3);if(bulletCheckCollideEnemies(bullets[i])){drawBullet(bullets[i]);bullets.splice(i,1);continue;}drawBullet(bullets[i]);
            natureBullet(bullets[i],i);
        }
        
        
        // draw shooting interface
        strokeWeight(3);
        if(shootAnchor.placed){
            var ang = atan2(my-shootAnchor.y,mx-shootAnchor.x);
            var mDstOff = min(8,dist(shootAnchor.x,shootAnchor.y,mx,my));
            var aDstOff = min(4,dist(shootAnchor.x,shootAnchor.y,mx,my));
            stroke(100);
            line(shootAnchor.x+aDstOff*cos(ang),shootAnchor.y+aDstOff*sin(ang),mx-mDstOff*cos(ang),my-mDstOff*sin(ang));
            stroke(32, 102, 135);
            fill(32, 102, 135);
            ellipse(shootAnchor.x,shootAnchor.y,10,10);
        }
        noFill();
        stroke(32, 118, 158);
        ellipse(mx,my,16,16); // cursor
        if(shootAnchor.placed===false&&clickStatus===2&&(dist(mx,my,-200,0)>114||dist(mx,my,-200,0)<46)){
            fill(180, 0, 0);
            noStroke();
            push();
            translate(mx,my);
            rotate(45);
            rect(-17,-5,34,10);
            rotate(90);
            rect(-17,-5,34,10);
            pop();
            fill(255, 50, 50);
            push();
            translate(mx,my);
            rotate(45);
            rect(-15,-3,30,6);
            rotate(90);
            rect(-15,-3,30,6);
            pop();
        } // feedback for trying to anchor too far
        
        if(enemies.length===0){playAgain();}
    } // title
    else if(screen===1){
        if(inp[70]&&inp[71]){
            scale(600/width,400/height);
            scale(1.5,1);
            screen=12345;
            enemies=[];
            spawnEnemy(1,60,0);
            spawnEnemy(2,140,30);
            spawnEnemy(2,140,31);
            spawnEnemy(2,140,32);
            spawnEnemy(3,90,-90);
            spawnEnemy(4,160,150);
            spawnEnemy(5,-70,120);
            spawnEnemy(2,-110,-60);
            spawnEnemy(2,-111,-61);
            spawnEnemy(2,-112,-62);
            spawnEnemy(0,-180,-20);
            for(var i = 0; i<160; i++){
                var ang = random(0,360);
                var dst = random(random(100,250),220);
                spawnParticleGroup(1,1.3*dst*cos(ang),dst*sin(ang),0,0,0,random(200,600),[168, 136, 104, 30]);
            }
        }
        if(inp[69]&&(inp[72]||wave<waveHighScore)){
            inp[69]=false;
            enemies=[];
            if(inp[72]&&wave<waveHighScore){wave=waveHighScore-1;}
        }
        
        cursor("none");
        // background scene
        background(247, 173, 94);
        fill(237, 162, 87);
        noStroke();
        rect(-301,0,602,301);
        noFill();
        strokeWeight(6);
        stroke(220, 170, 110);
        ellipse(0,0,222,222); // territory
        stroke(22, 138, 196);
        strokeWeight(3);
        var angChange = 45; // center 
        for(var i = 0; i<360; i+=angChange){
            fill(0, 172+16*sin(8*ganime+i), 202);
            quad(40*cos(i),40*sin(i),40*cos(i+angChange),40*sin(i+angChange),18*cos(i+angChange),18*sin(i+angChange),18*cos(i),18*sin(i));
        }
        beginShape();
        fill(0, 178, 202);
        for(var i = 0; i<360; i+=45){
            vertex(27*cos(i),27*sin(i));
        }
        endShape(CLOSE);
        
        
        if(enemies.length===0){//||inp[32]){
            enemies = [];
            wave++;
            if(wave===16&&waveHighScore<16){
                youWonTimer=360;
            }
            spawnCampaignWave(wave);
            spawnParticleGroup(20,0,0,0,180,5,random(25,55),[46,121,156,200]);
        }
        
        
        // handle shooting interface
        if(inp[72]&&inp[73]){
            clickStatus=-1;
        }
        if(clickStatus===-1&&shootAnchor.placed===true){
            // actually shoot
            shootAnchor.placed=false;
            if(dist(mx,my,shootAnchor.x,shootAnchor.y)>1){
                createBullet(shootAnchor.x,shootAnchor.y,1.5+dist(shootAnchor.x,shootAnchor.y,mx,my)/15,atan2(my-shootAnchor.y,mx-shootAnchor.x)+random(-15,15)*((!(inp[72]&&inp[73]))&&dist(mx,my,shootAnchor.x,shootAnchor.y)<8));
                if(inp[72]&&inp[73]){
                    bullets[bullets.length-1].speed*=5;
                }
            }
        }
        
        
        if(inp[72]&&inp[73]){
            clickStatus=1;
        }
        if(clickStatus===1&&(dist(mx,my,0,0)<=114&&dist(mx,my,0,0)>=46)){
            // set anchor
            shootAnchor.placed=true;
            shootAnchor.x=mx;
            shootAnchor.y=my;
        }
        
        
        for(var i = particles.length-1; i>-1; i--){
            particleExist(particles[i]);
        }
        
        // enemies
        for(var i = enemies.length-1; i>-1; i--){
            if(enemies[i].hp>0){operateEnemy(enemies[i]);}
            driftEnemy(enemies[i]);
            enemyCheckCollideEnemies(enemies[i],i);
            drawEnemy(enemies[i]);
            natureEnemy(enemies[i],i);
        }
        // bullets
        for(var i = bullets.length-1; i>-1; i--){
            driftBullet(bullets[i],1/3);if(bulletCheckCollideEnemies(bullets[i])){drawBullet(bullets[i]);bullets.splice(i,1);continue;}
            driftBullet(bullets[i],1/3);if(bulletCheckCollideEnemies(bullets[i])){drawBullet(bullets[i]);bullets.splice(i,1);continue;}
            driftBullet(bullets[i],1/3);if(bulletCheckCollideEnemies(bullets[i])){drawBullet(bullets[i]);bullets.splice(i,1);continue;}
            drawBullet(bullets[i]);
            if(bulletCheckCollideGem(bullets[i])){bullets.splice(i,1);continue;}
            natureBullet(bullets[i],i);
        }

        if(screen===2){
            dimg=get(0,0,width,height);
        } // if game over, get image before drawing cursor
        
        // draw shooting interface
        strokeWeight(3);
        if(shootAnchor.placed){
            var ang = atan2(my-shootAnchor.y,mx-shootAnchor.x);
            var mDstOff = min(8,dist(shootAnchor.x,shootAnchor.y,mx,my));
            var aDstOff = min(4,dist(shootAnchor.x,shootAnchor.y,mx,my));
            stroke(170);
            line(shootAnchor.x+aDstOff*cos(ang),shootAnchor.y+aDstOff*sin(ang),mx-mDstOff*cos(ang),my-mDstOff*sin(ang));
            stroke(32, 118, 158);
            fill(46, 121, 156);
            ellipse(shootAnchor.x,shootAnchor.y,10,10);
        }
        noFill();
        stroke(32, 118, 158);
        ellipse(mx,my,16,16); // cursor
        if(shootAnchor.placed===false&&clickStatus===2&&(dist(mx,my,0,0)>114||dist(mx,my,0,0)<46)){
            fill(180, 0, 0);
            noStroke();
            push();
            translate(mx,my);
            rotate(45);
            rect(-17,-5,34,10);
            rotate(90);
            rect(-17,-5,34,10);
            pop();
            fill(255, 50, 50);
            push();
            translate(mx,my);
            rotate(45);
            rect(-15,-3,30,6);
            rotate(90);
            rect(-15,-3,30,6);
            pop();
        } // feedback for trying to anchor too far
        
        textSize(25);
        fill(0);
        noStroke();text("Wave "+wave,-240,-170);
        if(youWonTimer){
            youWonTimer--;
            textSize(25);
            if(youWonTimer>150){
                noStroke();text("You won! :D",0,0);
            }
            else{
                noStroke();text("Enemies will now get\nfaster and faster...",0,0);
            }
        }
    } // game
    else if(screen===2){
        background(0);
        fill(255);
        textSize(69);
        noStroke();text("Click to\nPlay Again",0,-60);
        textSize(40);
        if(wave===1){
            noStroke();text("Oops! Be careful!",0,110);
        }
        else if(wave===2){
            noStroke();text("You... only lasted one wave?",0,110);
        }
        else{
            noStroke();text("You passed "+wave+" waves!",0,110);
        }
        waveHighScore=max(waveHighScore,wave);
        
        cursor(ARROW);
        if(danime>0){
            image(dimg,-300,-200,600,400);
            danime--;
            if(danime%20>10){
                fill(255,30);
                noStroke();
                rect(-301,-201,602,402);
            }
            if(danime===0){
                generateImgParticles();
            }
        }
        else{
            for(var i = imgParticles.length-1; i>-1; i--){
                imgParticleExist(imgParticles[i],i);
            }
            if(clickStatus===1){
                playAgain();
            }
        }
    } // lose
    
    pop();
    
    if(abs(clickStatus)===1){clickStatus*=2;} // "just clicked" and "just released" decay after 1 frame into "holding" and "nothing"
};