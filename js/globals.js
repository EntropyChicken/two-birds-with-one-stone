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

var spawnParticleGroup; // Declared here, defined in particles.js

var shootAnchor = {x:0, y:0, placed:false};

var enemies = []; // type,x,y,speed,ang,hp,diameter
var bullets = []; // x,y,speed,ang
var imgParticles = []; // img,x,y,xv,yv,xs,ys
var particles = []; // x,y,xv,yv,col