import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

async function load(path){
 const source=readFileSync(new URL('../'+path,import.meta.url),'utf8');
 return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
const {GardenSystem,normalizeGarden,plotStage,gardenView,PLOT_COUNT,STARTER_SEEDS}=await load('src/systems/GardenSystem.js');
const {CookingSystem}=await load('src/systems/CookingSystem.js');
const state=()=>({data:{day:1,coins:100,energy:80,carb:40,protein:30,vitamin:25,
 recipeKnown:false,cooked:false,inventory:{},garden:{seeds:3,plots:[null,null,null]}},save(){}});
test('migrasi data lama dan plot rusak menggunakan nilai aman',()=>{
 assert.equal(normalizeGarden(undefined).seeds,STARTER_SEEDS);
 assert.equal(normalizeGarden({seeds:-4,plots:[{crop:'unknown'}]}).plots.length,PLOT_COUNT);
 assert.equal(normalizeGarden({seeds:-4}).seeds,0);
 assert.equal(normalizeGarden({seeds:1.6,plots:[{crop:'bayam',plantedDay:2,watered:true}]}).seeds,1);
 assert.equal(plotStage(null,1),'empty');
});
test('tanam menggunakan bibit, tidak bisa menanam di petak terisi',()=>{
 const s=state();const garden=new GardenSystem(s);
 assert.equal(garden.plant(0),true);
 assert.equal(garden.view.seeds,2);
 assert.equal(garden.plant(0),false);
 assert.equal(garden.plant(99),false);
 assert.equal(garden.view.plots[0].stage,'dry');
});
test('bayam memerlukan air dan hari berikutnya sebelum dapat dipanen',()=>{
 const s=state(), garden=new GardenSystem(s);
 assert.equal(garden.plant(1),true);
 s.data.day=2;
 assert.equal(garden.view.plots[1].stage,'dry');
 assert.equal(garden.harvest(1),false);
 assert.equal(garden.water(1),true);
 assert.equal(garden.water(1),false);
 assert.equal(garden.view.plots[1].stage,'ready');
 assert.equal(garden.harvest(1),true);
 assert.equal(s.data.inventory.bayam,2);
 assert.equal(garden.view.seeds,3);
 assert.equal(garden.harvest(1),false);
});
test('bayam disiram pada hari tanam tetap harus menunggu besok',()=>{
 const s=state(),garden=new GardenSystem(s);
 garden.plant(0);garden.water(0);
 assert.equal(garden.view.plots[0].stage,'growing');
 assert.equal(garden.harvest(0),false);
 s.data.day=2;
 assert.equal(garden.view.plots[0].stage,'ready');
});
test('bibit tambahan tersedia di pasar tetapi tidak gratis',()=>{
 const s=state(), garden=new GardenSystem(s);
 assert.equal(garden.buySeeds(2),true);
 assert.equal(s.data.coins,90);
 assert.equal(garden.view.seeds,5);
 assert.equal(garden.buySeeds(100),false);
 assert.equal(s.data.coins,90);
});
test('hasil panen dapat langsung dipakai oleh resep dan quest lama',()=>{
 const s=state(),garden=new GardenSystem(s),cooking=new CookingSystem(s);
 garden.plant(0);garden.water(0);s.data.day++;
 assert.equal(garden.harvest(0),true);
 s.data.recipeKnown=true;s.data.inventory.beras=1;s.data.inventory.telur=1;
 assert.deepEqual(cooking.missing,[]);
 assert.equal(cooking.finish(),true);
 assert.equal(s.data.inventory.bayam,1);
 assert.equal(s.data.cooked,true);
});
