// v1.9 — named work stations, reached through existing village roads.
// Reverse every path so looping NPCs never jump across a wall on wraparound.
const outAndBack=points=>[...points,...points.slice(0,-1).reverse()];
const point=(x,y,activity='',pause=0)=>({x,y,activity,pause});
export const WORK_ROUTES=Object.freeze({
 tani:[
  outAndBack([point(403,232),point(400,190),point(396,145,'🌱 Menyiram tanaman',2)]),
  outAndBack([point(403,232),point(401,218,'🐔 Memberi pakan ayam',2),point(401,192)]),
  outAndBack([point(403,232),point(399,180),point(396,145,'🥕 Memanen sayuran',2)]),
  [point(403,232),point(404,260),point(448,281),point(760,281),point(760,319),
   point(869,319),point(869,355),point(869,451),point(891,461,'🏠 Beristirahat',2)]
 ],
 sari:[
  outAndBack([point(448,281),point(448,318),point(211,318),point(211,355),
   point(211,374,'🧺 Berbelanja bahan sehat',2)]),
  outAndBack([point(448,281),point(448,319),point(607,319),point(607,352),
   point(607,370,'🍽️ Menyiapkan makanan sehat',2)]),
  outAndBack([point(448,281),point(448,318),point(211,318),point(211,355),
   point(211,374,'🧺 Memeriksa stok pasar',2)]),
  [point(448,281),point(760,281),point(760,319),point(869,319),
   point(869,355),point(869,451),point(851,461,'🏠 Beristirahat',2)]
 ],
 nia:[
  outAndBack([point(405,317),point(448,281),point(608,281),point(608,237),
   point(608,208),point(653,208,'📖 Membaca buku gizi',2)]),
  outAndBack([point(405,317),point(211,318),point(211,353),
   point(211,375,'🍎 Membantu pedagang pasar',2)]),
  outAndBack([point(405,317),point(448,281),point(608,281),point(608,237),
   point(608,208),point(653,208,'📚 Belajar bersama',2)]),
  outAndBack([point(405,317),point(448,281),point(608,281),
   point(608,237),point(608,208),point(653,208,'🌙 Membaca sebelum tidur',2)])
 ],
 chef:[
  outAndBack([point(618,468),point(618,443,'🍳 Menyiapkan makanan',2),
   point(663,443,'🍲 Memeriksa pesanan',2)]),
  outAndBack([point(618,468),point(662,455,'🥘 Menyajikan hidangan',2)]),
  outAndBack([point(618,468),point(664,440,'🧼 Membersihkan dapur',2)]),
  outAndBack([point(618,468),point(625,493,'🌙 Merapikan restoran',2)])
 ],
 rani:[
  outAndBack([point(692,207),point(690,177,'📚 Menata buku gizi',2)]),
  outAndBack([point(692,207),point(674,207,'📖 Membantu pembaca',2)]),
  outAndBack([point(692,207),point(690,177,'📚 Merapikan rak',2)]),
  outAndBack([point(692,207),point(692,189,'🌙 Menutup perpustakaan',2)])
 ]
});
export function workRoute(id,phase){return (WORK_ROUTES[id]?.[phase]||[]).map(p=>({...p}));}
