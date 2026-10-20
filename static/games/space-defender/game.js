(() => {
"use strict";
const W=480,H=720;
class Game extends Phaser.Scene {
 constructor(){super("Game");}
 create(){
  this.score=0;this.lives=3;this.wave=1;this.over=false;this.started=false;this.lastShot=0;this.spawnTimer=0;this.spawned=0;this.toSpawn=9;this.wavePause=0;this.invincible=0;
  this.stars=[];for(let i=0;i<105;i++){let s=this.add.circle(Math.random()*W,Math.random()*H,Math.random()*1.4+.4,0xbad9ff,Math.random()*.75+.15);s.speed=Math.random()*110+30;this.stars.push(s);}
  this.add.rectangle(W/2,28,W,56,0x071327,.92).setDepth(8);
  this.hud=this.add.text(16,17,"SKOR 000000",{fontFamily:"monospace",fontSize:"17px",color:"#70efff"}).setDepth(9);
  this.lifeText=this.add.text(W-16,17,"CAN ♥♥♥",{fontFamily:"monospace",fontSize:"17px",color:"#ff7ab6"}).setOrigin(1,0).setDepth(9);
  this.waveText=this.add.text(W/2,68,"DALGA 1",{fontFamily:"monospace",fontSize:"19px",color:"#ffdb70"}).setOrigin(.5);
  this.player=this.add.container(W/2,H-96).setDepth(5);
  this.player.add([this.add.triangle(0,-8,0,47,21,-17,42,47,0x47e5f7).setStrokeStyle(2,0xffffff),this.add.triangle(0,0,0,30,12,54,24,30,0x6471ff),this.add.circle(0,6,6,0xffffff)]);
  this.bullets=this.add.group();this.enemies=this.add.group();this.particles=this.add.group();
  this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,ENTER");
  this.pointerTarget=null;
  this.input.on("pointerdown",p=>{if(this.over){this.scene.restart();return;}if(!this.started){this.started=true;this.overlay.setVisible(false);}this.pointerTarget={x:p.x,y:p.y};});
  this.input.on("pointermove",p=>{if(p.isDown)this.pointerTarget={x:p.x,y:p.y};});
  this.input.on("pointerup",()=>{this.pointerTarget=null;});
  this.overlay=this.add.container(W/2,H/2).setDepth(20);
  const shade=this.add.rectangle(0,0,W,H,0x030817,.82).setInteractive();
  const title=this.add.text(0,-155,"ORIONIS",{fontFamily:"monospace",fontSize:"47px",fontStyle:"bold",color:"#6ceeff"}).setOrigin(.5);
  const sub=this.add.text(0,-95,"SPACE DEFENDER",{fontFamily:"monospace",fontSize:"23px",color:"#ff70c9"}).setOrigin(.5);
  const guide=this.add.text(0,-18,"WASD / OK TUŞLARI: HAREKET\nSPACE: ATEŞ\n\nMOBİL: PARMAĞINLA YÖNET\nOTOMATİK ATEŞ",{fontFamily:"monospace",fontSize:"16px",align:"center",lineSpacing:12,color:"#e1eafc"}).setOrigin(.5);
  const btn=this.add.text(0,136,"▶ BAŞLAT",{fontFamily:"monospace",fontSize:"26px",color:"#ffe57c",backgroundColor:"#233854",padding:{x:20,y:13}}).setOrigin(.5);
  this.overlay.add([shade,title,sub,guide,btn]);
  this.input.keyboard.on("keydown-ENTER",()=>{if(this.over){this.scene.restart();}else if(!this.started){this.started=true;this.overlay.setVisible(false);}});
  this.input.keyboard.on("keydown-SPACE",()=>{if(!this.started&&!this.over){this.started=true;this.overlay.setVisible(false);}});
 }
 shoot(t){
  if(t-this.lastShot<180)return;this.lastShot=t;
  const b=this.add.rectangle(this.player.x,this.player.y-27,5,23,0xa6ffff).setStrokeStyle(1,0xffffff);
  b.vy=-660;this.bullets.add(b);
 }
 spawn(){
  const x=28+Math.random()*(W-56),kind=Math.random();
  const e=this.add.container(x,-34);
  let hp=kind>.88?3:kind>.62?2:1; e.hp=hp;e.speed=(75+this.wave*13)+(Math.random()*42);e.phase=Math.random()*6.28;e.wobble=15+Math.random()*23;e.baseX=x;
  const c=hp===3?0xfd8b57:hp===2?0xff75c6:0xa58cff;
  e.add([this.add.triangle(0,0,0,0,22,32,44,0,c).setStrokeStyle(2,0xffffff),this.add.rectangle(0,-4,12,15,0x1c2244)]);
  e.value=hp*100;this.enemies.add(e);
 }
 burst(x,y,color,count=12){
  for(let i=0;i<count;i++){let p=this.add.circle(x,y,Math.random()*3+1,color);p.vx=(Math.random()-.5)*260;p.vy=(Math.random()-.5)*260;p.ttl=350+Math.random()*350;this.particles.add(p);}
 }
 hitPlayer(){
  if(this.invincible>0||this.over)return;this.lives--;this.invincible=1400;this.burst(this.player.x,this.player.y,0x5eefff,28);
  this.lifeText.setText("CAN "+"♥".repeat(Math.max(0,this.lives)));
  if(this.lives<=0){
   this.over=true;this.started=false;
   this.overlay.setVisible(true);
   this.overlay.list[1].setText("OYUN BİTTİ").setFontSize(39);
   this.overlay.list[2].setText("SKOR: "+this.score).setFontSize(23);
   this.overlay.list[3].setText("YENİDEN OYNAMAK İÇİN\nENTER'A BAS VEYA DOKUN");
   this.overlay.list[4].setText("↻ TEKRAR OYNA");
  }
 }
 update(t,dt){
  const s=Math.min(dt/1000,.05);
  for(const star of this.stars){star.y+=star.speed*s;if(star.y>H){star.y=0;star.x=Math.random()*W;}}
  this.particles.getChildren().slice().forEach(p=>{p.x+=p.vx*s;p.y+=p.vy*s;p.ttl-=dt;p.alpha=Math.max(0,p.ttl/700);if(p.ttl<=0)p.destroy();});
  if(!this.started||this.over)return;
  let dx=0,dy=0,k=this.keys;
  if(k.A.isDown||k.LEFT.isDown)dx--;if(k.D.isDown||k.RIGHT.isDown)dx++;if(k.W.isDown||k.UP.isDown)dy--;if(k.S.isDown||k.DOWN.isDown)dy++;
  if(dx||dy){let m=Math.hypot(dx,dy);this.player.x+=dx/m*340*s;this.player.y+=dy/m*340*s;this.pointerTarget=null;}
  else if(this.pointerTarget){this.player.x+=Phaser.Math.Clamp(this.pointerTarget.x-this.player.x,-420*s,420*s);this.player.y+=Phaser.Math.Clamp(this.pointerTarget.y-this.player.y,-420*s,420*s);}
  this.player.x=Phaser.Math.Clamp(this.player.x,23,W-23);this.player.y=Phaser.Math.Clamp(this.player.y,98,H-32);
  this.invincible=Math.max(0,this.invincible-dt);this.player.alpha=this.invincible>0?(Math.floor(t/85)%2?.35:1):1;
  if(k.SPACE.isDown||this.pointerTarget)this.shoot(t);
  this.spawnTimer-=dt;if(this.spawned<this.toSpawn&&this.spawnTimer<=0){this.spawn();this.spawned++;this.spawnTimer=Math.max(270,850-this.wave*55);}
  const bullets=this.bullets.getChildren().slice(), enemies=this.enemies.getChildren().slice();
  for(const b of bullets){b.y+=b.vy*s;if(b.y<0){b.destroy();continue;}
   for(const e of enemies){if(!e.active||!b.active)continue;if(Math.abs(b.x-e.x)<25&&Math.abs(b.y-e.y)<26){b.destroy();e.hp--;this.burst(b.x,b.y,0xffd88a,4);if(e.hp<=0){this.score+=e.value;this.hud.setText("SKOR "+String(this.score).padStart(6,"0"));this.burst(e.x,e.y,0xff79cb,15);e.destroy();}break;}}
  }
  for(const e of enemies){if(!e.active)continue;e.y+=e.speed*s;e.phase+=s*2.2;e.x=Phaser.Math.Clamp(e.baseX+Math.sin(e.phase)*e.wobble,24,W-24);
   if(e.y>H+40){e.destroy();this.hitPlayer();}
   else if(Math.abs(e.x-this.player.x)<31&&Math.abs(e.y-this.player.y)<31){e.destroy();this.hitPlayer();}
  }
  if(this.spawned>=this.toSpawn&&this.enemies.countActive()===0){this.wavePause+=dt;if(this.wavePause>1400){this.wave++;this.spawned=0;this.toSpawn=9+this.wave*3;this.wavePause=0;this.waveText.setText("DALGA "+this.wave);this.time.delayedCall(1300,()=>{if(this.waveText.active)this.waveText.setText("");});}}
 }
}
new Phaser.Game({type:Phaser.AUTO,parent:"game",width:W,height:H,backgroundColor:"#070e22",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Game],render:{pixelArt:false,antialias:true}});
})();