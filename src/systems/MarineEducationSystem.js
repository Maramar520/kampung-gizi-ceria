// v1.22: Edukasi laut dan bantuan Nelayan Bayu, ditambahkan tanpa mengubah SAVE_KEY.
export const MARINE_LESSONS=Object.freeze([
 {title:'🐢 Penyu dan Habitatnya',question:'Mengapa sampah plastik berbahaya bagi penyu?',answers:['Dapat tertelan atau menjerat penyu','Membuat air laut lebih segar','Membantu penyu berenang'],correct:0,explain:'Penyu dapat mengira plastik sebagai makanan. Bawa sampah kembali ke tempatnya.'},
 {title:'🪸 Terumbu Karang',question:'Apa manfaat terumbu karang?',answers:['Menyembunyikan sampah','Menjadi rumah dan tempat berlindung ikan','Menghilangkan semua ombak'],correct:1,explain:'Terumbu karang menyediakan tempat hidup bagi banyak spesies laut.'},
 {title:'🐟 Rantai Makanan Laut',question:'Apa contoh rantai makanan laut yang benar?',answers:['Ikan besar → plankton → ikan kecil','Plankton → ikan kecil → ikan besar','Karang → sampah → ikan'],correct:1,explain:'Plankton dimakan ikan kecil, lalu ikan kecil dapat dimakan ikan lebih besar.'}
]);
const safe=n=>Number.isSafeInteger(n)&&n>=0?n:0;
export class MarineEducationSystem{
 constructor(state){
  this.state=state;const raw=state.data.marineEducation||{};
  state.data.marineEducation={answered:Array.isArray(raw.answered)?[...new Set(raw.answered.filter(n=>Number.isInteger(n)&&n>=0&&n<MARINE_LESSONS.length))]:[],lastBayuHelpDay:safe(raw.lastBayuHelpDay),bayuHelpCount:safe(raw.bayuHelpCount)};
 }
 get data(){return this.state.data.marineEducation;}
 get lessons(){return MARINE_LESSONS.map((l,i)=>({...l,index:i,completed:this.data.answered.includes(i)}));}
 answer(index,choice){
  const lesson=MARINE_LESSONS[index];
  if(!lesson||choice!==lesson.correct)return {correct:false,reward:0};
  if(this.data.answered.includes(index))return {correct:true,reward:0};
  this.data.answered.push(index);this.state.data.coins+=10;this.state.save();
  return {correct:true,reward:10};
 }
 get canHelpBayu(){return this.data.lastBayuHelpDay!==this.state.data.day;}
 helpBayu(){
  if(!this.canHelpBayu)return false;
  this.data.lastBayuHelpDay=this.state.data.day;this.data.bayuHelpCount++;
  this.state.data.coins+=12;this.state.save();return true;
 }
}
