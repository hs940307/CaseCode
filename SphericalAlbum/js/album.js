// 获取DOM元素
var divParent,
divChildList,
sortList = []
var container = document.getElementById("container");
// 背景烟花
function initVars(){
  pi=Math.PI;
  ctx=canvas.getContext("2d");
  canvas.width=canvas.clientWidth;
  canvas.height=canvas.clientHeight;
  cx=canvas.width/2;
  cy=canvas.height/2;
  playerZ=-25;
  playerX=playerY=playerVX=playerVY=playerVZ=pitch=yaw=pitchV=yawV=0;
  scale=600;
  seedTimer=0;seedInterval=5,seedLife=100;gravity=.02;
  seeds=new Array();
  sparkPics=new Array();
  sogg="https://cantelope.org/NYE/";
  for(i=1;i<=10;++i){
    sparkPic=new Image();
    sparkPic.src=sogg+"spark"+i+".png";
    sparkPics.push(sparkPic);
  }
  sparks=new Array();
  frames = 0;
}
function rasterizePoint(x,y,z){
  var p,d;
  x-=playerX;
  y-=playerY;
  z-=playerZ;
  p=Math.atan2(x,z);
  d=Math.sqrt(x*x+z*z);
  x=Math.sin(p-yaw)*d;
  z=Math.cos(p-yaw)*d;
  p=Math.atan2(y,z);
  d=Math.sqrt(y*y+z*z);
  y=Math.sin(p-pitch)*d;
  z=Math.cos(p-pitch)*d;
  var rx1=-1000,ry1=1,rx2=1000,ry2=1,rx3=0,ry3=0,rx4=x,ry4=z,uc=(ry4-ry3)*(rx2-rx1)-(rx4-rx3)*(ry2-ry1);
  if(!uc) return {x:0,y:0,d:-1};
  var ua=((rx4-rx3)*(ry1-ry3)-(ry4-ry3)*(rx1-rx3))/uc;
  var ub=((rx2-rx1)*(ry1-ry3)-(ry2-ry1)*(rx1-rx3))/uc;
  if(!z)z=.000000001;
  if(ua>0&&ua<1&&ub>0&&ub<1){
    return {
      x:cx+(rx1+ua*(rx2-rx1))*scale,
      y:cy+y/z*scale,
      d:Math.sqrt(x*x+y*y+z*z)
    };
  }else{
    return {
      x:cx+(rx1+ua*(rx2-rx1))*scale,
      y:cy+y/z*scale,
      d:-1
    };
  }
}
function spawnSeed(){
  seed=new Object();
  seed.x=-50+Math.random()*100;
  seed.y=25;
  seed.z=-50+Math.random()*100;
  seed.vx=.1-Math.random()*.2;
  seed.vy=-1.5;
  seed.vz=.1-Math.random()*.2;
  seed.born=frames;
  seeds.push(seed);
}
function splode(x,y,z){
  t=5+parseInt(Math.random()*150);
  sparkV=1+Math.random()*2.5;
  type=parseInt(Math.random()*3);
  switch(type){
    case 0:
      pic1=parseInt(Math.random()*10);
      break;
    case 1:
      pic1=parseInt(Math.random()*10);
      do{ pic2=parseInt(Math.random()*10); }while(pic2==pic1);
      break;
    case 2:
      pic1=parseInt(Math.random()*10);
      do{ pic2=parseInt(Math.random()*10); }while(pic2==pic1);
      do{ pic3=parseInt(Math.random()*10); }while(pic3==pic1 || pic3==pic2);
      break;
  }
  for(m=1;m<t;++m){
    spark=new Object();
    spark.x=x; spark.y=y; spark.z=z;
    p1=pi*2*Math.random();
    p2=pi*Math.random();
    v=sparkV*(1+Math.random()/6)
    spark.vx=Math.sin(p1)*Math.sin(p2)*v;
    spark.vz=Math.cos(p1)*Math.sin(p2)*v;
    spark.vy=Math.cos(p2)*v;
    switch(type){
      case 0: spark.img=sparkPics[pic1]; break;
      case 1:
        spark.img=sparkPics[parseInt(Math.random()*2)?pic1:pic2];
        break;
      case 2:
        switch(parseInt(Math.random()*3)){
          case 0: spark.img=sparkPics[pic1]; break;
          case 1: spark.img=sparkPics[pic2]; break;
          case 2: spark.img=sparkPics[pic3]; break;
        }
        break;
    }
    spark.radius=25+Math.random()*50;
    spark.alpha=1;
    spark.trail=new Array();
    sparks.push(spark);
  }
  d=Math.sqrt((x-playerX)*(x-playerX)+(y-playerY)*(y-playerY)+(z-playerZ)*(z-playerZ));
}
function doLogic(){
  if(seedTimer<frames){
    seedTimer=frames+seedInterval*Math.random()*10;
    spawnSeed();
  }
  for(i=0;i<seeds.length;++i){
    seeds[i].vy+=gravity;
    seeds[i].x+=seeds[i].vx;
    seeds[i].y+=seeds[i].vy;
    seeds[i].z+=seeds[i].vz;
    if(frames-seeds[i].born>seedLife){
      splode(seeds[i].x,seeds[i].y,seeds[i].z);
      seeds.splice(i,1);
    }
  }
  for(i=0;i<sparks.length;++i){
    if(sparks[i].alpha>0 && sparks[i].radius>5){
      sparks[i].alpha-=.01;
      sparks[i].radius/=1.02;
      sparks[i].vy+=gravity;
      point=new Object();
      point.x=sparks[i].x;
      point.y=sparks[i].y;
      point.z=sparks[i].z;
      if(sparks[i].trail.length){
        x=sparks[i].trail[sparks[i].trail.length-1].x;
        y=sparks[i].trail[sparks[i].trail.length-1].y;
        z=sparks[i].trail[sparks[i].trail.length-1].z;
        d=((point.x-x)*(point.x-x)+(point.y-y)*(point.y-y)+(point.z-z)*(point.z-z));
        if(d>9){
          sparks[i].trail.push(point);
        }
      }else{
        sparks[i].trail.push(point);
      }
      if(sparks[i].trail.length>5)sparks[i].trail.splice(0,1);
      sparks[i].x+=sparks[i].vx;
      sparks[i].y+=sparks[i].vy;
      sparks[i].z+=sparks[i].vz;
      sparks[i].vx/=1.075;
      sparks[i].vy/=1.075;
      sparks[i].vz/=1.075;
    }else{
      sparks.splice(i,1);
    }
  }
  p=Math.atan2(playerX,playerZ);
  d=Math.sqrt(playerX*playerX+playerZ*playerZ);
  d+=Math.sin(frames/80)/1.25;
  t=Math.sin(frames/200)/40;
  playerX=Math.sin(p+t)*d;
  playerZ=Math.cos(p+t)*d;
  yaw=pi+p+t;
}
function rgb(col){
  var r = parseInt((.5+Math.sin(col)*.5)*16);
  var g = parseInt((.5+Math.cos(col)*.5)*16);
  var b = parseInt((.5-Math.sin(col)*.5)*16);
  return "#"+r.toString(16)+g.toString(16)+b.toString(16);
}
function draw(){
  ctx.clearRect(0,0,cx*2,cy*2);
  ctx.fillStyle="#ff8";
  for(i=-100;i<100;i+=3){
    for(j=-100;j<100;j+=4){
      x=i;z=j;y=25;
      point=rasterizePoint(x,y,z);
      if(point.d!=-1){
        size=260/(1+point.d);
        d = Math.sqrt(x * x + z * z);
        a = 0.75 - Math.pow(d / 100, 6) * 0.75;
        if(a>0){
          ctx.globalAlpha = a;
          ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
        }
      }
    }
  }
  ctx.globalAlpha=1;
  for(i=0;i<seeds.length;++i){
    point=rasterizePoint(seeds[i].x,seeds[i].y,seeds[i].z);
    if(point.d!=-1){
      size=200/(1+point.d);
      ctx.fillRect(point.x-size/2,point.y-size/2,size,size);
    }
  }
  point1=new Object();
  for(i=0;i<sparks.length;++i){
    point=rasterizePoint(sparks[i].x,sparks[i].y,sparks[i].z);
    if(point.d!=-1){
      size=sparks[i].radius*200/(1+point.d);
      if(sparks[i].alpha<0)sparks[i].alpha=0;
      if(sparks[i].trail.length){
        point1.x=point.x;
        point1.y=point.y;
        switch(sparks[i].img){
          case sparkPics[0]:ctx.strokeStyle="#f84";break;
          case sparkPics[1]:ctx.strokeStyle="#84f";break;
          case sparkPics[2]:ctx.strokeStyle="#8ff";break;
          case sparkPics[3]:ctx.strokeStyle="#fff";break;
          case sparkPics[4]:ctx.strokeStyle="#4f8";break;
          case sparkPics[5]:ctx.strokeStyle="#f44";break;
          case sparkPics[6]:ctx.strokeStyle="#f84";break;
          case sparkPics[7]:ctx.strokeStyle="#84f";break;
          case sparkPics[8]:ctx.strokeStyle="#fff";break;
          case sparkPics[9]:ctx.strokeStyle="#44f";break;
        }
        for(j=sparks[i].trail.length-1;j>=0;--j){
          point2=rasterizePoint(sparks[i].trail[j].x,sparks[i].trail[j].y,sparks[i].trail[j].z);
          if(point2.d!=-1){
            ctx.globalAlpha=j/sparks[i].trail.length*sparks[i].alpha/2;
            ctx.beginPath();
            ctx.moveTo(point1.x,point1.y);
            ctx.lineWidth=1+sparks[i].radius*10/(sparks[i].trail.length-j)/(1+point2.d);
            ctx.lineTo(point2.x,point2.y);
            ctx.stroke();
            point1.x=point2.x;
            point1.y=point2.y;
          }
        }
      }
      ctx.globalAlpha=sparks[i].alpha;
      // ctx.drawImage(sparks[i].img,point.x-size/2,point.y-size/2,size,size);
    }
  }
}
function frame(){
  if(frames>100000){
    seedTimer=0;
    frames=0;
  }
  frames++;
  draw();
  doLogic();
  requestAnimationFrame(frame);
}
window.addEventListener("resize",()=>{
  canvas.width=canvas.clientWidth;
  canvas.height=canvas.clientHeight;
  cx=canvas.width/2;
  cy=canvas.height/2;
});
initVars();
frame();
// 动画设置
function setAlbumAnimation(){
  setStep(1);
  setTimeout(function(){
    setStep(2);
  },4000);
  setTimeout(function(){
    setStep(3);
  },9000)
  setTimeout(function(){
    setStep(4);
  },14000)
};
//添加文档碎片
function addOFragmeng(){
  var oFragmeng = document.createDocumentFragment(); 
  var divParent = document.createElement("div");
  divParent.classList.add("parent");
  for(var i=0;i<200;i++){ 
    var div = document.createElement("div");
    div.classList.add("child");
    var divImg = document.createElement("div");
    divImg.classList.add("child_img");
    div.appendChild(divImg); 
    divParent.appendChild(div); 
    sortList.push(i);
  }
  //先附加在文档碎片中
  oFragmeng.appendChild(divParent);  
  //最后一次性添加到container中
  container.appendChild(oFragmeng);
};
//设置步骤
function setStep(id){
  randomSort();
  if(id===1){
    divParent.classList.remove("parent_animation_fourth");
    divParent.classList.add("parent_animation_first");
    for (i=0,len=divChildList.length; i<len; i++) {
      var random = sortList[i];
      divChildList[random].firstChild.classList.remove("child_move");
      divChildList[random].style.transform = "translateX("+ ((i%20)-9.5)*60 +"px) translateY("+ ((Math.floor(i/20)-4.5)*60) +"px)";
    }
  }else if(id===2){
    divParent.classList.remove("parent_animation_first");
    divParent.classList.add("parent_animation_second");
    for (i=0,len=divChildList.length; i<len; i++) {
      var random = sortList[i];
      if(i<=6){
        setSphere(divChildList[random],i,1);
      }else if(i>6 && i<=18){
        setSphere(divChildList[random],i,2);
      }else if(i>18 && i<=36){
        setSphere(divChildList[random],i,3);
      }else if(i>36 && i<=58){
        setSphere(divChildList[random],i,4);
      }else if(i>58 && i<=84){
        setSphere(divChildList[random],i,5);
      }else if(i>84 && i<=114){
        setSphere(divChildList[random],i,6);
      }else if(i>114 && i<=140){
        setSphere(divChildList[random],i,7);
      }else if(i>140 && i<=162){
        setSphere(divChildList[random],i,8);
      }else if(i>162 && i<=180){
        setSphere(divChildList[random],i,9);
      }else if(i>180 && i<=192){
        setSphere(divChildList[random],i,10);
      }else if(i>192){
        setSphere(divChildList[random],i,11);
      }
    }
  }else if(id===3){
    divParent.classList.remove("parent_animation_second");
    divParent.classList.add("parent_animation_thrid");
    for (i=0,len=divChildList.length; i<len; i++) {
      var random = sortList[i];
      divChildList[random].style.transform = "rotateY(" + (i%36)*10 + "deg) translateY("+ (i-len/2)*2.5 +"px) translateZ(350px)";
    }
  }else{
    divParent.classList.remove("parent_animation_thrid");
    divParent.classList.add("parent_animation_fourth");
    for (i=0,len=divChildList.length; i<len; i++) {
      var random = sortList[i];
      divChildList[random].firstChild.classList.add("child_move");
      divChildList[random].style.transform = "translateX("+ (((Math.floor(i/8))%5 -2)*120) +"px) translateY("+ ((2-Math.floor(i/40))*120 + (Math.ceil(i%8)*2)) +"px) translateZ("+ ((4-Math.floor(i%8))*100) +"px)";
    }
  }
};
//设置球形位置
function setSphere(ele,i,rank){
  if(rank===1){
    var rotateX = 82-(i*10/7);
    var rotateY = i*360/7;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===2){
    var rotateX = 72-((i-7)*16/12);
    var rotateY = (i-7)*360/12;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===3){
    var rotateX = 56-((i-19)*16/18);
    var rotateY = (i-19)*360/18;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===4){
    var rotateX = 40-((i-37)*16/22);
    var rotateY = (i-37)*360/22;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===5){
    var rotateX = 24-((i-59)*16/26);
    var rotateY = (i-59)*360/26;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===6){
    var rotateX = 8-((i-85)*16/30);
    var rotateY = (i-85)*360/30;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===7){
    var rotateX = -8-((i-115)*16/26);
    var rotateY = (i-115)*360/26;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===8){
    var rotateX = -24-((i-141)*16/22);
    var rotateY = (i-141)*360/22;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===9){
    var rotateX = -40-((i-163)*16/18);
    var rotateY = (i-163)*360/18;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===10){
    var rotateX = -56-((i-181)*16/12);
    var rotateY = (i-181)*360/12;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }else if(rank===11){
    var rotateX = -72-((i-193)*10/7);
    var rotateY = (i-193)*360/7;
    ele.style.transform = "rotateY(" + rotateY + "deg) rotateX(" + rotateX + "deg) translateZ(300px)";
  }
};
//添加文档碎片
addOFragmeng();
divParent = document.getElementsByClassName("parent")[0];
divChildList = document.getElementsByClassName("child");

// 动画执行
setAlbumAnimation();
// 动画周期轮询执行
setInterval(function(){
  setAlbumAnimation();
},18000)
//数组随机排序
function randomSort(){
  sortList.sort(function(){
    return Math.random()-0.5;
  })
}

	