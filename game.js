(() => {
  "use strict";
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const $ = id => document.getElementById(id);
  const ui = {
    score: $("score"), level: $("level"), wpm: $("wpm"), accuracy: $("accuracy"), lives: $("lives"),
    combo: $("combo"), comboFill: $("comboFill"), startScreen: $("startScreen"), pauseScreen: $("pauseScreen"),
    gameOverScreen: $("gameOverScreen"), startBtn: $("startBtn"), pauseBtn: $("pauseBtn"), resumeBtn: $("resumeBtn"),
    restartBtn: $("restartBtn"), soundBtn: $("soundBtn"), bestScore: $("bestScore"), finalScore: $("finalScore"),
    finalWpm: $("finalWpm"), finalAccuracy: $("finalAccuracy"), finalLevel: $("finalLevel"), newRecord: $("newRecord"), toast: $("toast")
  };
  const WORDS = window.DIGITANDO_WORDS;
  const TAU = Math.PI * 2;
  const MAX_LIVES = 3;
  const bestKey = "digitandoSpeedBestScore";
  let dpr = 1, width = 0, height = 0, lastTime = performance.now(), animationId = 0, toastTimer = 0, audio = null, muted = false;
  let enemies = [], stars = [], particles = [], lasers = [], shockwaves = [];
  const state = { mode:"menu", score:0, level:1, lives:MAX_LIVES, kills:0, correctChars:0, totalChars:0, streak:0, bestStreak:0, elapsed:0, spawnClock:0, target:null, shake:0, flash:0, lastLevel:1 };

  const formatNumber = n => Math.round(n).toLocaleString("pt-BR");
  const getBest = () => Number(localStorage.getItem(bestKey) || 0);
  ui.bestScore.textContent = formatNumber(getBest());

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }
  function createStars() {
    const count = Math.max(90, Math.floor(width * height / 9000));
    stars = Array.from({length:count}, () => ({x:Math.random()*width,y:Math.random()*height,size:Math.random()*1.7+.25,speed:Math.random()*14+5,alpha:Math.random()*.65+.18,layer:Math.random()}));
  }
  function hideOverlays() { ui.startScreen.classList.remove("visible"); ui.pauseScreen.classList.remove("visible"); ui.gameOverScreen.classList.remove("visible"); }
  function resetGame() {
    Object.assign(state,{mode:"playing",score:0,level:1,lives:MAX_LIVES,kills:0,correctChars:0,totalChars:0,streak:0,bestStreak:0,elapsed:0,spawnClock:.4,target:null,shake:0,flash:0,lastLevel:1});
    enemies=[]; particles=[]; lasers=[]; shockwaves=[]; hideOverlays(); updateHud(); showToast("MISSÃO INICIADA"); sfx("start");
  }
  function togglePause(force) {
    if (state.mode === "menu" || state.mode === "gameover") return;
    const pause = typeof force === "boolean" ? force : state.mode === "playing";
    if (pause && state.mode === "playing") { state.mode="paused"; ui.pauseScreen.classList.add("visible"); ui.pauseBtn.textContent="▶"; }
    else if (!pause && state.mode === "paused") { state.mode="playing"; ui.pauseScreen.classList.remove("visible"); ui.pauseBtn.textContent="Ⅱ"; lastTime=performance.now(); }
  }
  function endGame() {
    state.mode="gameover"; state.target=null;
    const wpm=getWpm(), accuracy=getAccuracy(), previous=getBest(), isRecord=state.score>previous;
    if (isRecord) localStorage.setItem(bestKey,String(Math.round(state.score)));
    ui.finalScore.textContent=formatNumber(state.score); ui.finalWpm.textContent=wpm; ui.finalAccuracy.textContent=`${accuracy}%`; ui.finalLevel.textContent=state.level;
    ui.newRecord.hidden=!isRecord; ui.bestScore.textContent=formatNumber(Math.max(previous,state.score)); ui.gameOverScreen.classList.add("visible"); ui.pauseBtn.textContent="Ⅱ"; sfx("gameover");
  }
  function getWpm(){ return state.elapsed<=1 ? 0 : Math.max(0,Math.round((state.correctChars/5)/(state.elapsed/60))); }
  function getAccuracy(){ return state.totalChars ? Math.round(state.correctChars/state.totalChars*100) : 100; }
  function getMultiplier(){ return Math.min(8,1+Math.floor(state.streak/15)); }
  function updateHud(){
    ui.score.textContent=formatNumber(state.score); ui.level.textContent=state.level; ui.wpm.textContent=getWpm(); ui.accuracy.textContent=`${getAccuracy()}%`;
    const mult=getMultiplier(); ui.combo.textContent=`x${mult}`; ui.comboFill.style.width=`${(state.streak%15)/15*100}%`; ui.lives.innerHTML="";
    for(let i=0;i<MAX_LIVES;i++){ const life=document.createElement("span"); life.className=`life${i>=state.lives?" off":""}`; ui.lives.appendChild(life); }
  }
  function wordPool(level){
    if(level<=2) return [...WORDS.easy,...WORDS.medium.slice(0,10)];
    if(level<=5) return [...WORDS.easy,...WORDS.medium];
    if(level<=8) return [...WORDS.medium,...WORDS.hard];
    if(level<=12) return [...WORDS.medium.slice(10),...WORDS.hard,...WORDS.expert.slice(0,5)];
    return [...WORDS.hard,...WORDS.expert];
  }
  function chooseWord(){
    const pool=wordPool(state.level);
    for(let i=0;i<12;i++){ const word=pool[Math.floor(Math.random()*pool.length)]; if(!enemies.some(e=>e.word===word&&e.y<height*.5)) return word; }
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function spawnEnemy(){
    if(width<1||height<1)return;
    const word=chooseWord(), margin=Math.min(145,Math.max(70,width*.1)), x=margin+Math.random()*Math.max(1,width-margin*2), base=18+state.level*2.35;
    enemies.push({id:`${Date.now()}-${Math.random()}`,word,typed:0,x,y:-40,speed:base*(.82+Math.random()*.34),radius:15+Math.min(word.length,14)*.45,phase:Math.random()*TAU,rot:Math.random()*TAU,rotSpeed:(Math.random()-.5)*.8,pulse:0,hit:0});
  }
  const spawnInterval=()=>Math.max(.72,2.25-state.level*.105);
  function damage(){
    state.lives--; state.streak=0; state.target=null; state.shake=12; state.flash=.34; sfx("damage"); updateHud();
    if(state.lives<=0) endGame(); else showToast("ESCUDO DANIFICADO");
  }
  function destroyEnemy(enemy){
    const i=enemies.indexOf(enemy); if(i>=0) enemies.splice(i,1); if(state.target===enemy) state.target=null;
    state.kills++; state.score+=Math.round((90+enemy.word.length*22+state.level*12)*getMultiplier()); state.level=1+Math.floor(state.kills/7);
    explosion(enemy.x,enemy.y,enemy.radius); shockwaves.push({x:enemy.x,y:enemy.y,r:5,alpha:.8}); sfx("destroy");
    if(state.level>state.lastLevel){state.lastLevel=state.level;showToast(`NÍVEL ${state.level}`);sfx("level");} updateHud();
  }
  function explosion(x,y,radius){
    const amount=15+Math.floor(radius/2);
    for(let i=0;i<amount;i++){const a=Math.random()*TAU,speed=35+Math.random()*135;particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:.35+Math.random()*.55,maxLife:.9,size:1+Math.random()*3,hue:Math.random()>.35?188:257});}
  }
  function shipPosition(){return{x:width/2,y:height-Math.max(78,Math.min(108,height*.105))};}
  function fireLaser(enemy){const ship=shipPosition();lasers.push({x1:ship.x,y1:ship.y-19,x2:enemy.x,y2:enemy.y,life:.13,maxLife:.13});enemy.hit=.15;enemy.pulse=.2;sfx("type");}
  function processKey(rawKey){
    if(state.mode!=="playing")return; const key=rawKey.toLocaleLowerCase("pt-BR"); if(!key||[...key].length!==1)return; state.totalChars++;
    if(!state.target||!enemies.includes(state.target)){const candidates=enemies.filter(e=>[...e.word][0].toLocaleLowerCase("pt-BR")===key).sort((a,b)=>b.y-a.y);state.target=candidates[0]||null;}
    const target=state.target;
    if(target){const expected=[...target.word][target.typed]?.toLocaleLowerCase("pt-BR");if(key===expected){target.typed++;state.correctChars++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);state.score+=6*getMultiplier();fireLaser(target);if(target.typed>=[...target.word].length)destroyEnemy(target);updateHud();return;}}
    state.streak=0;state.target=null;state.shake=Math.max(state.shake,2.5);sfx("error");updateHud();
  }
  function update(dt){
    updateStars(dt);updateEffects(dt);if(state.mode!=="playing")return;state.elapsed+=dt;state.spawnClock+=dt;
    if(state.spawnClock>=spawnInterval()){state.spawnClock=0;spawnEnemy();}
    for(const enemy of [...enemies]){enemy.phase+=dt*1.35;enemy.rot+=enemy.rotSpeed*dt;enemy.y+=enemy.speed*dt;enemy.x+=Math.sin(enemy.phase)*5.5*dt;enemy.hit=Math.max(0,enemy.hit-dt);enemy.pulse=Math.max(0,enemy.pulse-dt);
      if(enemy.y>height-64){explosion(enemy.x,height-66,enemy.radius);enemies.splice(enemies.indexOf(enemy),1);if(state.target===enemy)state.target=null;damage();if(state.mode!=="playing")break;}}
    state.shake=Math.max(0,state.shake-dt*28);state.flash=Math.max(0,state.flash-dt);updateHud();
  }
  function updateStars(dt){const m=state.mode==="playing"?1+Math.min(state.level*.025,.35):.35;for(const s of stars){s.y+=s.speed*m*dt;if(s.y>height+3){s.y=-3;s.x=Math.random()*width;}}}
  function updateEffects(dt){
    lasers=lasers.filter(l=>(l.life-=dt)>0);
    particles=particles.filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.985,dt*60);p.vy*=Math.pow(.985,dt*60);return p.life>0;});
    shockwaves=shockwaves.filter(s=>{s.r+=115*dt;s.alpha-=1.8*dt;return s.alpha>0;});
  }
  function draw(){
    ctx.save();ctx.clearRect(0,0,width,height);const sx=state.shake?(Math.random()-.5)*state.shake:0,sy=state.shake?(Math.random()-.5)*state.shake:0;ctx.translate(sx,sy);
    drawBackground();drawStars();drawLane();for(const e of enemies)drawEnemy(e);drawLasers();drawParticles();drawShip();drawTargetLink();
    if(state.flash>0){ctx.fillStyle=`rgba(251,113,133,${Math.min(.12,state.flash*.35)})`;ctx.fillRect(-20,-20,width+40,height+40);}ctx.restore();
  }
  function drawBackground(){const g=ctx.createRadialGradient(width/2,height*.72,0,width/2,height*.72,Math.max(width,height)*.72);g.addColorStop(0,"rgba(11,39,78,.16)");g.addColorStop(.48,"rgba(6,15,39,.1)");g.addColorStop(1,"rgba(2,5,16,0)");ctx.fillStyle=g;ctx.fillRect(0,0,width,height);}
  function drawStars(){for(const s of stars){ctx.globalAlpha=s.alpha;ctx.fillStyle=s.layer>.84?"#b8f4ff":"#93a7bf";ctx.fillRect(s.x,s.y,s.size,s.size*(1+s.layer*.8));}ctx.globalAlpha=1;}
  function drawLane(){const ship=shipPosition();ctx.save();ctx.strokeStyle="rgba(103,232,249,.035)";ctx.lineWidth=1;ctx.setLineDash([2,12]);ctx.beginPath();ctx.moveTo(ship.x,95);ctx.lineTo(ship.x,ship.y-40);ctx.stroke();ctx.restore();}
  function drawEnemy(e){
    const target=state.target===e;ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.rot);
    if(target){const halo=ctx.createRadialGradient(0,0,3,0,0,e.radius*3.1);halo.addColorStop(0,"rgba(103,232,249,.17)");halo.addColorStop(1,"rgba(103,232,249,0)");ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,e.radius*3.1,0,TAU);ctx.fill();}
    ctx.rotate(-e.rot);ctx.shadowBlur=e.hit>0?22:(target?14:5);ctx.shadowColor=target?"rgba(103,232,249,.9)":"rgba(111,129,160,.35)";ctx.fillStyle=e.hit>0?"rgba(191,248,255,.98)":"rgba(15,27,51,.96)";ctx.strokeStyle=target?"rgba(103,232,249,.78)":"rgba(129,152,184,.28)";ctx.lineWidth=target?1.4:1;
    ctx.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU-Math.PI/2,r=e.radius*(i%2?.86:1),px=Math.cos(a)*r,py=Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=target?"rgba(103,232,249,.8)":"rgba(133,151,176,.5)";ctx.beginPath();ctx.arc(0,0,2.4,0,TAU);ctx.fill();ctx.restore();drawWord(e,target);
  }
  function drawWord(e,target){
    const chars=[...e.word],typed=chars.slice(0,e.typed).join(""),rest=chars.slice(e.typed).join(""),fontSize=Math.max(14,Math.min(18,width/75));ctx.save();ctx.font=`800 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;ctx.textBaseline="middle";
    const tw=ctx.measureText(typed).width,rw=ctx.measureText(rest).width,total=tw+rw,x=e.x-total/2,y=e.y-e.radius-20;
    if(target){ctx.fillStyle="rgba(4,14,31,.74)";roundRect(x-9,y-fontSize/2-6,total+18,fontSize+12,7);ctx.fill();ctx.strokeStyle="rgba(103,232,249,.12)";ctx.stroke();}
    ctx.fillStyle=target?"#62dfee":"rgba(121,143,168,.7)";ctx.fillText(typed,x,y);ctx.fillStyle=target?"#edfaff":"#c4d0dd";ctx.fillText(rest,x+tw,y);ctx.restore();
  }
  function roundRect(x,y,w,h,r){const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();}
  function drawShip(){
    const{x,y}=shipPosition();ctx.save();ctx.translate(x,y);const engine=ctx.createRadialGradient(0,19,0,0,19,48);engine.addColorStop(0,"rgba(70,205,255,.34)");engine.addColorStop(1,"rgba(70,205,255,0)");ctx.fillStyle=engine;ctx.beginPath();ctx.arc(0,18,48,0,TAU);ctx.fill();ctx.shadowBlur=24;ctx.shadowColor="rgba(90,222,255,.34)";ctx.fillStyle="#d8f8ff";ctx.strokeStyle="rgba(103,232,249,.8)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(21,20);ctx.lineTo(8,14);ctx.lineTo(0,22);ctx.lineTo(-8,14);ctx.lineTo(-21,20);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle="#09233b";ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(6,8);ctx.lineTo(0,13);ctx.lineTo(-6,8);ctx.closePath();ctx.fill();ctx.fillStyle="#67e8f9";ctx.fillRect(-5,20,3,7);ctx.fillRect(2,20,3,7);ctx.restore();
  }
  function drawTargetLink(){if(!state.target||state.mode!=="playing")return;const ship=shipPosition();ctx.save();ctx.strokeStyle="rgba(103,232,249,.055)";ctx.setLineDash([3,8]);ctx.beginPath();ctx.moveTo(ship.x,ship.y-30);ctx.lineTo(state.target.x,state.target.y+16);ctx.stroke();ctx.restore();}
  function drawLasers(){for(const l of lasers){ctx.save();ctx.globalAlpha=Math.max(0,l.life/l.maxLife);ctx.strokeStyle="#78efff";ctx.shadowBlur=13;ctx.shadowColor="#67e8f9";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(l.x1,l.y1);ctx.lineTo(l.x2,l.y2);ctx.stroke();ctx.restore();}}
  function drawParticles(){for(const p of particles){const a=Math.max(0,Math.min(1,p.life/p.maxLife));ctx.fillStyle=`hsla(${p.hue},92%,70%,${a})`;ctx.fillRect(p.x,p.y,p.size,p.size);}for(const s of shockwaves){ctx.save();ctx.globalAlpha=s.alpha;ctx.strokeStyle="#79ecff";ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.stroke();ctx.restore();}}
  function loop(now){const dt=Math.min((now-lastTime)/1000,.05);lastTime=now;update(dt);draw();animationId=requestAnimationFrame(loop);}
  function showToast(text){ui.toast.textContent=text;ui.toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>ui.toast.classList.remove("show"),1150);}
  function ensureAudio(){if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==="suspended")audio.resume();}
  function tone(freq,duration,volume=.035,type="sine",slide=0){if(muted)return;ensureAudio();const t=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,t);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),t+duration);gain.gain.setValueAtTime(volume,t);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+duration);}
  function sfx(name){if(muted)return;try{if(name==="type")tone(500+Math.random()*80,.055,.018,"square",170);else if(name==="error")tone(145,.08,.025,"sawtooth",-50);else if(name==="destroy"){tone(260,.12,.025,"triangle",180);setTimeout(()=>tone(520,.08,.018,"sine",140),35);}else if(name==="damage")tone(110,.26,.045,"sawtooth",-45);else if(name==="level"){tone(420,.1,.028,"triangle",160);setTimeout(()=>tone(620,.15,.025,"triangle",220),90);}else if(name==="start"){tone(330,.12,.02,"sine",180);setTimeout(()=>tone(620,.18,.02,"sine",280),100);}else if(name==="gameover")tone(240,.5,.035,"triangle",-150);}catch(_){}}

  window.addEventListener("keydown",event=>{if(event.key==="p"||event.key==="P"||event.key==="Escape"){event.preventDefault();togglePause();return;}if(event.ctrlKey||event.metaKey||event.altKey)return;if(event.key.length===1){event.preventDefault();processKey(event.key);}},{passive:false});
  window.addEventListener("blur",()=>{if(state.mode==="playing")togglePause(true);}); window.addEventListener("resize",resize);
  ui.startBtn.addEventListener("click",resetGame); ui.restartBtn.addEventListener("click",resetGame); ui.resumeBtn.addEventListener("click",()=>togglePause(false)); ui.pauseBtn.addEventListener("click",()=>togglePause());
  ui.soundBtn.addEventListener("click",()=>{muted=!muted;ui.soundBtn.classList.toggle("muted",muted);ui.soundBtn.textContent=muted?"×":"♪";if(!muted)sfx("type");});
  resize();updateHud();cancelAnimationFrame(animationId);animationId=requestAnimationFrame(loop);
})();
