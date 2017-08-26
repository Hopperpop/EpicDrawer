
function points = mooreCurve(itt)
    points=[0 0];dir=0;
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
    points = forward(points,dir);
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
    dir = fracRotate(1,dir);
    points = forward(points,dir);
    dir = fracRotate(1,dir);
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
    points = forward(points,dir);;
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
    
end

function [points,dir] = left(points,dir,itt)
    dir = fracRotate(-1,dir);
    if itt>1
        [points,dir] = right(points,dir,itt-1);
    end
     points = forward(points,dir);
    dir = fracRotate(1,dir);
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
     points = forward(points,dir);
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
    dir = fracRotate(1,dir);
     points = forward(points,dir);
    if itt>1
        [points,dir] = right(points,dir,itt-1);
    end
    dir = fracRotate(-1,dir);
end

function [points,dir] = right(points,dir,itt)
    dir = fracRotate(1,dir);
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
     points = forward(points,dir);
    dir = fracRotate(-1,dir);
    if itt>1
        [points,dir] = right(points,dir,itt-1);
    end
     points = forward(points,dir);
    if itt>1
        [points,dir] = right(points,dir,itt-1);
    end
    dir = fracRotate(-1,dir);
    points = forward(points,dir);
    if itt>1
        [points,dir] = left(points,dir,itt-1);
    end
    dir = fracRotate(1,dir);
end

function points = forward(points,dir);
    points = [points; points(end,:) + dir2vec(dir)];
end

function dir = fracRotate(side,dir)
    if side==1
       dir = mod(dir+1,4); 
    else
       dir = mod(dir-1,4); 
    end
end

function vector = dir2vec(dir)
    switch dir
        case 0
            vector = [0 1];
        case 1
            vector = [1 0];
        case 2
            vector = [0 -1];
        otherwise
            vector = [-1 0];
    end
end

