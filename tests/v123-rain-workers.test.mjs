import test from 'node:test';
import assert from 'node:assert/strict';
import {rainWorkRoute,workRoute} from '../src/world/NpcWorkRoutes.js';
import {SAVE_KEY} from '../src/systems/GameState.js';
test('chef and Kak Rani remain inside during rain with finite one-way routines',()=>{
 const chef=rainWorkRoute('chef'),rani=rainWorkRoute('rani');
 assert.equal(chef.length,2);assert.equal(rani.length,2);
 assert.deepEqual(chef.at(-1),{x:618,y:443,activity:'🍲 Menyiapkan pesanan di dapur',pause:3});
 assert.deepEqual(rani.at(-1),{x:690,y:177,activity:'📚 Menata buku di perpustakaan',pause:3});
 assert.notDeepEqual(chef[0],chef.at(-1));
 assert.notDeepEqual(rani[0],rani.at(-1));
 assert.ok(workRoute('chef',1).length>2);
 assert.ok(workRoute('rani',1).length>2);
 assert.equal(SAVE_KEY,'kampung-gizi-pixel-v02');
});
