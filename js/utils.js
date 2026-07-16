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