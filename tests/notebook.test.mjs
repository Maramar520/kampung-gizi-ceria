import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../src/ui/PlayerNotebook.js',import.meta.url),'utf8');
const {inventoryView,recipeView,questView,ITEM_INFO}=await import(
 'data:text/javascript;base64,'+Buffer.from(source).toString('base64')
);
const blank=()=>({inventory:{},coins:100,recipeKnown:false,cooked:false,done:false});
test('inventory starts empty but shows all three ingredients and price',()=>{
 const items=inventoryView(blank());
 assert.equal(items.length,7);
 assert.ok(items.every(i=>i.quantity===0));
 assert.equal(items.find(i=>i.id==='telur').price,15);
 assert.equal(ITEM_INFO.bayam.emoji,'🥬');
});
test('recipe is locked until Chef Bimo teaches it',()=>{
 const d=blank();
 assert.equal(recipeView(d).known,false);
 assert.equal(recipeView(d).canCook,false);
 d.recipeKnown=true;
 assert.equal(recipeView(d).known,true);
 assert.equal(recipeView(d).canCook,false);
 d.inventory={beras:1,telur:1,bayam:1};
 assert.equal(recipeView(d).ready,true);
 assert.equal(recipeView(d).canCook,true);
 d.cooked=true;
 assert.equal(recipeView(d).canCook,false);
});
test('quest journal has progress for all four steps, including consumed ingredients',()=>{
 const d=blank();
 let steps=questView(d).steps;
 assert.equal(steps.length,4);
 assert.ok(steps.every(x=>x.done===false));
 d.recipeKnown=true;
 d.inventory={beras:1,telur:1,bayam:1};
 steps=questView(d).steps;
 assert.deepEqual(steps.map(x=>x.done),[true,true,false,false]);
 d.cooked=true;
 d.inventory={beras:0,telur:0,bayam:0}; // cooking consumes ingredients
 assert.deepEqual(questView(d).steps.map(x=>x.done),[true,true,true,false]);
 d.cooked=false;d.done=true;
 assert.deepEqual(questView(d).steps.map(x=>x.done),[true,true,true,true]);
 assert.equal(questView(d).coinsReward,50);
});
test('notebook reads state without mutation',()=>{
 const d=blank();d.inventory={beras:2,telur:0,bayam:4};
 const before=JSON.stringify(d);
 inventoryView(d);recipeView(d);questView(d);
 assert.equal(JSON.stringify(d),before);
});
