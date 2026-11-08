// v1.41: simulasi kesehatan anak; tidak menilai BMI atau berat ideal.
export class HealthClinicSystem {
 constructor(state){this.state=state;this.ensure();}
 ensure(){const d=this.state.data;if(!d.clinic||typeof d.clinic!=='object')d.clinic={day:d.day,checked:false,learned:false,helped:false,claimed:false,visits:0};if(d.clinic.day!==d.day)d.clinic={day:d.day,checked:false,learned:false,helped:false,claimed:false,visits:d.clinic.visits||0};return d.clinic;}
 get progress(){const c=this.ensure();return Number(c.checked)+Number(c.learned)+Number(c.helped);}
 mark(key){const c=this.ensure();if(!c[key]){c[key]=true;if(key==='checked')c.visits++;this.state.save();}return this.progress;}
 claim(){const c=this.ensure();if(this.progress<3||c.claimed)return false;c.claimed=true;this.state.data.coins=(this.state.data.coins||0)+35;this.state.data.energy=Math.min(100,(this.state.data.energy||0)+10);this.state.save();return true;}
}
