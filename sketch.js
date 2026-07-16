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

mousePressed = function(){if(clickStatus<0){clickStatus=1;}};
mouseReleased = function(){clickStatus=-1;};

touchStarted = function() {
    if (touches.length > 0) {
        mouseX = touches[0].x;
        mouseY = touches[0].y;
    }
    if (clickStatus < 0) { clickStatus = 1; }
    return false; 
};

touchEnded = function() {
    clickStatus = -1;
    return false; 
};

keyPressed = function(){inp[keyCode]=true;};
keyReleased = function(){inp[keyCode]=false;};

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
    
    push(); 
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
        pop();
        
        // handle shooting interface
        if(clickStatus===1&&dist(mx,my,-185,0)<=114){
            shootAnchor.placed=true;
            shootAnchor.x=mx;
            shootAnchor.y=my;
        }
        if(clickStatus===-1&&shootAnchor.placed===true){
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
        ellipse(mx,my,16,16); 
        if(shootAnchor.placed===false&&clickStatus===2&&(dist(mx,my,-200,0)>114||dist(mx,my,-200,0)<46)){
            fill(180, 0, 0); noStroke(); push(); translate(mx,my); rotate(45); rect(-17,-5,34,10); rotate(90); rect(-17,-5,34,10); pop();
            fill(255, 50, 50); push(); translate(mx,my); rotate(45); rect(-15,-3,30,6); rotate(90); rect(-15,-3,30,6); pop();
        } 
        
        if(enemies.length===0){playAgain();}
    } 
    else if(screen===1){
        if(inp[70]&&inp[71]){
            scale(600/width,400/height); scale(1.5,1);
            screen=12345; enemies=[];
            spawnEnemy(1,60,0); spawnEnemy(2,140,30); spawnEnemy(2,140,31); spawnEnemy(2,140,32);
            spawnEnemy(3,90,-90); spawnEnemy(4,160,150); spawnEnemy(5,-70,120); spawnEnemy(2,-110,-60);
            spawnEnemy(2,-111,-61); spawnEnemy(2,-112,-62); spawnEnemy(0,-180,-20);
            for(var i = 0; i<160; i++){
                var ang = random(0,360);
                var dst = random(random(100,250),220);
                spawnParticleGroup(1,1.3*dst*cos(ang),dst*sin(ang),0,0,0,random(200,600),[168, 136, 104, 30]);
            }
        }
        if(inp[69]&&(inp[72]||wave<waveHighScore)){
            inp[69]=false; enemies=[];
            if(inp[72]&&wave<waveHighScore){wave=waveHighScore-1;}
        }
        
        cursor("none");
        background(247, 173, 94);
        fill(237, 162, 87);
        noStroke(); rect(-301,0,602,301);
        noFill(); strokeWeight(6); stroke(220, 170, 110);
        ellipse(0,0,222,222); 
        stroke(22, 138, 196); strokeWeight(3);
        var angChange = 45; 
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
        
        if(enemies.length===0){
            enemies = []; wave++;
            if(wave===16&&waveHighScore<16){ youWonTimer=360; }
            spawnCampaignWave(wave);
            spawnParticleGroup(20,0,0,0,180,5,random(25,55),[46,121,156,200]);
        }
        
        // handle shooting interface
        if(inp[72]&&inp[73]){ clickStatus=-1; }
        if(clickStatus===-1&&shootAnchor.placed===true){
            shootAnchor.placed=false;
            if(dist(mx,my,shootAnchor.x,shootAnchor.y)>1){
                createBullet(shootAnchor.x,shootAnchor.y,1.5+dist(shootAnchor.x,shootAnchor.y,mx,my)/15,atan2(my-shootAnchor.y,mx-shootAnchor.x)+random(-15,15)*((!(inp[72]&&inp[73]))&&dist(mx,my,shootAnchor.x,shootAnchor.y)<8));
                if(inp[72]&&inp[73]){ bullets[bullets.length-1].speed*=5; }
            }
        }
        
        if(inp[72]&&inp[73]){ clickStatus=1; }
        if(clickStatus===1&&(dist(mx,my,0,0)<=114&&dist(mx,my,0,0)>=46)){
            shootAnchor.placed=true;
            shootAnchor.x=mx;
            shootAnchor.y=my;
        }
        
        for(var i = particles.length-1; i>-1; i--){ particleExist(particles[i]); }
        
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
        } 
        
        // draw shooting interface
        strokeWeight(3);
        if(shootAnchor.placed){
            var ang = atan2(my-shootAnchor.y,mx-shootAnchor.x);
            var mDstOff = min(8,dist(shootAnchor.x,shootAnchor.y,mx,my));
            var aDstOff = min(4,dist(shootAnchor.x,shootAnchor.y,mx,my));
            stroke(170);
            line(shootAnchor.x+aDstOff*cos(ang),shootAnchor.y+aDstOff*sin(ang),mx-mDstOff*cos(ang),my-mDstOff*sin(ang));
            stroke(32, 118, 158); fill(46, 121, 156);
            ellipse(shootAnchor.x,shootAnchor.y,10,10);
        }
        noFill(); stroke(32, 118, 158); ellipse(mx,my,16,16);
        if(shootAnchor.placed===false&&clickStatus===2&&(dist(mx,my,0,0)>114||dist(mx,my,0,0)<46)){
            fill(180, 0, 0); noStroke(); push(); translate(mx,my); rotate(45); rect(-17,-5,34,10); rotate(90); rect(-17,-5,34,10); pop();
            fill(255, 50, 50); push(); translate(mx,my); rotate(45); rect(-15,-3,30,6); rotate(90); rect(-15,-3,30,6); pop();
        } 
        
        textSize(25); fill(0); noStroke(); text("Wave "+wave,-240,-170);
        if(youWonTimer){
            youWonTimer--; textSize(25);
            if(youWonTimer>150){ noStroke(); text("You won! :D",0,0); }
            else{ noStroke(); text("Enemies will now get\nfaster and faster...",0,0); }
        }
    } 
    else if(screen===2){
        background(0); fill(255); textSize(69); noStroke(); text("Click to\nPlay Again",0,-60);
        textSize(40);
        if(wave===1){ noStroke();text("Oops! Be careful!",0,110); }
        else if(wave===2){ noStroke();text("You... only lasted one wave?",0,110); }
        else{ noStroke();text("You passed "+wave+" waves!",0,110); }
        waveHighScore=max(waveHighScore,wave);
        
        cursor(ARROW);
        if(danime>0){
            image(dimg,-300,-200,600,400); danime--;
            if(danime%20>10){ fill(255,30); noStroke(); rect(-301,-201,602,402); }
            if(danime===0){ generateImgParticles(); }
        }
        else{
            for(var i = imgParticles.length-1; i>-1; i--){ imgParticleExist(imgParticles[i],i); }
            if(clickStatus===1){ playAgain(); }
        }
    }
    
    pop();
    if(abs(clickStatus)===1){clickStatus*=2;} 
};