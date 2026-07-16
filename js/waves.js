var spawnCampaignWave = function(wnum){
    var side = floor(random(0,2))*2-1;
    switch((wnum-1)%15+1){
        case 1:
            for(var i = 0; i<3; i++){ spawnEnemy(1); }
            break;
        case 2:
            for(var i = 0; i<20; i++){ spawnEnemy(2,side*random(310,420),random(-90,90)); }
            break;
        case 3:
            spawnEnemy(4); spawnEnemy(4);
            break;
        case 4:
            spawnEnemy(4,side*330,-30); spawnEnemy(4,side*330,30); spawnEnemy(1,side*310,0);
            break;
        case 5:
            spawnEnemy(0,side*330,0); spawnEnemy(2,side*310,-150); spawnEnemy(2,side*310,150);
            break;
        case 6:
            for(var i = 0; i<5; i++){ spawnEnemy(3); }
            break;
        case 7:
            for(var i = 0; i<10; i++){
                spawnEnemy(4,side*random(350,550),random(-100,100));
                enemies[enemies.length-1].speed=0.3;
            }
            break;
        case 8:
            for(var i = 0; i<10; i++){ spawnEnemy(5); }
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
            for(var i = 0; i<20; i++){ spawnEnemy(3); }
            for(var i = enemies.length-20; i<enemies.length; i++){
                enemies[i].hp=10;
                enemies[i].speed*=0.75;
            }
            break;
        case 11:
            for(var i = 0; i<4; i++){ spawnEnemy(1); }
            var end = enemies.length-5;
            for(var i = enemies.length-1; i>end; i--){
                for(var e = 0; e<10; e++){
                    spawnEnemy(2,enemies[i].x*1.05+random(-25,25),enemies[i].y*1.05+random(-25,25));
                    enemies[enemies.length-1].speed*=0.7;
                }
            }
            break;
        case 12:
            ganime=0; spawnEnemy(3,0,220); enemies[enemies.length-1].speed=10;
            break;
        case 13:
            for(var i = 0; i<13; i++){ spawnEnemy(2); }
            for(var i = 0; i<10; i++){ spawnEnemy(5); }
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
            for(var i = 0; i<90; i++){ spawnEnemy(1); }
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