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

function drawPainting(ctx,x,y,xx,yy){
    ctx.lineWidth = 2;
    ctx.strokeStyle = settings.colorPainting;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(xx,yy);
    ctx.stroke();
}

function drawDot(ctx,x,y){
    ctx.fillStyle  = settings.colorDot;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawSystem(ctx,phi,amp,ang,xoff,yoff){
    //amplitudes length must be even
    var spiralID = amp.length / 2;
    var freq = 0;
    var x = window.innerWidth/2 + xoff * scaling;
    var y = window.innerHeight/2 - yoff * scaling;

    for (i = 0; i < (Math.min(amp.length,settings.harmonics*2)); i++){

        if (i%2 == 0){
            spiralID += i;
            freq = Math.abs(freq) + 1;
        }else {
            spiralID -= i;
            freq = - freq;
        }

        var dx = amp[spiralID] * Math.cos(phi*freq + ang[spiralID]) * scaling;
        var dy = -amp[spiralID] * Math.sin(phi*freq + ang[spiralID]) * scaling;
        if(settings.circle){drawCircle(ctx,x,y,amp[spiralID]*scaling);}
        if(settings.line){drawLine(ctx,x,y,x+dx,y+dy);}
        x += dx;
        y += dy;
    }
    if(settings.dot){drawDot(ctx,x,y);}
}

function Painting(){
    this.canvas = document.getElementById('canvasDrawing');
    this.ctx = this.canvas.getContext('2d');
    this.index = 0;
    this.xpoints = [];
    this.ypoints = [];
    this.forceRedraw = true;

    this.calcPoints = function(drawing){
        scaling = Math.min(window.innerWidth / drawings[settings.drawing].xsize * 0.8, window.innerHeight / drawings[settings.drawing].ysize * 0.8);
        var points = Math.round(drawing.length*scaling/2);
        console.log(points);
        this.xpoints.length = points + 1;
        this.ypoints.lenght = points + 1;
        for (j = 0; j <= points; j++){
            var phi = Math.PI * 2 * j / points;
            var freq = 0;
            var spiralID = drawing.amplitudes.length / 2;
            this.xpoints[j] = window.innerWidth/2 + drawing.xoffset * scaling;
            this.ypoints[j] = window.innerHeight/2 - drawing.yoffset * scaling;

            for (i = 0; i < (Math.min(drawing.amplitudes.length,settings.harmonics*2)); i++){
                if (i%2 == 0){
                    spiralID += i;
                    freq = Math.abs(freq) + 1;
                }else {
                    spiralID -= i;
                    freq = - freq;
                }
                this.xpoints[j] += drawing.amplitudes[spiralID] * Math.cos(phi*freq + drawing.phase[spiralID]) * scaling;
                this.ypoints[j] += -drawing.amplitudes[spiralID] * Math.sin(phi*freq + drawing.phase[spiralID]) * scaling;
            }
        }
        /**
        var xmax = Math.max(...this.xpoints);
        var xmin = Math.min(...this.xpoints);
        var ymax = Math.max(...this.ypoints);
        var ymin = Math.min(...this.ypoints);
        console.log(ymin + " " + ymax + " " + window.innerHeight);

        drawing.xoffset = window.innerWidth/2 - (xmax + xmin)/2;
        drawing.yoffset = window.innerHeight/2 - (ymax + ymin)/2;
        for (j = 0; j <= points; j++){
            this.xpoints[j] = this.xpoints[j] + drawing.xoffset;
            this.ypoints[j] = this.ypoints[j] + drawing.yoffset;
        }
         xmax = Math.max(...this.xpoints);
         xmin = Math.min(...this.xpoints);
         ymax = Math.max(...this.ypoints);
         ymin = Math.min(...this.ypoints);
         console.log(ymin + " " + ymax + " " + window.innerHeight);
         ***/
    }

    this.draw = function(animation){
        if (this.forceRedraw){
            this.forceRedraw = false;
            this.clear();
        }
        var newIndex = Math.round(this.xpoints.length * Math.min(animation,1));
        if (newIndex != this.index){
            for(; this.index < newIndex ; this.index++){
                drawPainting(this.ctx,this.xpoints[this.index],this.ypoints[this.index],this.xpoints[this.index+1],this.ypoints[this.index+1]);
            }
        }

    }

    this.clear = function(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.index = 0;
    }
}
