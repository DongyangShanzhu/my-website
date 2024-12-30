//'use strict';
console.clear();
let symmetry = 0;//6->1/12;4->1/8;2->1/4;
var deep=0;
var bg_t,bg_dt;
const p = noise;
var linej=0;
var min,max,range,randn;
const branches = [];

function setup () {
  p.seed(Math.random());
  createCanvas(window.innerWidth, window.innerHeight);
  branches.push(new Branch());
  noFill();
  stroke(0, 0, 0, 20);
  smooth();
  colorMode(HSB,360,1.0,1.0);
  //strokeCap(SQUARE);
  //blendMode(SCREEN);
  bg_t = 0.0;
  bg_dt = 0.02;
  lastX=0;lastY=0;
  DrawBackground();
  //background(0);
  /*strokeWeight(uiWeight.getValue());
  for (let i=0; i<uiAmount.getValue(); i++) {
      branches.push(new Branch());
  }*/
}

function DrawBackground(){
  //十层背景，深度分别为0，-10，-20，-30，，，，-90
  n=200;
  scale=height/12;
  push();
  bg_t += bg_dt;
  for(var i=n/4;i<n*3/4;i++){
      var theta = 2.39996*i;
      var r = scale*sqrt(i);
      noStroke();
      var s = i/float(n);
      //fill(200- 60*s,1.0-2.0*s, 0.5 + s );
      fill(uibgColorHSB.getValue().h- 60*s,uibgColorHSB.getValue().s-2.0*s, uibgColorHSB.getValue().v + s );
      translate(0,0,10*floor(-s*10));
      //fill(360 - 60*s,1.0-2.0*s, 0.5 + s );
      var d = scale*(5 + 0.5*sin(bg_t + r));
      ellipse(0.5*width + r*sin(theta),0.5*height + r*cos(theta), d, d,48);
  }
  pop();
}
function reset () {
  //resizeCanvas(windowWidth, windowHeight);
  //console.log(uiColorHSB.getValue().h);

  branches.length = 0;
  p.seed(Math.random());
  strokeWeight(uiWeight.getValue());
  for (let i=0; i<uiAmount.getValue(); i++) {
      branches.push(new Branch());
  }
  //clear();
}

function mouseClicked () {
  if(mouseX>3*width/4&&mouseY<height/3) return;
  else if(mouseX>9*width/10) return;
  switch(uiGraphType.getValue()){
    case '1':
      p.seed(Math.random());
      for (let i=0; i<uiAmount.getValue(); i++) {
          branches.push(new Branch(mouseX,mouseY));
      }
    break;
    case '2':
      push();
      translate(mouseX,mouseY);
      rect_multi1_0114(uiWeight.getValue()*10,uiOpacity.getValue());
      pop();
      break;
    case '3':
      var scale=uiWeight.getValue()*1.5-0.5;
      var t=0,dt=0.02;
      var n=50+uiAmount.getValue()/10;
      push();
      t += dt;
      for(var i=floor(n*0.4);i>=0;i--){
        var theta = 2.39996*i;
        var r = scale*sqrt(i);
        noStroke();
        var s = i/float(n);
        fill(uiColorHSB.getValue().h-60*s,1.0-2.0*s, 0.5 + s );
        //translate(0,0,10*floor(-s*10));
        //fill(360 - 60*s,1.0-2.0*s, 0.5 + s );
        var d = scale*(5 + 0.5*sin(t + r));
        ellipse(mouseX+ r*sin(theta),mouseY + r*cos(theta), d, d,48);
      }
      pop();
      break;
    default:break;
  }
}

function draw () {
  //orbitControl();
  if(uiMove.getValue())
    DrawBackground();
  if(uiColorHSB.getValue().h>310) {
    max=360;min=260;
  }
  else if(uiColorHSB.getValue().h<50){
    max=100;min=0;
  }
  else{
    max=uiColorHSB.getValue().h+50;min=uiColorHSB.getValue().h-50;
  }
  range= uiWeight.getValue();
  randn= uiRandom.getValue();

  push();
  symmetry=uiReDraw.getValue();
  let angle=0;
  var loop=1;
  if(symmetry!=0){
    angle= 360 / symmetry;
    loop=symmetry;
  }
  translate(width / 2, height / 2);

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let pmx = pmouseX - width / 2;
    let pmy = pmouseY - height / 2;

    if (mouseIsPressed) {
      for (let i = 0; i < loop; i++) {
        rotate(angle/360*2*PI);
        stroke(200,120,50);
        strokeWeight(2);
        switch(uiLineType.getValue()){
          case '0':
            Brush0(mx,my,pmx,pmy);
            if(symmetry!=0)Brush0(-mx,my,-pmx,pmy);
            break;
          case '1'://虚线
            Brush1(mx,my,pmx,pmy);
            if(symmetry!=0)Brush1(-mx,my,-pmx,pmy);
            break;
          case '2'://荧光笔-》橡皮
            Brush2(mx,my,pmx,pmy);
            if(symmetry!=0)Brush2(-mx,my,-pmx,pmy);
            break;
          break;
          case '3'://铅笔
            Brush3(mx,my,pmx,pmy);
            if(symmetry!=0)Brush3(-mx,my,-pmx,pmy);
            break;
          case '4'://立体
            Brush4(mx,my,pmx,pmy);
            if(symmetry!=0)Brush4(-mx,my,-pmx,pmy);
            break;
          case '5'://气泡
            Brush5(mx,my,pmx,pmy);
            if(symmetry!=0)Brush5(-mx,my,-pmx,pmy);
            break;
          case '6'://雪花
            Brush6(mx,my,pmx,pmy);
            if(symmetry!=0)Brush6(-mx,my,-pmx,pmy);
            break;
          case '7'://花朵
            Brush7(mx,my,pmx,pmy);
            if(symmetry!=0)Brush7(-mx,my,-pmx,pmy);
            break;
          default:break;
        }
      }
    }
  }
  switch(uiGraphType.getValue()){
    case '1':
      branches.forEach(branch => branch.update());
    break;
    case '2':
      break;
    case '3':break;
    default:break;
  }
  pop();
  //translate(0,0,-10*deep-5);
  //
}
function Brush0(mx,my,pmx,pmy){
  strokeWeight(uiWeight.getValue());
  stroke(uiColorHSB.getValue().h,uiColorHSB.getValue().s,uiColorHSB.getValue().v,uiOpacity.getValue());
  line(mx,my,pmx,pmy);
}
function Brush1(mx,my,pmx,pmy){
  var num=uiAmount.getValue()/50;
  var w=uiWeight.getValue();
  var res=2*floor(Math.sqrt(Math.pow(my-pmy,2)+Math.pow(mx-pmx,2))/w);
  var rate=1-randn;
  noStroke();  
  fill(uiColorHSB.getValue().h,uiColorHSB.getValue().s,uiColorHSB.getValue().v,uiOpacity.getValue()); 
  for(var i=0;i<res;i++)
  {
    linej++;
    var t=i/res;
    var x=(mx-pmx)/res*i+mx;
    var y=(my-pmy)/res*i+my;    
    if(linej<=num*rate)
      ellipse(x, y, w, w); 
    if(linej>num)
      linej=0;
  } 
}
function Brush2(mx,my,pmx,pmy){
  fill(255);
  noStroke();
  ellipse(mx,my,uiWeight.getValue()*5,uiWeight.getValue()*5);
}
function Brush3(mx,my,pmx,pmy){
  if(!(mx==pmx||my==pmy)){
    range*=5;
    for(var i = 0; i < range*range*5*randn/2; i++){   
    var rand1=  random(-range, range);
    var rand2=  random(-range, range);
    if((rand1*rand1+rand2*rand2)>range*range){
      i--;
      continue;
    }
    noStroke();      
    fill(uiColorHSB.getValue().h,uiColorHSB.getValue().s,uiColorHSB.getValue().v,uiOpacity.getValue());        
    ellipse(mx+rand1, my+rand2, 2, 2); 
    }
  }
}
function Brush4(mx,my,pmx,pmy){

  range*=5;
  for(var i = -uiWeight.getValue()*2; i < uiWeight.getValue()*2; i=i+2){            
    noStroke(); 
    fill(uiColorHSB.getValue().h,(i/uiWeight.getValue()/2*45+55)/100,1);     
    //fill(uiColorHSB.getValue().h,i/range/2*45+55,uiColorHSB.getValue().v,uiOpacity.getValue());       
    ellipse(mx, my-i, range/10+5, range/10+3); 
  }
}
function Brush5(mx,my,pmx,pmy){
  range*=5;
  randn*=10;
  noStroke(); 
  fill(color(random(min+20, max-20), 
    random(Math.max(uiColorHSB.getValue().s-0.3,0),Math.min(uiColorHSB.getValue().s+0.3,1)), 
  uiColorHSB.getValue().v,random(Math.max(uiOpacity.getValue()-0.2,0),Math.min(uiOpacity.getValue()+0.2),1)));
  var rand = random(0,1); 
  if(rand<0.45){ 
    var randR= random(range*0.5,range*1.5);
    var rand1= random(-randn*0.5, randn*0.5);
    var rand2= random(-randn*0.5, randn*0.5);   
    ellipse(mx+rand1, my+rand2, randR+2, randR+2); 
  }
}
function Brush6(mx,my,pmx,pmy){
  var w=uiWeight.getValue()/2;
  var rand = random(0,1);
  if(mx==pmx||my==pmy) return;
  if(rand<0.4){  
    translate(mx,my);
    rotate(random(0,360));
    strokeWeight(w);//设置雪花线宽
    stroke(uiColorHSB.getValue().h,uiColorHSB.getValue().s,uiColorHSB.getValue().v,uiOpacity.getValue());
    for(var i=0;i<6;i++)
    {
        line(0, 0, 0, 10 * w);
        line(-3 * w, 7.5 * w, 0, 5 * w);
        line(3 * w, 7.5 * w, 0, 5 * w);
        line(-2.5 * w, 5 * w, 0, 3 * w);
        line(-1 * w, 3.8 * w, -2 * w, 3 * w);
        rotate(PI / 3);//旋转60度，绘制下一片雪花（注意旋转的是坐标系，为了避免影响其他代码，最后需要旋转回去/或旋转一周）
    }
    translate(-mx, -my);//切换回原坐标系（左上角0.0为圆点）
  }
}
function Brush7(mx,my,pmx,pmy){
  var nei = [[320,0.2,1.0],[350,0.2,1.0],[60,0.2,1.0]];
  var nindex=parseInt(random(0,3));
  var rand = random(0,1); 
  if(rand<0.35){ 
    noStroke();
    translate(mx,my);
    rotate(random(0,360));
    fill(color(random(min, max), random(Math.max(uiColorHSB.getValue().s-0.3,0),Math.min(uiColorHSB.getValue().s+0.3,1)), 
    uiColorHSB.getValue().v,random(Math.max(uiOpacity.getValue()-0.2,0),Math.min(uiOpacity.getValue()+0.2),1)));
    var tmpr=3+range+random(-randn,randn);
    for(var i=1;i<=5;i++){
      ellipse(0,tmpr,tmpr,tmpr);
      rotate(72*PI/180);
    }
    fill(color(nei[nindex][0],nei[nindex][1],nei[nindex][2],random(uiOpacity.getValue(),Math.min(uiOpacity.getValue()+0.2),1)));
    ellipse(0,0,tmpr,tmpr);
  }
}


function rect_multi1_0114(x,cl){

  var num=21-(uiAmount.getValue())/150;
  var t = 53.1301024 / 360 * 2 * PI;
  noStroke();
  fill(uiColorHSB.getValue().h,uiColorHSB.getValue().s,uiColorHSB.getValue().v,cl);
  rect(0,0,x,x);
  
  if(x <= num) return 0;
  
  push();
  rotate(PI / 2 - t);
  translate(0,-x/5 * 3 - x/5*4);
  rect_multi1_0114(x/5*4,cl*0.8);
  pop();
  
  push();
  rotate( - t);
  translate(0,-x/5 * 3);
  rect_multi1_0114(x/5*3,cl*0.8);
  pop(); 
  
}

class Branch {
  constructor (x0,y0) {
    //this.v = [];
    this.life=uiLife.getValue();//100;
    this.x = mouseX;//width / 2;
    this.y = mouseY;//height;
    this.prevx = mouseX;//width / 2;
    this.prevy = mouseY;//height;
    this.color = color(random(uiColorHSB.getValue().h, uiColorHSB.getValue().h + 100), uiColorHSB.getValue().s,uiColorHSB.getValue().v,uiOpacity.getValue());
    //this.v.push({x: this.x, y: this.y });
    this.moving = true;
    this.direction = {
      x: random(-2, 2),
      y: random(-0.2, -5)
    };
  }
  draw () {
    push();
    blendMode(SCREEN);
    stroke(this.color);
    line(this.prevx, this.prevy, this.x, this.y);
    pop();
  }
  update () {
    this.life--;
    if (this.moving) {
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height||this.life<=0) {
        this.moving = false;
      }
      this.move();
      this.draw();
      this.prevx = this.x;
      this.prevy = this.y;
    }
  }
  move () {
    this.direction.x += (p.simplex3(this.x * 0.04 * uiRandom.getValue(), 
      this.y * 0.04 * uiRandom.getValue(), millis() * 0.0001));
    this.direction.y -= abs((p.simplex3(this.y * 0.01, this.x * 0.01, millis() * 0.0001))) * 0.2;
    this.x += this.direction.x;
    this.y += this.direction.y;
  }
}


const Options = function () {
  this.Opacity = 1;
  this.Weight = 3;
  this.Amount = window.innerWidth < 600 ? 400 : 1000;
  this.Random = 0.2;
  this.Life=50;
  this.Color = { h: 350, s: 0.6, v: 0.8 }; // Hue, saturation, value
  this.bgColor = { h: 200, s: 1.0, v: 0.5 }; // Hue, saturation, value
  this.LineType = '0';//{'普通':0,'虚线':1,'荧光笔':2,'铅笔':3,'立体':4,'气泡':5,'雪花':6,'花朵':7 } ;
  this.GraphType = '0';
  this.Deep= '0';//{'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9};
  this.ReDraw= '0';//{'无':0,'2次(左右)':1,'2次(上下)':2,'4次':3,'6次':4,'8次':5};
  this.MoveBackGround=false;
  this.Save=function saveAll(){
    save("输出_画布.png");
  };
  this.ClearAll=function clearAll(){
    background(255);
    DrawBackground();
  };
  this.ClearThis=function clearThis(){};
};
function changeType1(){
  if(uiGraphType.getValue()!='0')
      uiLineType.setValue('10');
  
  reset();
}
function changeType2(){
  
  if(uiLineType.getValue()!='10')
      uiGraphType.setValue('0');
  reset();
}
function changeBG(){
  DrawBackground();
}
const options = new Options();
const gui = new dat.GUI();
const uiLineType=gui.add(options, 'LineType', {'无':10,'普通':0,'虚线':1,'铅笔':3,'立体':4,'气泡':5,'雪花':6,'花朵':7 ,'橡皮':2,} );
const uiGraphType=gui.add(options, 'GraphType', {'无':0,'线组':1,'树':2,'花朵':3});
const f1=gui.addFolder("基本属性");
const uiColorHSB = f1.addColor(options, 'Color');
const uiOpacity=f1.add(options, 'Opacity',0,1,0.01);

const uiWeight = f1.add(options, 'Weight', 1, 10, 1);
const uiAmount = f1.add(options, 'Amount', 10, 3000, 50);
const uiRandom = f1.add(options, 'Random', 0, 1, 0.01);
const uiLife = f1.add(options, 'Life', 10, 150, 5);
var f2=gui.addFolder("高级设置");
const uiMove=f2.add(options,'MoveBackGround');
const uibgColorHSB = f2.addColor(options, 'bgColor');
f2.add(options,'Deep',{'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9});
const uiReDraw = f2.add(options,'ReDraw',{'1次':0,'2次':1,'4次':2,'6次':3,'8次':4,'10次':5,'12次':6});
//自动绘制
//画布深度
var f3=gui.addFolder("画布操作");
f3.add(options, 'Save');
f3.add(options, 'ClearThis');
f3.add(options, 'ClearAll');
//保存
//清楚本层
//清除全部
uibgColorHSB.onChange(changeBG);
uiGraphType.onChange(changeType1);
uiLineType.onChange(changeType2);
uiWeight.onChange(reset);
uiAmount.onChange(reset);
uiRandom.onChange(reset);
uiLife.onChange(reset);
uiColorHSB.onChange(reset);
uiOpacity.onChange(reset);
gui.close();


