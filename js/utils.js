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
  const targetRatio = 1.5; // Width / Height
  let w = windowWidth;
  let h = windowHeight;

  // If the window is too wide, limit width based on height
  if (w / h > targetRatio) {
    w = h * targetRatio;
  } 
  // If the window is too tall, limit height based on width
  else {
    h = w / targetRatio;
  }

  return { w: w, h: h };
}