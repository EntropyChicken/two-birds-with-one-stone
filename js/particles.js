var generateImgParticles = function(){
    var shards = 14;
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
        {x:1,y:0}, {x:0,y:1}, {x:-1,y:0}, {x:0,y:-1},
        {x:1,y:1}, {x:-1,y:1}, {x:1,y:-1}, {x:-1,y:-1},
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
                            clusterData[y+spreads[i].y][x+spreads[i].x]=clusterData[y][x]+1-1; 
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