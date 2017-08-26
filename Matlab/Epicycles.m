drawCircles = 1;     % Draw circles or not
drawLines = 1;       % Draw vectors or not
drawDot = 1;         % Draw dot or not
drawFreq = 0;        % Display spectrum
drawText = 0;        % Display used harmonics
createGif = 1;       % Create gif or not
fileName = 'test.gif';
gifSize = 800;       % Pixel size

shiftPoints = 0;        %Move the starting point
switchDirection = 1;    %Reverse the drawing direction

Np = 500;            % Number of spatial points
harm = 200;          % Number of harmonic freq*2

dt = 2*pi/Np;        % discretization size 
t  = 0:dt:(6*pi);    % utilized t range

%------ Input ------%

% Pattern %
x = [0 1 1 2 2 3 3 2 2 3 3 2 2 1 1 0 0 1 1 0];
y = [0 0 1 1 0 0 1 1 2 2 3 3 2 2 3 3 2 2 1 1];

% Square %
%x = [ 0 5 5 0];
%y = [ 0 0 5 5];

% Moore curve %
%points = transpose(mooreCurve(4));
%x = points(1,:);
%y = points(2,:);


% Read coordinates from file % example format: 1.23,-1.23
%filename = 'test.svg';
%textstr = fileread(filename);
%pair = regexp(textstr,'[\d.]+,[\d.]+','match');
%x = [];
%y =[];

%for i=1:length(pair)
%    split = str2num(pair{i});
%    x = [x split(1)];
%    y = [y -split(2)];
%end


%------ Normalize data ------%

n = 1;%counter
size = max(abs(max(x)-min(x)),abs(max(y)-min(y)))*0.6;          % Windowsize
xsize = abs(max(x) - min(x))
ysize = abs(max(y) - min(y))
centerx = (max(x)+min(x))/2;
centery = (max(y)+min(y))/2;
x = x - (max(x)+min(x))/2;
y = y - (max(y)+min(y))/2;

%------ Calculating part of the program ------%

freq = [-harm:harm];
freq(harm+1) = [];
coef = zeros(1,harm*2);
c = x + 1i*y;

%remove dup points
j=1;
while j<length(c)
    if c(j) == c(j+1)
       c(j+1) = [];
       disp(j);
    else
        j= j+1;
    end
end
if c(1)==c(end)
    c(end)=[];
end

% Data preparation
if switchDirection
    c = fliplr(c);
end
c = circshift(c,shiftPoints);

lengths = abs(diff([c c(1)]));
tot_lenght = sum(lengths)
cum_lengths = [0 cumsum(lengths)];
p = length(lengths);
offset = 0;

% Calculating coeficients
for j=1:p
    prev = mod(j-2,p)+1;
    next = mod(j,p)+1;
    coef =  coef +  exp(-1i*2*pi*freq*cum_lengths(j)/tot_lenght) * ...
                ( ( c(j)-c(prev) )/( mod(cum_lengths(j)-cum_lengths(prev),tot_lenght) ) - ...
                  ( c(next)-c(j) )/( cum_lengths(j+1)-cum_lengths(j) ) ) ;
    offset=offset+ (cum_lengths(j+1)-cum_lengths(j))*(c(next)+c(j))/2;
end
coef = tot_lenght./(2*pi*freq).^2 .*coef;
offset = offset/tot_lenght;

xoffset = real(offset) - centerx;
yoffset = imag(offset) - centery;

Amp = abs(coef);
Phase = angle(coef);

strrep(mat2str(Amp.'),';',',')
strrep(mat2str(Phase.'),';',',')

%------Drawing part of the program ------%
%Draw spectrum
if drawFreq
    f2=figure(2);
    clf;
    stem(freq,Amp);
end

%Animate epicycles
f1=figure(1);
clf;
xlim([-size size]); ylim([-size size]);
axis square;axis off;set(gcf,'color','none');
set(f1, 'Position', [0 0 gifSize gifSize]);
if drawText==1
    text(-size+size/10,-size+size/10,strcat('Harm.freq.: ',num2str(-harm),{' to '},num2str(harm)));
end
set(gca,'position',[0 0 1 1],'units','normalized');

handleLines = line(0,0,'Color','r','LineWidth',0.5);
handleDrawing = line(0,0,'Color','white','LineWidth',1.0);
for i=1:harm*2
   handleCircles(i) = rectangle('Position',[0 0 0 0],'Curvature',[1 1],'EdgeColor',[0.2 0.6 1]','LineWidth',0.5); 
end   
handleDot = rectangle('Position',[0 0 0 0],'Curvature',[1 1],'EdgeColor','black','LineWidth',0.01,'FaceColor','white');

lines = zeros(2,2*harm+1);
for i=1:2*harm+1
   lines(:,i) = [real(offset);imag(offset)] ;
end
drawing=[];
dotsize = size/gifSize * 8;

for i=1:length(t)
 
    pos = [real(offset);imag(offset)];
    
    for j=1:length(Amp)
        if mod(j,2)==0
            p = length(Amp)/2-(j/2-1);
        else
            p = length(Amp)/2+(j+1)/2;
        end    
        if drawCircles == 1 && (n == 1 || mod(n,2)==0 || ~createGif)
            set(handleCircles(j),'Position',[transpose(pos)-Amp(p) 2*Amp(p) 2*Amp(p)]);
        end
        pos=pos + Amp(p)*[cos(t(i)*freq(p)+Phase(p)) ;sin(t(i)*freq(p)+Phase(p))];
        lines(:,j+1)=pos;
        
    end
    
    if i>=Np+2
            drawing=cat(2,drawing,pos);
    end
    
    if drawDot
            set(handleDot,'Position',[transpose(pos)-dotsize dotsize*2 dotsize*2]);
    end
    
    %Gif creation
    if createGif  
      if n == 1 || mod(n,2)==0
            if drawLines == 1
                set(handleLines,'XData',lines(1,:),'YData',lines(2,:));
            end
            if length(drawing) > 1
                set(handleDrawing,'XData',drawing(1,:),'YData',drawing(2,:));
            end
            frame = getframe(1);
            im = frame2im(frame);
            [imind,cm] = rgb2ind(im,256);
            
            if n == 1
                imwrite(imind,cm,fileName,'gif', 'Loopcount',inf,'DelayTime',0.05);
            else
                imwrite(imind,cm,fileName,'gif','WriteMode','append','DelayTime',0.05);
            end
      end 
      n = n+1;
    else
        %Just drawing
        if drawLines == 1
            set(handleLines,'XData',lines(1,:),'YData',lines(2,:));
        end
        if i<Np+2
            drawing=cat(2,drawing,pos);
            set(handleDrawing,'XData',drawing(1,:),'YData',drawing(2,:));
        end
        drawnow;
    end
end