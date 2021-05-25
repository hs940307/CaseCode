// 获取DOM元素
var container = document.getElementsByClassName("container")[0];
var albumBox = document.getElementsByClassName("albumBox")[0];
var chest = document.getElementsByClassName("chest")[0];
var minbox = document.getElementsByClassName("minbox")[0];
var maxbox = document.getElementsByClassName("maxbox")[0];
var rose = document.getElementsByClassName("rose")[0];
// 创建canvas
var b = document.body;
var c = document.getElementsByTagName('canvas')[0];
var a = c.getContext('2d');
var timer;
with(m=Math)C=cos,S=sin,P=pow,R=random;
c.width=c.height=f=250;
h=-125;
function p(a,b,c){
  if(c>30)return[S(a*3.5)*(7.5+2.5/(.2+P(b*2,2)))-S(b)*25,b*f+25,312.5+C(a*3.5)*(7.5+2.5/(.2+P(b*2,2)))+b*200,a*1-b/2,a];
  A=a*2-1;B=b*2-1;
  if(A*A+B*B<1){
    if(c>21){
      n=(j=c&1)?5.9:3.8;
      o=.5/(a+.01)+C(b*62.5)*3-a*150;
      w=b*h;
      return[o*C(n)+w*S(n)+j*305-195,o*S(n)-w*C(n)+275-j*175,590+C(B+A)*49.5-j*150,.4-a*.1+P(1-B*B,-h*6)*.15-a*b*.4+C(a+b)/5+P(C((o*(a+1)+(B>0?w:-w))/12.5),15)*.1*(1-B*B),o/1e3+.7-o*w*3e-6]
    }
    if(c>16){
      c=c*1.16-.15;
      o=a*45-20;
      w=b*b*h;z=o*S(c)+w*C(c)+310;
      return[o*C(c)-w*S(c),14+C(B*.5)*49.5-b*b*b*30-z/2-h,z,(b*b*.3+P((1-(A*A)),7)*.15+.3)*b,b*.7]
    }
    o=A*(2-b)*(40-c*2);
    w=49.5-C(A)*60-C(b)*(-h-c*2.45)+C(P(1-b,7))*25+c*2;
    z=o*S(c)+w*C(c)+350;
    return[o*C(c)-w*S(c),B*49.5-C(P(b, 7))*25-c/3-z/1.35+225,z,(1-b/1.2)*.9
    +a*.1, P((1-b),10)/2+.05]
  }
}
function drawCanvas(){
  timer = setInterval('for(i=0;i<1e4;i++)if(s=p(R(),R(),i%46/.74)){z=s[2];x=~~(s[0]*f/z-h);y=~~(s[1]*f/z-h);if(!m[q=y*f+x]|m[q]>z)m[q]=z,a.fillStyle="rgb("+~(s[3]*h*2)+","+~(s[4]*h*2)+","+~((s[3]*s[3]*-80)*2)+")",a.fillRect(x,y,1,1)}',0)
}

// 动画执行
setAlbumAnimation();
// 动画周期轮询执行
setInterval(function(){
  setAlbumAnimation();
},70000)
// 动画设置
function setAlbumAnimation(){
  // 第一步，立体内外盒子顺时针转动
  rose.classList.add("none");
  chest.classList.add("none")
  albumBox.classList.remove("none");
  albumBox.classList.add("firstStep");
  // 第二步，外盒子扩大
  setTimeout(function(){
    albumBox.classList.remove("firstStep");
    albumBox.classList.add("secondStep");	
  },5000);
  // 第三步，外盒子转环形
  setTimeout(function(){
    container.classList.add("perspective");
    albumBox.classList.remove("secondStep");
    albumBox.classList.add("thridStep");	
  },10000)
  // 第四步，内盒子转环形并外盒子扩展
  setTimeout(function(){
    albumBox.classList.remove("thridStep");
    albumBox.classList.add("fourthStep");	
  },15000)
  // 第五步，内盒子扩展，玫瑰花向上运动
  setTimeout(function(){
    albumBox.classList.remove("fourthStep");
    albumBox.classList.add("fifthStep");	
    rose.classList.remove("none");
    drawCanvas();
  },20000)
  // 第六步，外盒子变内，内盒子变外，并组成太阳仪
  setTimeout(function(){
    rose.classList.add("none");
    clearInterval(timer);
    albumBox.classList.remove("fifthStep");
    albumBox.classList.add("sixthStep");	
  },30000)
  // 第七步，整个盒子Z轴旋转
  setTimeout(function(){
    albumBox.classList.remove("sixthStep");
    albumBox.classList.add("seventhStep");	
  },35000)
  // 第八步，内外盒子环形运动，内盒子逆时针转动
  setTimeout(function(){
    albumBox.classList.remove("seventhStep");
    albumBox.classList.add("eighthStep");	
  },45000)
  // 第九步，立体内外盒子顺时针转动
  setTimeout(function(){
    container.classList.remove("perspective");
    albumBox.classList.remove("eighthStep");
    albumBox.classList.add("ninthStep");	
  },50000)
  // 第十步，外盒子扩大
  setTimeout(function(){
    albumBox.classList.remove("ninthStep");
    albumBox.classList.add("tenthStep");	
  },55000)
  // 第十一步，立体相册隐藏，心形图片墙显示
  setTimeout(function(){
    albumBox.classList.remove("tenthStep");
    chest.classList.remove("none");
    albumBox.classList.add("none");
  },60000)
}
	