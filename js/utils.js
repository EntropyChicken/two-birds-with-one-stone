var angTo = function(base, aim, strength){
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

function getCanvasDims() {
  let w = min(windowWidth, windowHeight * 1.5);
  let h = w * 2 / 3;
  return { w, h };
}