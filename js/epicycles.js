//drawing part///
function drawCircle(ctx,x,y,radius){
    ctx.lineWidth = 1;
    ctx.strokeStyle = settings.colorCircle;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
}

function drawLine(ctx,x,y,xx,yy){
    ctx.lineWidth = 1;
    ctx.strokeStyle = settings.colorLine;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(xx,yy);
    ctx.stroke();
}

function drawSystem(ctx,phi,amp,ang){
    //amplitudes length must be even
    var spiralID = amp.length / 2;
    var freq = 0;
    var x = window.innerWidth/2;
    var y = window.innerHeight/2;

    for (i = 0; i < (Math.min(amp.length,settings.harmonics*2)); i++){

        if (i%2 == 0){
            spiralID += i;
            freq = Math.abs(freq) + 1;
        }else {
            spiralID -= i;
            freq = - freq;
        }

        var dx = -amp[spiralID] * Math.cos(phi*freq + ang[spiralID]);
        var dy = -amp[spiralID] * Math.sin(phi*freq + ang[spiralID]);
        if(settings.circle){drawCircle(ctx,x,y,amp[spiralID]);}
        if(settings.line){drawLine(ctx,x,y,x+dx,y+dy);}
        x += dx;
        y += dy;
    }

}
