import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
async function load(path){return import('data:text/javascript;base64,'+Buffer.from(readFileSync(new URL('../'+path,import.meta.url),'utf8')).toString('base64'));}
const {GardenSystem,normalizeGarden,CROPS}=await load('src/systems/GardenSystem.js');
const {CookingSystem,RECIPES,knownRecipe,missingFor}=await load('src/systems/CookingSystem.js');
const {inventoryView,recipeView,recipeCatalog,questView}=await load('src/ui/PlayerNotebook.js');
const state=()=>({data:{day:1,coins:300,energy:80,carb:40,protein:30,vitamin:25,recipeKnown:true,cooked:false,inventory:{beras:2,telur:2,bayam:2},garden:{seeds:3,plots:[null,null,null]}},save(){}});
test('semua tanaman memiliki konfigurasi benih dan durasi panen',()=>{
 assert.deepEqual(Object.keys(CROPS).sort(),['bayam','brokoli','kangkung','labu','selada','tomat','wortel']);
 assert.equal(CROPS.bayam.days,1);
 assert.equal(CROPS.wortel.days,2);
 assert.equal(CROPS.tomat.days,2);
 assert.equal(CROPS.kangkung.days,1);
 assert.equal(CROPS.selada.days,1);
 assert.equal(CROPS.brokoli.days,2);
 assert.equal(CROPS.labu.days,3);
});
test('save kebun v0.8 tetap mempertahankan bibit dan petak bayam',()=>{
 const g=normalizeGarden({seeds:7,plots:[{crop:'bayam',plantedDay:4,watered:true},null,null]});
 assert.equal(g.seedsByCrop.bayam,7);
 assert.equal(g.plots[0].crop,'bayam');
 assert.equal(g.plots[0].plantedDay,4);
});
test('wortel tomat dan kangkung dapat ditanam dan dipanen',()=>{
 const s=state(),g=new GardenSystem(s);
 for(const [index,crop] of ['wortel','tomat','kangkung'].entries()){
  assert.equal(g.plant(index,crop),true);
  assert.equal(g.water(index),true);
 }
 s.data.day=2;
 assert.equal(g.harvest(2),true);
 assert.equal(g.harvest(0),false);
 s.data.day=3;
 assert.equal(g.harvest(0),true);
 assert.equal(g.harvest(1),true);
 assert.equal(s.data.inventory.wortel,2);
 assert.equal(s.data.inventory.tomat,2);
 assert.equal(s.data.inventory.kangkung,2);
});
test('resep baru punya bahan sesuai tanaman dan mengurangi stok dengan aman',()=>{
 const s=state(),c=new CookingSystem(s);
 assert.equal(knownRecipe(s.data,'sup-wortel-tomat'),false);
 assert.equal(c.learn('sup-wortel-tomat'),true);
 assert.deepEqual(missingFor(s.data,'sup-wortel-tomat'),['wortel','tomat']);
 assert.equal(c.finishRecipe('sup-wortel-tomat'),false);
 s.data.inventory.wortel=1;s.data.inventory.tomat=1;
 const before=s.data.vitamin;
 assert.equal(c.finishRecipe('sup-wortel-tomat'),true);
 assert.equal(s.data.vitamin,before+24);
 assert.equal(s.data.inventory.wortel,0);
 assert.equal(s.data.inventory.tomat,0);
 assert.equal(s.data.cooked,false); // quest Bu Sari tidak terselesaikan oleh menu lain
});
test('buku resep dan quest utama tetap berlaku setelah tanaman ditambah',()=>{
 const s=state();
 assert.equal(recipeView(s.data).ready,true);
 assert.equal(questView(s.data).steps[1].done,true);
 assert.equal(inventoryView(s.data).length,7);
 assert.equal(recipeCatalog(s.data).length,5);
 assert.equal(recipeCatalog(s.data)[1].known,false);
 s.data.recipesKnown={'sup-wortel-tomat':true};
 assert.equal(recipeCatalog(s.data)[1].known,true);
 assert.equal(RECIPES['nasi-sayur-warna'].ingredients.length,4);
});
