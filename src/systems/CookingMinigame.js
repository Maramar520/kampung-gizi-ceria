// Tiga interaksi memasak yang semuanya menerima input pemain.
// Tidak memotong bahan hingga ketiga tahap sukses.
export class CookingMinigame {
  constructor(scene) { this.scene=scene; this.timer=null; this.cleanupCallbacks=[]; this.finished=false; }
  bind(element,event,handler,options) { element.addEventListener(event,handler,options); this.cleanupCallbacks.push(()=>element.removeEventListener(event,handler,options)); }
  stop() {
    if(this.timer){this.timer.remove(false);this.timer=null;}
    for(const fn of this.cleanupCallbacks.splice(0))fn();
    this.finished=true;
  }
  mount(step,done,recipe=null){
    this.stop();
    this.finished=false;
    const root=document.getElementById('cookVisual');
    if(!root)return;
    const panel=(visual,instructions,buttonLabel)=>{
      root.innerHTML='<div class="mini-stage">'+
       '<div class="mini-art" id="miniArt" aria-hidden="true">'+visual+'</div>'+
       '<p id="miniInstruction">'+instructions+'</p>'+
       '<div class="mini-meter"><div id="miniFill"></div></div>'+
       '<p class="mini-count" id="miniCount" aria-live="polite"></p>'+
       '<button class="mini-button" id="miniButton" type="button">'+buttonLabel+'</button></div>';
    };
    const progress=n=>{const b=document.getElementById('miniFill');if(b)b.style.width=Math.max(0,Math.min(100,n))+'%';};
    const count=text=>{const b=document.getElementById('miniCount');if(b)b.textContent=text;};
    const finish=()=>{if(this.finished)return;this.stop();done();};
    if(step===0){
      panel('<span class="mini-food mini-wash">'+(recipe?.emoji||'🥬')+'</span><span class="mini-water">💧💧</span>','Bersihkan bahan untuk '+(recipe?.name||'masakan')+' dengan 5 ketukan.','💦 Cuci bahan');
      let taps=0; count('0 / 5 bilasan');
      this.bind(document.getElementById('miniButton'),'click',()=>{
        if(this.finished)return;
        taps++; progress(taps*20);count(taps+' / 5 bilasan');
        const leaf=document.querySelector('.mini-wash');if(leaf){leaf.classList.remove('wobble');void leaf.offsetWidth;leaf.classList.add('wobble');}
        if(taps>=5)finish();
      });
    } else if(step===1){
      panel('<span class="mini-food mini-pot">🍲</span><span class="mini-steam">♨ ♨ ♨</span>','Tekan dan tahan tombol untuk memanaskan masakan.','✋ Tahan untuk memasak');
      let heat=0,holding=false;
      const button=document.getElementById('miniButton');
      const setHolding=v=>{holding=v;button.classList.toggle('is-holding',v);};
      count('Tekan dan tahan tombol');
      this.bind(button,'pointerdown',e=>{e.preventDefault();setHolding(true);try{button.setPointerCapture(e.pointerId);}catch{}});
      for(const name of ['pointerup','pointercancel','lostpointercapture'])this.bind(button,name,()=>setHolding(false));
      // Keyboard: tombol spasi / Enter di tombol tetap memegang progress.
      this.bind(button,'keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();setHolding(true);}});
      this.bind(button,'keyup',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();setHolding(false);}});
      this.timer=this.scene.time.addEvent({delay:50,loop:true,callback:()=>{
        if(this.finished)return;
        if(holding)heat=Math.min(100,heat+2.5);
        progress(heat);count('Memasak nasi: '+Math.floor(heat)+'%');
        if(heat>=100)finish();
      }});
    } else {
      // Indikator timing bergerak bolak-balik di area hijau.
      panel('<span class="mini-food mini-egg">🍳</span>','Tekan saat penanda masuk zona hijau sebanyak 2 kali.','🍳 Balik telur!');
      const stage=document.querySelector('.mini-stage');
      const timing=document.createElement('div');timing.className='timing-track';
      timing.innerHTML='<div class="timing-target"></div><div class="timing-marker" id="timingMarker"></div>';
      const button=document.getElementById('miniButton');
      stage.insertBefore(timing,button);
      let ticks=0,hits=0,miss=0;
      count('Tepat 0 / 2 · Coba saat garis masuk hijau');
      this.timer=this.scene.time.addEvent({delay:35,loop:true,callback:()=>{
        if(this.finished)return;
        ticks++; const pos=(Math.sin(ticks*.065)+1)*50;
        const marker=document.getElementById('timingMarker');
        if(marker)marker.style.left=pos+'%';
      }});
      this.bind(button,'click',()=>{
        if(this.finished)return;
        const pos=(Math.sin(ticks*.065)+1)*50;
        if(pos>=37&&pos<=63){hits++;progress(hits*50);count('Tepat '+hits+' / 2 ✨');}
        else{miss++;count('Belum pas ('+miss+' kali). Coba lagi saat zona hijau!');}
        if(hits>=2)finish();
      });
    }
  }
}
