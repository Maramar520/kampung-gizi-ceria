// Kegiatan sekolah tersimpan dalam save lama, tanpa mengubah SAVE_KEY.
export class SchoolSystem{
 constructor(state){this.state=state;}
 get data(){const s=this.state.data;if(!s.school||typeof s.school!=='object')s.school={day:s.day,lessons:[],lunch:false,rewarded:false,completed:0};if(s.school.day!==s.day)s.school={day:s.day,lessons:[],lunch:false,rewarded:false,completed:s.school.completed||0};return s.school;}
 lesson(id){const d=this.data;if(!d.lessons.includes(id)){d.lessons.push(id);this.state.save();}return d.lessons.length;}
 lunch(){const d=this.data;if(d.lunch)return false;d.lunch=true;this.state.save();return true;}
 claim(){const d=this.data;if(d.rewarded||d.lessons.length<3||!d.lunch)return false;d.rewarded=true;d.completed++;this.state.data.coins=(this.state.data.coins||0)+45;this.state.save();return true;}
}
