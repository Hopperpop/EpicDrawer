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

        var dx = amp[spiralID] * Math.cos(phi*freq + ang[spiralID]);
        var dy = -amp[spiralID] * Math.sin(phi*freq + ang[spiralID]);
        if(settings.circle){drawCircle(ctx,x,y,amp[spiralID]);}
        if(settings.line){drawLine(ctx,x,y,x+dx,y+dy);}
        x += dx;
        y += dy;
    }

}

function Painting(){
    this.canvas = document.getElementById('canvasDrawing');
    this.ctx = this.canvas.getContext('2d');
    this.index = 0;
    this.xpoints = [];
    this.ypoints = [];

    this.calcPoints = function(drawing){
        var points = Math.round(drawing.length/2);
        console.log(points);
        this.xpoints.length = points + 1;
        this.ypoints.lenght = points +1;
        for (j = 0; j <= points; j++){
            var phi = Math.PI * 2 * j / points;
            var freq = 0;
            var spiralID = drawing.amplitudes.length / 2;
            this.xpoints[j] = window.innerWidth/2;
            this.ypoints[j] = window.innerHeight/2;

            for (i = 0; i < (Math.min(drawing.amplitudes.length,settings.harmonics*2)); i++){
                if (i%2 == 0){
                    spiralID += i;
                    freq = Math.abs(freq) + 1;
                }else {
                    spiralID -= i;
                    freq = - freq;
                }
                this.xpoints[j] += drawing.amplitudes[spiralID] * Math.cos(phi*freq + drawing.phase[spiralID]);
                this.ypoints[j] += -drawing.amplitudes[spiralID] * Math.sin(phi*freq + drawing.phase[spiralID]);
            }
        }
    }

    this.draw = function(animation){
        var newIndex = Math.round(this.xpoints.length * Math.min(animation,1));
        if (newIndex != this.index){
            for(; this.index < newIndex ; this.index++){
                drawLine(this.ctx,this.xpoints[this.index],this.ypoints[this.index],this.xpoints[this.index+1],this.ypoints[this.index+1]);
            }
        }

    }

    this.clear = function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.index = 0;
    }
}
