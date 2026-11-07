const C={grass:0x91c881,road:0xe8d1a4,wall:0x986e57};
export function createTextures(scene){
 const g=scene.make.graphics({x:0,y:0},false);
 const r=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h)};
 const characters=[
  ['player',0x77a6da,0x554135,0xf3c69e,false],
  ['sari',0xd98e7b,0x654634,0xeabd94,false],
  ['chef',0xe9e5d6,0x654b36,0xf0c49c,true]
 ];
 // Sprites are generated at runtime: 4 directions, two alternating walking poses.
 for(const [name,shirt,hair,skin,chefHat] of characters){
  for(const direction of ['down','up','side']){
   for(const frame of [0,1,2]){
    g.clear();
    const moving=frame!==0,leg=frame===1?2:-2;
    r(4,42,24,3,0x5c8d65); // soft pixel shadow
    // Boots and legs alternate on each step so NPCs really walk.
    r(9+(moving?leg:0),35,7,9,0x5c677e);
    r(19-(moving?leg:0),35,7,9,0x5c677e);
    r(7,22,21,15,shirt);
    r(5,24+(frame===1?2:0),5,11,skin);
    r(27,24+(frame===2?2:0),4,11,skin);
    r(8,5,20,20,skin);
    if(direction==='up'){
     r(7,1,22,15,hair);r(9,13,18,6,hair);
    }else if(direction==='side'){
     r(8,1,20,9,hair);r(8,8,5,9,hair);
     r(22,16,3,3,0x4d3b31);r(27,17,3,3,skin);
    }else{
     r(7,1,22,8,hair);r(7,7,4,8,hair);r(25,7,4,8,hair);
     r(12,16,3,3,0x433831);r(22,16,3,3,0x433831);
     r(15,21,7,2,0xc08074);
    }
    if(chefHat){r(7,1,22,7,0xffffff);r(12,0,13,3,0xffffff);r(10,8,17,3,0xdde7dc)}
    g.generateTexture(name+'-'+direction+'-'+frame,36,48);
   }
  }
 }
 g.destroy();
}
export function buildWorld(scene){const g=scene.add.graphics().setDepth(-100);const r=(x,y,w,h,c)=>{g.fillStyle(c);g.fillRect(x,y,w,h)};const txt=(s,x,y,size=15,color='#425440')=>scene.add.text(x,y,s,{fontFamily:'monospace',fontSize:size+'px',fontStyle:'bold',color}).setOrigin(.5).setDepth(500);
 const border=(x,y,w,h,c,edge=0x5f7354)=>{r(x-3,y-3,w+6,h+6,edge);r(x,y,w,h,c)};
 function building(x,y,w,h,floor,wall){border(x,y,w,h,floor,0x9a725b);for(let px=x+12;px<x+w-8;px+=28)r(px,y+5,2,h-10,0xf9ebcd);r(x,y,w,12,wall);r(x,y,12,h,wall);r(x+w-12,y,12,h,wall);r(x,y+h-12,(w-52)/2,12,wall);r(x+(w+52)/2,y+h-12,(w-52)/2,12,wall);r(x+(w-52)/2,y+h-8,52,7,0xd2a67c)}
 r(0,0,960,600,C.grass);for(let x=0;x<960;x+=24)for(let y=0;y<600;y+=24)if((x*17+y*7)%11<4){r(x+5,y+8,3,6,0x7cb96e);r(x+12,y+13,2,4,0xb1d89a)}
 r(440,349,80,210,C.road);r(0,425,960,65,C.road);r(135,350,56,100,C.road);r(784,349,58,100,C.road);for(let i=0;i<12;i++)r(i*88,454,36,3,0xd7bb91);
 txt('KEBUN MINI',127,58,16);for(let j=0;j<3;j++)for(let i=0;i<5;i++){const x=43+i*32,y=78+j*30;r(x-8,y-5,23,21,0x9a7049);r(x-4,y,15,9,0x4b8e45);r(x+1,y-4,6,9,0x79b95d);if((i+j)%2===0)r(x+2,y-7,4,5,0xe88454)}
 building(258,90,364,265,0xf2dfb6,C.wall);txt('RUMAH PEMAIN',440,74,18);border(289,137,68,93,0x91afd0,0x627d9f);r(297,143,52,22,0xfff9ed);r(297,170,52,48,0xb6cce4);border(511,153,83,66,0xbfc9bc,0x82958b);r(522,161,22,22,0x536369);r(560,161,22,22,0x536369);txt('KOMPOR',553,240,12);border(423,250,86,53,0xb58b61,0x8b664c);r(437,263,20,14,0xf7f1df);r(473,263,20,14,0xf7f1df);r(385,125,58,30,0xb9d7a1);r(393,133,42,14,0x8db8cf);r(370,165,16,70,0xcfa77b);
 building(53,212,213,140,0xf1dcad,0x9e7051);txt('PASAR SEGAR',159,195,18);for(let i=0;i<7;i++)r(56+i*30,205,29,12,i%2?0xfff1ca:0xd98575);border(80,259,120,31,0xb2875e,0x825f47);for(let i=0;i<4;i++)r(89+i*25,250,17,14,i%2?0xe1bb73:0x78aa57);border(208,244,34,54,0x9ab37a,0x718b60);txt('BELANJA',155,327,12);
 building(703,211,210,140,0xf0d9c0,0xa36f55);txt('RESTORAN GIZI',809,195,18);for(let i=0;i<7;i++)r(706+i*29,204,28,12,i%2?0xffe8bb:0xc77d67);border(746,268,116,30,0xb77c52,0x8c5c43);r(760,256,18,12,0xc4c4bc);r(799,256,18,12,0xd9d5bf);r(838,256,18,12,0xa5bd9b);txt('CHEF BIMO',810,370,12);
 for(const [x,y] of [[660,98],[667,158],[927,98],[36,530],[914,535]]){r(x-7,y,14,30,0x97744d);r(x-23,y-19,46,36,0x4f9259);r(x-17,y-28,34,21,0x67a96c);r(x-8,y-34,18,12,0x80bc7b)}
 const walls=[{x:258,y:90,w:364,h:13},{x:258,y:90,w:13,h:265},{x:609,y:90,w:13,h:265},{x:258,y:343,w:156,h:12},{x:466,y:343,w:156,h:12},{x:53,y:212,w:213,h:12},{x:53,y:212,w:12,h:130},{x:253,y:212,w:12,h:130},{x:703,y:211,w:210,h:12},{x:703,y:211,w:12,h:140},{x:901,y:211,w:12,h:140}];
 const furniture=[{x:289,y:137,w:68,h:93},{x:511,y:153,w:83,h:66},{x:423,y:250,w:86,h:53},{x:80,y:259,w:120,h:31},{x:746,y:268,w:116,h:30}];return [...walls,...furniture]
}
