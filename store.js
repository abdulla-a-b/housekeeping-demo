/* Clean My Area — store
   Device storage that never throws, plus the Apps Script push. */

/* ---------- storage that never throws ---------- */
const DB = (()=>{
  let mem={};
  const ok=(()=>{try{localStorage.setItem('_t','1');localStorage.removeItem('_t');return true}catch(e){return false}})();
  return{
    get(k,d){try{const v=ok?localStorage.getItem(k):mem[k];return v?JSON.parse(v):d}catch(e){return d}},
    set(k,v){const s=JSON.stringify(v);try{ok?localStorage.setItem(k,s):mem[k]=s}catch(e){mem[k]=s}}
  };
})();

let store = DB.get('cma', {roster:{}, inspections:[], vector:[], l1:{}});
const save = () => DB.set('cma', store);

/* ---------- Apps Script sync ---------- */
function push(type,payload){
  if(!API_URL)return;
  fetch(API_URL,{method:'POST',mode:'no-cors',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify({type,payload})}).catch(()=>{});
}
